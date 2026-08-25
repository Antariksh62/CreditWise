/**
 * CardWise — Reward calculator
 * ============================================================
 * Client-side estimator. Takes monthly spending split across
 * five categories and returns annual spend plus estimated
 * annual rewards for a given card.
 *
 * This is a deliberate simplification for an educational demo:
 * real cards apply monthly caps, excluded categories and
 * variable point valuations. The UI states that clearly.
 */

/** The five spending categories the calculator accepts. */
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

/**
 * How much better than the base rate each category earns, per card
 * category. 1 means the base rate applies; 2 means double.
 * Keeping this table explicit makes the maths auditable.
 */
const CATEGORY_MULTIPLIERS = {
  cashback: { online: 2.0, dining: 1.2, travel: 1.0, fuel: 0.5, other: 1.0 },
  travel: { online: 1.0, dining: 1.2, travel: 2.5, fuel: 0.5, other: 1.0 },
  rewards: { online: 1.4, dining: 1.4, travel: 1.4, fuel: 0.5, other: 1.0 },
  fuel: { online: 0.8, dining: 1.2, travel: 0.8, fuel: 3.0, other: 0.8 },
  "lifetime-free": { online: 1.3, dining: 1.3, travel: 1.0, fuel: 0.6, other: 1.0 },
};

const DEFAULT_MULTIPLIERS = { online: 1, dining: 1, travel: 1, fuel: 1, other: 1 };

/**
 * One reward point is assumed to be worth 25 paise when redeemed
 * sensibly. Stated in the UI so the number is never presented as
 * an exact figure.
 */
export const POINT_VALUE_IN_RUPEES = 0.25;

/** Coerce any user input into a non-negative number. */
function toAmount(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Total monthly spending across all categories. */
export function getMonthlyTotal(spend) {
  return SPEND_CATEGORIES.reduce((sum, c) => sum + toAmount(spend?.[c.key]), 0);
}

/**
 * Effective base return rate of a card, as a percentage.
 * Cashback cards use their cashback rate directly. Points cards
 * convert: rewardRate points per ₹100, each worth POINT_VALUE.
 */
export function getBaseRate(card) {
  if (card.cashbackRate > 0) return card.cashbackRate;
  if (card.rewardRate > 0) return card.rewardRate * POINT_VALUE_IN_RUPEES;
  return 0;
}

/**
 * Estimate annual rewards for one card against a spending profile.
 *
 * @param {object} card  a record from data/cards.json
 * @param {object} spend { online, dining, travel, fuel, other } monthly rupees
 * @returns {object} monthlySpend, annualSpend, annualRewards, effectiveRate, perCategory[]
 */
export function calculateRewards(card, spend) {
  const baseRate = getBaseRate(card);
  const multipliers = CATEGORY_MULTIPLIERS[card.category] || DEFAULT_MULTIPLIERS;

  const perCategory = SPEND_CATEGORIES.map((c) => {
    const monthly = toAmount(spend?.[c.key]);
    const annual = monthly * 12;
    // rate is capped at 10% so a generous multiplier cannot produce
    // an absurd headline number.
    const rate = Math.min(baseRate * (multipliers[c.key] ?? 1), 10);
    const rewards = (annual * rate) / 100;
    return {
      key: c.key,
      label: c.label,
      monthly,
      annual,
      rate: Number(rate.toFixed(2)),
      rewards: Math.round(rewards),
    };
  });

  const monthlySpend = getMonthlyTotal(spend);
  const annualSpend = monthlySpend * 12;
  const annualRewards = perCategory.reduce((sum, c) => sum + c.rewards, 0);

  // Net of the annual fee — the number that actually matters.
  const netAnnualRewards = annualRewards - (card.annualFee || 0);

  return {
    monthlySpend,
    annualSpend,
    annualRewards: Math.round(annualRewards),
    netAnnualRewards: Math.round(netAnnualRewards),
    effectiveRate:
      annualSpend > 0 ? Number(((annualRewards / annualSpend) * 100).toFixed(2)) : 0,
    perCategory,
  };
}

/**
 * Run the calculator across every card and rank by net rewards.
 * Used by the full /compare and calculator pages.
 */
export function rankCardsByRewards(cards, spend, limit = 5) {
  return cards
    .map((card) => ({ card, ...calculateRewards(card, spend) }))
    .sort((a, b) => b.netAnnualRewards - a.netAnnualRewards)
    .slice(0, limit);
}

/** Format a number as Indian rupees, e.g. 480000 -> "₹4,80,000". */
export function formatRupees(amount) {
  const n = Math.round(Number(amount) || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}
