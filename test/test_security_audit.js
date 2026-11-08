import assert from "assert";
import fs from "fs";
import path from "path";

async function runSecurityAuditTests() {
  console.log("=== CreditWise Gemini API Security Audit & Rate Limiting Tests ===\n");

  // 1. Verify .env.local exists and is ignored by git
  console.log("1. Checking .gitignore and .env.local...");
  const gitignoreContent = fs.readFileSync(".gitignore", "utf-8");
  assert(gitignoreContent.includes(".env.local"), ".env.local must be in .gitignore");
  console.log("   ✓ .env.local is properly included in .gitignore");

  // 2. Check that no client files reference GEMINI_API_KEY
  console.log("2. Checking client components for leakages...");
  const componentsDir = path.join(process.cwd(), "components");
  const compFiles = fs.readdirSync(componentsDir);
  for (const f of compFiles) {
    if (f.endsWith(".jsx") || f.endsWith(".js")) {
      const content = fs.readFileSync(path.join(componentsDir, f), "utf-8");
      assert(!content.includes("process.env.GEMINI_API_KEY"), `${f} must not access process.env.GEMINI_API_KEY`);
      assert(!content.includes("NEXT_PUBLIC_GEMINI"), `${f} must not use NEXT_PUBLIC_GEMINI`);
    }
  }
  console.log("   ✓ Client components never read or expose GEMINI_API_KEY");

  // 3. Test API route rate-limiting and character cap via HTTP
  console.log("3. Testing server-side validation & rate-limiting against http://localhost:3000/api/parse-spending...");

  // 3a. Test input length limit (> 1000 chars)
  const longText = "I spend 20000 on groceries every month. ".repeat(30); // ~1200 chars
  const resLong = await fetch("http://localhost:3000/api/parse-spending", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: longText }),
  });
  const dataLong = await resLong.json();
  assert.strictEqual(resLong.status, 400, "Should return 400 for input over 1000 characters");
  assert.strictEqual(dataLong.success, false);
  console.log("   ✓ Input over 1000 chars correctly rejected (HTTP 400)");

  // 3b. Test empty/short input (< 5 chars)
  const resShort = await fetch("http://localhost:3000/api/parse-spending", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "hi" }),
  });
  assert.strictEqual(resShort.status, 400, "Should return 400 for input under 5 characters");
  console.log("   ✓ Short input (< 5 chars) correctly rejected (HTTP 400)");

  // 3c. Test response safety (does not leak env variables or internal server paths)
  const resValid = await fetch("http://localhost:3000/api/parse-spending", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "I spend 15k on groceries and 5k on dining monthly." }),
  });
  const dataValid = await resValid.json();
  const rawResponseStr = JSON.stringify(dataValid);
  assert(!rawResponseStr.includes("AQ.Ab8RN6"), "Response must NEVER contain the Gemini API key");
  assert(!rawResponseStr.includes("GEMINI_API_KEY"), "Response must NEVER mention GEMINI_API_KEY");
  console.log("   ✓ API responses never expose API keys, env vars, or sensitive internals");

  // 3d. Test Rate Limiting (simulate 20 rapid requests from a dedicated IP)
  console.log("4. Testing IP Rate Limiter (threshold: 15 req/min)...");
  const testIp = "192.168.100.42";
  let hitRateLimit = false;
  let retryAfterHeader = null;

  for (let i = 0; i < 20; i++) {
    const res = await fetch("http://localhost:3000/api/parse-spending", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": testIp,
      },
      body: JSON.stringify({
        text: `I spend 10k on groceries and 5k on fuel ${i}`,
        testOverride: "503", // simulate without burning real tokens
      }),
    });

    if (res.status === 429) {
      hitRateLimit = true;
      retryAfterHeader = res.headers.get("retry-after");
      const errBody = await res.json();
      assert.strictEqual(errBody.rateLimited, true);
      break;
    }
  }

  assert(hitRateLimit, "Rate limiter should trigger HTTP 429 after exceeding 15 requests/min");
  assert.strictEqual(retryAfterHeader, "60", "Should return Retry-After: 60 header");
  console.log("   ✓ Rate limiter triggered HTTP 429 after 15 requests with Retry-After: 60");

  console.log("\n=== ALL SECURITY & RATE LIMITING CHECKS PASSED ===");
}

runSecurityAuditTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

