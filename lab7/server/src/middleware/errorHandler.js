import { ApiError } from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(new ApiError(404, `Маршрут ${req.method} ${req.originalUrl} не знайдено`));
}

export function errorHandler(error, _req, res, next) {
  if (res.headersSent) return next(error);

  let status = error.status || 500;
  let message = error.message || "Внутрішня помилка сервера";

  if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
    status = 409;
    message = "Запис уже існує";
  }

  if (status >= 500) {
    console.error("[server]", error);
  }

  const payload = { message };

  if (error.errors) payload.errors = error.errors;

  return res.status(status).json(payload);
}
