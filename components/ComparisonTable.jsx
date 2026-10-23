"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, ChevronUp, ExternalLink, ArrowRight, ShieldCheck, Plus } from "lucide-react";
import cards from "../data/cards.json";
import CreditCardVisual from "./CreditCardVisual";
import { TINT_BY_CATEGORY } from "./CreditCard";

/**
 * ComparisonTable (Refined Editorial Decision Tool)
 * ------------------------------------------------------------
 * Avoids spreadsheet clutter. Prioritizes:
 * 1. Annual fee & waiver
 * 2. Reward structure
 * 3. Relevant benefits (Lounge, Fuel, Dining)
 * 4. Major limitations & caps
 * 5. Income & eligibility
 *
 * Explains differences without declaring winners ("Card A may suit you if...").
 * Technical metrics are available via progressive disclosure.
 */

const MAX = 3;

function formatFee(fee) {
  if (fee === 0) return "Lifetime free";
  return `₹${fee.toLocaleString("en-IN")} / year`;
}

function getCardSuitabilitySummary(card) {
  if (card.whoItFits) {
    const text = card.whoItFits.trim();
    return `${card.name} may suit you if ${text.charAt(0).toLowerCase() + text.slice(1)}`;
  }
  if (card.whyCreditWiseRecommends) {
    const text = card.whyCreditWiseRecommends.trim();
    return `${card.name} may suit you if ${text.charAt(0).toLowerCase() + text.slice(1)}`;
  }
  if (card.goodFor) {
    return `${card.name} may suit you if you have high recurring spend on ${card.goodFor.toLowerCase()}.`;
  }
  return `${card.name} may suit you if you want consistent value from your regular everyday transactions.`;
}

// Core prioritized rows
const CORE_ROWS = [
  {
    label: "Annual fee & waiver",
    render: (c) => (
      <div>
        <p className="font-bold text-neutral-900">{formatFee(c.annualFee)}</p>
        {c.feeWaiver && c.annualFee > 0 && (
          <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
            {c.feeWaiver}
          </p>
        )}
      </div>
    ),
  },
  {
    label: "Reward structure",
    render: (c) => (
      <div>
        <p className="text-xs text-neutral-800 leading-relaxed font-medium">
          {c.rewardSummary || (c.cashbackRate > 0 ? `${c.cashbackRate}% direct cashback` : `${c.rewardRate} points per ₹100 spend`)}
        </p>
      </div>
    ),
  },
  {
    label: "Good for",
    render: (c) => (
      <p className="text-xs text-neutral-800 font-medium">
        {c.goodFor || c.shortDescription}
      </p>
    ),
  },
  {
    label: "Airport lounges",
    render: (c) => (
      <p className="text-xs text-neutral-800">
        {c.loungeBenefits || (c.loungeAccess > 0 ? `${c.loungeAccess} visits per year` : "None")}
      </p>
    ),
  },
  {
    label: "Fuel benefits",
    render: (c) => (
      <p className="text-xs text-neutral-700">
        {c.fuelBenefits || "1% fuel surcharge waiver"}
      </p>
    ),
  },
  {
    label: "Dining discounts",
    render: (c) => (
      <p className="text-xs text-neutral-700">
        {c.diningBenefits || "Standard partner dining program"}
      </p>
    ),
  },
  {
    label: "Major limitations & caps",
    render: (c) => (
      <div className="space-y-1 text-xs text-neutral-700">
        <p className="leading-relaxed">
          • {c.whatToWatchOutFor || "Standard category limits and partner merchant exclusions apply."}
        </p>
        {c.rewardCaps && !c.rewardCaps.toLowerCase().includes("no maximum cap") && (
          <p className="text-[11px] text-neutral-500">
            <strong>Caps:</strong> {c.rewardCaps}
          </p>
        )}
        {c.exclusions && (
          <p className="text-[11px] text-neutral-500">
            <strong>Exclusions:</strong> {c.exclusions}
          </p>
        )}
      </div>
    ),
  },
  {
    label: "Income & eligibility",
    render: (c) => (
      <div className="text-xs text-neutral-700 space-y-0.5">
        <p className="font-semibold text-neutral-900">{c.incomeRequirement || "Income criteria determined by bank"}</p>
        {c.eligibility && (
          <p className="text-[11px] text-neutral-500 leading-relaxed">{c.eligibility}</p>
        )}
      </div>
    ),
  },
];

