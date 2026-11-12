/**
 * CreditWise — Merchant & Brand Ecosystem Reward Rules Registry
 * ==============================================================
 * Maps verified merchant-specific and ecosystem-specific reward rates,
 * isolated caps, and exclusions for the 31 cards in data/cards.json.
 *
 * All rates and caps are derived from official bank schedules and
 * product disclosures.
 */

// ==============================================================
// 1. BRAND ECOSYSTEMS & MERCHANT DEFINITIONS
// ==============================================================

export const ECOSYSTEMS = {
  tata: {
    id: "tata",
    name: "Tata Group",
    description: "Tata Neu ecosystem, retail stores, luxury hospitality, and aviation",
    brands: [
      { id: "bigbasket", name: "BigBasket", category: "groceries", channel: "online" },
      { id: "croma", name: "Croma", category: "shopping", channel: "both" },
      { id: "tatacliq", name: "Tata CLiQ & Luxury", category: "shopping", channel: "online" },
      { id: "westside", name: "Westside", category: "shopping", channel: "both" },
      { id: "zudio", name: "Zudio", category: "shopping", channel: "offline" },
      { id: "titan", name: "Titan & Fastrack", category: "shopping", channel: "both" },
      { id: "tanishq", name: "Tanishq & Mia", category: "shopping", channel: "both" },
      { id: "tata1mg", name: "Tata 1mg", category: "utilities", channel: "online" },
      { id: "tajhotels", name: "Taj, Vivanta & SeleQtions (IHCL)", category: "travel", channel: "both" },
      { id: "airindia", name: "Air India & Air India Express", category: "travel", channel: "both" },
      { id: "starbucks", name: "Starbucks India (Tata Consumer)", category: "dining", channel: "offline" },
    ],
  },

  reliance: {
    id: "reliance",
    name: "Reliance Retail",
    description: "Reliance Digital, AJIO, JioMart, Trends, and grocery supermarkets",
    brands: [
      { id: "reliancedigital", name: "Reliance Digital", category: "shopping", channel: "both" },
      { id: "ajio", name: "AJIO", category: "shopping", channel: "online" },
      { id: "jiomart", name: "JioMart", category: "groceries", channel: "online" },
      { id: "reliancetrends", name: "Reliance Trends", category: "shopping", channel: "both" },
      { id: "smartbazaar", name: "Reliance Smart / Smart Bazaar", category: "groceries", channel: "both" },
      { id: "jio", name: "Jio Prepaid & Fiber", category: "utilities", channel: "online" },
    ],
  },

  adityabirla: {
    id: "adityabirla",
    name: "Aditya Birla Fashion & Retail",
    description: "Apparel, department stores, and lifestyle retail brands",
    brands: [
      { id: "pantaloons", name: "Pantaloons", category: "shopping", channel: "both" },
      { id: "allensolly", name: "Allen Solly", category: "shopping", channel: "both" },
      { id: "peterengland", name: "Peter England", category: "shopping", channel: "both" },
      { id: "louisphilippe", name: "Louis Philippe", category: "shopping", channel: "both" },
      { id: "vanheusen", name: "Van Heusen", category: "shopping", channel: "both" },
    ],
  },
};

