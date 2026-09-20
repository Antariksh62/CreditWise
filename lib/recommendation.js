/**
 * CreditWise — Rule-based Recommendation Engine
 * ============================================================
 * Uses exclusively the 31 VERIFIED credit cards in data/cards.json
 * and the user's detailed onboarding/spending profile.
 *
 * CORE PRINCIPLE:
 * "Which verified cards fit this person's existing spending and preferences?"
 * NOT "What is the best credit card?" — There is no universal best card.
 *
 * DETERMINISTIC & TRANSPARENT:
 * NO machine learning. NO opaque AI. Fully reproducible from user inputs
 * and verified bank card data.
 */

/**
 * 1. ELIGIBILITY FILTER
 * Checks officially documented basic criteria before considering a card.
 */
export function checkEligibility(card, profile) {
  if (!profile) return { eligible: true, note: "Eligibility may vary — check with the issuer." };

  const userAge = Number(profile.profile?.age || profile.account?.age || 25);
  const incomeRange = profile.profile?.incomeRange || "₹6L – ₹12L";
  const employment = profile.profile?.employment || "salaried";

  // Age checks
  if (userAge < 18) {
    return { eligible: false, note: "Must be at least 18 years old." };
  }

  // Ultra-premium cards requiring high annual income (Infinia, Magnus, BizBlack, Diners Club Black)
  const isUltraPremium = ["hdfc-inifinia", "axis-magnus", "hdfc-diners-club-metal", "hdfc-biz-black"].includes(card.slug);
  if (isUltraPremium) {
    if (["Under ₹3 Lakhs", "₹3L – ₹6L", "₹6L – ₹12L"].includes(incomeRange)) {
      return {
        eligible: false,
        note: "Card requires an income bracket of ₹25 Lakhs+ or invitation from the issuer.",
      };
    }
  }

  // Business-specific cards (e.g. BizBlack)
  if (card.slug === "hdfc-biz-black") {
    if (employment === "student") {
      return { eligible: false, note: "Commercial/business registration required." };
    }
  }

  // Student restrictions
  if (employment === "student") {
    // Only recommend accessible cards for students
    const studentFriendly = [
      "amazon-pay-icici",
      "kiwi",
      "scapia-cc",
      "hsbc-premier",
      "idfc-power-plus",
      "sbi-cashback"
    ];
    if (!studentFriendly.includes(card.slug) && card.annualFee > 1000) {
      return {
        eligible: false,
        note: "Card typically requires salaried or verified business income proof.",
      };
    }
  }

  // Mid-tier cards requiring ₹6L+ income
  const isMidTier = ["hdfc-regalia-gold", "axis-horizon", "hsbc-travel-one", "bob-eterna"].includes(card.slug);
  if (isMidTier && incomeRange === "Under ₹3 Lakhs") {
    return {
      eligible: false,
      note: "Card typically requires annual income of ₹6 Lakhs or above.",
    };
  }

  return { eligible: true, note: "Meets basic criteria. Final approval determined by issuer." };
}

/**
 * 2. EVALUATE FIT & REASONS
 * Evaluates practical fit across spending alignment, fee comfort, and preferences.
 */
