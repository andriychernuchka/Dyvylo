import { Router } from "express";
import * as controller from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const profileRoutes = Router();

profileRoutes.use(requireAuth);
profileRoutes.get("/", controller.getProfile);
profileRoutes.patch("/", controller.updateProfile);
profileRoutes.put("/password", controller.changePassword);
