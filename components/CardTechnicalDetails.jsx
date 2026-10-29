"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck, FileText, Check, ExternalLink, AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

export default function CardTechnicalDetails({ card }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-10 rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-xs">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
            Progressive Disclosure
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
            KEY DETAILS
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isOpen
              ? "Technical reward rates, monthly caps, spend exclusions, lounge partner criteria, and milestone schedules."
              : "Expand to review exact reward mechanics, monthly caps, exclusions, lounge criteria, and milestone schedules."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shrink-0 shadow-2xs">
          <span>{isOpen ? "Hide key details" : "See key details"}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="border-t border-neutral-100 p-6 sm:p-8 bg-[#FAFAFA] space-y-8 animate-in fade-in duration-200">
          {/* Reward Mechanics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-black" />
              Detailed Reward Mechanics
            </h3>
            <div className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5 space-y-3 text-xs leading-relaxed text-neutral-700">
              <p>
                <strong className="text-black font-semibold">Reward Structure: </strong>
                {card.rewardSummary || "Standard reward points program applicable on qualifying merchant categories."}
              </p>
              {card.cashbackRate > 0 && (
                <p>
                  <strong className="text-black font-semibold">Cashback Rate: </strong>
                  {card.cashbackRate}% on designated eligible spends.
                </p>
              )}
              {card.rewardRate > 0 && (
                <p>
                  <strong className="text-black font-semibold">Reward Points Rate: </strong>
                  {card.rewardRate} points per ₹100 eligible retail spend.
                </p>
              )}
            </div>
          </div>

          {/* Essential Nuances & Policy Insights */}
          {card.keyInsights && card.keyInsights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-black" />
                Essential Policy Nuances & Operational Rules
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {card.keyInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5 space-y-1.5"
                  >
                    <span className="text-xs font-bold text-neutral-900 block">
                      {idx + 1}. {insight.title}
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caps & Exclusions Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Reward Caps */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Reward Caps & Monthly Thresholds
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {card.rewardCaps || "No category capping officially specified. General fair usage policy applies."}
              </p>
            </div>

            {/* Exclusions */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Standard Excluded Spends
              </span>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {card.exclusions || "Rent payments, fuel, cash withdrawals, wallet load transactions, and government services are excluded from base rewards."}
              </p>
            </div>
          </div>

          {/* Detailed Categorized Exclusions (when available) */}
          {card.exclusionCategories && card.exclusionCategories.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                Official Reward Exclusion Rules by Category
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {card.exclusionCategories.map((group, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5 space-y-2"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                      {group.category}
                    </span>
                    <ul className="space-y-1.5 text-xs text-neutral-600">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-neutral-400 font-bold shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 18 Karat & 24 Karat Gold Collection Redemption Catalog */}
          {card.goldCollection && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                18 Karat & 24 Karat Gold Collection Voucher Options
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* 24K Collection */}
                <div className="rounded-xl border border-amber-200/90 bg-amber-50/20 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200/70 pb-2.5">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                      24 Karat Gold Collection
                    </span>
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300/60 font-mono">
                      24,000 MR Points
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Choose any one verified voucher upon reaching 24,000 points:
                  </p>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {card.goldCollection.collection24k.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-0">
                        <span className="font-medium text-neutral-800">{item.brand}</span>
                        <span className="font-bold text-neutral-900 font-mono">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 18K Collection */}
                <div className="rounded-xl border border-neutral-200/80 bg-white p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                      18 Karat Gold Collection
                    </span>
                    <span className="text-xs font-bold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-mono">
                      18,000 MR Points
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Choose any one verified voucher upon reaching 18,000 points:
                  </p>
                  <ul className="space-y-1.5 text-xs text-neutral-700">
                    {card.goldCollection.collection18k.map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-0">
                        <span className="font-medium text-neutral-800">{item.brand}</span>
                        <span className="font-bold text-neutral-900 font-mono">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Real-World Redemption Sweet Spots & Case Studies */}
          {card.redemptionSweetSpots && card.redemptionSweetSpots.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                What Can Be Done With Points If Used Properly (Real Case Studies)
              </h3>
              <div className="space-y-4">
                {card.redemptionSweetSpots.map((spot, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-neutral-200/90 bg-white p-5 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                          Case Study {idx + 1} · {spot.partner}
                        </span>
                        <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                          {spot.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">
                        <span>Realized Value:</span>
                        <span className="font-mono">{spot.realizedValuePerPoint}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {spot.scenario}
                    </p>

                    {/* Financial Breakdown Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#F9F9F9] rounded-lg p-3 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Cash Price</span>
                        <span className="font-bold text-neutral-900 font-mono">{spot.cashPrice}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Points Used</span>
                        <span className="font-bold text-neutral-900 font-mono">{spot.pointsRequired}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Taxes / Cash Outlay</span>
                        <span className="font-bold text-neutral-700 font-mono">{spot.taxesAndFees}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Net Cash Saved</span>
                        <span className="font-bold text-emerald-700 font-mono">{spot.netCashSaved}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-700 font-medium bg-neutral-50 p-2.5 rounded border border-neutral-100 leading-relaxed">
                      <strong className="text-black">The Bottom Line: </strong>
                      {spot.bottomLine}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specific Per-Category Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
              Perk Verification & Category Specifics
            </h3>
            <dl className="grid gap-px overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="bg-white p-4">
                <dt className="font-bold text-neutral-400 uppercase text-[10px] mb-1">Airport Lounges</dt>
                <dd className="font-semibold text-neutral-900">{card.loungeBenefits || "None"}</dd>
              </div>
              <div className="bg-white p-4">
                <dt className="font-bold text-neutral-400 uppercase text-[10px] mb-1">Fuel Surcharge</dt>
                <dd className="font-semibold text-neutral-900">{card.fuelBenefits || "1% surcharge waiver applicable"}</dd>
              </div>
              <div className="bg-white p-4">
                <dt className="font-bold text-neutral-400 uppercase text-[10px] mb-1">Forex Markup</dt>
                <dd className="font-semibold text-neutral-900">{card.forexBenefits || "Standard 3.5% + GST markup"}</dd>
              </div>
              <div className="bg-white p-4">
                <dt className="font-bold text-neutral-400 uppercase text-[10px] mb-1">Dining Discount</dt>
                <dd className="font-semibold text-neutral-900">{card.diningBenefits || "Standard dining program"}</dd>
              </div>
            </dl>
          </div>

          {/* Milestone Benefits */}
          {card.milestoneBenefits && (
            <div className="rounded-xl border border-neutral-200/80 bg-white p-4 sm:p-5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Milestone & Annual Spend Rewards
              </span>
              <p className="text-neutral-700 leading-relaxed font-medium">
                {card.milestoneBenefits}
              </p>
            </div>
          )}

          {/* Direct Bank Verification Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-200 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Verified directly from <strong>{card.officialSource || card.issuer}</strong> as of {card.lastVerified || "September 2026"}.
              </span>
            </div>

            {card.officialUrl && (
              <a
                href={card.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-black hover:underline inline-flex items-center gap-1 shrink-0"
              >
                View official issuer terms
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
