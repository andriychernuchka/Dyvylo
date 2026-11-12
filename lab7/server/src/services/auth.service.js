import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { config } from "../config.js";
import { ApiError } from "../utils/ApiError.js";
import {
  requiredEmail,
  requiredPassword,
  requiredString,
} from "../utils/validate.js";

export function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );
}

export function getUserById(userId) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

  if (!user) throw new ApiError(404, "Користувача не знайдено");

  return user;
}

export async function register(payload) {
  const name = requiredString(payload?.name, "name", { min: 2, max: 50 });
  const email = requiredEmail(payload?.email);
  const password = requiredPassword(payload?.password);

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

  if (existing) {
    throw new ApiError(409, "Користувач з такою поштою вже існує", {
      email: "Ця пошта вже зареєстрована",
    });
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    password_hash: await bcrypt.hash(password, config.bcryptRounds),
    created_at: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, created_at)
    VALUES (@id, @name, @email, @password_hash, @created_at)
  `).run(user);

  return {
    token: signToken(user),
    user: toPublicUser(user),
  };
}

export async function login(payload) {
  const email = requiredEmail(payload?.email);
  const password = typeof payload?.password === "string" ? payload.password : "";

  if (!password) {
    throw new ApiError(400, "Вкажіть пароль", { password: "Пароль є обов'язковим" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new ApiError(401, "Невірна електронна пошта або пароль");
  }

  return {
    token: signToken(user),
    user: toPublicUser(user),
  };
}

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function forgotPassword(payload) {
  const email = requiredEmail(payload?.email);
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    throw new ApiError(404, "Користувача з такою поштою не знайдено", {
      email: "Ця пошта не зареєстрована",
    });
  }

  const now = new Date();
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(now.getTime() + RESET_TOKEN_TTL_MS).toISOString();

  // Remove expired and previous tokens, so only one reset link stays active.
  db.prepare("DELETE FROM password_resets WHERE expires_at <= ?").run(now.toISOString());
  db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(user.id);
  db.prepare(`
    INSERT INTO password_resets (id, user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    user.id,
    hashResetToken(resetToken),
    expiresAt,
    now.toISOString(),
  );

  return {
    message: "Токен відновлення створено. Він діє 15 хвилин.",
    resetToken,
    expiresAt,
  };
}

export async function resetPassword(payload) {
  const token = requiredString(payload?.token, "token", { min: 32, max: 256 });
  const newPassword = requiredPassword(payload?.newPassword, "newPassword");

  const reset = db
    .prepare("SELECT * FROM password_resets WHERE token_hash = ?")
    .get(hashResetToken(token));

  if (!reset || new Date(reset.expires_at).getTime() <= Date.now()) {
    if (reset) {
      db.prepare("DELETE FROM password_resets WHERE id = ?").run(reset.id);
    }

    throw new ApiError(400, "Токен недійсний або прострочений", {
      token: "Запросіть новий токен відновлення",
    });
  }

  getUserById(reset.user_id);

  const passwordHash = await bcrypt.hash(newPassword, config.bcryptRounds);

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    passwordHash,
    reset.user_id,
  );
  db.prepare("DELETE FROM password_resets WHERE user_id = ?").run(reset.user_id);

  return { ok: true };
}

export function me(userId) {
  return {
    user: toPublicUser(getUserById(userId)),
  };
}
