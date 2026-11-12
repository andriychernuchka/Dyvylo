import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { ApiError } from "../utils/ApiError.js";

function readPayload(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) return null;

  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}

export function requireAuth(req, _res, next) {
  const payload = readPayload(req);

  if (!payload) {
    return next(new ApiError(401, "Потрібна авторизація"));
  }

  req.user = {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };

  return next();
}

export function optionalAuth(req, _res, next) {
  const payload = readPayload(req);

  if (payload) {
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }

  return next();
}
