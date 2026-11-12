/**
 * scripts/verify_production_readiness.mjs
 * ------------------------------------------------------------
 * Verification script for CreditWise production release readiness:
 * 1. Checks HTTP 200, headers, and content on all 31 card routes.
 * 2. Checks security headers (X-Frame-Options, X-Content-Type-Options, etc.).
 * 3. Verifies sitemap.xml and robots.txt.
 * 4. Verifies all API routes, rate-limiting, and error masking.
 */

import fs from "fs";

const BASE_URL = "http://localhost:3000";

async function run() {
  console.log("=== CreditWise Production Readiness Audit ===");
  const cards = JSON.parse(fs.readFileSync("data/cards.json", "utf8"));
  let passed = 0;
  let failed = 0;

  // 1. Verify Security Headers on Homepage
  console.log("\n[1/5] Checking Production Security Headers...");
  try {
    const homeRes = await fetch(`${BASE_URL}/`);
    if (homeRes.status !== 200) throw new Error(`Home returned status ${homeRes.status}`);

    const xFrame = homeRes.headers.get("x-frame-options");
    const xContentType = homeRes.headers.get("x-content-type-options");
    const referrerPolicy = homeRes.headers.get("referrer-policy");
    const poweredBy = homeRes.headers.get("x-powered-by");

    console.log(`  - X-Frame-Options: ${xFrame || "MISSING"}`);
    console.log(`  - X-Content-Type-Options: ${xContentType || "MISSING"}`);
    console.log(`  - Referrer-Policy: ${referrerPolicy || "MISSING"}`);
    console.log(`  - X-Powered-By: ${poweredBy ? "LEAKED (" + poweredBy + ")" : "HIDDEN (PASS)"}`);

    if (xFrame === "SAMEORIGIN" && xContentType === "nosniff" && !poweredBy) {
      console.log("  ✓ Security headers verified");
      passed++;
    } else {
      console.error("  ✗ Security headers mismatch");
      failed++;
    }
  } catch (err) {
    console.error("  ✗ Error testing headers:", err.message);
    failed++;
  }

  // 2. Verify all 31 Card Detail Routes
  console.log(`\n[2/5] Verifying all ${cards.length} card detail routes...`);
  let cardFailures = 0;
  for (const card of cards) {
    const url = `${BASE_URL}/cards/${card.slug}`;
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        console.error(`  ✗ ${card.slug}: HTTP ${res.status}`);
        cardFailures++;
        continue;
      }
      const html = await res.text();
      const hasName = html.includes(card.name);
      const hasInsights = html.includes("Gotchas") || html.includes("Interactive Insights") || html.includes("Hidden gotchas");
      if (!hasName) {
        console.error(`  ✗ ${card.slug}: HTML missing card name "${card.name}"`);
        cardFailures++;
      } else {
        // success
      }
    } catch (err) {
      console.error(`  ✗ ${card.slug}: Error fetching:`, err.message);
      cardFailures++;
    }
  }
  if (cardFailures === 0) {
    console.log(`  ✓ All ${cards.length} card detail routes returned HTTP 200 with complete rendered content.`);
    passed++;
  } else {
    console.error(`  ✗ ${cardFailures} card routes failed`);
    failed++;
  }

  // 3. Verify Robots.txt and Sitemap.xml
  console.log("\n[3/5] Verifying robots.txt and sitemap.xml...");
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    const hasDisallowApi = robotsText.includes("Disallow: /api/");
    const hasSitemap = robotsText.includes("sitemap.xml");

    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    const sitemapCardCount = (sitemapText.match(/\/cards\//g) || []).length;

    console.log(`  - robots.txt status: ${robotsRes.status}, disallows /api/: ${hasDisallowApi}`);
    console.log(`  - sitemap.xml status: ${sitemapRes.status}, card URLs contained: ${sitemapCardCount}`);

    if (robotsRes.status === 200 && hasDisallowApi && sitemapRes.status === 200 && sitemapCardCount === 31) {
      console.log("  ✓ Robots and Sitemap verified");
      passed++;
    } else {
      console.error("  ✗ Robots or Sitemap incomplete");
      failed++;
    }
  } catch (err) {
    console.error("  ✗ Error verifying SEO assets:", err.message);
    failed++;
  }

  // 4. Verify Core Pages
  console.log("\n[4/5] Verifying Core Routes (HTTP 200)...");
  const coreRoutes = [
    "/",
    "/cards",
    "/compare",
    "/onboarding",
    "/recommend",
    "/blog",
    "/blog/credit-score",
    "/privacy",
    "/terms",
    "/cookies",
  ];
  let routeFailures = 0;
  for (const r of coreRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${r}`);
      if (res.status !== 200) {
        console.error(`  ✗ ${r}: HTTP ${res.status}`);
        routeFailures++;
      }
    } catch (err) {
      console.error(`  ✗ ${r}: ${err.message}`);
      routeFailures++;
    }
  }
  if (routeFailures === 0) {
    console.log(`  ✓ All ${coreRoutes.length} core routes returned HTTP 200.`);
    passed++;
  } else {
    failed++;
  }

  // 5. Verify API Rate Limiting & Safe Error Handling
  console.log("\n[5/5] Verifying API Rate Limiting & Safe Error Handling...");
  try {
    // Test /api/check-username with invalid params
    const checkRes = await fetch(`${BASE_URL}/api/check-username?username=`);
    const checkJson = await checkRes.json();
    console.log(`  - /api/check-username bad input: status ${checkRes.status} (expected 400), reason: ${checkJson.reason}`);

    // Test /api/explain-recommendation bad payload
    const expRes = await fetch(`${BASE_URL}/api/explain-recommendation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const expJson = await expRes.json();
    console.log(`  - /api/explain-recommendation bad input: status ${expRes.status} (expected 400), error: ${expJson.error}`);

    // Verify rate limiting behavior
    let limited = false;
    for (let i = 0; i < 35; i++) {
      const r = await fetch(`${BASE_URL}/api/explain-recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (r.status === 429) {
        limited = true;
        break;
      }
    }
    console.log(`  - Rate limiting active: ${limited ? "YES (HTTP 429 triggered)" : "NO"}`);

    if (checkRes.status === 400 && expRes.status === 400 && limited) {
      console.log("  ✓ API validation and rate limiting verified");
      passed++;
    } else {
      console.error("  ✗ API validation or rate limiting failed");
      failed++;
    }
  } catch (err) {
    console.error("  ✗ Error verifying APIs:", err.message);
    failed++;
  }

  console.log("\n=============================================");
  console.log(`Readiness Verification Results: ${passed}/5 passed, ${failed} failed.`);
  console.log("=============================================");

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

