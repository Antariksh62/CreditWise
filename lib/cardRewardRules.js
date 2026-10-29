/**
 * CardWise — Audited Card Reward Rules, Caps, and Fee Waiver Metadata
 * ===================================================================
 * Codifies verified bank rules for all 31 cards in data/cards.json:
 * - Category earn rates (as effective percentage value back)
 * - Known verified monthly caps
 * - Explicit exclusions
 * - Accurate spend-based fee waiver thresholds
 * - Reward type: 'cashback' | 'points' | 'miles'
 * - Baseline point redemption valuation with explicit rationale
 */

export const POINT_VALUATIONS = {
  // Cash/Direct Statement Credit
  CASHBACK: { value: 1.0, label: "Direct Statement Credit (₹1.00)" },
  // Co-branded partner currency (1 NeuCoin = ₹1, 1 Amazon Pay = ₹1)
  CO_BRANDED_1TO1: { value: 1.0, label: "1:1 Partner Currency (₹1.00)" },
  // Premium Airline/Hotel Miles transfers (1 RP = ₹1 on flights/hotels via SmartBuy or 1:1 transfer)
  PREMIUM_AIRLINE_HOTEL: { value: 1.0, label: "Aviation/Hotel Partners (₹1.00)" },
  // Tier-1 Rewards (Diners Privilege, Regalia Gold: ₹0.50 on SmartBuy flights)
  TIER1_TRAVEL_REDEMPTION: { value: 0.50, label: "SmartBuy Travel Portal (₹0.50)" },
  // Standard Amex / Bank Rewards catalog / Cash Credit conversion (₹0.25 - ₹0.40)
  STANDARD_BANK_CATALOG: { value: 0.25, label: "Standard Catalog Redemption (₹0.25)" },
};

