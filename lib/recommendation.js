/**
 * CardWise — Rule-based recommendation engine
 * ============================================================
 * NO machine learning. NO AI. This is a transparent weighted
 * scoring system you can explain line by line in a viva.
 *
 * How it works, in one paragraph:
 *   Each of the five questionnaire answers awards points to a
 *   card across six scoring dimensions. Every dimension has a
 *   maximum achievable score. We add up the points a card earns,
 *   divide by the total points available, and express the result
 *   as a percentage from 0 to 100. That percentage is the match
 *   score. Because every point is awarded by an explicit rule,
 *   we can also list exactly WHY a card scored what it scored.
 */

// ------------------------------------------------------------
// 1. THE QUESTIONS
// Rendered by components/RecommendationQuiz.jsx. Keeping them
// here means the quiz UI and the scoring logic can never drift
// apart — both read the same source of truth.
// ------------------------------------------------------------
export const QUESTIONS = [
  {
    id: "priority",
    question: "What matters most to you?",
    help: "We weight this answer most heavily.",
    options: [
      { value: "cashback", label: "Cashback" },
      { value: "travel", label: "Travel" },
      { value: "rewards", label: "Rewards" },
      { value: "fuel", label: "Fuel" },
      { value: "lowfees", label: "Low fees" },
    ],
  },
  {
    id: "spendArea",
    question: "Where do you spend the most?",
    help: "Your largest spending category.",
    options: [
      { value: "online", label: "Online shopping" },
      { value: "dining", label: "Dining" },
      { value: "travel", label: "Travel" },
      { value: "fuel", label: "Fuel" },
      { value: "general", label: "General purchases" },
    ],
  },
  {
    id: "monthlySpend",
    question: "What is your approximate monthly spending?",
    help: "This decides whether an annual fee can pay for itself.",
    options: [
      { value: "under25k", label: "Under ₹25,000" },
      { value: "25to50k", label: "₹25,000 – ₹50,000" },
      { value: "50to100k", label: "₹50,000 – ₹1,00,000" },
      { value: "over100k", label: "₹1,00,000+" },
    ],
  },
  {
    id: "feeSensitivity",
    question: "How important is a low annual fee?",
    help: "Fee-sensitive answers push lifetime-free cards up the list.",
    options: [
      { value: "very", label: "Very important" },
      { value: "somewhat", label: "Somewhat important" },
      { value: "no", label: "Doesn't matter" },
    ],
  },
  {
    id: "travelFrequency",
    question: "How frequently do you travel?",
    help: "Lounge access and miles only pay off if you fly.",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "frequently", label: "Frequently" },
    ],
  },
];

// ------------------------------------------------------------
// 2. THE SCORING DIMENSIONS
// Each dimension has a maximum. The maxima add up to MAX_TOTAL,
// which is the denominator for the percentage.
// ------------------------------------------------------------
const DIMENSIONS = {
  priority: 30, // biggest weight — the user's stated preference
  spendArea: 25, // where their money actually goes
  fees: 20, // annual fee vs. their fee sensitivity
  travel: 15, // lounge + travel benefits vs. travel frequency
  earnRate: 10, // raw cashback / reward strength
};

const MAX_TOTAL = Object.values(DIMENSIONS).reduce((sum, n) => sum + n, 0); // 100

// ------------------------------------------------------------
// 3. SMALL HELPERS
// ------------------------------------------------------------

/** Does the card carry this tag or category? */
function has(card, keyword) {
  const haystack = [card.category, ...(card.tags || [])].map((t) =>
    String(t).toLowerCase(),
  );
  return haystack.includes(keyword.toLowerCase());
}

/** Clamp a number into a range. */
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/** Turn a raw score + maximum into an English rating word. */
function rate(score, max) {
  const pct = max === 0 ? 0 : score / max;
  if (pct >= 0.85) return "Excellent";
  if (pct >= 0.6) return "Good";
  if (pct >= 0.35) return "Average";
  return "Limited";
}

// ------------------------------------------------------------
// 4. THE FIVE SCORING RULES
// Each returns { score, max, reason }. `reason` is only used
// when the rule contributed meaningfully to the total.
// ------------------------------------------------------------

