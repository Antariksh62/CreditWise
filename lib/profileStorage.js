/**
 * CreditWise — Profile Storage & User Session Transition Service
 *
 * Manages active profiles, account profiles, guest-to-registered migrations,
 * conflict detection, and secure data isolation between sessions.
 */

export const ACCOUNT_PROFILES_KEY = "cardwise:account_profiles";
export const ACTIVE_PROFILE_KEY = "cardwise:profile";
export const ACTIVE_USER_KEY = "cardwise:user";
export const USERS_LIST_KEY = "cardwise:users";
export const PENDING_MIGRATION_KEY = "cardwise:pending_migration";
export const SELECTED_COUNT_KEY = "cardwise:selected_card_count";
export const ANSWERS_KEY = "cardwise:answers";
export const ONBOARDING_DRAFT_KEY = "cardwise:onboarding_draft";
export const QUIZ_DRAFT_KEY = "cardwise:quiz_draft";
export const SESSION_ID_KEY = "cardwise:session_id";

/**
 * Salted SHA-256 password hashing.
 * Works both in browser (Web Crypto API) and in Node.js (crypto module fallback).
 */
export async function hashPassword(email, password) {
  if (!password) return "";
  const normalizedEmail = (email || "").trim().toLowerCase();
  const input = `${normalizedEmail}:cardwise_salt_v1:${password}`;

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Node.js fallback (tests/server-side)
  try {
    const { createHash } = await import("crypto");
    return createHash("sha256").update(input).digest("hex");
  } catch {
    return "";
  }
}

// Pre-seeded demo account profiles for sample accounts
export const DEMO_ACCOUNT_PROFILES = {
  "aarav@example.com": {
    cardCount: 2,
    account: {
      fullName: "Aarav Sharma",
      email: "aarav@example.com",
      age: 22,
      isGuest: false,
      updatedAt: "2026-11-01T10:00:00.000Z",
    },
    profile: {
      age: 22,
      employment: "salaried",
      incomeRange: "₹6L – ₹12L",
      city: "Bengaluru",
    },
    spending: {
      totalMonthly: 35000,
      categories: {
        groceries: 8000,
        dining: 6000,
        fuel: 3000,
        shopping: 9000,
        travel: 4000,
        utilities: 3000,
        entertainment: 2000,
      },
    },
    preferences: {
      cardCount: 2,
      preferredRewardType: "Cashback",
      preferredCardCharacteristics: "Simplicity",
      priorities: ["Cashback", "Dining", "Shopping"],
      feeTolerance: "moderate-fee",
      rewardStyle: "simple",
      travelFrequency: "Sometimes (2–4 trips/year)",
      internationalSpend: "Occasionally (online or travel)",
      creditScoreRange: "750+ (Excellent)",
    },
    existingCards: ["sbi-cashback"],
  },
  "rohan@example.com": {
    cardCount: 2,
    account: {
      fullName: "Rohan Mehta",
      email: "rohan@example.com",
      age: 29,
      isGuest: false,
      updatedAt: "2026-11-02T14:30:00.000Z",
    },
    profile: {
      age: 29,
      employment: "salaried",
      incomeRange: "₹12L – ₹25L",
      city: "Mumbai",
    },
    spending: {
      totalMonthly: 68000,
      categories: {
        groceries: 8000,
        dining: 14000,
        fuel: 5000,
        shopping: 15000,
        travel: 18000,
        utilities: 5000,
        other: 3000,
      },
    },
    preferences: {
      cardCount: 2,
      preferredRewardType: "Travel Benefits",
      preferredCardCharacteristics: "Premium Benefits",
      priorities: ["Airport lounge access", "Travel", "Dining"],
      feeTolerance: "moderate-fee",
      rewardStyle: "optimizer",
      travelFrequency: "Frequently (5+ trips/year)",
      internationalSpend: "Regularly (frequent forex spend)",
      creditScoreRange: "750+ (Excellent)",
    },
    existingCards: ["axis-horizon", "hdfc-regalia-gold"],
  },
};

/**
 * Retrieve all account profiles stored in localStorage.
 */
export function getAccountProfiles() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACCOUNT_PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save an account profile for a specific user email.
 */
export function saveAccountProfile(email, profile) {
  if (typeof window === "undefined" || !email) return;
  try {
    const key = email.trim().toLowerCase();
    const store = getAccountProfiles();
    store[key] = {
      ...profile,
      account: {
        ...(profile.account || {}),
        email: key,
        isGuest: false,
        updatedAt: new Date().toISOString(),
      },
    };
    window.localStorage.setItem(ACCOUNT_PROFILES_KEY, JSON.stringify(store));
  } catch {
    // ignore quota issues
  }
}

