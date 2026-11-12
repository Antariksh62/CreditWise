import fs from "fs";
import { calculateNetCardValue, calculateCombinationNetValue } from "../lib/rewardCalculator.js";
import { getProfileRecommendations } from "../lib/recommendation.js";

const cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));

console.log("Verifying calculation engine consistency across 31 cards...\n");

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${msg}`);
  }
}

// Test Spend Profile
const testSpends = [
  { shopping: 10000, dining: 5000, groceries: 8000, travel: 5000, fuel: 3000, utilities: 2500, other: 2000 },
  { shopping: 50000, dining: 20000, groceries: 15000, travel: 25000, fuel: 5000, utilities: 10000, other: 10000 },
  { shopping: 0, dining: 0, groceries: 0, travel: 0, fuel: 10000, utilities: 0, other: 0 },
];

for (const spend of testSpends) {
  for (const card of cards) {
    const val = calculateNetCardValue(card, spend);
    assert(typeof val.estimatedNetAnnualValue === "number", `${card.slug}: net value is a number`);
    assert(val.estimatedNetAnnualValue >= -Math.round(card.annualFee * 1.18), `${card.slug}: net value cannot be worse than out-of-pocket fee`);
    assert(val.annualGrossRewards >= 0, `${card.slug}: gross rewards cannot be negative`);
    assert(val.applicableFee >= 0, `${card.slug}: applicable fee cannot be negative`);
    // Exact arithmetic: net value == gross rewards - applicable fee
    assert(
      val.estimatedNetAnnualValue === val.annualGrossRewards - val.applicableFee,
      `${card.slug}: exact arithmetic consistency: net (${val.estimatedNetAnnualValue}) == gross (${val.annualGrossRewards}) - fee (${val.applicableFee})`
    );
  }
}

console.log(`\nCalculation consistency results: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