/** Rule 1 — does the card serve the user's stated top priority? */
function scorePriority(card, answers) {
  const max = DIMENSIONS.priority;
  const priority = answers.priority;
  let score = 0;
  let reason = "";

  if (priority === "cashback") {
    if (has(card, "cashback")) {
      // Scale by the actual cashback rate: 5% earns full marks.
      score = clamp((card.cashbackRate / 5) * max, 0, max);
      reason = `earns up to ${card.cashbackRate}% cashback`;
    }
  } else if (priority === "travel") {
    if (has(card, "travel")) {
      score = max;
      reason = "is built around travel benefits";
    } else if (card.loungeAccess > 0) {
      score = max * 0.4;
      reason = "includes airport lounge access";
    }
  } else if (priority === "rewards") {
    if (has(card, "rewards")) {
      score = max;
      reason = "is a rewards-focused card";
    } else if (card.rewardRate > 0) {
      score = max * 0.5;
      reason = "accrues reward points on every spend";
    }
  } else if (priority === "fuel") {
    if (has(card, "fuel")) {
      score = max;
      reason = "is a dedicated fuel card";
    }
  } else if (priority === "lowfees") {
    if (card.annualFee === 0) {
      score = max;
      reason = "is lifetime free";
    } else if (card.annualFee <= 1000) {
      score = max * 0.6;
      reason = `has a low annual fee of ₹${card.annualFee}`;
    }
  }

  return { score, max, reason };
}

/** Rule 2 — does the card reward the category they spend most in? */
function scoreSpendArea(card, answers) {
  const max = DIMENSIONS.spendArea;
  const area = answers.spendArea;
  let score = 0;
  let reason = "";

  if (area === "online") {
    if (has(card, "online") || has(card, "shopping")) {
      score = max;
      reason = "targets online shopping directly";
    } else if (card.cashbackRate >= 2) {
      score = max * 0.5;
      reason = "returns solid cashback on general online spends";
    }
  } else if (area === "dining") {
    if (has(card, "dining") || has(card, "groceries")) {
      score = max;
      reason = "accelerates earnings on dining and delivery";
    } else if (card.diningBenefits && !/^no /i.test(card.diningBenefits)) {
      score = max * 0.45;
      reason = "carries a dining discount programme";
    }
  } else if (area === "travel") {
    if (has(card, "travel")) {
      score = max;
      reason = "earns the most on flight and hotel bookings";
    } else if (card.loungeAccess >= 4) {
      score = max * 0.4;
      reason = "offers useful lounge access when travelling";
    }
  } else if (area === "fuel") {
    if (has(card, "fuel")) {
      score = max;
      reason = "is optimised for fuel spending";
    } else if (card.fuelBenefits && /waiver/i.test(card.fuelBenefits)) {
      score = max * 0.3;
      reason = "waives the fuel surcharge";
    }
  } else if (area === "general") {
    // For general spending, a strong flat base rate matters most.
    const flat = Math.max(card.cashbackRate, card.rewardRate / 5);
    score = clamp((flat / 5) * max, 0, max);
    if (score > max * 0.5) reason = "has a strong flat rate on everyday spends";
  }

  return { score, max, reason };
}

/** Rule 3 — is the annual fee acceptable, given spend and sensitivity? */
function scoreFees(card, answers) {
  const max = DIMENSIONS.fees;
  const { feeSensitivity, monthlySpend } = answers;
  let score;
  let reason = "";

  // Free cards always score full marks on this dimension.
  if (card.annualFee === 0) {
    score = max;
    reason = "costs nothing to hold";
  } else {
    // Map the spend band to an annual figure and work out whether
    // the fee is a meaningful proportion of yearly spending.
    const annualSpend = {
      under25k: 240000,
      "25to50k": 450000,
      "50to100k": 900000,
      over100k: 1800000,
    }[monthlySpend] ?? 450000;

    const feeRatio = card.annualFee / annualSpend; // smaller is better
    // 0.5% of annual spend or more is treated as an expensive fee.
    const affordability = clamp(1 - feeRatio / 0.005, 0, 1);
    score = affordability * max;

    if (affordability > 0.7) {
      reason = `the ₹${card.annualFee} fee is small next to your spending`;
    }
  }

  // Fee sensitivity scales the whole dimension: someone who does not
  // care about fees should not be penalised for a premium card.
  if (feeSensitivity === "no") {
    score = max * 0.75 + score * 0.25; // flatten the differences
  } else if (feeSensitivity === "very" && card.annualFee > 2000) {
    score = score * 0.4; // punish expensive cards hard
    reason = "";
  }

  return { score: clamp(score, 0, max), max, reason };
}

/** Rule 4 — do travel benefits match how often they actually travel? */
function scoreTravel(card, answers) {
  const max = DIMENSIONS.travel;
  const freq = answers.travelFrequency;
  let reason = "";

  // Lounge visits are the clearest proxy for travel value.
  const loungeStrength = clamp(card.loungeAccess / 12, 0, 1);

  // How much the user should care, given their travel frequency.
  const weight = { rarely: 0.15, sometimes: 0.55, frequently: 1 }[freq] ?? 0.5;

  // Someone who rarely travels gets credit for NOT paying for lounges.
  let score;
  if (freq === "rarely") {
    score = card.loungeAccess === 0 ? max * 0.8 : max * (1 - loungeStrength) * 0.8;
    if (card.loungeAccess === 0) reason = "does not charge you for travel perks you would not use";
  } else {
    score = loungeStrength * max * weight + max * (1 - weight) * 0.5;
    if (loungeStrength > 0.6) {
      reason = `includes ${card.loungeAccess} lounge visits a year`;
    }
  }

  return { score: clamp(score, 0, max), max, reason };
}

