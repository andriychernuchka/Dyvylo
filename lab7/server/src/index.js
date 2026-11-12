import { createApp } from "./app.js";
import { config } from "./config.js";
import { db } from "./db/index.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`DYVYLO API запущено: http://localhost:${config.port}/api`);
  console.log(`SQLite: ${config.dbPath}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
