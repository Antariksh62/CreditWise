/**
 * CreditWise — Explainable, Rule-Based Recommendation Engine
 * ============================================================
 * Uses exclusively the 31 VERIFIED credit cards in data/cards.json
 * and the user's personalization profile.
 *
 * CORE PRINCIPLES:
 * 1. NOT A MARKETPLACE: CreditWise helps users find cards that fit their
 *    existing spending. We never push cards for higher fees or affiliate volume.
 * 2. DETERMINISTIC & EXPLAINABLE: No opaque AI or random scores. Every
 *    recommendation provides explicit, plain-language "Why it fits you"
 *    and "What to watch for" based only on verified card terms.
 * 3. NO FAKE PRECISION: Zero fake percentage match numbers ("95% match") or
 *    fake approval confidence scores.
 * 4. ELIGIBILITY FIRST: Validates age, income tiers, and employment before
 *    scoring suitability. Disclaims that the card issuer retains sole approval authority.
 * 5. WALLET SYNERGY: Detects coverage of existing cards to avoid recommending
 *    redundant products when a need is already well-served.
 * 6. HONEST NO-FIT STATE: When no verified card meets standards, returns a
 *    thoughtful empty state explaining the exact mismatch.
 */

import { calculateNetCardValue } from "./rewardCalculator.js";

// ============================================================
// 1. ELIGIBILITY FILTER
// ============================================================

/**
 * Checks verified basic eligibility criteria before considering a card.
 * @param {object} card - Card object from data/cards.json
 * @param {object} profile - User's personalization profile
 * @returns {{ eligible: boolean, note: string }}
 */
export function checkEligibility(card, profile) {
  if (!profile) {
    return {
      eligible: true,
      note: "Eligibility criteria apply — final approval is determined solely by the issuing bank.",
    };
  }

  const ageInput = profile.profile?.age || profile.account?.age;
  const userAge = ageInput === "prefer-not-to-say" ? 25 : Number(ageInput) || 25;
  const incomeRange = profile.profile?.incomeRange || "₹6L – ₹12L";
  const employment = profile.profile?.employment || "salaried";

  // Minimum legal age in India
  if (userAge < 18) {
    return { eligible: false, note: "Minimum applicant age for credit cards in India is 18 years." };
  }

  // Cards requiring age 21+
  const cardRequires21 = card.eligibility && (card.eligibility.includes("21") || card.eligibility.includes("21-"));
  if (userAge < 21 && cardRequires21) {
    return {
      eligible: false,
      note: "Issuing bank policy requires applicants to be at least 21 years of age.",
    };
  }

  // Ultra-premium cards (Infinia, Diners Club Black Metal, Axis Magnus, HDFC BizBlack, HSBC Premier)
  const isUltraPremium = [
    "hdfc-infinia",
    "hdfc-inifinia",
    "axis-magnus",
    "hdfc-diners-club-metal",
    "hdfc-biz-black",
    "hsbc-premier",
  ].includes(card.slug);

  if (isUltraPremium) {
    if (["Under ₹3 Lakhs", "₹3L – ₹6L", "₹6L – ₹12L", "₹12L – ₹25L"].includes(incomeRange) || employment === "student") {
      return {
        eligible: false,
        note: "Card requires an annual income bracket of ₹25 Lakhs+ or by-invitation qualification from the issuer.",
      };
    }
  }

  // Commercial / Business-specific cards (e.g. BizBlack)
  if (card.slug === "hdfc-biz-black") {
    if (employment === "student" || employment === "salaried") {
      return { eligible: false, note: "Requires verified commercial or business registration proof." };
    }
  }

  // Student restrictions: students can only access verified student-accessible cards
  if (employment === "student") {
    const studentAccessible = [
      "amazon-pay-icici",
      "kiwi-yes-bank",
      "bobcard-scapia",
      "idfc-first-power-plus",
    ];
    if (!studentAccessible.includes(card.slug)) {
      return {
        eligible: false,
        note: "Product typically requires verified salaried employment or regular business tax filings.",
      };
    }
  }

  // Cards requiring ₹12L+ annual income
  const requires12LPlus = [
    "bob-eterna",
    "hdfc-regalia-gold",
    "hdfc-marriott-bonvoy",
    "hdfc-tata-neu-infinity",
  ].includes(card.slug);

  if (requires12LPlus && ["Under ₹3 Lakhs", "₹3L – ₹6L", "₹6L – ₹12L"].includes(incomeRange)) {
    return {
      eligible: false,
      note: "Card typically requires an annual income of ₹12 Lakhs or above.",
    };
  }

  // Cards requiring ₹6L+ annual income
  const requires6LPlus = [
    "amex-mrcc",
    "axis-horizon",
    "bob-ethiad",
    "hdfc-diners-club-privilege",
    "hdfc-millennia",
    "hdfc-swiggy-blck",
    "indusind-eazydiner",
    "indusind-tiger",
    "sbi-cashback",
  ].includes(card.slug);

  if (requires6LPlus && ["Under ₹3 Lakhs", "₹3L – ₹6L"].includes(incomeRange)) {
    return {
      eligible: false,
      note: "Card typically requires an annual income of ₹6 Lakhs or above.",
    };
  }

  // Cards requiring ₹3L+ annual income
  const requires3LPlus = [
    "rbl-indianoil-xtra",
    "idfc-first-power-plus",
    "sbi-bpcl-octane",
    "sbi-phonepe-black",
    "hdfc-swiggy-orgne",
    "hdfc-tata-neu-plus",
    "flipkart-axis-bank",
  ].includes(card.slug);

  if (requires3LPlus && incomeRange === "Under ₹3 Lakhs") {
    return {
      eligible: false,
      note: "Card typically requires an annual income of ₹3 Lakhs or above.",
    };
  }

  return {
    eligible: true,
    note: "Meets basic criteria. Final approval and credit limit are determined solely by the issuer.",
  };
}

