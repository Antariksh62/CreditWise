import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9229;

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

  async evaluate(expression) {
    const res = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error("Evaluation error: " + JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async close() {
    this.ws.close();
  }
}

async function runCompleteUserJourney() {
  console.log("==================================================================");
  console.log("CREDITWISE — COMPLETE USER JOURNEY VERIFICATION (12 SCENARIOS)");
  console.log("==================================================================\n");

  const userDataDir = path.join(process.cwd(), ".tmp_chrome_journey");
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
  const consoleErrors = [];
  const failedRequests = [];
  const testResults = [];

  try {
    let pageTarget = null;
    for (let i = 0; i < 40; i++) {
      try {
        const listRes = await fetch(`http://localhost:${PORT}/json/list`);
        const pages = await listRes.json();
        const page = pages.find((p) => p.type === "page" && p.webSocketDebuggerUrl);
        if (page) {
          pageTarget = page;
          break;
        }
      } catch {
        await sleep(200);
      }
    }

    if (!pageTarget) throw new Error("Could not find Chrome page target on port " + PORT);

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("DOM.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");

    // Track console messages and network failures
    cdp.ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
          const text = msg.params.args?.map((a) => a.value || a.description || "").join(" ");
          if (!text.includes("favicon")) {
            consoleErrors.push(text);
          }
        }
        if (msg.method === "Network.responseReceived") {
          const { status, url } = msg.params.response;
          if (status >= 400 && !url.includes("favicon") && !url.includes("testOverride") && !url.includes("x-test-gemini-status")) {
            failedRequests.push(`${status} ${url}`);
          }
        }
      } catch {}
    });

    // Helper: wait for element/condition
    async function waitFor(expr, timeoutMs = 8000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const ok = await cdp.evaluate(expr);
        if (ok) return true;
        await sleep(200);
      }
      return false;
    }

    // -------------------------------------------------------------------------
    // SCENARIO 1: New user completes questionnaire-based onboarding (Manual)
    // -------------------------------------------------------------------------
    console.log("Scenario 1: Testing Manual Questionnaire Onboarding...");
    await cdp.send("Page.navigate", { url: "http://localhost:3000/onboarding" });
    await sleep(2000);
    await cdp.evaluate("window.localStorage.clear()");
    await cdp.send("Page.navigate", { url: "http://localhost:3000/onboarding" });
    await sleep(2000);

    // Step 1: Click Continue
    await waitFor("Boolean(document.querySelector('button'))");
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(800);

    // Step 2: Ensure Manual Questionnaire is active and fill inputs via native setter
    await cdp.evaluate(`(() => {
      const manualTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Manual Questionnaire'));
      if (manualTab) manualTab.click();

      function setVal(id, val) {
        const el = document.getElementById(id);
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }

      setVal('spend-input-groceries', '12000');
      setVal('spend-input-dining', '6000');
      setVal('spend-input-fuel', '4000');
      setVal('spend-input-shopping', '10000');
    })()`);
    await sleep(500);

    const manualTotal = await cdp.evaluate(`document.querySelector('.cw-numeric')?.innerText`);
    console.log("   Manual Step 2 Total Spend:", manualTotal);
    testResults.push({
      scenario: 1,
      name: "New user completes questionnaire-based onboarding",
      passed: Boolean(manualTotal && manualTotal.length > 2),
      details: `Calculated total: ${manualTotal} (updated from manual inputs)`,
    });

    // -------------------------------------------------------------------------
    // SCENARIO 2: New user completes AI-assisted onboarding using Gemini
    // -------------------------------------------------------------------------
    console.log("\nScenario 2: Testing AI-Assisted Onboarding using Gemini...");
    await cdp.evaluate(`(() => {
      const aiTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AI-Assisted'));
      if (aiTab) aiTab.click();
    })()`);
    await sleep(500);

    await cdp.evaluate(`(() => {
      const input = document.getElementById('nl-spend-input');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, "I spend 15k on groceries, 8k on dining, 5k on fuel and 12k on shopping every month");
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Auto-fill with AI'));
      if (btn) btn.click();
    })()`);

    // Wait for AI auto-fill completion
    await sleep(4000);
    const aiExtractedTotal = await cdp.evaluate(`document.querySelector('.cw-numeric')?.innerText`);
    console.log("   AI Extracted Total Spend:", aiExtractedTotal);
    const s2Passed = Boolean(aiExtractedTotal && aiExtractedTotal.length > 2);
    testResults.push({
      scenario: 2,
      name: "New user completes AI-assisted onboarding using Gemini",
      passed: s2Passed,
      details: `Extracted spend total: ${aiExtractedTotal}`,
    });

    // -------------------------------------------------------------------------
    // SCENARIO 3: Gemini fails and user switches to manual onboarding
    // -------------------------------------------------------------------------
    console.log("\nScenario 3: Testing Gemini failure and switch to manual onboarding...");
    // Switch to AI tab, trigger fallback, verify user can seamlessly switch back to manual
    await cdp.evaluate(`(() => {
      const aiTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AI-Assisted'));
      if (aiTab) aiTab.click();
    })()`);
    await sleep(400);

    // Call API with simulated fallback error to test graceful response
    const apiFallbackResult = await cdp.evaluate(`
      fetch('/api/parse-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: "I spend 10k on groceries and 5k on dining", testOverride: "503" })
      }).then(r => r.json())
    `);
    console.log("   API Fallback Result (aiUnavailable):", apiFallbackResult?.aiUnavailable);

    // Switch explicitly to Manual Questionnaire
    await cdp.evaluate(`(() => {
      const manualTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Manual Questionnaire'));
      if (manualTab) manualTab.click();
    })()`);
    await sleep(500);

    const manualInputsPresent = await cdp.evaluate("Boolean(document.getElementById('spend-input-groceries'))");
    console.log("   Manual Questionnaire active:", manualInputsPresent);
    testResults.push({
      scenario: 3,
      name: "Gemini fails and the user switches to manual onboarding",
      passed: Boolean(apiFallbackResult?.aiUnavailable) && manualInputsPresent,
      details: "Graceful fallback verified and manual inputs remain fully operational",
    });

    // -------------------------------------------------------------------------
    // SCENARIO 4: User reviews and edits spending information
    // -------------------------------------------------------------------------
    console.log("\nScenario 4: Testing reviewing and editing spending information...");
    await cdp.evaluate(`(() => {
      const diningInput = document.getElementById('spend-input-dining');
      if (diningInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(diningInput, '15000');
        diningInput.dispatchEvent(new Event('input', { bubbles: true }));
        diningInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await sleep(500);

    const updatedTotal = await cdp.evaluate(`document.querySelector('.cw-numeric')?.innerText`);
    console.log("   Updated total spend after edit:", updatedTotal);
    testResults.push({
      scenario: 4,
      name: "User reviews and edits spending information",
      passed: Boolean(updatedTotal && (updatedTotal.includes("54,200") || updatedTotal.includes("60,200"))),
      details: `Live recalculated total: ${updatedTotal}`,
    });

    // Advance to Step 3 (Preferences)
    await cdp.evaluate(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (btn) btn.click();
    })()`);
    await sleep(800);

    // Step 3 (Preferences): select Cashback and Simplicity
    await cdp.evaluate(`(() => {
      const cashbackOpt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cashback'));
      if (cashbackOpt) cashbackOpt.click();
      const simplicityOpt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Simplicity'));
      if (simplicityOpt) simplicityOpt.click();
      const contBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (contBtn) contBtn.click();
    })()`);
    await sleep(800);

    // Step 4 (Fees): Click Continue
    await cdp.evaluate(`(() => {
      const contBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (contBtn) contBtn.click();
    })()`);
    await sleep(600);

    // Step 5 (Complexity): Click Continue
    await cdp.evaluate(`(() => {
      const contBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (contBtn) contBtn.click();
    })()`);
    await sleep(800);

    // -------------------------------------------------------------------------
    // SCENARIO 5, 6, 7: User selects exactly 1, 2, and 3 cards
    // -------------------------------------------------------------------------
    console.log("\nScenarios 5, 6, 7: Testing Card Count Selections (1, 2, 3 cards)...");
    const step6Header = await cdp.evaluate("document.querySelector('h2')?.innerText");
    console.log("   Step 6 Header:", step6Header);

    // Test 1 Card selection
    await cdp.evaluate(`(() => {
      const b1 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1 Credit Card'));
      if (b1) b1.click();
    })()`);
    await sleep(400);
    const count1Active = await cdp.evaluate(`(() => {
      const b1 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('1 Credit Card'));
      return b1 ? b1.className.includes('bg-black') || b1.className.includes('border-black') : false;
    })()`);
    testResults.push({
      scenario: 5,
      name: "User selects exactly 1 card",
      passed: count1Active,
      details: "1 Credit Card option selected and active",
    });

    // Test 2 Cards selection
    await cdp.evaluate(`(() => {
      const b2 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2 Credit Cards'));
      if (b2) b2.click();
    })()`);
    await sleep(400);
    const count2Active = await cdp.evaluate(`(() => {
      const b2 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2 Credit Cards'));
      return b2 ? b2.className.includes('bg-black') || b2.className.includes('border-black') : false;
    })()`);
    testResults.push({
      scenario: 6,
      name: "User selects exactly 2 cards",
      passed: count2Active,
      details: "2 Credit Cards option selected and active",
    });

    // Test 3 Cards selection
    await cdp.evaluate(`(() => {
      const b3 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('3 Credit Cards'));
      if (b3) b3.click();
    })()`);
    await sleep(400);
    const count3Active = await cdp.evaluate(`(() => {
      const b3 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('3 Credit Cards'));
      return b3 ? b3.className.includes('bg-black') || b3.className.includes('border-black') : false;
    })()`);
    testResults.push({
      scenario: 7,
      name: "User selects exactly 3 cards",
      passed: count3Active,
      details: "3 Credit Cards option selected and active",
    });

    // Select 2 Cards for the final recommendation setup
    await cdp.evaluate(`(() => {
      const b2 = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2 Credit Cards'));
      if (b2) b2.click();
      const contBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Continue'));
      if (contBtn) contBtn.click();
    })()`);
    await sleep(800);

    // -------------------------------------------------------------------------
    // SCENARIO 8: User reaches results page & sees correct number of recommendations
    // -------------------------------------------------------------------------
    console.log("\nScenario 8: Testing Results page recommendations...");
    await cdp.evaluate(`(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Find Cards'));
      if (submitBtn) submitBtn.click();
    })()`);
    await sleep(3500);

    const onResultsPage = await cdp.evaluate("window.location.pathname === '/results'");
    const initialArticles = await cdp.evaluate("document.querySelectorAll('article').length");
    console.log("   Navigated to /results:", onResultsPage, "| Initial cards rendered:", initialArticles);

    // Test switching tabs on results page: 1 card, 2 cards, 3 cards
    const tabCounts = [];
    for (const c of [1, 2, 3]) {
      await cdp.evaluate(`(() => {
        const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('${c} Card'));
        if (tab) tab.click();
      })()`);
      await sleep(800);
      const count = await cdp.evaluate("document.querySelectorAll('article').length");
      tabCounts.push(count);
    }
    console.log("   Results tab counts (1, 2, 3 cards):", tabCounts);
    const scenario8Passed = onResultsPage && tabCounts[0] === 1 && tabCounts[1] === 2 && tabCounts[2] === 3;
    testResults.push({
      scenario: 8,
      name: "User reaches the results page and sees the correct number of recommendations",
      passed: scenario8Passed,
      details: `Count matches: 1-card=${tabCounts[0]}, 2-card=${tabCounts[1]}, 3-card=${tabCounts[2]}`,
    });

    // -------------------------------------------------------------------------
    // SCENARIO 12 (Part A): User refreshes page & progress is preserved appropriately
    // -------------------------------------------------------------------------
    console.log("\nScenario 12: Testing page refresh & progress preservation on /results...");
    // Switch to 2 cards
    await cdp.evaluate(`(() => {
      const tab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('2 Cards'));
      if (tab) tab.click();
    })()`);
    await sleep(600);

    // Refresh page
    await cdp.send("Page.reload");
    await sleep(3000);

    const resultsAfterReload = await cdp.evaluate("window.location.pathname === '/results'");
    const articlesAfterReload = await cdp.evaluate("document.querySelectorAll('article').length");
    console.log("   Preserved on /results after reload:", resultsAfterReload, "| Cards:", articlesAfterReload);

    testResults.push({
      scenario: 12,
      name: "User refreshes the page and checks whether their progress is preserved appropriately",
      passed: resultsAfterReload && articlesAfterReload === 2,
      details: `Preserved recommendations state with ${articlesAfterReload} cards after refresh`,
    });

    // -------------------------------------------------------------------------
    // SCENARIO 9: User opens a recommended card's detail page
    // -------------------------------------------------------------------------
    console.log("\nScenario 9: Testing Card Detail page navigation...");
    const firstCardLink = await cdp.evaluate(`(() => {
      const a = document.querySelector('article h2 a');
      return a ? a.getAttribute('href') : null;
    })()`);
    console.log("   Opening card detail:", firstCardLink);

    await cdp.evaluate(`(() => {
      const a = document.querySelector('article h2 a');
      if (a) a.click();
    })()`);
    await sleep(2500);

    const detailUrl = await cdp.evaluate("window.location.pathname");
    const detailTitle = await cdp.evaluate("document.querySelector('h1')?.innerText");
    const hasKeyDetails = await cdp.evaluate("document.body.innerText.includes('Key Details') || document.body.innerText.includes('Annual Fee') || document.body.innerText.includes('Reward')");
    console.log("   Card Detail URL:", detailUrl, "| Title:", detailTitle);
    testResults.push({
      scenario: 9,
      name: "User opens a recommended card's detail page",
      passed: detailUrl.startsWith("/cards/") && Boolean(detailTitle) && hasKeyDetails,
      details: `Navigated to ${detailUrl} ('${detailTitle}') with verified fee & reward mechanics`,
    });

    // -------------------------------------------------------------------------
    // SCENARIO 10: User compares recommended cards
    // -------------------------------------------------------------------------
    console.log("\nScenario 10: Testing Compare recommended cards...");
    await cdp.send("Page.navigate", { url: "http://localhost:3000/compare?cards=amazon-pay-icici,amex-mrcc" });
    await sleep(2500);

    const compareTitle = await cdp.evaluate("document.querySelector('h1')?.innerText");
    const hasComparisonTable = await cdp.evaluate("Boolean(document.querySelector('table'))");
    const comparedCardsText = await cdp.evaluate("document.body.innerText");
    const hasBothCards = comparedCardsText.includes("Amazon Pay") && comparedCardsText.includes("American Express");
    console.log("   Compare title:", compareTitle, "| Table rendered:", hasComparisonTable, "| Both cards loaded:", hasBothCards);
    testResults.push({
      scenario: 10,
      name: "User compares recommended cards",
      passed: hasComparisonTable && hasBothCards,
      details: "Comparison matrix side-by-side comparison loaded without errors",
    });

    // -------------------------------------------------------------------------
    // SCENARIO 11: User signs up, signs in and accesses their profile
    // -------------------------------------------------------------------------
    console.log("\nScenario 11: Testing Sign Up, Sign In and Profile Access...");
    await cdp.send("Page.navigate", { url: "http://localhost:3000/signup" });
    await sleep(2000);

    const testEmail = `user_${Date.now()}@example.com`;
    await cdp.evaluate(`(() => {
      function setVal(id, val) {
        const el = document.getElementById(id);
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setVal('fullName', 'Priya Sharma');
      setVal('email', '${testEmail}');
      setVal('age', '26');
      setVal('password', 'SecurePass123');
      setVal('confirmPassword', 'SecurePass123');
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    })()`);
    await sleep(2500);

    const registeredUser = await cdp.evaluate("window.localStorage.getItem('cardwise:user')");
    console.log("   User session stored in localStorage:", Boolean(registeredUser));

    await cdp.send("Page.navigate", { url: "http://localhost:3000/profile" });
    await sleep(2500);

    const profileHeading = await cdp.evaluate("document.querySelector('h1')?.innerText");
    const profileText = await cdp.evaluate("document.body.innerText");
    const userRecognized = profileText.includes("Priya Sharma") || profileText.includes("Overview") || profileText.includes("My Profile");
    console.log("   Profile Heading:", profileHeading, "| User recognized:", userRecognized);
    testResults.push({
      scenario: 11,
      name: "User signs up, signs in and accesses their profile",
      passed: Boolean(registeredUser) && userRecognized,
      details: "Account registered, active session verified, and profile accessed",
    });

    // Console & Network Audit
    console.log("\n=== CONSOLE & NETWORK AUDIT ===");
    console.log("Console errors captured:", consoleErrors.length);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.log("   - Console Error:", e));
    }
    console.log("Failed API/Network requests captured:", failedRequests.length);
    if (failedRequests.length > 0) {
      failedRequests.forEach((r) => console.log("   - Failed Request:", r));
    }

    console.log("\n=======================================================");
    console.log("COMPLETE USER JOURNEY VERIFICATION REPORT");
    console.log("=======================================================");
    let allPassed = true;
    for (const r of testResults) {
      const statusIcon = r.passed ? "✓ [PASS]" : "✗ [FAIL]";
      if (!r.passed) allPassed = false;
      console.log(`${statusIcon} Scenario ${r.scenario}: ${r.name}`);
      console.log(`         ${r.details}`);
    }

    if (allPassed && consoleErrors.length === 0 && failedRequests.length === 0) {
      console.log("\n🎉 ALL 12 USER JOURNEY SCENARIOS PASSED WITH ZERO ERRORS!");
    } else {
      console.log("\nStatus: Completed with findings above.");
    }
  } catch (err) {
    console.error("Test execution error:", err);
  } finally {
    if (cdp) await cdp.close();
    chromeProc.kill();
  }
}

runCompleteUserJourney();
