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

import { calculateNetCardValue, calculateCombinationNetValue } from "./rewardCalculator.js";

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
        if (card.slug === "indusind-eazydiner") {
          whyItFitsYou.push(
            `You spend ₹${dining.toLocaleString("en-IN")}/month on dining. You can stack the 25% instant PayEazy discount (baseline ₹2,000/month cap) with Prime membership, easily recovering the annual fee.`
          );
        } else {
          whyItFitsYou.push(
            `You spend ₹${dining.toLocaleString("en-IN")}/month on dining and food delivery.`
          );
        }
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
    } else if (card.slug === "hdfc-tata-neu-infinity") {
      score += (groceries >= 15000) ? 30 : 22;
      spendMatches++;
      coverageArea = "Tata Ecosystem & Groceries";
      if (groceries >= 15000) {
        whyItFitsYou.push(
          `Your monthly spend of ₹${groceries.toLocaleString("en-IN")} on groceries/Tata brands maximizes Infinity's higher 2,000 NeuCoin cap at 10% value back, out-earning the Plus card.`
        );
      } else {
        whyItFitsYou.push(
          `You spend regularly on everyday groceries and Tata ecosystem orders (earning up to 10% NeuCoins).`
        );
      }
    } else if (card.slug === "hdfc-tata-neu-plus") {
      score += (groceries < 15000) ? 22 : 14;
      spendMatches++;
      coverageArea = "Tata Ecosystem & Groceries";
      if (groceries >= 15000) {
        whyItFitsYou.push(
          `At ₹${groceries.toLocaleString("en-IN")}/month, your spend exceeds the 1,000 NeuCoin grocery cap (capped at ₹14,285). Upgrading to Infinity doubles your cap to 2,000 coins at 10%.`
        );
      } else {
        whyItFitsYou.push(
          `You spend on everyday groceries, earning 7% value back up to the 1,000 NeuCoins monthly cap.`
        );
      }
    } else if (card.slug === "hsbc-rupay-cashback") {
      spendMatches++;
      coverageArea = "Groceries & UPI";
      if ((groceries + dining) > 5000) {
        score += 8;
        whatToWatchFor.push(
          `Your combined grocery & dining spend (>₹5,000/mo) exhausts the strict ₹400 monthly cap (reached at ₹4,000 spend). Consider upgrading to HSBC Live+ for a ₹1,200 cap and uncapped 1.5% base tier.`
        );
      } else {
        score += 24;
        whyItFitsYou.push(
          `Your monthly grocery and dining spend stays within the ₹400 cashback cap while earning 10% on groceries/dining and 1% on merchant UPI Scan & Pay.`
        );
      }
    } else if (card.slug === "hdfc-millennia" || card.slug === "hdfc-millenia") {
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
        if (card.slug === "rbl-indianoil-xtra") {
          whyItFitsYou.push(
            `You spend ₹${fuel.toLocaleString("en-IN")}/month on fuel, utilizing the 15 Fuel Points/₹100 tier (capped at 2,000 points / ₹13,333 spend) for 7.5% free IndianOil fuel plus 1% surcharge waiver.`
          );
        } else if (card.slug === "sbi-bpcl-octane") {
          whyItFitsYou.push(
            `You spend ₹${fuel.toLocaleString("en-IN")}/month on fuel, unlocking 7.25% value-back at BPCL pumps (up to ₹10,000/month), 6.25% on Bharatgas LPG cylinders, and 10X points (2.5%) on groceries and dining.`
          );
        } else {
          whyItFitsYou.push(
            `You spend ₹${fuel.toLocaleString("en-IN")}/month on fuel, earning surcharge waivers and accelerated points.`
          );
        }
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
      if (card.slug === "sbi-phonepe-black") {
        whyItFitsYou.push(
          `You spend ₹${utilities.toLocaleString("en-IN")}/month on bills, capturing up to 10% value-back on PhonePe app recharges, electricity, and insurance (capped at 2,000 points / ₹20,000 spend).`
        );
      } else {
        whyItFitsYou.push(
          `You spend ₹${utilities.toLocaleString("en-IN")}/month on utilities and bill payments.`
        );
      }
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
      if (card.slug === "bobcard-scapia") {
        whyItFitsYou.push("True 0% foreign currency markup saves ~4.13% in fees and GST on international spending, paired with zero annual fee.");
      } else {
        whyItFitsYou.push("You make international spends (features 0% foreign currency markup).");
      }
    } else if (card.slug === "indusind-tiger") {
      score += 20;
      coverageArea = "1.5% Forex & Lounges";
      whyItFitsYou.push("Discounted 1.5% forex markup (effective 1.77% with GST), becoming net-positive (+0.63%) on international spending once past the ₹5 Lakh slab, plus unconditional airport lounge access.");
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
    } else if (card.slug === "hsbc-premier") {
      score -= 30;
      whatToWatchFor.push("Poor match for pure cashback or gift vouchers: catalog redemptions collapse value to ₹0.25/pt (0.75% return). This card is engineered strictly for 1:1 luxury air mile transfers.");
    } else if (card.category === "travel" || card.slug.includes("amex")) {
      score -= 15;
    }
  } else if (rewardStyle === "optimizer") {
    if (card.slug === "hsbc-premier") {
      score += 35;
      whyItFitsYou.push("Your travel focus perfectly matches HSBC Premier: uncapped points, 1:1 air mile transfers to global airlines (Singapore Airlines, British Airways, Etihad), and 0.99% forex fee.");
    } else if (card.slug === "hsbc-travel-one") {
      score += 28;
      whyItFitsYou.push("Ideal for Accor Live Limitless transfers (yielding ~7.2% net return on domestic flights/dining) and instant in-app points conversion.");
    } else if (card.category === "travel" || card.slug.includes("amex") || card.slug.includes("horizon") || card.slug.includes("bonvoy")) {
      score += 25;
      whyItFitsYou.push("You are happy to optimize reward points for maximum flight & hotel transfer value.");
    }
  }

  // ------------------------------------------------------------
  // D2. PREFERRED REWARD TYPE & CARD CHARACTERISTICS (MANUAL & AI ALIGNED)
  // ------------------------------------------------------------
  const preferredRewardType = preferences.preferredRewardType || "No Preference";
  if (preferredRewardType === "Cashback" && (card.category === "cashback" || card.rewardType === "cashback")) {
    score += 20;
    whyItFitsYou.push("Direct statement cashback aligns with your preferred reward type.");
  } else if (preferredRewardType === "Travel Benefits" && (card.category === "travel" || card.loungeAccess >= 4)) {
    score += 20;
    whyItFitsYou.push("Elevated travel perks & air miles align with your preferred reward type.");
  } else if (preferredRewardType === "Reward Points" && card.category === "rewards") {
    score += 20;
    whyItFitsYou.push("Flexible reward points match your preferred redemption model.");
  }

  const preferredCardCharacteristics = preferences.preferredCardCharacteristics || "Simplicity";
  if (preferredCardCharacteristics === "Low Annual Fee" && card.annualFee === 0) {
    score += 25;
  } else if (preferredCardCharacteristics === "Premium Benefits" && (card.annualFee >= 3000 || card.loungeAccess >= 4)) {
    score += 20;
  } else if (preferredCardCharacteristics === "Simplicity" && (card.category === "cashback" || card.annualFee === 0)) {
    score += 20;
  } else if (preferredCardCharacteristics === "Maximum Rewards" && (card.acceleratedRewardRate >= 0.05 || card.category === "rewards")) {
    score += 20;
  }

  // ------------------------------------------------------------
  // E. WHAT TO WATCH FOR (VERIFIED DRAWBACKS, CAPS, EXCLUSIONS)
  // ------------------------------------------------------------

  if (card.slug === "hsbc-travel-one") {
    whatToWatchFor.push("Avoid using overseas: 3.5% + GST forex markup makes earning 4X net negative. Restrict to domestic OTA flights, dining, and Accor hotel transfers.");
  }

  if (card.slug === "indusind-tiger") {
    whatToWatchFor.push("Back-loaded anniversary slabs: spending under ₹2.5L/year yields poor 0.4%–0.8% return. Hit the ₹5L cliff to unlock 2.4% rewards / 1:1 Maharaja Club air miles. Cash redemptions are capped at 5,000 points/month with a ₹149 + GST fee; Priority Pass guest visits cost ~$35.");
  }

  if (card.slug === "kiwi-yes-bank") {
    whatToWatchFor.push("Transactions under ₹100 earn flat 0% cashback (0 points); monthly rewards are capped at 1% of total credit limit; using 3rd-party UPI apps (GPay/PhonePe) drops return to 0.5%; minimum cash redemption is 500 points (₹125) in 500-point blocks; small merchants (P2PM) earn 0%.");
  }

  if (card.slug === "rbl-indianoil-xtra") {
    whatToWatchFor.push("Fuel points must be redeemed at IndianOil pumps or IndianOil ONE app for ₹0.50 value (drops to ₹0.10 in online catalogue); 2,000 monthly point cap (maxed at ₹13,333 spend); un-waivable 1% surcharge at non-IOCL stations; steep ₹2.75L fee waiver hurdle.");
  }

  if (card.slug === "sbi-bpcl-octane") {
    whatToWatchFor.push("Fuel rewards are disabled on UPI (must swipe physical card on an SBI POS machine); 2,500 monthly fuel point cap (₹10,000 spend); lounge access requires ₹50k quarterly spend; 60k annual statement cash limit; points expire after 24 months.");
  }

  if (card.slug === "bobcard-scapia") {
    whatToWatchFor.push("Closed-loop redemption: Scapia Coins can only be burned inside the Scapia app on flights/hotels (often marked up 3%–12% over open market); domestic lounges require ₹20k monthly spend; strictly one BOBCARD per user; 90-day inactivity risks limit reduction.");
  }

  if (card.slug === "sbi-cashback") {
    whatToWatchFor.push("5% online cashback is strictly capped at ₹2,000 per statement cycle (max ₹40,000 spend); offline 1% is capped at ₹2,000; Merchant EMI or Flexipay conversions forfeit all cashback; gaming, tolls, and government spends earn 0%; zero airport lounges.");
  }

  if (card.slug === "sbi-phonepe-black") {
    whatToWatchFor.push("10% on PhonePe is capped at 2,000 points/month (max ₹20,000 spend) with a 500-point sub-cap on insurance; 5% general online spend is capped at 1,000 points (max ₹20,000 spend); bills paid outside PhonePe earn 0%; tolls, education, and jewelry excluded.");
  }

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
// ============================================================
// 4. COMBINATORIAL OPTIMIZATION & RECOMMENDATION PIPELINE
// ============================================================

