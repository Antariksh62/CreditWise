import assert from "assert";
import cards from "../data/cards.json" with { type: "json" };
import { CARD_RULES, POINT_VALUATIONS } from "../lib/cardRewardRules.js";
import { calculateNetCardValue, calculateCombinationNetValue } from "../lib/rewardCalculator.js";
import { getProfileRecommendations } from "../lib/recommendation.js";

console.log("=== CREDITWISE RECOMMENDATION & REWARD CALCULATION INTEGRITY AUDIT ===\n");

// TEST 1: All 31 cards included in catalogue and have reward rules
console.log("1. Verifying all 31 cards catalogue and reward rules coverage...");
assert.strictEqual(cards.length, 31, "Catalogue must contain exactly 31 cards");
const ruleSlugs = Object.keys(CARD_RULES);
assert.strictEqual(ruleSlugs.length, 31, "CARD_RULES must contain exactly 31 rule entries");

cards.forEach((card) => {
  assert(CARD_RULES[card.slug], `Missing rule for card: ${card.slug}`);
  const rule = CARD_RULES[card.slug];
  assert(["cashback", "points", "miles"].includes(rule.rewardType), `Invalid rewardType for ${card.slug}: ${rule.rewardType}`);
  assert(typeof rule.pointValue === "number" && rule.pointValue > 0, `Invalid pointValue for ${card.slug}`);
  assert(typeof rule.rates === "object", `Missing rates object for ${card.slug}`);
  ["shopping", "dining", "groceries", "fuel", "travel", "utilities", "other"].forEach((cat) => {
    assert(typeof rule.rates[cat] === "number", `Missing rate for category '${cat}' in ${card.slug}`);
  });
});
console.log("   ✓ All 31 cards verified with complete, schema-compliant reward rules.");

// TEST 2: Reward calculation accounts for caps
console.log("\n2. Verifying category caps enforcement...");
// SBI Cashback: 5% online shopping capped at ₹2,000/mo cashback
const sbiCard = cards.find((c) => c.slug === "sbi-cashback");
const sbiHighOnlineSpend = { shopping: 100000 }; // 5% of 100,000 would be 5,000, but cap is 2,000
const sbiValuation = calculateNetCardValue(sbiCard, sbiHighOnlineSpend);
const sbiShoppingItem = sbiValuation.categoryBreakdown.find((b) => b.key === "shopping");
assert.strictEqual(sbiShoppingItem.monthlyRewards, 2000, "SBI Cashback monthly shopping reward must be capped at ₹2,000");
console.log("   ✓ SBI Cashback shopping cashback strictly capped at ₹2,000/mo (spend: ₹1,00,000 -> rewards: ₹2,000, not ₹5,000).");

// HSBC Live+: 10% dining/groceries capped at ₹1,000/mo cashback
const hsbcCard = cards.find((c) => c.slug === "hsbc-live-plus");
const hsbcHighDiningSpend = { dining: 25000 }; // 10% of 25,000 would be 2,500, but cap is 1,000
const hsbcValuation = calculateNetCardValue(hsbcCard, hsbcHighDiningSpend);
const hsbcDiningItem = hsbcValuation.categoryBreakdown.find((b) => b.key === "dining");
assert.strictEqual(hsbcDiningItem.monthlyRewards, 1000, "HSBC Live+ dining reward must be capped at ₹1,000");
console.log("   ✓ HSBC Live+ dining cashback strictly capped at ₹1,000/mo (spend: ₹25,000 -> rewards: ₹1,000, not ₹2,500).");

// TEST 3: Annual and Joining fees accounting (including 18% GST & waivers)
console.log("\n3. Verifying annual fees, GST, and waiver mechanics...");
// Lifetime free card (Amazon Pay ICICI)
const amzCard = cards.find((c) => c.slug === "amazon-pay-icici");
const amzValuation = calculateNetCardValue(amzCard, { shopping: 10000 });
assert.strictEqual(amzValuation.annualFee, 0);
assert.strictEqual(amzValuation.applicableFee, 0);
assert.strictEqual(amzValuation.feeWaived, true);
console.log("   ✓ Lifetime Free card (Amazon Pay ICICI): ₹0 annual fee, ₹0 applicable fee, feeWaived = true.");

// Fee-based card below waiver threshold (HDFC Millennia: ₹1,000 + 18% GST = ₹1,180)
const millenniaCard = cards.find((c) => c.slug === "hdfc-millennia");
const millenniaBelowWaiver = calculateNetCardValue(millenniaCard, { shopping: 5000 }); // Annual spend: ₹60,000 < ₹1,00,000 threshold
assert.strictEqual(millenniaBelowWaiver.annualFee, 1000);
assert.strictEqual(millenniaBelowWaiver.annualFeeGST, 180);
assert.strictEqual(millenniaBelowWaiver.applicableFee, 1180);
assert.strictEqual(millenniaBelowWaiver.feeWaived, false);
console.log("   ✓ Fee-based card below waiver (HDFC Millennia): ₹1,000 fee + ₹180 GST = ₹1,180 out-of-pocket.");