// ============================================================
// 2. EXISTING WALLET & OVERLAP ANALYSIS
// ============================================================

/**
 * Evaluates the user's existing cards to prevent redundant recommendations.
 * @param {Array<string>} existingCardSlugs - Array of slugs already held by the user
 * @param {Array<object>} allCards - Verified card catalog
 * @returns {object} Wallet coverage summary and overlap warnings
 */
export function analyzeExistingWallet(existingCardSlugs = [], allCards = []) {
  const ownedCards = allCards.filter((c) => existingCardSlugs.includes(c.slug));

  const coverage = {
    onlineShopping: false,
    dining: false,
    fuel: false,
    travelLounge: false,
    forex: false,
    utilities: false,
  };

  const overlaps = [];

  for (const card of ownedCards) {
    // Online Shopping coverage
    if (["amazon-pay-icici", "sbi-cashback", "flipkart-axis-bank"].includes(card.slug)) {
      coverage.onlineShopping = true;
      overlaps.push({
        ownedCard: card,
        category: "Online Retail",
        message: `You already hold ${card.name}, which covers 5% online shopping cashback. We deprioritized duplicate retail cards.`,
      });
    }

    // Dining coverage
    if (["hdfc-swiggy-blck", "hdfc-swiggy-orgne", "swiggy-hdfc", "hsbc-live-plus", "indusind-eazydiner", "eazydiner-indusind"].includes(card.slug)) {
      coverage.dining = true;
      overlaps.push({
        ownedCard: card,
        category: "Dining & Food Delivery",
        message: `You already hold ${card.name}, which offers accelerated dining and food delivery returns.`,
      });
    }

    // Fuel coverage
    if (["sbi-bpcl-octane", "bpcl-sbi-octane", "idfc-first-power-plus", "rbl-indianoil-xtra", "indianoil-axis-bank"].includes(card.slug)) {
      coverage.fuel = true;
      overlaps.push({
        ownedCard: card,
        category: "Fuel & EV",
        message: `You already hold ${card.name}, which covers fuel surcharge waivers and pump rewards.`,
      });
    }

    // Travel & Lounge coverage
    if (card.loungeAccess >= 4 || card.category === "travel") {
      coverage.travelLounge = true;
      overlaps.push({
        ownedCard: card,
        category: "Airport Lounge & Travel",
        message: `You already hold ${card.name}, which provides complimentary airport lounge access.`,
      });
    }

    // Forex coverage
    if (card.forexBenefits && (card.forexBenefits.includes("0%") || card.forexBenefits.includes("Zero") || card.slug.includes("scapia"))) {
      coverage.forex = true;
      overlaps.push({
        ownedCard: card,
        category: "0% Forex Markup",
        message: `You already hold ${card.name}, which provides zero foreign currency markup on international spend.`,
      });
    }
  }

  return {
    ownedCards,
    coverage,
    overlaps,
  };
}

