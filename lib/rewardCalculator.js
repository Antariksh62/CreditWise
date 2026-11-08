/**
 * CardWise — Enhanced Spending-to-Value Reward Calculator
 * ============================================================
 * Calculates estimated annual gross rewards, applicable annual fees
 * (with verified spend-based waiver rules), and net annual value.
 *
 * Integrates card-specific reward rates, verified monthly caps,
 * category exclusions, and transparent point redemption valuations.
 */

import { CARD_RULES, POINT_VALUATIONS } from "./cardRewardRules.js";

/** The five classic spending categories for simple comparison calculator */
export const SPEND_CATEGORIES = [
  { key: "online", label: "Online shopping", placeholder: 12000 },
  { key: "dining", label: "Dining & delivery", placeholder: 6000 },
  { key: "travel", label: "Travel", placeholder: 8000 },
  { key: "fuel", label: "Fuel", placeholder: 4000 },
  { key: "other", label: "Everything else", placeholder: 10000 },
];

/** A zeroed spending object, useful as initial form state. */
export const EMPTY_SPEND = {
  online: 0,
  dining: 0,
  travel: 0,
  fuel: 0,
  other: 0,
};

export const POINT_VALUE_IN_RUPEES = 0.25;

/** Coerce any user input into a non-negative number. */
export function toAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Total monthly spending across all categories. */
export function getMonthlyTotal(spend) {
  if (!spend || typeof spend !== "object") return 0;
  return Object.values(spend).reduce((sum, val) => sum + toAmount(val), 0);
}

/**
 * Standardize any user spending input (from onboarding or quiz) into normalized monthly category amounts.
 */
export function normalizeSpendProfile(spendInput) {
  if (!spendInput || typeof spendInput !== "object") {
    return {
      shopping: 0,
      dining: 0,
      groceries: 0,
      travel: 0,
      fuel: 0,
      utilities: 0,
      other: 0,
    };
  }

  // Handle onboarding profile shape: profile.monthlySpends or profile.spending.categories
  const src = spendInput.monthlySpends || spendInput.categories || spendInput;

  return {
    shopping: toAmount(src.shopping || src.online),
    online: toAmount(src.shopping || src.online),
    dining: toAmount(src.dining),
    groceries: toAmount(src.groceries || src.grocery || (src.online ? src.online * 0.4 : 0)),
    travel: toAmount(src.travel),
    fuel: toAmount(src.fuel),
    utilities: toAmount(src.utilities || src.bills),
    other: toAmount(src.other || src.entertainment || src.subscriptions || 0),
  };
}

/**
 * Calculate net annual reward value for a specific card using the user's spending profile.
 *
 * @param {object} card - Record from data/cards.json
 * @param {object} spendInput - Monthly category spending object
 * @returns {object} Detailed value breakdown with assumptions, gross, fees, net, and limitations.
 */
