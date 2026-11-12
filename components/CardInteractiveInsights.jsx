"use client";

import { useState, useId } from "react";
import {
  Sparkles,
  Plane,
  Building,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Calculator,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gift,
  Coins,
  CreditCard,
  Scale,
} from "lucide-react";
import { getActiveGuestProfile } from "../lib/profileStorage";

/**
 * Verified Program Redemption Ratios & Transfer Partners
 */
const PROGRAM_REDEMPTIONS = {
  "hdfc-infinia": {
    programName: "HDFC SmartBuy & 1:1 Partner Mileage",
    pointName: "Infinia Reward Points",
    methods: [
      { name: "SmartBuy Flights & Hotels", valuePerPt: 1.0, note: "1 RP = ₹1.00 (Max 70% of booking via points)" },
      { name: "Accor Live Limitless (ALL)", valuePerPt: 1.85, note: "1:1 transfer ratio (2,000 pts = €40 ≈ ₹3,700 value)" },
      { name: "Airline Transfers (Singapore, BA, Club Vistara)", valuePerPt: 1.0, note: "1:1 airline mile conversion" },
      { name: "Apple & Tanishq Vouchers", valuePerPt: 1.0, note: "1 RP = ₹1.00 on SmartBuy portal" },
      { name: "Statement Cash Credit", valuePerPt: 0.3, note: "1 RP = ₹0.30 (Avoid this: loses 70% value)" },
    ],
    defaultPoints: 20000,
    minRedeem: 2500,
    expiry: "3 years from accrual date",
    overlookTitle: "The 70/30 SmartBuy Rule",
    overlookDesc: "On SmartBuy, you can pay a maximum of 70% of flight/hotel bookings with points. The remaining 30% must be paid with your card, which kicks back 5X or 10X bonus points.",
    regretWarning: "Never redeem Infinia points for statement cashback — it collapses point value from ₹1.00 down to ₹0.30.",
  },
  "hdfc-diners-club-metal": {
    programName: "HDFC SmartBuy Diners Rewards",
    pointName: "Diners Reward Points",
    methods: [
      { name: "SmartBuy Flights & Hotels", valuePerPt: 1.0, note: "1 RP = ₹1.00 (Max 70% of booking via points)" },
      { name: "Accor Live Limitless (ALL)", valuePerPt: 1.85, note: "1:1 transfer ratio to hotel points" },
      { name: "Airline Transfers (Singapore, BA)", valuePerPt: 1.0, note: "1:1 air mile transfers" },
      { name: "Statement Cash Credit", valuePerPt: 0.3, note: "1 RP = ₹0.30 (devalued by 70%)" },
    ],
    defaultPoints: 15000,
    minRedeem: 2500,
    expiry: "3 years from accrual",
    overlookTitle: "Merchant Network Diners Acceptance",
    overlookDesc: "While online acceptance is ~99%, smaller offline POS terminals in tier-2 cities may not process Diners Club cards. Keep a backup RuPay or Visa card handy.",
    regretWarning: "Points expire after 3 years. Plan an annual hotel or flight redemption to prevent expiration.",
  },
  "axis-horizon": {
    programName: "Axis EDGE Miles Programme",
    pointName: "EDGE Miles",
    methods: [
      { name: "Airline Transfers (1:1 Group A: Accor, ITC, Singapore, Qatar)", valuePerPt: 1.0, note: "1 EDGE Mile = 1 Partner Mile" },
      { name: "Domestic Flights on Travel EDGE", valuePerPt: 1.0, note: "1 EDGE Mile = ₹1.00 on Axis Travel portal" },
      { name: "Hotel Bookings on Travel EDGE", valuePerPt: 1.0, note: "1 EDGE Mile = ₹1.00" },
      { name: "Statement Cashback", valuePerPt: 0.2, note: "1 EDGE Mile = ₹0.20 (poor value)" },
    ],
    defaultPoints: 10000,
    minRedeem: 500,
    expiry: "3 years from accrual date",
    overlookTitle: "Group A vs Group B Transfer Partners",
    overlookDesc: "EDGE Miles transfer 1:1 to premium partners (Accor, Singapore Airlines, Qatar Airways) with no conversion tax deduction.",
    regretWarning: "Converting EDGE Miles to catalog gift cards drops their real-world value by 60%–80%.",
  },
  "amex-mrcc": {
    programName: "Membership Rewards 18K/24K Gold Collection",
    pointName: "MR Points",
    methods: [
      { name: "24 Karat Gold Collection (Taj / Tanishq / Amazon ₹10k voucher)", valuePerPt: 0.42, note: "24,000 MR Points = ₹10,000 voucher" },
      { name: "18 Karat Gold Collection (₹8,000 Shoppers Stop/Taj voucher)", valuePerPt: 0.44, note: "18,000 MR Points = ₹8,000 voucher" },
      { name: "Marriott Bonvoy Transfers (1:1 during promo months)", valuePerPt: 0.65, note: "1 MR = 1 Marriott Bonvoy Point (~₹0.65 value)" },
      { name: "Statement Credit", valuePerPt: 0.25, note: "1 MR = ₹0.25 statement credit" },
    ],
    defaultPoints: 24000,
    minRedeem: 1000,
    expiry: "Points never expire as long as account is in good standing",
    overlookTitle: "The 4x ₹1,500 Monthly Transaction Habit",
    overlookDesc: "Swiping 4 times a month for ₹1,500+ unlocks 1,000 bonus MR points. Spending ₹20,000 in a calendar month unlocks an additional 1,000 points (2,000 bonus points/mo total).",
    regretWarning: "Never redeem MR points against your monthly bill at ₹0.25 per point when Gold Collection vouchers yield nearly double the value.",
  },
  "amazon-pay-icici": {
    programName: "Amazon Pay Direct Balance Credit",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Amazon Pay Balance Auto-Credit", valuePerPt: 1.0, note: "100% pure cash balance (1 Pt = ₹1.00)" },
    ],
    defaultPoints: 5000,
    minRedeem: 1,
    expiry: "Never expires",
    overlookTitle: "Automatic Monthly Balance Top-up",
    overlookDesc: "You never need to manually redeem or remember to transfer points. Cashback is credited automatically to your Amazon Pay wallet within 2 working days of your statement generation.",
    regretWarning: "Transactions converted into EMI or wallet loads earn 0% cashback.",
  },
  "sbi-cashback": {
    programName: "SBI Statement Cashback",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Direct Statement Credit", valuePerPt: 1.0, note: "Direct cash auto-credited against your statement" },
    ],
    defaultPoints: 2000,
    minRedeem: 1,
    expiry: "Never expires (credited monthly)",
    overlookTitle: "Strict ₹2,000 Monthly Cashback Cap",
    overlookDesc: "Online 5% cashback is capped at exactly ₹2,000 per statement cycle (reached at ₹40,000 spend). Spend beyond ₹40,000 earns 0% for the rest of that billing cycle.",
    regretWarning: "Utility bill payments, school tuition fees, insurance premiums, and jewelry purchases earn 0% cashback.",
  },
  "hdfc-tata-neu-infinity": {
    programName: "Tata Neu Ecosystem (NeuCoins)",
    pointName: "NeuCoins",
    methods: [
      { name: "Tata Neu App (BigBasket, Croma, 1mg, Air India Express)", valuePerPt: 1.0, note: "1 NeuCoin = ₹1.00 at checkout" },
      { name: "Taj & IHCL Hotel Bookings", valuePerPt: 1.0, note: "1 NeuCoin = ₹1.00 towards room tariff" },
      { name: "Air India Express Flight Tickets", valuePerPt: 1.0, note: "1 NeuCoin = ₹1.00 towards base fare & taxes" },
    ],
    defaultPoints: 10000,
    minRedeem: 1,
    expiry: "365 days from date of issuance",
    overlookTitle: "The NeuPass Extra 5% Rule",
    overlookDesc: "The 10% rate is split: 5% card cashback + 5% NeuPass member badge reward. Make sure you order inside the Tata Neu app with your registered mobile number.",
    regretWarning: "NeuCoins expire after 365 days. Make sure to burn them periodically on grocery orders at BigBasket or medical bills on 1mg.",
  },
  "hdfc-tata-neu-plus": {
    programName: "Tata Neu Ecosystem (NeuCoins)",
    pointName: "NeuCoins",
    methods: [
      { name: "Tata Neu App (BigBasket, Croma, 1mg)", valuePerPt: 1.0, note: "1 NeuCoin = ₹1.00 at checkout" },
      { name: "Taj & IHCL Hotel Bookings", valuePerPt: 1.0, note: "1 NeuCoin = ₹1.00 towards room tariff" },
    ],
    defaultPoints: 5000,
    minRedeem: 1,
    expiry: "365 days from date of issuance",
    overlookTitle: "RuPay UPI NeuCoins Earning",
    overlookDesc: "When linked on Tata Neu UPI, merchant UPI QR payments earn 1% NeuCoins, capped at 500 NeuCoins per calendar month.",
    regretWarning: "NeuCoins cannot be converted to bank cash or statement balance; they must be spent across Tata Group brand checkouts.",
  },
  "axis-magnus": {
    programName: "Axis EDGE Rewards Programme",
    pointName: "EDGE Reward Points",
    methods: [
      { name: "Partner Airlines & Hotels (5:2 ratio to Accor, Singapore, Qatar)", valuePerPt: 0.40, note: "5 EDGE RP = 2 Partner Miles (Accor value up to ₹0.74)" },
      { name: "Travel EDGE Portal Flights & Hotels", valuePerPt: 0.20, note: "1 EDGE RP = ₹0.20 on portal bookings" },
      { name: "Statement Cash Credit", valuePerPt: 0.20, note: "1 EDGE RP = ₹0.20 (poor value)" },
    ],
    defaultPoints: 25000,
    minRedeem: 500,
    expiry: "3 years from accrual date",
    overlookTitle: "Partner Transfer Ratio Structure",
    overlookDesc: "Post-2023 revision, the transfer ratio is 5:2 (5 EDGE RP = 2 Partner Miles) for standard Magnus, down from historic 5:4. (Burgundy Magnus retains 5:4).",
    regretWarning: "Never redeem for statement credit or catalog products; converting to airline/hotel partners yields 2x to 4x higher value.",
  },
  "bob-eterna": {
    programName: "BOBCARD Rewards",
    pointName: "Reward Points",
    methods: [
      { name: "Statement Cashback Credit", valuePerPt: 0.25, note: "1 RP = ₹0.25 direct statement credit" },
      { name: "Flight & Hotel Bookings on BOBCARD Portal", valuePerPt: 0.25, note: "1 RP = ₹0.25 on travel" },
      { name: "Shopping Gift Vouchers", valuePerPt: 0.25, note: "1 RP = ₹0.25 on partner vouchers" },
    ],
    defaultPoints: 10000,
    minRedeem: 1000,
    expiry: "3 years from accrual",
    overlookTitle: "Accelerated Spends Monthly Cap",
    overlookDesc: "The 3.75% reward rate (15 RP per ₹100) on travel, dining, and online shopping is capped at 5,000 bonus points per month (reached at ₹33,333 spend).",
    regretWarning: "Transactions on fuel, rent, and education do not earn reward points.",
  },
  "bob-ethiad": {
    programName: "Etihad Guest Frequent Flyer Programme",
    pointName: "Etihad Guest Miles",
    methods: [
      { name: "Etihad Flight Redemptions (Reward Flights)", valuePerPt: 0.90, note: "1 Mile = ~₹0.90 to ₹1.20 on award flight bookings" },
      { name: "Cabin Upgrades (Economy to Business)", valuePerPt: 1.00, note: "1 Mile = ~₹1.00 on long-haul upgrades" },
      { name: "Etihad RewardShop Merchandise", valuePerPt: 0.40, note: "1 Mile = ₹0.40 (sub-optimal value)" },
    ],
    defaultPoints: 15000,
    minRedeem: 5000,
    expiry: "18 months of account inactivity",
    overlookTitle: "Etihad Guest Activity Rule",
    overlookDesc: "Etihad Guest miles do not expire as long as you earn or redeem miles at least once every 18 months. Regular card spend keeps them alive indefinitely.",
    regretWarning: "Redeeming miles for merchandise or gift cards in the RewardShop provides less than half the value of flight bookings.",
  },
  "flipkart-axis-bank": {
    programName: "Direct Statement Cashback",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Direct Statement Credit", valuePerPt: 1.0, note: "Automatically credited against card statement before next billing cycle" },
    ],
    defaultPoints: 2000,
    minRedeem: 1,
    expiry: "Never expires (credited monthly)",
    overlookTitle: "Preferred Partner vs General Rates",
    overlookDesc: "Flipkart 5% is uncapped, but preferred partner cashback (Cleartrip, Cult.fit, PVR, Uber, Swiggy) is 4%. General retail spend earns 1.5%.",
    regretWarning: "Government payments, utilities, fuel, gift card purchases on Flipkart, and rent are completely excluded from cashback.",
  },
  "hdfc-biz-black": {
    programName: "HDFC SmartBuy Business Rewards",
    pointName: "Biz Reward Points",
    methods: [
      { name: "SmartBuy Flight & Hotel Bookings", valuePerPt: 1.00, note: "1 RP = ₹1.00 on SmartBuy portal" },
      { name: "Airline Transfers (Singapore, Avios, Club Vistara)", valuePerPt: 1.00, note: "1:1 airline mileage transfer" },
      { name: "Hotel Partner Transfers (Accor ALL)", valuePerPt: 1.85, note: "1:1 transfer ratio (~₹1.85 value)" },
      { name: "Statement Cash Credit", valuePerPt: 0.30, note: "1 RP = ₹0.30 (avoid this: loses 70% value)" },
    ],
    defaultPoints: 20000,
    minRedeem: 2500,
    expiry: "3 years from accrual",
    overlookTitle: "Business Spends & Tax Payments Acceleration",
    overlookDesc: "Features 5X Reward Points on business spends including income tax, GST, and vendor payments via official portals up to 7,500 bonus points per month.",
    regretWarning: "Cash credit redemption reduces point value by 70% from ₹1.00 to ₹0.30.",
  },
  "hdfc-diners-club-privilege": {
    programName: "HDFC SmartBuy Diners Rewards",
    pointName: "Diners Reward Points",
    methods: [
      { name: "SmartBuy Flights & Hotels", valuePerPt: 0.50, note: "1 RP = ₹0.50 on SmartBuy portal" },
      { name: "Partner Air Miles (1:1 with 0.5 value)", valuePerPt: 0.50, note: "1 RP = 0.50 air mile value" },
      { name: "Statement Cash Credit", valuePerPt: 0.20, note: "1 RP = ₹0.20 (poor value)" },
    ],
    defaultPoints: 5000,
    minRedeem: 2000,
    expiry: "2 years from accrual",
    overlookTitle: "Spend Milestone & Lounge Conditions",
    overlookDesc: "Includes 2 complimentary lounge visits per calendar quarter, with additional complimentary visits linked to quarterly spend milestones of ₹1.5 Lakhs.",
    regretWarning: "Never redeem for statement credit where point value drops from ₹0.50 to ₹0.20.",
  },
  "hdfc-marriott-bonvoy": {
    programName: "Marriott Bonvoy Programme",
    pointName: "Marriott Bonvoy Points",
    methods: [
      { name: "Marriott Hotel Free Nights (Category 1–8 hotels)", valuePerPt: 0.65, note: "1 Bonvoy Point = ~₹0.65 to ₹0.85 on room redemptions" },
      { name: "Airline Transfers (3:1 ratio with 5k bonus on 60k pts)", valuePerPt: 0.40, note: "3 Bonvoy Points = 1 Airline Mile (40+ airlines)" },
    ],
    defaultPoints: 15000,
    minRedeem: 5000,
    expiry: "24 months of account inactivity",
    overlookTitle: "The Annual Free Night Award (FNA) Cap",
    overlookDesc: "The 1 Free Night Award credited annually upon fee payment is valid for stays up to 15,000 Bonvoy points. You can top up with up to 15,000 points from your account to book rooms up to 30,000 points.",
    regretWarning: "The annual Free Night Award certificate expires strictly after 12 months and cannot be extended.",
  },
  "hdfc-millennia": {
    programName: "HDFC CashPoints",
    pointName: "CashPoints",
    methods: [
      { name: "Direct Statement Credit", valuePerPt: 1.00, note: "1 CashPoint = ₹1.00 direct statement cashback (optimal)" },
      { name: "Flight & Hotel Bookings on SmartBuy", valuePerPt: 0.30, note: "1 CashPoint = ₹0.30 on travel (devalued)" },
      { name: "Product Catalog & Vouchers", valuePerPt: 0.25, note: "1 CashPoint = ₹0.25 on gift cards" },
    ],
    defaultPoints: 5000,
    minRedeem: 500,
    expiry: "1 year from accrual date",
    overlookTitle: "Statement Credit Is the ONLY Optimal Redemption",
    overlookDesc: "Unlike Infinia or Regalia, Millennia CashPoints give maximum value (₹1.00) ONLY when redeemed for statement cashback! Redeeming for flights/hotels on SmartBuy reduces value to ₹0.30.",
    regretWarning: "CashPoints expire after 1 year. Log into NetBanking every few months to redeem them to statement credit.",
  },
  "hdfc-regalia-gold": {
    programName: "HDFC SmartBuy Gold Rewards",
    pointName: "Regalia Gold Reward Points",
    methods: [
      { name: "Flights & Hotels on SmartBuy Gold Portal", valuePerPt: 0.50, note: "1 RP = ₹0.50 on dedicated Gold portal" },
      { name: "Airline Transfers (Singapore, Avios)", valuePerPt: 0.50, note: "1 RP = 0.5 air miles (~₹0.50 value)" },
      { name: "Product Catalog & Brand Vouchers", valuePerPt: 0.35, note: "1 RP = ₹0.35 on shopping vouchers" },
      { name: "Statement Cash Credit", valuePerPt: 0.20, note: "1 RP = ₹0.20 (poor value)" },
    ],
    defaultPoints: 10000,
    minRedeem: 2500,
    expiry: "2 years from accrual",
    overlookTitle: "SmartBuy Gold Portal Exclusive Pricing",
    overlookDesc: "The dedicated SmartBuy Gold portal offers 5X points on Marks & Spencer, Nykaa, Reliance Digital, and Myntra, plus 0.50 value on travel redemptions.",
    regretWarning: "Statement credit devalues points by 60% (from ₹0.50 to ₹0.20).",
  },
  "hdfc-swiggy-blck": {
    programName: "Direct Cashback (Swiggy / Statement)",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Swiggy Order Cashback / Statement Credit", valuePerPt: 1.00, note: "Direct cash value credited against bill" },
    ],
    defaultPoints: 1500,
    minRedeem: 1,
    expiry: "Never expires (credited monthly)",
    overlookTitle: "Separate ₹1,500 Monthly Platform Cap",
    overlookDesc: "10% cashback on Swiggy (Food, Instamart, Dineout, Genie) is capped at ₹1,500 per billing cycle (reached at ₹15,000 monthly spend). 5% on 1,000+ top online platforms has a separate ₹1,500/mo cap.",
    regretWarning: "Swiggy transactions paid via third-party digital wallets (Paytm, Mobikwik) or external UPI apps do not trigger the 10% partner cashback.",
  },
  "hdfc-swiggy-orgne": {
    programName: "Direct Cashback",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Swiggy Order Cashback / Statement Credit", valuePerPt: 1.00, note: "Direct cash value credited against bill" },
    ],
    defaultPoints: 1000,
    minRedeem: 1,
    expiry: "Never expires (credited monthly)",
    overlookTitle: "₹750 Monthly Category Cap",
    overlookDesc: "5% cashback on Swiggy food delivery and grocery orders is capped at ₹750 per billing cycle. 2.5% on partner shopping capped at ₹500/mo.",
    regretWarning: "In-restaurant Dineout payments earn 2.5% instead of the primary 5% delivery rate.",
  },
  "hsbc-live-plus": {
    programName: "Direct Statement Cashback",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Direct Statement Credit", valuePerPt: 1.00, note: "Automatically adjusted in monthly statement" },
    ],
    defaultPoints: 2000,
    minRedeem: 1,
    expiry: "Never expires (credited monthly)",
    overlookTitle: "Combined ₹1,000/mo Accelerated Food Cap",
    overlookDesc: "The 10% cashback on dining, food delivery, and groceries is subject to a combined cap of ₹1,000 per billing cycle (reached at ₹10,000 monthly spend across food categories).",
    regretWarning: "Once the ₹1,000 accelerated cap is reached, additional dining and grocery spending drops to the 1.5% base rate.",
  },
  "hsbc-premier": {
    programName: "HSBC Premier Rewards",
    pointName: "Premier Reward Points",
    methods: [
      { name: "Air Mile Transfers (Singapore, British Airways, Cathay)", valuePerPt: 1.00, note: "1 RP = 1 Airline Mile" },
      { name: "Hotel Partner Transfers (Accor ALL)", valuePerPt: 1.85, note: "1:1 transfer ratio (~₹1.85 value)" },
      { name: "Travel Bookings", valuePerPt: 0.50, note: "1 RP = ₹0.50 on portal bookings" },
      { name: "Statement Cash Credit", valuePerPt: 0.25, note: "1 RP = ₹0.25 statement credit" },
    ],
    defaultPoints: 15000,
    minRedeem: 1000,
    expiry: "3 years from accrual",
    overlookTitle: "HSBC Relationship Eligibility Gate",
    overlookDesc: "This card is strictly available to HSBC Premier Banking clients maintaining Total Relationship Balance of ₹40 Lakhs or salary credit of ₹3 Lakhs/month.",
    regretWarning: "If Premier Banking relationship status lapses, annual card maintenance fees may apply.",
  },
  "hsbc-rupay-cashback": {
    programName: "Direct Statement Cashback",
    pointName: "Cashback (₹)",
    methods: [
      { name: "Statement Credit", valuePerPt: 1.00, note: "Automatically credited against bill" },
    ],
    defaultPoints: 800,
    minRedeem: 1,
    expiry: "Never expires",
    overlookTitle: "Monthly RuPay UPI ₹400 Ceiling",
    overlookDesc: "Earns 2% cashback on UPI transactions and 1.5% on retail spending, with an overall monthly cashback cap of ₹400 per billing cycle.",
    regretWarning: "Peer-to-peer (P2P) transfers and QR codes mapped to personal bank accounts earn 0% cashback.",
  },
  "hsbc-travel-one": {
    programName: "HSBC TravelOne Points",
    pointName: "Reward Points",
    methods: [
      { name: "Instant In-App Mileage Transfers (16+ airlines & hotels)", valuePerPt: 1.00, note: "1:1 partner ratio with instant processing" },
      { name: "Flight & Hotel Bookings via Portal", valuePerPt: 0.50, note: "1 RP = ₹0.50 on travel portal" },
    ],
    defaultPoints: 10000,
    minRedeem: 1000,
    expiry: "3 years from accrual",
    overlookTitle: "Instant Airline Transfer Engine",
    overlookDesc: "One of the few cards in India where reward point transfers to international airlines process almost instantly inside the mobile app.",
    regretWarning: "Annual fee waiver requires ₹8 Lakhs spend in preceding year.",
  },
  "idfc-first-power-plus": {
    programName: "FIRST Rewards (HPCL Co-branded)",
    pointName: "Reward Points",
    methods: [
      { name: "Fuel Redemption via HPCL HP Pay App", valuePerPt: 0.25, note: "1 RP = ₹0.25 on fuel at HPCL pumps" },
      { name: "Statement Credit", valuePerPt: 0.25, note: "1 RP = ₹0.25 statement credit" },
    ],
    defaultPoints: 4000,
    minRedeem: 1000,
    expiry: "Never expires",
    overlookTitle: "HP Pay App Mandatory for Peak Valueback",
    overlookDesc: "To achieve the full 6.5% savings, fuel must be paid through HP Pay app or at HPCL swipe machines. Direct swipe at pump gives 5% (4% rewards + 1% surcharge waiver) plus 1.5% in HP Pay Happy Coins.",
    regretWarning: "Purchases at non-HPCL petrol pumps (IndianOil, BPCL, Shell) earn standard 0% fuel rewards.",
  },
  "indusind-eazydiner": {
    programName: "EazyPoints & Instant Bill Discounts",
    pointName: "EazyPoints / Reward Points",
    methods: [
      { name: "Instant On-Table Bill Discount", valuePerPt: 1.00, note: "Instant 25% discount up to ₹1,000 on EazyDiner Pay" },
      { name: "EazyPoints Dining Vouchers", valuePerPt: 0.20, note: "1 EazyPoint = ₹0.20 on dining vouchers" },
    ],
    defaultPoints: 5000,
    minRedeem: 500,
    expiry: "1 year from accrual",
    overlookTitle: "The Instant 25% Off Double-Dip",
    overlookDesc: "The 25% instant discount applies on top of restaurant table discounts (up to 50% off) when paying via PayEazy on the EazyDiner app.",
    regretWarning: "Discount is valid up to ₹1,000 per transaction and can only be used at PayEazy partner restaurants.",
  },
  "indusind-tiger": {
    programName: "IndusInd Reward Points",
    pointName: "Reward Points",
    methods: [
      { name: "Statement Cash Credit", valuePerPt: 0.40, note: "1 RP = ₹0.40 direct statement cash credit" },
      { name: "Airline Transfers (InterMiles, Vistara)", valuePerPt: 0.40, note: "1 RP = 0.4 air mile value" },
    ],
    defaultPoints: 5000,
    minRedeem: 500,
    expiry: "Never expires",
    overlookTitle: "Uncapped Accelerators on Ticket Sizes",
    overlookDesc: "Earns up to 6 Accelerated Reward Points per ₹100 for dining and international transactions when statement spending exceeds ₹50,000.",
    regretWarning: "Redemption via merchant gift vouchers offers lower value than direct statement cash credit.",
  },
  "kiwi-yes-bank": {
    programName: "Kiwi Kiwis (Cashback)",
    pointName: "Kiwis",
    methods: [
      { name: "Direct Bank Account Transfer / UPI Cash", valuePerPt: 0.25, note: "4 Kiwis = ₹1.00 direct cashback" },
    ],
    defaultPoints: 2000,
    minRedeem: 200,
    expiry: "1 year from accrual",
    overlookTitle: "UPI Scan & Pay Specialist",
    overlookDesc: "Designed specifically for daily merchant UPI QR payments (Kirana, chai, groceries), earning up to 2% valueback on UPI.",
    regretWarning: "P2P personal money transfers and wallet loads do not earn Kiwis.",
  },
  "rbl-indianoil-xtra": {
    programName: "IndianOil Fuel Points",
    pointName: "Fuel Points",
    methods: [
      { name: "Fuel Redemption at IndianOil Outlets", valuePerPt: 0.50, note: "1 Point = ₹0.50 on fuel" },
      { name: "General Gift Catalog", valuePerPt: 0.25, note: "1 Point = ₹0.25 on catalog items" },
    ],
    defaultPoints: 4000,
    minRedeem: 1000,
    expiry: "2 years from accrual",
    overlookTitle: "Peak 8.5% Fuel Savings on IOCL",
    overlookDesc: "Earns 8.5% valueback (17 fuel points per ₹100) exclusively at IndianOil fuel stations, capped at 1,000 points per month.",
    regretWarning: "Fuel purchases at BPCL or HPCL do not earn accelerated fuel points.",
  },
  "sbi-bpcl-octane": {
    programName: "BPCL SBI Reward Points",
    pointName: "Reward Points",
    methods: [
      { name: "Fuel Redemption at BPCL Petrol Pumps", valuePerPt: 0.25, note: "1 RP = ₹0.25 fuel value" },
      { name: "Bharat Petroleum Vouchers via POS", valuePerPt: 0.25, note: "1 RP = ₹0.25 fuel redemption" },
    ],
    defaultPoints: 6000,
    minRedeem: 1000,
    expiry: "2 years from accrual",
    overlookTitle: "Peak 7.25% Valueback on BPCL Fuel",
    overlookDesc: "Earns 25 Reward Points per ₹100 (6.25%) plus 1% fuel surcharge waiver, netting 7.25% valueback at BPCL petrol pumps, capped at 2,500 points per billing cycle (reached at ₹10,000 monthly fuel spend).",
    regretWarning: "Fuel at HPCL, IndianOil, or Shell petrol pumps earns zero points.",
  },
  "sbi-phonepe-black": {
    programName: "PhonePe Cashback / Reward Points",
    pointName: "PhonePe Balance Cashback",
    methods: [
      { name: "PhonePe Wallet / Merchant Checkouts", valuePerPt: 1.00, note: "Direct balance credit on PhonePe" },
    ],
    defaultPoints: 3000,
    minRedeem: 1,
    expiry: "Never expires",
    overlookTitle: "PhonePe Ecosystem Accelerators",
    overlookDesc: "Earns accelerated 10% cashback on PhonePe app merchant payments (utilities, recharge, travel) and 5% on top partner apps.",
    regretWarning: "Monthly cashback cap applies separately across utility bill payments.",
  },
  "bobcard-scapia": {
    programName: "Scapia Travel Coins",
    pointName: "Scapia Coins",
    methods: [
      { name: "Flight & Hotel Bookings on Scapia App", valuePerPt: 0.20, note: "5 Scapia Coins = ₹1.00 on travel bookings" },
    ],
    defaultPoints: 5000,
    minRedeem: 1,
    expiry: "Never expires",
    overlookTitle: "Zero Forex Markup & Lounge Spend Qualifier",
    overlookDesc: "Features true 0% foreign currency markup on all international transactions. Unlimited domestic airport lounge access unlocks on spending ₹10,000 or more in the preceding billing cycle.",
    regretWarning: "Coins can ONLY be redeemed for flights and hotel bookings inside the Scapia app; there is no statement cash redemption.",
  },
};

