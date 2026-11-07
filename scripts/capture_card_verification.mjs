import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9227;

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
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
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

async function run() {
  const userDataDir = path.join(process.cwd(), ".tmp_chrome_verify");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${userDataDir}`,
    "http://localhost:3000/cards/amazon-pay-icici"
  ]);

  try {
    await sleep(2500);

    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const pages = await listRes.json();
    console.log("Pages found:", pages.length);
    const target = pages.find((p) => p.type === "page") || pages[0];
    const client = new CDPClient(target.webSocketDebuggerUrl);

    await client.send("Page.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });

    const verifyPages = [
      { url: "http://localhost:3000/cards/amazon-pay-icici", name: "verify_amazon_pay.png" },
      { url: "http://localhost:3000/cards/hdfc-regalia-gold", name: "verify_regalia_gold.png" },
      { url: "http://localhost:3000/cards/bob-eterna", name: "verify_bob_eterna.png" },
      { url: "http://localhost:3000/cards/bob-ethiad", name: "verify_bob_ethiad.png" },
      { url: "http://localhost:3000/cards/bobcard-scapia", name: "verify_scapia.png" },
      { url: "http://localhost:3000/cards", name: "verify_cards_grid.png" }
    ];

    for (const p of verifyPages) {
      console.log(`Navigating to ${p.url}...`);
      await client.send("Page.navigate", { url: p.url });
      await sleep(1500);
      const { data } = await client.send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(`scripts/${p.name}`, Buffer.from(data, "base64"));
      console.log(`Saved scripts/${p.name}`);
    }

    await client.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch(console.error);