export function calculateNetCardValue(card, spendInput) {
  const rules = CARD_RULES[card.slug] || {
    rewardType: card.category === "cashback" ? "cashback" : "points",
    pointValue: card.category === "cashback" ? 1.0 : 0.25,
    pointValuationLabel: "Standard Catalog Redemption (₹0.25)",
    feeWaiverSpendThreshold: card.annualFee === 0 ? 0 : null,
    feeWaiverCondition: card.feeWaiver || "Check bank terms",
    rates: {
      shopping: card.cashbackRate || card.rewardRate || 1.0,
      dining: card.cashbackRate || card.rewardRate || 1.0,
      travel: card.cashbackRate || card.rewardRate || 1.0,
      fuel: 0.0,
      groceries: card.cashbackRate || card.rewardRate || 1.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {},
    exclusions: ["Fuel", "Wallet reloads", "Rent payments"],
    confidence: "estimated",
  };

  const spend = normalizeSpendProfile(spendInput);

  // Calculate monthly gross rewards category by category
  const categoryBreakdown = [];
  let totalMonthlyRewards = 0;
  let totalMonthlySpend = 0;

  const activeCategories = [
    { key: "dining", label: "Dining & delivery" },
    { key: "groceries", label: "Groceries & supermarkets" },
    { key: "shopping", label: "Online & retail shopping" },
    { key: "travel", label: "Travel, flights & hotels" },
    { key: "fuel", label: "Fuel & charging" },
    { key: "utilities", label: "Utilities & bill payments" },
    { key: "other", label: "Other retail & merchant spends" },
  ];

  for (const cat of activeCategories) {
    const monthlySpend = spend[cat.key] || 0;
    if (monthlySpend <= 0) continue;

    totalMonthlySpend += monthlySpend;
    const ratePercent = rules.rates[cat.key] ?? (cat.key === "fuel" ? 0 : 1.0);
    let monthlyEarn = (monthlySpend * ratePercent) / 100;

    // Apply specific monthly category caps if defined
    if ((cat.key === "dining" || cat.key === "groceries") && rules.caps?.diningGroceryMonthlyCashback) {
      const cap = rules.caps.diningGroceryMonthlyCashback;
      monthlyEarn = Math.min(monthlyEarn, cap);
    } else if (cat.key === "dining" && rules.caps?.swiggyMonthlyCashback) {
      monthlyEarn = Math.min(monthlyEarn, rules.caps.swiggyMonthlyCashback);
    } else if (cat.key === "shopping" && rules.caps?.onlineMonthlyCashback) {
      monthlyEarn = Math.min(monthlyEarn, rules.caps.onlineMonthlyCashback);
    } else if (cat.key === "fuel" && rules.caps?.fuelMonthlyPoints) {
      const fuelValueCap = rules.caps.fuelMonthlyPoints * rules.pointValue;
      monthlyEarn = Math.min(monthlyEarn, fuelValueCap);
    } else if (cat.key === "fuel" && rules.caps?.fuelMonthlySpendCap) {
      const cappedSpend = Math.min(monthlySpend, rules.caps.fuelMonthlySpendCap);
      monthlyEarn = (cappedSpend * ratePercent) / 100;
    } else if (cat.key === "groceries" && rules.caps?.groceryMonthlyPoints) {
      const groceryValueCap = rules.caps.groceryMonthlyPoints * rules.pointValue;
      monthlyEarn = Math.min(monthlyEarn, groceryValueCap);
    } else if (cat.key === "groceries" && rules.caps?.groceryMonthlyCoins) {
      const groceryValueCap = rules.caps.groceryMonthlyCoins * rules.pointValue;
      monthlyEarn = Math.min(monthlyEarn, groceryValueCap);
    }

    totalMonthlyRewards += monthlyEarn;

    categoryBreakdown.push({
      key: cat.key,
      label: cat.label,
      monthlySpend,
      annualSpend: monthlySpend * 12,
      effectiveRate: ratePercent,
      monthlyRewards: Math.round(monthlyEarn),
      annualRewards: Math.round(monthlyEarn * 12),
    });
  }

  // Account for monthly spend milestone bonuses (e.g., Amex MRCC 1,000–2,000 pts/mo on ₹20k spend)
  if (rules.monthlyBonusMilestone && totalMonthlySpend >= rules.monthlyBonusMilestone.minSpend) {
    const bonusPts = rules.monthlyBonusMilestone.bonusPoints || rules.monthlyBonusMilestone.spendBonusPoints || 0;
    const bonusValue = bonusPts * rules.pointValue;
    totalMonthlyRewards += bonusValue;
    categoryBreakdown.push({
      key: "milestone",
      label: "Monthly spend milestone bonus",
      monthlySpend: 0,
      annualSpend: 0,
      effectiveRate: 0,
      monthlyRewards: Math.round(bonusValue),
      annualRewards: Math.round(bonusValue * 12),
    });
  }

  const annualSpend = totalMonthlySpend * 12;
  const annualGrossRewards = Math.round(totalMonthlyRewards * 12);

  // Evaluate annual renewal fee waiver (including mandatory 18% GST)
  const rawAnnualFee = card.annualFee || 0;
  const gstAmount = Math.round(rawAnnualFee * 0.18);
  const totalAnnualCost = rawAnnualFee + gstAmount;

  let feeWaived = false;
  let applicableFee = totalAnnualCost;
  let waiverStatusText = "";

  if (rawAnnualFee === 0) {
    feeWaived = true;
    applicableFee = 0;
    waiverStatusText = "Lifetime Free (₹0 annual fee)";
  } else if (rules.feeWaiverSpendThreshold !== null && annualSpend >= rules.feeWaiverSpendThreshold) {
    feeWaived = true;
    applicableFee = 0;
    waiverStatusText = `Annual fee waived (Your spend of ₹${Math.round(annualSpend).toLocaleString("en-IN")} exceeds the ₹${rules.feeWaiverSpendThreshold.toLocaleString("en-IN")} waiver threshold)`;
  } else if (rules.feeWaiverSpendThreshold !== null && rules.feeWaiverSpendThreshold > 0) {
    feeWaived = false;
    applicableFee = totalAnnualCost;
    const shortfall = rules.feeWaiverSpendThreshold - annualSpend;
    waiverStatusText = `Fee applies: ₹${totalAnnualCost.toLocaleString("en-IN")}/yr (₹${rawAnnualFee.toLocaleString("en-IN")} + 18% GST). Requires ₹${shortfall.toLocaleString("en-IN")} more annual spend to waive.`;
  } else {
    feeWaived = false;
    applicableFee = totalAnnualCost;
    waiverStatusText = card.feeWaiver
      ? `${card.feeWaiver} (Total out-of-pocket: ₹${totalAnnualCost.toLocaleString("en-IN")}/yr incl. 18% GST)`
      : `Non-waivable fee of ₹${totalAnnualCost.toLocaleString("en-IN")}/yr (₹${rawAnnualFee.toLocaleString("en-IN")} + 18% GST)`;
  }

  const estimatedNetAnnualValue = annualGrossRewards - applicableFee;
  const effectiveReturnPercent = annualSpend > 0 ? Number(((annualGrossRewards / annualSpend) * 100).toFixed(2)) : 0;

  // Identify top contributing spending categories
  const topContributors = [...categoryBreakdown]
    .filter((c) => c.annualRewards > 0)
    .sort((a, b) => b.annualRewards - a.annualRewards)
    .slice(0, 2)
    .map((c) => `${c.label} (~₹${c.annualRewards.toLocaleString("en-IN")}/yr)`);

  return {
    annualSpend,
    monthlySpend: totalMonthlySpend,
    annualGrossRewards,
    applicableFee,
    annualFee: rawAnnualFee,
    annualFeeGST: gstAmount,
    annualFeeTotal: totalAnnualCost,
    feeWaived,
    waiverStatusText,
    estimatedNetAnnualValue,
    effectiveReturnPercent,
    rewardType: rules.rewardType,
    pointValuationLabel: rules.pointValuationLabel,
    topContributors,
    categoryBreakdown,
    exclusions: rules.exclusions || [],
    confidence: rules.confidence,
    isEstimate: true,
  };
}

/**
 * Backward-compatible helper for legacy calculator component.
 */
export function calculateRewards(card, spend) {
  const res = calculateNetCardValue(card, spend);

  const perCategory = SPEND_CATEGORIES.map((cat) => {
    const matching = res.categoryBreakdown.find((b) => b.key === cat.key || (cat.key === "online" && b.key === "shopping")) || {
      monthlySpend: toAmount(spend?.[cat.key]),
      annualSpend: toAmount(spend?.[cat.key]) * 12,
      effectiveRate: 1.0,
      annualRewards: 0,
    };
    return {
      key: cat.key,
      label: cat.label,
      monthly: matching.monthlySpend,
      annual: matching.annualSpend,
      rate: matching.effectiveRate,
      rewards: matching.annualRewards,
    };
  });

  return {
    monthlySpend: res.monthlySpend,
    annualSpend: res.annualSpend,
    annualRewards: res.annualGrossRewards,
    netAnnualRewards: res.estimatedNetAnnualValue,
    effectiveRate: res.effectiveReturnPercent,
    perCategory,
  };
}

/**
 * Rank cards by net annual value against declared spend.
 */
export function rankCardsByRewards(cards, spend, limit = 5) {
  return cards
    .map((card) => ({
      card,
      ...calculateNetCardValue(card, spend),
    }))
    .sort((a, b) => b.estimatedNetAnnualValue - a.estimatedNetAnnualValue)
    .slice(0, limit);
}

/**
 * Calculate net annual reward value for a COMBINATION of cards (1, 2, or 3 cards).
 * Deterministically routes each spending category to the card in the combination
 * that provides the highest return, avoiding double-counting and applying
 * individual card caps, milestones, and spend-based fee waivers.
 *
 * @param {Array<object>} cards - Array of 1, 2, or 3 card objects
 * @param {object} spendInput - Monthly category spending object
 * @returns {object} Full combination valuation with allocations, gross rewards, fees, and net value.
 */
export function calculateCombinationNetValue(cards, spendInput) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return {
      cards: [],
      allocations: {},
      totalMonthlySpend: 0,
      totalAnnualSpend: 0,
      grossRewards: 0,
      totalFees: 0,
      netValue: 0,
      effectiveReturnPercent: 0,
    };
  }

  const spend = normalizeSpendProfile(spendInput);
  const activeCategories = [
    { key: "dining", label: "Dining & delivery" },
    { key: "groceries", label: "Groceries & supermarkets" },
    { key: "shopping", label: "Online & retail shopping" },
    { key: "travel", label: "Travel, flights & hotels" },
    { key: "fuel", label: "Fuel & charging" },
    { key: "utilities", label: "Utilities & bill payments" },
    { key: "other", label: "Other retail & merchant spends" },
  ];

  // Pre-load card rules
  const cardRuleMap = {};
  cards.forEach((c) => {
    cardRuleMap[c.slug] = CARD_RULES[c.slug] || {
      rewardType: c.category === "cashback" ? "cashback" : "points",
      pointValue: c.category === "cashback" ? 1.0 : 0.25,
      feeWaiverSpendThreshold: c.annualFee === 0 ? 0 : null,
      rates: {
        shopping: c.cashbackRate || c.rewardRate || 1.0,
        dining: c.cashbackRate || c.rewardRate || 1.0,
        travel: c.cashbackRate || c.rewardRate || 1.0,
        fuel: 0.0,
        groceries: c.cashbackRate || c.rewardRate || 1.0,
        utilities: 0.0,
        other: 1.0,
      },
      caps: {},
      exclusions: ["Fuel", "Wallet reloads", "Rent payments"],
    };
  });

  // Track spend allocated per card: { [cardSlug]: { [categoryKey]: monthlySpend } }
  const allocatedSpends = {};
  cards.forEach((c) => {
    allocatedSpends[c.slug] = {};
  });

  const allocations = {};
  let totalMonthlySpend = 0;

  // Step 1: Assign each category to the card providing the best monetary yield
  for (const cat of activeCategories) {
    const monthlyAmt = spend[cat.key] || 0;
    if (monthlyAmt <= 0) continue;

    totalMonthlySpend += monthlyAmt;

    let bestCard = cards[0];
    let bestYield = -1;
    let bestRate = 0;

    for (const card of cards) {
      const rules = cardRuleMap[card.slug];
      const rate = rules.rates[cat.key] ?? (cat.key === "fuel" ? 0 : 1.0);
      const effectiveYield = (monthlyAmt * rate * rules.pointValue) / 100;

      if (effectiveYield > bestYield) {
        bestYield = effectiveYield;
        bestCard = card;
        bestRate = rate;
      }
    }

    allocatedSpends[bestCard.slug][cat.key] = monthlyAmt;
    allocations[cat.key] = {
      categoryKey: cat.key,
      categoryLabel: cat.label,
      cardName: bestCard.name,
      cardSlug: bestCard.slug,
      monthlySpend: monthlyAmt,
      annualSpend: monthlyAmt * 12,
      effectiveRate: bestRate,
      monthlyRewards: Math.round(bestYield),
      annualRewards: Math.round(bestYield * 12),
    };
  }

  // Step 2: Calculate per-card rewards, fees, waivers, and net values
  const cardValuations = [];
  let totalGrossRewards = 0;
  let totalApplicableFees = 0;
  let totalLoungeVisits = 0;
  let hasZeroForex = false;
  let hasFuelWaiver = false;

  for (const card of cards) {
    const rules = cardRuleMap[card.slug];
    const cardCatSpends = allocatedSpends[card.slug] || {};
    let cardMonthlySpend = 0;
    let cardMonthlyRewards = 0;
    const cardCategoryBreakdown = [];

    for (const cat of activeCategories) {
      const spendAmt = cardCatSpends[cat.key] || 0;
      if (spendAmt <= 0) continue;

      cardMonthlySpend += spendAmt;
      const ratePercent = rules.rates[cat.key] ?? (cat.key === "fuel" ? 0 : 1.0);
      let earn = (spendAmt * ratePercent) / 100;

      // Apply category caps
      if ((cat.key === "dining" || cat.key === "groceries") && rules.caps?.diningGroceryMonthlyCashback) {
        earn = Math.min(earn, rules.caps.diningGroceryMonthlyCashback);
      } else if (cat.key === "dining" && rules.caps?.swiggyMonthlyCashback) {
        earn = Math.min(earn, rules.caps.swiggyMonthlyCashback);
      } else if (cat.key === "shopping" && rules.caps?.onlineMonthlyCashback) {
        earn = Math.min(earn, rules.caps.onlineMonthlyCashback);
      } else if (cat.key === "fuel" && rules.caps?.fuelMonthlyPoints) {
        earn = Math.min(earn, rules.caps.fuelMonthlyPoints * rules.pointValue);
      } else if (cat.key === "fuel" && rules.caps?.fuelMonthlySpendCap) {
        const capped = Math.min(spendAmt, rules.caps.fuelMonthlySpendCap);
        earn = (capped * ratePercent) / 100;
      } else if (cat.key === "groceries" && rules.caps?.groceryMonthlyPoints) {
        earn = Math.min(earn, rules.caps.groceryMonthlyPoints * rules.pointValue);
      } else if (cat.key === "groceries" && rules.caps?.groceryMonthlyCoins) {
        earn = Math.min(earn, rules.caps.groceryMonthlyCoins * rules.pointValue);
      }

      cardMonthlyRewards += earn;
      cardCategoryBreakdown.push({
        key: cat.key,
        label: cat.label,
        monthlySpend: spendAmt,
        annualSpend: spendAmt * 12,
        effectiveRate: ratePercent,
        monthlyRewards: Math.round(earn),
        annualRewards: Math.round(earn * 12),
      });
    }

    // Monthly bonus milestone
    if (rules.monthlyBonusMilestone && cardMonthlySpend >= rules.monthlyBonusMilestone.minSpend) {
      const bonusPts = rules.monthlyBonusMilestone.bonusPoints || rules.monthlyBonusMilestone.spendBonusPoints || 0;
      const bonusVal = bonusPts * rules.pointValue;
      cardMonthlyRewards += bonusVal;
      cardCategoryBreakdown.push({
        key: "milestone",
        label: "Monthly spend milestone bonus",
        monthlySpend: 0,
        annualSpend: 0,
        effectiveRate: 0,
        monthlyRewards: Math.round(bonusVal),
        annualRewards: Math.round(bonusVal * 12),
      });
    }

    const cardAnnualSpend = cardMonthlySpend * 12;
    const cardAnnualGross = Math.round(cardMonthlyRewards * 12);

    // Annual fee waiver calculation (incl. 18% GST)
    const rawFee = card.annualFee || 0;
    const gst = Math.round(rawFee * 0.18);
    const totalCostWithGST = rawFee + gst;

    let feeWaived = false;
    let cardApplicableFee = totalCostWithGST;
    let waiverText = "";

    if (rawFee === 0) {
      feeWaived = true;
      cardApplicableFee = 0;
      waiverText = "Lifetime Free (₹0 annual fee)";
    } else if (rules.feeWaiverSpendThreshold !== null && cardAnnualSpend >= rules.feeWaiverSpendThreshold) {
      feeWaived = true;
      cardApplicableFee = 0;
      waiverText = `Annual fee waived (₹${Math.round(cardAnnualSpend).toLocaleString("en-IN")} allocated exceeds ₹${rules.feeWaiverSpendThreshold.toLocaleString("en-IN")} threshold)`;
    } else if (rules.feeWaiverSpendThreshold !== null && rules.feeWaiverSpendThreshold > 0) {
      feeWaived = false;
      cardApplicableFee = totalCostWithGST;
      const shortfall = rules.feeWaiverSpendThreshold - cardAnnualSpend;
      waiverText = `Fee applies: ₹${totalCostWithGST.toLocaleString("en-IN")}/yr (₹${rawFee.toLocaleString("en-IN")} + 18% GST). Short by ₹${Math.round(shortfall).toLocaleString("en-IN")} to waive.`;
    } else {
      feeWaived = false;
      cardApplicableFee = totalCostWithGST;
      waiverText = card.feeWaiver
        ? `${card.feeWaiver} (Total out-of-pocket: ₹${totalCostWithGST.toLocaleString("en-IN")}/yr incl. 18% GST)`
        : `Non-waivable fee of ₹${totalCostWithGST.toLocaleString("en-IN")}/yr (₹${rawFee.toLocaleString("en-IN")} + 18% GST)`;
    }

    const cardNetValue = cardAnnualGross - cardApplicableFee;

    // Check perks
    if (card.loungeAccess && typeof card.loungeAccess === "number") {
      totalLoungeVisits += card.loungeAccess;
    }
    if (card.forexBenefits && (card.forexBenefits.includes("0%") || card.forexBenefits.includes("Zero") || card.slug.includes("scapia"))) {
      hasZeroForex = true;
    }
    if (card.fuelBenefits && card.fuelBenefits.toLowerCase().includes("surcharge waiver")) {
      hasFuelWaiver = true;
    }

    totalGrossRewards += cardAnnualGross;
    totalApplicableFees += cardApplicableFee;

    cardValuations.push({
      card,
      name: card.name,
      slug: card.slug,
      image: card.image,
      allocatedMonthlySpend: cardMonthlySpend,
      allocatedAnnualSpend: cardAnnualSpend,
      annualGrossRewards: cardAnnualGross,
      applicableFee: cardApplicableFee,
      rawFee,
      feeGST: gst,
      feeWaived,
      waiverText,
      netValue: cardNetValue,
      rewardType: rules.rewardType,
      categoryBreakdown: cardCategoryBreakdown,
      realWorldGotchas: card.realWorldGotchas || [],
      applyUrl: card.applyUrl || null,
    });
  }

  const totalAnnualSpend = totalMonthlySpend * 12;
  const netMonetaryValue = totalGrossRewards - totalApplicableFees;
  const effectiveReturnPercent = totalAnnualSpend > 0
    ? Number(((totalGrossRewards / totalAnnualSpend) * 100).toFixed(2))
    : 0;

  return {
    cards: cardValuations,
    allocations,
    totalMonthlySpend,
    totalAnnualSpend,
    grossRewards: totalGrossRewards,
    totalFees: totalApplicableFees,
    netValue: netMonetaryValue,
    effectiveReturnPercent,
    totalLoungeVisits,
    hasZeroForex,
    hasFuelWaiver,
  };
}

/** Format number as Indian rupees */
export function formatRupees(amount) {
  const n = Math.round(Number(amount) || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}
