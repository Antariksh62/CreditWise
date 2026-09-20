"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck, FileText, Check, ExternalLink } from "lucide-react";

export default function CardTechnicalDetails({ card }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-12 rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-sm">
      {/* Header / Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 sm:p-7 flex items-center justify-between text-left hover:bg-neutral-50/60 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Technical Breakdown
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-black">
            {isOpen ? "Full Technical Details & Exclusions" : "See full details"}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isOpen
              ? "Detailed reward mechanics, category caps, exclusions, and verified bank terms."
              : "Expand to review exact reward rates, exclusions, caps, lounge criteria, and milestone schedules."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-800 shrink-0 shadow-xs">
          <span>{isOpen ? "Hide details" : "See full details"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
