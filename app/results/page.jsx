"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  SlidersHorizontal,
  Printer,
  X,
  Layers,
  FileText,
  Clock,
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
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [ready, setReady] = useState(false);
  const [selectedCardCount, setSelectedCardCount] = useState(1);
  const [user, setUser] = useState(null);

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // What-If Spend Adjuster State
  const [adjustedSpend, setAdjustedSpend] = useState(null);
  const [showAdjuster, setShowAdjuster] = useState(false);

  // Strategy Sheet Modal State
  const [showStrategySheet, setShowStrategySheet] = useState(false);

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

      // Check stored user session
      try {
        const rawUser = window.localStorage.getItem("cardwise:user");
        const parsedUser = rawUser ? JSON.parse(rawUser) : null;
        if (parsedUser && (parsedUser.email || parsedUser.username || parsedUser.fullName)) {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }

      const searchParams = new URLSearchParams(window.location.search);
      const requestedSource = searchParams.get("source");

      const rawProfile = window.localStorage.getItem("cardwise:profile");
      const parsedProfile = rawProfile ? JSON.parse(rawProfile) : null;

      const rawAnswers = window.localStorage.getItem("cardwise:answers");
      const parsedAnswers = rawAnswers ? JSON.parse(rawAnswers) : null;
      const answersComplete = Boolean(parsedAnswers && isComplete(parsedAnswers));

      // Read previously chosen card count if persisted
      const savedCardCount = window.localStorage.getItem("cardwise:selected_card_count");
      const storedCount = Number(savedCardCount);

      if (requestedSource === "quiz" && answersComplete) {
        setQuizAnswers(parsedAnswers);
        setProfile(null);
        setActiveSource("quiz");
        const defaultCount = Number(parsedAnswers.cardCount) || 1;
        const count = storedCount >= 1 && storedCount <= 3 ? storedCount : defaultCount;
        setSelectedCardCount(Math.min(3, Math.max(1, count)));
      } else if (parsedProfile) {
        setProfile(parsedProfile);
        setQuizAnswers(null);
        setActiveSource("profile");
        const defaultCount = Number(parsedProfile.preferences?.cardCount || parsedProfile.cardCount) || 1;
        const count = storedCount >= 1 && storedCount <= 3 ? storedCount : defaultCount;
        setSelectedCardCount(Math.min(3, Math.max(1, count)));
      } else if (answersComplete) {
        setQuizAnswers(parsedAnswers);
        setProfile(null);
        setActiveSource("quiz");
        const defaultCount = Number(parsedAnswers.cardCount) || 1;
        const count = storedCount >= 1 && storedCount <= 3 ? storedCount : defaultCount;
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

  function handleSelectCardCount(count) {
    const clamped = Math.min(3, Math.max(1, Number(count) || 1));
    setSelectedCardCount(clamped);
    try {
      window.localStorage.setItem("cardwise:selected_card_count", String(clamped));
      if (profile) {
        const updated = {
          ...profile,
          cardCount: clamped,
          preferences: { ...(profile.preferences || {}), cardCount: clamped },
        };
        setProfile(updated);
        window.localStorage.setItem("cardwise:profile", JSON.stringify(updated));
      }
      if (quizAnswers) {
        const updatedAnswers = { ...quizAnswers, cardCount: clamped };
        setQuizAnswers(updatedAnswers);
        window.localStorage.setItem("cardwise:answers", JSON.stringify(updatedAnswers));
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch {}
  }

  function handleRestart() {
    try {
      window.localStorage.removeItem("cardwise:profile");
      window.localStorage.removeItem("cardwise:answers");
      window.localStorage.removeItem("cardwise:onboarding_draft");
      window.localStorage.removeItem("cardwise:quiz_draft");
      window.localStorage.removeItem("cardwise:selected_card_count");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch {}
    router.push(activeSource === "quiz" ? "/recommend" : "/onboarding");
  }

  const baseSpend = profile?.spending?.categories || (quizAnswers ? {
    dining: quizAnswers.spendArea === "dining" ? 15000 : 4000,
    shopping: quizAnswers.spendArea === "online" ? 20000 : 5000,
    fuel: quizAnswers.spendArea === "fuel" ? 10000 : 2000,
    travel: quizAnswers.spendArea === "travel" ? 20000 : 3000,
    groceries: quizAnswers.spendArea === "online" ? 8000 : 6000,
    utilities: 3000,
  } : {
    dining: 5000,
    shopping: 8000,
    fuel: 3000,
    travel: 5000,
    groceries: 6000,
    utilities: 3000,
  });

  const activeSpend = adjustedSpend || baseSpend;
  const totalActiveMonthlySpend = Object.values(activeSpend).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const effectiveProfile = {
    ...(profile || {
      cardCount: selectedCardCount,
      profile: {
        age: 25,
        incomeRange: quizAnswers?.monthlySpend === "over100k" ? "₹25L – ₹50L" : quizAnswers?.monthlySpend === "50to100k" ? "₹12L – ₹25L" : "₹6L – ₹12L",
        employment: "salaried",
      },
      preferences: {
        cardCount: selectedCardCount,
        priorities: [
          quizAnswers?.priority === "cashback" ? "Cashback" : "",
          quizAnswers?.priority === "travel" ? "Airport lounge access" : "",
          quizAnswers?.priority === "rewards" ? "Shopping" : "",
          quizAnswers?.priority === "lowfees" ? "Low/no annual fee" : "",
          quizAnswers?.priority === "fuel" ? "Fuel savings" : "",
          quizAnswers?.spendArea === "dining" ? "Dining" : "",
        ].filter(Boolean),
        rewardStyle: quizAnswers?.priority === "cashback" ? "simple" : quizAnswers?.priority === "travel" ? "optimizer" : "balanced",
        feeTolerance: quizAnswers?.feeSensitivity === "very" ? "no-fee" : quizAnswers?.feeSensitivity === "no" ? "high-fee" : "moderate-fee",
        travelFrequency: quizAnswers?.travelFrequency === "frequently" ? "Frequently" : quizAnswers?.travelFrequency === "rarely" ? "Rarely" : "Sometimes",
      },
    }),
    spending: {
      ...(profile?.spending || {}),
      categories: activeSpend,
      totalMonthly: totalActiveMonthlySpend,
    },
  };

  // Compute recommendations
  const recResult = ready && activeSource
    ? getProfileRecommendations(cards, effectiveProfile, selectedCardCount)
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

  const soloCombo = recResult.allCountOptions?.[1]?.best || recResult.allCountOptions?.[1];
  const soloNet = Math.max(0, soloCombo?.netValue ?? 0);
  const currentNet = Math.max(0, currentCombo?.netValue ?? 0);
  const incrementalGain = Math.max(0, currentNet - soloNet);
  const soloCard = soloCombo?.cards?.[0]?.card || soloCombo?.cards?.[0];
  const soloCardName = soloCard?.name || "a single all-rounder card";

  function handleSpendSliderChange(category, val) {
    setAdjustedSpend((prev) => ({
      ...(prev || baseSpend),
      [category]: Number(val),
    }));
  }

  function handleResetSpend() {
    setAdjustedSpend(null);
  }

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
          spendingSummary: activeSpend,
          recommendedCardSlugs: currentCards.map((c) => c.slug),
          totalGrossRewards: currentCombo.grossRewards || 0,
          totalAnnualFees: currentCombo.totalFees || 0,
          netMonetaryValue: currentCombo.netValue || 0,
        }),
      }).catch(() => {});
    } catch {
      // non-blocking
    }
  }, [ready, sessionId, selectedCardCount, allSlugs, currentCombo, activeSpend, currentCards]);

  // Fetch AI explanation layer for the active combination
  useEffect(() => {
    if (!ready || !currentCombo || currentCards.length === 0) return;

    let isMounted = true;
    setIsExplaining(true);

    const spendObj = activeSpend;

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
  }, [ready, selectedCardCount, allSlugs, currentCombo, activeSpend, currentCards]);

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
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Link
                href={activeSource === "quiz" ? "/recommend" : "/onboarding"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 hover:border-black hover:text-black transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                {activeSource === "quiz" ? "Retake quiz" : "Adjust profile"}
              </Link>
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1 rounded-lg border border-neutral-200/80 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-red-700 hover:border-red-200 transition-colors"
                title="Clear current profile and start fresh"
              >
                Restart
              </button>
            </div>
          </div>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-500 max-w-2xl leading-relaxed">
            Every recommendation is calculated from verified bank reward terms and your natural expenses. Spending is routed across cards to maximize net value without double-counting.
          </p>
          <div className="mt-3 flex items-center gap-2 sm:hidden">
            <Link
              href={activeSource === "quiz" ? "/recommend" : "/onboarding"}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-black"
            >
              <RotateCcw className="h-3 w-3" />
              {activeSource === "quiz" ? "Retake quiz" : "Adjust profile"}
            </Link>
            <span className="text-neutral-300">•</span>
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-medium text-neutral-500 hover:text-red-700 underline"
            >
              Restart
            </button>
          </div>
        </header>

        {/* Card Count Selection Tabs & What-If Live Spend Adjuster */}
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdjuster(!showAdjuster)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  showAdjuster || adjustedSpend
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-black hover:text-black"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>What-If Spend Adjuster</span>
                {adjustedSpend && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#DDF247] text-black text-[9px] font-mono font-bold rounded">
                    Adjusted
                  </span>
                )}
              </button>
            </div>
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
                  onClick={() => handleSelectCardCount(tab.count)}
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

          {/* What-If Live Spend Adjuster Drawer / Panel */}
          {showAdjuster && (
            <div className="mt-4 pt-4 border-t border-neutral-100 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                      Live Spend Simulator
                    </span>
                    {adjustedSpend && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Active Custom Values
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Nudge monthly spending across categories. The optimal combination, category routing, and net reward recalculate dynamically.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Total Monthly Spend</span>
                    <span className="text-sm font-mono font-bold text-neutral-900">
                      ₹{totalActiveMonthlySpend.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                  {adjustedSpend && (
                    <button
                      type="button"
                      onClick={handleResetSpend}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 hover:text-black border border-neutral-200 bg-white px-2.5 py-1.5 rounded-lg transition-colors shadow-2xs"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset to profile
                    </button>
                  )}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 bg-neutral-50/70 p-4 rounded-xl border border-neutral-200/80">
                {[
                  { key: "dining", label: "Dining & Food Delivery", max: 40000, step: 500 },
                  { key: "shopping", label: "Online & Retail Shopping", max: 80000, step: 1000 },
                  { key: "travel", label: "Travel, Flights & Hotels", max: 80000, step: 1000 },
                  { key: "groceries", label: "Groceries & Supermarket", max: 30000, step: 500 },
                  { key: "fuel", label: "Fuel & EV Charging", max: 20000, step: 500 },
                  { key: "utilities", label: "Utilities, Bills & Recharge", max: 20000, step: 500 },
                ].map((slider) => {
                  const val = activeSpend[slider.key] || 0;
                  return (
                    <div key={slider.key} className="bg-white p-3 rounded-lg border border-neutral-200/70 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <label htmlFor={`slider-${slider.key}`} className="font-semibold text-neutral-800">
                          {slider.label}
                        </label>
                        <span className="font-mono font-bold text-neutral-900 text-xs">
                          ₹{val.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <input
                        id={`slider-${slider.key}`}
                        type="range"
                        min={0}
                        max={slider.max}
                        step={slider.step}
                        value={val}
                        onChange={(e) => handleSpendSliderChange(slider.key, e.target.value)}
                        className="w-full accent-black cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                        <span>₹0</span>
                        <span>₹{slider.max.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                <button
                  type="button"
                  onClick={() => setShowStrategySheet(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 hover:text-black border border-neutral-200 bg-white px-2.5 py-1 rounded-full transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  Strategy Sheet
                </button>
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

            {/* Card Synergy Breakdown Widget (When 2 or 3 cards are selected) */}
            {selectedCardCount > 1 && soloNet > 0 && (
              <div className="mb-6 rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/60 mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-neutral-800 shrink-0" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Card Synergy Advantage ({selectedCardCount}-Card Setup vs. Single Card)
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    +₹{incrementalGain.toLocaleString("en-IN")}/yr Net Gain
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="bg-white p-3 rounded-lg border border-neutral-200/70">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Solo Card Baseline</span>
                    <span className="text-sm sm:text-base font-extrabold text-neutral-800 font-mono block mt-0.5">
                      ₹{soloNet.toLocaleString("en-IN")}/yr
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate mt-0.5" title={soloCardName}>
                      Holding {soloCardName} alone
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-neutral-200/70">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">This {selectedCardCount}-Card Setup</span>
                    <span className="text-sm sm:text-base font-extrabold text-neutral-950 font-mono block mt-0.5">
                      ₹{currentNet.toLocaleString("en-IN")}/yr
                    </span>
                    <span className="text-[10px] text-neutral-500 block mt-0.5">
                      Optimal category spend routing
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200/80">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Synergy Bonus</span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-800 font-mono block mt-0.5">
                      +₹{incrementalGain.toLocaleString("en-IN")}/yr
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">
                      Gain from specialization
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  Carrying {selectedCardCount} cards yields <strong className="text-neutral-900 font-semibold">₹{incrementalGain.toLocaleString("en-IN")}/yr more</strong> net return compared to relying on a single all-rounder card. By splitting spend across specialist cards, you capture higher reward rates (5%–10%) and bypass monthly category caps without double-spending.
                </p>
              </div>
            )}

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
        {currentCombo && (currentCombo.merchantAllocations || currentCombo.allocations) && (
          <section className="mb-12 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-0.5">
                Zero Double-Counting
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Spend Routing & Brand Allocation Matrix
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Every rupee of your monthly spend is routed to the single card in this setup yielding the highest verified return for that specific merchant or category:
              </p>
            </div>

            {/* Merchant Specific Allocations if present */}
            {currentCombo.merchantAllocations && Object.keys(currentCombo.merchantAllocations).length > 0 && (
              <div className="mb-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Itemized Brand & Merchant Routing
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 pr-4">Brand / Merchant</th>
                        <th className="py-2.5 px-4">Your Monthly Spend</th>
                        <th className="py-2.5 px-4">Routed To</th>
                        <th className="py-2.5 px-4 text-right">Verified Rate</th>
                        <th className="py-2.5 pl-4 text-right">Est. Earn/Mo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {Object.values(currentCombo.merchantAllocations).map((mAlloc) => (
                        <tr key={mAlloc.merchantId} className="hover:bg-neutral-50/50">
                          <td className="py-3 pr-4 font-semibold text-neutral-900">
                            <div>{mAlloc.merchantName}</div>
                            {mAlloc.note && (
                              <div className="text-[10px] font-normal text-neutral-400 mt-0.5 line-clamp-1" title={mAlloc.note}>
                                {mAlloc.note}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-600">
                            ₹{mAlloc.monthlySpend.toLocaleString("en-IN")}/mo
                          </td>
                          <td className="py-3 px-4 text-neutral-800 font-medium">
                            {mAlloc.cardName}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              {mAlloc.effectiveRate}%
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-right font-mono font-bold text-neutral-900">
                            ₹{Math.round(mAlloc.monthlyRewards).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* General Category Allocations */}
            {currentCombo.allocations && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Category Spending Allocations
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 pr-4">Category</th>
                        <th className="py-2.5 px-4">Unallocated Spend</th>
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
              </div>
            )}
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

                    {/* Spend-Linked Lounge Notice */}
                    {card.loungeBenefits && /(preceding|previous|spend hurdle|crossing|billing cycle)/i.test(card.loungeBenefits) && (
                      <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200/90 bg-amber-50/70 p-2.5 text-xs text-amber-900">
                        <Clock className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div className="leading-snug">
                          <span className="font-bold">Spend-Linked Lounge Rule: </span>
                          <span className="text-amber-800">{card.loungeBenefits}</span>
                        </div>
                      </div>
                    )}

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

        {/* Optional Guest Save Prompt */}
        {!user && (
          <section className="mb-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-center shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Guest Session Active
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Want to save your card recommendations across devices?
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              Your profile is currently saved locally in this browser. Create an optional demo account to keep your preferences and recommendations synced.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-2xs"
              >
                Save profile with free account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                Sign in
              </Link>
            </div>
          </section>
        )}

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
          <p className="mb-2">
            • <strong>Non-Intermediary Notice:</strong> CreditWise is an independent financial education and decision-support tool. We are not a bank, NBFC, or credit broker, and do not issue credit cards or solicit applications.
          </p>
          <p>
            • <strong>Verified Terms:</strong> Bank reward structures, caps, and lounge quotas are audited regularly. Always review the canonical schedule on the official issuer website prior to applying.
          </p>
        </section>

        {/* Editorial 1-Page Strategy Sheet Modal */}
        {showStrategySheet && currentCombo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
              {/* Modal Actions Bar (hidden when printing) */}
              <div className="no-print flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/90 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-black" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Editorial 1-Page Strategy Sheet
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print / Save PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStrategySheet(false)}
                    className="rounded-lg p-2 text-neutral-400 hover:text-black hover:bg-neutral-200/60 transition-colors"
                    aria-label="Close strategy sheet"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Printable Sheet Body */}
              <div id="cw-printable-strategy-sheet" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-neutral-900 bg-white">
                {/* Print Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-black">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                      CreditWise • Personalized Portfolio Strategy
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                      {selectedCountText(selectedCardCount)}
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1 max-w-md">
                      Spend routing cheat sheet based on verified bank terms and your natural spending profile.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-neutral-400 font-mono block">MONTHLY SPEND</span>
                    <span className="text-xl font-extrabold font-mono text-black">
                      ₹{totalActiveMonthlySpend.toLocaleString("en-IN")}/mo
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold block mt-0.5">
                      Net Value: ₹{Math.max(0, currentCombo.netValue || 0).toLocaleString("en-IN")}/yr
                    </span>
                  </div>
                </div>

                {/* 1. Spend Routing Table */}
                {currentCombo.allocations && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5 flex items-center gap-1.5">
                      <span>1. Which Card to Swipe Where (Spend Routing)</span>
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-neutral-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-100 text-neutral-600 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                            <th className="py-2 px-3">Expense Category</th>
                            <th className="py-2 px-3">Your Spend</th>
                            <th className="py-2 px-3">Primary Card to Swipe</th>
                            <th className="py-2 px-3 text-right">Verified Rate</th>
                            <th className="py-2 px-3 text-right">Est. Earn/Mo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {Object.entries(currentCombo.allocations).map(([catKey, alloc]) => {
                            const label = formatCategoryLabel(catKey);
                            const spendVal = alloc.monthlySpend ?? alloc.spend ?? 0;
                            const rateVal = alloc.effectiveRate ?? alloc.rate ?? 0;
                            const earnVal = alloc.monthlyRewards ?? alloc.monthlyEarn ?? 0;
                            return (
                              <tr key={catKey} className="even:bg-neutral-50/50">
                                <td className="py-2 px-3 font-semibold text-neutral-900">{label}</td>
                                <td className="py-2 px-3 font-mono text-neutral-600">₹{spendVal.toLocaleString("en-IN")}</td>
                                <td className="py-2 px-3 font-medium text-neutral-900">{alloc.cardName}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-neutral-800">
                                  {rateVal > 1 ? `${rateVal.toFixed(1)}%` : `${(rateVal * 100).toFixed(1)}%`}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-extrabold text-black">
                                  ₹{Math.round(earnVal).toLocaleString("en-IN")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Portfolio Holdings & Fee Waiver Targets */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                    2. Card Portfolio & Fee Waiver Spend Targets
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentCards.map((card, cIdx) => {
                      const breakdown = currentCombo?.cards?.find((b) => b.slug === card.slug);
                      return (
                        <div key={card.slug} className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold text-neutral-950">
                            <span>{cIdx + 1}. {card.name}</span>
                            <span className="font-mono text-[11px] text-neutral-600">
                              {card.annualFee === 0 ? "Lifetime Free" : `₹${card.annualFee} + 18% GST`}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-600">
                            <strong>Issuer:</strong> {card.issuer} • <strong>Network:</strong> {card.network || "Mastercard / Visa / RuPay"}
                          </p>
                          <p className="text-[11px] text-neutral-700">
                            <strong>Fee Waiver Target:</strong> {card.feeWaiver || "None (Lifetime Free)"}
                          </p>
                          {breakdown && (
                            <p className={`text-[11px] font-semibold ${breakdown.feeWaived ? "text-emerald-700" : "text-neutral-600"}`}>
                              {breakdown.waiverNote}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Spend-Linked Lounge & Key Rules */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    3. Airport Lounge Access & Essential Restrictions
                  </h3>
                  <div className="space-y-2 text-xs">
                    {currentCards.map((card) => (
                      <div key={card.slug} className="p-3 rounded-lg border border-neutral-200 bg-white">
                        <span className="font-bold text-neutral-950 block mb-0.5">{card.name}</span>
                        <p className="text-neutral-700">
                          <strong>Lounge visits:</strong> {card.loungeBenefits || (card.loungeAccess > 0 ? `${card.loungeAccess} visits/yr` : "None included")}
                        </p>
                        {card.limitations && card.limitations.length > 0 && (
                          <p className="text-[11px] text-neutral-500 mt-1">
                            <strong>Watch for:</strong> {card.limitations[0]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategy Sheet Footer & Compliance */}
                <div className="pt-4 border-t border-neutral-200 text-[10px] text-neutral-500 space-y-1">
                  <p>
                    <strong>CreditWise Non-Intermediary Notice:</strong> CreditWise is an independent financial education and decision-support tool. We are not a bank, NBFC, or credit broker, and do not issue credit cards or solicit applications. Card approvals and credit lines are at the sole discretion of issuing banks.
                  </p>
                  <p className="font-mono text-neutral-400">
                    Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • Verified issuer catalogue.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #cw-printable-strategy-sheet, #cw-printable-strategy-sheet * {
              visibility: visible;
            }
            #cw-printable-strategy-sheet {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20px;
              background: white !important;
              color: black !important;
              overflow: visible !important;
              max-height: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
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
