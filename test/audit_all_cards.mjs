import fs from "fs";
import { CARD_RULES } from "../lib/cardRewardRules.js";
import { CARD_MERCHANT_RULES } from "../lib/merchantRewardRules.js";

const cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));
const insightsText = fs.readFileSync("./components/CardInteractiveInsights.jsx", "utf8");
const technicalText = fs.readFileSync("./components/CardTechnicalDetails.jsx", "utf8");

console.log(`Auditing ${cards.length} cards across all subsystems...\n`);

const cardAuditResults = [];

for (const card of cards) {
  const result = {
    slug: card.slug,
    name: card.name,
    bank: card.issuer || card.bank,
    annualFee: card.annualFee,
    officialUrl: card.officialUrl,
    officialSource: card.officialSource,
    lastVerified: card.lastVerified,
    loungeAccess: card.loungeAccess,
    issues: [],
    rule: null,
    merchantRule: null,
    hasInteractiveInsights: false,
    hasTechnicalDetails: false,
  };

  // 1. Check cardRewardRules
  const rule = CARD_RULES[card.slug];
  if (!rule) {
    result.issues.push("Missing from CARD_RULES in lib/cardRewardRules.js");
  } else {
    result.rule = rule;
    // Check fee waiver consistency
    if (card.annualFee === 0 && rule.feeWaiverSpendThreshold !== 0) {
      result.issues.push(`Fee discrepancy: cards.json annualFee=0 but rule threshold=${rule.feeWaiverSpendThreshold}`);
    }
    // Check reward type consistency
    if (card.category === "cashback" && rule.rewardType !== "cashback") {
      result.issues.push(`Category discrepancy: cards.json category='cashback' but rule rewardType='${rule.rewardType}'`);
    }
    // Check lounge access
    if (rule.loungeAccess !== undefined && rule.loungeAccess !== card.loungeAccess) {
      result.issues.push(`Lounge discrepancy: cards.json lounge=${card.loungeAccess} but rule lounge=${rule.loungeAccess}`);
    }
  }

  // 2. Check merchant rules
  const mRule = CARD_MERCHANT_RULES[card.slug];
  if (mRule) {
    result.merchantRule = mRule;
  }

  // 3. Check interactive insights
  if (insightsText.includes(`"${card.slug}"`) || insightsText.includes(`'${card.slug}'`)) {
    result.hasInteractiveInsights = true;
  } else {
    result.issues.push("Missing dedicated insights profile in components/CardInteractiveInsights.jsx");
  }

  // 4. Check technical details
  if (technicalText.includes(`"${card.slug}"`) || technicalText.includes(`'${card.slug}'`)) {
    result.hasTechnicalDetails = true;
  }

  // 5. Official URL check
  if (!card.officialUrl || !card.officialUrl.startsWith("http")) {
    result.issues.push("Invalid or missing officialUrl in cards.json");
  }

  cardAuditResults.push(result);
}

// Summary
console.log("=== AUDIT SUMMARY ===");
const withIssues = cardAuditResults.filter(r => r.issues.length > 0);
console.log(`Total Cards: ${cards.length}`);
console.log(`Cards with Zero Issues: ${cards.length - withIssues.length}`);
console.log(`Cards with Flagged Issues: ${withIssues.length}\n`);

if (withIssues.length > 0) {
  console.log("=== FLAGGED ISSUES ===");
  withIssues.forEach(w => {
    console.log(`[${w.slug}] ${w.name}:`);
    w.issues.forEach(iss => console.log(`   - ${iss}`));
  });
} else {
  console.log("All 31 cards passed cross-file synchronization checks cleanly!");
}
