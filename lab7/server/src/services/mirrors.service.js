import { db } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { requiredString } from "../utils/validate.js";
import { getTitleRow } from "./titles.service.js";

function mapMirror(row) {
  return {
    id: row.id,
    name: row.name,
    ping: row.ping,
    load: row.load,
  };
}

export function listMirrors() {
  return db
    .prepare("SELECT * FROM mirrors ORDER BY sort_order ASC")
    .all()
    .map(mapMirror);
}

export function getSelection(userId, titleId) {
  if (!getTitleRow(titleId)) throw new ApiError(404, "Тайтл не знайдено");

  const row = db.prepare(`
    SELECT m.*
    FROM mirror_selections ms
    JOIN mirrors m ON m.id = ms.mirror_id
    WHERE ms.user_id = ? AND ms.title_id = ?
  `).get(userId, titleId);

  if (row) {
    return {
      titleId,
      mirrorId: row.id,
      mirror: mapMirror(row),
    };
  }

  const fallback = db
    .prepare("SELECT * FROM mirrors ORDER BY sort_order ASC LIMIT 1")
    .get();

  return {
    titleId,
    mirrorId: fallback?.id || null,
    mirror: fallback ? mapMirror(fallback) : null,
  };
}

export function setSelection(userId, titleId, payload) {
  if (!getTitleRow(titleId)) throw new ApiError(404, "Тайтл не знайдено");

  const mirrorId = requiredString(payload?.mirrorId, "mirrorId", {
    min: 1,
    max: 120,
  });

  const mirror = db.prepare("SELECT * FROM mirrors WHERE id = ?").get(mirrorId);

  if (!mirror) throw new ApiError(404, "Зеркало не знайдено");

  db.prepare(`
    INSERT INTO mirror_selections (user_id, title_id, mirror_id, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT (user_id, title_id) DO UPDATE SET
      mirror_id = excluded.mirror_id,
      updated_at = excluded.updated_at
  `).run(userId, titleId, mirrorId, new Date().toISOString());

  return {
    titleId,
    mirrorId: mirror.id,
    mirror: mapMirror(mirror),
  };
}
