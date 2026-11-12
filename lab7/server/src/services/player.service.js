import { db } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { requiredNumber, requiredString } from "../utils/validate.js";
import { getTitleRow, rowToTitle } from "./titles.service.js";

function mapProgress(row) {
  if (!row) return null;

  const title = getTitleRow(row.title_id);

  if (!title) return null;

  const episode = row.episode_id
    ? db.prepare("SELECT * FROM episodes WHERE id = ? AND title_id = ?").get(
      row.episode_id,
      row.title_id,
    )
    : null;

  const durationSec = row.duration_sec || title.duration_sec || 0;
  const percent = durationSec > 0
    ? Math.min(100, Math.round((row.position_sec / durationSec) * 100))
    : 0;

  return {
    titleId: row.title_id,
    episodeId: row.episode_id || null,
    positionSec: row.position_sec,
    durationSec,
    completed: Boolean(row.completed),
    percent: row.completed ? 100 : percent,
    updatedAt: row.updated_at,
    title: rowToTitle(title),
    episode: episode
      ? {
        id: episode.id,
        num: episode.num,
        title: episode.title,
        duration: episode.duration,
        durationSec: episode.duration_sec,
        desc: episode.description,
      }
      : null,
  };
}

export function listProgress(userId, { limit = 20 } = {}) {
  const safeLimit = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20));

  const rows = db.prepare(`
    SELECT * FROM watch_progress
    WHERE user_id = ?
    ORDER BY updated_at DESC
    LIMIT ?
  `).all(userId, safeLimit);

  return rows.map(mapProgress).filter(Boolean);
}

export function getProgress(userId, titleId, episodeId) {
  const params = [userId, titleId];
  let sql = "SELECT * FROM watch_progress WHERE user_id = ? AND title_id = ?";

  if (episodeId !== undefined && episodeId !== null && episodeId !== "") {
    sql += " AND episode_id = ?";
    params.push(episodeId);
  }

  sql += " ORDER BY updated_at DESC LIMIT 1";

  return mapProgress(db.prepare(sql).get(...params));
}

export function saveProgress(userId, payload) {
  const titleId = requiredString(payload?.titleId, "titleId", { min: 1, max: 120 });
  const title = getTitleRow(titleId);

  if (!title) throw new ApiError(404, "Тайтл не знайдено");

  const episodeId = typeof payload?.episodeId === "string" && payload.episodeId
    ? payload.episodeId
    : "";

  if (episodeId) {
    const episode = db
      .prepare("SELECT id FROM episodes WHERE id = ? AND title_id = ?")
      .get(episodeId, titleId);

    if (!episode) throw new ApiError(404, "Епізод не знайдено");
  }

  const durationSec = requiredNumber(
    payload?.durationSec ?? title.duration_sec,
    "durationSec",
    { min: 0, max: 24 * 60 * 60 },
  );

  const rawPosition = requiredNumber(payload?.positionSec, "positionSec", {
    min: 0,
    max: 24 * 60 * 60,
  });

  const positionSec = durationSec > 0
    ? Math.min(rawPosition, durationSec)
    : rawPosition;

  const completed = payload?.completed === true
    || (durationSec > 0 && positionSec >= durationSec * 0.95);

  db.prepare(`
    INSERT INTO watch_progress (
      user_id, title_id, episode_id, position_sec, duration_sec, completed, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (user_id, title_id, episode_id) DO UPDATE SET
      position_sec = excluded.position_sec,
      duration_sec = excluded.duration_sec,
      completed = excluded.completed,
      updated_at = excluded.updated_at
  `).run(
    userId,
    titleId,
    episodeId,
    positionSec,
    durationSec,
    completed ? 1 : 0,
    new Date().toISOString(),
  );

  return getProgress(userId, titleId, episodeId || undefined);
}

export function deleteProgress(userId, titleId) {
  db.prepare("DELETE FROM watch_progress WHERE user_id = ? AND title_id = ?").run(
    userId,
    titleId,
  );

  return { ok: true };
}
