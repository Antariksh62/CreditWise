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
    rates: {
      shopping: 5.0, // Amazon Prime (5%), 3% non-prime
      online: 5.0,
      groceries: 2.0, // Fresh/partner merchants
      dining: 2.0,   // Partner food delivery via Amazon Pay
      travel: 2.0,   // Flights via Amazon
      fuel: 0.0,     // Surcharge waiver only, no cashback
      utilities: 2.0,// Bill payments via Amazon Pay
      other: 1.0,
    },
    caps: {
      totalMonthly: Infinity, // No cap
    },
    exclusions: ["Fuel purchases", "EMI transactions", "Gold/bullion", "Wallet reloads", "Government payments"],
    confidence: "verified",
  },

  "amex-mrcc": {
    rewardType: "points",
    pointValue: 0.40, // 18/24 Karat gold collection vouchers ~ ₹0.35-0.45
    pointValuationLabel: "18K/24K Gold Collection Vouchers (₹0.40)",
    feeWaiverSpendThreshold: 150000, // 100% waiver on ₹1.5L
    feeWaiverCondition: "100% renewal fee waiver on annual spends of ₹1,50,000",
    rates: {
      shopping: 2.0, // 1 MR per ₹50 (2 pts/₹100)
      online: 2.0,
      groceries: 2.0,
      dining: 2.0,
      travel: 2.0,
      fuel: 0.0,
      utilities: 0.0, // Excluded
      other: 2.0,
    },
    monthlyBonusMilestone: {
      // 1,000 bonus on 4x ₹1,500 + 1,000 bonus on ₹20k spend = 2,000 MR points/mo
      minSpend: 20000,
      bonusPoints: 2000,
    },
    caps: {
      bonusPointsMonthly: 2000,
    },
    exclusions: ["Fuel", "Insurance", "Utilities (direct)", "Cash advances"],
    confidence: "verified",
  },

  "axis-horizon": {
    rewardType: "miles",
    pointValue: 1.0, // 1 EDGE Mile = ₹1 partner mile
    pointValuationLabel: "1:1 Airline Miles Transfer (₹1.00)",
    feeWaiverSpendThreshold: null, // Non-waivable
    feeWaiverCondition: "No spend-based waiver; ₹3,000 annual fee is non-waivable",
    rates: {
      travel: 5.0, // 5 EDGE Miles per ₹100 on Axis Travel EDGE & airlines
      shopping: 1.5, // 1.5 EDGE Miles per ₹100
      online: 1.5,
      groceries: 1.5,
      dining: 1.5,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.5,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent", "Government payments", "Utilities"],
    confidence: "verified",
  },

  "axis-magnus": {
    rewardType: "points",
    pointValue: 0.40, // 5:2 transfer to airline partners or Travel EDGE
    pointValuationLabel: "Travel EDGE & Partner Miles (₹0.40)",
    feeWaiverSpendThreshold: 2500000, // ₹25L
    feeWaiverCondition: "Waived on annual spends of ₹25,00,000 in preceding year",
    rates: {
      travel: 7.0, // 35 pts per ₹200 on Travel EDGE = 17.5% pts = 7% value
      shopping: 2.4, // 12 pts per ₹200 = 6% pts = 2.4% value
      online: 2.4,
      groceries: 2.4,
      dining: 2.4,
      fuel: 0.0,
      utilities: 0.0,
      other: 2.4,
    },
    caps: {
      travelMonthlySpendCap: 200000,
    },
    exclusions: ["Fuel", "Rent", "Wallet loads", "Government institutions", "Utilities"],
    confidence: "verified",
  },

  "bob-eterna": {
    rewardType: "points",
    pointValue: 0.25, // 1 pt = ₹0.25 cash credit
    pointValuationLabel: "Cash Credit / Travel Redemption (₹0.25)",
    feeWaiverSpendThreshold: 250000,
    feeWaiverCondition: "Waived on annual spends of ₹2,50,000",
    rates: {
      shopping: 3.75, // 15 pts/₹100 on online shopping (3.75% value)
      online: 3.75,
      travel: 3.75,
      dining: 3.75,
      groceries: 0.75,
      fuel: 0.0,
      utilities: 0.75,
      other: 0.75, // 3 pts/₹100
    },
    caps: {
      acceleratedMonthlyPoints: 5000, // max 5,000 accelerated pts = ₹1,250/mo
    },
    exclusions: ["Fuel", "Wallet reloads", "Rent", "Government services"],
    confidence: "verified",
  },

  "bob-ethiad": {
    rewardType: "miles",
    pointValue: 1.0,
    pointValuationLabel: "Etihad Guest Miles (₹1.00)",
    feeWaiverSpendThreshold: 300000,
    feeWaiverCondition: "Waived on annual spends of ₹3,00,000 in preceding year",
    rates: {
      travel: 3.0, // 3 Etihad Guest Miles / ₹100 on Etihad.com
      shopping: 1.0,
      online: 1.0,
      groceries: 1.0,
      dining: 1.0,
      fuel: 0.0,
      utilities: 1.0,
      other: 1.0,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Fuel transactions", "Cash withdrawals", "Wallet loads"],
    confidence: "verified",
  },

  "flipkart-axis-bank": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Direct Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 350000,
    feeWaiverCondition: "Waived on annual spends of ₹3,50,000",
    rates: {
      shopping: 5.0, // 5% on Flipkart
      online: 4.0,   // 4% on Swiggy, Uber, PVR, Cleartrip
      dining: 4.0,   // Swiggy
      travel: 4.0,   // Cleartrip, Uber
      groceries: 1.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      totalMonthly: Infinity, // No monthly cap on Flipkart cashback
    },
    exclusions: ["Fuel", "Wallet loads", "Rent payments", "Government services", "Jewelry", "EMI"],
    confidence: "verified",
  },

  "hdfc-biz-black": {
    rewardType: "points",
    pointValue: 1.0, // 1 RP = ₹1 on corporate travel & flights via SmartBuy
    pointValuationLabel: "SmartBuy Business Travel (₹1.00)",
    feeWaiverSpendThreshold: 800000,
    feeWaiverCondition: "Waived on annual business spends of ₹8,00,000 in preceding year",
    rates: {
      travel: 3.3, // 5 RP / ₹150 base (up to 16.5% on SmartBuy)
      shopping: 3.3,
      online: 3.3,
      groceries: 3.3,
      dining: 3.3,
      utilities: 3.3, // GST, tax & business utilities earn rewards
      fuel: 0.0,
      other: 3.3,
    },
    caps: {
      acceleratedMonthlyPoints: 10000,
    },
    exclusions: ["Fuel surcharge", "Wallet top-ups", "EMI charges"],
    confidence: "verified",
  },

  "hdfc-diners-club-metal": {
    rewardType: "points",
    pointValue: 1.0, // 1 RP = ₹1 on flights/hotels via SmartBuy
    pointValuationLabel: "SmartBuy Flight & Hotel Redemption (₹1.00)",
    feeWaiverSpendThreshold: 800000,
    feeWaiverCondition: "Waived on annual retail spends of ₹8,00,000 in preceding year",
    rates: {
      travel: 3.33,  // 5 RP / ₹150 base; up to 10X (33.3%) on SmartBuy
      shopping: 3.33,
      online: 3.33,
      groceries: 3.33,
      dining: 6.66,  // 2X on weekend dining or partner portal
      fuel: 0.0,
      utilities: 0.0,
      other: 3.33,
    },
    caps: {
      smartbuyMonthlyBonus: 10000, // 10,000 bonus points per month
    },
    exclusions: ["Fuel", "Wallet loads", "Rent payments", "Government transactions", "Education"],
    confidence: "verified",
  },

  "hdfc-diners-club-privilege": {
    rewardType: "points",
    pointValue: 0.50, // 1 RP = ₹0.50 on SmartBuy flights/hotels
    pointValuationLabel: "SmartBuy Travel Redemption (₹0.50)",
    feeWaiverSpendThreshold: 300000,
    feeWaiverCondition: "Waived on annual spends of ₹3,00,000 in preceding year",
    rates: {
      travel: 2.6, // 4 RP / ₹150 base = 2.66% points = 1.33% cash / 2.6% travel
      shopping: 1.33,
      online: 1.33,
      dining: 2.6,
      groceries: 1.33,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.33,
    },
    caps: {
      smartbuyMonthlyBonus: 5000,
    },
    exclusions: ["Fuel", "Wallet reloads", "Rent payments", "Government services"],
    confidence: "verified",
  },

  "hdfc-infinia": {
    rewardType: "points",
    pointValue: 1.0, // 1 RP = ₹1 on flights/hotels via SmartBuy or 1:1 Apple/Tanishq
    pointValuationLabel: "SmartBuy Flights/Hotels/Apple (₹1.00)",
    feeWaiverSpendThreshold: 1000000, // ₹10 Lakhs
    feeWaiverCondition: "Waived on annual spends of ₹10,00,000 in preceding year",
    rates: {
      travel: 3.33, // 5 RP / ₹150 base; up to 10X (33.3%) on SmartBuy hotels
      shopping: 3.33,
      online: 3.33,
      groceries: 3.33,
      dining: 6.66, // 2X on dining partner merchants
      fuel: 0.0,
      utilities: 0.0, // Utilities capped at 2,000 points/month
      other: 3.33,
    },
    caps: {
      smartbuyMonthlyBonus: 15000, // 15,000 bonus points per month
      utilitiesMonthlyPoints: 2000,
    },
    exclusions: ["Fuel purchases", "Wallet reloads", "Rent payments", "Government transactions"],
    confidence: "verified",
  },

  "hdfc-marriott-bonvoy": {
    rewardType: "points",
    pointValue: 0.65, // ~₹0.60-0.70 per Marriott Bonvoy point
    pointValuationLabel: "Marriott Bonvoy Award Nights (~₹0.65)",
    feeWaiverSpendThreshold: null, // Non-waivable (grants 1 Free Night Award up to 15,000 pts on renewal)
    feeWaiverCondition: "No spend-based waiver; 1 Free Night Award (up to 15k pts) on annual renewal",
    rates: {
      travel: 5.3, // 8 Bonvoy points / ₹150 on Marriott; 4 pts / ₹150 on travel
      dining: 2.65, // 4 Bonvoy points / ₹150
      shopping: 1.33, // 2 Bonvoy points / ₹150
      online: 1.33,
      groceries: 1.33,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.33,
    },
    caps: {
      totalMonthly: Infinity,
    },
    exclusions: ["Fuel", "Wallet top-ups", "Rent payments", "Government transactions"],
    confidence: "verified",
  },

  "hdfc-millennia": {
    rewardType: "cashback",
    pointValue: 1.0, // 1 CashPoint = ₹1 for statement credit
    pointValuationLabel: "Statement Credit (1 CashPoint = ₹1.00)",
    feeWaiverSpendThreshold: 100000,
    feeWaiverCondition: "Waived on annual spends of ₹1,00,000 in preceding year",
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
      categoryMonthlyCashback: 1000, // 5% CashPoints capped at ₹1,000 per calendar month
      generalMonthlyCashback: 1000,  // 1% CashPoints capped at ₹1,000 per month
    },
    exclusions: ["Fuel", "Wallet reload", "Rent payments", "Government transactions"],
    confidence: "verified",
  },

  "hdfc-regalia-gold": {
    rewardType: "points",
    pointValue: 0.50, // 1 RP = ₹0.50 on SmartBuy flights
    pointValuationLabel: "SmartBuy Flights (₹0.50)",
    feeWaiverSpendThreshold: 400000,
    feeWaiverCondition: "Waived on annual retail spends of ₹4,00,000 in preceding year",
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
      acceleratedMonthlyPoints: 5000, // 5X brand points capped at 5,000 points/mo
    },
    exclusions: ["Fuel", "Wallet reload", "Rent payments", "Government payments"],
    confidence: "verified",
  },

  "hdfc-swiggy-blck": {
    rewardType: "cashback",
    pointValue: 1.0,
    pointValuationLabel: "Statement Cashback (₹1.00)",
    feeWaiverSpendThreshold: 200000,
    feeWaiverCondition: "Waived on annual spends of ₹2,00,000",
    rates: {
      dining: 10.0,   // 10% on Swiggy (Food, Instamart, Dineout, Genie)
      groceries: 10.0,// Swiggy Instamart
      shopping: 5.0,  // 5% on top e-commerce (Amazon, Flipkart, Myntra, Nykaa, etc.)
      online: 5.0,
      travel: 1.0,
      fuel: 0.0,
      utilities: 0.0,
      other: 1.0,
    },
    caps: {
      swiggyMonthlyCashback: 1500, // ₹1,500/mo cap on 10% Swiggy
      onlineMonthlyCashback: 1000, // ₹1,000/mo cap on 5% online
      otherMonthlyCashback: 500,
    },
    exclusions: ["Fuel", "Wallet loads", "Rent payments", "Government payments", "Jewelry", "Utilities"],
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
