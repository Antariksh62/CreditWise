/**
 * CardWise — Enhanced Spending-to-Value Reward Calculator
 * ============================================================
 * Calculates estimated annual gross rewards, applicable annual fees
 * (with verified spend-based waiver rules), and net annual value.
 *
 * Integrates merchant-specific accelerated reward rates, verified
 * monthly caps, category exclusions, and transparent point redemption valuations.
 */

import { CARD_RULES, POINT_VALUATIONS } from "./cardRewardRules.js";
import { getMerchantRewardRule, resolveMerchant } from "./merchantRewardRules.js";

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
 * Extract itemized merchant spends and unallocated category totals.
 * Guarantees zero double-counting between merchant and category entries.
 */
export function extractDetailedSpend(spendInput) {
  if (!spendInput || typeof spendInput !== "object") {
    return {
      itemizedMerchants: {},
      categoryTotals: { shopping: 0, dining: 0, groceries: 0, travel: 0, fuel: 0, utilities: 0, other: 0 },
      unallocatedCategories: { shopping: 0, dining: 0, groceries: 0, travel: 0, fuel: 0, utilities: 0, other: 0 },
      totalMonthly: 0,
    };
  }

  const src = spendInput.spending || spendInput.monthlySpends || spendInput;
  const merchantsSrc = src.merchants || spendInput.merchants || {};
  const categoriesSrc = src.categories || src;

  // 1. Itemize declared merchants
  const itemizedMerchants = {};
  const merchantSpendByCategory = {
    shopping: 0,
    dining: 0,
    groceries: 0,
    travel: 0,
    fuel: 0,
    utilities: 0,
    other: 0,
  };

  Object.entries(merchantsSrc).forEach(([mId, rawVal]) => {
    const amt = toAmount(rawVal);
    if (amt > 0) {
      const def = resolveMerchant(mId) || { id: mId, name: mId, category: "other" };
      const cat = def.category || "other";
      itemizedMerchants[mId] = {
        id: mId,
        name: def.name,
        category: cat,
        monthlySpend: amt,
      };
      merchantSpendByCategory[cat] = (merchantSpendByCategory[cat] || 0) + amt;
    }
  });

  // 2. Parse category amounts
  const categoryTotals = {
    shopping: toAmount(categoriesSrc.shopping || categoriesSrc.online),
    dining: toAmount(categoriesSrc.dining),
    groceries: toAmount(categoriesSrc.groceries || categoriesSrc.grocery),
    travel: toAmount(categoriesSrc.travel),
    fuel: toAmount(categoriesSrc.fuel),
    utilities: toAmount(categoriesSrc.utilities || categoriesSrc.bills),
    other: toAmount(categoriesSrc.other || categoriesSrc.entertainment || categoriesSrc.subscriptions),
  };

  const unallocatedCategories = {};
  let totalMonthly = 0;

  ["dining", "groceries", "shopping", "travel", "fuel", "utilities", "other"].forEach((cat) => {
    const merchantAmt = merchantSpendByCategory[cat] || 0;
    const catTotal = Math.max(categoryTotals[cat] || 0, merchantAmt);
    categoryTotals[cat] = catTotal;
    const unallocated = Math.max(0, catTotal - merchantAmt);
    unallocatedCategories[cat] = unallocated;
    totalMonthly += merchantAmt + unallocated;
  });

  return {
    itemizedMerchants,
    categoryTotals,
    unallocatedCategories,
    totalMonthly,
  };
}

