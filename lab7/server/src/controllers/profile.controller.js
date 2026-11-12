import { asyncHandler } from "../utils/asyncHandler.js";
import * as profileService from "../services/profile.service.js";

export function getProfile(req, res) {
  res.json(profileService.getProfile(req.user.id));
}

export function updateProfile(req, res) {
  res.json(profileService.updateProfile(req.user.id, req.body));
}

export const changePassword = asyncHandler(async (req, res) => {
  res.json(await profileService.changePassword(req.user.id, req.body));
});
