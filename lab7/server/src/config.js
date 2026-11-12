import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(currentDir, "..");

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || "dyvylo-lab7-development-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  dbPath: process.env.DB_PATH || path.join(serverRoot, "data", "dyvylo.db"),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
};