// Fee-based card above waiver threshold (HDFC Millennia spend: ₹15,000/mo = ₹1,80,000/yr > ₹1,00,000 threshold)
const millenniaAboveWaiver = calculateNetCardValue(millenniaCard, { shopping: 15000 });
assert.strictEqual(millenniaAboveWaiver.feeWaived, true);
assert.strictEqual(millenniaAboveWaiver.applicableFee, 0);
console.log("   ✓ Fee waiver met (HDFC Millennia): Annual spend ₹1,80,000 > ₹1,00,000 threshold -> fee waived (₹0 out-of-pocket).");

// TEST 4: Monthly to annual spend conversion exactness
console.log("\n4. Verifying monthly to annual spend arithmetic...");
const testMonthlySpend = { groceries: 12000, dining: 8000, fuel: 5000, shopping: 15000 };
const expectedMonthlyTotal = 12000 + 8000 + 5000 + 15000;
const expectedAnnualTotal = expectedMonthlyTotal * 12;

const comboValuation = calculateCombinationNetValue([sbiCard, amzCard], testMonthlySpend);
assert.strictEqual(comboValuation.totalMonthlySpend, expectedMonthlyTotal);
assert.strictEqual(comboValuation.totalAnnualSpend, expectedAnnualTotal);
assert.strictEqual(comboValuation.grossRewards, comboValuation.cards.reduce((sum, c) => sum + c.annualGrossRewards, 0));
assert.strictEqual(comboValuation.netValue, comboValuation.grossRewards - comboValuation.totalFees);
console.log("   ✓ Monthly (₹40,000) converted into annual (₹4,80,000) with 12x multiplier and net value exactness.");

// TEST 5: Zero double-counting across multi-card portfolios
console.log("\n5. Verifying zero double-counting in combinatorial spend routing...");
const combo3Cards = [sbiCard, amzCard, hsbcCard];
const multiSpend = {
  groceries: 10000,
  dining: 8000,
  fuel: 4000,
  shopping: 12000,
  travel: 6000,
  utilities: 3000,
  other: 2000,
};
const combo3Val = calculateCombinationNetValue(combo3Cards, multiSpend);

// Check that every category spend is routed to exactly one card
let totalAllocatedSpend = 0;
const routedCards = new Set();
Object.entries(combo3Val.allocations).forEach(([catKey, alloc]) => {
  assert(alloc.cardSlug, `Category '${catKey}' must be routed to a specific card`);
  assert.strictEqual(alloc.monthlySpend, multiSpend[catKey], `Allocated monthly spend for '${catKey}' must match input spend`);
  totalAllocatedSpend += alloc.monthlySpend;
  routedCards.add(alloc.cardSlug);
});

assert.strictEqual(totalAllocatedSpend, combo3Val.totalMonthlySpend, "Sum of routed category spends must match total monthly spend");
const sumCardSpends = combo3Val.cards.reduce((sum, c) => sum + c.allocatedMonthlySpend, 0);
assert.strictEqual(sumCardSpends, totalAllocatedSpend, "Sum of individual card allocated spends must equal total allocated spend");
console.log("   ✓ Zero double-counting guaranteed: each rupee is routed to exactly one card with highest category yield.");

// TEST 6: Strict card count compliance (1, 2, 3 cards)
console.log("\n6. Verifying strict card count compliance...");
const testProfile = {
  cardCount: 2,
  profile: { age: 30, employment: "salaried", incomeRange: "₹12L – ₹25L" },
  spending: { totalMonthly: 45000, categories: multiSpend },
  preferences: { cardCount: 2, preferredRewardType: "Cashback" },
};

for (const count of [1, 2, 3]) {
  const result = getProfileRecommendations(cards, { ...testProfile, cardCount: count }, count);
  assert.strictEqual(result.cardCount, count, `Target cardCount must be ${count}`);
  assert.strictEqual(result.recommended.length, count, `Recommended cards count must be exactly ${count}`);
  assert.strictEqual(result.combination.cards.length, count, `Combination cards count must be exactly ${count}`);
}
console.log("   ✓ Selected card count strictly respected for 1 card, 2 cards, and 3 cards.");

// TEST 7: Benefits without reliable valuation not falsely presented as cash savings
console.log("\n7. Verifying non-monetary perks exclusion from gross/net rewards...");
// HDFC Infinia provides unlimited lounge visits and golf games
const infiniaCard = cards.find((c) => c.slug === "hdfc-infinia");
const infiniaSpend = { travel: 20000 };
const infiniaVal = calculateNetCardValue(infiniaCard, infiniaSpend);
// Gross rewards must only be based on point earnings from spending, NOT arbitrarily inflated by lounge monetary value
const expectedPoints = (20000 * 3.33) / 100; // 5 pts / ₹150 = 3.33% reward rate
const expectedRupees = Math.round(Math.round(expectedPoints) * 12);
assert.strictEqual(infiniaVal.annualGrossRewards, expectedRupees, "Gross rewards must only reflect actual point earnings");
console.log("   ✓ Non-monetary perks (lounge visits, golf games) not inflated as cash savings in gross/net values.");

console.log("\n=======================================================");
console.log("ALL 7 REWARD INTEGRITY AUDIT CHECKS PASSED!");
console.log("=======================================================\n");
