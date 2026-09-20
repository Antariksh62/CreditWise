"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Edit3,
  Trash2,
  PieChart,
  Sliders,
  CreditCard,
  Building,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  X,
  Plus,
  Compass,
} from "lucide-react";
import cards from "../../data/cards.json";
import CardGrid from "../../components/CardGrid";
import { readSaved } from "../../components/SaveCardButton";
import { getProfileRecommendations } from "../../lib/recommendation";
import { ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [ready, setReady] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem("cardwise:user");
      setUser(rawUser ? JSON.parse(rawUser) : null);

      const rawProfile = window.localStorage.getItem("cardwise:profile");
      setProfile(rawProfile ? JSON.parse(rawProfile) : null);
    } catch {
      setUser(null);
      setProfile(null);
    }

    setSavedSlugs(readSaved());
    setReady(true);
  }, []);

  function signOut() {
    window.localStorage.removeItem("cardwise:user");
    router.push("/login");
  }

  function deleteAccount() {
    window.localStorage.removeItem("cardwise:user");
    window.localStorage.removeItem("cardwise:profile");
    window.localStorage.removeItem("cardwise:saved");
    setShowDeleteModal(false);
    router.push("/");
  }

  const savedCards = cards.filter((c) => savedSlugs.includes(c.slug));

  const existingCardObjects = (profile?.existingCards || [])
    .map((slug) => cards.find((c) => c.slug === slug))
    .filter(Boolean);

  // Derive top recommended cards using the deterministic engine
  const recResult = profile ? getProfileRecommendations(cards, profile, 3) : { recommended: [] };
  const recommendedCards = recResult.recommended || [];

  if (!ready) {
    return (
      <div className="cw-container py-24 text-center">
        <p className="text-sm font-semibold text-neutral-400 animate-pulse">Loading profile…</p>
      </div>
    );
  }

  // ---------------- Signed Out State ----------------
  if (!user) {
    return (
      <div className="cw-rail min-h-[75vh] flex items-center justify-center bg-[#FBFBFB]">
        <div className="cw-container py-20">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
              Demo Authentication
            </span>
            <h1 className="text-2xl font-extrabold text-black mt-3">You are not signed in</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Sign in or create a demo account to access your spending breakdown and card matches.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800"
              >
                Sign in
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const spendingCategories = profile?.spending?.categories || {};
  const totalMonthly = profile?.spending?.totalMonthly || 0;

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-10 md:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Profile Header */}
        <header className="mb-10 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DDF247] text-black px-2.5 py-0.5 rounded-full">
                  Verified Session
                </span>
                <span className="text-[10px] font-semibold text-neutral-400">
                  Local Browser Storage
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
                {user.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                {user.email} · {profile?.profile?.city || "India"} · Age {user.age || profile?.profile?.age || "—"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" />
                {profile ? "Edit Onboarding" : "Complete Onboarding"}
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>

          {!profile && (
            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-black">You haven&apos;t completed onboarding yet</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Answer a few quick questions about how you spend so we can personalize card recommendations.
                </p>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 shrink-0"
              >
                Start Onboarding
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </header>

        {profile && (
          <div className="grid gap-8 lg:grid-cols-[7fr_5fr] mb-12">
            {/* Left Column: Spending Breakdown */}
            <div className="space-y-8">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Expense Distribution
                    </span>
                    <h2 className="text-xl font-extrabold text-black mt-0.5">
                      Your Monthly Spending Profile
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-black block cw-numeric">
                      ₹{totalMonthly.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-neutral-400 block">per month</span>
                  </div>
                </div>

                {/* Category Bars */}
                <div className="space-y-3.5">
                  {Object.entries(spendingCategories).map(([key, amount]) => {
                    if (!amount) return null;
                    const pct = totalMonthly > 0 ? Math.round((amount / totalMonthly) * 100) : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="capitalize text-neutral-700">{key}</span>
                          <span className="text-neutral-900 font-semibold">
                            ₹{amount.toLocaleString("en-IN")} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>Annualized Spend: <strong>₹{(totalMonthly * 12).toLocaleString("en-IN")}</strong></span>
                  <Link href="/onboarding" className="font-bold text-black hover:underline inline-flex items-center gap-1">
                    Adjust spending
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Reward Preferences & Priorities */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Strategic Goals
                </span>
                <h2 className="text-xl font-extrabold text-black mt-0.5 mb-5">
                  Reward & Fee Preferences
                </h2>

                <div className="grid sm:grid-cols-2 gap-5 text-xs">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Reward Style
                    </span>
                    <p className="font-bold text-neutral-900 capitalize">
                      {profile.preferences?.rewardStyle === "simple" && "Keep it simple (Flat cashback)"}
                      {profile.preferences?.rewardStyle === "balanced" && "Some optimization (Category multipliers)"}
                      {profile.preferences?.rewardStyle === "optimizer" && "I'm happy to optimize (Air miles & transfers)"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Fee Tolerance
                    </span>
                    <p className="font-bold text-neutral-900">
                      {profile.preferences?.feeTolerance === "no-fee" && "Prefer no annual fee"}
                      {profile.preferences?.feeTolerance === "moderate-fee" && "Moderate fee okay if value is clear"}
                      {profile.preferences?.feeTolerance === "high-fee" && "Higher fee okay if benefits justify it"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Travel & International
                    </span>
                    <p className="font-bold text-neutral-900">
                      Travel: {profile.preferences?.travelFrequency || "Standard"} · Forex: {profile.preferences?.internationalSpend || "Occasional"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Credit Profile Range
                    </span>
                    <p className="font-bold text-neutral-900">
                      {profile.preferences?.creditScoreRange || "Not specified"} (Self-reported)
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                    Priority Perks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.preferences?.priorities || []).map((pri) => (
                      <span
                        key={pri}
                        className="rounded-full bg-black text-white px-3 py-1 text-[11px] font-semibold"
                      >
                        {pri}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Existing Cards & Quick Stats */}
            <div className="space-y-8">
              {/* Existing Cards Portfolio */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Existing Cards
                    </span>
                    <h2 className="text-xl font-extrabold text-black mt-0.5">
                      Your Current Portfolio
                    </h2>
                  </div>
                  <Link
                    href="/onboarding"
                    className="text-neutral-400 hover:text-black p-1"
                    title="Edit cards"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Link>
                </div>

                {existingCardObjects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-500">
                    <CreditCard className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                    <p className="font-semibold text-neutral-700">No existing cards logged</p>
                    <p className="mt-1 text-[11px]">
                      Add cards you already hold so we can exclude duplicates and match complementary perks.
                    </p>
                    <Link
                      href="/onboarding"
                      className="mt-3 inline-block font-bold text-black underline"
                    >
                      Update portfolio
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {existingCardObjects.map((card) => (
                      <div
                        key={card.slug}
                        className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/50"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-900">{card.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                            {card.issuer} · {card.network}
                          </p>
                        </div>
                        <Link
                          href={`/cards/${card.slug}`}
                          className="text-[11px] font-bold text-neutral-500 hover:text-black underline"
                        >
                          View terms
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pre-Approved Banking Partners */}
              {profile.preferences?.existingBanks && profile.preferences.existingBanks.length > 0 && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Banking Relationships
                  </span>
                  <h2 className="text-base font-extrabold text-black mt-0.5 mb-3">
                    Connected Institutions
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferences.existingBanks.map((bank) => (
                      <span
                        key={bank}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700"
                      >
                        <Building className="h-3 w-3 text-neutral-400" />
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- Saved / Bookmarked Cards ---------------- */}
        <section className="mb-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Bookmarks
              </span>
              <h2 className="text-2xl font-extrabold text-black mt-0.5">
                Saved Cards ({savedCards.length})
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Cards you&apos;ve pinned for future review or side-by-side comparison.
              </p>
            </div>
            <Link
              href="/cards"
              className="inline-flex items-center gap-1 text-xs font-bold text-neutral-800 hover:underline"
            >
              Browse all 31 verified cards
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <CardGrid
            cards={savedCards}
            emptyMessage="You haven&apos;t bookmarked any credit cards yet. Click the bookmark icon on any card to save it here."
          />
        </section>

        {/* ---------------- Account Management & Data Privacy ---------------- */}
        <section className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            <p className="font-semibold text-neutral-700">Data & Privacy Notice</p>
            <p className="mt-0.5">
              All profile inputs, spending budgets, and saved bookmarks remain stored locally in your browser session.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 underline underline-offset-2 shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Account & Clear Local Data
          </button>
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-black"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
                <AlertTriangle className="h-4 w-4" />
                Permanent Reset
              </div>
              <h3 className="text-lg font-bold text-black mb-2">
                Delete Account & Clear All Data?
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 mb-6">
                This will immediately delete your user profile, monthly spending allocation, preferences, and all saved card bookmarks from your browser. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-lg border border-neutral-200 bg-white py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteAccount}
                  className="flex-1 rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  Yes, Delete All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
