import puppeteer from "puppeteer-core";
import assert from "assert";

const BASE_URL = "http://localhost:3000";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const results = {
  passed: [],
  failed: []
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

async function runPrimaryJourneySuite() {
  console.log("================================================================================");
  console.log("CREDITWISE — PRIMARY USER JOURNEY DISCOVERABILITY BROWSER TEST SUITE");
  console.log("Testing live application on", BASE_URL);
  console.log("================================================================================\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,900"]
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Homepage Core Proposition & Dual Actions
    // -------------------------------------------------------------------------
    console.log("--- TEST 1: Homepage Core Proposition & Dual Actions ---");
    try {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(600);

      const headline = await page.$eval("h1", (el) => el.innerText.trim());
      assert(
        headline.includes("Find credit cards that") && headline.includes("reward the way you spend"),
        `Headline should match required proposition, got: "${headline}"`
      );

      const pageText = await page.evaluate(() => document.body.innerText);
      assert(
        pageText.includes("Tell us where your money goes. We'll help you discover credit cards that could give you better returns"),
        "Supporting explanation must match required copy"
      );

      // Verify Primary CTA exists in hero section with stronger prominence
      const primaryCta = await page.$("section a[href='/onboarding']");
      assert(primaryCta !== null, "Primary CTA in hero linking to /onboarding must exist");
      const primaryText = await page.evaluate((el) => el.innerText, primaryCta);
      assert(primaryText.includes("Find cards that fit my spending"), `Primary CTA text mismatch: ${primaryText}`);

      // Verify Secondary CTA exists
      const secondaryCta = await page.$("a[href='/cards']");
      assert(secondaryCta !== null, "Secondary CTA linking to /cards must exist");
      const secondaryText = await page.evaluate((el) => el.innerText, secondaryCta);
      assert(secondaryText.includes("Explore all 31 cards"), `Secondary CTA text mismatch: ${secondaryText}`);

      recordPass(
        "Test 1: Homepage Core Proposition & Dual Actions",
        "Clear headline, supporting copy, and prominent dual CTAs confirmed"
      );
    } catch (err) {
      recordFail("Test 1: Homepage Core Proposition & Dual Actions", err);
    }

    // -------------------------------------------------------------------------
    // TEST 2: Homepage Primary CTA Navigation
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: Homepage Primary CTA Navigation ---");
    try {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(600);

      const cta = await page.evaluateHandle(() => {
        const links = Array.from(document.querySelectorAll("a[href='/onboarding']"));
        return links.find((l) => l.innerText.includes("Find cards that fit my spending"));
      });
      assert(cta.asElement() !== null, "Find cards that fit my spending link must be present");
      await cta.click();
      await sleep(1000);

      const currentUrl = page.url();
      assert(currentUrl.includes("/onboarding"), `Primary CTA must route to /onboarding, landed on ${currentUrl}`);

      const onbTitle = await page.evaluate(() => document.querySelector("h1, h2")?.innerText || "");
      assert(onbTitle.length > 0, "Onboarding questionnaire must render");

      recordPass("Test 2: Homepage Primary CTA Navigation", "Routes directly to spending intelligence onboarding");
    } catch (err) {
      recordFail("Test 2: Homepage Primary CTA Navigation", err);
    }

    // -------------------------------------------------------------------------
    // TEST 3: Homepage Secondary CTA Navigation
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: Homepage Secondary CTA Navigation ---");
    try {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(600);

      const secCta = await page.evaluateHandle(() => {
        const links = Array.from(document.querySelectorAll("a[href='/cards']"));
        return links.find((l) => l.innerText.includes("Explore all 31 cards"));
      });
      assert(secCta.asElement() !== null, "Explore all 31 cards link must be present");
      await secCta.click();
      await sleep(1000);

      const currentUrl = page.url();
      assert(currentUrl.includes("/cards"), `Secondary CTA must route to /cards, landed on ${currentUrl}`);

      const cardCount = await page.evaluate(() => document.querySelectorAll("a[href^='/cards/']").length);
      assert(cardCount >= 31, `Catalogue should render at least 31 cards, found ${cardCount}`);

      recordPass("Test 3: Homepage Secondary CTA Navigation", `Routes directly to all 31 cards catalogue (${cardCount} links)`);
    } catch (err) {
      recordFail("Test 3: Homepage Secondary CTA Navigation", err);
    }

    // -------------------------------------------------------------------------
    // TEST 4: Desktop Navigation "Find my card" Action
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: Desktop Navigation 'Find my card' Action ---");
    try {
      await page.setViewport({ width: 1280, height: 900 });
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(600);

      // Verify nav buttons
      const navLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("header nav a, header a"))
          .filter((a) => a.innerText.toLowerCase().includes("find my card"))
          .map((a) => ({ text: a.innerText.trim(), href: a.getAttribute("href") }));
      });
      assert(navLinks.length > 0, "Find my card action must exist in header navigation");
      assert(navLinks.some((l) => l.href === "/onboarding"), "Navbar Find my card must point to /onboarding");

      // Click desktop action button
      const navButton = await page.evaluateHandle(() => {
        const links = Array.from(document.querySelectorAll("header a"));
        return links.find((l) => l.innerText.includes("Find my card") && l.getAttribute("href") === "/onboarding");
      });
      await navButton.click();
      await sleep(1000);

      assert(page.url().includes("/onboarding"), "Navbar CTA must navigate to /onboarding");
      recordPass("Test 4: Desktop Navigation 'Find my card'", "Clearly visible header CTA routes cleanly to /onboarding");
    } catch (err) {
      recordFail("Test 4: Desktop Navigation 'Find my card'", err);
    }

    // -------------------------------------------------------------------------
    // TEST 5: Mobile Navigation "Find my card" Action (375x667)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 5: Mobile Navigation 'Find my card' (iPhone 375x667) ---");
    try {
      await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(600);

      // Click hamburger menu
      const hamburger = await page.$("button[aria-label='Toggle navigation menu']");
      assert(hamburger !== null, "Mobile hamburger toggle must exist");
      await hamburger.click();
      await sleep(400);

      // Verify and click Find my card link in mobile drawer
      const clicked = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("a"));
        const link = links.find((l) => l.innerText.includes("Find my card") && l.getAttribute("href") === "/onboarding");
        if (link) {
          link.click();
          return true;
        }
        return false;
      });
      assert(clicked, "Mobile drawer must contain clickable 'Find my card' pointing to /onboarding");
      await sleep(1000);

      assert(page.url().includes("/onboarding"), `Mobile navigation must route to /onboarding, landed on ${page.url()}`);
      recordPass("Test 5: Mobile Navigation 'Find my card'", "Mobile menu provides accessible 'Find my card' CTA");
    } catch (err) {
      recordFail("Test 5: Mobile Navigation 'Find my card'", err);
    } finally {
      // Restore desktop viewport
      await page.setViewport({ width: 1280, height: 900 });
    }

    // -------------------------------------------------------------------------
    // TEST 6: All Cards Catalogue Discovery Prompt
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 6: All Cards Catalogue Discovery Prompt ---");
    try {
      await page.goto(`${BASE_URL}/cards`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const promptData = await page.evaluate(() => {
        const text = document.body.innerText;
        const hasPrompt = text.includes("Not sure which card is right for you?");
        const hasSupport = text.includes("Tell us about your spending habits and discover which cards from our catalogue could reward you better.");
        const ctaBtn = Array.from(document.querySelectorAll("a")).find((a) =>
          a.innerText.includes("Get personalized recommendations")
        );
        return {
          hasPrompt,
          hasSupport,
          ctaHref: ctaBtn ? ctaBtn.getAttribute("href") : null
        };
      });

      assert(promptData.hasPrompt, "Catalogue must include 'Not sure which card is right for you?' prompt");
      assert(promptData.hasSupport, "Catalogue must include supporting copy about spending habits");
      assert.strictEqual(promptData.ctaHref, "/onboarding", "Discovery CTA must link to /onboarding");

      // Click the discovery CTA
      const discCta = await page.evaluateHandle(() => {
        const links = Array.from(document.querySelectorAll("a"));
        return links.find((l) => l.innerText.includes("Get personalized recommendations"));
      });
      await discCta.click();
      await sleep(1000);
      assert(page.url().includes("/onboarding"), "Discovery CTA must open /onboarding");

      recordPass("Test 6: All Cards Catalogue Discovery Prompt", "Top discovery card guides unsure users to personalized flow");
    } catch (err) {
      recordFail("Test 6: All Cards Catalogue Discovery Prompt", err);
    }

    // -------------------------------------------------------------------------
    // TEST 7: Card Detail Contextual Fit Action (Without Profile)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 7: Card Detail Contextual Fit Action (New Guest) ---");
    try {
      // Clear profile to test new guest state
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => localStorage.clear());

      const testCards = ["amazon-pay-icici", "hdfc-infinia", "axis-horizon"];
      for (const slug of testCards) {
        await page.goto(`${BASE_URL}/cards/${slug}`, { waitUntil: "domcontentloaded" });
        await sleep(600);

        const fitPrompt = await page.evaluate(() => {
          const text = document.body.innerText;
          const hasHeading = text.includes("Wondering if this card is right for your spending?");
          const hasSupport = text.includes("Compare this card against other options based on the way you spend.");
          const btn = Array.from(document.querySelectorAll("a")).find((a) => a.innerText.includes("Check my card fit"));
          return {
            hasHeading,
            hasSupport,
            hasBtn: Boolean(btn),
            btnHref: btn ? btn.getAttribute("href") : null
          };
        });

        assert(fitPrompt.hasHeading, `Heading missing on /cards/${slug}`);
        assert(fitPrompt.hasSupport, `Supporting text missing on /cards/${slug}`);
        assert(fitPrompt.hasBtn, `Check my card fit button missing on /cards/${slug}`);
        assert.strictEqual(fitPrompt.btnHref, "/onboarding", `Button must link to /onboarding for guest on /cards/${slug}`);
      }

      recordPass(
        "Test 7: Card Detail Contextual Fit Action (New Guest)",
        "Prompt present across representative cards (Lifetime Free, Premium, Travel) linking to /onboarding"
      );
    } catch (err) {
      recordFail("Test 7: Card Detail Contextual Fit Action (New Guest)", err);
    }

    // -------------------------------------------------------------------------
    // TEST 8: Card Detail Contextual Fit Action (With Existing Profile)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 8: Card Detail Contextual Fit Action (Reusing Saved Profile) ---");
    try {
      // Inject saved profile into localStorage
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        const savedProfile = {
          account: { fullName: "Test User", email: "test@example.com", isGuest: false },
          cardCount: 2,
          spending: {
            totalMonthly: 45000,
            categories: { groceries: 12000, dining: 10000, shopping: 15000, fuel: 8000 }
          },
          preferences: { preferredRewardType: "Cashback" }
        };
        localStorage.setItem("cardwise:profile", JSON.stringify(savedProfile));
      });

      await page.goto(`${BASE_URL}/cards/sbi-cashback`, { waitUntil: "domcontentloaded" });
      await sleep(600);

      const fitWithProfile = await page.evaluate(() => {
        const text = document.body.innerText;
        const hasReadyBadge = text.includes("Your spending profile is ready");
        const btn = Array.from(document.querySelectorAll("a")).find((a) => a.innerText.includes("Check my card fit"));
        return {
          hasReadyBadge,
          btnHref: btn ? btn.getAttribute("href") : null
        };
      });

      assert(fitWithProfile.hasReadyBadge, "Should show spending profile ready status indicator");
      assert.strictEqual(fitWithProfile.btnHref, "/results", "Should link directly to /results when profile is already confirmed");

      // Click button
      const checkBtn = await page.evaluateHandle(() => {
        const links = Array.from(document.querySelectorAll("a"));
        return links.find((l) => l.innerText.includes("Check my card fit"));
      });
      await checkBtn.click();
      await sleep(1000);

      assert(page.url().includes("/results"), `Should navigate directly to /results, landed on ${page.url()}`);
      recordPass(
        "Test 8: Card Detail Contextual Fit Action (With Existing Profile)",
        "Reuses saved spending profile without forcing user to repeat questions"
      );
    } catch (err) {
      recordFail("Test 8: Card Detail Contextual Fit Action (With Existing Profile)", err);
    }

    // -------------------------------------------------------------------------
    // TEST 9: Comparison Page Guidance Prompt
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 9: Comparison Page Guidance Prompt ---");
    try {
      await page.goto(`${BASE_URL}/compare`, { waitUntil: "domcontentloaded" });
      await sleep(800);

      const compPrompt = await page.evaluate(() => {
        const text = document.body.innerText;
        const hasPrompt = text.includes("Want automated matching instead of comparing manually?");
        const btn = Array.from(document.querySelectorAll("a")).find((a) =>
          a.innerText.includes("Find cards that fit my spending")
        );
        return {
          hasPrompt,
          btnHref: btn ? btn.getAttribute("href") : null
        };
      });

      assert(compPrompt.hasPrompt, "Compare page must include guidance prompt");
      assert.strictEqual(compPrompt.btnHref, "/onboarding", "Prompt CTA must link to /onboarding");

      recordPass("Test 9: Comparison Page Guidance Prompt", "Provides natural exit to automated recommendation flow");
    } catch (err) {
      recordFail("Test 9: Comparison Page Guidance Prompt", err);
    }

    // -------------------------------------------------------------------------
    // TEST 10: Full End-to-End Guest Onboarding to Results
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 10: Full End-to-End Guest Onboarding to Results ---");
    try {
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => localStorage.clear());

      // Click primary CTA from homepage
      await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
      await sleep(500);

      const primary = await page.evaluateHandle(() => {
        const links = Array.from(document.querySelectorAll("a[href='/onboarding']"));
        return links.find((l) => l.innerText.includes("Find cards that fit my spending"));
      });
      await primary.click();
      await sleep(800);

      // Step through all 7 onboarding steps
      for (let step = 1; step <= 6; step++) {
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll("button"));
          const continueBtn = btns.find((b) => b.innerText.trim() === "Continue" && !b.disabled);
          if (continueBtn) continueBtn.click();
        });
        await sleep(400);
      }

      // Step 7: Final submit
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const finishBtn = btns.find((b) => b.innerText.includes("Find Cards That Fit") && !b.disabled);
        if (finishBtn) finishBtn.click();
      });
      await sleep(2500);

      const onResults = page.url().includes("/results");
      assert(onResults, `Should arrive on /results, currently on ${page.url()}`);

      const resultsText = await page.evaluate(() => document.body.innerText.toUpperCase());
      assert(resultsText.includes("NET ANNUAL VALUE") || resultsText.includes("EST. GROSS REWARDS"), "Results metrics present");

      recordPass(
        "Test 10: Full End-to-End Guest Onboarding to Results",
        "Homepage CTA successfully launches 7-step wizard yielding personalized recommendations"
      );
    } catch (err) {
      recordFail("Test 10: Full End-to-End Guest Onboarding to Results", err);
    }

  } finally {
    await browser.close();
  }

  // Summary
  console.log("\n================================================================================");
  console.log("TEST RUN SUMMARY");
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Console Errors: ${consoleErrors.length}`);
  console.log("================================================================================");

  if (results.failed.length > 0) {
    process.exit(1);
  }
}

runPrimaryJourneySuite().catch((err) => {
  console.error("FATAL ERROR IN TEST SUITE:", err);
  process.exit(1);
});