export const MAJOR_MERCHANTS = [
  // E-Commerce & Shopping
  { id: "amazon", name: "Amazon", category: "shopping", ecosystem: "amazon", aliases: ["amazon india", "amazon.in", "amazon prime"] },
  { id: "flipkart", name: "Flipkart", category: "shopping", ecosystem: "flipkart", aliases: ["flipkart.com", "fk"] },
  { id: "myntra", name: "Myntra", category: "shopping", ecosystem: "flipkart", aliases: ["myntra.com"] },
  { id: "ajio", name: "AJIO", category: "shopping", ecosystem: "reliance", aliases: ["ajio.com"] },
  { id: "nykaa", name: "Nykaa", category: "shopping", aliases: ["nykaa beauty", "nykaa man"] },
  { id: "tatacliq", name: "Tata CLiQ", category: "shopping", ecosystem: "tata", aliases: ["cliq", "tata cliq luxury"] },
  { id: "croma", name: "Croma", category: "shopping", ecosystem: "tata", aliases: ["croma electronics"] },
  { id: "reliancedigital", name: "Reliance Digital", category: "shopping", ecosystem: "reliance", aliases: ["resq"] },
  { id: "meesho", name: "Meesho", category: "shopping", aliases: [] },
  { id: "firstcry", name: "FirstCry", category: "shopping", aliases: [] },

  // Food & Dining
  { id: "swiggy", name: "Swiggy (Food Delivery & Dineout)", category: "dining", aliases: ["swiggy food", "dineout"] },
  { id: "zomato", name: "Zomato", category: "dining", aliases: ["zomato dining", "zomato gold", "district"] },
  { id: "eazydiner", name: "EazyDiner", category: "dining", aliases: ["eazydiner prime"] },
  { id: "offline_dining", name: "Restaurants, Cafes & Fine Dining", category: "dining", aliases: ["restaurants", "cafes", "food courts"] },

  // Groceries & Quick Commerce
  { id: "bigbasket", name: "BigBasket", category: "groceries", ecosystem: "tata", aliases: ["bb", "bbnow"] },
  { id: "blinkit", name: "Blinkit", category: "groceries", aliases: ["grofers"] },
  { id: "zepto", name: "Zepto", category: "groceries", aliases: ["zepto cafe"] },
  { id: "swiggy_instamart", name: "Swiggy Instamart", category: "groceries", aliases: ["instamart"] },
  { id: "dmart", name: "DMart & Supermarkets", category: "groceries", aliases: ["dmart ready", "avenue supermarts", "local supermarkets"] },
  { id: "smartbazaar", name: "Reliance Smart / Smart Bazaar", category: "groceries", ecosystem: "reliance", aliases: ["reliance fresh"] },

  // Travel & Transport
  { id: "airindia", name: "Air India & Air India Express", category: "travel", ecosystem: "tata", aliases: ["air india", "ai express"] },
  { id: "indigo", name: "IndiGo", category: "travel", aliases: ["goindigo"] },
  { id: "akasa", name: "Akasa Air", category: "travel", aliases: [] },
  { id: "makemytrip", name: "MakeMyTrip", category: "travel", aliases: ["mmt"] },
  { id: "cleartrip", name: "Cleartrip", category: "travel", ecosystem: "flipkart", aliases: [] },
  { id: "easemytrip", name: "EaseMyTrip", category: "travel", aliases: ["emt"] },
  { id: "irctc", name: "IRCTC Trains", category: "travel", aliases: ["railways", "trains"] },
  { id: "uber", name: "Uber", category: "travel", aliases: ["uber rides"] },
  { id: "ola", name: "Ola", category: "travel", aliases: ["ola cabs"] },
  { id: "tajhotels", name: "Taj, Vivanta & SeleQtions", category: "travel", ecosystem: "tata", aliases: ["ihcl", "taj"] },
  { id: "marriott", name: "Marriott International Hotels", category: "travel", aliases: ["marriott bonvoy", "westin", "sheraton", "jw marriott"] },

  // Fuel Networks
  { id: "iocl", name: "IndianOil (IOCL)", category: "fuel", aliases: ["indianoil", "iocl petrol"] },
  { id: "bpcl", name: "Bharat Petroleum (BPCL)", category: "fuel", aliases: ["bharat petroleum", "speed"] },
  { id: "hpcl", name: "Hindustan Petroleum (HPCL)", category: "fuel", aliases: ["hindustan petroleum", "power"] },
  { id: "shell", name: "Shell Fuel Stations", category: "fuel", aliases: ["shell v-power"] },

  // Utilities & Recurring Payments
  { id: "electricity", name: "Electricity Bills", category: "utilities", aliases: ["power bill", "bescom", "tneb", "mseb", "tatapower"] },
  { id: "mobile_broadband", name: "Mobile Recharge & Broadband", category: "utilities", aliases: ["airtel", "jio", "vi", "act", "tataplay"] },
  { id: "subscriptions", name: "OTT & Digital Subscriptions", category: "utilities", aliases: ["netflix", "amazon prime", "hotstar", "spotify", "youtube premium"] },
  { id: "insurance", name: "Insurance Premiums (Life & Health)", category: "utilities", aliases: ["lic", "hdfc ergo", "star health", "care"] },
  { id: "rent", name: "House Rent", category: "utilities", aliases: ["rental payment"] },
  { id: "education", name: "School / College Tuition Fees", category: "utilities", aliases: ["tuition", "school fee", "university"] },
];