/**
 * Calculate net annual reward value for a specific card using the user's spending profile.
 *
 * @param {object} card - Record from data/cards.json
 * @param {object} spendInput - Monthly category or detailed merchant spending object
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

  const detailed = extractDetailedSpend(spendInput);
  const merchantBreakdown = [];
  const categoryBreakdown = [];
  let totalMonthlyRewards = 0;
  let totalMonthlySpend = detailed.totalMonthly;

  // 1. Calculate rewards on itemized merchants
  Object.values(detailed.itemizedMerchants).forEach((merchant) => {
    const rule = getMerchantRewardRule(card.slug, merchant.id, merchant.category, rules);
    let earn = (merchant.monthlySpend * rule.rate * (rules.pointValue || 1.0)) / 100;
    if (rule.cap && rule.cap < Infinity) {
      earn = Math.min(earn, rule.cap);
    }
    totalMonthlyRewards += earn;
    merchantBreakdown.push({
      id: merchant.id,
      name: merchant.name,
      category: merchant.category,
      monthlySpend: merchant.monthlySpend,
      annualSpend: merchant.monthlySpend * 12,
      effectiveRate: rule.rate,
      isAccelerated: rule.isAccelerated,
      isDirectPartner: rule.isDirectPartner,
      monthlyRewards: Math.round(earn),
      annualRewards: Math.round(earn * 12),
      note: rule.note,
    });
  });

  // 2. Calculate rewards on unallocated category spend
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
    const monthlySpend = detailed.unallocatedCategories[cat.key] || 0;
    if (monthlySpend <= 0) continue;

    const ratePercent = rules.rates[cat.key] ?? (cat.key === "fuel" ? 0 : 1.0);
    let monthlyEarn = (monthlySpend * ratePercent * (rules.pointValue || 1.0)) / 100;

    // Apply specific monthly category caps if defined
    if (rules.caps?.sharedMonthlyCashback) {
      // Hard cap across categories (e.g. HSBC RuPay Cashback ₹400/mo cap)
      // will be applied after summing
    } else if ((cat.key === "dining" || cat.key === "groceries") && rules.caps?.diningGroceryMonthlyCashback) {
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
      monthlyEarn = (cappedSpend * ratePercent * (rules.pointValue || 1.0)) / 100;
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

  // Apply card-level hard monthly ceiling if defined (e.g. HSBC RuPay ₹400/mo cap across all categories & merchants)
  if (rules.caps?.sharedMonthlyCashback && totalMonthlyRewards > rules.caps.sharedMonthlyCashback) {
    totalMonthlyRewards = rules.caps.sharedMonthlyCashback;
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

  // Identify top contributing spending categories and merchants
  const topContributors = [
    ...merchantBreakdown.map((m) => `${m.name} (~₹${m.annualRewards.toLocaleString("en-IN")}/yr)`),
    ...categoryBreakdown.filter((c) => c.annualRewards > 0).map((c) => `${c.label} (~₹${c.annualRewards.toLocaleString("en-IN")}/yr)`),
  ].slice(0, 3);

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
    merchantBreakdown,
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
 * Deterministically routes each merchant and category expense to the card in
 * the combination that provides the highest return, avoiding double-counting
 * and applying individual card caps, milestones, and spend-based fee waivers.
 *
 * @param {Array<object>} cards - Array of 1, 2, or 3 card objects
 * @param {object} spendInput - Monthly category or detailed merchant spending object
 * @returns {object} Full combination valuation with allocations, gross rewards, fees, and net value.
 */
