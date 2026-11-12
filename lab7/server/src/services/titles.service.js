import { db } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";

export function rowToTitle(row) {
  if (!row) return null;

  let tags = [];

  try {
    const parsed = JSON.parse(row.tags || "[]");
    if (Array.isArray(parsed)) tags = parsed;
  } catch {
    tags = [];
  }

  return {
    id: row.id,
    title: row.title,
    titleUk: row.title_uk,
    type: row.type,
    creator: row.creator,
    year: row.year,
    genre: row.genre,
    quality: row.quality,
    rating: row.rating,
    duration: row.duration,
    durationSec: row.duration_sec,
    bitrate: row.bitrate,
    badgeText: row.badge_text,
    studio: row.studio,
    episodesCount: row.episodes_count,
    synopsis: row.synopsis,
    poster: row.poster,
    backdrop: row.backdrop,
    tags,
    createdAt: row.created_at,
  };
}

export function getTitleRow(titleId) {
  return db.prepare("SELECT * FROM titles WHERE id = ?").get(titleId);
}

export function getTitle(titleId) {
  const row = getTitleRow(titleId);

  if (!row) throw new ApiError(404, "Тайтл не знайдено");

  return rowToTitle(row);
}

export function listTitles(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  const search = typeof query.search === "string" ? query.search.trim() : "";
  const type = typeof query.type === "string" ? query.type.trim() : "";

  const clauses = [];
  const values = [];

  if (search) {
    clauses.push("(title LIKE ? OR title_uk LIKE ? OR genre LIKE ? OR creator LIKE ?)");
    const pattern = `%${search}%`;
    values.push(pattern, pattern, pattern, pattern);
  }

  if (type && type !== "all") {
    clauses.push("type = ?");
    values.push(type);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

  const sortable = {
    rating: "rating",
    year: "year",
    title: "title",
    duration: "duration_sec",
    created: "created_at",
  };
  const sortColumn = sortable[query.sort] || "rating";
  const order = String(query.order).toLowerCase() === "asc" ? "ASC" : "DESC";

  const total = db
    .prepare(`SELECT COUNT(*) AS count FROM titles ${where}`)
    .get(...values).count;

  const rows = db.prepare(`
    SELECT * FROM titles
    ${where}
    ORDER BY ${sortColumn} ${order}, title ASC
    LIMIT ? OFFSET ?
  `).all(...values, limit, (page - 1) * limit);

  return {
    items: rows.map(rowToTitle),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function getEpisodes(titleId, userId = null) {
  const title = getTitleRow(titleId);

  if (!title) throw new ApiError(404, "Тайтл не знайдено");

  const rows = db.prepare(`
    SELECT
      e.*,
      COALESCE(wp.position_sec, 0) AS saved_position,
      COALESCE(wp.duration_sec, e.duration_sec) AS saved_duration,
      COALESCE(wp.completed, 0) AS completed
    FROM episodes e
    LEFT JOIN watch_progress wp
      ON wp.user_id = ?
      AND wp.title_id = e.title_id
      AND wp.episode_id = e.id
    WHERE e.title_id = ?
    ORDER BY e.sort_order ASC
  `).all(userId || "", titleId);

  return rows.map((row) => {
    const percent = row.saved_duration > 0
      ? Math.min(100, Math.round((row.saved_position / row.saved_duration) * 100))
      : 0;

    return {
      id: row.id,
      titleId: row.title_id,
      num: row.num,
      title: row.title,
      duration: row.duration,
      durationSec: row.duration_sec,
      desc: row.description,
      progress: row.completed ? 100 : percent,
      positionSec: row.saved_position,
      completed: Boolean(row.completed),
    };
  });
}

export function getTitleWithEpisodes(titleId, userId = null) {
  return {
    ...getTitle(titleId),
    episodes: getEpisodes(titleId, userId),
  };
}