// ==============================================================
// 2. CARD-SPECIFIC ACCELERATED MERCHANT RULES & CAPS
// ==============================================================

/**
 * Card-specific merchant rules.
 * Defines accelerated rate, point valuation, monthly cap, and note for specific merchants.
 * If a merchant is not explicitly defined for a card, the card's base category rate applies.
 */
export const CARD_MERCHANT_RULES = {
  // Amazon Pay ICICI
  "amazon-pay-icici": {
    merchants: {
      amazon: { rate: 5.0, cap: Infinity, note: "5% uncapped Amazon Pay Balance cashback for Prime members" },
      tatacliq: { rate: 1.0, cap: Infinity, note: "1% base cashback (Amazon Pay ICICI excluded from external festive sales)" },
      flipkart: { rate: 1.0, cap: Infinity, note: "1% base cashback (Amazon Pay ICICI excluded from external festive sales)" },
      myntra: { rate: 1.0, cap: Infinity, note: "1% base cashback" },
      ajio: { rate: 1.0, cap: Infinity, note: "1% base cashback" },
      swiggy: { rate: 2.0, cap: Infinity, note: "2% when paid via Amazon Pay partner checkout (1% direct)" },
      bigbasket: { rate: 2.0, cap: Infinity, note: "2% when paid via Amazon Pay partner checkout (1% direct)" },
      electricity: { rate: 2.0, cap: Infinity, note: "2% cashback when bill paid via Amazon Pay Recharge & Bill portal" },
      mobile_broadband: { rate: 2.0, cap: Infinity, note: "2% cashback when paid via Amazon Pay Recharge & Bill portal" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent payments excluded by ICICI)" },
      education: { rate: 0.0, cap: 0, note: "0% rewards (education excluded by ICICI)" },
      insurance: { rate: 1.0, cap: Infinity, note: "1% base cashback" },
    },
  },

  // Flipkart Axis Bank
  "flipkart-axis-bank": {
    merchants: {
      flipkart: { rate: 5.0, cap: Infinity, note: "5% unlimited direct statement cashback on Flipkart" },
      cleartrip: { rate: 5.0, cap: Infinity, note: "5% unlimited direct statement cashback on Cleartrip" },
      swiggy: { rate: 4.0, cap: Infinity, note: "4% unlimited cashback on Swiggy (preferred partner)" },
      uber: { rate: 4.0, cap: Infinity, note: "4% unlimited cashback on Uber rides (preferred partner)" },
      tata1mg: { rate: 4.0, cap: Infinity, note: "4% unlimited cashback on Tata 1mg" },
      amazon: { rate: 1.0, cap: Infinity, note: "1% general retail cashback" },
      myntra: { rate: 1.0, cap: Infinity, note: "1% general retail cashback" },
      zomato: { rate: 1.0, cap: Infinity, note: "1% general retail cashback" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rental payments excluded by Axis Bank)" },
      education: { rate: 0.0, cap: 0, note: "0% rewards (education excluded by Axis Bank)" },
      electricity: { rate: 0.0, cap: 0, note: "0% rewards (utility bills excluded by Axis Bank)" },
    },
  },

  // HDFC Tata Neu Infinity
  "hdfc-tata-neu-infinity": {
    merchants: {
      bigbasket: { rate: 10.0, capMonthlyCoins: 2000, note: "10% NeuCoins (5% card + 5% NeuPass) capped at 2,000 coins/mo" },
      croma: { rate: 10.0, cap: Infinity, note: "10% NeuCoins across Croma online and physical stores" },
      tatacliq: { rate: 10.0, cap: Infinity, note: "10% NeuCoins on Tata CLiQ and Tata CLiQ Luxury" },
      westside: { rate: 10.0, cap: Infinity, note: "10% NeuCoins on Westside apparel" },
      zudio: { rate: 5.0, cap: Infinity, note: "5% NeuCoins on Zudio offline store swipes" },
      titan: { rate: 10.0, cap: Infinity, note: "10% NeuCoins on Titan, Fastrack and Sonata" },
      tanishq: { rate: 1.5, cap: Infinity, note: "1.5% base NeuCoins on jewellery (Tanishq/Mia)" },
      tata1mg: { rate: 10.0, cap: Infinity, note: "10% NeuCoins on Tata 1mg health orders" },
      tajhotels: { rate: 10.0, cap: Infinity, note: "10% NeuCoins on Taj, Vivanta, SeleQtions & Ginger bookings via Tata Neu" },
      airindia: { rate: 10.0, cap: Infinity, note: "10% NeuCoins on Air India & AI Express flight bookings via Tata Neu" },
      starbucks: { rate: 5.0, cap: Infinity, note: "5% NeuCoins at Starbucks India" },
      amazon: { rate: 1.5, cap: Infinity, note: "1.5% base NeuCoins on non-Tata e-commerce" },
      flipkart: { rate: 1.5, cap: Infinity, note: "1.5% base NeuCoins on non-Tata e-commerce" },
      swiggy: { rate: 1.5, cap: Infinity, note: "1.5% base NeuCoins on non-Tata food delivery" },
      zomato: { rate: 1.5, cap: Infinity, note: "1.5% base NeuCoins on non-Tata food delivery" },
      dmart: { rate: 1.5, cap: Infinity, note: "1.5% base NeuCoins on non-Tata supermarkets" },
      electricity: { rate: 1.5, capMonthlyCoins: 2000, note: "1.5% NeuCoins when paid via Tata Neu App portal (capped at 2,000 coins/mo)" },
      mobile_broadband: { rate: 1.5, capMonthlyCoins: 2000, note: "1.5% NeuCoins via Tata Neu App" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent payments excluded by HDFC)" },
      education: { rate: 1.5, cap: Infinity, note: "1.5% NeuCoins (1% fee applies if paid via third-party apps)" },
    },
  },

  // HDFC Tata Neu Plus
  "hdfc-tata-neu-plus": {
    merchants: {
      bigbasket: { rate: 7.0, capMonthlyCoins: 1000, note: "7% NeuCoins (2% card + 5% NeuPass) capped at 1,000 coins/mo" },
      croma: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Croma purchases" },
      tatacliq: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Tata CLiQ" },
      westside: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Westside apparel" },
      zudio: { rate: 2.0, cap: Infinity, note: "2% NeuCoins on Zudio offline store swipes" },
      titan: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Titan products" },
      tata1mg: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Tata 1mg medicine orders" },
      tajhotels: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Taj & IHCL bookings via Tata Neu" },
      airindia: { rate: 7.0, cap: Infinity, note: "7% NeuCoins on Air India Express bookings via Tata Neu" },
      amazon: { rate: 1.0, cap: Infinity, note: "1% base NeuCoins on non-Tata e-commerce" },
      flipkart: { rate: 1.0, cap: Infinity, note: "1% base NeuCoins on non-Tata e-commerce" },
      electricity: { rate: 1.0, capMonthlyCoins: 2000, note: "1% NeuCoins on Tata Neu bill portal (capped at 2,000 coins/mo)" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent excluded by HDFC)" },
    },
  },

  // HDFC Swiggy Card (Black)
  "hdfc-swiggy-blck": {
    merchants: {
      swiggy: { rate: 10.0, capMonthlyCashback: 1500, note: "10% statement cashback on Swiggy Food, Instamart & Dineout (capped at ₹1,500/mo)" },
      swiggy_instamart: { rate: 10.0, capMonthlyCashback: 1500, note: "10% statement cashback on Swiggy Instamart (shared ₹1,500/mo Swiggy cap)" },
      amazon: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Amazon online retail (capped at ₹1,500/mo across select online merchants)" },
      flipkart: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Flipkart (shared ₹1,500/mo select online cap)" },
      myntra: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Myntra (shared ₹1,500/mo select online cap)" },
      ajio: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Ajio (shared ₹1,500/mo select online cap)" },
      nykaa: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Nykaa (shared ₹1,500/mo select online cap)" },
      uber: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Uber rides (shared ₹1,500/mo select online cap)" },
      ola: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Ola cabs (shared ₹1,500/mo select online cap)" },
      cleartrip: { rate: 5.0, capMonthlyCashback: 1500, note: "5% cashback on Cleartrip (shared ₹1,500/mo select online cap)" },
      zomato: { rate: 1.0, cap: Infinity, note: "1% other retail cashback (competing food delivery)" },
      blinkit: { rate: 1.0, cap: Infinity, note: "1% other retail cashback" },
      zepto: { rate: 1.0, cap: Infinity, note: "1% other retail cashback" },
      bigbasket: { rate: 1.0, cap: Infinity, note: "1% other retail cashback" },
      dmart: { rate: 1.0, cap: Infinity, note: "1% offline supermarket cashback" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent excluded by HDFC)" },
      education: { rate: 0.0, cap: 0, note: "0% rewards (education excluded)" },
    },
  },

  // HDFC Swiggy Card (Orange)
  "hdfc-swiggy-orgne": {
    merchants: {
      swiggy: { rate: 5.0, capMonthlyCashback: 1000, note: "5% cashback on Swiggy Food, Instamart & Dineout (capped at ₹1,000/mo)" },
      swiggy_instamart: { rate: 5.0, capMonthlyCashback: 1000, note: "5% cashback on Swiggy Instamart" },
      amazon: { rate: 5.0, capMonthlyCashback: 1000, note: "5% cashback on Amazon online retail (min order ₹249)" },
      flipkart: { rate: 5.0, capMonthlyCashback: 1000, note: "5% cashback on Flipkart (min order ₹249)" },
      myntra: { rate: 5.0, capMonthlyCashback: 1000, note: "5% cashback on Myntra (min order ₹249)" },
      uber: { rate: 5.0, capMonthlyCashback: 1000, note: "5% cashback on Uber (min order ₹249)" },
      zomato: { rate: 1.0, cap: Infinity, note: "1% other retail cashback" },
    },
  },

  // HDFC Millennia
  "hdfc-millennia": {
    merchants: {
      amazon: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Amazon (capped at 1,000 pts/mo across 10 partner apps)" },
      flipkart: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Flipkart (shared 1,000 pts/mo cap)" },
      swiggy: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Swiggy (shared 1,000 pts/mo cap)" },
      zomato: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Zomato (shared 1,000 pts/mo cap)" },
      myntra: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Myntra (shared 1,000 pts/mo cap)" },
      tatacliq: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Tata CLiQ (shared 1,000 pts/mo cap)" },
      uber: { rate: 5.0, capMonthlyCashPoints: 1000, note: "5% CashPoints on Uber (shared 1,000 pts/mo cap)" },
      croma: { rate: 1.0, cap: Infinity, note: "1% other retail CashPoints" },
      bigbasket: { rate: 1.0, cap: Infinity, note: "1% other retail CashPoints" },
      blinkit: { rate: 1.0, cap: Infinity, note: "1% other retail CashPoints" },
      dmart: { rate: 1.0, cap: Infinity, note: "1% offline supermarket CashPoints" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent excluded)" },
    },
  },

  // SBI Cashback
  "sbi-cashback": {
    merchants: {
      amazon: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online retail (capped at ₹2,000/mo since 2026 revision)" },
      flipkart: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online retail (shared ₹2,000/mo cap)" },
      myntra: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online apparel" },
      ajio: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online apparel" },
      nykaa: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online beauty" },
      tatacliq: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online retail" },
      swiggy: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on food delivery" },
      zomato: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on food delivery" },
      blinkit: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on quick commerce" },
      zepto: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on quick commerce" },
      bigbasket: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online groceries" },
      makemytrip: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on online travel" },
      uber: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on rideshare" },
      ola: { rate: 5.0, capMonthlyCashback: 2000, note: "5% statement cashback on rideshare" },
      dmart: { rate: 1.0, cap: Infinity, note: "1% offline supermarket POS cashback" },
      offline_dining: { rate: 1.0, cap: Infinity, note: "1% physical POS restaurant cashback" },
      fuel: { rate: 0.0, cap: 0, note: "0% rewards (fuel excluded)" },
      electricity: { rate: 0.0, cap: 0, note: "0% rewards (utility bills excluded by SBI Card)" },
      mobile_broadband: { rate: 0.0, cap: 0, note: "0% rewards (telecom bills excluded by SBI Card)" },
      insurance: { rate: 0.0, cap: 0, note: "0% rewards (insurance premiums excluded by SBI Card)" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent payments excluded by SBI Card)" },
      education: { rate: 0.0, cap: 0, note: "0% rewards (school/college tuition excluded by SBI Card)" },
    },
  },

  // HSBC Live+
  "hsbc-live-plus": {
    merchants: {
      swiggy: { rate: 10.0, capMonthlyCashback: 1000, note: "10% dining & delivery cashback (capped at ₹1,000/mo across dining, groceries & food apps)" },
      zomato: { rate: 10.0, capMonthlyCashback: 1000, note: "10% dining & delivery cashback (shared ₹1,000/mo cap)" },
      swiggy_instamart: { rate: 10.0, capMonthlyCashback: 1000, note: "10% grocery & quick commerce cashback (shared ₹1,000/mo cap)" },
      blinkit: { rate: 10.0, capMonthlyCashback: 1000, note: "10% quick commerce cashback (shared ₹1,000/mo cap)" },
      zepto: { rate: 10.0, capMonthlyCashback: 1000, note: "10% quick commerce cashback (shared ₹1,000/mo cap)" },
      bigbasket: { rate: 10.0, capMonthlyCashback: 1000, note: "10% grocery cashback (shared ₹1,000/mo cap)" },
      dmart: { rate: 10.0, capMonthlyCashback: 1000, note: "10% supermarket & hypermarket cashback (shared ₹1,000/mo cap)" },
      smartbazaar: { rate: 10.0, capMonthlyCashback: 1000, note: "10% supermarket cashback (shared ₹1,000/mo cap)" },
      offline_dining: { rate: 10.0, capMonthlyCashback: 1000, note: "10% restaurant, cafe & pub POS cashback (shared ₹1,000/mo cap)" },
      amazon: { rate: 1.5, cap: Infinity, note: "1.5% unlimited cashback on other retail" },
      flipkart: { rate: 1.5, cap: Infinity, note: "1.5% unlimited cashback on other retail" },
      rent: { rate: 0.0, cap: 0, note: "0% rewards (rent excluded)" },
      fuel: { rate: 0.0, cap: 0, note: "0% rewards (surcharge waiver only)" },
    },
  },

  // RBL IndianOil XTRA
  "rbl-indianoil-xtra": {
    merchants: {
      iocl: { rate: 8.5, capMonthlyPoints: 1000, note: "8.5% fuel value (7.5% fuel points + 1% surcharge waiver) at IOCL pumps (capped at 1,000 pts = ₹500/mo)" },
      bpcl: { rate: 0.0, cap: 0, note: "0% rewards at competing BPCL pumps" },
      hpcl: { rate: 0.0, cap: 0, note: "0% rewards at competing HPCL pumps" },
      shell: { rate: 0.0, cap: 0, note: "0% rewards at competing Shell pumps" },
      groceries: { rate: 1.0, cap: Infinity, note: "1% general grocery rewards (2 pts/₹100)" },
      dining: { rate: 1.0, cap: Infinity, note: "1% general dining rewards" },
    },
  },

  // SBI BPCL Octane
  "sbi-bpcl-octane": {
    merchants: {
      bpcl: { rate: 7.25, capMonthlyPoints: 2500, note: "7.25% fuel return (25 pts/₹100 = 6.25% + 1% surcharge waiver) at BPCL pumps (capped at 2,500 pts = ₹625/mo)" },
      iocl: { rate: 0.0, cap: 0, note: "0% rewards at competing IOCL pumps" },
      hpcl: { rate: 0.0, cap: 0, note: "0% rewards at competing HPCL pumps" },
      shell: { rate: 0.0, cap: 0, note: "0% rewards at competing Shell pumps" },
      dmart: { rate: 2.5, cap: Infinity, note: "2.5% rewards (10 pts/₹100) on grocery & department stores" },
      dining: { rate: 2.5, cap: Infinity, note: "2.5% rewards (10 pts/₹100) on dining & restaurants" },
    },
  },

  // IDFC FIRST Power+
  "idfc-first-power-plus": {
    merchants: {
      hpcl: { rate: 6.5, capMonthlySpend: 10000, note: "6.5% return (5% reward pts + 1.5% HP Pay app coins) at HPCL fuel stations (capped on ₹10,000 spend/mo)" },
      iocl: { rate: 0.0, cap: 0, note: "0% rewards at competing IOCL pumps" },
      bpcl: { rate: 0.0, cap: 0, note: "0% rewards at competing BPCL pumps" },
      electricity: { rate: 5.0, capMonthlySpend: 2000, note: "5% return on utility bill payments (capped on ₹2,000 spend/mo)" },
      groceries: { rate: 5.0, capMonthlySpend: 2000, note: "5% return on grocery spends (capped on ₹2,000 spend/mo)" },
    },
  },

  // IndusInd EazyDiner
  "indusind-eazydiner": {
    merchants: {
      eazydiner: { rate: 25.0, cap: Infinity, note: "Guaranteed 25% to 50% discount on table reservations + 10 EazyPoints/₹100 via PayEazy" },
      swiggy: { rate: 3.0, cap: Infinity, note: "3% reward points on food delivery" },
      zomato: { rate: 3.0, cap: Infinity, note: "3% reward points on food delivery" },
      offline_dining: { rate: 5.0, cap: Infinity, note: "5% reward points on standalone restaurant dining bills" },
      shopping: { rate: 1.0, cap: Infinity, note: "1% on general shopping" },
    },
  },

  // HDFC Marriott Bonvoy
  "hdfc-marriott-bonvoy": {
    merchants: {
      marriott: { rate: 5.33, cap: Infinity, note: "8 Marriott Bonvoy Points per ₹150 spend at participating Marriott hotels (~5.3% travel value)" },
      makemytrip: { rate: 2.67, cap: Infinity, note: "4 Marriott Bonvoy Points per ₹150 on airline and travel bookings (~2.6% value)" },
      offline_dining: { rate: 2.67, cap: Infinity, note: "4 Marriott Bonvoy Points per ₹150 on dining & restaurants (~2.6% value)" },
      general: { rate: 1.33, cap: Infinity, note: "2 Marriott Bonvoy Points per ₹150 on all other retail (~1.3% value)" },
    },
  },

  // BOBCARD Scapia
  "bobcard-scapia": {
    merchants: {
      makemytrip: { rate: 4.0, cap: Infinity, note: "20 Scapia Coins per ₹100 on travel bookings via Scapia App (4% travel credit)" },
      cleartrip: { rate: 4.0, cap: Infinity, note: "20 Scapia Coins per ₹100 via Scapia travel portal" },
      airindia: { rate: 4.0, cap: Infinity, note: "20 Scapia Coins per ₹100 via Scapia travel portal" },
      indigo: { rate: 4.0, cap: Infinity, note: "20 Scapia Coins per ₹100 via Scapia travel portal" },
      international_travel: { rate: 3.5, cap: Infinity, note: "Zero Forex Markup: Saves 3.5% + GST compared to standard bank cards" },
      general: { rate: 2.0, cap: Infinity, note: "10 Scapia Coins per ₹100 on general retail spends (2% travel redemption)" },
    },
  },

  // Kiwi YES Bank
  "kiwi-yes-bank": {
    merchants: {
      upi_scan_pay: { rate: 1.5, capMonthlyPoints: 1000, note: "1.5% cashback (6 Kiwis/₹100) on merchant UPI Scan & Pay in Kiwi App" },
      offline_dining: { rate: 1.5, capMonthlyPoints: 1000, note: "1.5% cashback via merchant UPI QR code" },
      dmart: { rate: 1.5, capMonthlyPoints: 1000, note: "1.5% cashback via merchant UPI QR code" },
      amazon: { rate: 0.5, cap: Infinity, note: "0.5% base reward on online or non-Kiwi UPI" },
      flipkart: { rate: 0.5, cap: Infinity, note: "0.5% base reward on online or non-Kiwi UPI" },
    },
  },
};