// ============================================================
// 3. SUITABILITY EVALUATION & EXPLANATION GENERATOR
// ============================================================

/**
 * Evaluates how well a verified card fits the user's spending and preferences.
 * Generates transparent "Why it fits you" and "What to watch for" explanations.
 *
 * @param {object} card - Verified card from cards.json
 * @param {object} profile - User's personalization profile
 * @param {object} walletAnalysis - Existing wallet analysis
 * @returns {object} Suitability score and plain-language rationale
 */
export function evaluateFit(card, profile, walletAnalysis = { coverage: {}, overlaps: [] }) {
  const spending = profile.spending?.categories || {};
  const totalMonthly = profile.spending?.totalMonthly || 40000;
  const annualizedSpend = totalMonthly * 12;

  const preferences = profile.preferences || {};
  const priorities = (preferences.priorities || []).map((p) => p.toLowerCase());
  const feeTolerance = preferences.feeTolerance || "moderate-fee";
  const rewardStyle = preferences.rewardStyle || "balanced";
  const travelFreq = preferences.travelFrequency || "Sometimes";
  const intlSpend = preferences.internationalSpend || "Occasionally";
  const existingBanks = preferences.existingBanks || [];

  let score = 0;
  let spendMatches = 0;
  let priorityMatches = 0;
  const whyItFitsYou = [];
  const whatToWatchFor = [];

  // Categorize primary coverage area for the UI
  let coverageArea = "Everyday Spend";

  // Extract category spend amounts
  const dining = spending.dining || 0;
  const groceries = spending.groceries || 0;
  const fuel = spending.fuel || 0;
  const shopping = spending.shopping || 0;
  const travel = spending.travel || 0;
  const utilities = spending.utilities || 0;
  const entertainment = spending.entertainment || 0;
  const subscriptions = spending.subscriptions || 0;

  // ------------------------------------------------------------
  // A. SPENDING CATEGORY ALIGNMENT
  // ------------------------------------------------------------

  // 1. Dining & Food Delivery
  if (dining >= 3000) {
    const isDiningSpecialist =
      card.slug.includes("swiggy") ||
      card.slug.includes("eazydiner") ||
      card.slug.includes("easydiner") ||
      card.slug === "hsbc-live-plus";

    if (isDiningSpecialist) {
      if (!walletAnalysis.coverage.dining) {
        score += 30;
        spendMatches++;
        coverageArea = "Dining & Food Delivery";
        whyItFitsYou.push(
          `You spend ₹${dining.toLocaleString("en-IN")}/month on dining and food delivery.`
        );
      } else {
        score += 5;
      }
    }
  }

  // 2. Supermarket & Groceries
  if (groceries >= 4000) {
    if (card.slug === "hsbc-live-plus") {
      score += 28;
      spendMatches++;
      coverageArea = "Groceries & Supermarket";
      whyItFitsYou.push(
        `You spend ₹${groceries.toLocaleString("en-IN")}/month on groceries (earns 10% accelerated rate).`
      );
    } else if (card.slug === "hdfc-millennia" || card.slug === "hdfc-millenia" || card.slug.includes("tata-neu")) {
      score += 20;
      spendMatches++;
      whyItFitsYou.push(
        `You spend regularly on everyday groceries and quick commerce.`
      );
    }
  }

  // 3. Fuel & Transport
  if (fuel >= 2500) {
    const isFuelSpecialist =
      card.category === "fuel" ||
      card.slug.includes("octane") ||
      card.slug.includes("power-plus") ||
      card.slug.includes("indianoil");

    if (isFuelSpecialist) {
      if (!walletAnalysis.coverage.fuel) {
        score += 28;
        spendMatches++;
        coverageArea = "Fuel & Transport";
        whyItFitsYou.push(
          `You spend ₹${fuel.toLocaleString("en-IN")}/month on fuel, earning surcharge waivers and accelerated points.`
        );
      } else {
        score += 5;
      }
    }
  }

  // 4. Online Shopping & E-Commerce
  if (shopping >= 4000) {
    const isShoppingSpecialist =
      card.slug === "sbi-cashback" ||
      card.slug === "amazon-pay-icici" ||
      card.slug === "flipkart-axis-bank" ||
      card.slug === "hdfc-millennia" ||
      card.slug === "hdfc-millenia";

    if (isShoppingSpecialist) {
      if (!walletAnalysis.coverage.onlineShopping) {
        score += 28;
        spendMatches++;
        coverageArea = "Online Shopping";
        whyItFitsYou.push(
          `You spend ₹${shopping.toLocaleString("en-IN")}/month online, earning top-tier 5% cashback.`
        );
      } else {
        score -= 10;
      }
    }
  }

  // 5. Travel & Flight/Hotel Bookings
  const hasTravelDemand = travel >= 3000 || travelFreq.includes("Frequently") || travelFreq.includes("Sometimes");
  if (hasTravelDemand) {
    const isTravelSpecialist =
      card.category === "travel" ||
      card.slug.includes("horizon") ||
      card.slug.includes("bonvoy") ||
      card.slug.includes("travel-one") ||
      card.slug.includes("scapia");

    if (isTravelSpecialist) {
      score += 25;
      spendMatches++;
      coverageArea = "Travel & Flights";
      whyItFitsYou.push(
        `You travel regularly (${travelFreq.toLowerCase()}) and can benefit from airline/hotel reward transfers.`
      );
    }
  }

  // 6. Utilities & Recurring Bills
  if (utilities >= 2500) {
    if (card.slug.includes("airtel") || card.slug.includes("tata-neu") || card.slug.includes("phonepe") || card.slug.includes("rupay")) {
      score += 18;
      spendMatches++;
      whyItFitsYou.push(
        `You spend ₹${utilities.toLocaleString("en-IN")}/month on utilities and bill payments.`
      );
    }
  }

  // ------------------------------------------------------------
  // B. STATED PRIORITIES
  // ------------------------------------------------------------

  // Priority: Cashback
  if (priorities.includes("cashback") && card.cashbackRate > 0) {
    score += 20;
    priorityMatches++;
    whyItFitsYou.push("You prefer pure cashback credited directly to your statement.");
  }

  // Priority: Airport Lounge Access
  if (priorities.some((p) => p.includes("lounge"))) {
    if (card.loungeAccess > 0) {
      score += 22;
      priorityMatches++;
      const visits = card.loungeAccess === 99 ? "unlimited" : `${card.loungeAccess}/year`;
      whyItFitsYou.push(`You requested lounge access (provides ${visits} complimentary visits).`);
    } else {
      score -= 15;
    }
  }

  // Priority: Low / No Annual Fee
  if (priorities.some((p) => p.includes("low") || p.includes("fee"))) {
    if (card.annualFee === 0) {
      score += 25;
      whyItFitsYou.push("You prefer zero annual fees (Lifetime Free).");
    } else if (card.feeWaiver) {
      score += 10;
      whyItFitsYou.push(`You can waive the annual fee with your normal spend (${card.feeWaiver}).`);
    }
  }

  // Priority: International Spending / Forex
  const hasIntlDemand =
    intlSpend.includes("Occasionally") ||
    intlSpend.includes("Regularly") ||
    priorities.some((p) => p.includes("international"));

  if (hasIntlDemand) {
    const isZeroForex =
      card.forexBenefits &&
      (card.forexBenefits.includes("0%") || card.forexBenefits.includes("Zero") || card.slug.includes("scapia"));

    if (isZeroForex) {
      score += 30;
      coverageArea = "0% Forex";
      whyItFitsYou.push("You make international spends (features 0% foreign currency markup).");
    } else if (card.forexBenefits && card.forexBenefits.includes("2%")) {
      score += 10;
      whyItFitsYou.push("You make international spends (features discounted 2% forex markup).");
    }
  }

  // ------------------------------------------------------------
  // C. ANNUAL FEE SUITABILITY & BREAK-EVEN
  // ------------------------------------------------------------

  if (feeTolerance === "no-fee") {
    if (card.annualFee === 0) {
      score += 30;
      whyItFitsYou.push("Lifetime Free — zero annual renewal fee ever.");
    } else if (card.annualFee <= 1000 && card.feeWaiver) {
      score -= 10;
    } else {
      score -= 40;
    }
  } else if (feeTolerance === "moderate-fee") {
    if (card.annualFee === 0) {
      score += 15;
      whyItFitsYou.push("Lifetime Free — costs nothing to keep in your wallet.");
    } else if (card.annualFee <= 3000) {
      score += 25;
      const totalCost = Math.round(card.annualFee * 1.18);
      whyItFitsYou.push(`You are comfortable with moderate fees (total ₹${totalCost.toLocaleString("en-IN")}/yr incl. 18% GST breaks even on normal spend).`);
    } else {
      score -= 15;
    }
  } else if (feeTolerance === "high-fee") {
    if (card.annualFee >= 3000) {
      score += 25;
      whyItFitsYou.push("You are comfortable with premium renewal fees for elevated travel & concierge perks.");
    }
  }

  // ------------------------------------------------------------
  // D. REWARD STYLE & COMPLEXITY
  // ------------------------------------------------------------

  if (rewardStyle === "simple") {
    if (card.category === "cashback" || card.slug === "amazon-pay-icici" || card.slug === "sbi-cashback") {
      score += 20;
      whyItFitsYou.push("You prefer simple, automated redemption without catalog tracking.");
    } else if (card.category === "travel" || card.slug.includes("amex")) {
      score -= 15;
    }
  } else if (rewardStyle === "optimizer") {
    if (card.category === "travel" || card.slug.includes("amex") || card.slug.includes("horizon") || card.slug.includes("bonvoy")) {
      score += 25;
      whyItFitsYou.push("You are happy to optimize reward points for maximum flight & hotel transfer value.");
    }
  }

  // ------------------------------------------------------------
  // E. WHAT TO WATCH FOR (VERIFIED DRAWBACKS, CAPS, EXCLUSIONS)
  // ------------------------------------------------------------

  if (card.annualFee > 0) {
    const totalAnnualCost = Math.round(card.annualFee * 1.18);
    whatToWatchFor.push(`Annual fee: ₹${totalAnnualCost.toLocaleString("en-IN")}/year (₹${card.annualFee.toLocaleString("en-IN")} + 18% GST)${card.feeWaiver ? ` — waiver condition: ${card.feeWaiver}` : ""}`);
  } else {
    whatToWatchFor.push("Zero annual fee (Lifetime Free).");
  }

  if (card.rewardCaps && !card.rewardCaps.toLowerCase().includes("no maximum cap")) {
    whatToWatchFor.push(`Reward cap: ${card.rewardCaps}`);
  }

  if (card.exclusions && whatToWatchFor.length < 3) {
    whatToWatchFor.push(`Exclusions: ${card.exclusions}`);
  }

  if (card.whatToWatchOutFor && whatToWatchFor.length < 3) {
    if (Array.isArray(card.whatToWatchOutFor)) {
      whatToWatchFor.push(...card.whatToWatchOutFor.slice(0, 3 - whatToWatchFor.length));
    } else {
      whatToWatchFor.push(card.whatToWatchOutFor);
    }
  }

  // Fallback if needed
  if (whatToWatchFor.length === 0) {
    whatToWatchFor.push("Issuer terms and reward conversion rates are subject to bank revisions.");
  }

  // Core Suitability Gate
  const hasFunctionalPriority = priorities.some((p) =>
    ["cashback", "lounge", "fuel", "dining", "travel", "international"].some((fp) => p.includes(fp))
  );

  if (hasFunctionalPriority && priorityMatches === 0 && spendMatches === 0) {
    score = 0;
  }

  // Deduplicate and trim to concise bullets
  const uniqueWhy = Array.from(new Set(whyItFitsYou)).slice(0, 3);
  if (uniqueWhy.length < 2) {
    uniqueWhy.push("Matches your monthly transaction volume without requiring spending changes.");
    if (card.annualFee === 0) {
      uniqueWhy.push("Costs nothing to hold in your portfolio.");
    }
  }

  const uniqueWatch = Array.from(new Set(whatToWatchFor)).slice(0, 3);

  return {
    score,
    coverageArea,
    whyItFitsYou: uniqueWhy,
    whatToWatchFor: uniqueWatch,
    reasons: uniqueWhy,
    watchFor: uniqueWatch.join(" "),
  };
}

