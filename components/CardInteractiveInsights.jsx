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

