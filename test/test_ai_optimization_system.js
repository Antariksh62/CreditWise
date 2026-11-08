import cards from "../data/cards.json" with { type: "json" };
import { getProfileRecommendations, getRecommendations, checkEligibility } from "../lib/recommendation.js";
import { calculateCombinationNetValue } from "../lib/rewardCalculator.js";

console.log("=== COMPREHENSIVE AI + OPTIMIZATION RECOMMENDATION SUITE ===\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
    passed++;
  } else {
    console.error(`FAIL: ${message}`);
    failed++;
  }
}

// ----------------------------------------------------------------------
// TEST SET 1: Card Count Selection (1, 2, and 3 cards)
// ----------------------------------------------------------------------
const standardProfile = {
  profile: { age: 30, incomeRange: "₹12L – ₹25L", employment: "salaried" },
  spending: {
    categories: {
      shopping: 12000,
      dining: 6000,
      groceries: 5000,
      fuel: 3000,
      travel: 4000,
      utilities: 2000,
    },
  },
  preferences: {
    priorities: ["Cashback", "Shopping"],
    feeTolerance: "moderate-fee",
  },
};

// 1 Card Requested
const rec1 = getProfileRecommendations(cards, { ...standardProfile, cardCount: 1 });
assert(rec1.recommended.length === 1, "Exactly 1 card returned when cardCount = 1");
assert(rec1.combination.cards.length === 1, "Combination structure contains exactly 1 card");
assert(rec1.allCountOptions[1] !== null, "Precomputed 1-card option exists");

// 2 Cards Requested
const rec2 = getProfileRecommendations(cards, { ...standardProfile, cardCount: 2 });
assert(rec2.recommended.length === 2, "Exactly 2 cards returned when cardCount = 2");
assert(rec2.combination.cards.length === 2, "Combination structure contains exactly 2 cards");
assert(rec2.recommended[0].slug !== rec2.recommended[1].slug, "No duplicate cards in 2-card combination");

// 3 Cards Requested
const rec3 = getProfileRecommendations(cards, { ...standardProfile, cardCount: 3 });
assert(rec3.recommended.length === 3, "Exactly 3 cards returned when cardCount = 3");
assert(rec3.combination.cards.length === 3, "Combination structure contains exactly 3 cards");
const slugs3 = rec3.recommended.map((r) => r.slug);
assert(new Set(slugs3).size === 3, "No duplicate cards in 3-card combination");

// ----------------------------------------------------------------------
// TEST SET 2: Spending Category Allocation & No Double-Counting
// ----------------------------------------------------------------------
const combo3 = rec3.combination;
const totalInputMonthly = 12000 + 6000 + 5000 + 3000 + 4000 + 2000;
let allocatedSum = 0;
for (const alloc of Object.values(combo3.allocations)) {
  allocatedSum += alloc.monthlySpend;
}
assert(
  allocatedSum === totalInputMonthly,
  `Category spending perfectly partitioned without double-counting (Allocated: ₹${allocatedSum} == Input: ₹${totalInputMonthly})`
);

let cardAllocatedSum = 0;
for (const c of combo3.cards) {
  cardAllocatedSum += c.allocatedMonthlySpend;
}
assert(
  cardAllocatedSum === totalInputMonthly,
  `Sum of card allocated spends equals total user spend (Sum: ₹${cardAllocatedSum} == Input: ₹${totalInputMonthly})`
);

// ----------------------------------------------------------------------
// TEST SET 3: Fuel-Heavy Profile
// ----------------------------------------------------------------------
const fuelProfile = {
  profile: { age: 32, incomeRange: "₹6L – ₹12L", employment: "salaried" },
  spending: {
    categories: {
      shopping: 2000,
      dining: 1000,
      groceries: 2000,
      fuel: 10000, // Heavy fuel spend
      travel: 1000,
      utilities: 1000,
    },
  },
  preferences: {
    priorities: ["Fuel savings"],
    feeTolerance: "moderate-fee",
  },
  cardCount: 2,
};
const recFuel = getProfileRecommendations(cards, fuelProfile);
const fuelComboSlugs = recFuel.recommended.map((r) => r.slug);
const hasDedicatedFuelCard = fuelComboSlugs.some((s) =>
  ["sbi-bpcl-octane", "idfc-first-power-plus", "rbl-indianoil-xtra"].includes(s)
);
assert(hasDedicatedFuelCard, "Fuel-heavy profile receives dedicated fuel card in top combination");
assert(
  recFuel.combination.allocations.fuel.effectiveRate >= 4.0,
  "Fuel spend allocated to card with accelerated fuel reward rate (>= 4%)"
);

// ----------------------------------------------------------------------
// TEST SET 4: Lifetime-Free (LTF) Preference
// ----------------------------------------------------------------------
const ltfProfile = {
  profile: { age: 24, incomeRange: "₹6L – ₹12L", employment: "salaried" },
  spending: {
    categories: {
      shopping: 8000,
      dining: 4000,
      groceries: 4000,
      fuel: 2000,
      travel: 2000,
      utilities: 1000,
    },
  },
  preferences: {
    priorities: ["Low/no annual fee"],
    feeTolerance: "no-fee",
  },
  cardCount: 2,
};
const recLTF = getProfileRecommendations(cards, ltfProfile);
assert(
  recLTF.combination.totalFees === 0,
  `LTF preference achieves ₹0 out-of-pocket holding fees (Actual fees: ₹${recLTF.combination.totalFees})`
);

// ----------------------------------------------------------------------
// TEST SET 5: Student Eligibility Filter
// ----------------------------------------------------------------------
const studentProfile = {
  profile: { age: 20, incomeRange: "Under ₹3 Lakhs", employment: "student" },
  spending: {
    categories: { shopping: 5000, dining: 3000, groceries: 2000 },
  },
  cardCount: 3,
};
const recStudent = getProfileRecommendations(cards, studentProfile);
// Ultra-premium cards like Infinia, Magnus, BizBlack must NEVER appear for students
const studentSlugs = recStudent.recommended.map((r) => r.slug);
assert(!studentSlugs.includes("hdfc-infinia"), "Infinia strictly excluded for student profile");
assert(!studentSlugs.includes("axis-magnus"), "Magnus strictly excluded for student profile");
assert(!studentSlugs.includes("hdfc-biz-black"), "BizBlack strictly excluded for student profile");

// ----------------------------------------------------------------------
// TEST SET 6: Standalone 5/6 Question Quick Quiz Integration
// ----------------------------------------------------------------------
const quizAnswers = {
  priority: "cashback",
  spendArea: "online",
  monthlySpend: "25to50k",
  feeSensitivity: "moderate",
  travelFrequency: "sometimes",
  cardCount: "2",
};
const quizRec = getRecommendations(cards, quizAnswers);
assert(quizRec.recommended.length === 2, "Quiz recommendation returns exactly 2 cards when cardCount = '2'");
assert(Boolean(quizRec.combination), "Quiz recommendation includes full combination breakdown");
assert(quizRec.cardCount === 2, "Quiz result reflects selected cardCount");

console.log(`\nCOMPREHENSIVE TEST SUITE RESULTS: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);