export function calculateCombinationNetValue(cards, spendInput) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return {
      cards: [],
      allocations: {},
      merchantAllocations: {},
      totalMonthlySpend: 0,
      totalAnnualSpend: 0,
      grossRewards: 0,
      totalFees: 0,
      netValue: 0,
      effectiveReturnPercent: 0,
    };
  }

  const detailed = extractDetailedSpend(spendInput);

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

  // Track spend allocated per card:
  const allocatedCardSpends = {};
  cards.forEach((c) => {
    allocatedCardSpends[c.slug] = {
      merchants: {},
      categories: {},
      totalMonthly: 0,
    };
  });

  const merchantAllocations = {};
  const categoryAllocations = {};
  let totalMonthlySpend = 0;

  // Step 1: Assign each itemized merchant to the card in the combo yielding the highest return
  Object.values(detailed.itemizedMerchants).forEach((merchant) => {
    const monthlyAmt = merchant.monthlySpend;
    if (monthlyAmt <= 0) return;

    totalMonthlySpend += monthlyAmt;

    let bestCard = cards[0];
    let bestYield = -1;
    let bestRate = 0;
    let bestNote = "";

    for (const card of cards) {
      const rules = cardRuleMap[card.slug];
      const mRule = getMerchantRewardRule(card.slug, merchant.id, merchant.category, rules);
      let earn = (monthlyAmt * mRule.rate * (rules.pointValue || 1.0)) / 100;
      if (mRule.cap && mRule.cap < Infinity) {
        earn = Math.min(earn, mRule.cap);
      }
      if (earn > bestYield) {
        bestYield = earn;
        bestCard = card;
        bestRate = mRule.rate;
        bestNote = mRule.note;
      }
    }

    allocatedCardSpends[bestCard.slug].merchants[merchant.id] = {
      ...merchant,
      effectiveRate: bestRate,
      monthlyEarn: bestYield,
      note: bestNote,
    };
    allocatedCardSpends[bestCard.slug].totalMonthly += monthlyAmt;

    merchantAllocations[merchant.id] = {
      merchantId: merchant.id,
      merchantName: merchant.name,
      category: merchant.category,
      cardName: bestCard.name,
      cardSlug: bestCard.slug,
      monthlySpend: monthlyAmt,
      annualSpend: monthlyAmt * 12,
      effectiveRate: bestRate,
      monthlyRewards: Math.round(bestYield),
      annualRewards: Math.round(bestYield * 12),
      note: bestNote,
    };
  });

  // Step 2: Assign unallocated category spends to the card yielding the highest category return
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
    const monthlyAmt = detailed.unallocatedCategories[cat.key] || 0;
    if (monthlyAmt <= 0) continue;

    totalMonthlySpend += monthlyAmt;

    let bestCard = cards[0];
    let bestYield = -1;
    let bestRate = 0;

    for (const card of cards) {
      const rules = cardRuleMap[card.slug];
      const rate = rules.rates[cat.key] ?? (cat.key === "fuel" ? 0 : 1.0);
      const effectiveYield = (monthlyAmt * rate * (rules.pointValue || 1.0)) / 100;

      if (effectiveYield > bestYield) {
        bestYield = effectiveYield;
        bestCard = card;
        bestRate = rate;
      }
    }

    allocatedCardSpends[bestCard.slug].categories[cat.key] = monthlyAmt;
    allocatedCardSpends[bestCard.slug].totalMonthly += monthlyAmt;

    categoryAllocations[cat.key] = {
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

  // Step 3: Compute per-card totals, fees, waivers, and net returns
  const cardValuations = [];
  let totalGrossRewards = 0;
  let totalApplicableFees = 0;
  let totalLoungeVisits = 0;
  let hasZeroForex = false;
  let hasFuelWaiver = false;

  for (const card of cards) {
    const rules = cardRuleMap[card.slug];
    const alloc = allocatedCardSpends[card.slug];
    let cardMonthlyRewards = 0;
    const cardBreakdown = [];

    // Add merchant earns
    Object.values(alloc.merchants).forEach((m) => {
      cardMonthlyRewards += m.monthlyEarn;
      cardBreakdown.push({
        key: `m_${m.id}`,
        label: m.name,
        monthlySpend: m.monthlySpend,
        annualSpend: m.monthlySpend * 12,
        effectiveRate: m.effectiveRate,
        monthlyRewards: Math.round(m.monthlyEarn),
        annualRewards: Math.round(m.monthlyEarn * 12),
        note: m.note,
      });
    });

    // Add unallocated category earns with category caps
    for (const cat of activeCategories) {
      const spendAmt = alloc.categories[cat.key] || 0;
      if (spendAmt <= 0) continue;

      const ratePercent = rules.rates[cat.key] ?? (cat.key === "fuel" ? 0 : 1.0);
      let earn = (spendAmt * ratePercent * (rules.pointValue || 1.0)) / 100;

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
        earn = (capped * ratePercent * (rules.pointValue || 1.0)) / 100;
      } else if (cat.key === "groceries" && rules.caps?.groceryMonthlyPoints) {
        earn = Math.min(earn, rules.caps.groceryMonthlyPoints * rules.pointValue);
      } else if (cat.key === "groceries" && rules.caps?.groceryMonthlyCoins) {
        earn = Math.min(earn, rules.caps.groceryMonthlyCoins * rules.pointValue);
      }

      cardMonthlyRewards += earn;
      cardBreakdown.push({
        key: cat.key,
        label: cat.label,
        monthlySpend: spendAmt,
        annualSpend: spendAmt * 12,
        effectiveRate: ratePercent,
        monthlyRewards: Math.round(earn),
        annualRewards: Math.round(earn * 12),
      });
    }

    const cardMonthlySpend = alloc.totalMonthly;

    // Monthly bonus milestone
    if (rules.monthlyBonusMilestone && cardMonthlySpend >= rules.monthlyBonusMilestone.minSpend) {
      const bonusPts = rules.monthlyBonusMilestone.bonusPoints || rules.monthlyBonusMilestone.spendBonusPoints || 0;
      const bonusVal = bonusPts * rules.pointValue;
      cardMonthlyRewards += bonusVal;
      cardBreakdown.push({
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

    // Fee waiver
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

    // Merchants benefiting from this card
    const benefitedMerchants = Object.values(alloc.merchants).map((m) => ({
      id: m.id,
      name: m.name,
      monthlySpend: m.monthlySpend,
      effectiveRate: m.effectiveRate,
      annualRewards: Math.round(m.monthlyEarn * 12),
      note: m.note,
    }));

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
      categoryBreakdown: cardBreakdown,
      benefitedMerchants,
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
    allocations: categoryAllocations,
    merchantAllocations,
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