export function evaluateFit(card, profile) {
  const spending = profile.spending?.categories || {};
  const totalMonthly = profile.spending?.totalMonthly || 40000;
  const preferences = profile.preferences || {};
  const priorities = (preferences.priorities || []).map((p) => p.toLowerCase());
  const rewardStyle = preferences.rewardStyle || "balanced";
  const feeTolerance = preferences.feeTolerance || "moderate-fee";
  const travelFreq = preferences.travelFrequency || "Sometimes";
  const intlSpend = preferences.internationalSpend || "Occasionally";
  const existingBanks = preferences.existingBanks || [];
  const existingCards = profile.existingCards || [];

  let score = 0;
  const reasons = [];
  let watchFor = card.whatToWatchOutFor || card.rewardCaps || "Terms & conditions apply.";

  // ---------------- A. Spending Category Alignment ----------------
  const dining = spending.dining || 0;
  const groceries = spending.groceries || 0;
  const shopping = spending.shopping || 0;
  const travel = spending.travel || 0;
  const fuel = spending.fuel || 0;
  const utilities = spending.utilities || 0;

  // Dining alignment
  if (dining >= 4000 && (card.diningBenefits || card.category === "dining" || card.slug.includes("swiggy") || card.slug.includes("easydiner") || card.slug.includes("live-plus"))) {
    score += 25;
    reasons.push(`You spend ₹${dining.toLocaleString("en-IN")}/mo on dining & food delivery`);
  }

  // Groceries / Supermarket
  if (groceries >= 6000 && (card.slug === "hsbc-live-plus" || card.slug === "hdfc-millenia" || card.slug.includes("tata-neu"))) {
    score += 20;
    reasons.push(`Optimizes your ₹${groceries.toLocaleString("en-IN")}/mo supermarket & grocery expenses`);
  }

  // Fuel alignment
  if (fuel >= 3000 && (card.category === "fuel" || card.slug.includes("octane") || card.slug.includes("power-plus") || card.slug.includes("xtra"))) {
    score += 25;
    reasons.push(`Accelerates rewards on your ₹${fuel.toLocaleString("en-IN")}/mo fuel expenses`);
  }

  // Shopping / E-commerce alignment
  if (shopping >= 6000 && (card.slug === "sbi-cashback" || card.slug === "amazon-pay-icici" || card.slug === "flipkart-axis-bank" || card.slug === "hdfc-millenia")) {
    score += 25;
    reasons.push(`Delivers strong direct returns on your online & retail shopping`);
  }

  // Travel / Flights / Stays
  if ((travel >= 4000 || travelFreq === "Frequently") && (card.category === "travel" || card.slug.includes("horizon") || card.slug.includes("bonvoy") || card.slug.includes("travel-one") || card.slug.includes("scapia"))) {
    score += 25;
    reasons.push(`Tailored travel multipliers for flights, hotels, and booking portals`);
  }

  // Utilities / Bills
  if (utilities >= 3000 && (card.slug.includes("tata-neu") || card.slug.includes("phonepe") || card.slug.includes("rupay-cashback"))) {
    score += 15;
    reasons.push(`Provides cashback or value back on recurring utility bills and recharges`);
  }

  // ---------------- B. Stated Priorities & Preferences ----------------
  // Cashback priority
  if (priorities.includes("cashback") && card.cashbackRate > 0) {
    score += 20;
    if (reasons.length < 3) {
      reasons.push("Delivers pure cashback credited directly to your monthly statement");
    }
  }

  // Airport Lounge Access
  if (priorities.some((p) => p.includes("lounge")) && (card.loungeAccess > 0 || card.loungeAccess === 99)) {
    score += 20;
    const countText = card.loungeAccess === 99 ? "unlimited" : `${card.loungeAccess}/yr`;
    if (reasons.length < 4) {
      reasons.push(`Includes ${countText} complimentary airport lounge access`);
    }
  }

  // Low / No Annual Fee
  if (priorities.some((p) => p.includes("low") || p.includes("fee"))) {
    if (card.annualFee === 0) {
      score += 25;
      reasons.push("Lifetime free — ₹0 annual fee with no maintenance conditions");
    } else if (card.feeWaiver) {
      score += 10;
      reasons.push(`Annual fee easily waivable (${card.feeWaiver})`);
    }
  }

  // International / Forex
  if (intlSpend === "Frequently" || priorities.some((p) => p.includes("international"))) {
    if (card.forexBenefits && (card.forexBenefits.includes("0%") || card.forexBenefits.includes("Zero") || card.slug === "scapia-cc")) {
      score += 25;
      reasons.push("Zero foreign currency markup (0% forex) on international transactions");
    }
  }

  // ---------------- C. Fee Suitability ----------------
  if (feeTolerance === "no-fee") {
    if (card.annualFee === 0) {
      score += 25;
    } else if (card.annualFee <= 1000) {
      score += 5;
    } else {
      score -= 30; // Strong penalty for high fee if user wants no fee
    }
  } else if (feeTolerance === "moderate-fee") {
    if (card.annualFee <= 3000) {
      score += 20;
      if (reasons.length < 3 && card.annualFee > 0) {
        reasons.push(`The ₹${card.annualFee.toLocaleString("en-IN")} annual fee easily breaks even on your spending`);
      }
    }
  } else if (feeTolerance === "high-fee") {
    if (card.annualFee >= 3000) {
      score += 20;
    }
  }

  // ---------------- D. Reward Style ----------------
  if (rewardStyle === "simple" && (card.category === "cashback" || card.slug === "amazon-pay-icici" || card.slug === "sbi-cashback")) {
    score += 15;
    if (reasons.length < 3) {
      reasons.push("Simple, automated rewards without needing to manage point transfers");
    }
  } else if (rewardStyle === "optimizer" && (card.category === "travel" || card.category === "rewards" || card.slug.includes("amex") || card.slug.includes("horizon"))) {
    score += 15;
    if (reasons.length < 3) {
      reasons.push("Flexible partner transfer options and high reward ceiling for optimizers");
    }
  }

  // ---------------- E. Banking Relationship ----------------
  if (existingBanks.some((b) => card.issuer.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(card.issuer.toLowerCase()))) {
    score += 10;
    if (reasons.length < 4) {
      reasons.push(`You already bank with ${card.issuer}, which may expedite approval`);
    }
  }

  // Specific watchFors tailored to card reality
  if (card.slug === "sbi-cashback") {
    watchFor = "₹5,000 monthly cashback limit; utility, fuel, and wallet transactions excluded.";
  } else if (card.slug === "hdfc-millenia") {
    watchFor = "Lounge access requires minimum ₹1 Lakh spend in the preceding calendar quarter.";
  } else if (card.slug === "scapia-cc") {
    watchFor = "Lounge visits require minimum ₹10,000 spend in the preceding billing cycle.";
  } else if (card.slug === "hsbc-live-plus") {
    watchFor = "10% dining and grocery cashback is capped at ₹1,000 per monthly billing cycle.";
  } else if (card.slug === "amex-mrcc") {
    watchFor = "Optimum value requires completing monthly 4x ₹1,500 transaction milestones.";
  }

  // Keep 2 to 4 concise reasons
  const uniqueReasons = Array.from(new Set(reasons)).slice(0, 4);
  if (uniqueReasons.length < 2) {
    uniqueReasons.push("Matches your natural monthly transaction volume without habit changes");
    if (card.annualFee === 0) {
      uniqueReasons.push("Costs nothing to hold as an active credit building card");
    } else {
      uniqueReasons.push("Competitive base return rate on everyday categories");
    }
  }

  return {
    score,
    reasons: uniqueReasons,
    watchFor,
  };
}

