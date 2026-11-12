import assert from "assert";
import {
  hashPassword,
  hasMeaningfulConflict,
  getActiveGuestProfile,
  deleteAccountProfile,
  ACCOUNT_PROFILES_KEY,
  ACTIVE_PROFILE_KEY,
  ACTIVE_USER_KEY,
  SESSION_ID_KEY,
  USERS_LIST_KEY
} from "../lib/profileStorage.js";
import { saveFeedback, saveConsentRecord } from "../lib/feedbackService.js";

async function runComprehensiveSecurityTests() {
  console.log("=== CreditWise Comprehensive Security, Privacy & Auth Regression Suite ===\n");

  // -------------------------------------------------------------
  // TEST 1: Cryptographic Password Hashing & Verification
  // -------------------------------------------------------------
  console.log("Test 1: Password Hashing & Verification...");
  const email = "security.user@example.com";
  const correctPassword = "SecurePassword123!";
  const wrongPassword = "WrongPassword123!";

  const hash1 = await hashPassword(email, correctPassword);
  const hash2 = await hashPassword(email, correctPassword);
  const hashWrong = await hashPassword(email, wrongPassword);
  const hashOtherEmail = await hashPassword("other@example.com", correctPassword);

  assert(hash1 && hash1.length === 64, "Password hash should be 64-character SHA-256 hex string");
  assert.strictEqual(hash1, hash2, "Identical password and email must produce deterministic identical hash");
  assert.notStrictEqual(hash1, hashWrong, "Different password must produce completely different hash");
  assert.notStrictEqual(hash1, hashOtherEmail, "Same password with different email salt must produce different hash (rainbow table prevention)");
  console.log("   ✓ Salted SHA-256 password hashing and validation verified");

  // -------------------------------------------------------------
  // TEST 2: Guest and Registered User Session Isolation
  // -------------------------------------------------------------
  console.log("\nTest 2: Guest vs Registered User Session Isolation...");
  // Simulate localStorage environment
  const mockStorage = {};
  global.window = {
    localStorage: {
      getItem: (key) => mockStorage[key] || null,
      setItem: (key, val) => { mockStorage[key] = String(val); },
      removeItem: (key) => { delete mockStorage[key]; },
    },
    dispatchEvent: () => {}
  };

  // Scenario A: Guest profile exists, no active user
  mockStorage[ACTIVE_PROFILE_KEY] = JSON.stringify({
    account: { isGuest: true },
    spending: { totalMonthly: 30000 }
  });
  let activeGuest = getActiveGuestProfile();
  assert(activeGuest !== null, "Guest profile should be returned when user is not logged in");
  assert.strictEqual(activeGuest.account.isGuest, true);

  // Scenario B: User logs in; guest profile function must NOT return registered user profile
  mockStorage[ACTIVE_USER_KEY] = JSON.stringify({
    email: "registered@example.com",
    fullName: "Registered User"
  });
  mockStorage[ACTIVE_PROFILE_KEY] = JSON.stringify({
    account: { email: "registered@example.com", isGuest: false },
    spending: { totalMonthly: 60000 }
  });
  activeGuest = getActiveGuestProfile();
  assert.strictEqual(activeGuest, null, "getActiveGuestProfile() MUST return null when an authenticated user is active (prevent cross-account profile leakage)");
  console.log("   ✓ Profile isolation verified: active account cannot be leaked or treated as guest");

  // -------------------------------------------------------------
  // TEST 3: Conflict Resolution Detection
  // -------------------------------------------------------------
  console.log("\nTest 3: Conflict Resolution Precision...");
  const accountProf = {
    spending: {
      totalMonthly: 40000,
      categories: { groceries: 10000, dining: 10000, shopping: 20000 }
    }
  };
  const identicalGuestProf = {
    spending: {
      totalMonthly: 40500, // < 2000 diff
      categories: { groceries: 10200, dining: 10100, shopping: 20200 } // all < 1500 diff
    }
  };
  const conflictingGuestProf = {
    spending: {
      totalMonthly: 75000, // > 2000 diff
      categories: { groceries: 25000, dining: 25000, shopping: 25000 }
    }
  };

  assert.strictEqual(hasMeaningfulConflict(accountProf, identicalGuestProf), false, "Minor variations (< ₹2,000 total) should not trigger conflict alert");
  assert.strictEqual(hasMeaningfulConflict(accountProf, conflictingGuestProf), true, "Divergent spending patterns must trigger conflict resolution flow");
  console.log("   ✓ Conflict detection accurately differentiates minor variance from meaningful profile divergence");

  // -------------------------------------------------------------
  // TEST 4: Account Deletion Hygiene
  // -------------------------------------------------------------
  console.log("\nTest 4: Account Deletion & Session Cleanup Hygiene...");
  mockStorage[ACCOUNT_PROFILES_KEY] = JSON.stringify({
    "victim@example.com": { spending: { totalMonthly: 50000 } },
    "other@example.com": { spending: { totalMonthly: 20000 } }
  });

  deleteAccountProfile("victim@example.com");
  const storedProfiles = JSON.parse(mockStorage[ACCOUNT_PROFILES_KEY]);
  assert.strictEqual(storedProfiles["victim@example.com"], undefined, "Deleted account profile must be removed from storage");
  assert.notStrictEqual(storedProfiles["other@example.com"], undefined, "Unrelated accounts must remain intact");
  console.log("   ✓ deleteAccountProfile accurately purges target account without affecting other records");

  // -------------------------------------------------------------
  // TEST 5: NoSQL & Input Sanitization in Feedback/Consent Service
  // -------------------------------------------------------------
  console.log("\nTest 5: NoSQL Injection & Sanitization in Feedback Service...");
  // Attempt NoSQL operator injection in sessionId
  const maliciousSessionObject = { "$gt": "" };
  const savedMalicious = await saveConsentRecord({
    sessionId: maliciousSessionObject,
    analyticsConsent: true,
    feedbackConsent: true
  });
  assert(savedMalicious.record.sessionId !== "[object Object]" || typeof savedMalicious.record.sessionId === "string", "SessionId must be strictly cast to string");
  assert.strictEqual(typeof savedMalicious.record.sessionId, "string", "Session ID in storage record must be a primitive string");
  assert(savedMalicious.record.sessionId.length <= 64, "Session ID must be capped at 64 characters");

  // Attempt feedback submission without consent
  const unconsentedFeedback = await saveFeedback({
    sessionId: "valid-session-id",
    consentGranted: false, // Consent NOT granted
    satisfaction: "satisfied",
    userNotes: "Great app"
  });
  assert.strictEqual(unconsentedFeedback.success, false, "Must reject feedback when consent is not granted");
  assert(unconsentedFeedback.reason.includes("Consent required"), "Reason must specify consent requirement");
  console.log("   ✓ NoSQL injection prevented and consent strictly enforced server-side");

  console.log("\n=== ALL COMPREHENSIVE SECURITY TESTS PASSED SUCCESSFULLY ===");
  process.exit(0);
}

runComprehensiveSecurityTests().catch((err) => {
  console.error("\nSecurity Test Failed:", err);
  process.exit(1);
});
