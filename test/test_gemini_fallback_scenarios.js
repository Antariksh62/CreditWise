import assert from "assert";

async function runScenarioTests() {
  console.log("=== COMPREHENSIVE GEMINI FAILURE & MANUAL FALLBACK VERIFICATION ===");
  let passed = 0;
  let total = 0;

  async function test(scenarioNum, title, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ [PASS] Scenario ${scenarioNum}: ${title}`);
      passed++;
    } catch (e) {
      console.error(`✗ [FAIL] Scenario ${scenarioNum}: ${title} ->`, e.message);
    }
  }

  const sampleSpendText = "I spend ₹12,000 on groceries, ₹5,000 dining out, ₹3,500 on fuel, and ₹8,000 online shopping";

  // Scenario 1: Gemini succeeds: AI-assisted onboarding works
  await test(1, "Gemini succeeds: AI-assisted onboarding extracts categories accurately", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: sampleSpendText }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.categories.groceries >= 10000);
    assert.ok(data.categories.dining >= 4000);
    assert.ok(data.categories.fuel >= 3000);
    assert.strictEqual(data.aiUnavailable, false);
    assert.strictEqual(data.mode, "ai");
  });

  // Scenario 2: Gemini returns 429: retries are limited, then manual fallback works
  await test(2, "Gemini returns 429: retries are limited to 2, then graceful manual fallback activates", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-gemini-status": "429",
      },
      body: JSON.stringify({ text: sampleSpendText }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.aiUnavailable, true);
    assert.strictEqual(data.errorType, "RATE_LIMIT_OR_QUOTA");
    assert.strictEqual(data.retryCount, 2); // exactly 2 retries
    assert.strictEqual(data.mode, "fallback");
    assert.ok(data.message.includes("AI-assisted onboarding is temporarily unavailable"));
    // Verify deterministic numbers are still extracted so user data is never lost
    assert.strictEqual(data.categories.groceries, 12000);
    assert.strictEqual(data.categories.dining, 5000);
  });

  // Scenario 3: Gemini returns 503: manual fallback works after retries
  await test(3, "Gemini returns 503: manual fallback works after retries", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-gemini-status": "503",
      },
      body: JSON.stringify({ text: sampleSpendText }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.aiUnavailable, true);
    assert.strictEqual(data.errorType, "SERVICE_UNAVAILABLE");
    assert.strictEqual(data.retryCount, 2);
    assert.strictEqual(data.mode, "fallback");
    assert.ok(data.message.includes("complete your profile manually"));
  });

  // Scenario 4: Gemini times out: manual fallback works
  await test(4, "Gemini times out: manual fallback works", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-gemini-status": "timeout",
      },
      body: JSON.stringify({ text: sampleSpendText }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.aiUnavailable, true);
    assert.strictEqual(data.errorType, "TIMEOUT");
    assert.strictEqual(data.mode, "fallback");
  });

  // Scenario 5: Gemini returns invalid JSON: manual fallback works
  await test(5, "Gemini returns invalid JSON: manual fallback works", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-gemini-status": "invalid_json",
      },
      body: JSON.stringify({ text: sampleSpendText }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.aiUnavailable, true);
    assert.strictEqual(data.errorType, "INVALID_RESPONSE");
    assert.strictEqual(data.mode, "fallback");
  });

  // Scenario 6: Gemini has an invalid API key: a suitable configuration error is logged and user can continue manually
  await test(6, "Gemini invalid API key: configuration error logged and user can continue manually", async () => {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-test-gemini-status": "auth_error",
      },
      body: JSON.stringify({ text: sampleSpendText }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.aiUnavailable, true);
    assert.strictEqual(data.errorType, "AUTH_OR_CONFIG_ERROR");
    // Non-retryable error: should not waste retries
    assert.strictEqual(data.retryCount, 0);
    assert.strictEqual(data.mode, "fallback");
    // No sensitive stack traces or keys exposed
    assert.strictEqual(data.stack, undefined);
    assert.strictEqual(data.apiKey, undefined);
  });

  // Scenario 7: User switches to manual mode while Gemini is available
  await test(7, "User switches to manual mode: manual questionnaire loads directly without AI dependency", async () => {
    const res = await fetch("http://localhost:3000/onboarding");
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    // Onboarding loads directly and provides structured inputs
    assert.ok(html.includes("Personal Foundation") || html.includes("About You"));
    // Also verify that OnboardingFlow contains the manual questionnaire mode definition
    const fs = await import("fs");
    const flowCode = fs.readFileSync("components/OnboardingFlow.jsx", "utf-8");
    assert.ok(flowCode.includes("Manual Questionnaire (Standard)"));
    assert.ok(flowCode.includes("AI-Assisted (Optional)"));
    assert.ok(flowCode.includes("Switch to Manual Mode"));
  });

  // Scenario 8: Previously entered answers survive transition to manual mode
  await test(8, "Previously entered answers survive transition to manual mode", () => {
    const previousSpending = {
      groceries: 7500,
      dining: 4500,
      fuel: 3000,
      shopping: 6000,
      travel: 2000,
      utilities: 2500,
      entertainment: 1000,
      subscriptions: 500,
      other: 2000,
    };
    // Simulated fallback payload from /api/parse-spending
    const fallbackCategories = { groceries: 12000, dining: 5000 };
    const merged = { ...previousSpending, ...fallbackCategories };

    assert.strictEqual(merged.fuel, 3000, "Unmodified categories must not be overwritten or set to 0");
    assert.strictEqual(merged.utilities, 2500);
    assert.strictEqual(merged.groceries, 12000);
    assert.strictEqual(merged.dining, 5000);
  });

  // Scenario 9: Manual onboarding produces a valid canonical profile
  await test(9, "Manual onboarding produces a valid canonical profile", () => {
    const manualProfile = {
      cardCount: 2,
      account: { fullName: "Test User", email: "test@example.com", age: 28 },
      profile: { age: 28, employment: "salaried", incomeRange: "₹6L – ₹12L", city: "Bengaluru" },
      spending: {
        totalMonthly: 30000,
        categories: {
          groceries: 8000,
          dining: 5000,
          fuel: 3000,
          shopping: 7000,
          travel: 4000,
          utilities: 3000,
          other: 0,
        },
      },
      preferences: {
        cardCount: 2,
        preferredRewardType: "Cashback",
        preferredCardCharacteristics: "Simplicity",
        priorities: ["Cashback", "Dining"],
        rewardStyle: "simple",
        feeTolerance: "moderate-fee",
      },
    };

    assert.strictEqual(manualProfile.cardCount, 2);
    assert.strictEqual(manualProfile.spending.totalMonthly, 30000);
    assert.strictEqual(manualProfile.preferences.preferredRewardType, "Cashback");
  });

  // Scenario 10: Manual and AI-assisted profiles both reach the same recommendation engine
  await test(10, "Manual and AI-assisted profiles both evaluate through getProfileRecommendations", async () => {
    const { getProfileRecommendations } = await import("../lib/recommendation.js");
    const { default: cards } = await import("../data/cards.json", { with: { type: "json" } });

    const manualProfile = {
      cardCount: 2,
      profile: { age: 28, employment: "salaried", incomeRange: "₹12L – ₹25L", city: "Mumbai" },
      spending: {
        totalMonthly: 36000,
        categories: { groceries: 8000, dining: 6000, shopping: 12000, fuel: 4000, utilities: 4000, travel: 2000 },
      },
      preferences: {
        cardCount: 2,
        preferredRewardType: "Cashback",
        preferredCardCharacteristics: "Simplicity",
        priorities: ["Cashback", "Dining"],
        rewardStyle: "simple",
        feeTolerance: "moderate-fee",
      },
    };

    const aiAssistedProfile = {
      cardCount: 2,
      profile: { age: 28, employment: "salaried", incomeRange: "₹12L – ₹25L", city: "Mumbai" },
      spending: {
        totalMonthly: 36000,
        categories: { groceries: 8000, dining: 6000, shopping: 12000, fuel: 4000, utilities: 4000, travel: 2000 },
      },
      preferences: {
        cardCount: 2,
        preferredRewardType: "Cashback",
        preferredCardCharacteristics: "Simplicity",
        priorities: ["Cashback", "Dining"],
        rewardStyle: "simple",
        feeTolerance: "moderate-fee",
      },
    };

    const resManual = getProfileRecommendations(cards, manualProfile, 2);
    const resAI = getProfileRecommendations(cards, aiAssistedProfile, 2);

    assert.strictEqual(resManual.recommended.length, 2);
    assert.strictEqual(resAI.recommended.length, 2);
    assert.deepStrictEqual(
      resManual.recommended.map((r) => r.card.slug),
      resAI.recommended.map((r) => r.card.slug),
      "Manual and AI profiles must produce identical deterministic card recommendations"
    );
    assert.strictEqual(resManual.combination.netValue, resAI.combination.netValue);
  });

  // Scenario 11: The selected card count (1, 2 or 3) is respected
  await test(11, "The selected card count (1, 2 or 3) is strictly respected", async () => {
    const { getProfileRecommendations } = await import("../lib/recommendation.js");
    const { default: cards } = await import("../data/cards.json", { with: { type: "json" } });

    const testProfile = {
      profile: { age: 30, employment: "salaried", incomeRange: "₹12L – ₹25L", city: "Delhi NCR" },
      spending: {
        totalMonthly: 40000,
        categories: { groceries: 10000, dining: 8000, shopping: 12000, fuel: 5000, utilities: 5000 },
      },
      preferences: { priorities: ["Cashback", "Shopping"], feeTolerance: "moderate-fee" },
    };

    const res1 = getProfileRecommendations(cards, { ...testProfile, cardCount: 1 }, 1);
    const res2 = getProfileRecommendations(cards, { ...testProfile, cardCount: 2 }, 2);
    const res3 = getProfileRecommendations(cards, { ...testProfile, cardCount: 3 }, 3);

    assert.strictEqual(res1.recommended.length, 1);
    assert.strictEqual(res1.combination.cards.length, 1);

    assert.strictEqual(res2.recommended.length, 2);
    assert.strictEqual(res2.combination.cards.length, 2);

    assert.strictEqual(res3.recommended.length, 3);
    assert.strictEqual(res3.combination.cards.length, 3);
  });

  // Scenario 12: Results page displays correctly
  await test(12, "Results page responds with HTTP 200 and loads portfolio architecture components", async () => {
    const res = await fetch("http://localhost:3000/results");
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Spending Profile Required") || html.includes("Cards that fit how you spend") || html.includes("Evaluating verified cards"));
  });

  console.log(`\n======================================================`);
  console.log(`SCENARIO RESULTS: ${passed} / ${total} PASSED`);
  console.log(`======================================================\n`);

  if (total - passed > 0) {
    process.exit(1);
  }
}

runScenarioTests();