// Progressive disclosure rows for technical credit card metrics
const TECHNICAL_ROWS = [
  {
    label: "APR (Interest Rate)",
    render: (c) => <span className="text-xs font-semibold text-neutral-800">{c.apr ? `${c.apr}% p.a.` : "3.5% – 3.75% per month"}</span>,
  },
  {
    label: "Foreign currency markup",
    render: (c) => <span className="text-xs text-neutral-700">{c.forexBenefits || "Standard 3.5% + GST markup"}</span>,
  },
  {
    label: "Joining fee",
    render: (c) => (
      <span className="text-xs text-neutral-800">
        {c.joiningFee === 0 ? "None (₹0)" : `₹${c.joiningFee.toLocaleString("en-IN")}`}
      </span>
    ),
  },
  {
    label: "Card network",
    render: (c) => <span className="text-xs font-medium text-neutral-700">{c.network || "Visa / Mastercard"}</span>,
  },
];

export default function ComparisonTable({ initialSlugs = [] }) {
  const [selected, setSelected] = useState(() => {
    const valid = initialSlugs.filter((slug) => cards.some((c) => c.slug === slug));
    return valid.length > 0
      ? valid.slice(0, MAX)
      : ["hsbc-live-plus", "amazon-pay-icici", "hdfc-regalia-gold"];
  });

  const [showTechnical, setShowTechnical] = useState(false);

  const chosen = selected
    .map((slug) => cards.find((c) => c.slug === slug))
    .filter(Boolean);

  function add(slug) {
    if (!slug || selected.includes(slug) || selected.length >= MAX) return;
    setSelected((prev) => [...prev, slug]);
  }

  function remove(slug) {
    setSelected((prev) => prev.filter((s) => s !== slug));
  }

  const available = cards.filter((c) => !selected.includes(c.slug));

  return (
    <div>
      {/* ---------- Selection controls ---------- */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {chosen.map((card) => (
          <span
            key={card.slug}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white py-1.5 pl-3.5 pr-2 text-xs font-semibold text-neutral-800 shadow-2xs"
          >
            {card.name}
            <button
              type="button"
              onClick={() => remove(card.slug)}
              aria-label={`Remove ${card.name} from comparison`}
              className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-black transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}

        {selected.length < MAX && (
          <div className="flex items-center gap-2">
            <label htmlFor="add-card-select" className="sr-only">
              Add card to compare
            </label>
            <select
              id="add-card-select"
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:border-neutral-400 focus:outline-none shadow-2xs"
              value=""
              onChange={(e) => add(e.target.value)}
            >
              <option value="">+ Add a card to compare…</option>
              {available.map((card) => (
                <option key={card.slug} value={card.slug}>
                  {card.issuer} — {card.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="text-[11px] font-medium text-neutral-400">
          {selected.length} of {MAX} selected
        </span>
      </div>

      {chosen.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-12 text-center shadow-xs">
          <p className="text-sm font-medium text-neutral-600 mb-4">
            Select at least one card to view the side-by-side comparison.
          </p>
          <div className="flex justify-center gap-2">
            {cards.slice(0, 3).map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => add(c.slug)}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-black"
              >
                + Add {c.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* ==================================================
              EDITORIAL SUITABILITY GUIDE ("Which card suits your spending?")
              Avoids declaring a winner; explains trade-offs neutrally.
          ================================================== */}
          <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
              Suitability Guide
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 mb-2">
              Which card suits your spending?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 max-w-2xl leading-relaxed">
              We do not rank or declare an arbitrary &ldquo;winner.&rdquo; Compare how each card fits different spending profiles so you can decide based on your own habits:
            </p>

            <div className={`grid gap-5 sm:grid-cols-2 ${chosen.length >= 3 ? "lg:grid-cols-3" : ""}`}>
              {chosen.map((card) => (
                <div
                  key={card.slug}
                  className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-semibold tracking-wider text-neutral-400 mb-1.5">
                      <span>{card.issuer}</span>
                      <span>{formatFee(card.annualFee)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mb-2">
                      {card.name}
                    </h3>
                    <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                      {getCardSuitabilitySummary(card)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                    <Link
                      href={`/cards/${card.slug}`}
                      className="font-semibold text-neutral-900 hover:underline inline-flex items-center gap-1"
                    >
                      View details <ArrowRight className="h-3 w-3" />
                    </Link>
                    {card.officialUrl && (
                      <a
                        href={card.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-black inline-flex items-center gap-1 text-[11px]"
                      >
                        Official site <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ==================================================
              PRIORITIZED COMPARISON TABLE
          ================================================== */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left">
                <caption className="sr-only">
                  Feature-by-feature comparison of selected verified credit cards.
                </caption>

                {/* Column Headers with Card Artwork */}
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-[#FAFAFA]">
                    <th scope="col" className="sticky left-0 z-20 bg-[#FAFAFA] w-[180px] px-6 py-6 text-[10px] uppercase tracking-widest font-semibold text-neutral-400 align-top border-r border-neutral-200/60 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      Feature
                    </th>
                    {chosen.map((card) => (
                      <th key={card.slug} scope="col" className="px-6 py-6 align-top min-w-[220px]">
                        <div className="w-[160px] mb-3 flex items-center justify-center">
                          <CreditCardVisual
                            issuer={card.issuer || card.bank}
                            name={card.name}
                            image={card.image}
                            orientation={card.orientation || "horizontal"}
                            size="sm"
                            className="w-full"
                          />
                        </div>
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                          {card.issuer}
                        </span>
                        <Link
                          href={`/cards/${card.slug}`}
                          className="block text-sm font-bold text-neutral-900 hover:underline mt-0.5 leading-snug"
                        >
                          {card.name}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Core Rows */}
                <tbody className="divide-y divide-neutral-100">
                  {CORE_ROWS.map((row) => (
                    <tr key={row.label} className="hover:bg-neutral-50/50 transition-colors">
                      <th scope="row" className="sticky left-0 z-10 bg-white group-hover:bg-neutral-50/90 px-6 py-4 align-top text-xs font-semibold text-neutral-900 border-r border-neutral-200/60 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        {row.label}
                      </th>
                      {chosen.map((card) => (
                        <td key={card.slug} className="px-6 py-4 align-top">
                          {row.render(card)}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Technical Rows (Progressive Disclosure) */}
                  {showTechnical &&
                    TECHNICAL_ROWS.map((row) => (
                      <tr key={row.label} className="bg-neutral-50/40 hover:bg-neutral-50 transition-colors">
                        <th scope="row" className="sticky left-0 z-10 bg-[#FAFAFA] px-6 py-3.5 align-top text-xs font-semibold text-neutral-600 border-r border-neutral-200/60 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {row.label}
                        </th>
                        {chosen.map((card) => (
                          <td key={card.slug} className="px-6 py-3.5 align-top">
                            {row.render(card)}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Progressive Disclosure Toggle Button */}
            <div className="p-4 bg-[#FAFAFA] border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>
                {showTechnical
                  ? "Showing all verified technical specifications (APR, forex, network)."
                  : "Core decision factors shown above."}
              </span>
              <button
                type="button"
                onClick={() => setShowTechnical(!showTechnical)}
                className="inline-flex items-center gap-1.5 font-semibold text-neutral-800 hover:text-black transition-colors"
              >
                <span>{showTechnical ? "Hide technical credit metrics" : "Show technical credit metrics (APR, forex, joining fees)"}</span>
                {showTechnical ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
