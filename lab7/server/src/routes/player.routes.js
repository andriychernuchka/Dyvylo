import { Router } from "express";
import * as controller from "../controllers/player.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const playerRoutes = Router();

playerRoutes.use(requireAuth);
playerRoutes.get("/progress", controller.list);
playerRoutes.get("/progress/:titleId", controller.getOne);
playerRoutes.put("/progress", controller.save);
playerRoutes.delete("/progress/:titleId", controller.remove);
