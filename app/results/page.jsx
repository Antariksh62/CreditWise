"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Check,
  Scale,
} from "lucide-react";
import cards from "../../data/cards.json";
import { getProfileRecommendations, getRecommendations, isComplete } from "../../lib/recommendation";
import CreditCardVisual from "../../components/CreditCardVisual";
import { TINT_BY_CATEGORY } from "../../components/CreditCard";
import SaveCardButton from "../../components/SaveCardButton";

function formatFee(fee) {
  if (fee === 0) return "Lifetime Free";
  const total = Math.round(fee * 1.18);
  return `₹${total.toLocaleString("en-IN")}/yr (₹${fee.toLocaleString("en-IN")} + 18% GST)`;
}

export default function ResultsPage() {
  const [profile, setProfile] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const requestedSource = searchParams.get("source");

      const rawProfile = window.localStorage.getItem("cardwise:profile");
      const parsedProfile = rawProfile ? JSON.parse(rawProfile) : null;

      const rawAnswers = window.localStorage.getItem("cardwise:answers");
      const parsedAnswers = rawAnswers ? JSON.parse(rawAnswers) : null;
      const answersComplete = Boolean(parsedAnswers && isComplete(parsedAnswers));

      if (requestedSource === "quiz" && answersComplete) {
        setQuizAnswers(parsedAnswers);
        setProfile(null);
        setActiveSource("quiz");
      } else if (parsedProfile) {
        setProfile(parsedProfile);
        setQuizAnswers(null);
        setActiveSource("profile");
      } else if (answersComplete) {
        setQuizAnswers(parsedAnswers);
        setProfile(null);
        setActiveSource("quiz");
      } else {
        setProfile(null);
        setQuizAnswers(null);
        setActiveSource(null);
      }
    } catch {
      setProfile(null);
      setQuizAnswers(null);
      setActiveSource(null);
    }
    setReady(true);
  }, []);

  const recResult = ready && activeSource === "profile" && profile
    ? getProfileRecommendations(cards, profile, 3)
    : ready && activeSource === "quiz" && quizAnswers
    ? getRecommendations(cards, quizAnswers, 3)
    : { recommended: [], meaningfulDifferences: [], existingOverlap: [], noFitReason: null, noFitDetails: null };

  const { recommended, meaningfulDifferences, existingOverlap, noFitReason, noFitDetails } = recResult;

  const allSlugs = recommended.map((r) => r.card.slug).join(",");

  if (!ready) {
    return (
      <div className="cw-rail min-h-[60vh] flex items-center justify-center bg-[#FBFBFB]">
        <p className="text-xs font-medium text-neutral-400 animate-pulse">Evaluating verified cards against your profile…</p>
      </div>
    );
  }

  // ---------------- No Profile State ----------------
  if (!activeSource) {
    return (
      <div className="cw-rail min-h-[75vh] flex items-center justify-center bg-[#FBFBFB]">
        <div className="cw-container py-20 max-w-lg mx-auto text-center px-4">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 shadow-xs">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Spending Profile Required
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              No spending profile found
            </h1>
            <p className="text-sm text-neutral-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
              Answer five quick questions or complete our guided onboarding to see which verified cards fit your actual spending.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/recommend"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Take 5-Question Quiz
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                Full Onboarding
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Graceful No-Result State ----------------
  if (noFitReason) {
    return (
      <div className="cw-rail min-h-screen bg-[#FBFBFB]">
        <div className="cw-container py-16 md:py-24 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 shadow-xs text-left">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              Curation Standard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {noFitDetails?.title || "No verified card clearly fits your profile right now"}
            </h1>
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
              {noFitDetails?.explanation || noFitReason}
            </p>

            {/* Specific conflicting constraints */}
            {noFitDetails?.conflictReasons && noFitDetails.conflictReasons.length > 0 && (
              <div className="mt-6 rounded-xl border border-neutral-200/70 bg-neutral-50/80 p-5 text-xs">
                <p className="font-semibold text-neutral-900 mb-2">
                  Factors behind this decision:
                </p>
                <ul className="space-y-2 text-neutral-700 list-disc list-inside">
                  {noFitDetails.conflictReasons.map((r, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Constructive guidance */}
            {noFitDetails?.suggestion && (
              <div className="mt-5 rounded-xl border border-neutral-200/70 bg-white p-5 text-xs text-neutral-600">
                <p className="font-semibold text-neutral-900 mb-1">Constructive guidance:</p>
                <p className="leading-relaxed">{noFitDetails.suggestion}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-neutral-100 text-xs text-neutral-500 leading-relaxed space-y-1">
              <p className="font-medium text-neutral-800">The CreditWise Promise:</p>
              <p>
                We do not push unsuitable cards merely to populate results. When your existing payment setup is already sufficient, candid disclosure is the most valuable recommendation.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={activeSource === "quiz" ? "/recommend" : "/onboarding"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {activeSource === "quiz" ? "Adjust quiz answers" : "Adjust profile & preferences"}
              </Link>
              <Link
                href="/cards"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                Browse all 31 verified cards
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Calm Editorial Recommendations List ----------------
  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        {/* 1. Short heading & 2. Concise sentence */}
        <header className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1.5">
                Recommendation
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                Cards that fit how you spend
              </h1>
            </div>
            <Link
              href={activeSource === "quiz" ? "/recommend" : "/onboarding"}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:border-black hover:text-black transition-colors shrink-0"
            >
              <RotateCcw className="h-3 w-3" />
              {activeSource === "quiz" ? "Retake quiz" : "Adjust profile"}
            </Link>
          </div>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-500 max-w-2xl leading-relaxed">
            Based on where your money naturally goes each month, these verified cards offer high suitability without encouraging unnecessary spending.
          </p>
          <div className="mt-3 sm:hidden">
            <Link
              href={activeSource === "quiz" ? "/recommend" : "/onboarding"}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-black"
            >
              <RotateCcw className="h-3 w-3" />
              {activeSource === "quiz" ? "Retake quiz" : "Adjust profile"}
            </Link>
          </div>
        </header>

        {/* Existing Card Wallet Synergy Banner */}
        {existingOverlap.length > 0 && (
          <div className="mb-10 rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 text-xs text-neutral-600 shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-neutral-900 mb-1.5">
              <Info className="h-4 w-4 text-neutral-500 shrink-0" />
              <span>Wallet context</span>
            </div>
            {existingOverlap.map((o, idx) => (
              <p key={idx} className="leading-relaxed text-neutral-600 mb-1 last:mb-0">
                {o.message}
              </p>
            ))}
            <p className="mt-2 text-[11px] text-neutral-400">
              The recommendations below are selected specifically to complement what you already hold.
            </p>
          </div>
        )}

        {/* Meaningful Differences Between Recommended Cards */}
        {recommended.length > 1 && (
          <section className="mb-12 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
              Overview
            </div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
              How these options differ for your spending
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
              Each card serves a distinct role in your wallet. Here is how they compare based on your natural expenses:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meaningfulDifferences.map((diff) => (
                <div
                  key={diff.cardSlug}
                  className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        {diff.fitTier}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {diff.rewardModel}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mb-1">
                      {diff.cardName}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                      {diff.focus}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-medium">{diff.feeNote}</span>
                    <Link
                      href={`/compare?cards=${allSlugs}`}
                      className="font-semibold text-neutral-900 hover:underline"
                    >
                      Compare →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Recommended Cards */}
        <div className="space-y-10 mb-16">
          {recommended.map((item, itemIdx) => {
            const { card, whyItFitsYou, whatToWatchFor, fitTier, coverageArea } = item;

            // Curate 2 to 3 meaningful verified benefits
            const keyBenefits = (card.benefits && card.benefits.length > 0
              ? card.benefits.slice(0, 3)
              : [card.shortDescription]
            );

            return (
              <article
                key={card.slug}
                className="rounded-2xl border border-neutral-200/80 bg-white p-7 sm:p-9 shadow-xs transition-all hover:border-neutral-300"
              >
                {/* Mobile Header: Displays Card Name and Fit Badge on small screens before visual */}
                <div className="md:hidden mb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
                        {fitTier}
                      </span>
                      {coverageArea && (
                        <span className="text-[10px] font-medium text-neutral-500 bg-neutral-50 border border-neutral-200/60 px-2 py-0.5 rounded">
                          {coverageArea}
                        </span>
                      )}
                    </div>
                    <SaveCardButton slug={card.slug} name={card.name} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 mt-1">
                    <Link href={`/cards/${card.slug}`} className="hover:underline">
                      {card.name}
                    </Link>
                  </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-[260px_1fr] items-start">
                  {/* Real Card Image as Visual Focus */}
                  <div className="flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-3 text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      <span>{card.issuer}</span>
                      {card.network && <span>{card.network}</span>}
                    </div>

                    <div className="w-full flex justify-center">
                      <CreditCardVisual
                        issuer={card.issuer || card.bank}
                        name={card.name}
                        image={card.image}
                        orientation={card.orientation || "horizontal"}
                        size="sm"
                        priority={itemIdx === 0}
                        className="w-full max-w-[260px]"
                      />
                    </div>

                    {/* Annual Fee Block with GST Transparency */}
                    <div className="mt-4 text-center w-full pt-3 border-t border-neutral-100">
                      {card.annualFee === 0 ? (
                        <p className="text-xs font-bold text-emerald-700">Lifetime Free</p>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-neutral-900">
                            ₹{Math.round(card.annualFee * 1.18).toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] font-normal text-neutral-500">total / yr</span>
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            ₹{card.annualFee.toLocaleString("en-IN")} + 18% GST
                          </p>
                        </div>
                      )}
                      {card.feeWaiver && card.annualFee > 0 && (
                        <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                          <strong>Waiver:</strong> {card.feeWaiver}
                        </p>
                      )}
                      {card.officialUrl && (
                        <a
                          href={card.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-black mt-2 transition-colors"
                        >
                          Official bank details
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Editorial Content */}
                  <div>
                    {/* Header Row: Fit Label + Save Button (Desktop Only) */}
                    <div className="hidden md:flex items-start justify-between gap-4 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
                          {fitTier}
                        </span>
                        {coverageArea && (
                          <span className="text-[10px] font-medium text-neutral-500 bg-neutral-50 border border-neutral-200/60 px-2 py-0.5 rounded">
                            {coverageArea}
                          </span>
                        )}
                      </div>
                      <SaveCardButton slug={card.slug} name={card.name} />
                    </div>

                    {/* Card Name (Desktop Only) */}
                    <h2 className="hidden md:block text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                      <Link href={`/cards/${card.slug}`} className="hover:underline">
                        {card.name}
                      </Link>
                    </h2>

                    {/* Short "Good for" statement */}
                    {card.goodFor && (
                      <p className="text-xs sm:text-sm font-medium text-neutral-700 mt-1.5">
                        Good for: {card.goodFor}
                      </p>
                    )}

                    {/* Meaningful Benefits (2-3 items) */}
                    <div className="mt-4 mb-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Key benefits
                      </p>
                      <ul className="space-y-1 text-xs text-neutral-600">
                        {keyBenefits.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-neutral-400 mt-0.5">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* WHY IT FITS YOU */}
                    <div className="rounded-xl bg-[#F9F9F9] border border-neutral-200/70 p-4 sm:p-5 mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                        Why it fits you
                      </p>
                      <ul className="space-y-2 text-xs sm:text-sm text-neutral-800">
                        {whyItFitsYou.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2.5 leading-relaxed font-medium">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ESTIMATED ANNUAL VALUE BREAKDOWN */}
                    {item.valueBreakdown && (
                      <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 sm:p-5 mb-4 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-neutral-200/60">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                              Realistic Net Value
                            </span>
                            <span className="text-base sm:text-lg font-extrabold text-neutral-950 font-mono tracking-tight">
                              ~₹{Math.max(0, item.netValue || 0).toLocaleString("en-IN")}
                              <span className="text-xs font-normal font-sans text-neutral-500"> / year</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-medium text-neutral-400 block">
                              Reward Model
                            </span>
                            <span className="text-xs font-semibold text-neutral-700">
                              {item.valueBreakdown.rewardType === "cashback" ? "Direct Statement Cashback" : "Reward Points / Air Miles"}
                            </span>
                          </div>
                        </div>

                        {/* Value Arithmetic */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3 text-[11px]">
                          <div className="bg-white p-2.5 rounded-lg border border-neutral-200/60">
                            <span className="text-neutral-400 block text-[10px]">Est. Gross Rewards</span>
                            <span className="font-bold text-neutral-900 font-mono">
                              ₹{(item.grossRewards || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-neutral-200/60">
                            <span className="text-neutral-400 block text-[10px]">Annual Fee Offset</span>
                            <span className="font-bold text-neutral-900 font-mono">
                              {item.feeWaived ? "₹0 (Waived)" : `−₹${(item.applicableFee || 0).toLocaleString("en-IN")}`}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-1 bg-white p-2.5 rounded-lg border border-neutral-200/60">
                            <span className="text-neutral-400 block text-[10px]">Effective Return</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              ~{item.valueBreakdown.effectiveReturnPercent}% on spends
                            </span>
                          </div>
                        </div>

                        {/* Top contributing spend categories */}
                        {item.valueBreakdown.topContributors && item.valueBreakdown.topContributors.length > 0 && (
                          <div className="text-[11px] text-neutral-600 mb-2">
                            <span className="font-semibold text-neutral-800">Primary earnings from: </span>
                            {item.valueBreakdown.topContributors.join(" and ")}.
                          </div>
                        )}

                        {/* Fee Waiver & Valuation Assumption Footnote */}
                        <div className="pt-2 border-t border-neutral-200/50 text-[10px] text-neutral-500 space-y-0.5 leading-relaxed">
                          <p>
                            <span className="font-semibold text-neutral-700">Fee Condition: </span>
                            {item.waiverStatusText}
                          </p>
                          {item.valueBreakdown.rewardType !== "cashback" && (
                            <p>
                              <span className="font-semibold text-neutral-700">Redemption Assumption: </span>
                              {item.valueBreakdown.pointValuationLabel}. Actual value varies based on transfer partners and flights.
                            </p>
                          )}
                          <p className="text-[9.5px] text-neutral-400">
                            *Educational estimate based on your declared monthly spending. Subject to merchant category exclusions (fuel/rent/wallet) and bank terms.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* WHAT TO WATCH FOR */}
                    <div className="rounded-xl bg-amber-50/30 border border-amber-200/60 p-4 sm:p-5 mb-6">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          What to watch for
                        </p>
                      </div>
                      <ul className="space-y-1.5 text-xs text-neutral-700 font-medium">
                        {whatToWatchFor.map((drawback, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{drawback}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions: View card & Compare */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-100">
                      <Link
                        href={`/cards/${card.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                      >
                        View card
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <Link
                        href={`/compare?cards=${card.slug}${allSlugs ? `,${allSlugs}` : ""}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
                      >
                        <Scale className="h-3.5 w-3.5 opacity-70" />
                        Compare
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Compare All Button if multiple recommended */}
        {recommended.length > 1 && (
          <div className="mb-14 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Compare all {recommended.length} recommended cards
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Inspect annual fees, lounge access, and rewards side by side in a single table.
              </p>
            </div>
            <Link
              href={`/compare?cards=${allSlugs}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:border-black hover:text-black transition-colors shrink-0"
            >
              Open side-by-side comparison
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* ---------------- Transparency Notice ---------------- */}
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-xs text-neutral-500 leading-relaxed shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-semibold uppercase tracking-wider text-[11px] mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            CreditWise Standards & Underwriting Notice
          </div>
          <p className="mb-2">
            • <strong>Independent Editorial Matching:</strong> CreditWise provides independent analysis based exclusively on verified card terms and your spending profile. We do not accept sponsored placements or optimize for card applications.
          </p>
          <p className="mb-2">
            • <strong>Issuer Authority:</strong> Final card approval, credit line assignment, and interest rates are determined exclusively by the issuing bank based on their proprietary underwriting criteria and credit bureau records.
          </p>
          <p>
            • <strong>Verified Terms:</strong> Bank reward structures, caps, and lounge quotas are audited regularly. Always review the canonical schedule on the official issuer website prior to applying.
          </p>
        </section>
      </div>
    </div>
  );
}
