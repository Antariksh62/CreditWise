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
    if (cat.key === "dining" && rules.caps?.diningGroceryMonthlyCashback) {
      monthlyEarn = Math.min(monthlyEarn, rules.caps.diningGroceryMonthlyCashback);
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

  // Account for monthly spend milestone bonuses (e.g., Amex MRCC 2,000 pts/mo on ₹20k spend)
  if (rules.monthlyBonusMilestone && totalMonthlySpend >= rules.monthlyBonusMilestone.minSpend) {
    const bonusValue = rules.monthlyBonusMilestone.bonusPoints * rules.pointValue;
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

  // Evaluate annual renewal fee waiver
  const rawAnnualFee = card.annualFee || 0;
  let feeWaived = false;
  let applicableFee = rawAnnualFee;
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
    applicableFee = rawAnnualFee;
    const shortfall = rules.feeWaiverSpendThreshold - annualSpend;
    waiverStatusText = `Fee applies: ₹${rawAnnualFee.toLocaleString("en-IN")}/yr (Requires ₹${shortfall.toLocaleString("en-IN")} more annual spend to waive)`;
  } else {
    feeWaived = false;
    applicableFee = rawAnnualFee;
    waiverStatusText = card.feeWaiver || `Non-waivable annual fee of ₹${rawAnnualFee.toLocaleString("en-IN")}/yr`;
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

/** Format number as Indian rupees */
export function formatRupees(amount) {
  const n = Math.round(Number(amount) || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}
