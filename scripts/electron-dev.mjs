import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const electronBinary = require("electron");

const dev = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:3000/login");
      if (response.status < 500) return true;
    } catch {
      // servern startar fortfarande
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

const ready = await waitForServer();

if (!ready) {
  console.error("Next-servern startade inte på port 3000.");
  dev.kill();
  process.exit(1);
}

const window = spawn(electronBinary, ["."], { stdio: "inherit" });

window.on("exit", (code) => {
  dev.kill();
  process.exit(code ?? 0);
});

const shutdown = () => {
  window.kill();
  dev.kill();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
