"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  AlertTriangle,
  Sparkles,
  Plane,
  Fuel,
  UtensilsCrossed,
  ShoppingBag,
  ExternalLink,
  Info,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { CARD_MERCHANT_RULES, resolveMerchant } from "../lib/merchantRewardRules";

export default function CardTechnicalDetails({ card }) {
  // Controlled section expansion states (default open for primary explanations, collapsed for deep technical breakdowns)
  const [openSections, setOpenSections] = useState({
    whyChoose: true,
    howEarn: true,
    whereWorks: true,
    whatCosts: true,
    watchOut: true,
    additionalPerks: false,
    deepDiveGotchas: false,
  });

  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Extract merchant partnerships from CARD_MERCHANT_RULES if defined
  const cardMerchantConfig = CARD_MERCHANT_RULES[card.slug]?.merchants || {};
  const merchantEntries = Object.entries(cardMerchantConfig).map(([mId, rule]) => {
    const canonical = resolveMerchant(mId);
    return {
      id: mId,
      name: canonical?.name || mId,
      category: canonical?.category || "shopping",
      rate: rule.rate,
      note: rule.note || "",
      cap: rule.cap ?? rule.capMonthlyCashback ?? rule.capMonthlyCoins ?? rule.capMonthlyPoints,
    };
  });

  // Calculate annual fee numbers
  const baseFee = card.annualFee ?? 0;
  const joiningFee = card.joiningFee ?? card.annualFee ?? 0;
  const gstAmount = Math.round(baseFee * 0.18);
  const totalAnnualCost = baseFee + gstAmount;

  // Format fee label
  const feeLabel = baseFee === 0 ? "Lifetime Free (₹0)" : `₹${totalAnnualCost.toLocaleString("en-IN")}/yr`;

  return (
    <div className="mt-10 space-y-6">
      {/* ==================================================
          SECTION B.01 — WHY CHOOSE THIS CARD?
      ================================================== */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("whyChoose")}
          className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
          aria-expanded={openSections.whyChoose}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                01 · Core Value Proposition
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              Why choose this card?
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {card.goodFor ? `Best suited for: ${card.goodFor}` : "Who is likely to benefit from this card."}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
            <span>{openSections.whyChoose ? "Hide" : "Show"}</span>
            {openSections.whyChoose ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </button>

        {openSections.whyChoose && (
          <div className="border-t border-neutral-100 p-5 sm:p-7 pt-4 space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed bg-[#FAFAFA]/40 animate-in fade-in duration-150">
            {/* Plain language summary */}
            <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Who It Fits
              </h3>
              <p className="text-neutral-800 font-medium leading-relaxed">
                {card.whoItFits || card.description || card.shortDescription}
              </p>
            </div>

            {/* Why CreditWise Recommends bullet points */}
            <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                Strongest Advantages
              </h3>
              <ul className="space-y-2">
                {(card.benefits || []).slice(0, 4).map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION B.02 — HOW DO YOU EARN REWARDS?
      ================================================== */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("howEarn")}
          className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
          aria-expanded={openSections.howEarn}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                02 · Earning Mechanics
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              How do you earn rewards?
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Reward rates, points valuation, accelerated tiers, and realistic return examples.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
            <span>{openSections.howEarn ? "Hide" : "Show"}</span>
            {openSections.howEarn ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </button>

        {openSections.howEarn && (
          <div className="border-t border-neutral-100 p-5 sm:p-7 pt-4 space-y-4 text-xs text-neutral-700 bg-[#FAFAFA]/40 animate-in fade-in duration-150">
            {/* Overview Banner */}
            <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Reward Model
                  </span>
                  <span className="text-sm font-bold text-neutral-900 capitalize">
                    {card.category === "cashback" ? "Direct Statement Cashback" : card.category === "travel" ? "Air Miles & Travel Points" : "Reward Points Program"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Accelerated Return
                  </span>
                  <span className="text-sm font-bold text-emerald-700 font-mono">
                    {card.cashbackRate > 0 ? `${card.cashbackRate}% Cashback` : card.rewardRate > 0 ? `${card.rewardRate} pts / ₹100` : "Category Multipliers"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Redemption Valuation
                  </span>
                  <span className="text-sm font-bold text-neutral-900 font-mono">
                    {card.category === "cashback" ? "1 Point = ₹1.00 Cash" : card.slug.includes("infinia") || card.slug.includes("diners") ? "1 Point = Up to ₹1.00" : "1 Point ≈ ₹0.20 – ₹0.50"}
                  </span>
                </div>
              </div>
            </div>

            {/* Categorized Reward Rates */}
            {card.rewardCategories && (
              <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Verified Reward Tiers by Category
                </h3>
                <dl className="grid gap-2.5 sm:grid-cols-2">
                  {Object.entries(card.rewardCategories).map(([k, desc]) => (
                    <div key={k} className="p-3 rounded-lg bg-neutral-50/70 border border-neutral-100">
                      <dt className="font-semibold text-neutral-900 text-xs capitalize mb-0.5">
                        {k.replace(/([A-Z])/g, " $1").trim()}
                      </dt>
                      <dd className="text-neutral-600 text-[11px] leading-relaxed">
                        {desc}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Practical Example */}
            <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-4 sm:p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Practical Earning Example
              </span>
              <p className="text-neutral-800 text-xs leading-relaxed">
                If you swipe <strong>₹10,000</strong> on qualifying purchases each month, you earn approximately{" "}
                <strong className="text-emerald-800 font-mono font-bold">
                  ₹{Math.round(10000 * ((card.cashbackRate || card.rewardRate || 2) / 100)).toLocaleString("en-IN")}/month
                </strong>{" "}
                (around{" "}
                <strong className="text-emerald-800 font-mono font-bold">
                  ₹{Math.round(120000 * ((card.cashbackRate || card.rewardRate || 2) / 100)).toLocaleString("en-IN")}/year
                </strong>
                ) in gross reward value before deducting annual maintenance fees.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION B.03 — WHERE DOES THIS CARD WORK BEST?
      ================================================== */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("whereWorks")}
          className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
          aria-expanded={openSections.whereWorks}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                03 · Brand & Merchant Partnerships
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              Where does this card work best?
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Eligible partner merchants, shopping platforms, and food delivery networks.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
            <span>{openSections.whereWorks ? "Hide" : "Show"}</span>
            {openSections.whereWorks ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </button>

        {openSections.whereWorks && (
          <div className="border-t border-neutral-100 p-5 sm:p-7 pt-4 space-y-4 text-xs text-neutral-700 bg-[#FAFAFA]/40 animate-in fade-in duration-150">
            {merchantEntries.length > 0 ? (
              <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                  Verified Partner Merchant Earning Rates
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {merchantEntries.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg border border-neutral-200/70 bg-neutral-50/50 flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-neutral-900 text-xs block">
                          {m.name}
                        </span>
                        {m.note && (
                          <span className="text-[11px] text-neutral-500 block mt-0.5">
                            {m.note}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold text-xs">
                        {m.rate}% return
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  General Category Acceptance
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  This card earns standard rewards across all eligible retail merchant categories rather than restricting benefits to a single exclusive brand partner.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION B.04 — WHAT DOES THIS CARD COST?
      ================================================== */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("whatCosts")}
          className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
          aria-expanded={openSections.whatCosts}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                04 · Transparent Fee Schedule
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              What does this card cost?
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Joining fee, annual fee, mandatory 18% GST, and exact fee-waiver spend conditions.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
            <span>{openSections.whatCosts ? "Hide" : "Show"}</span>
            {openSections.whatCosts ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </button>

        {openSections.whatCosts && (
          <div className="border-t border-neutral-100 p-5 sm:p-7 pt-4 space-y-4 text-xs text-neutral-700 bg-[#FAFAFA]/40 animate-in fade-in duration-150">
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Joining Fee */}
              <div className="rounded-xl border border-neutral-200/70 bg-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Joining / First Year Fee
                </span>
                <span className="text-base font-bold text-neutral-900 font-mono block">
                  {joiningFee === 0 ? "₹0 (Free)" : `₹${Math.round(joiningFee * 1.18).toLocaleString("en-IN")}`}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {joiningFee === 0 ? "Lifetime Free" : `₹${joiningFee.toLocaleString("en-IN")} + 18% GST`}
                </span>
              </div>

              {/* Annual Renewal Fee */}
              <div className="rounded-xl border border-neutral-200/70 bg-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Annual Renewal Fee
                </span>
                <span className="text-base font-bold text-neutral-900 font-mono block">
                  {baseFee === 0 ? "₹0 (Free)" : `₹${totalAnnualCost.toLocaleString("en-IN")}`}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  {baseFee === 0 ? "Lifetime Free" : `₹${baseFee.toLocaleString("en-IN")} + 18% GST`}
                </span>
              </div>

              {/* Interest Rate / APR */}
              <div className="rounded-xl border border-neutral-200/70 bg-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Interest Rate (APR)
                </span>
                <span className="text-base font-bold text-neutral-900 font-mono block">
                  {card.apr ? `${card.apr}% / yr` : "42.0% – 43.8%"}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  When rolling statement balances
                </span>
              </div>
            </div>

            {/* Fee Waiver Condition */}
            <div className="rounded-xl border border-neutral-200/70 bg-white p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                How to Avoid the Annual Fee
              </h3>
              {card.feeWaiver ? (
                <p className="text-neutral-800 text-xs font-medium leading-relaxed">
                  {card.feeWaiver}
                </p>
              ) : baseFee === 0 ? (
                <p className="text-emerald-800 text-xs font-medium leading-relaxed">
                  This card is Lifetime Free with zero annual maintenance fees and no spend thresholds required.
                </p>
              ) : (
                <p className="text-neutral-600 text-xs leading-relaxed">
                  The annual renewal fee of ₹{totalAnnualCost.toLocaleString("en-IN")} is standard and not subject to automatic spend-based waivers.
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION B.05 — WHAT SHOULD YOU WATCH OUT FOR?
      ================================================== */}
      <section className="rounded-2xl border border-amber-200/70 bg-amber-50/20 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("watchOut")}
          className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-amber-50/40 transition-colors"
          aria-expanded={openSections.watchOut}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-900">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
              <span>05 · Gotchas & Limitations</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-amber-950 tracking-tight">
              What should you watch out for?
            </h2>
            <p className="text-xs text-amber-800/80 mt-1">
              Monthly reward limits, excluded MCC categories, minimum spend rules, and fine print.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
            <span>{openSections.watchOut ? "Hide" : "Show"}</span>
            {openSections.watchOut ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </button>

        {openSections.watchOut && (
          <div className="border-t border-amber-200/50 p-5 sm:p-7 pt-4 space-y-4 text-xs text-neutral-700 bg-white animate-in fade-in duration-150">
            {/* Reward Caps */}
            <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Maximum Reward Limits
              </h3>
              <p className="text-neutral-700 text-xs leading-relaxed">
                {card.rewardCaps || "No category capping officially specified. General fair usage policy applies."}
              </p>
            </div>

            {/* Standard Excluded Categories */}
            <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Excluded Spends (Earn 0%)
              </h3>
              <p className="text-neutral-700 text-xs leading-relaxed">
                {card.exclusions || "Fuel, wallet loads, rent payments, government fees, and cash advances are excluded."}
              </p>
            </div>

            {/* Verified Gotchas bullets */}
            {card.whatToWatchOutFor && (
              <div className="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
                  Important Operational Caveats
                </h3>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  {(Array.isArray(card.whatToWatchOutFor) ? card.whatToWatchOutFor : [card.whatToWatchOutFor]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION B.06 — ADDITIONAL PERKS & LIFESTYLE PRIVILEGES
      ================================================== */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("additionalPerks")}
          className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
          aria-expanded={openSections.additionalPerks}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                06 · Auxiliary Benefits
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
              Airport lounges, forex markup & lifestyle perks
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Airport lounge access conditions, international forex fees, fuel surcharge waivers, and milestone rewards.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
            <span>{openSections.additionalPerks ? "Hide" : "Show"}</span>
            {openSections.additionalPerks ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </button>

        {openSections.additionalPerks && (
          <div className="border-t border-neutral-100 p-5 sm:p-7 pt-4 space-y-4 text-xs text-neutral-700 bg-[#FAFAFA]/40 animate-in fade-in duration-150">
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Airport Lounges */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200/70">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Plane className="h-3 w-3 text-neutral-700" />
                  Airport Lounges
                </dt>
                <dd className="font-semibold text-neutral-900 leading-snug">
                  {card.loungeBenefits || (card.loungeAccess > 0 ? `${card.loungeAccess} visits per year` : "None")}
                </dd>
              </div>

              {/* Forex Markup */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200/70">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Extra Charges Abroad (Forex)
                </dt>
                <dd className="font-semibold text-neutral-900 leading-snug">
                  {card.forexBenefits || "3.5% + GST markup fee"}
                </dd>
              </div>

              {/* Fuel Waiver */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200/70">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Fuel className="h-3 w-3 text-neutral-700" />
                  Fuel Surcharge Waiver
                </dt>
                <dd className="font-semibold text-neutral-900 leading-snug">
                  {card.fuelBenefits || "1% surcharge waiver"}
                </dd>
              </div>

              {/* Dining Program */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200/70">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3 w-3 text-neutral-700" />
                  Dining Discounts
                </dt>
                <dd className="font-semibold text-neutral-900 leading-snug">
                  {card.diningBenefits || "Standard bank dining discount"}
                </dd>
              </div>
            </dl>

            {/* Spend-linked Lounge Notice */}
            {card.loungeBenefits && /(preceding|previous|spend hurdle|crossing|billing cycle)/i.test(card.loungeBenefits) && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 flex items-start gap-2.5 text-xs text-amber-900">
                <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Important Spend Hurdle for Airport Lounges:</strong>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">{card.loungeBenefits}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ==================================================
          SECTION B.07 — DEEP-DIVE GOTCHAS & FINE PRINT AUDIT (Optional Disclosure)
      ================================================== */}
      {card.realWorldGotchas && card.realWorldGotchas.length > 0 && (
        <section className="rounded-2xl border border-neutral-200/80 bg-white shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection("deepDiveGotchas")}
            className="w-full p-5 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors"
            aria-expanded={openSections.deepDiveGotchas}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  07 · Technical Policy Nuances
                </span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
                  {card.realWorldGotchas.length} Audited Cases
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                Deep-dive fine print & MCC rules
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Technical gotchas, merchant category codes (MCCs), and refund adjustment rules.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 shrink-0">
              <span>{openSections.deepDiveGotchas ? "Hide" : "Show"}</span>
              {openSections.deepDiveGotchas ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </div>
          </button>

          {openSections.deepDiveGotchas && (
            <div className="border-t border-neutral-100 p-5 sm:p-7 pt-4 space-y-3.5 bg-[#FAFAFA]/40 animate-in fade-in duration-150">
              {card.realWorldGotchas.map((gotcha, idx) => (
                <div key={idx} className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="text-xs font-bold text-neutral-900">
                      {gotcha.title}
                    </h3>
                    {gotcha.tag && (
                      <span className="shrink-0 text-[10px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                        {gotcha.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                    {gotcha.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
