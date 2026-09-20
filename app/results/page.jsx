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
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import cards from "../../data/cards.json";
import { getProfileRecommendations } from "../../lib/recommendation";
import CreditCardVisual from "../../components/CreditCardVisual";
import { TINT_BY_CATEGORY } from "../../components/CreditCard";
import SaveCardButton from "../../components/SaveCardButton";

function formatFee(fee) {
  if (fee === 0) return "Lifetime Free";
  return `₹${fee.toLocaleString("en-IN")}`;
}

export default function ResultsPage() {
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    try {
      const rawProfile = window.localStorage.getItem("cardwise:profile");
      if (rawProfile) {
        setProfile(JSON.parse(rawProfile));
      } else {
        // Check if there is an account without onboarding yet
        const rawUser = window.localStorage.getItem("cardwise:user");
        if (rawUser) {
          const user = JSON.parse(rawUser);
          // provide default synthetic profile so user sees valid recommendations
          setProfile({
            profile: { age: user.age || 25, incomeRange: "₹6L – ₹12L", employment: "salaried" },
            spending: {
              totalMonthly: 45000,
              categories: { dining: 6000, shopping: 10000, groceries: 8000, fuel: 3000, travel: 5000 },
            },
            preferences: {
              priorities: ["Cashback", "Dining", "Shopping"],
              rewardStyle: "balanced",
              feeTolerance: "moderate-fee",
              travelFrequency: "Sometimes",
              internationalSpend: "Occasionally",
            },
            existingCards: [],
          });
        }
      }
    } catch {
      setProfile(null);
    }
    setReady(true);
  }, []);

  const { recommended, existingOverlap, noFitReason } = ready && profile
    ? getProfileRecommendations(cards, profile, 3)
    : { recommended: [], existingOverlap: [], noFitReason: null };

  if (!ready) {
    return (
      <div className="cw-container py-24 text-center">
        <p className="text-sm font-semibold text-neutral-400 animate-pulse">Evaluating verified cards against your profile…</p>
      </div>
    );
  }

  // ---------------- No Profile Created Yet ----------------
  if (!profile) {
    return (
      <div className="cw-rail min-h-[75vh] flex items-center justify-center bg-[#FBFBFB]">
        <div className="cw-container py-20">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
              Personalized Matching
            </span>
            <h1 className="text-2xl font-extrabold text-black mt-3">
              No spending profile found
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Complete the quick onboarding to share your natural spending categories and reward preferences.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800"
              >
                Start Onboarding
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- No Result State (CreditWise Curation Standard) ----------------
  if (noFitReason) {
    return (
      <div className="cw-rail min-h-screen bg-[#FBFBFB]">
        <div className="cw-container py-14 md:py-20 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 mb-4">
              <Info className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-black">
              We couldn&apos;t find a card that clearly fits your current profile
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-3 max-w-xl mx-auto leading-relaxed">
              {noFitReason}
            </p>
            <div className="mt-6 rounded-xl bg-neutral-50 border border-neutral-200/80 p-4 text-xs text-neutral-500 max-w-lg mx-auto text-left space-y-1.5">
              <p className="font-bold text-neutral-700">CreditWise Curation Standard:</p>
              <p>We believe in honest curation. Rather than pushing an ill-fitting or expensive card, we advise sticking to your existing payment methods or adjusting constraints.</p>
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Adjust Profile & Preferences
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DDF247] text-black px-2.5 py-0.5 rounded-full">
                Tailored Matches
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                Verified Bank Catalog
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
              Cards that fit your natural spending
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
              Matched strictly against where your money already flows and your stated preferences. No sponsored rankings or algorithmic guesswork.
            </p>
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Adjust profile
          </Link>
        </header>

        {/* Existing Card Overlap Callout */}
        {existingOverlap.length > 0 && (
          <div className="mb-8 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs text-amber-900 flex items-start gap-3">
            <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block mb-0.5">Existing Card Notice</strong>
              {existingOverlap.map((o, idx) => (
                <p key={idx} className="leading-relaxed">
                  {o.message} We prioritized cards with complementary strengths instead of duplicating rewards.
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Cards List */}
        <div className="space-y-8 mb-14">
          {recommended.map((item, index) => {
            const { card, reasons, watchFor, eligibilityNote } = item;
            const isExpanded = expandedCard === card.slug;

            return (
              <article
                key={card.slug}
                className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-9 shadow-sm transition-all hover:border-neutral-300"
              >
                <div className="grid gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] items-start">
                  {/* Card Visual Band */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-3 self-start">
                      Match {index + 1} of {recommended.length}
                    </span>
                    <CreditCardVisual
                      tint={TINT_BY_CATEGORY[card.category] || "emerald"}
                      issuer={card.issuer || card.bank}
                      name={card.name}
                      image={card.image}
                      size="sm"
                    />
                    <div className="mt-4 text-center">
                      <span className="text-xs font-bold text-black block">
                        Annual Fee: {formatFee(card.annualFee)}
                      </span>
                      {card.feeWaiver && (
                        <span className="text-[10px] text-neutral-500 block mt-0.5">
                          {card.feeWaiver}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Details & Fit Content */}
                  <div>
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                          {card.issuer} · {card.network}
                        </p>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-black mt-0.5">
                          <Link href={`/cards/${card.slug}`} className="hover:underline">
                            {card.name}
                          </Link>
                        </h2>
                      </div>
                      <SaveCardButton slug={card.slug} name={card.name} />
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {card.goodFor ? `Good for: ${card.goodFor}. ` : ""}{card.shortDescription || card.description}
                    </p>

                    {/* WHY IT FITS YOU */}
                    <div className="rounded-xl bg-neutral-50/80 border border-neutral-200/80 p-4 sm:p-5 mb-5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-black block mb-3">
                        Why it fits you
                      </span>
                      <ul className="space-y-2 text-xs sm:text-sm text-neutral-800">
                        {reasons.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2.5 leading-relaxed font-medium">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* WATCH FOR */}
                    <div className="rounded-xl bg-amber-50/40 border border-amber-200/60 p-4 sm:p-4 mb-6">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
                        Watch for
                      </span>
                      <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                        • {watchFor}
                      </p>
                    </div>

                    {/* Actions: Official Issuer Link CTA + Deep Dive */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {card.officialUrl ? (
                        <a
                          href={card.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-neutral-800 shadow-sm"
                        >
                          View card on issuer website
                          <ExternalLink className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                        </a>
                      ) : null}

                      <Link
                        href={`/cards/${card.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
                      >
                        See details
                        <ArrowRight className="h-3 w-3" />
                      </Link>

                      <Link
                        href={`/compare?cards=${recommended.map((r) => r.card.slug).join(",")}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
                      >
                        Compare all {recommended.length}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ---------------- Transparency Notice ---------------- */}
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 text-xs text-neutral-500 leading-relaxed shadow-sm">
          <div className="flex items-center gap-2 text-neutral-800 font-bold uppercase tracking-wider text-[11px] mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            CreditWise Transparency Notice
          </div>
          <p className="mb-2">
            • <strong>Informational Matching Only:</strong> CreditWise provides independent editorial matching based solely on verified card terms and user inputs. We do not make credit promises or guarantee approval.
          </p>
          <p className="mb-2">
            • <strong>Issuer Authority:</strong> Final card approval, credit limit, and APR are strictly determined by the issuing bank based on their internal underwriting standards and credit bureau evaluations.
          </p>
          <p>
            • <strong>Verified Terms:</strong> Bank reward structures, caps, and lounge quotas can be revised by issuers. Always review the canonical schedule on the official issuer website before submitting an application.
          </p>
        </section>
      </div>
    </div>
  );
}
