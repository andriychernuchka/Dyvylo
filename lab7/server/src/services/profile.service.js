import bcrypt from "bcrypt";
import { db } from "../db/index.js";
import { config } from "../config.js";
import { ApiError } from "../utils/ApiError.js";
import {
  requiredEmail,
  requiredPassword,
  requiredString,
} from "../utils/validate.js";
import { getUserById, toPublicUser } from "./auth.service.js";

export function getProfile(userId) {
  const user = getUserById(userId);

  const bookmarksCount = db
    .prepare("SELECT COUNT(*) AS count FROM bookmarks WHERE user_id = ?")
    .get(userId).count;

  const watched = db.prepare(`
    SELECT
      COALESCE(SUM(
        CASE
          WHEN duration_sec > 0 AND position_sec > duration_sec THEN duration_sec
          ELSE position_sec
        END
      ), 0) AS seconds,
      COALESCE(SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END), 0) AS completed
    FROM watch_progress
    WHERE user_id = ?
  `).get(userId);

  return {
    ...toPublicUser(user),
    stats: {
      bookmarksCount,
      watchedHours: Number((watched.seconds / 3600).toFixed(1)),
      completedCount: watched.completed,
      uptimePercent: 99.98,
    },
  };
}

export function updateProfile(userId, payload) {
  const current = getUserById(userId);

  const name = payload?.name === undefined
    ? undefined
    : requiredString(payload.name, "name", { min: 2, max: 50 });

  const email = payload?.email === undefined
    ? undefined
    : requiredEmail(payload.email);

  if (name === undefined && email === undefined) {
    throw new ApiError(400, "Немає полів для оновлення", {
      body: "Передайте name та/або email",
    });
  }

  if (email && email !== current.email) {
    const conflict = db
      .prepare("SELECT id FROM users WHERE email = ? AND id <> ?")
      .get(email, userId);

    if (conflict) {
      throw new ApiError(409, "Користувач з такою поштою вже існує", {
        email: "Ця пошта вже зареєстрована",
      });
    }
  }

  db.prepare(`
    UPDATE users
    SET name = COALESCE(?, name),
        email = COALESCE(?, email)
    WHERE id = ?
  `).run(name ?? null, email ?? null, userId);

  return getProfile(userId);
}

export async function changePassword(userId, payload) {
  const currentPassword = typeof payload?.currentPassword === "string"
    ? payload.currentPassword
    : "";
  const newPassword = requiredPassword(payload?.newPassword, "newPassword");

  if (!currentPassword) {
    throw new ApiError(400, "Вкажіть поточний пароль", {
      currentPassword: "Поточний пароль є обов'язковим",
    });
  }

  const user = getUserById(userId);
  const matches = await bcrypt.compare(currentPassword, user.password_hash);

  if (!matches) {
    throw new ApiError(400, "Поточний пароль невірний", {
      currentPassword: "Пароль не збігається",
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    passwordHash,
    userId,
  );

  return { ok: true };
}