/** Rule 5 — raw earning strength, independent of preference. */
function scoreEarnRate(card) {
  const max = DIMENSIONS.earnRate;
  // Normalise the two currencies onto one axis. Reward points are
  // worth roughly a fifth of a cashback percentage point here, which
  // is a deliberate simplification we state in the UI.
  const normalised = Math.max(card.cashbackRate, card.rewardRate / 5);
  const score = clamp((normalised / 5) * max, 0, max);
  return { score, max, reason: "" };
}

// ------------------------------------------------------------
// 5. SCORE A SINGLE CARD
// ------------------------------------------------------------
/**
 * @param {object} card    a record from data/cards.json
 * @param {object} answers { priority, spendArea, monthlySpend, feeSensitivity, travelFrequency }
 * @returns {object} card, matchScore (0-100), breakdown[], reasons[], why
 */
export function scoreCard(card, answers) {
  const results = {
    priority: scorePriority(card, answers),
    spendArea: scoreSpendArea(card, answers),
    fees: scoreFees(card, answers),
    travel: scoreTravel(card, answers),
    earnRate: scoreEarnRate(card),
  };

  const total = Object.values(results).reduce((sum, r) => sum + r.score, 0);
  const matchScore = Math.round((total / MAX_TOTAL) * 100);

  // Human-readable per-dimension breakdown for the results page.
  const LABELS = {
    priority: "Your priority",
    spendArea: "Your spending",
    fees: "Annual fee",
    travel: "Travel value",
    earnRate: "Earn rate",
  };

  const breakdown = Object.entries(results).map(([key, r]) => ({
    key,
    label: LABELS[key],
    rating: rate(r.score, r.max),
    score: Math.round(r.score),
    max: r.max,
  }));

  // Collect the reasons the rules produced, strongest first.
  const reasons = Object.values(results)
    .filter((r) => r.reason && r.score > r.max * 0.4)
    .sort((a, b) => b.score / b.max - a.score / a.max)
    .map((r) => r.reason);

  return {
    card,
    matchScore: clamp(matchScore, 0, 100),
    breakdown,
    reasons,
    why: buildWhy(card, answers, reasons),
  };
}

// ------------------------------------------------------------
// 6. PLAIN-ENGLISH EXPLANATION
// Never claim AI. State the rules that fired, in ordinary words.
// ------------------------------------------------------------
function buildWhy(card, answers, reasons) {
  const priorityWord = {
    cashback: "you prioritise cashback",
    travel: "you prioritise travel benefits",
    rewards: "you prioritise reward points",
    fuel: "you prioritise fuel savings",
    lowfees: "you prefer a low annual fee",
  }[answers.priority];

  const areaWord = {
    online: "spend most of your money online",
    dining: "spend most of your money on dining and delivery",
    travel: "spend most of your money on travel",
    fuel: "spend most of your money on fuel",
    general: "spread your spending across everyday purchases",
  }[answers.spendArea];

  const opening = `You told us ${priorityWord} and ${areaWord}.`;

  if (reasons.length === 0) {
    return `${opening} This card is a reasonable general-purpose option, though nothing about it lines up strongly with those answers.`;
  }

  const list =
    reasons.length === 1
      ? reasons[0]
      : `${reasons.slice(0, -1).join(", ")} and ${reasons[reasons.length - 1]}`;

  return `${opening} ${card.name} ${list}.`;
}

// ------------------------------------------------------------
// 7. RANK EVERY CARD
// ------------------------------------------------------------
/**
 * Score the whole catalogue and return the best matches.
 *
 * @param {Array}  cards   data/cards.json
 * @param {object} answers questionnaire answers
 * @param {number} limit   how many results to return (default 3)
 */
export function getRecommendations(cards, answers, limit = 3) {
  if (!answers || !answers.priority) return [];

  return cards
    .map((card) => scoreCard(card, answers))
    .sort((a, b) => {
      // Highest score wins; ties broken by the cheaper annual fee.
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return a.card.annualFee - b.card.annualFee;
    })
    .slice(0, limit);
}

/** True once every question has an answer — used to gate the submit button. */
export function isComplete(answers) {
  return QUESTIONS.every((q) => Boolean(answers && answers[q.id]));
}
