import { asyncHandler } from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);

  res.status(201).json(data);
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  res.json(data);
});

export function forgotPassword(req, res) {
  res.json(authService.forgotPassword(req.body));
}

export const resetPassword = asyncHandler(async (req, res) => {
  res.json(await authService.resetPassword(req.body));
});

export function me(req, res) {
  res.json(authService.me(req.user.id));
}

export function logout(_req, res) {
  res.status(204).end();
}
