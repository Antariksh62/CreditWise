import fs from "fs";
import { CARD_RULES } from "../lib/cardRewardRules.js";
import { CARD_MERCHANT_RULES } from "../lib/merchantRewardRules.js";

const cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));

const cardData = cards.map(c => {
  const rule = CARD_RULES[c.slug] || {};
  const mRule = CARD_MERCHANT_RULES[c.slug] || {};
  return {
    slug: c.slug,
    name: c.name,
    issuer: c.issuer || c.bank,
    annualFee: c.annualFee,
    joiningFee: c.joiningFee,
    feeWaiverCardsJson: c.feeWaiver,
    feeWaiverThresholdRule: rule.feeWaiverSpendThreshold,
    rewardType: rule.rewardType,
    pointValue: rule.pointValue,
    loungeAccessCardsJson: c.loungeAccess,
    loungeAccessRule: rule.loungeAccess,
    rates: rule.rates,
    caps: rule.caps,
    merchantCount: Object.keys(mRule.merchants || {}).length,
    officialUrl: c.officialUrl,
    officialSource: c.officialSource,
    lastVerified: c.lastVerified,
  };
});

fs.writeFileSync("./test/card_financials_dump.json", JSON.stringify(cardData, null, 2));
console.log(`Dumped ${cardData.length} cards.`);
