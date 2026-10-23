import { calculateNetCardValue } from "../lib/rewardCalculator.js";
import { getRecommendations, getProfileRecommendations, checkEligibility } from "../lib/recommendation.js";
import cards from "../data/cards.json" with { type: "json" };

console.log("=== RUNNING TRUSTWORTHY NET-VALUE CALCULATION TESTS ===");

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

// ----------------------------------------------------
// TEST 1: Cashback Card with Verified Monthly Cap
// HSBC Live+ (10% dining/groceries capped at ₹1,000/mo)
// ----------------------------------------------------
const hsbc = cards.find((c) => c.slug === "hsbc-live-plus");
// User spends ₹20,000/mo on dining. 10% is ₹2,000, but cap must limit it to ₹1,000/mo = ₹12,000/yr.
const spendHighDining = { dining: 20000, groceries: 0, shopping: 0, travel: 0, fuel: 0 };
const hsbcVal = calculateNetCardValue(hsbc, spendHighDining);

assert(
  hsbcVal.categoryBreakdown.find((c) => c.key === "dining").monthlyRewards === 1000,
  "HSBC Live+ correctly caps ₹20,000 dining spend at ₹1,000/mo (not ₹2,000/mo)"
);
assert(
  hsbcVal.annualGrossRewards === 12000,
  "HSBC Live+ annual gross rewards accurately compute to ₹12,000"
);
// Spend is ₹2.4L/yr which exceeds the ₹2.0L waiver threshold -> fee should be waived
assert(
  hsbcVal.feeWaived === true && hsbcVal.applicableFee === 0,
  "HSBC Live+ fee is waived when annual spend (₹2,40,000) exceeds ₹2,00,000"
);
assert(
  hsbcVal.estimatedNetAnnualValue === 12000,
  "HSBC Live+ net annual value is ₹12,000 after fee waiver"
);

// ----------------------------------------------------
// TEST 2: Fee Shortfall & Non-Waived Calculation
// HSBC Live+ with spend under waiver threshold
// ----------------------------------------------------
const spendLowDining = { dining: 5000, groceries: 0, shopping: 0, travel: 0, fuel: 0 }; // ₹60,000/yr
const hsbcLowVal = calculateNetCardValue(hsbc, spendLowDining);

assert(
  hsbcLowVal.feeWaived === false && hsbcLowVal.applicableFee === 999,
  "HSBC Live+ fee applies (₹999) when annual spend (₹60,000) is below ₹2,00,000"
);
assert(
  hsbcLowVal.estimatedNetAnnualValue === 6000 - 999,
  "HSBC Live+ correctly nets out the ₹999 fee: ₹6,000 - ₹999 = ₹5,001"
);

// ----------------------------------------------------
// TEST 3: Points Card with Transparent Point Valuation
// HDFC Infinia (₹12,500 fee, ₹10L waiver, 1 RP = ₹1 SmartBuy)
// ----------------------------------------------------
const infinia = cards.find((c) => c.slug === "hdfc-infinia");
const spendInfinia = { dining: 20000, travel: 30000, shopping: 40000, groceries: 10000, fuel: 5000 }; // ₹1.05L/mo = ₹12.6L/yr
const infiniaVal = calculateNetCardValue(infinia, spendInfinia);

assert(
  infiniaVal.rewardType === "points",
  "HDFC Infinia identified as reward points model"
);
assert(
  infiniaVal.feeWaived === true,
  "HDFC Infinia fee is waived when spend (₹12.6L) exceeds ₹10L threshold"
);
assert(
  infiniaVal.pointValuationLabel.includes("₹1.00"),
  "HDFC Infinia clearly labels point valuation assumption (₹1.00)"
);

// ----------------------------------------------------
// TEST 4: Excluded Category Handling
// Fuel and government spends do not earn accelerated cashback
// ----------------------------------------------------
const amazon = cards.find((c) => c.slug === "amazon-pay-icici");
const spendFuelOnly = { fuel: 15000, shopping: 0, dining: 0, travel: 0 };
const amazonFuelVal = calculateNetCardValue(amazon, spendFuelOnly);

assert(
  amazonFuelVal.categoryBreakdown.find((c) => c.key === "fuel").effectiveRate === 0,
  "Amazon Pay ICICI does not award cashback on fuel spend (effectiveRate = 0)"
);
assert(
  amazonFuelVal.annualGrossRewards === 0,
  "Fuel-only spending correctly results in ₹0 cashback for non-fuel card"
);

// ----------------------------------------------------
// TEST 5: Zero or Missing Spending Resilience
// ----------------------------------------------------
const zeroVal = calculateNetCardValue(amazon, {});
assert(
  zeroVal.annualGrossRewards === 0 && zeroVal.estimatedNetAnnualValue === 0,
  "Empty spend object returns clean 0 estimates without error"
);

const nullVal = calculateNetCardValue(amazon, null);
assert(
  nullVal.annualGrossRewards === 0,
  "Null spend input returns 0 estimates gracefully"
);

// ----------------------------------------------------
// TEST 6: Ineligible Applicant Filtering
// ----------------------------------------------------
const studentProfile = {
  profile: {
    age: 19,
    incomeRange: "Under ₹3 Lakhs",
    employment: "student",
  },
  existingCards: [],
};
const infiniaEligibility = checkEligibility(infinia, studentProfile);
assert(
  infiniaEligibility.eligible === false,
  "HDFC Infinia correctly excludes student applicants with insufficient income"
);

// ----------------------------------------------------
// TEST 7: Value-Based Ranking Integration
// Top card must be the highest net earner for grocery/dining profile
// ----------------------------------------------------
const groceryDiningProfile = {
  profile: {
    age: 30,
    incomeRange: "₹12L – ₹25L",
    employment: "salaried",
    feeTolerance: "moderate",
    primaryGoal: "cashback",
  },
  spending: {
    categories: {
      dining: 12000,
      groceries: 12000,
      shopping: 5000,
      fuel: 2000,
      travel: 3000,
    },
  },
  existingCards: [],
};

const recommendations = getProfileRecommendations(cards, groceryDiningProfile, 3);
assert(
  recommendations.recommended.length === 3,
  "Recommendation engine returns top 3 diversified cards"
);
assert(
  recommendations.recommended[0].netValue >= recommendations.recommended[1].netValue,
  "Recommendations are sorted deterministically by realistic net value return"
);
assert(
  Boolean(recommendations.recommended[0].valueBreakdown),
  "Recommendation items include full valueBreakdown structure for UI"
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log(`\nTEST RESULTS: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