// ============================================================
// 4. FULL RECOMMENDATION PIPELINE
// ============================================================

/**
 * Recommends verified credit cards matching the user's profile.
 *
 * @param {Array<object>} cards - All 31 verified cards from cards.json
 * @param {object} profile - User's personalization profile
 * @param {number} limit - Maximum number of top recommendations (default 3)
 * @returns {object} { recommended, existingOverlap, noFitReason, noFitDetails }
 */
export function getProfileRecommendations(cards, profile, limit = 3) {
  if (!cards || cards.length === 0) {
    return {
      recommended: [],
      existingOverlap: [],
      noFitReason: "No card database available.",
      noFitDetails: null,
    };
  }

  const existingCardSlugs = profile?.existingCards || [];

  // 1. Analyze existing wallet & category coverage
  const walletAnalysis = analyzeExistingWallet(existingCardSlugs, cards);

  // 2. Filter out cards the user already holds
  const candidateCards = cards.filter((c) => !existingCardSlugs.includes(c.slug));

  // 3. Filter candidates through eligibility checks
  const eligibleCandidates = [];
  for (const card of candidateCards) {
    const el = checkEligibility(card, profile);
    if (el.eligible) {
      eligibleCandidates.push({ card, elNote: el.note });
    }
  }

  // 4. Score, calculate realistic net value, and evaluate each eligible card
  const spendProfile = profile?.spending?.categories || profile?.monthlySpends || profile?.spending || {};
  const scored = [];
  for (const item of eligibleCandidates) {
    const fit = evaluateFit(item.card, profile, walletAnalysis);
    const valueCalc = calculateNetCardValue(item.card, spendProfile);

    // Suitability threshold: must have meaningful positive alignment
    if (fit.score >= 25) {
      // Augment "Why it fits you" with realistic net value highlights
      const enhancedWhy = [...fit.whyItFitsYou];
      if (valueCalc.estimatedNetAnnualValue > 0) {
        if (valueCalc.feeWaived && valueCalc.annualFee > 0) {
          enhancedWhy.unshift(
            `Estimated net value back: ~₹${valueCalc.estimatedNetAnnualValue.toLocaleString("en-IN")}/yr (Annual fee of ₹${valueCalc.annualFee.toLocaleString("en-IN")} + 18% GST waived based on your spend).`
          );
        } else if (valueCalc.annualFee === 0) {
          enhancedWhy.unshift(
            `Estimated net value back: ~₹${valueCalc.estimatedNetAnnualValue.toLocaleString("en-IN")}/yr with zero annual fees.`
          );
        } else {
          enhancedWhy.unshift(
            `Estimated net value back: ~₹${valueCalc.estimatedNetAnnualValue.toLocaleString("en-IN")}/yr after deducting the total fee of ₹${valueCalc.applicableFee.toLocaleString("en-IN")} (₹${valueCalc.annualFee.toLocaleString("en-IN")} + 18% GST).`
          );
        }
      }

      scored.push({
        card: item.card,
        score: fit.score,
        netValue: valueCalc.estimatedNetAnnualValue,
        grossRewards: valueCalc.annualGrossRewards,
        applicableFee: valueCalc.applicableFee,
        annualFee: valueCalc.annualFee,
        feeWaived: valueCalc.feeWaived,
        waiverStatusText: valueCalc.waiverStatusText,
        valueBreakdown: valueCalc,
        coverageArea: fit.coverageArea,
        whyItFitsYou: enhancedWhy.slice(0, 4),
        whatToWatchFor: fit.whatToWatchFor,
        // Backward-compatibility fields
        reasons: enhancedWhy.slice(0, 4),
        watchFor: fit.whatToWatchFor.join(" "),
        eligibilityNote: item.elNote,
      });
    }
  }

  // 5. Rank primarily by realistic net value return, breaking ties by suitability score
  scored.sort((a, b) => {
    // If net values differ meaningfully (> ₹500), the higher net earner wins
    const valDiff = b.netValue - a.netValue;
    if (Math.abs(valDiff) > 500) return valDiff;
    if (b.score !== a.score) return b.score - a.score;
    return a.card.annualFee - b.card.annualFee;
  });

  // 6. Ensure recommendation diversity (avoid recommending 3 nearly identical cards)
  const diversified = [];
  const coveredAreas = new Set();

  for (const match of scored) {
    if (diversified.length === 0) {
      diversified.push(match);
      coveredAreas.add(match.coverageArea);
    } else if (diversified.length < limit) {
      // Prioritize complementary coverage if possible
      if (!coveredAreas.has(match.coverageArea) || scored.length <= limit) {
        diversified.push(match);
        coveredAreas.add(match.coverageArea);
      }
    }
  }

  // If diversification was too strict, backfill with top scored
  for (const match of scored) {
    if (diversified.length < limit && !diversified.some((d) => d.card.slug === match.card.slug)) {
      diversified.push(match);
    }
  }

  // 7. Assign qualitative fit tiers using preferred editorial language
  // Preferred phrasing: "Fits your spending", "Strong fit for your priorities", "Worth considering", "May suit your spending"
  const tiered = diversified.map((match, idx) => {
    let fitTier = "Fits your spending";
    let fitSummary = "Primary card matching where the largest portion of your recurring expenses flow.";

    if (idx === 1) {
      fitTier = "Strong fit for your priorities";
      fitSummary = `Specialized option tailored to your ${match.coverageArea ? match.coverageArea.toLowerCase() : "key"} expenses.`;
    } else if (idx === 2) {
      fitTier = "Worth considering";
      fitSummary = "Provides balanced rewards that round out your everyday wallet.";
    }

    return {
      ...match,
      fitTier,
      fitSummary,
    };
  });

  // Generate meaningful differences if multiple cards are recommended
  const meaningfulDifferences = [];
  if (tiered.length > 1) {
    for (const item of tiered) {
      const { card, coverageArea } = item;
      let focusText = "";
      if (card.goodFor) {
        focusText = card.goodFor;
      } else if (coverageArea) {
        focusText = `Tailored for ${coverageArea}`;
      } else {
        focusText = card.shortDescription || card.description;
      }

      const totalCost = Math.round(card.annualFee * 1.18);
      let feeNote = card.annualFee === 0 ? "Lifetime Free" : `₹${totalCost.toLocaleString("en-IN")}/yr (₹${card.annualFee.toLocaleString("en-IN")} + 18% GST)`;
      if (card.feeWaiver && card.annualFee > 0) {
        feeNote += ` (${card.feeWaiver.replace(/with no minimum spend conditions\./i, "").trim()})`;
      }

      meaningfulDifferences.push({
        cardSlug: card.slug,
        cardName: card.name,
        fitTier: item.fitTier,
        focus: focusText,
        feeNote,
        rewardModel: card.category === "cashback" ? "Direct Cashback" : card.category === "travel" ? "Travel Points / Air Miles" : "Reward Points",
      });
    }
  }

  // 8. Thoughtful NO-FIT STATE
  if (tiered.length === 0) {
    let noFitTitle = "No verified card clearly fits your profile right now";
    let explanation = "Based on our strict curation standards, none of the cards in our verified database provide a compelling, net-positive return on your current profile.";
    const conflictReasons = [];
    let suggestion = "Consider sticking to your existing payment methods or adjusting your fee/reward preferences.";

    const feeTolerance = profile?.preferences?.feeTolerance;
    const priorities = profile?.preferences?.priorities || [];
    const employment = profile?.profile?.employment;
    const incomeRange = profile?.profile?.incomeRange;

    if (feeTolerance === "no-fee" && priorities.some((p) => p.toLowerCase().includes("lounge"))) {
      conflictReasons.push("You requested zero annual fee alongside complimentary airport lounge access. In the current Indian market, lounge-access cards increasingly require annual fees or quarterly spend conditions.");
      suggestion = "Allowing a moderate annual fee (₹500–₹1,500) opens up cards with verified lounge access that break even on modest spending.";
    }

    if (employment === "student" && feeTolerance === "high-fee") {
      conflictReasons.push("Premium cards require verified salaried or business income tax returns that are unavailable under student status.");
      suggestion = "Consider lifetime-free, accessible cards such as Amazon Pay ICICI or Kiwi YES Bank.";
    }

    if (walletAnalysis.ownedCards.length >= 3) {
      conflictReasons.push("Your registered cards already cover online retail, dining, and fuel effectively. Adding another card would introduce complexity without meaningful incremental rewards.");
      suggestion = "Your current wallet is already well-optimized for your spending levels.";
    }

    if (incomeRange === "Under ₹3 Lakhs" && priorities.some((p) => p.toLowerCase().includes("travel"))) {
      conflictReasons.push("Most travel-focused and air miles cards have minimum annual income thresholds of ₹6 Lakhs or above.");
      suggestion = "Consider starting with an entry-level cashback card to build credit history before upgrading.";
    }

    if (conflictReasons.length > 0) {
      explanation = conflictReasons.join(" ");
    }

    return {
      recommended: [],
      existingOverlap: walletAnalysis.overlaps,
      noFitReason: explanation,
      noFitDetails: {
        title: noFitTitle,
        explanation,
        conflictReasons,
        suggestion,
      },
    };
  }

  return {
    recommended: tiered,
    meaningfulDifferences,
    existingOverlap: walletAnalysis.overlaps,
    noFitReason: null,
    noFitDetails: null,
  };
}