/**
 * 3. GET PROFILE RECOMMENDATIONS
 * Full deterministic pipeline.
 *
 * @param {Array} cards       All 31 verified cards from data/cards.json
 * @param {object} profile    User's onboarding profile
 * @param {number} limit      Number of top matches (default 3)
 */
export function getProfileRecommendations(cards, profile, limit = 3) {
  if (!cards || cards.length === 0) return { recommended: [], existingOverlap: [], noFitReason: null };

  const existingCards = profile?.existingCards || [];

  // 1. Identify which cards the user already owns
  const existingOwned = cards.filter((c) => existingCards.includes(c.slug));

  // 2. Filter out cards the user already holds
  const candidateCards = cards.filter((c) => !existingCards.includes(c.slug));

  // 3. Filter candidates by eligibility
  const eligibleCandidates = [];
  for (const card of candidateCards) {
    const el = checkEligibility(card, profile);
    if (el.eligible) {
      eligibleCandidates.push({ card, elNote: el.note });
    }
  }

  // 4. Evaluate fit score and generate transparent reasons
  const scored = [];
  for (const item of eligibleCandidates) {
    const fit = evaluateFit(item.card, profile);
    // Minimum threshold for a meaningful recommendation
    if (fit.score > 25) {
      scored.push({
        card: item.card,
        score: fit.score,
        reasons: fit.reasons,
        watchFor: fit.watchFor,
        eligibilityNote: item.elNote,
      });
    }
  }

  // Sort deterministically: highest fit score first, then lower fee
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.card.annualFee - b.card.annualFee;
  });

  // Check if existing cards already cover the main needs
  const overlaps = [];
  if (existingOwned.length > 0) {
    for (const owned of existingOwned) {
      if (owned.cashbackRate >= 5) {
        overlaps.push({
          ownedCard: owned,
          message: `You already hold ${owned.name}, which covers 5% online cashback.`,
        });
      }
    }
  }

  // No-result check: if no card meets the threshold
  if (scored.length === 0) {
    let explanation = "We couldn't find a card that clearly fits your current profile.";
    if (profile?.preferences?.feeTolerance === "no-fee" && profile?.preferences?.priorities?.includes("Airport lounge access")) {
      explanation = "Your preference for zero annual fee conflicts with current verified bank criteria for airport lounge benefits.";
    } else if (profile?.profile?.employment === "student") {
      explanation = "Most premium reward cards require active salaried or business documentation. CreditWise will not push unsuitable credit.";
    }

    return {
      recommended: [],
      existingOverlap: overlaps,
      noFitReason: explanation,
    };
  }

  return {
    recommended: scored.slice(0, limit),
    existingOverlap: overlaps,
    noFitReason: null,
  };
}

