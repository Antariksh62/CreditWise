import assert from "assert";

async function runTests() {
  console.log("=== RUNNING FULL SYSTEM VERIFICATION ===");
  let passed = 0;
  let total = 0;

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`✗ [FAIL] ${name}:`, e.message);
    }
  }

  // 1. Natural Language Spend Parser API
  await asyncTest("API: /api/parse-spending extracts categories without hallucination", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "I spend roughly 12000 on groceries at DMart, 5000 dining out on Zomato, 3500 on fuel, and 15000 shopping on Amazon.",
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.categories.groceries, 12000);
    assert.strictEqual(data.categories.dining, 5000);
    assert.strictEqual(data.categories.fuel, 3500);
    assert.strictEqual(data.categories.shopping, 15000);
    assert.strictEqual(data.extractedTotal, 35500);
  });

  await asyncTest("API: /api/parse-spending handles empty text cleanly", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "   " }),
    });
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error);
  });

  // 2. AI Explanation API
  await asyncTest("API: /api/explain-recommendation provides synergy summary and roles", async () => {
    const res = await fetch("http://localhost:3000/api/explain-recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cards: [
          { slug: "sbi-cashback", name: "Cashback SBI Card" },
          { slug: "hsbc-live-plus", name: "HSBC Live+ Credit Card" },
        ],
        spending: { groceries: 8000, dining: 6000, shopping: 12000 },
        cardCount: 2,
        netMonetaryValue: 14500,
        grossRewards: 16800,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.explanation.portfolioSummary);
    assert.strictEqual(data.explanation.roles.length, 2);
    assert.ok(data.explanation.limitations);
  });

  // 3. Pseudonymous Feedback & Session Logging API
  await asyncTest("API: /api/feedback records recommendation session", async () => {
    const res = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "record_session",
        sessionId: "test_session_verify_1",
        cardCountSelected: 2,
        spendingSummary: { groceries: 6000, dining: 5000, shopping: 6000, totalMonthly: 17000 },
        recommendedCardSlugs: ["hsbc-live-plus", "sbi-cashback"],
        totalGrossRewards: 12400,
        totalAnnualFees: 1179,
        netMonetaryValue: 11221,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  await asyncTest("API: /api/feedback rejects submission without explicit consent", async () => {
    const res = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "test_session_verify_2",
        satisfaction: "satisfied",
        consentGranted: false,
      }),
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  await asyncTest("API: /api/feedback accepts consented feedback", async () => {
    const res = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "test_session_verify_2",
        satisfaction: "satisfied",
        dissatisfactionReasons: [],
        consideredOrApplied: ["hsbc-live-plus"],
        userNotes: "Clear category routing and fee transparency.",
        consentGranted: true,
      }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
  });

  // 4. HTTP Route rendering checks
  await asyncTest("Route: /onboarding responds with HTTP 200 and initial step", async () => {
    const res = await fetch("http://localhost:3000/onboarding");
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Personal Foundation") || html.includes("About You"));
  });

  await asyncTest("Route: /recommend responds with HTTP 200 and quiz container", async () => {
    const res = await fetch("http://localhost:3000/recommend");
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Question 1 of 6") || html.includes("Questionnaire progress"));
  });

  await asyncTest("Route: /results responds with HTTP 200 and client shell", async () => {
    const res = await fetch("http://localhost:3000/results");
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Evaluating verified cards") || html.includes("Spending Profile Required") || html.includes("Cards that fit"));
  });

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
  console.log(`========================================\n`);

  if (total - passed > 0) {
    process.exit(1);
  }
}

runTests();