export const CARD_RULES = {
  "amazon-pay-icici": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Amazon Pay Balance (₹1.00)",
    feeWaiverSpendThreshold: 0, // Lifetime Free
    feeWaiverCondition: "Lifetime Free with no spend conditions",
    forexMarkup: 1.99, // Permanent discounted 1.99% markup
    rates: {
      shopping: 5.0, // Amazon Prime (5%), 3% non-prime
      online: 5.0,
      groceries: 2.0, // Fresh/partner merchants
      dining: 2.0,   // Partner food delivery via Amazon Pay
      travel: 2.0,   // Flights via Amazon (digital)
      fuel: 0.0,     // Surcharge waiver only, no cashback
      utilities: 2.0,// Bill payments via Amazon Pay (0% if paid outside)
      international: 1.0, // 1% cashback (with 1.99% forex markup)
      other: 1.0,
    },
    caps: {
      totalMonthly: Infinity, // No cap
    },
    exclusions: [
      "Rent payments (in-app & 3rd party)",
      "Education & school fees",
      "EMI transactions",
      "Gold & precious metals",
      "Wallet reloads",
      "Cash advances",
      "Fuel purchases (surcharge waiver only)",
      "Utilities paid outside Amazon",
      "Government & tax payments (MCC 9311/9313)",
      "Amazon Business purchases"
    ],
    confidence: "verified",
  },

  "amex-mrcc": {
    rewardType: "points",
    pointValue: 0.40, // 18/24 Karat gold collection vouchers ~ ₹0.33 to ₹0.58 (Taj ~₹0.58)
    pointValuationLabel: "18K/24K Gold Collection (₹0.40 avg)",
    feeWaiverSpendThreshold: 150000, // 100% waiver on ₹1.5L
    partialFeeWaiverSpendThreshold: 90000, // 50% waiver on ₹90k-₹1.5L
    feeWaiverCondition: "100% renewal fee waiver (₹5,310 incl. GST) on ₹1,50,000+ spend; 50% waiver (₹2,655 incl. GST) on ₹90,000–₹1,49,999",
    rates: {
      shopping: 2.0, // 1 MR per ₹50 (2 pts/₹100)
      online: 2.0,
      groceries: 2.0,
      dining: 2.0,
      travel: 2.0,
      fuel: 0.0, // Zero base rewards
      utilities: 0.0, // Zero base rewards
      insurance: 0.0, // Zero base rewards
      other: 2.0,
    },
    monthlyBonusMilestone: {
      // 1,000 bonus on 4x ₹1,500 + 1,000 bonus on ₹20k spend (requires enrollment) = 2,000 MR points/mo
      minTransactions: 4,
      minTransactionAmount: 1500,
      transactionBonusPoints: 1000,
      minSpend: 20000,
      spendBonusPoints: 1000,
      enrollmentRequiredForSpendMilestone: true,
      totalBonusPointsMonthly: 2000,
    },
    caps: {
      bonusPointsMonthly: 2000,
    },
    exclusions: [
      "Fuel purchases",
      "Insurance premiums",
      "Utilities (electricity, water, gas)",
      "EMI transactions (online & physical POS)",
      "Cash advances"
    ],
    confidence: "verified",
  },

  "axis-horizon": {
    rewardType: "miles",
    pointValue: 1.0, // 1 EDGE Mile = ₹1 on Travel EDGE portal flight/hotel bookings
    pointValuationLabel: "Travel EDGE Direct Bookings (₹1.00)",
    feeWaiverSpendThreshold: null, // Non-waivable on retail spending
    feeWaiverCondition: "Non-waivable on retail spend (₹3,540/yr incl. 18% GST); waived only for Burgundy accounts opened on/after July 1, 2026",
    rates: {
      travel: 5.0, // 5 EDGE Miles per ₹100 on direct airlines & Travel EDGE
      shopping: 2.0, // 2 EDGE Miles per ₹100 on all other retail
      online: 2.0,
      groceries: 2.0,
      dining: 2.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 2.0,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: [
      "Wallet loading & gift cards",
      "Rental payments & processing charges",
      "Insurance premiums",
      "Fuel transactions",
      "Government institutions & tax outlays",
      "Utilities & telecom bills",
      "Educational institution payments",
      "Transportation, tolls & transit services"
    ],
    confidence: "verified",
  },

  "axis-magnus": {
    rewardType: "points",
    pointValue: 0.40, // 5:2 transfer to airline partners (~₹0.40)
    pointValuationLabel: "5:2 Airline Partner Transfer (₹0.40)",
    feeWaiverSpendThreshold: 2500000, // ₹25L
    feeWaiverCondition: "Waived on annual eligible retail spends of ₹25,00,000 in preceding year (₹14,750 incl. 18% GST); Lifetime Free for Burgundy Private clients",
    forexMarkup: 2.0, // 2.0% reduced forex markup
    rates: {
      travel: 7.0, // 35 pts per ₹200 on Travel EDGE = 17.5% pts × ₹0.40 = 7.0% value
      shopping: 2.4, // 12 pts per ₹200 = 6% pts × ₹0.40 = 2.4% value
      online: 2.4,
      groceries: 2.4,
      dining: 2.4,
      fuel: 0.0,
      utilities: 0.0,
      other: 2.4,
    },
    caps: {
      travelMonthlySpendCap: 200000,
      annualPartnerTransferCap: 500000, // 5L points/year (1L Group A + 4L Group B)
    },
    exclusions: [
      "Rent payments",
      "Wallet loading transactions",
      "Fuel purchases",
      "Insurance premiums",
      "Government institutions & tax payments",
      "Utilities",
      "Gold & jewelry transactions"
    ],
    confidence: "verified",
  },

  "bob-eterna": {
    rewardType: "points",
    pointValue: 0.25, // 1 pt = ₹0.25 direct statement credit / travel
    pointValuationLabel: "Statement Credit / Travel (₹0.25)",
    feeWaiverSpendThreshold: 250000,
    feeWaiverCondition: "Waived on annual spends of ₹2,50,000 (₹2,949/yr incl. 18% GST)",
    forexMarkup: 2.0, // 2.0% reduced forex markup
    rates: {
      shopping: 3.75, // 15 pts/₹100 on online shopping (3.75% value)
      online: 3.75,
      travel: 3.75,
      dining: 3.75,
      groceries: 0.75,
      fuel: 0.0,
      utilities: 0.0,
      other: 0.75, // 3 pts/₹100
    },
    caps: {
      acceleratedMonthlyPoints: 5000, // max 5,000 accelerated pts = ₹1,250/mo
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions",
      "Rental payments",
      "Utility bill payments",
      "Educational institution fees"
    ],
    confidence: "verified",
  },

  "bob-ethiad": {
    rewardType: "miles",
    pointValue: 0.90, // Average flight award valuation ~ ₹0.90 (range ₹0.60–₹1.20)
    pointValuationLabel: "Etihad Guest Award Flights (~₹0.90)",
    feeWaiverSpendThreshold: 300000,
    feeWaiverCondition: "Waived on annual spends of ₹3,00,000 (₹2,950/yr incl. 18% GST)",
    forexMarkup: 1.0, // Disruptive 1.0% forex markup
    rates: {
      travel: 3.0, // 3 Etihad Guest Miles / ₹100 on Etihad Airways
      shopping: 1.0,
      online: 1.0,
      groceries: 1.0,
      dining: 1.0,
      fuel: 0.0,
      utilities: 1.0,
      other: 1.0,
    },
    monthlyBonusMilestone: {
      minSpend: 25000,
      bonusPoints: 1000,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading & digital prepaid reloads",
      "Rental payments",
      "Cash advances & DCC fees"
    ],
    confidence: "verified",
  },

  "flipkart-axis-bank": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Direct Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 350000,
    feeWaiverCondition: "Waived on annual spends of ₹3,50,000 (₹590/yr incl. 18% GST)",
    rates: {
      shopping: 5.0, // 5% on Flipkart & Cleartrip
      online: 4.0,   // 4% on Swiggy, Uber, PVR INOX, Tata 1mg
      dining: 4.0,   // Swiggy
      travel: 4.0,   // Uber & Cleartrip
      groceries: 1.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      totalMonthly: Infinity, // No monthly cap on Flipkart cashback
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading & prepaid instruments",
      "Rental payments",
      "Government institutions & tax payments",
      "Utilities & bill payments",
      "Educational institution fees",
      "All EMI purchases (merchant & bank)",
      "Gift cards on Flipkart"
    ],
    confidence: "verified",
  },

  "hdfc-biz-black": {
    rewardType: "points",
    pointValue: 1.0, // 1 RP = ₹1 on flights/hotels via SmartBuy & 1:1 airline miles
    pointValuationLabel: "SmartBuy Travel & 1:1 Airline Miles (₹1.00)",
    feeWaiverSpendThreshold: 750000,
    feeWaiverCondition: "Waived on annual business retail spends of ₹7,50,000 (₹11,800/yr incl. 18% GST)",
    forexMarkup: 2.0, // 2.0% reduced forex markup
    rates: {
      travel: 3.33, // 5 RP / ₹150 base (up to 33.3% on SmartBuy)
      shopping: 3.33,
      online: 3.33,
      groceries: 3.33,
      dining: 3.33,
      utilities: 16.65, // 5X accelerated rate (25 RP / ₹150) on Income Tax, GST & business utilities
      fuel: 0.0,
      other: 3.33,
    },
    caps: {
      acceleratedMonthlyPoints: 7500, // 7.5k RP/month 5X accelerator cap (optimal at ₹56,250 spend)
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions",
      "Rental payments",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-diners-club-metal": {
    rewardType: "points",
    pointValue: 1.0, // 1 RP = ₹1 on flights/hotels via SmartBuy & 1:1 airline transfers
    pointValuationLabel: "SmartBuy Flights/Hotels & 1:1 Airline Miles (₹1.00)",
    feeWaiverSpendThreshold: 800000,
    feeWaiverCondition: "Waived on annual retail spends of ₹8,00,000 in preceding year (₹11,800/yr incl. 18% GST)",
    forexMarkup: 2.0, // 2.0% + GST
    rates: {
      travel: 3.33,  // 5 RP / ₹150 base; up to 10X (33.3%) on SmartBuy
      shopping: 3.33,
      online: 3.33,
      groceries: 3.33,
      dining: 6.66,  // 2X on weekend dining (10 RP / ₹150)
      fuel: 0.0,
      utilities: 0.0,
      other: 3.33,
    },
    caps: {
      totalMonthlyPoints: 75000, // strictly capped at 75,000 RP per statement cycle
      smartbuyMonthlyBonus: 10000, // 10,000 bonus points per month
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions",
      "Rental payments",
      "Government transactions & tax payments",
      "EasyEMI & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-diners-club-privilege": {
    rewardType: "points",
    pointValue: 0.50, // 1 RP = ₹0.50 on SmartBuy flights/hotels; 2:1 on air miles
    pointValuationLabel: "SmartBuy Travel Redemption (₹0.50)",
    feeWaiverSpendThreshold: 300000,
    feeWaiverCondition: "Waived on annual retail spends of ₹3,00,000 in preceding year (₹2,950/yr incl. 18% GST)",
    forexMarkup: 2.0, // 2.0% + GST
    rates: {
      travel: 2.6, // 4 RP / ₹150 base; up to 10X on SmartBuy
      shopping: 1.33,
      online: 1.33,
      dining: 3.33, // 5X on Swiggy & Zomato (20 RP / ₹150)
      groceries: 1.33,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.33,
    },
    caps: {
      smartbuyMonthlyBonus: 5000,
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions & digital reloads",
      "Rental payments",
      "Government transactions & tax payments",
      "EasyEMI & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-infinia": {
    rewardType: "points",
    pointValue: 1.0, // 1 RP = ₹1 on flights/hotels via SmartBuy or 1:1 Apple/Tanishq, up to ~₹1.85 on Accor ALL
    pointValuationLabel: "SmartBuy Flights/Hotels/Apple & 1:1 Partners (₹1.00 - ₹1.85)",
    feeWaiverSpendThreshold: 1000000, // ₹10 Lakhs
    feeWaiverCondition: "Waived on annual spends of ₹10,00,000 in preceding year (₹14,750/yr incl. 18% GST, neutralized by 12,500 points)",
    forexMarkup: 2.0, // 2.0% + GST
    rates: {
      travel: 3.33, // 5 RP / ₹150 base; up to 10X (33.3%) on SmartBuy hotels
      shopping: 3.33,
      online: 3.33,
      groceries: 3.33,
      dining: 6.66, // 2X on luxury dining partners
      fuel: 0.0,
      utilities: 0.0,
      other: 3.33,
    },
    caps: {
      smartbuyMonthlyBonus: 15000, // 15,000 bonus points per month
      smartbuyVouchersBonus: 3000, // GyFTR sub-cap of 3,000 bonus RP/month
      groceryMonthlyPoints: 2000,
      monthlyRedemptionPoints: 150000,
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions",
      "Rental & property management payments",
      "Government transactions & tax payments",
      "EasyEMI conversions & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-marriott-bonvoy": {
    rewardType: "points",
    pointValue: 0.65, // ~₹0.60-0.90 per Marriott Bonvoy point
    pointValuationLabel: "Marriott Bonvoy Award Nights (~₹0.65)",
    feeWaiverSpendThreshold: null, // Non-waivable
    feeWaiverCondition: "Non-waivable fee of ₹3,540 (₹3,000 + 18% GST); neutralized by 1 Free Night Award (up to 15k pts) on annual renewal",
    forexMarkup: 3.5, // 3.5% + GST; plus 1.75% DCC if charged in INR abroad
    rates: {
      travel: 2.6, // 8 Bonvoy pts / ₹200 on direct Marriott = 4 pts/₹100 (~2.6% value)
      dining: 1.3, // 4 Bonvoy pts / ₹200 on dining, travel, entertainment = 2 pts/₹100 (~1.3% value)
      shopping: 0.65, // 2 Bonvoy pts / ₹200 = 1 pt/₹100 (~0.65% value)
      online: 0.65,
      groceries: 0.65,
      fuel: 0.0,
      utilities: 0.0,
      other: 0.65,
    },
    caps: {
      marriottMonthlySpend: 1000000, // 4X rate capped at ₹10L spend/month
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions",
      "Rental & property management payments",
      "Government transactions, tax filings & public utility bills",
      "EasyEMI & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-millennia": {
    rewardType: "cashback",
    pointValue: 1.0, // 1 CashPoint = ₹1.00 strictly for statement balance credit
    pointValuationLabel: "Statement Credit (1 CashPoint = ₹1.00)",
    feeWaiverSpendThreshold: 100000,
    feeWaiverCondition: "Waived on annual spends of ₹1,00,000 in preceding year (₹1,180/yr incl. 18% GST)",
    forexMarkup: 3.5, // 3.5% + GST
    rates: {
      shopping: 5.0, // 5% CashPoints on Amazon, Flipkart, Myntra, Tata CLiQ
      online: 5.0,
      dining: 5.0,   // Swiggy, Zomato
      travel: 5.0,   // Uber, BookMyShow
      groceries: 1.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      categoryMonthlyCashback: 1000, // 5% CashPoints capped at ₹1,000 per month (maxed at ₹20,000 spend)
      generalMonthlyCashback: 1000,  // 1% CashPoints capped at ₹1,000 per month
      minimumRedemptionPoints: 500,  // Minimum 500 CashPoints required to redeem
    },
    exclusions: [
      "Rent payments",
      "Government transactions & tax payments",
      "Fuel purchases",
      "Insurance premium payments",
      "Wallet loading transactions & digital reloads",
      "EasyEMI conversions & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-regalia-gold": {
    rewardType: "points",
    pointValue: 0.50, // 1 RP = ₹0.50 on SmartBuy flights/hotels & 1:0.5 airline miles
    pointValuationLabel: "SmartBuy Flights/Hotels & Air Miles (₹0.50)",
    feeWaiverSpendThreshold: 400000,
    feeWaiverCondition: "Waived on annual retail spends of ₹4,00,000 in preceding year (₹2,950/yr incl. 18% GST)",
    forexMarkup: 2.0, // 2.0% + GST
    rates: {
      shopping: 2.6, // 4 RP / ₹150 base (up to 5X at M&S, Myntra, Nykaa, Reliance Digital)
      online: 2.6,
      travel: 2.6,
      dining: 2.6,
      groceries: 1.33,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.33,
    },
    caps: {
      acceleratedMonthlyPoints: 5000, // 5X brand points capped at 5,000 points/month
    },
    exclusions: [
      "Fuel purchases",
      "Wallet loading transactions & digital reloads",
      "Rental payments & property management",
      "Government transactions & tax payments",
      "Insurance premium payments",
      "EasyEMI conversions & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-swiggy-blck": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 200000,
    feeWaiverCondition: "Waived on annual spends of ₹2,00,000 in preceding year (₹1,180/yr incl. 18% GST)",
    forexMarkup: 3.5, // 3.5% + GST
    rates: {
      dining: 10.0,   // 10% on Swiggy Food & Dineout (orders >= ₹249)
      groceries: 10.0,// 10% on Swiggy Instamart (orders >= ₹249)
      shopping: 5.0,  // 5% on top e-commerce (Amazon, Flipkart, Myntra, Nykaa, etc.; orders >= ₹100)
      online: 5.0,
      travel: 1.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      swiggyMonthlyCashback: 1500, // ₹1,500/mo cap on 10% Swiggy spends (maxed at ₹15,000 spend)
      onlineMonthlyCashback: 1500, // separate ₹1,500/mo cap on 5% online shopping (maxed at ₹30,000 spend)
      otherMonthlyCashback: 500,   // ₹500/mo cap on 1% other retail
    },
    minimumTransactionValues: {
      swiggy: 249, // orders < ₹249 earn base 1%
      onlinePartners: 100, // orders < ₹100 earn base 1%
    },
    exclusions: [
      "Orders below ₹249 on Swiggy (earn base 1%)",
      "Orders below ₹100 on 5% partners (earn base 1%)",
      "Fuel purchases",
      "Wallet loading transactions & digital reloads",
      "Rental payments",
      "Government transactions & tax payments",
      "Public utility bills",
      "Jewelry purchases",
      "EasyEMI conversions & merchant EMIs",
      "Cash advances & bank interest charges"
    ],
    confidence: "verified",
  },

  "hdfc-swiggy-orgne": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 150000,
    feeWaiverCondition: "Waived on annual spends of ₹1,50,000 in preceding year",
    rates: {
      dining: 5.0,
      groceries: 5.0, // Instamart
      shopping: 5.0,
      online: 5.0,
      travel: 1.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      swiggyMonthlyCashback: 1000,
      onlineMonthlyCashback: 750,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Utilities", "Government payments"],
    confidence: "verified",
  },

  "hdfc-tata-neu-infinity": {
    rewardType: "cashback",
    pointValue: 1.0, // 1 NeuCoin = ₹1 on Tata Neu brands (BigBasket, 1mg, Air India Express, Croma, Titan)
    pointValuationLabel: "Tata Neu Ecosystem (1 NeuCoin = ₹1.00)",
    feeWaiverSpendThreshold: 300000,
    feeWaiverCondition: "Waived on annual retail spends of ₹3,00,000",
    rates: {
      groceries: 10.0, // BigBasket via Tata Neu (5% card + 5% NeuPass)
      shopping: 10.0,  // Croma, Tata CLiQ, Westside, Titan
      travel: 10.0,    // Air India Express, IHCL Taj via Tata Neu
      dining: 5.0,     // Qmin, Starbucks
      utilities: 1.5,  // Bill payments via Tata Neu
      fuel: 0.0,
      other: 1.5,      // 1.5% on UPI payments and non-Tata spends
    },
    caps: {
      upiMonthlyCoins: 500, // 500 NeuCoins per month on UPI
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government transactions", "Cash advances"],
    confidence: "verified",
  },

  "hdfc-tata-neu-plus": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Tata Neu Ecosystem (1 NeuCoin = ₹1.00)",
    feeWaiverSpendThreshold: 100000,
    feeWaiverCondition: "Waived on annual retail spends of ₹1,00,000",
    rates: {
      groceries: 7.0, // BigBasket (2% card + 5% NeuPass)
      shopping: 7.0,
      travel: 7.0,
      dining: 2.0,
      utilities: 1.0,
      fuel: 0.0,
      other: 1.0, // 1% on UPI and non-Tata
    },
    caps: {
      upiMonthlyCoins: 500,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government transactions"],
    confidence: "verified",
  },

  "hsbc-live-plus": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Direct Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 200000,
    feeWaiverCondition: "Waived on annual spends of ₹2,00,000 in preceding year",
    rates: {
      dining: 10.0,   // 10% on dining and food delivery
      groceries: 10.0,// 10% on supermarkets, groceries (Blinkit, Zepto, DMart, Instamart)
      shopping: 1.5,  // 1.5% unlimited on all other retail
      online: 1.5,
      travel: 1.5,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.5,
    },
    caps: {
      diningGroceryMonthlyCashback: 1000, // 10% cashback capped at ₹1,000 per statement cycle (₹12,000/yr)
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Utilities", "Government payments", "Education"],
    confidence: "verified",
  },

  "hsbc-premier": {
    rewardType: "miles",
    pointValue: 1.0, // 1:1 redemption with Singapore KrisFlyer, British Airways, Taj
    pointValuationLabel: "1:1 Air Miles & Taj Vouchers (₹1.00)",
    feeWaiverSpendThreshold: 0, // Nil fee with Premier Banking relationship
    feeWaiverCondition: "Nil annual fee as long as Premier banking relationship is maintained",
    rates: {
      travel: 3.0, // 3 pts / ₹100 domestic; 6 pts / ₹100 intl
      shopping: 3.0,
      online: 3.0,
      dining: 3.0,
      groceries: 3.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 3.0,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Utilities", "Government payments"],
    confidence: "verified",
  },

  "hsbc-rupay-cashback": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Direct Statement Credit (₹1.00)",
    feeWaiverSpendThreshold: 200000,
    feeWaiverCondition: "Waived on annual retail spends of ₹2,00,000",
    rates: {
      groceries: 5.0,
      dining: 5.0,
      other: 1.5, // 1.5% on UPI Scan & Pay
      shopping: 1.5,
      online: 1.5,
      travel: 1.5,
      fuel: 0.0,
      utilities: 0.0,
    },
    caps: {
      acceleratedMonthlyCashback: 500, // Capped at ₹500/billing cycle
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Utility payments", "Government transactions"],
    confidence: "verified",
  },

  "hsbc-travel-one": {
    rewardType: "miles",
    pointValue: 1.0, // Instant transfer to 16+ global airline & hotel partners
    pointValuationLabel: "Airline & Hotel Loyalty Transfers (₹1.00)",
    feeWaiverSpendThreshold: 800000,
    feeWaiverCondition: "Waived on annual spends of ₹8,00,000 in preceding year",
    rates: {
      travel: 4.0, // 4 pts / ₹100 on travel bookings and dining
      dining: 4.0,
      shopping: 2.0, // 2 pts / ₹100
      online: 2.0,
      groceries: 2.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 2.0,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government transactions", "Cash advances"],
    confidence: "verified",
  },

  "idfc-first-power-plus": {
    rewardType: "fuel",
    pointValue: 1.0, // Direct fuel credit via HP Pay app
    pointValuationLabel: "HPCL Fuel Credit (₹1.00)",
    feeWaiverSpendThreshold: 150000,
    feeWaiverCondition: "Waived on annual spends of ₹1,50,000 in preceding year",
    rates: {
      fuel: 6.5,      // 4% rewards + 1.5% HP Pay app + 1% surcharge waiver
      groceries: 5.0, // 5% on grocery & utilities
      utilities: 5.0,
      dining: 0.75,   // 3X rewards = 0.75% value
      shopping: 0.75,
      online: 0.75,
      travel: 0.75,
      other: 0.75,
    },
    caps: {
      fuelMonthlySpendCap: 10000, // Max ₹10,000/mo eligible for 6.5%
      groceryUtilityMonthlyCashback: 400, // Max ₹400/mo
    },
    exclusions: ["Wallet reloads", "Rent payments", "Education", "Cash advances"],
    confidence: "verified",
  },

  "indusind-eazydiner": {
    rewardType: "dining",
    pointValue: 0.33, // 10 pts / ₹100 = 3.3% value back
    pointValuationLabel: "PayEazy Dining Discounts (₹0.33)",
    feeWaiverSpendThreshold: null, // Non-waivable (includes annual EazyDiner Prime)
    feeWaiverCondition: "No spend-based waiver; renewed with 1-year EazyDiner Prime membership",
    rates: {
      dining: 10.0, // 25% instant discount (up to ₹1k) + 10 pts/₹100 = ~10%+ effective on dining
      shopping: 3.3,
      online: 3.3,
      travel: 3.3,
      groceries: 1.32, // 4 pts / ₹100
      fuel: 0.0,
      utilities: 1.32,
      other: 1.32,
    },
    caps: {
      diningDiscountCapPerBill: 1000,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government transactions"],
    confidence: "verified",
  },

  "indusind-tiger": {
    rewardType: "points",
    pointValue: 0.40, // 1 RP = ₹0.40 cash credit or 1:1 air miles
    pointValuationLabel: "Cash Credit / Air Miles (₹0.40)",
    feeWaiverSpendThreshold: 0,
    feeWaiverCondition: "Lifetime Free with no annual fees or minimum spend conditions",
    rates: {
      travel: 2.4, // Up to 6X on tiered spending (2.4% value)
      dining: 2.4,
      shopping: 2.4,
      online: 2.4,
      groceries: 0.8,
      fuel: 0.0,
      utilities: 0.8,
      other: 0.8,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government transactions"],
    confidence: "verified",
  },

  "kiwi-yes-bank": {
    rewardType: "cashback",
    pointValue: 1.0, // 4 Kiwi points = ₹1 statement credit
    pointValuationLabel: "Direct Statement Credit (₹1.00)",
    feeWaiverSpendThreshold: 0,
    feeWaiverCondition: "Lifetime Free with no annual fees",
    rates: {
      other: 1.5,      // 1.5% flat on merchant UPI Scan & Pay
      groceries: 1.5,  // UPI offline
      dining: 1.5,     // UPI restaurants
      shopping: 0.5,   // 0.5% online e-commerce
      online: 0.5,
      travel: 0.5,
      fuel: 0.0,
      utilities: 0.5,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Peer-to-peer transfers", "Fuel", "Rent", "Wallet reloads", "Cash withdrawals"],
    confidence: "verified",
  },

  "rbl-indianoil-xtra": {
    rewardType: "fuel",
    pointValue: 0.50, // 1 Fuel Point = ₹0.50
    pointValuationLabel: "IndianOil Fuel Redemption (₹0.50)",
    feeWaiverSpendThreshold: 275000,
    feeWaiverCondition: "Waived on annual retail spends of ₹2,75,000 in preceding year",
    rates: {
      fuel: 8.5, // 15 Fuel Points / ₹100 + 1% waiver = 8.5%
      groceries: 1.0, // 2 points / ₹100
      dining: 1.0,
      shopping: 1.0,
      online: 1.0,
      travel: 1.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      fuelMonthlyPoints: 1000, // 1,000 fuel points/mo = ₹500/mo cap
    },
    exclusions: ["Wallet loads", "Rent payments", "Utilities", "Cash advances"],
    confidence: "verified",
  },

  "sbi-bpcl-octane": {
    rewardType: "fuel",
    pointValue: 0.25, // 1 RP = ₹0.25 fuel at BPCL pumps
    pointValuationLabel: "BPCL Fuel Redemption (₹0.25)",
    feeWaiverSpendThreshold: 200000,
    feeWaiverCondition: "Waived on annual spends of ₹2,00,000 in preceding year",
    rates: {
      fuel: 7.25,      // 25 pts/₹100 (6.25%) + 1% waiver = 7.25%
      groceries: 2.5,  // 10 pts/₹100 = 2.5% value
      dining: 2.5,     // 10 pts/₹100 = 2.5% value
      shopping: 0.25,  // 1 pt/₹100 = 0.25%
      online: 0.25,
      travel: 0.25,
      utilities: 0.0,
      other: 0.25,
    },
    caps: {
      fuelMonthlyPoints: 2500, // ₹625/mo cap on fuel (up to ₹10,000 fuel spend)
    },
    exclusions: ["Wallet loads", "Rent payments", "Education", "Cash advances"],
    confidence: "verified",
  },

  "sbi-cashback": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Direct Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 200000,
    feeWaiverCondition: "Waived on annual online/offline spends of ₹2,00,000",
    rates: {
      shopping: 5.0,  // 5% online shopping
      online: 5.0,    // 5% online across merchants
      dining: 5.0,    // Online delivery (Swiggy, Zomato)
      travel: 5.0,    // Online flights, hotels
      groceries: 1.0, // Offline 1% (online grocery like Blinkit often earns 5%)
      fuel: 0.0,
      utilities: 0.0, // Utilities excluded from 5%
      other: 1.0,     // 1% offline
    },
    caps: {
      onlineMonthlyCashback: 5000, // ₹5,000 per statement cycle (up to ₹1,00,000 monthly spend)
    },
    exclusions: ["Rent", "Fuel", "Wallet reloads", "School/education fees", "Utilities", "Insurance", "Government payments", "Jewelry"],
    confidence: "verified",
  },

  "sbi-phonepe-black": {
    rewardType: "points",
    pointValue: 0.25,
    pointValuationLabel: "PhonePe Ecosystem & Gift Cards (₹0.25)",
    feeWaiverSpendThreshold: 300000,
    feeWaiverCondition: "Waived on annual retail spends of ₹3,00,000 in preceding year",
    rates: {
      utilities: 10.0,// PhonePe app recharges, electricity, bills
      travel: 5.0,    // Online travel portals
      shopping: 5.0,  // Top online brands
      online: 5.0,
      dining: 1.0,
      groceries: 1.0,
      fuel: 0.0,
      other: 1.0,     // 1% on Scan & Pay
    },
    caps: {
      categoryMonthlyPoints: 2000, // Capped at 2,000 pts/statement cycle = ₹500/mo
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government transactions", "Cash advances"],
    confidence: "verified",
  },

  "bobcard-scapia": {
    rewardType: "points",
    pointValue: 0.20, // 5 Scapia Coins = ₹1 on Scapia travel portal
    pointValuationLabel: "Scapia Travel Bookings (₹0.20)",
    feeWaiverSpendThreshold: 0,
    feeWaiverCondition: "Lifetime Free with zero joining fee and zero annual maintenance fee",
    rates: {
      travel: 4.0,   // 20% Scapia Coins on Scapia app travel (4% value)
      dining: 2.0,   // 10% Scapia Coins on all retail (2% value)
      groceries: 2.0,
      shopping: 2.0,
      online: 2.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 2.0,
    },
    caps: {
      totalMonthly: Infinity, // No maximum cap on Scapia Coins earned
    },
    exclusions: ["Fuel", "Wallet top-ups", "Rent", "Education", "Government services", "Cash advances"],
    confidence: "verified",
  },
};