/**
 * Get the saved profile for a registered user email.
 * Checks localStorage store first, falling back to pre-seeded demo accounts.
 */
export function getAccountProfile(email) {
  if (!email) return null;
  const key = email.trim().toLowerCase();
  const store = getAccountProfiles();
  if (store[key]) {
    return store[key];
  }
  if (DEMO_ACCOUNT_PROFILES[key]) {
    return DEMO_ACCOUNT_PROFILES[key];
  }
  return null;
}

/**
 * Retrieve the active guest profile from localStorage.
 *
 * SECURITY GUARANTEE:
 * Only returns a profile if it is genuinely a guest profile
 * (i.e. has isGuest: true or no active authenticated user session).
 * If the profile belongs to another registered user, returns null
 * to prevent cross-account data leaks.
 */
export function getActiveGuestProfile() {
  if (typeof window === "undefined") return null;
  try {
    const activeUserRaw = window.localStorage.getItem(ACTIVE_USER_KEY);
    const activeUser = activeUserRaw ? JSON.parse(activeUserRaw) : null;
    const isAuthenticated = Boolean(activeUser && (activeUser.email || activeUser.username));

    const rawProfile = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      if (parsed && typeof parsed === "object") {
        const isMarkedGuest = parsed.account?.isGuest === true;
        const noAccountEmail = !parsed.account?.email || parsed.account?.email.includes("@creditwise.local");

        // If marked as guest or unauthenticated, it's a valid guest profile
        if (isMarkedGuest || (!isAuthenticated && noAccountEmail)) {
          return parsed;
        }

        // If authenticated, does not count as guest profile
        return null;
      }
    }

    // Check completed quiz answers if no structured profile is found
    const rawAnswers = window.localStorage.getItem(ANSWERS_KEY);
    if (rawAnswers && !isAuthenticated) {
      const answers = JSON.parse(rawAnswers);
      if (answers && Object.keys(answers).length >= 4) {
        const baseSpend = {
          dining: answers.spendArea === "dining" ? 15000 : 4000,
          shopping: answers.spendArea === "online" ? 20000 : 5000,
          fuel: answers.spendArea === "fuel" ? 10000 : 2000,
          travel: answers.spendArea === "travel" ? 20000 : 3000,
          groceries: answers.spendArea === "online" ? 8000 : 6000,
          utilities: 3000,
        };
        const totalMonthly = Object.values(baseSpend).reduce((s, v) => s + v, 0);
        return {
          cardCount: Number(answers.cardCount) || 1,
          account: {
            fullName: "Guest User",
            email: "guest@creditwise.local",
            isGuest: true,
            updatedAt: new Date().toISOString(),
          },
          profile: {
            age: 25,
            incomeRange:
              answers.monthlySpend === "over100k"
                ? "₹25L – ₹50L"
                : answers.monthlySpend === "50to100k"
                ? "₹12L – ₹25L"
                : "₹6L – ₹12L",
            employment: "salaried",
          },
          spending: {
            totalMonthly,
            categories: baseSpend,
          },
          preferences: {
            cardCount: Number(answers.cardCount) || 1,
            priorities: [
              answers.priority === "cashback" ? "Cashback" : "",
              answers.priority === "travel" ? "Airport lounge access" : "",
              answers.priority === "rewards" ? "Shopping" : "",
              answers.priority === "lowfees" ? "Low/no annual fee" : "",
              answers.priority === "fuel" ? "Fuel savings" : "",
            ].filter(Boolean),
            rewardStyle:
              answers.priority === "cashback"
                ? "simple"
                : answers.priority === "travel"
                ? "optimizer"
                : "balanced",
            feeTolerance:
              answers.feeSensitivity === "very"
                ? "no-fee"
                : answers.feeSensitivity === "no"
                ? "high-fee"
                : "moderate-fee",
            travelFrequency:
              answers.travelFrequency === "frequently"
                ? "Frequently"
                : answers.travelFrequency === "rarely"
                ? "Rarely"
                : "Sometimes",
          },
          existingCards: [],
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Determine if two profiles have a meaningful conflict.
 * Returns true if spending totals differ by > ₹2,000, or category spends differ,
 * or card counts differ.
 */
export function hasMeaningfulConflict(profileA, profileB) {
  if (!profileA || !profileB) return false;

  const countA = Number(profileA.cardCount || profileA.preferences?.cardCount) || 1;
  const countB = Number(profileB.cardCount || profileB.preferences?.cardCount) || 1;
  if (countA !== countB) return true;

  const spendA = profileA.spending?.categories || {};
  const spendB = profileB.spending?.categories || {};

  const totalA = Number(profileA.spending?.totalMonthly) || Object.values(spendA).reduce((s, v) => s + (Number(v) || 0), 0);
  const totalB = Number(profileB.spending?.totalMonthly) || Object.values(spendB).reduce((s, v) => s + (Number(v) || 0), 0);

  if (Math.abs(totalA - totalB) > 2000) return true;

  const allKeys = new Set([...Object.keys(spendA), ...Object.keys(spendB)]);
  for (const k of allKeys) {
    const valA = Number(spendA[k]) || 0;
    const valB = Number(spendB[k]) || 0;
    if (Math.abs(valA - valB) > 1500) return true;
  }

  return false;
}

/**
 * Migrate guest profile into an authenticated user account.
 */
export function migrateGuestToAccount(user, guestProfile, chosenCardCount) {
  if (typeof window === "undefined" || !user) return null;

  const cardCount = chosenCardCount || guestProfile?.cardCount || 1;
  const email = (user.email || "").trim().toLowerCase();

  const migratedProfile = {
    ...(guestProfile || {}),
    cardCount,
    account: {
      fullName: user.fullName || "User",
      email: user.email,
      age: user.age || 25,
      isGuest: false,
      updatedAt: new Date().toISOString(),
    },
    profile: {
      ...(guestProfile?.profile || {}),
      age: user.age || guestProfile?.profile?.age || 25,
    },
    preferences: {
      ...(guestProfile?.preferences || {}),
      cardCount,
    },
  };

  try {
    // 1. Set active profile
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(migratedProfile));
    window.localStorage.setItem(SELECTED_COUNT_KEY, String(cardCount));

    // 2. Persist to account store
    saveAccountProfile(email, migratedProfile);

    // 3. Clear temporary guest artifacts
    clearTemporaryGuestData();

    // 4. Notify app
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }

  return migratedProfile;
}

/**
 * Activate a saved account profile upon login.
 */
export function activateAccountProfile(user, accountProfile) {
  if (typeof window === "undefined" || !user || !accountProfile) return;

  const cardCount = accountProfile.cardCount || accountProfile.preferences?.cardCount || 1;
  const email = (user.email || "").trim().toLowerCase();

  const activated = {
    ...accountProfile,
    account: {
      ...(accountProfile.account || {}),
      fullName: user.fullName,
      email: user.email,
      isGuest: false,
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    window.localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(activated));
    window.localStorage.setItem(SELECTED_COUNT_KEY, String(cardCount));
    saveAccountProfile(email, activated);
    clearTemporaryGuestData();
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

/**
 * Permanently delete a registered user's account profile.
 */
export function deleteAccountProfile(email) {
  if (typeof window === "undefined" || !email) return;
  try {
    const key = email.trim().toLowerCase();
    const store = getAccountProfiles();
    if (store[key]) {
      delete store[key];
      window.localStorage.setItem(ACCOUNT_PROFILES_KEY, JSON.stringify(store));
    }
  } catch {}
}

/**
 * Clean up temporary guest drafts and pending migration keys without touching account data.
 */
export function clearTemporaryGuestData() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    window.localStorage.removeItem(QUIZ_DRAFT_KEY);
    window.localStorage.removeItem(PENDING_MIGRATION_KEY);
  } catch {}
}

/**
 * Securely sign out active user.
 * Preserves the account's profile in the account profiles store,
 * and clears active session tokens and state so that subsequent anonymous
 * users cannot see or adopt the logged-out user's private data.
 */
export function handleSecureSignOut() {
  if (typeof window === "undefined") return;
  try {
    const rawUser = window.localStorage.getItem(ACTIVE_USER_KEY);
    const activeUser = rawUser ? JSON.parse(rawUser) : null;

    if (activeUser && activeUser.email) {
      // Save current active profile to user's account store before logging out
      const rawProfile = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (rawProfile) {
        try {
          const profileObj = JSON.parse(rawProfile);
          if (profileObj && profileObj.account?.isGuest === false) {
            saveAccountProfile(activeUser.email, profileObj);
          }
        } catch {}
      }
    }

    // Clean session data
    window.localStorage.removeItem(ACTIVE_USER_KEY);
    window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
    window.localStorage.removeItem(ANSWERS_KEY);
    window.localStorage.removeItem(SELECTED_COUNT_KEY);
    window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
    window.localStorage.removeItem(QUIZ_DRAFT_KEY);
    window.localStorage.removeItem(PENDING_MIGRATION_KEY);
    window.localStorage.removeItem(SESSION_ID_KEY);

    window.dispatchEvent(new Event("storage"));
  } catch {}
}

