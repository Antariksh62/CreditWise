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
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import cards from "../../data/cards.json";
import { getProfileRecommendations, getRecommendations, isComplete } from "../../lib/recommendation";
import CreditCardVisual from "../../components/CreditCardVisual";
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
  const [selectedCardCount, setSelectedCardCount] = useState(1);

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Feedback State
  const [feedbackSatisfaction, setFeedbackSatisfaction] = useState(null);
  const [feedbackReasons, setFeedbackReasons] = useState([]);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [feedbackConsent, setFeedbackConsent] = useState(true);
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Pseudonymous session ID for feedback & session logging
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    try {
      let storedSessionId = window.localStorage.getItem("cardwise:session_id");
      if (!storedSessionId) {
        storedSessionId = "cw_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
        window.localStorage.setItem("cardwise:session_id", storedSessionId);
      }
      setSessionId(storedSessionId);

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
        const count = Number(parsedAnswers.cardCount) || 1;
        setSelectedCardCount(Math.min(3, Math.max(1, count)));
      } else if (parsedProfile) {
        setProfile(parsedProfile);
        setQuizAnswers(null);
        setActiveSource("profile");
        const count = Number(parsedProfile.preferences?.cardCount || parsedProfile.cardCount) || 1;
        setSelectedCardCount(Math.min(3, Math.max(1, count)));
      } else if (answersComplete) {
        setQuizAnswers(parsedAnswers);
        setProfile(null);
        setActiveSource("quiz");
        const count = Number(parsedAnswers.cardCount) || 1;
        setSelectedCardCount(Math.min(3, Math.max(1, count)));
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

  // Compute recommendations
  const recResult = ready && activeSource === "profile" && profile
    ? getProfileRecommendations(cards, profile, selectedCardCount)
    : ready && activeSource === "quiz" && quizAnswers
    ? getRecommendations(cards, quizAnswers, selectedCardCount)
    : { recommended: [], combination: null, allCountOptions: {}, meaningfulDifferences: [], existingOverlap: [], noFitReason: null, noFitDetails: null };

  const { noFitReason, noFitDetails } = recResult;

  // Active combination for the selected card count (1, 2, or 3)
  const currentCombo =
    (recResult.allCountOptions &&
      (recResult.allCountOptions[selectedCardCount]?.best ||
        recResult.allCountOptions[selectedCardCount])) ||
    recResult.combination;
  const currentCards =
    currentCombo?.cards?.map((c) => c.card || c) ||
    (recResult.recommended || []).map((r) => r.card || r);
  const allSlugs = currentCards.map((c) => c.slug).join(",");

  // Log recommendation session pseudonymously
  useEffect(() => {
    if (!ready || !sessionId || !currentCombo || currentCards.length === 0) return;
    try {
      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_session",
          sessionId,
          cardCountSelected: selectedCardCount,
          spendingSummary: profile?.spending?.categories || {},
          recommendedCardSlugs: currentCards.map((c) => c.slug),
          totalGrossRewards: currentCombo.grossRewards || 0,
          totalAnnualFees: currentCombo.totalFees || 0,
          netMonetaryValue: currentCombo.netValue || 0,
        }),
      }).catch(() => {});
    } catch {
      // non-blocking
    }
  }, [ready, sessionId, selectedCardCount, allSlugs, currentCombo]);

  // Fetch AI explanation layer for the active combination
  useEffect(() => {
    if (!ready || !currentCombo || currentCards.length === 0) return;

    let isMounted = true;
    setIsExplaining(true);

    const spendObj = profile?.spending?.categories || (quizAnswers ? {
      dining: quizAnswers.spendArea === "dining" ? 15000 : 4000,
      shopping: quizAnswers.spendArea === "online" ? 20000 : 5000,
      fuel: quizAnswers.spendArea === "fuel" ? 10000 : 2000,
      travel: quizAnswers.spendArea === "travel" ? 20000 : 3000,
      groceries: 8000,
    } : {});

    fetch("/api/explain-recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cards: currentCards,
        spending: spendObj,
        cardCount: selectedCardCount,
        netMonetaryValue: currentCombo.netValue || 0,
        grossRewards: currentCombo.grossRewards || 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.explanation) {
          setAiExplanation(data.explanation);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsExplaining(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ready, selectedCardCount, allSlugs, currentCombo]);

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (!feedbackSatisfaction || !feedbackConsent) return;
    setFeedbackSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          satisfaction: feedbackSatisfaction,
          dissatisfactionReasons: feedbackReasons,
          userNotes: feedbackNotes,
          consentGranted: feedbackConsent,
        }),
      });
      setFeedbackSubmitted(true);
    } catch {
      // non-blocking
      setFeedbackSubmitted(true);
    } finally {
      setFeedbackSubmitting(false);
    }
  }

  function toggleFeedbackReason(reason) {
    setFeedbackReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  }

  if (!ready) {
    return (
      <div className="cw-rail min-h-[60vh] flex items-center justify-center bg-[#FBFBFB]">
        <p className="text-xs font-medium text-neutral-400 animate-pulse">
          Evaluating verified cards against your profile…
        </p>
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
              Complete our guided questionnaire or quick quiz to evaluate verified card combinations tailored to your natural expenses.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/recommend"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Quick 6-Question Quiz
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                Full Onboarding Flow
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
              {noFitDetails?.title || "No verified card combination clearly fits your profile"}
            </h1>
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
              {noFitDetails?.explanation || noFitReason}
            </p>

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

            {noFitDetails?.suggestion && (
              <div className="mt-5 rounded-xl border border-neutral-200/70 bg-white p-5 text-xs text-neutral-600">
                <p className="font-semibold text-neutral-900 mb-1">Constructive guidance:</p>
                <p className="leading-relaxed">{noFitDetails.suggestion}</p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={activeSource === "quiz" ? "/recommend" : "/onboarding"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Adjust inputs & preferences
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

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1.5">
                Recommendation System
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
            Every recommendation is calculated from verified bank reward terms and your natural expenses. Spending is routed across cards to maximize net value without double-counting.
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

        {/* Card Count Selection Tabs */}
        <div className="mb-8 rounded-2xl border border-neutral-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Portfolio Architecture
              </span>
              <p className="text-xs font-semibold text-neutral-800">
                Compare optimal combinations across 1, 2, or 3 cards:
              </p>
            </div>
            <span className="text-[11px] text-neutral-400">
              Instant optimization recalculation
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { count: 1, label: "1 Card", desc: "Single-Card Simplicity" },
              { count: 2, label: "2 Cards", desc: "Strategic Pairing" },
              { count: 3, label: "3 Cards", desc: "Full Optimization" },
            ].map((tab) => {
              const isActive = selectedCardCount === tab.count;
              const comboOpt = recResult.allCountOptions?.[tab.count];
              const comboForTab = comboOpt?.best || comboOpt;
              const netVal = Math.max(0, comboForTab?.netValue ?? 0);

              return (
                <button
                  key={tab.count}
                  type="button"
                  onClick={() => setSelectedCardCount(tab.count)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-black bg-black text-white shadow-sm ring-1 ring-black"
                      : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold">{tab.label}</span>
                    {isActive && (
                      <Check className="h-3.5 w-3.5 text-[#DDF247]" strokeWidth={3} />
                    )}
                  </div>
                  <span className={`text-[10px] block mt-0.5 truncate ${isActive ? "text-neutral-300" : "text-neutral-500"}`}>
                    {tab.desc}
                  </span>
                  <span className={`text-[11px] font-mono font-bold block mt-1.5 ${isActive ? "text-[#DDF247]" : "text-neutral-900"}`}>
                    ~₹{netVal.toLocaleString("en-IN")}/yr
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Summary Card */}
        {currentCombo && (
          <section className="mb-10 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5">
                  Portfolio Analysis
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {selectedCardCount === 1
                    ? "Recommended 1-Card Setup"
                    : selectedCountText(selectedCardCount)}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                  {currentCards.length} verified {currentCards.length === 1 ? "card" : "cards"}
                </span>
                <Link
                  href={`/compare?cards=${allSlugs}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-black border border-neutral-200 px-2.5 py-1 rounded-full transition-colors"
                >
                  <Scale className="h-3 w-3" />
                  Compare {currentCards.length}
                </Link>
              </div>
            </div>

            {/* 4 Metric Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Net Annual Value
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-mono block mt-1">
                  ₹{Math.max(0, currentCombo.netValue || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  after out-of-pocket fees
                </span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Est. Gross Rewards
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-mono block mt-1">
                  ₹{(currentCombo.grossRewards || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  earned across all categories
                </span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Total Annual Fees
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-mono block mt-1">
                  {currentCombo.totalFees === 0 ? "₹0" : `₹${currentCombo.totalFees.toLocaleString("en-IN")}`}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {currentCombo.totalFees === 0 ? "Waivers/LTF applied" : "inclusive of 18% GST"}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Effective Return
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono block mt-1">
                  ~{currentCombo.effectiveReturn || "0.0%"}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  net return on spend
                </span>
              </div>
            </div>

            {/* AI Explanation & Synergy Notes */}
            <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/60 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-neutral-800 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Wallet Synergy & Strategic Fit
                </h3>
              </div>

              {aiExplanation ? (
                <div className="space-y-2 text-xs text-neutral-700 leading-relaxed">
                  <p className="font-medium text-neutral-900">
                    {aiExplanation.portfolioSummary}
                  </p>
                  {aiExplanation.roles && (
                    <ul className="space-y-1.5 pt-1">
                      {aiExplanation.roles.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0 mt-0.5" />
                          <span>
                            <strong>{r.cardName}:</strong> {r.role} ({r.bestCategories})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {aiExplanation.limitations && (
                    <p className="text-[11px] text-neutral-500 pt-1">
                      <strong>Watch for:</strong> {aiExplanation.limitations}
                    </p>
                  )}
                </div>
              ) : currentCombo.synergyNotes && currentCombo.synergyNotes.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-neutral-700 leading-relaxed">
                  {currentCombo.synergyNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-neutral-900 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-600 leading-relaxed">
                  This setup is mathematically selected from 31 verified cards to yield the highest net monetary value for your specific spending distribution.
                </p>
              )}
            </div>
          </section>
        )}

        {/* Spend Routing & Optimization Matrix */}
        {currentCombo && currentCombo.allocations && (
          <section className="mb-12 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5">
                Zero Double-Counting
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Spend Routing & Category Allocation
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                To prevent false calculations, every rupee of your monthly spend is routed to exactly one card that provides the highest verified return for that category:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 pr-4">Category</th>
                    <th className="py-2.5 px-4">Your Spend</th>
                    <th className="py-2.5 px-4">Routed To</th>
                    <th className="py-2.5 px-4 text-right">Reward Rate</th>
                    <th className="py-2.5 pl-4 text-right">Est. Earn/Mo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {Object.entries(currentCombo.allocations).map(([catKey, alloc]) => {
                    const label = formatCategoryLabel(catKey);
                    const spendVal = alloc.monthlySpend ?? alloc.spend ?? 0;
                    const rateVal = alloc.effectiveRate ?? alloc.rate ?? 0;
                    const earnVal = alloc.monthlyRewards ?? alloc.monthlyEarn ?? 0;
                    const isAccelerated = alloc.rateType === "accelerated" || rateVal >= 2.0;

                    return (
                      <tr key={catKey} className="hover:bg-neutral-50/50">
                        <td className="py-3 pr-4 font-semibold text-neutral-900">
                          {label}
                        </td>
                        <td className="py-3 px-4 font-mono text-neutral-600">
                          ₹{spendVal.toLocaleString("en-IN")}/mo
                        </td>
                        <td className="py-3 px-4 text-neutral-800 font-medium">
                          {alloc.cardName}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold">
                          <span
                            className={
                              isAccelerated
                                ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]"
                                : "text-neutral-600"
                            }
                          >
                            {rateVal > 1 ? `${rateVal.toFixed(1)}%` : `${(rateVal * 100).toFixed(1)}%`}
                          </span>
                        </td>
                        <td className="py-3 pl-4 text-right font-mono font-bold text-neutral-900">
                          ₹{Math.round(earnVal).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Detailed Card Articles */}
        <div className="space-y-10 mb-16">
          {currentCards.map((card, itemIdx) => {
            const breakdown =
              currentCombo?.cards?.find((b) => b.slug === card.slug) ||
              currentCombo?.cardBreakdowns?.find((b) => b.slug === card.slug);
            const keyBenefits = card.benefits && card.benefits.length > 0 ? card.benefits.slice(0, 3) : [card.shortDescription];

            return (
              <article
                key={card.slug}
                className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 md:p-9 shadow-xs transition-all hover:border-neutral-300"
              >
                {/* Mobile Header */}
                <div className="md:hidden mb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
                      Card #{itemIdx + 1} in Setup
                    </span>
                    <SaveCardButton slug={card.slug} name={card.name} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 mt-1">
                    <Link href={`/cards/${card.slug}`} className="hover:underline">
                      {card.name}
                    </Link>
                  </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-[260px_1fr] items-start min-w-0">
                  {/* Left Column: Real Card Visual + Fees */}
                  <div className="flex flex-col items-center min-w-0 w-full">
                    <div className="w-full flex items-center justify-between mb-3 text-[10px] uppercase font-semibold tracking-wider text-neutral-400">
                      <span>{card.issuer}</span>
                      {card.network && <span>{card.network}</span>}
                    </div>

                    <Link
                      href={`/cards/${card.slug}`}
                      aria-label={`View full review of ${card.name}`}
                      prefetch={true}
                      className="w-full flex justify-center cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <CreditCardVisual
                        issuer={card.issuer || card.bank}
                        name={card.name}
                        image={card.image}
                        orientation={card.orientation || "horizontal"}
                        size="sm"
                        priority={itemIdx === 0}
                        className="w-full max-w-[260px]"
                      />
                    </Link>

                    {/* Annual Fee Block */}
                    <div className="mt-4 text-center w-full pt-3 border-t border-neutral-100">
                      {(card.annualFee ?? 0) === 0 ? (
                        <p className="text-xs font-bold text-emerald-700">Lifetime Free</p>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-neutral-900">
                            ₹{Math.round((card.annualFee || 0) * 1.18).toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] font-normal text-neutral-500">total / yr</span>
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                            ₹{(card.annualFee || 0).toLocaleString("en-IN")} + 18% GST
                          </p>
                        </div>
                      )}

                      {breakdown && (
                        <div className="mt-2 text-[11px] leading-snug">
                          <span className={`font-semibold ${breakdown.feeWaived ? "text-emerald-700" : "text-neutral-600"}`}>
                            {breakdown.waiverNote}
                          </span>
                        </div>
                      )}

                      {card.officialUrl && (
                        <a
                          href={card.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-black mt-2.5 transition-colors"
                        >
                          Official bank details
                          <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Editorial & Value Breakdown */}
                  <div>
                    {/* Desktop Header */}
                    <div className="hidden md:flex items-start justify-between gap-4 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
                        Card #{itemIdx + 1} of {currentCards.length}
                      </span>
                      <SaveCardButton slug={card.slug} name={card.name} />
                    </div>

                    <h2 className="hidden md:block text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                      <Link href={`/cards/${card.slug}`} className="hover:underline">
                        {card.name}
                      </Link>
                    </h2>

                    {card.goodFor && (
                      <p className="text-xs sm:text-sm font-medium text-neutral-700 mt-1.5">
                        Good for: {card.goodFor}
                      </p>
                    )}

                    {/* Key Benefits */}
                    <div className="mt-4 mb-4">
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

                    {/* Allocated Performance for this Card */}
                    {breakdown && (
                      <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 mb-4 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                          Performance in this Setup
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          <div className="bg-white p-2.5 rounded-lg border border-neutral-200/60">
                            <span className="text-neutral-400 block text-[10px]">Monthly Allocated Spend</span>
                            <span className="font-bold text-neutral-900 font-mono">
                              ₹{(breakdown.allocatedMonthlySpend ?? breakdown.allocatedSpend ?? 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-neutral-200/60">
                            <span className="text-neutral-400 block text-[10px]">Est. Annual Earn</span>
                            <span className="font-bold text-neutral-900 font-mono">
                              ₹{(breakdown.annualGrossRewards ?? breakdown.yearlyRewards ?? 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-1 bg-white p-2.5 rounded-lg border border-neutral-200/60">
                            <span className="text-neutral-400 block text-[10px]">Net Contribution</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              +₹{Math.max(0, breakdown.netValue ?? breakdown.netContribution ?? 0).toLocaleString("en-IN")}/yr
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* What to Watch for */}
                    {card.limitations && card.limitations.length > 0 && (
                      <div className="rounded-xl bg-amber-50/30 border border-amber-200/60 p-4 mb-5">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                            What to watch for
                          </p>
                        </div>
                        <ul className="space-y-1 text-xs text-neutral-700 font-medium">
                          {card.limitations.slice(0, 2).map((drawback, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{drawback}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-100">
                      <Link
                        href={`/cards/${card.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                      >
                        View card details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <Link
                        href={`/compare?cards=${card.slug}${allSlugs ? `,${allSlugs}` : ""}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
                      >
                        <Scale className="h-3.5 w-3.5 opacity-70" />
                        Compare
                      </Link>

                      {card.officialUrl && (
                        <a
                          href={card.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black ml-auto transition-colors"
                        >
                          Apply on issuer site
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Feedback & Consent Widget */}
        <section className="mb-14 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Feedback & System Learning
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              How well does this recommendation fit your expectations?
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Your feedback helps refine our deterministic spend-routing and portfolio synergy models.
            </p>

            {feedbackSubmitted ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-900 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Thank you! Your feedback has been recorded pseudonymously to improve future recommendations.
                </span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mt-5 space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: "satisfied", label: "Helpful / Good Fit" },
                    { id: "neutral", label: "Neutral / Partially Fits" },
                    { id: "dissatisfied", label: "Not What I Needed" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setFeedbackSatisfaction(btn.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                        feedbackSatisfaction === btn.id
                          ? "bg-black text-white"
                          : "border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {feedbackSatisfaction && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Optional context:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Clear spend routing",
                        "Accurate fee waiver math",
                        "Synergy made sense",
                        "Prefer simpler rewards",
                        "Fees too high",
                        "Already familiar with these",
                      ].map((reason) => {
                        const isSelected = feedbackReasons.includes(reason);
                        return (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => toggleFeedbackReason(reason)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                              isSelected
                                ? "bg-neutral-900 text-white"
                                : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                            }`}
                          >
                            {reason}
                          </button>
                        );
                      })}
                    </div>

                    <textarea
                      rows={2}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="Any specific note on why this setup works or doesn't work for you? (Optional)"
                      className="w-full rounded-lg border border-neutral-200 bg-white p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-neutral-600 pt-1">
                      <input
                        type="checkbox"
                        checked={feedbackConsent}
                        onChange={(e) => setFeedbackConsent(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300 text-black focus:ring-black"
                      />
                      <span>
                        I consent to storing pseudonymous session and feedback data to improve recommendation algorithms in compliance with the Privacy Policy.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={feedbackSubmitting || !feedbackConsent}
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                      {feedbackSubmitting ? "Recording…" : "Submit Feedback"}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </section>

        {/* Transparency Notice */}
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

function selectedCountText(count) {
  if (count === 1) return "Recommended 1-Card Setup";
  if (count === 2) return "Recommended 2-Card Strategic Pairing";
  return "Recommended 3-Card Optimized Portfolio";
}

function formatCategoryLabel(key) {
  const map = {
    groceries: "Groceries & Supermarket",
    dining: "Dining & Food Delivery",
    fuel: "Fuel & EV Charging",
    travel: "Travel, Flights & Hotels",
    shopping: "Shopping (Online & Retail)",
    utilities: "Utilities & Bills",
    entertainment: "Entertainment & Outings",
    subscriptions: "Subscriptions & Digital",
    other: "Other Everyday Expenses",
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