// ============================================================
// 5. LEGACY COMPATIBILITY HELPER
// ============================================================

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
  return Boolean(answers && typeof answers === "object" && QUESTIONS.every((q) => Boolean(answers[q.id])));
}

export function getRecommendations(cards, answers, limit = 3) {
  if (!answers || !isComplete(answers)) {
    const emptyResult = {
      recommended: [],
      meaningfulDifferences: [],
      existingOverlap: [],
      noFitReason: null,
      noFitDetails: null,
    };
    return Object.assign([], emptyResult);
  }

  const syntheticProfile = {
    profile: {
      age: 25,
      incomeRange: answers.monthlySpend === "over100k" ? "₹25L – ₹50L" : answers.monthlySpend === "50to100k" ? "₹12L – ₹25L" : "₹6L – ₹12L",
      employment: "salaried",
    },
    spending: {
      totalMonthly: { under25k: 20000, "25to50k": 40000, "50to100k": 75000, over100k: 150000 }[answers.monthlySpend] || 35000,
      categories: {
        dining: answers.spendArea === "dining" ? 15000 : 4000,
        shopping: answers.spendArea === "online" ? 20000 : 5000,
        fuel: answers.spendArea === "fuel" ? 10000 : 2000,
        travel: answers.spendArea === "travel" ? 20000 : 3000,
        groceries: answers.spendArea === "online" ? 8000 : 6000,
        utilities: 3000,
      },
    },
    preferences: {
      priorities: [
        answers.priority === "cashback" ? "Cashback" : "",
        answers.priority === "travel" ? "Airport lounge access" : "",
        answers.priority === "rewards" ? "Shopping" : "",
        answers.priority === "lowfees" ? "Low/no annual fee" : "",
        answers.priority === "fuel" ? "Fuel savings" : "",
        answers.spendArea === "dining" ? "Dining" : "",
      ].filter(Boolean),
      rewardStyle: answers.priority === "cashback" ? "simple" : answers.priority === "travel" ? "optimizer" : "balanced",
      feeTolerance: answers.feeSensitivity === "very" ? "no-fee" : answers.feeSensitivity === "no" ? "high-fee" : "moderate-fee",
      travelFrequency: answers.travelFrequency === "frequently" ? "Frequently" : answers.travelFrequency === "rarely" ? "Rarely" : "Sometimes",
      existingBanks: [],
    },
    existingCards: [],
  };

  const res = getProfileRecommendations(cards, syntheticProfile, limit);
  const enriched = res.recommended.map((r) => ({
    ...(r.card || {}),
    ...r,
    reasons: r.whyItFitsYou,
    watchFor: Array.isArray(r.whatToWatchFor) ? r.whatToWatchFor.join(" ") : r.whatToWatchFor,
    why: Array.isArray(r.whyItFitsYou) ? r.whyItFitsYou.join(". ") + "." : "",
  }));

  const fullResult = {
    recommended: enriched,
    meaningfulDifferences: res.meaningfulDifferences || [],
    existingOverlap: res.existingOverlap || [],
    noFitReason: res.noFitReason,
    noFitDetails: res.noFitDetails,
    syntheticProfile,
  };

  return Object.assign(enriched, fullResult);
}
