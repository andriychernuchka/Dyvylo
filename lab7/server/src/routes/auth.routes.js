import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const authRoutes = Router();

authRoutes.post("/register", controller.register);
authRoutes.post("/login", controller.login);
authRoutes.post("/forgot-password", controller.forgotPassword);
authRoutes.post("/reset-password", controller.resetPassword);
authRoutes.get("/me", requireAuth, controller.me);
authRoutes.post("/logout", requireAuth, controller.logout);
