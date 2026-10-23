"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LogOut,
  Edit3,
  Trash2,
  Check,
  CreditCard,
  Building,
  ShieldCheck,
  AlertTriangle,
  X,
  Plus,
  Compass,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import cards from "../../data/cards.json";
import CreditCardVisual from "../../components/CreditCardVisual";
import CardGrid from "../../components/CardGrid";
import { readSaved } from "../../components/SaveCardButton";
import { getProfileRecommendations } from "../../lib/recommendation";

const SPEND_CATEGORIES_CONFIG = [
  { key: "groceries", label: "Groceries & Supermarket", defaultVal: 6000 },
  { key: "dining", label: "Dining & Food Delivery", defaultVal: 5000 },
  { key: "fuel", label: "Fuel & EV Charging", defaultVal: 3500 },
  { key: "travel", label: "Travel, Flights & Hotels", defaultVal: 4000 },
  { key: "shopping", label: "Shopping (Online & In-store)", defaultVal: 6000 },
  { key: "utilities", label: "Utilities & Bills", defaultVal: 3000 },
  { key: "entertainment", label: "Entertainment & Movies", defaultVal: 2000 },
  { key: "other", label: "Other General Spends", defaultVal: 3000 },
];

const REWARD_STYLES = [
  { id: "simple", label: "Flat Cashback", desc: "Direct statement credits, zero points management" },
  { id: "balanced", label: "Category Multipliers", desc: "Accelerated rewards on key spending categories" },
  { id: "optimizer", label: "Travel Points & Miles", desc: "Air miles transfers, lounge access, flight redemption" },
];

