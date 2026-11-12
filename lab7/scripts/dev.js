import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const children = [
  spawn(npm, ["run", "dev", "--workspace", "server"], { stdio: "inherit" }),
  spawn(npm, ["run", "dev", "--workspace", "client"], { stdio: "inherit" }),
];

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }

  setTimeout(() => process.exit(code), 300);
}

for (const child of children) {
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shutdown(signal ? 1 : code || 0);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
