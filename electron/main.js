const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const crypto = require("node:crypto");

const isDev = !app.isPackaged;

function readEnvFile(file) {
  if (!fs.existsSync(file)) return;

  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function ensureSecret() {
  if (process.env.AUTH_SECRET) return;

  const folder = app.getPath("userData");
  const file = path.join(folder, "auth-secret");

  try {
    if (fs.existsSync(file)) {
      process.env.AUTH_SECRET = fs.readFileSync(file, "utf8").trim();
      if (process.env.AUTH_SECRET) return;
    }

    const secret = crypto.randomBytes(32).toString("hex");
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(file, secret, "utf8");
    process.env.AUTH_SECRET = secret;
  } catch {
    process.env.AUTH_SECRET = crypto.randomBytes(32).toString("hex");
  }
}

async function startProductionServer() {
  process.env.NODE_ENV = "production";

  const next = require("next");
  const nextApp = next({ dev: false, dir: app.getAppPath() });
  await nextApp.prepare();

  const handler = nextApp.getRequestHandler();
  const server = http.createServer((request, response) =>
    handler(request, response),
  );

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  return `http://127.0.0.1:${port}`;
}

async function createWindow() {
  process.env.ELDA_DATA_DIR = path.join(app.getPath("userData"), "data");

  if (!isDev) {
    // Valfri .env.local bredvid appen (t.ex. OPENROUTER_API_KEY).
    readEnvFile(path.join(process.resourcesPath, ".env.local"));
    readEnvFile(path.join(path.dirname(app.getPath("exe")), ".env.local"));
  }

  ensureSecret();

  const url = isDev ? "http://127.0.0.1:3000" : await startProductionServer();

  const window = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#0d0c0b",
    title: "Elda Skola 2.0",
    icon: path.join(__dirname, "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url: target }) => {
    void shell.openExternal(target);
    return { action: "deny" };
  });

  await window.loadURL(url);
}

app.whenReady().then(() => {
  void createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) void createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