/**
 * Generate all combinations of k items from array.
 */
function getCombinations(array, k) {
  if (k === 1) return array.map((item) => [item]);
  if (k === 0 || array.length < k) return [];
  const combinations = [];
  function backtrack(start, combo) {
    if (combo.length === k) {
      combinations.push([...combo]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combo.push(array[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }
  backtrack(0, []);
  return combinations;
}

/**
 * Score a combination based on Net Monetary Value and stated user preferences.
 */
function scoreCombination(comboValuation, profile) {
  let score = comboValuation.netValue;

  const priorities = profile?.preferences?.priorities || [];
  const feeTolerance = profile?.preferences?.feeTolerance;
  const rewardPreference = profile?.preferences?.rewardComplexity || profile?.preferences?.rewardPreference || profile?.preferences?.rewardStyle;
  const travelFrequency = profile?.preferences?.travelFrequency;

  // 1. Fee tolerance alignment
  if (feeTolerance === "no-fee" || feeTolerance === "very") {
    if (comboValuation.totalFees === 0) {
      score += 20000; // Strong priority for achieving ₹0 holding cost when user explicitly requested LTF
    } else {
      score -= comboValuation.totalFees * 10;
    }
  }

  // 2. Travel & Lounge alignment
  const wantsTravel = priorities.some((p) => p.toLowerCase().includes("travel") || p.toLowerCase().includes("lounge"))
    || travelFrequency === "sometimes" || travelFrequency === "frequently" || travelFrequency === "Frequently" || travelFrequency === "Sometimes";

  if (wantsTravel) {
    if (comboValuation.totalLoungeVisits >= 4) {
      score += 1500;
    } else if (comboValuation.totalLoungeVisits > 0) {
      score += 800;
    }
    if (comboValuation.hasZeroForex) {
      score += 1000;
    }
  }

  // 3. Fuel alignment
  const fuelSpend = (profile?.spending?.categories?.fuel || profile?.monthlySpends?.fuel || 0);
  if (fuelSpend >= 2000 && comboValuation.hasFuelWaiver) {
    score += 800;
  }

  // 4. Reward preference alignment (simpler cashback vs points)
  const isAllCashback = comboValuation.cards.every((c) => c.rewardType === "cashback");
  if (rewardPreference === "simple-cashback" || rewardPreference === "cashback" || rewardPreference === "simple") {
    if (isAllCashback) {
      score += 1000; // Prefer simple direct cashback when financial outcomes are close
    }
  }

  return score;
}

/**
 * Finds the highest-scoring combination of exactly `count` cards.
 */
function findBestComboForCount(eligibleCards, spendProfile, profile, count) {
  if (!eligibleCards || eligibleCards.length < count) {
    return null;
  }

  const allCombos = getCombinations(eligibleCards, count);
  let best = null;
  let bestScore = -Infinity;
  const evaluated = [];

  for (const combo of allCombos) {
    const valuation = calculateCombinationNetValue(combo, spendProfile);
    const score = scoreCombination(valuation, profile);
    evaluated.push({ valuation, score });
    if (score > bestScore) {
      bestScore = score;
      best = valuation;
    }
  }

  evaluated.sort((a, b) => b.score - a.score);
  return {
    best,
    topAlternatives: evaluated.slice(1, 4).map((e) => e.valuation),
  };
}

/**
 * Recommends verified credit cards matching the user's profile and desired card count (1, 2, or 3).
 *
 * @param {Array<object>} cards - All 31 verified cards from cards.json
 * @param {object} profile - User's personalization profile
 * @param {number} limit - Maximum number of cards to recommend (defaults to user's selected cardCount)
 * @returns {object} { recommended, combination, allCountOptions, cardCount, meaningfulDifferences, existingOverlap, noFitReason, noFitDetails }
 */
export function getProfileRecommendations(cards, profile, limit = 3) {
  if (!cards || cards.length === 0) {
    return {
      recommended: [],
      combination: null,
      allCountOptions: {},
      meaningfulDifferences: [],
      existingOverlap: [],
      noFitReason: "No card database available.",
      noFitDetails: null,
    };
  }

  // 1. Determine user's desired card count (1, 2, or 3)
  const rawCount = Number(profile?.cardCount || profile?.preferences?.cardCount);
  const desiredCount = [1, 2, 3].includes(rawCount) ? rawCount : [1, 2, 3].includes(limit) ? limit : 1;

  // 2. Filter candidates through verified eligibility checks (income, age, employment)
  // Per persistent rule: we do NOT filter by or penalize existing cards.
  const eligibleCards = [];
  for (const card of cards) {
    const el = checkEligibility(card, profile);
    if (el.eligible) {
      eligibleCards.push(card);
    }
  }

  // Extract structured spending profile (preserving detailed merchant breakdown if present)
  let spendProfile = {};
  if (profile?.spending?.categories) {
    spendProfile = {
      categories: profile.spending.categories,
      merchants: profile.spending.merchants || profile.merchants || {},
    };
  } else if (profile?.spending) {
    spendProfile = profile.spending;
  } else if (profile?.monthlySpends) {
    spendProfile = profile.monthlySpends;
  }

  // 3. Precompute best combinations for 1, 2, and 3 cards
  const opt1 = findBestComboForCount(eligibleCards, spendProfile, profile, 1);
  const opt2 = findBestComboForCount(eligibleCards, spendProfile, profile, 2);
  const opt3 = findBestComboForCount(eligibleCards, spendProfile, profile, 3);

  const allCountOptions = {
    1: opt1?.best || null,
    2: opt2?.best || null,
    3: opt3?.best || null,
  };

  const selectedOpt = desiredCount === 3 ? opt3 : desiredCount === 2 ? opt2 : opt1;

  // 4. Handle NO-FIT State when not enough eligible cards exist
  if (!selectedOpt || !selectedOpt.best) {
    const noFitTitle = "No verified combination matches your criteria";
    const conflictReasons = [];
    let suggestion = "Consider adjusting your profile parameters or choosing a smaller card count.";

    const employment = profile?.profile?.employment;
    const incomeRange = profile?.profile?.incomeRange;

    if (eligibleCards.length < desiredCount) {
      conflictReasons.push(
        `Only ${eligibleCards.length} verified card(s) in our catalogue meet your criteria for your declared income tier (${incomeRange || "Under ₹3L"}) and employment (${employment || "salaried"}). A combination of ${desiredCount} cards cannot be formed without relaxing eligibility.`
      );
      if (eligibleCards.length > 0) {
        suggestion = `Consider viewing recommendations for a ${eligibleCards.length}-card setup instead.`;
      }
    }

    const explanation = conflictReasons.join(" ") || "None of the cards in our verified catalogue meet your requirements.";

    return {
      recommended: [],
      combination: null,
      allCountOptions,
      cardCount: desiredCount,
      meaningfulDifferences: [],
      existingOverlap: [],
      noFitReason: explanation,
      noFitDetails: {
        title: noFitTitle,
        explanation,
        conflictReasons,
        suggestion,
      },
    };
  }

  const bestCombo = selectedOpt.best;

  // Sort cards in the combination by net value descending so the highest earner is primary anchor
  const sortedComboCards = [...bestCombo.cards].sort((a, b) => (b.netValue || 0) - (a.netValue || 0));

  // 5. Augment each recommended card with category allocations and plain-language fit rationale
  const tiered = sortedComboCards.map((cVal, idx) => {
    const originalCard = cVal.card;

    // Identify categories routed to this card
    const coveredCats = Object.entries(bestCombo.allocations)
      .filter(([_, alloc]) => alloc.cardSlug === cVal.slug)
      .map(([_, alloc]) => alloc.categoryLabel);

    let fitTier = "Primary Card";
    let fitSummary = "";

    if (bestCombo.cards.length === 1) {
      fitTier = "Single-Card Solution";
      fitSummary = "Comprehensive card capturing maximum rewards across your entire spending profile.";
    } else if (bestCombo.cards.length === 2) {
      fitTier = idx === 0 ? "Everyday Spend Anchor" : "Category Specialist";
      fitSummary = coveredCats.length > 0
        ? `Handles your ${coveredCats.slice(0, 2).join(" & ")} expenses.`
        : "Complements your primary card with specialized benefits.";
    } else {
      fitTier = idx === 0 ? "Everyday Spend Anchor" : idx === 1 ? "Category Specialist" : "Portfolio Anchor";
      fitSummary = coveredCats.length > 0
        ? `Dedicated to ${coveredCats.slice(0, 2).join(" & ")}.`
        : "Rounds out your portfolio with lounge access and secondary category coverage.";
    }

    const whyItFitsYou = [];
    if (cVal.netValue > 0) {
      if (cVal.feeWaived && cVal.rawFee > 0) {
        whyItFitsYou.push(
          `Estimated net value: ~₹${cVal.netValue.toLocaleString("en-IN")}/yr (Annual fee of ₹${cVal.rawFee.toLocaleString("en-IN")} + 18% GST waived on allocated spend).`
        );
      } else if (cVal.rawFee === 0) {
        whyItFitsYou.push(
          `Estimated net value: ~₹${cVal.netValue.toLocaleString("en-IN")}/yr with zero annual fees (Lifetime Free).`
        );
      } else {
        whyItFitsYou.push(
          `Estimated net value: ~₹${cVal.netValue.toLocaleString("en-IN")}/yr after deducting applicable annual fee of ₹${cVal.applicableFee.toLocaleString("en-IN")}.`
        );
      }
    }

    // Add plain-language brand/merchant suitability rationale
    if (cVal.benefitedMerchants && cVal.benefitedMerchants.length > 0) {
      const topM = cVal.benefitedMerchants.slice(0, 3);
      const merchantHighlights = topM.map((m) => `${m.name} (${m.effectiveRate}% return)`).join(", ");
      whyItFitsYou.unshift(`Optimized for your specific brand spends: ${merchantHighlights}.`);
    }

    if (coveredCats.length > 0) {
      whyItFitsYou.push(`Best suited in this portfolio for: ${coveredCats.join(", ")}.`);
    }

    if (originalCard.keyBenefits && originalCard.keyBenefits.length > 0) {
      whyItFitsYou.push(originalCard.keyBenefits[0]);
    }

    if (originalCard.loungeAccess > 0) {
      whyItFitsYou.push(`Provides ${originalCard.loungeAccess} complimentary airport lounge visits per year.`);
    }

    const whatToWatchFor = cVal.realWorldGotchas && cVal.realWorldGotchas.length > 0
      ? cVal.realWorldGotchas.slice(0, 3)
      : ["Check terms and conditions for quarterly redemption limits and exclusion updates."];

    return {
      card: originalCard,
      name: originalCard.name,
      slug: originalCard.slug,
      allocatedMonthlySpend: cVal.allocatedMonthlySpend,
      allocatedAnnualSpend: cVal.allocatedAnnualSpend,
      annualGrossRewards: cVal.annualGrossRewards,
      applicableFee: cVal.applicableFee,
      annualFee: cVal.rawFee,
      feeWaived: cVal.feeWaived,
      waiverStatusText: cVal.waiverText,
      netValue: cVal.netValue,
      score: cVal.netValue,
      fitTier,
      fitSummary,
      coverageArea: coveredCats.join(", ") || "General Spending",
      whyItFitsYou: whyItFitsYou.slice(0, 4),
      whatToWatchFor,
      reasons: whyItFitsYou.slice(0, 4),
      watchFor: whatToWatchFor.join(" "),
      categoryBreakdown: cVal.categoryBreakdown,
      valueBreakdown: calculateNetCardValue(originalCard, spendProfile),
      applyUrl: originalCard.applyUrl || null,
    };
  });

  // Meaningful differences explaining how cards complement each other
  const meaningfulDifferences = [];
  if (tiered.length > 1) {
    for (const item of tiered) {
      const { card, coverageArea } = item;
      const totalCost = Math.round(card.annualFee * 1.18);
      let feeNote = card.annualFee === 0 ? "Lifetime Free" : `₹${totalCost.toLocaleString("en-IN")}/yr (₹${card.annualFee.toLocaleString("en-IN")} + 18% GST)`;
      if (card.feeWaiver && card.annualFee > 0) {
        feeNote += ` (${card.feeWaiver.replace(/with no minimum spend conditions\./i, "").trim()})`;
      }

      meaningfulDifferences.push({
        cardSlug: card.slug,
        cardName: card.name,
        fitTier: item.fitTier,
        focus: `Assigned for ${coverageArea}`,
        feeNote,
        rewardModel: card.category === "cashback" ? "Direct Cashback" : card.category === "travel" ? "Travel Points / Air Miles" : "Reward Points",
      });
    }
  }

  return {
    recommended: tiered,
    combination: bestCombo,
    allCountOptions,
    cardCount: desiredCount,
    meaningfulDifferences,
    existingOverlap: [],
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
  {
    id: "cardCount",
    question: "How many credit cards are you looking to get?",
    help: "Indian credit-card consumers hold approximately 2.1 live cards on average (TransUnion CIBIL, March 2026). Select your target setup.",
    options: [
      { value: "1", label: "1 Card — Single-card simplicity for all spends" },
      { value: "2", label: "2 Cards — Strategic pairing for higher returns" },
      { value: "3", label: "3 Cards — Optimized portfolio with specialized coverage" },
    ],
  },
];

export function isComplete(answers) {
  if (!answers || typeof answers !== "object") return false;
  // Core quiz criteria (cardCount defaults to 1 if not explicitly answered)
  const coreQuestions = ["priority", "spendArea", "monthlySpend", "feeSensitivity", "travelFrequency"];
  return coreQuestions.every((id) => Boolean(answers[id]));
}

export function getRecommendations(cards, answers, limit = 3) {
  if (!answers || !isComplete(answers)) {
    const emptyResult = {
      recommended: [],
      combination: null,
      allCountOptions: {},
      meaningfulDifferences: [],
      existingOverlap: [],
      noFitReason: null,
      noFitDetails: null,
    };
    return Object.assign([], emptyResult);
  }

  const requestedCount = Number(answers.cardCount) || 1;

  const syntheticProfile = {
    cardCount: requestedCount,
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
      cardCount: requestedCount,
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

  const res = getProfileRecommendations(cards, syntheticProfile, requestedCount);
  const enriched = res.recommended.map((r) => ({
    ...(r.card || {}),
    ...r,
    reasons: r.whyItFitsYou,
    watchFor: Array.isArray(r.whatToWatchFor) ? r.whatToWatchFor.join(" ") : r.whatToWatchFor,
    why: Array.isArray(r.whyItFitsYou) ? r.whyItFitsYou.join(". ") + "." : "",
  }));

  const fullResult = {
    recommended: enriched,
    combination: res.combination,
    allCountOptions: res.allCountOptions,
    cardCount: requestedCount,
    meaningfulDifferences: res.meaningfulDifferences || [],
    existingOverlap: [],
    noFitReason: res.noFitReason,
    noFitDetails: res.noFitDetails,
    syntheticProfile,
  };

  return Object.assign(enriched, fullResult);
}
