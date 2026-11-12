import { db } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { requiredString } from "../utils/validate.js";
import { getTitleRow, rowToTitle } from "./titles.service.js";

export function listBookmarks(userId) {
  const rows = db.prepare(`
    SELECT t.*
    FROM bookmarks b
    JOIN titles t ON t.id = b.title_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `).all(userId);

  return rows.map(rowToTitle);
}

export function addBookmark(userId, payload) {
  const titleId = requiredString(payload?.id ?? payload?.titleId, "id", {
    min: 1,
    max: 120,
  });

  const title = getTitleRow(titleId);

  if (!title) throw new ApiError(404, "Тайтл не знайдено");

  db.prepare(`
    INSERT OR IGNORE INTO bookmarks (user_id, title_id, created_at)
    VALUES (?, ?, ?)
  `).run(userId, titleId, new Date().toISOString());

  return rowToTitle(title);
}

export function removeBookmark(userId, titleId) {
  db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND title_id = ?").run(
    userId,
    titleId,
  );

  return { ok: true };
}

export function clearBookmarks(userId) {
  db.prepare("DELETE FROM bookmarks WHERE user_id = ?").run(userId);
}
