import { Router } from "express";
import * as controller from "../controllers/mirrors.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const mirrorsRoutes = Router();

mirrorsRoutes.get("/", controller.list);
mirrorsRoutes.get("/:titleId/selection", requireAuth, controller.getSelection);
mirrorsRoutes.put("/:titleId/selection", requireAuth, controller.setSelection);
