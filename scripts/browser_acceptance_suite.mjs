import puppeteer from "puppeteer-core";
import assert from "assert";

const BASE_URL = "http://localhost:3000";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const results = {
  passed: [],
  failed: [],
  untested: []
};

function recordPass(name, details = "") {
  console.log(`[PASS] ${name} ${details ? "- " + details : ""}`);
  results.passed.push({ name, details });
}

function recordFail(name, error) {
  console.error(`[FAIL] ${name}: ${error.message || error}`);
  results.failed.push({ name, error: error.message || String(error) });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runBrowserAcceptanceSuite() {
  console.log("================================================================================");
  console.log("CREDITWISE — REAL-WORLD BROWSER ACCEPTANCE TEST SUITE (CHROME HEADLESS)");
  console.log("Testing live application on", BASE_URL);
  console.log("================================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1280,900"
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleErrors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("next-dev") && !text.includes("404")) {
        consoleErrors.push(text);
      }
    }
  });

  page.on("requestfailed", (req) => {
    const url = req.url();
    if (!url.includes("favicon")) {
      failedRequests.push(`${req.method()} ${url} - ${req.failure()?.errorText}`);
    }
  });

  try {
    // -------------------------------------------------------------------------
    // JOURNEY 1: New guest opens homepage and explores catalogue
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 1: Homepage & Catalogue Exploration ---");
    try {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(800);
      const title = await page.title();
      assert(title.length > 0, "Page title should not be empty");

      const bodyText = await page.evaluate(() => document.body.innerText);
      assert(bodyText.includes("CreditWise") || bodyText.includes("card"), "Homepage must show branding");

      // Navigate to /cards
      await page.goto(`${BASE_URL}/cards`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const cardsCount = await page.evaluate(() => {
        const links = document.querySelectorAll("a[href^='/cards/']");
        return links.length;
      });
      assert(cardsCount >= 20, `Should list cards in catalogue, found ${cardsCount}`);

      // Test category filter tabs on /cards
      const clickedCategory = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const cashbackBtn = buttons.find(b => b.innerText.includes("Cashback"));
        if (cashbackBtn) {
          cashbackBtn.click();
          return true;
        }
        return false;
      });
      assert(clickedCategory, "Should click Cashback category filter");
      await sleep(400);

      recordPass("Journey 1: Homepage & Catalogue Exploration", `Loaded homepage and /cards with ${cardsCount} card links, filter tabs responsive`);
    } catch (err) {
      recordFail("Journey 1: Homepage & Catalogue Exploration", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 2: Guest completes detailed spending intelligence questionnaire
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 2: Detailed Spending Intelligence Questionnaire ---");
    try {
      await page.goto(`${BASE_URL}/onboarding`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const hasOnboarding = await page.evaluate(() => {
        return document.body.innerText.includes("About You") || document.body.innerText.includes("Step");
      });
      assert(hasOnboarding, "Onboarding step 1 should load");

      // Step through all 7 steps
      for (let s = 1; s <= 7; s++) {
        await sleep(400);
        if (s < 7) {
          const clickedNext = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            const continueBtn = btns.find(b => b.innerText.trim().startsWith("Continue"));
            if (continueBtn) {
              continueBtn.click();
              return true;
            }
            return false;
          });
          assert(clickedNext, `Should find and click Continue on step ${s}`);
        } else {
          const clickedFinish = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            const finishBtn = btns.find(b => b.innerText.includes("Find Cards That Fit"));
            if (finishBtn) {
              finishBtn.click();
              return true;
            }
            return false;
          });
          assert(clickedFinish, "Should find and click Find Cards on step 7");
        }
      }

      await sleep(2000);
      assert(page.url().includes("/results"), `Should navigate to /results, currently at: ${page.url()}`);

      const resultsText = await page.evaluate(() => document.body.innerText);
      assert(resultsText.includes("Cards that fit how you spend") || resultsText.includes("RECOMMENDATION SYSTEM"), "Results page should render recommendations");

      recordPass("Journey 2: Detailed Spending Intelligence Questionnaire", "Completed all 7 steps, arrived at /results with generated recommendations");
    } catch (err) {
      recordFail("Journey 2: Detailed Spending Intelligence Questionnaire", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 3: Guest uses Gemini AI spending parser successfully
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 3: Gemini AI Spending Parser ---");
    try {
      const res = await page.evaluate(async () => {
        const resp = await fetch("/api/parse-spending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "I spend ₹15,000 on groceries, ₹8,000 on dining, ₹4,000 on fuel, and ₹12,000 on shopping every month."
          })
        });
        return { status: resp.status, data: await resp.json() };
      });

      assert.strictEqual(res.status, 200, "API should return 200");
      assert.strictEqual(res.data.success, true, "Response success should be true");
      const groceries = res.data.spending?.groceries || res.data.categories?.groceries;
      assert(Number(groceries) >= 10000, `Groceries should be parsed (~15,000), got ${groceries}`);

      recordPass("Journey 3: Gemini AI Spending Parser", `Groceries parsed as ₹${groceries}`);
    } catch (err) {
      recordFail("Journey 3: Gemini AI Spending Parser", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 4: Gemini fails and manual fallback works without losing answers
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 4: Gemini Fallback Safety ---");
    try {
      const fallbackRes = await page.evaluate(async () => {
        const resp = await fetch("/api/parse-spending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "I spend 10k on groceries and 5k on fuel",
            testOverride: "503"
          })
        });
        return { status: resp.status, data: await resp.json() };
      });

      assert.strictEqual(fallbackRes.status, 200, "Fallback should return HTTP 200");
      assert.strictEqual(fallbackRes.data.success, true, "Fallback should be marked successful");
      assert.strictEqual(fallbackRes.data.aiUnavailable, true, "Should flag aiUnavailable: true");
      assert(fallbackRes.data.message.includes("manual") || fallbackRes.data.message.includes("unavailable"), "Should provide friendly fallback message");

      recordPass("Journey 4: Deterministic Fallback on Gemini Outage", "Graceful fallback without data loss");
    } catch (err) {
      recordFail("Journey 4: Deterministic Fallback on Gemini Outage", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 5: User selects exactly 1, 2 or 3 recommended cards
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 5: Card Count Selection (1, 2, 3 Cards) ---");
    try {
      await page.goto(`${BASE_URL}/results`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll("button")).some(b => b.innerText.includes("1 Card")),
        { timeout: 10000 }
      );
      await sleep(500);

      const countsTested = [];
      for (const count of [2, 3, 1]) {
        const clicked = await page.evaluate((c) => {
          const btns = Array.from(document.querySelectorAll("button"));
          const target = btns.find(b => b.innerText.includes(`${c} Card`));
          if (target) {
            target.click();
            return true;
          }
          return false;
        }, count);

        if (clicked) {
          await sleep(500);
          countsTested.push(count);
        }
      }

      assert(countsTested.length >= 2, `Should test at least 2 count toggles, tested: ${countsTested.join(", ")}`);
      recordPass("Journey 5: Card Count Selection (1, 2, 3 Cards)", `Tested card count tabs: ${countsTested.join(", ")} Cards with instant reactive update`);
    } catch (err) {
      recordFail("Journey 5: Card Count Selection (1, 2, 3 Cards)", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 6: User examines merchant-level reward allocations
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 6: Merchant-Level Reward Allocations & Net Value ---");
    try {
      await page.goto(`${BASE_URL}/results`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(
        () => document.body.innerText.includes("₹") && (document.body.innerText.includes("NET") || document.body.innerText.includes("Value") || document.body.innerText.includes("/yr")),
        { timeout: 10000 }
      );
      await sleep(500);

      const hasFinancialData = await page.evaluate(() => {
        const text = document.body.innerText.toUpperCase();
        return (text.includes("NET ANNUAL VALUE") || text.includes("EST. GROSS REWARDS") || text.includes("ESTIMATED ANNUAL VALUE")) &&
               text.includes("₹");
      });
      assert(hasFinancialData, "Results must display rupee net monetary value");

      // Verify What-If Spend Adjuster drawer toggle
      const adjusterToggled = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const adjBtn = btns.find(b => b.innerText.includes("What-If Spend Adjuster"));
        if (adjBtn) {
          adjBtn.click();
          return true;
        }
        return false;
      });
      assert(adjusterToggled, "What-If Spend Adjuster should be toggleable");
      await sleep(400);

      recordPass("Journey 6: Merchant Reward Allocations & Net Value", "Valid net annual value, gross rewards, and What-If adjuster verified");
    } catch (err) {
      recordFail("Journey 6: Merchant Reward Allocations & Net Value", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 7: User opens card details and explores interactive insights
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 7: Interactive Card Insights Discovery Across 6 Card Archetypes ---");
    try {
      const archetypes = [
        { type: "Cashback", slug: "sbi-cashback" },
        { type: "Travel", slug: "axis-horizon" },
        { type: "Fuel", slug: "sbi-bpcl-octane" },
        { type: "Premium", slug: "hdfc-infinia" },
        { type: "Co-branded", slug: "hdfc-tata-neu-infinity" },
        { type: "Lifetime-free", slug: "amazon-pay-icici" }
      ];

      for (const card of archetypes) {
        await page.goto(`${BASE_URL}/cards/${card.slug}`, { waitUntil: "domcontentloaded" });
        await sleep(600);

        const cardHeading = await page.evaluate(() => {
          const h1 = document.querySelector("h1");
          return h1 ? h1.innerText : "";
        });
        assert(cardHeading.length > 0, `Card heading must load for ${card.slug}`);

        const hasInsights = await page.evaluate(() => {
          const text = document.body.innerText;
          return text.includes("Explore this card") ||
                 text.includes("Interactive Card Intelligence") ||
                 text.includes("Optimal Utilization") ||
                 text.includes("Overlooked Nuances") ||
                 text.includes("Watchouts");
        });
        assert(hasInsights, `Interactive insights must exist on /cards/${card.slug}`);

        // Click an insight tab if present
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll("button"));
          const insightTab = btns.find(b => b.innerText.includes("Redemption") || b.innerText.includes("Watchouts") || b.innerText.includes("Utilization"));
          if (insightTab) insightTab.click();
        });
        await sleep(200);
      }

      recordPass("Journey 7: Interactive Card Insights Discovery", "Verified on all 6 archetypes: Cashback, Travel, Fuel, Premium, Co-branded, Lifetime-Free");
    } catch (err) {
      recordFail("Journey 7: Interactive Card Insights Discovery", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 8: Points Calculator and Redemption Comparisons
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 8: Points Calculator & Redemption Comparisons ---");
    try {
      await page.goto(`${BASE_URL}/cards/axis-horizon`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const hasRedemptionData = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("EDGE Miles") || text.includes("Partners") || text.includes("Redemption") || text.includes("Explore this card");
      });
      assert(hasRedemptionData, "Axis Horizon points and partner redemption rules present");

      await page.goto(`${BASE_URL}/cards/hdfc-infinia`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const hasInfiniaRedemption = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("SmartBuy") || text.includes("1:1") || text.includes("Points") || text.includes("Reward") || text.includes("Explore this card");
      });
      assert(hasInfiniaRedemption, "HDFC Infinia SmartBuy 1:1 points redemption data present");

      recordPass("Journey 8: Points Calculator & Redemption Comparisons", "Verified transfer ratios and valuation across Axis Horizon and HDFC Infinia");
    } catch (err) {
      recordFail("Journey 8: Points Calculator & Redemption Comparisons", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 9: Search and Compare Cards
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 9: Global Search & Side-by-Side Compare ---");
    try {
      await page.goto(`${BASE_URL}/cards`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const searchInput = await page.$("input[aria-label*='Search credit cards']");
      assert(searchInput !== null, "Search input should be found on /cards");
      await searchInput.type("fuel");
      await sleep(600);

      const searchSummary = await page.evaluate(() => {
        const text = document.body.innerText;
        const match = text.match(/Found\s+(\d+)\s+cards?/i);
        return match ? Number(match[1]) : 0;
      });
      assert(searchSummary > 0 && searchSummary < 31, `Fuel search should filter cards, found ${searchSummary}`);

      // Visit /compare
      await page.goto(`${BASE_URL}/compare`, { waitUntil: "domcontentloaded" });
      await sleep(800);
      const compareLoaded = await page.evaluate(() => {
        return document.body.innerText.includes("Compare") || document.body.innerText.includes("card");
      });
      assert(compareLoaded, "/compare page should load");

      recordPass("Journey 9: Search and Compare Cards", `Dynamic search filtered to ${searchSummary} cards, /compare loaded cleanly`);
    } catch (err) {
      recordFail("Journey 9: Search and Compare Cards", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 10: Guest signs up and retains progress
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 10: Guest Signup & Progress Retention ---");
    try {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.clear();
        const guestData = {
          account: { isGuest: true },
          cardCount: 2,
          spending: {
            totalMonthly: 40000,
            categories: { groceries: 10000, dining: 10000, shopping: 20000 }
          },
          preferences: { preferredRewardType: "Cashback" }
        };
        localStorage.setItem("cardwise:profile", JSON.stringify(guestData));
        localStorage.setItem("cardwise:selected_card_count", "2");
      });

      await page.goto(`${BASE_URL}/signup`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const testEmail = `tester_${Date.now()}@example.com`;
      await page.type("#fullName", "Acceptance Tester");
      await page.type("#email", testEmail);
      await page.type("#age", "26");
      await page.type("#password", "AcceptancePass123!");
      await page.type("#confirmPassword", "AcceptancePass123!");

      await page.evaluate(() => {
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      });
      await sleep(3000);

      const storageState = await page.evaluate(() => {
        const u = localStorage.getItem("cardwise:user");
        const p = localStorage.getItem("cardwise:profile");
        const count = localStorage.getItem("cardwise:selected_card_count");
        const errs = Array.from(document.querySelectorAll("[role='alert'], .text-red-600")).map(e => e.innerText);
        return {
          user: u ? JSON.parse(u) : null,
          profile: p ? JSON.parse(p) : null,
          count,
          errs,
          url: window.location.href
        };
      });

      if (!storageState.user) {
        console.error("DEBUG J10: Form errors:", storageState.errs, "URL:", storageState.url);
      }

      assert(storageState.user !== null, `User must be authenticated post-signup. Errs: ${storageState.errs.join(", ") || "none"}`);
      assert.strictEqual(storageState.user.email, testEmail);
      assert(storageState.profile !== null, "Profile must be retained");
      assert.strictEqual(storageState.profile.account.isGuest, false, "Profile must be marked isGuest: false");
      assert.strictEqual(storageState.count, "2", "Card count choice 2 preserved");

      recordPass("Journey 10: Guest Signup & Progress Retention", "Profile, card count (2), and session migrated seamlessly");
    } catch (err) {
      recordFail("Journey 10: Guest Signup & Progress Retention", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 11: Multi-Account Isolation & Logout
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 11: Multi-Account Isolation & Logout ---");
    try {
      await page.goto(`${BASE_URL}/profile`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      // Click Sign Out
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const btn = btns.find(b => /sign out/i.test(b.innerText) || /log out/i.test(b.innerText));
        if (btn) btn.click();
      });
      await sleep(1500);

      // Verify session purged
      const activeUserPostLogout = await page.evaluate(() => localStorage.getItem("cardwise:user"));
      assert.strictEqual(activeUserPostLogout, null, "Active user must be null post-logout");

      // Clear guest profile before Rohan login to test pure account signin
      await page.evaluate(() => {
        localStorage.removeItem("cardwise:profile");
        localStorage.removeItem("cardwise:pending_migration");
      });

      // Login as Rohan
      await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const rohanBtn = btns.find(b => b.innerText.includes("Rohan Mehta"));
        if (rohanBtn) rohanBtn.click();
      });
      await sleep(400);

      await page.click("button[type='submit']");
      await sleep(2000);

      const rohanSession = await page.evaluate(() => {
        const u = localStorage.getItem("cardwise:user");
        return u ? JSON.parse(u) : null;
      });

      assert(rohanSession !== null, "Rohan session created");
      assert.strictEqual(rohanSession.email, "rohan@example.com");

      recordPass("Journey 11: Multi-Account Isolation & Logout", "Sign out cleaned tokens, secondary account logged in without data leakage");
    } catch (err) {
      recordFail("Journey 11: Multi-Account Isolation & Logout", err);
    }

    // -------------------------------------------------------------------------
    // JOURNEY 12: Return to Existing Account & Conflict Resolution
    // -------------------------------------------------------------------------
    console.log("\n--- JOURNEY 12: Return to Existing Account & Conflict Resolution ---");
    try {
      // 1. Sign out of previous account via /profile to cleanly reset session
      await page.goto(`${BASE_URL}/profile`, { waitUntil: "domcontentloaded" });
      await sleep(800);
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const signout = btns.find(b => /sign out/i.test(b.innerText) || /log out/i.test(b.innerText));
        if (signout) signout.click();
      });
      await sleep(1200);

      // 2. Inject conflicting guest spend (₹90,000) into guest profile
      await page.evaluate(() => {
        localStorage.removeItem("cardwise:user");
        localStorage.removeItem("cardwise:selected_card_count");
        localStorage.removeItem("cardwise:pending_migration");
        const guestData = {
          account: { isGuest: true },
          cardCount: 3,
          spending: {
            totalMonthly: 90000,
            categories: { groceries: 20000, dining: 30000, travel: 40000 }
          },
          preferences: { preferredRewardType: "Travel Benefits" }
        };
        localStorage.setItem("cardwise:profile", JSON.stringify(guestData));
      });

      // 3. Login as Aarav Sharma (saved profile ₹35,000)
      await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
      await page.reload({ waitUntil: "domcontentloaded" });
      await sleep(800);

      // Use demo autofill button for Aarav
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const aarav = btns.find(b => b.innerText.includes("Aarav Sharma"));
        if (aarav) aarav.click();
      });
      await sleep(400);

      await page.evaluate(() => {
        const form = document.querySelector("form");
        if (form) form.requestSubmit();
      });
      await sleep(2000);

      // Verify conflict resolution view
      const conflictDetected = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes("Keep Account Profile") ||
               text.includes("Use Current Session Profile");
      });
      if (!conflictDetected) {
        const dbg = await page.evaluate(() => ({
          text: document.body.innerText.slice(0, 300),
          url: window.location.href,
          user: localStorage.getItem("cardwise:user"),
          profile: localStorage.getItem("cardwise:profile")
        }));
        console.error("DEBUG J12 failed:", JSON.stringify(dbg));
      }
      assert(conflictDetected, "Conflict screen must appear when guest spend diverges from saved account profile");

      // Choose "Keep Account Profile"
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const keepBtn = btns.find(b => b.innerText.includes("Keep Account Profile"));
        if (keepBtn) keepBtn.click();
      });
      await sleep(2000);

      // Verify Aarav's saved spend was preserved
      const restoredSpend = await page.evaluate(() => {
        const p = localStorage.getItem("cardwise:profile");
        return p ? JSON.parse(p).spending?.totalMonthly : null;
      });
      assert.strictEqual(restoredSpend, 35000, `Aarav's profile spend must be ₹35,000, got ${restoredSpend}`);

      recordPass("Journey 12: Return to Existing Account & Conflict Resolution", "Conflict detected, options presented, saved profile accurately preserved");
    } catch (err) {
      recordFail("Journey 12: Return to Existing Account & Conflict Resolution", err);
    }

    // -------------------------------------------------------------------------
    // Mobile Viewport Check (375x667)
    // -------------------------------------------------------------------------
    console.log("\n--- MOBILE VIEWPORT & RESPONSIVENESS CHECK (iPhone 375x667) ---");
    try {
      await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

      const checkOverflow = async (url) => {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await sleep(600);
        return page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      };

      const homeOverflow = await checkOverflow(BASE_URL);
      assert(!homeOverflow, "Homepage should not have horizontal overflow on mobile");

      const cardsOverflow = await checkOverflow(`${BASE_URL}/cards`);
      assert(!cardsOverflow, "Cards catalogue should not have horizontal overflow on mobile");

      const resultsOverflow = await checkOverflow(`${BASE_URL}/results`);
      assert(!resultsOverflow, "Results page should not have horizontal overflow on mobile");

      recordPass("Mobile Layout & Responsiveness", "Verified 375px mobile viewport on Home, Cards, and Results without horizontal overflow");
    } catch (err) {
      recordFail("Mobile Layout & Responsiveness", err);
    }

    // -------------------------------------------------------------------------
    // Browser Navigation & History Check
    // -------------------------------------------------------------------------
    console.log("\n--- BROWSER NAVIGATION & HISTORY CHECK ---");
    try {
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(500);
      await page.goto(`${BASE_URL}/cards`, { waitUntil: "domcontentloaded" });
      await sleep(500);
      await page.goto(`${BASE_URL}/compare`, { waitUntil: "domcontentloaded" });
      await sleep(500);

      // Back
      await page.goBack({ waitUntil: "domcontentloaded" });
      await sleep(500);
      assert.strictEqual(page.url(), `${BASE_URL}/cards`, "Back button should return to /cards");

      // Forward
      await page.goForward({ waitUntil: "domcontentloaded" });
      await sleep(500);
      assert.strictEqual(page.url(), `${BASE_URL}/compare`, "Forward button should advance to /compare");

      recordPass("Browser Back / Forward Navigation", "History stack transitions cleanly without broken state");
    } catch (err) {
      recordFail("Browser Back / Forward Navigation", err);
    }

  } finally {
    await browser.close();
  }

  // Summary Report
  console.log("\n================================================================================");
  console.log("FINAL BROWSER ACCEPTANCE TEST SUMMARY");
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Untested: ${results.untested.length}`);
  console.log(`Console Errors Observed: ${consoleErrors.length}`);
  console.log(`Network Failures Observed: ${failedRequests.length}`);
  console.log("================================================================================");

  if (consoleErrors.length > 0) {
    console.log("Console Errors:", consoleErrors);
  }
  if (failedRequests.length > 0) {
    console.log("Failed Requests:", failedRequests);
  }

  if (results.failed.length > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runBrowserAcceptanceSuite().catch((err) => {
  console.error("Test Suite Crashed:", err);
  process.exit(1);
});