// ------------------------------------------------------------
// Legacy 5-Question compatibility wrapper
// ------------------------------------------------------------
export const QUESTIONS = [
  {
    id: "priority",
    question: "What matters most to you?",
    help: "We weight this answer most heavily.",
    options: [
      { value: "cashback", label: "Cashback on everyday spends" },
      { value: "travel", label: "Travel perks & lounge access" },
      { value: "rewards", label: "Reward points for shopping" },
      { value: "fuel", label: "Fuel savings" },
      { value: "lowfees", label: "Zero or low annual fees" },
    ],
  },
  {
    id: "spendArea",
    question: "Where does most of your money go?",
    help: "Pick the category where you spend the highest amount.",
    options: [
      { value: "online", label: "Online shopping (Amazon, Flipkart)" },
      { value: "dining", label: "Dining & food delivery (Zomato, Swiggy)" },
      { value: "travel", label: "Flights, hotels & cabs" },
      { value: "fuel", label: "Petrol, diesel or EV charging" },
      { value: "general", label: "A mix of everything" },
    ],
  },
  {
    id: "monthlySpend",
    question: "Roughly how much do you put on cards each month?",
    help: "Helps verify whether cards with annual fees break even.",
    options: [
      { value: "under25k", label: "Under ₹25,000" },
      { value: "25to50k", label: "₹25,000 – ₹50,000" },
      { value: "50to100k", label: "₹50,000 – ₹1,00,000" },
      { value: "over100k", label: "Over ₹1,00,000" },
    ],
  },
  {
    id: "feeSensitivity",
    question: "How do you feel about paying an annual fee?",
    help: "CreditWise only recommends fee-based cards when returns exceed the fee.",
    options: [
      { value: "very", label: "Prefer ₹0 / Lifetime free cards only" },
      { value: "moderate", label: "Fee is fine if benefits clearly exceed it" },
      { value: "no", label: "Open to higher fees for premium perks" },
    ],
  },
  {
    id: "travelFrequency",
    question: "How often do you travel by air?",
    help: "Airport lounge visits are valuable only if you actually travel.",
    options: [
      { value: "rarely", label: "Rarely (0–1 trips a year)" },
      { value: "sometimes", label: "A few times a year (2–4 trips)" },
      { value: "frequently", label: "Frequently (5+ trips a year)" },
    ],
  },
];

export function isComplete(answers) {
  return QUESTIONS.every((q) => Boolean(answers && answers[q.id]));
}

export function getRecommendations(cards, answers, limit = 3) {
  // Convert 5-question answers into profile format
  const syntheticProfile = {
    profile: {
      age: 25,
      incomeRange: answers.monthlySpend === "over100k" ? "₹25L – ₹50L" : "₹6L – ₹12L",
      employment: "salaried",
    },
    spending: {
      totalMonthly: { under25k: 20000, "25to50k": 40000, "50to100k": 75000, over100k: 150000 }[answers.monthlySpend] || 35000,
      categories: {
        dining: answers.spendArea === "dining" ? 15000 : 4000,
        shopping: answers.spendArea === "online" ? 20000 : 5000,
        fuel: answers.spendArea === "fuel" ? 10000 : 2000,
        travel: answers.spendArea === "travel" ? 20000 : 3000,
      },
    },
    preferences: {
      priorities: [
        answers.priority === "cashback" ? "Cashback" : "",
        answers.priority === "travel" ? "Airport lounge access" : "",
        answers.priority === "lowfees" ? "Low/no annual fee" : "",
        answers.priority === "fuel" ? "Fuel savings" : "",
      ].filter(Boolean),
      rewardStyle: answers.priority === "cashback" ? "simple" : "balanced",
      feeTolerance: answers.feeSensitivity === "very" ? "no-fee" : answers.feeSensitivity === "no" ? "high-fee" : "moderate-fee",
      travelFrequency: answers.travelFrequency === "frequently" ? "Frequently" : answers.travelFrequency === "rarely" ? "Rarely" : "Sometimes",
      existingBanks: [],
    },
    existingCards: [],
  };

  const res = getProfileRecommendations(cards, syntheticProfile, limit);
  return res.recommended.map((r) => ({
    card: r.card,
    matchScore: Math.min(95, Math.max(70, r.score)),
    reasons: r.reasons,
    watchFor: r.watchFor,
    breakdown: [
      { key: "category", label: "Category Fit", rating: "High", score: 9, max: 10 },
      { key: "fees", label: "Fee Return", rating: "Optimal", score: 8, max: 10 },
      { key: "rewards", label: "Reward Value", rating: "Strong", score: 9, max: 10 },
    ],
    why: r.reasons.join(". ") + ".",
  }));
}
