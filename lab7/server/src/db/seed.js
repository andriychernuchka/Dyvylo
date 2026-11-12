import bcrypt from "bcrypt";
import { config } from "../config.js";
import { MOCK_RELEASES, MOCK_EPISODES, STREAM_NODES } from "./seedData.js";

function minutesToSeconds(value) {
  const match = String(value).match(/(\d+)\s*хв/);
  return match ? Number(match[1]) * 60 : 0;
}

function timecodeToSeconds(value) {
  const [minutes, seconds] = String(value).split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

export function seedDatabase(db) {
  const now = new Date().toISOString();

  const insertTitle = db.prepare(`
    INSERT OR IGNORE INTO titles (
      id, title, title_uk, type, creator, year, genre, quality, rating,
      duration, duration_sec, bitrate, badge_text, studio, episodes_count,
      synopsis, poster, backdrop, tags, created_at
    ) VALUES (
      @id, @title, @titleUk, @type, @creator, @year, @genre, @quality, @rating,
      @duration, @durationSec, @bitrate, @badgeText, @studio, @episodesCount,
      @synopsis, @poster, @backdrop, @tags, @createdAt
    )
  `);

  for (const release of MOCK_RELEASES) {
    insertTitle.run({
      id: release.id,
      title: release.title,
      titleUk: release.titleUk,
      type: release.type,
      creator: release.creator,
      year: release.year,
      genre: release.genre,
      quality: release.quality,
      rating: release.rating,
      duration: release.duration,
      durationSec: minutesToSeconds(release.duration),
      bitrate: release.bitrate,
      badgeText: release.badgeText || null,
      studio: release.studio,
      episodesCount: release.episodesCount || null,
      synopsis: release.synopsis,
      poster: release.poster || null,
      backdrop: release.backdrop || null,
      tags: JSON.stringify(release.tags || []),
      createdAt: now,
    });
  }

  const insertEpisode = db.prepare(`
    INSERT OR IGNORE INTO episodes (
      id, title_id, num, title, duration, duration_sec, description, sort_order
    ) VALUES (
      @id, @titleId, @num, @title, @duration, @durationSec, @description, @sortOrder
    )
  `);

  MOCK_EPISODES.forEach((episode, index) => {
    insertEpisode.run({
      id: episode.id,
      titleId: "cyberpunk-edgerunners",
      num: episode.num,
      title: episode.title,
      duration: episode.duration,
      durationSec: timecodeToSeconds(episode.duration),
      description: episode.desc,
      sortOrder: index + 1,
    });
  });

  const insertMirror = db.prepare(`
    INSERT OR IGNORE INTO mirrors (id, name, ping, load, sort_order)
    VALUES (@id, @name, @ping, @load, @sortOrder)
  `);

  STREAM_NODES.forEach((mirror, index) => {
    insertMirror.run({
      id: mirror.id,
      name: mirror.name,
      ping: mirror.ping,
      load: mirror.load,
      sortOrder: index + 1,
    });
  });

  seedDemoUser(db);
}

function seedDemoUser(db) {
  const demoEmail = "operator@dyvylo.net";
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(demoEmail);

  if (existingUser) return;

  const now = new Date();
  const userId = "user_demo";

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    userId,
    "nick",
    demoEmail,
    bcrypt.hashSync("demo", config.bcryptRounds),
    now.toISOString(),
  );

  const addBookmark = db.prepare(`
    INSERT OR IGNORE INTO bookmarks (user_id, title_id, created_at)
    VALUES (?, ?, ?)
  `);

  ["blade-runner-2049", "cyberpunk-edgerunners", "akira"].forEach((titleId, index) => {
    addBookmark.run(
      userId,
      titleId,
      new Date(now.getTime() - index * 60_000).toISOString(),
    );
  });

  const upsertProgress = db.prepare(`
    INSERT OR IGNORE INTO watch_progress (
      user_id, title_id, episode_id, position_sec, duration_sec, completed, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  upsertProgress.run(
    userId,
    "cyberpunk-edgerunners",
    "ep-2",
    1512 * 0.75,
    1512,
    0,
    new Date(now.getTime() - 10 * 60_000).toISOString(),
  );

  upsertProgress.run(
    userId,
    "blade-runner-2049",
    "",
    42 * 60 + 18,
    164 * 60,
    0,
    new Date(now.getTime() - 60 * 60_000).toISOString(),
  );

  upsertProgress.run(
    userId,
    "ghost-in-the-shell",
    "",
    83 * 60,
    83 * 60,
    1,
    new Date(now.getTime() - 24 * 60 * 60_000).toISOString(),
  );

  db.prepare(`
    INSERT OR IGNORE INTO mirror_selections (user_id, title_id, mirror_id, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(
    userId,
    "blade-runner-2049",
    "uakino-proxy",
    now.toISOString(),
  );
}