export default function CardInteractiveInsights({ card }) {
  // Extract user session profile if available for personalized insights
  const [userProfile] = useState(() => {
    if (typeof window === "undefined") return null;
    return getActiveGuestProfile();
  });

  const cardConfig = PROGRAM_REDEMPTIONS[card.slug] || {
    programName: `${card.issuer} Rewards Program`,
    pointName: card.category === "cashback" ? "Cashback (₹)" : "Reward Points",
    methods: [
      {
        name: card.category === "cashback" ? "Statement Balance Credit" : "Reward Catalog Redemption",
        valuePerPt: card.category === "cashback" ? 1.0 : (card.rewardRate ? 0.25 : 0.5),
        note: card.category === "cashback" ? "Direct statement credit (1:1 value)" : "Redeemable for brand vouchers & flights",
      },
    ],
    defaultPoints: 5000,
    minRedeem: 500,
    expiry: "Terms per issuing bank schedule",
    overlookTitle: "Spend Exclusions & Billing Cycle Rules",
    overlookDesc: card.exclusions || "Standard exclusions apply to fuel, cash withdrawals, and wallet reloads.",
    regretWarning: card.feeWaiver ? `Keep an eye on the annual fee waiver threshold: ${card.feeWaiver}` : "Make sure to review annual fees before the renewal cycle.",
  };

  // Calculator State
  const [inputPoints, setInputPoints] = useState(cardConfig.defaultPoints);
  const [selectedMethodIdx, setSelectedMethodIdx] = useState(0);

  // Active Exploration Tabs
  const [activeTab, setActiveTab] = useState("calculator"); // 'calculator' | 'overlooked' | 'regrets' | 'sweetspots'

  const pointsInputId = useId();
  const currentMethod = cardConfig.methods[selectedMethodIdx] || cardConfig.methods[0];
  const calculatedValue = Math.round((Number(inputPoints) || 0) * (currentMethod.valuePerPt || 1));

  // Determine Personalized Notes based on userProfile
  const personalizedTips = [];
  if (userProfile?.spending?.categories) {
    const cats = userProfile.spending.categories;
    if (card.slug === "amazon-pay-icici" && (cats.shopping || 0) >= 5000) {
      personalizedTips.push(`You spend ₹${Number(cats.shopping).toLocaleString("en-IN")}/mo on shopping. On Amazon, this yields ~₹${Math.round(cats.shopping * 0.05).toLocaleString("en-IN")}/mo in automatic cashback.`);
    }
    if (card.slug.includes("tata") && ((cats.groceries || 0) >= 6000 || userProfile.spending.merchants?.bigbasket)) {
      personalizedTips.push(`Your grocery expenses align with BigBasket on Tata Neu, maximizing the 10% NeuCoin acceleration.`);
    }
    if (card.category === "travel" && userProfile.preferences?.travelFrequency?.includes("Frequently")) {
      personalizedTips.push("You travel frequently. This card's 1:1 mileage transfer partners offer significantly higher return than cashback.");
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-8 md:p-9 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Interactive Card Intelligence
            </span>
            <span className="bg-[#DDF247] text-neutral-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              Verified Rules
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
            Explore this card
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            There&apos;s more to this card than meets the eye. Discover redemption values, sweet spots, and things worth knowing before you apply.
          </p>
        </div>
      </div>

      {/* Personalized Profile Callout (if active session profile exists) */}
      {personalizedTips.length > 0 && (
        <div className="mt-5 rounded-xl border border-neutral-200/90 bg-neutral-50 p-4 text-xs text-neutral-700">
          <div className="flex items-center gap-2 mb-1 text-neutral-900 font-bold">
            <Sparkles className="h-3.5 w-3.5 text-neutral-900" />
            <span>Matched to Your Confirmed Spending Habits</span>
          </div>
          <ul className="space-y-1 mt-1 text-neutral-600">
            {personalizedTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-400">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Compact Interactive Topic Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("calculator")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "calculator"
              ? "bg-black text-white shadow-xs"
              : "bg-neutral-50 border border-neutral-200/80 text-neutral-700 hover:border-black hover:text-black"
          }`}
        >
          <Calculator className="h-3.5 w-3.5" />
          <span>Points Value Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overlooked")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "overlooked"
              ? "bg-black text-white shadow-xs"
              : "bg-neutral-50 border border-neutral-200/80 text-neutral-700 hover:border-black hover:text-black"
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>What Most People Overlook</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("regrets")}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "regrets"
              ? "bg-black text-white shadow-xs"
              : "bg-neutral-50 border border-neutral-200/80 text-neutral-700 hover:border-black hover:text-black"
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
          <span>Things You Might Regret Later</span>
        </button>

        {card.redemptionSweetSpots && card.redemptionSweetSpots.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("sweetspots")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "sweetspots"
                ? "bg-black text-white shadow-xs"
                : "bg-neutral-50 border border-neutral-200/80 text-neutral-700 hover:border-black hover:text-black"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span>Flight & Hotel Case Studies</span>
          </button>
        )}
      </div>

      {/* Tab 1: Points Value Calculator */}
      {activeTab === "calculator" && (
        <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-5 sm:p-7 space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Programme: {cardConfig.programName}
              </span>
              <h3 className="text-base font-bold text-neutral-900">
                How much are your {cardConfig.pointName} actually worth?
              </h3>
            </div>

            {/* Input Points */}
            <div className="flex items-center gap-2">
              <label htmlFor={pointsInputId} className="text-xs font-semibold text-neutral-500 whitespace-nowrap">
                Points:
              </label>
              <input
                id={pointsInputId}
                type="number"
                min="0"
                step="500"
                value={inputPoints}
                onChange={(e) => setInputPoints(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-32 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-bold text-neutral-900 font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Redemption Method Selector */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              Select Redemption Channel:
            </span>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cardConfig.methods.map((method, idx) => {
                const isSelected = selectedMethodIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMethodIdx(idx)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      isSelected
                        ? "border-black bg-white shadow-xs ring-1 ring-black"
                        : "border-neutral-200/80 bg-white hover:border-neutral-300 text-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">{method.name}</span>
                      <span className="text-[10px] font-mono font-semibold text-neutral-500">
                        {method.valuePerPt >= 1 ? `₹${method.valuePerPt.toFixed(2)}/pt` : `₹${method.valuePerPt.toFixed(2)}/pt`}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                      {method.note}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Banner */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Estimated Realizable Value
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">
                  ₹{calculatedValue.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-neutral-500">
                  via {currentMethod.name}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right text-[11px] text-neutral-400 space-y-0.5">
              <p>Minimum redemption: {cardConfig.minRedeem ? `${cardConfig.minRedeem} points` : "None"}</p>
              <p>Point expiry: {cardConfig.expiry}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: What Most People Overlook */}
      {activeTab === "overlooked" && (
        <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-[#FAFAFA] p-5 sm:p-7 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-neutral-900 shrink-0" />
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              {cardConfig.overlookTitle || "What Most Cardholders Overlook"}
            </h3>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-xs text-neutral-700 leading-relaxed space-y-3">
            <p className="font-medium text-neutral-900">
              {cardConfig.overlookDesc}
            </p>
            {card.exclusions && (
              <div className="pt-2 border-t border-neutral-100">
                <span className="font-bold text-neutral-800 block mb-1">Standard Excluded Spends:</span>
                <p className="text-neutral-500">{card.exclusions}</p>
              </div>
            )}
            <div className="text-[11px] text-neutral-400 pt-1">
              Data verified against the canonical issuer schedule as of {card.lastVerified || "September 2026"}.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Things You Might Regret Later */}
      {activeTab === "regrets" && (
        <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/20 p-5 sm:p-7 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Honest Limitations Worth Knowing Before You Apply
            </h3>
          </div>
          <div className="rounded-xl border border-amber-200/70 bg-white p-5 text-xs text-neutral-700 leading-relaxed space-y-3">
            <p className="font-medium text-amber-950">
              {cardConfig.regretWarning}
            </p>
            {card.whatToWatchOutFor && (
              <ul className="space-y-1.5 pt-2 border-t border-neutral-100 text-neutral-600">
                {(Array.isArray(card.whatToWatchOutFor) ? card.whatToWatchOutFor : [card.whatToWatchOutFor]).map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Travel Sweet Spots & Real Case Studies */}
      {activeTab === "sweetspots" && card.redemptionSweetSpots && (
        <div className="mt-6 space-y-4 animate-in fade-in duration-150">
          {card.redemptionSweetSpots.map((spot, idx) => (
            <div key={idx} className="rounded-2xl border border-neutral-200/90 bg-[#FAFAFA] p-5 sm:p-7 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Case Study {idx + 1} · {spot.partner}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 mt-0.5">{spot.title}</h4>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold font-mono shrink-0 self-start sm:self-auto">
                  <span>Realized Value:</span>
                  <span>{spot.realizedValuePerPoint}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">{spot.scenario}</p>

              {/* Metric Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white rounded-xl p-3 border border-neutral-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Cash Price</span>
                  <span className="font-bold text-neutral-900 font-mono">{spot.cashPrice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Points Used</span>
                  <span className="font-bold text-neutral-900 font-mono">{spot.pointsRequired}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Taxes / Fees</span>
                  <span className="font-bold text-neutral-700 font-mono">{spot.taxesAndFees}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Net Saved</span>
                  <span className="font-bold text-emerald-700 font-mono">{spot.netCashSaved}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-700 font-medium bg-neutral-100/70 p-3 rounded-xl leading-relaxed">
                <strong className="text-black">The Bottom Line: </strong>
                {spot.bottomLine}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

