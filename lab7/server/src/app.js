import express from "express";
import cors from "cors";
import { apiRoutes } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { config } from "./config.js";

const allowedOrigins = new Set([
  config.corsOrigin,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  }));
  app.use(express.json({ limit: "100kb" }));

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