const FEE_TOLERANCES = [
  { id: "no-fee", label: "Lifetime Free Only", desc: "Zero annual fee cards with no spend thresholds" },
  { id: "moderate-fee", label: "Moderate Fee (Up to ₹1,500)", desc: "Willing to pay if fee waiver is achievable" },
  { id: "high-fee", label: "Premium / Fee-Friendly (₹3,000+)", desc: "Higher fee okay if premium travel & lounge perks justify it" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview | spending | preferences | portfolio | privacy
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Edit states
  const [editSpending, setEditSpending] = useState({});
  const [editPreferences, setEditPreferences] = useState({});
  const [editExistingCards, setEditExistingCards] = useState([]);
  const [cardSearchQuery, setCardSearchQuery] = useState("");

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem("cardwise:user");
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      setUser(parsedUser);

      const rawProfile = window.localStorage.getItem("cardwise:profile");
      const parsedProfile = rawProfile ? JSON.parse(rawProfile) : null;
      setProfile(parsedProfile);

      if (parsedProfile) {
        setEditSpending(parsedProfile.spending?.categories || {});
        setEditPreferences(parsedProfile.preferences || {});
        setEditExistingCards(parsedProfile.existingCards || []);
      }
    } catch {
      setUser(null);
      setProfile(null);
    }

    setSavedSlugs(readSaved());
    setReady(true);
  }, []);

  function signOut() {
    window.localStorage.removeItem("cardwise:user");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
    router.push("/login");
  }

  function deleteAccount() {
    try {
      const activeUser = user;
      window.localStorage.removeItem("cardwise:user");
      window.localStorage.removeItem("cardwise:profile");
      window.localStorage.removeItem("cardwise:saved");
      window.localStorage.removeItem("cardwise:answers");

      // Purge registered user from local users directory if present
      const rawUsers = window.localStorage.getItem("cardwise:users");
      if (rawUsers && activeUser?.email) {
        const usersList = JSON.parse(rawUsers);
        if (Array.isArray(usersList)) {
          const filtered = usersList.filter(
            (u) => u.email?.toLowerCase() !== activeUser.email.toLowerCase()
          );
          window.localStorage.setItem("cardwise:users", JSON.stringify(filtered));
        }
      }
    } catch {
      // ignore storage access errors
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("storage"));
    }
    setShowDeleteModal(false);
    setUser(null);
    setProfile(null);
    router.push("/");
  }

  function handleSaveSpending(e) {
    e.preventDefault();
    if (!profile) return;

    const totalMonthly = Object.values(editSpending).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const updated = {
      ...profile,
      spending: {
        totalMonthly,
        categories: { ...editSpending },
      },
      updatedAt: new Date().toISOString(),
    };

    setProfile(updated);
    window.localStorage.setItem("cardwise:profile", JSON.stringify(updated));
    showToast("Spending preferences updated.");
  }

  function handleSavePreferences(e) {
    e.preventDefault();
    if (!profile) return;

    const updated = {
      ...profile,
      preferences: { ...editPreferences },
      updatedAt: new Date().toISOString(),
    };

    setProfile(updated);
    window.localStorage.setItem("cardwise:profile", JSON.stringify(updated));
    showToast("Reward & fee preferences updated.");
  }

  function handleToggleCard(slug) {
    if (!profile) return;
    const exists = editExistingCards.includes(slug);
    const nextCards = exists
      ? editExistingCards.filter((s) => s !== slug)
      : [...editExistingCards, slug];

    setEditExistingCards(nextCards);
    const updated = {
      ...profile,
      existingCards: nextCards,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    window.localStorage.setItem("cardwise:profile", JSON.stringify(updated));
    showToast(exists ? "Card removed from portfolio." : "Card added to portfolio.");
  }

  function showToast(msg) {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  }

  const savedCards = cards.filter((c) => savedSlugs.includes(c.slug));

  const existingCardObjects = (profile?.existingCards || [])
    .map((slug) => cards.find((c) => c.slug === slug))
    .filter(Boolean);

  // Derive top recommendations deterministically
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
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
              Demo Profile Session
            </span>
            <h1 className="text-2xl font-extrabold text-black mt-3">You are not signed in</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Sign in or create a demo account to manage your spending profile and personalized recommendations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
              >
                Sign in
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
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
      <div className="cw-container py-10 md:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Toast Notification */}
        {saveSuccessMsg && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white shadow-xl animate-cw-rise">
            <Check className="h-4 w-4 text-[#DDF247]" />
            {saveSuccessMsg}
          </div>
        )}

        {/* Profile Header Card */}
        <header className="mb-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DDF247] text-black px-2.5 py-0.5 rounded-full">
                  Verified Local Session
                </span>
                <span className="text-[10px] font-medium text-neutral-400">
                  Client-side storage only
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
                {user.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                {user.email} {profile?.profile?.city ? `· ${profile.profile.city}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {profile ? (
                <Link
                  href="/results"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#DDF247]" />
                  View Matched Cards
                </Link>
              ) : (
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-[#DDF247]" />
                  Complete Personalization
                </Link>
              )}
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

          {/* Navigation Sub-Tabs */}
          <div className="mt-8 flex flex-nowrap overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:pb-0 gap-2 border-t border-neutral-100 pt-6">
            {[
              { id: "overview", label: "Profile Overview" },
              { id: "spending", label: "Spending Allocation" },
              { id: "preferences", label: "Reward & Fee Settings" },
              { id: "portfolio", label: "Current Cards Portfolio" },
              { id: "bookmarks", label: `Saved Cards (${savedCards.length})` },
              { id: "privacy", label: "Privacy & Data Controls" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* ==================================================
            TAB 1: PROFILE OVERVIEW
        ================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {profile ? (
              <>
                {/* Key Summary Grid */}
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Monthly Spending
                    </span>
                    <p className="text-2xl font-extrabold text-black cw-numeric">
                      ₹{totalMonthly.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Annualized: ₹{(totalMonthly * 12).toLocaleString("en-IN")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("spending")}
                      className="mt-3 text-xs font-bold text-black underline inline-flex items-center gap-1"
                    >
                      Edit allocation <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Reward Preference
                    </span>
                    <p className="text-lg font-extrabold text-black capitalize">
                      {profile.preferences?.rewardStyle === "simple" && "Flat Cashback"}
                      {profile.preferences?.rewardStyle === "balanced" && "Category Multipliers"}
                      {profile.preferences?.rewardStyle === "optimizer" && "Travel Points & Miles"}
                      {!profile.preferences?.rewardStyle && "Unspecified"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Fee: {profile.preferences?.feeTolerance === "no-fee" ? "Lifetime Free" : "Fee-Friendly"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preferences")}
                      className="mt-3 text-xs font-bold text-black underline inline-flex items-center gap-1"
                    >
                      Edit preferences <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      Existing Portfolio
                    </span>
                    <p className="text-2xl font-extrabold text-black">
                      {existingCardObjects.length} {existingCardObjects.length === 1 ? "Card" : "Cards"}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Excluded from duplicate recommendation
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("portfolio")}
                      className="mt-3 text-xs font-bold text-black underline inline-flex items-center gap-1"
                    >
                      Manage cards <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Top Recommended Cards Preview */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Deterministic Suitability Engine
                      </span>
                      <h2 className="text-xl font-extrabold text-black mt-0.5">
                        Top Recommended Matches for Your Profile
                      </h2>
                    </div>
                    <Link
                      href="/results"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors self-start sm:self-auto"
                    >
                      View Full Analysis
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {recommendedCards.length === 0 ? (
                    <p className="text-xs text-neutral-500">
                      No matching cards found for your exact criteria. Try adjusting your fee tolerance or categories.
                    </p>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-3">
                      {recommendedCards.map((rec) => {
                        const card = rec.card;
                        return (
                          <div
                            key={card.slug}
                            className="flex flex-col rounded-xl border border-neutral-200/90 bg-[#FBFBFB] p-4 transition-all hover:border-neutral-400"
                          >
                            <div className="flex justify-center h-[160px] items-center mb-3">
                              <CreditCardVisual
                                issuer={card.issuer || card.bank}
                                name={card.name}
                                image={card.image}
                                orientation={card.orientation || "horizontal"}
                                size="sm"
                              />
                            </div>
                            <h3 className="text-xs font-bold text-neutral-900 line-clamp-1">{card.name}</h3>
                            <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{card.goodFor}</p>
                            <div className="mt-3 pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs">
                              <span className="font-bold text-neutral-900">
                                {card.annualFee === 0 ? "Lifetime Free" : `₹${card.annualFee.toLocaleString("en-IN")}/yr`}
                              </span>
                              <Link
                                href={`/cards/${card.slug}`}
                                className="font-bold text-black hover:underline inline-flex items-center gap-0.5"
                              >
                                Details →
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center shadow-xs">
                <Compass className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                <h2 className="text-xl font-extrabold text-black">Complete Your Spending Personalization</h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Tell us roughly how you spend each month and your reward preferences. We will calculate suitability against all 31 verified credit cards without asking for sensitive banking credentials.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  Start Onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ==================================================
            TAB 2: SPENDING ALLOCATION
        ================================================== */}
        {activeTab === "spending" && (
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Monthly Breakdown
              </span>
              <h2 className="text-xl font-extrabold text-black mt-0.5">
                Update Monthly Expense Allocation
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your approximate monthly expenses in each category. We use these figures solely to calculate reward values and fee-waiver thresholds.
              </p>
            </div>

            <form onSubmit={handleSaveSpending}>
              <div className="grid gap-5 sm:grid-cols-2">
                {SPEND_CATEGORIES_CONFIG.map((cat) => (
                  <div key={cat.key} className="rounded-xl border border-neutral-200/80 bg-[#FAFAFA] p-4">
                    <label htmlFor={`spend-${cat.key}`} className="block text-xs font-bold text-neutral-900 mb-1">
                      {cat.label}
                    </label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                        ₹
                      </span>
                      <input
                        id={`spend-${cat.key}`}
                        type="number"
                        min="0"
                        step="500"
                        value={editSpending[cat.key] ?? 0}
                        onChange={(e) =>
                          setEditSpending({
                            ...editSpending,
                            [cat.key]: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-full rounded-lg border border-neutral-300 bg-white pl-7 pr-3 py-2 text-xs font-semibold text-neutral-900 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-neutral-100 pt-6">
                <div>
                  <span className="text-xs font-semibold text-neutral-500">Calculated Monthly Total:</span>
                  <span className="text-lg font-extrabold text-black ml-2 cw-numeric">
                    ₹{Object.values(editSpending).reduce((s, v) => s + (Number(v) || 0), 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  Save Spending Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================
            TAB 3: REWARD & FEE PREFERENCES
        ================================================== */}
        {activeTab === "preferences" && (
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Preferences
              </span>
              <h2 className="text-xl font-extrabold text-black mt-0.5">
                Reward & Fee Preferences
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Customize how you prefer to be rewarded and your comfort level with annual renewal fees.
              </p>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-8">
              {/* Reward Style Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
                  Preferred Reward Style
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {REWARD_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setEditPreferences({ ...editPreferences, rewardStyle: style.id })}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        editPreferences.rewardStyle === style.id
                          ? "border-black bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                      }`}
                    >
                      <p className="text-xs font-bold">{style.label}</p>
                      <p className={`text-[11px] mt-1 ${editPreferences.rewardStyle === style.id ? "text-neutral-300" : "text-neutral-500"}`}>
                        {style.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Tolerance */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
                  Annual Fee Tolerance
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {FEE_TOLERANCES.map((fee) => (
                    <button
                      key={fee.id}
                      type="button"
                      onClick={() => setEditPreferences({ ...editPreferences, feeTolerance: fee.id })}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        editPreferences.feeTolerance === fee.id
                          ? "border-black bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                      }`}
                    >
                      <p className="text-xs font-bold">{fee.label}</p>
                      <p className={`text-[11px] mt-1 ${editPreferences.feeTolerance === fee.id ? "text-neutral-300" : "text-neutral-500"}`}>
                        {fee.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-black px-6 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
                >
                  Save Preference Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================
            TAB 4: EXISTING CARDS PORTFOLIO
        ================================================== */}
        {activeTab === "portfolio" && (
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Holdings
              </span>
              <h2 className="text-xl font-extrabold text-black mt-0.5">
                Existing Credit Cards Portfolio
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Select cards you already carry. CreditWise automatically suppresses duplicate recommendations and prioritizes cards that provide complementary value.
              </p>
            </div>

            {/* Filter Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search verified cards by name or issuer…"
                value={cardSearchQuery}
                onChange={(e) => setCardSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none"
              />
            </div>

            {/* Verified Cards Selection Matrix */}
            <div className="grid gap-3 sm:grid-cols-2 max-h-[460px] overflow-y-auto pr-2">
              {cards
                .filter(
                  (c) =>
                    !cardSearchQuery ||
                    c.name.toLowerCase().includes(cardSearchQuery.toLowerCase()) ||
                    c.issuer.toLowerCase().includes(cardSearchQuery.toLowerCase())
                )
                .map((c) => {
                  const isSelected = editExistingCards.includes(c.slug);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => handleToggleCard(c.slug)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-black bg-neutral-900 text-white"
                          : "border-neutral-200 bg-[#FAFAFA] text-neutral-900 hover:border-neutral-300"
                      }`}
                    >
                      <div className="pr-3">
                        <p className="text-xs font-bold leading-snug">{c.name}</p>
                        <p className={`text-[10px] uppercase font-semibold mt-0.5 ${isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                          {c.issuer} · {c.network}
                        </p>
                      </div>
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-[#DDF247] bg-[#DDF247] text-black" : "border-neutral-300 bg-white"}`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 5: BOOKMARKS
        ================================================== */}
        {activeTab === "bookmarks" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Saved Cards
                </span>
                <h2 className="text-2xl font-extrabold text-black mt-0.5">
                  Bookmarked Cards ({savedCards.length})
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Cards you have pinned for future review or side-by-side comparison.
                </p>
              </div>
              <Link
                href="/cards"
                className="inline-flex items-center gap-1 text-xs font-bold text-neutral-800 hover:underline"
              >
                Browse all 31 cards <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <CardGrid
              cards={savedCards}
              emptyMessage="You haven't bookmarked any credit cards yet. Click the bookmark icon on any card to save it here."
            />
          </div>
        )}

        {/* ==================================================
            TAB 6: PRIVACY & DATA CONTROLS
        ================================================== */}
        {activeTab === "privacy" && (
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                User Controls
              </span>
              <h2 className="text-xl font-extrabold text-black mt-0.5">
                Data Transparency & Privacy Controls
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                CreditWise operates on privacy-first architecture with strict data minimization.
              </p>
            </div>

            <div className="space-y-4 text-xs text-neutral-700 leading-relaxed border-t border-neutral-100 pt-6">
              <div className="rounded-xl border border-neutral-200/80 bg-[#FAFAFA] p-4">
                <h3 className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  What CreditWise Stores
                </h3>
                <p className="text-neutral-600">
                  Your approximate spending category distributions, reward style preferences, and selected existing card slugs. This data is stored strictly in your local browser storage (`localStorage`) to run the on-device recommendation engine.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200/80 bg-[#FAFAFA] p-4">
                <h3 className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-neutral-500" />
                  What We Never Collect
                </h3>
                <p className="text-neutral-600">
                  We never ask for or store full credit card numbers, CVV codes, UPI PINs, netbanking passwords, OTPs, Aadhaar/PAN details, or bank account numbers.
                </p>
              </div>
            </div>

            {/* Permanent Data Deletion */}
            <div className="border-t border-neutral-100 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-neutral-900">Permanent Data Deletion</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Erase your session, profile inputs, and bookmarked cards from this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors shrink-0"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Account & Clear All Data
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xl animate-cw-rise">
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
