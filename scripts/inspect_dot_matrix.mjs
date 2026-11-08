import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9225;

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.ready = new Promise((resolve) => {
      this.ws.onopen = resolve;
    });
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async close() {
    this.ws.close();
  }
}

async function inspectDotMatrix() {
  const userDataDir = path.join(process.cwd(), ".tmp_chrome_dots");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${userDataDir}`,
    "http://localhost:3000/"
  ]);

  await sleep(2000);

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const tabs = await listRes.json();
  const pageTab = tabs.find((t) => t.type === "page") || tabs[0];

  const client = new CDPClient(pageTab.webSocketDebuggerUrl);
  await client.send("Page.enable");
  await client.send("DOM.enable");

  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await sleep(1000);

  // Move mouse around the hero area
  await client.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: 640,
    y: 400,
  });
  await sleep(500);

  const canvasInfo = await client.send("Runtime.evaluate", {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { error: 'No canvas found' };
      const rect = canvas.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        style: canvas.getAttribute('style')
      };
    })()`,
    returnByValue: true,
  });

  console.log("Canvas Info:", canvasInfo.result?.value);

  // Take screenshot with cursor at 640, 400
  const screenshot1 = await client.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync("dot_matrix_inspect.png", Buffer.from(screenshot1.data, "base64"));
  console.log("Captured dot_matrix_inspect.png");

  const clipScreenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: 500, y: 260, width: 280, height: 280, scale: 1 }
  });
  fs.writeFileSync("dot_matrix_clip.png", Buffer.from(clipScreenshot.data, "base64"));
  console.log("Captured dot_matrix_clip.png");

  await client.close();
  chromeProc.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch {}
}

inspectDotMatrix();
