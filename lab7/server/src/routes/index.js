import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { profileRoutes } from "./profile.routes.js";
import { titlesRoutes } from "./titles.routes.js";
import { bookmarksRoutes } from "./bookmarks.routes.js";
import { playerRoutes } from "./player.routes.js";
import { mirrorsRoutes } from "./mirrors.routes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "dyvylo-lab7-api" });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/profile", profileRoutes);
apiRoutes.use("/titles", titlesRoutes);
apiRoutes.use("/bookmarks", bookmarksRoutes);
apiRoutes.use("/player", playerRoutes);
apiRoutes.use("/mirrors", mirrorsRoutes);
