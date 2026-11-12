import { Router } from "express";
import * as controller from "../controllers/bookmarks.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const bookmarksRoutes = Router();

bookmarksRoutes.use(requireAuth);
bookmarksRoutes.get("/", controller.list);
bookmarksRoutes.post("/", controller.add);
bookmarksRoutes.delete("/:titleId", controller.remove);
bookmarksRoutes.delete("/", controller.clear);