/**
 * Resolve a merchant ID or search string to its canonical merchant definition.
 */
export function resolveMerchant(query) {
  if (!query || typeof query !== "string") return null;
  const q = query.trim().toLowerCase();

  // Direct ID match
  const direct = MAJOR_MERCHANTS.find((m) => m.id === q);
  if (direct) return direct;

  // Exact name match
  const nameMatch = MAJOR_MERCHANTS.find((m) => m.name.toLowerCase() === q);
  if (nameMatch) return nameMatch;

  // Alias match
  const aliasMatch = MAJOR_MERCHANTS.find((m) => m.aliases && m.aliases.some((a) => a === q || q.includes(a)));
  if (aliasMatch) return aliasMatch;

  // Partial match
  const partial = MAJOR_MERCHANTS.find((m) => m.id.includes(q) || m.name.toLowerCase().includes(q));
  return partial || null;
}

/**
 * Get the verified reward rate and cap for a specific card and merchant.
 *
 * @param {string} cardSlug - e.g. "amazon-pay-icici", "hdfc-tata-neu-infinity"
 * @param {string} merchantId - e.g. "amazon", "bigbasket", "swiggy", "dmart"
 * @param {string} fallbackCategory - e.g. "shopping", "groceries", "dining"
 * @param {object} baseCardRules - Standard category rules from CARD_RULES
 * @returns {object} { rate, cap, isAccelerated, note }
 */
export function getMerchantRewardRule(cardSlug, merchantId, fallbackCategory, baseCardRules) {
  const cardSpecific = CARD_MERCHANT_RULES[cardSlug];
  const merchantRule = cardSpecific?.merchants?.[merchantId];

  if (merchantRule) {
    return {
      rate: merchantRule.rate,
      cap: merchantRule.cap ?? merchantRule.capMonthlyCashback ?? merchantRule.capMonthlyCoins ?? merchantRule.capMonthlyPoints ?? Infinity,
      capPeriod: "monthly",
      isAccelerated: merchantRule.rate > (baseCardRules?.rates?.other || 1.0),
      note: merchantRule.note || "",
      isDirectPartner: true,
    };
  }

  // Fall back to general category rate
  const categoryRate = baseCardRules?.rates?.[fallbackCategory] ?? (fallbackCategory === "fuel" ? 0.0 : 1.0);
  return {
    rate: categoryRate,
    cap: Infinity,
    capPeriod: "monthly",
    isAccelerated: false,
    note: `Base category rate (${categoryRate}%) for ${fallbackCategory}`,
    isDirectPartner: false,
  };
}

