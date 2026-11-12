import fs from "fs";
import { CARD_RULES } from "../lib/cardRewardRules.js";

const cards = JSON.parse(fs.readFileSync("./data/cards.json", "utf8"));

console.log("Auditing points vs rates across all 31 cards in CARD_RULES...\n");

for (const card of cards) {
  const rule = CARD_RULES[card.slug];
  if (!rule) continue;
  
  console.log(`[${card.slug}] type=${rule.rewardType}, ptValue=${rule.pointValue}`);
  console.log(`   rates:`, JSON.stringify(rule.rates));
}

