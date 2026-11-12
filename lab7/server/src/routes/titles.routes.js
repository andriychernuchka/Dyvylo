import { Router } from "express";
import * as controller from "../controllers/titles.controller.js";
import { optionalAuth } from "../middleware/auth.js";

export const titlesRoutes = Router();

titlesRoutes.get("/", controller.list);
titlesRoutes.get("/:id/episodes", optionalAuth, controller.getEpisodes);
titlesRoutes.get("/:id", optionalAuth, controller.getOne);
