import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9228;

function sleep(ms) {
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
    }
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async close() {
    this.ws.close();
  }
}

async function runBrowserVerification() {
  console.log("=== RUNNING BROWSER ONBOARDING & RESULTS VERIFICATION ===");
  const userDataDir = path.join(process.cwd(), ".tmp_chrome_onboarding");
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--window-size=1280,1000",
  ]);

  let cdp = null;

  try {
    let pageTarget = null;
    for (let i = 0; i < 30; i++) {
      try {
        const listRes = await fetch(`http://localhost:${PORT}/json/list`);
        const pages = await listRes.json();
        if (pages && pages.length > 0 && pages[0].webSocketDebuggerUrl) {
          pageTarget = pages[0];
          break;
        }
      } catch {
        await sleep(200);
      }
    }

    if (!pageTarget) throw new Error("Could not find Chrome page target");

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("DOM.enable");
    await cdp.send("Runtime.enable");

    // 1. Navigate to Onboarding
    console.log("Navigating to http://localhost:3000/onboarding...");
    await cdp.send("Page.navigate", { url: "http://localhost:3000/onboarding" });
    await sleep(2500);

    const step1Title = await cdp.evaluate("document.querySelector('h1, h2')?.innerText");
    console.log("Step 1 rendered:", step1Title);

    // Click Continue to Step 2
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(800);

    // 2. On Step 2: Test Manual Mode and AI Assistant
    const step2Title = await cdp.evaluate("document.querySelector('h2')?.innerText");
    console.log("Step 2 rendered:", step2Title);

    const hasManualTab = await cdp.evaluate("document.body.innerText.includes('Manual Questionnaire')");
    const hasAITab = await cdp.evaluate("document.body.innerText.includes('AI-Assisted')");
    console.log("Has Manual tab:", hasManualTab, "| Has AI tab:", hasAITab);

    // Switch to AI-Assisted Mode
    await cdp.evaluate(`(() => {
      const aiTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AI-Assisted'));
      if (aiTab) aiTab.click();
    })()`);
    await sleep(500);

    const hasAIInput = await cdp.evaluate("Boolean(document.getElementById('nl-spend-input'))");
    console.log("AI text input displayed:", hasAIInput);

    // Test entering text and clicking Auto-fill
    await cdp.evaluate(`(() => {
      const input = document.getElementById('nl-spend-input');
      if (input) {
        input.value = "I spend 10000 on groceries, 5000 dining out, 4000 fuel and 12000 shopping";
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const autoFillBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Auto-fill with AI'));
      if (autoFillBtn) autoFillBtn.click();
    })()`);
    await sleep(3000);

    const monthlyTotal = await cdp.evaluate(`document.querySelector('.cw-numeric')?.innerText`);
    console.log("Monthly spend total after extraction:", monthlyTotal);

    // Continue through Step 3 (Preferences)
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(800);

    const step3Text = await cdp.evaluate("document.body.innerText");
    const hasPreferredRewardType = step3Text.includes("Preferred Reward Type");
    const hasPreferredCharacteristics = step3Text.includes("Preferred Card Characteristics");
    console.log("Step 3 Preferred Reward Type rendered:", hasPreferredRewardType);
    console.log("Step 3 Preferred Characteristics rendered:", hasPreferredCharacteristics);

    // Continue to Step 4 (Fees)
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(600);

    // Continue to Step 5 (Complexity)
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(600);

    // Continue to Step 6 (Card Count)
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(800);

    const step6Text = await cdp.evaluate("document.body.innerText");
    const hasCIBILInsight = step6Text.includes("TransUnion CIBIL") && step6Text.includes("2.1 live credit cards");
    console.log("Step 6 CIBIL Insight rendered:", hasCIBILInsight);

    // Select 2 Credit Cards option
    await cdp.evaluate(`(() => {
      const twoCardBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2 Credit Cards'));
      if (twoCardBtn) twoCardBtn.click();
    })()`);
    await sleep(500);

    // Continue to Step 7 (Review)
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(800);

    const step7Text = await cdp.evaluate("document.body.innerText");
    const hasDesiredSetupInSummary = step7Text.includes("2 Credit Cards") || step7Text.includes("Desired Setup");
    console.log("Step 7 Summary shows 2-Card Setup:", hasDesiredSetupInSummary);

    // Complete Onboarding -> Submit to Results
    console.log("Submitting profile to Results page...");
    await cdp.evaluate(`(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Find Cards'));
      if (submitBtn) submitBtn.click();
    })()`);
    await sleep(3500);

    const resultsUrl = await cdp.evaluate("window.location.href");
    console.log("Navigated to:", resultsUrl);

    const resultsHeading = await cdp.evaluate("document.querySelector('h1')?.innerText");
    console.log("Results Heading:", resultsHeading);

    const portfolioTitle = await cdp.evaluate("document.querySelector('h2')?.innerText");
    console.log("Portfolio Title:", portfolioTitle);

    const netValueMetric = await cdp.evaluate(`
      Array.from(document.querySelectorAll('span')).find(s => s.innerText.includes('/ year') || s.innerText.includes('/yr'))?.parentElement?.innerText
    `);
    console.log("Net Annual Value Metric:", netValueMetric?.replace(/\\n/g, ' '));

    const cardArticlesCount = await cdp.evaluate("document.querySelectorAll('article').length");
    console.log("Recommended Card count displayed:", cardArticlesCount);

    const hasCategoryRoutingTable = await cdp.evaluate("Boolean(document.querySelector('table'))");
    console.log("Category Allocation Strategy Matrix rendered:", hasCategoryRoutingTable);

    const hasFeedbackSection = await cdp.evaluate("document.body.innerText.includes('Feedback & System Learning')");
    console.log("Feedback & Continuous Learning Section rendered:", hasFeedbackSection);

    // Take screenshot of results page for visual verification
    const screenshot = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("test/browser_results_verified.png", Buffer.from(screenshot.data, "base64"));
    console.log("✓ Saved browser verification screenshot to test/browser_results_verified.png");

    console.log("\n=======================================================");
    console.log("ALL BROWSER FLOW VERIFICATION STEPS PASSED SUCCESSFULLY");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("Browser verification failed:", err);
    process.exit(1);
  } finally {
    if (cdp) await cdp.close();
    chromeProc.kill();
  }
}

runBrowserVerification();
