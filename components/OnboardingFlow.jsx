"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  CreditCard as CardIcon,
  Search,
  CheckCircle2,
  Edit3,
  Sparkles,
  Info,
} from "lucide-react";
import cardsData from "../data/cards.json";

// ================= CONSTANTS & DEFINITIONS =================

const EMPLOYMENT_OPTIONS = [
  { id: "salaried", label: "Salaried", desc: "Regular monthly salary or fixed compensation" },
  { id: "self-employed", label: "Self-employed", desc: "Freelancers, independent consultants, professionals" },
  { id: "business-owner", label: "Business Owner", desc: "Proprietors, partners, SME operators" },
  { id: "student", label: "Student", desc: "Enrolled in higher education or university" },
  { id: "other", label: "Other", desc: "Homemaker, retired, or in transition" },
  { id: "prefer-not-to-say", label: "Prefer not to say", desc: "Keep employment confidential" },
];

const INCOME_RANGES = [
  "Under ₹3 Lakhs",
  "₹3L – ₹6L",
  "₹6L – ₹12L",
  "₹12L – ₹25L",
  "₹25L – ₹50L",
  "₹50L+",
  "I don't know",
  "Prefer not to say",
];

const CITIES = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Tier 2 / Other City",
  "Prefer not to say",
];

const SPEND_CATEGORIES = [
  {
    key: "groceries",
    label: "Groceries & Supermarket",
    hint: "Daily provisions, local markets, Blinkit, Zepto, DMart",
    presets: [0, 3000, 6000, 10000, 15000],
    defaultVal: 6000,
  },
  {
    key: "dining",
    label: "Dining & Food Delivery",
    hint: "Restaurants, cafes, Zomato, Swiggy",
    presets: [0, 2000, 5000, 8000, 12000],
    defaultVal: 5000,
  },
  {
    key: "fuel",
    label: "Fuel & EV Charging",
    hint: "Petrol pumps, CNG stations, public charging",
    presets: [0, 2000, 3500, 6000, 10000],
    defaultVal: 3500,
  },
  {
    key: "travel",
    label: "Travel, Flights & Hotels",
    hint: "Domestic/intl flights, hotels, trains, cabs",
    presets: [0, 2500, 5000, 10000, 20000],
    defaultVal: 4000,
  },
  {
    key: "shopping",
    label: "Shopping (Online & In-store)",
    hint: "Amazon, Flipkart, clothing, electronics, retail",
    presets: [0, 3000, 6000, 12000, 20000],
    defaultVal: 6000,
  },
  {
    key: "utilities",
    label: "Utilities & Bills",
    hint: "Electricity, broadband, mobile, water, piped gas",
    presets: [0, 1500, 3000, 5000, 8000],
    defaultVal: 3000,
  },
  {
    key: "entertainment",
    label: "Entertainment & Outings",
    hint: "Movies, concerts, events, weekend outings",
    presets: [0, 1000, 2000, 4000, 8000],
    defaultVal: 2000,
  },
  {
    key: "subscriptions",
    label: "Subscriptions & Digital Services",
    hint: "Netflix, Spotify, cloud storage, software, memberships",
    presets: [0, 500, 1200, 2500, 5000],
    defaultVal: 1200,
  },
  {
    key: "other",
    label: "Other Day-to-Day Expenses",
    hint: "Medical, household sundries, misc offline purchases",
    presets: [0, 2000, 5000, 10000, 15000],
    defaultVal: 3000,
  },
];

const PRIORITIES = [
  { id: "Cashback", label: "Cashback", desc: "Direct statement credits on everyday spending" },
  { id: "Rewards/Points", label: "Rewards / Points", desc: "Flexible points for catalog & voucher redemption" },
  { id: "Travel", label: "Travel & Flights", desc: "Air miles, hotel points, flight discount vouchers" },
  { id: "Lounge access", label: "Lounge Access", desc: "Complimentary airport & railway lounge entry" },
  { id: "Fuel", label: "Fuel", desc: "Surcharge waivers & accelerated fuel points" },
  { id: "Dining", label: "Dining", desc: "Discounts & cashback on restaurant bills & delivery" },
  { id: "Shopping", label: "Shopping", desc: "E-commerce & retail accelerated reward points" },
  { id: "International spending", label: "International Spend", desc: "Low or zero foreign currency markup" },
  { id: "Low/no annual fee", label: "Low / No Annual Fee", desc: "Minimal or zero recurring yearly maintenance fee" },
  { id: "Simple rewards", label: "Simple Rewards", desc: "No complex conversion math or expiring portals" },
];

const FEE_PREFERENCES = [
  {
    id: "no-fee",
    title: "Prefer no annual fee",
    desc: "Lifetime free cards or products where the fee easily waives through standard everyday spend thresholds.",
  },
  {
    id: "moderate-fee",
    title: "Fee is okay if the value is clear",
    desc: "₹500 to ₹3,000 yearly fee where cashback, welcome vouchers, or lounge visits clearly exceed the annual cost.",
  },
  {
    id: "high-fee",
    title: "Higher fee is okay if benefits justify it",
    desc: "₹5,000+ premium or metal tiers with comprehensive global lounge access, concierge, and luxury travel privileges.",
  },
];

const REWARD_COMPLEXITY_OPTIONS = [
  {
    id: "simple",
    title: "Keep it simple",
    desc: "Direct statement cashback or automatic bill credits. Zero point conversion math, portal chasing, or catalog tracking.",
  },
  {
    id: "balanced",
    title: "I'm okay with some optimization",
    desc: "Category multipliers, milestone vouchers, and brand acceleration that yield solid returns with minimal effort.",
  },
  {
    id: "optimizer",
    title: "I don't mind optimizing rewards",
    desc: "Air miles transfers, airline and hotel partner conversion, portal multipliers, and multi-card wallet strategies.",
  },
];

const TRAVEL_FREQUENCY_OPTIONS = [
  "Rarely (0–1 trips/year)",
  "Sometimes (2–4 trips/year)",
  "Frequently (5+ trips/year)",
  "Prefer not to say",
];

const INTL_SPEND_OPTIONS = [
  "Never",
  "Occasionally (online or travel)",
  "Regularly (frequent forex spend)",
  "Prefer not to say",
];

const CREDIT_SCORE_OPTIONS = [
  "750+ (Excellent)",
  "650–749 (Good)",
  "Below 650",
  "I don't know",
  "Prefer not to say",
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: About You
    age: "26",
    employment: "salaried",
    incomeRange: "₹6L – ₹12L",
    city: "Bengaluru",

    // Step 2: Spending
    spending: {
      groceries: 6000,
      dining: 5000,
      fuel: 3500,
      travel: 4000,
      shopping: 6000,
      utilities: 3000,
      entertainment: 2000,
      subscriptions: 1200,
      other: 3000,
    },

    // Step 3: What Matters To You
    priorities: ["Cashback", "Dining", "Shopping"],

    // Step 4: Fee Preference
    feeTolerance: "moderate-fee",

    // Step 5: Reward Complexity
    rewardStyle: "balanced",

    // Step 6: Existing Cards
    hasExistingCards: false,
    existingCards: [],

    // Step 7: Optional Information
    travelFrequency: "Sometimes (2–4 trips/year)",
    internationalSpend: "Occasionally (online or travel)",
    creditScoreRange: "750+ (Excellent)",
  });

  const [cardSearch, setCardSearch] = useState("");
  const [finishing, setFinishing] = useState(false);

  // Restore saved profile or user on mount
  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem("cardwise:user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user.age) {
          setFormData((prev) => ({ ...prev, age: String(user.age) }));
        }
      }

      const rawProfile = window.localStorage.getItem("cardwise:profile");
      if (rawProfile) {
        const profile = JSON.parse(rawProfile);
        setFormData((prev) => ({
          ...prev,
          age: profile.profile?.age ? String(profile.profile.age) : prev.age,
          employment: profile.profile?.employment || prev.employment,
          incomeRange: profile.profile?.incomeRange || prev.incomeRange,
          city: profile.profile?.city || prev.city,
          spending: { ...prev.spending, ...(profile.spending?.categories || {}) },
          priorities: profile.preferences?.priorities || prev.priorities,
          feeTolerance: profile.preferences?.feeTolerance || prev.feeTolerance,
          rewardStyle: profile.preferences?.rewardStyle || prev.rewardStyle,
          existingCards: profile.existingCards || prev.existingCards,
          hasExistingCards: (profile.existingCards || []).length > 0,
          travelFrequency: profile.preferences?.travelFrequency || prev.travelFrequency,
          internationalSpend: profile.preferences?.internationalSpend || prev.internationalSpend,
          creditScoreRange: profile.preferences?.creditScoreRange || prev.creditScoreRange,
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalMonthlySpend = Object.values(formData.spending).reduce(
    (acc, val) => acc + (Number(val) || 0),
    0
  );

  function handleSpendChange(catKey, amount) {
    const parsed = Math.max(0, parseInt(amount, 10) || 0);
    setFormData((prev) => ({
      ...prev,
      spending: { ...prev.spending, [catKey]: parsed },
    }));
  }

  function togglePriority(priorityId) {
    setFormData((prev) => {
      const exists = prev.priorities.includes(priorityId);
      const next = exists
        ? prev.priorities.filter((p) => p !== priorityId)
        : [...prev.priorities, priorityId];
      return { ...prev, priorities: next };
    });
  }

  function toggleExistingCard(slug) {
    setFormData((prev) => {
      const exists = prev.existingCards.includes(slug);
      const next = exists
        ? prev.existingCards.filter((s) => s !== slug)
        : [...prev.existingCards, slug];
      return { ...prev, existingCards: next };
    });
  }

  function handleFinish() {
    setFinishing(true);

    let activeUser = { fullName: "User", email: "user@example.com" };
    try {
      const rawUser = window.localStorage.getItem("cardwise:user");
      if (rawUser) activeUser = JSON.parse(rawUser);
    } catch {
      // fallback
    }

    const structuredProfile = {
      account: {
        fullName: activeUser.fullName,
        email: activeUser.email,
        age: Number(formData.age) || 25,
        updatedAt: new Date().toISOString(),
      },
      profile: {
        age: Number(formData.age) || 25,
        employment: formData.employment,
        incomeRange: formData.incomeRange,
        city: formData.city,
      },
      spending: {
        totalMonthly: totalMonthlySpend,
        categories: formData.spending,
      },
      preferences: {
        priorities: formData.priorities,
        rewardStyle: formData.rewardStyle,
        feeTolerance: formData.feeTolerance,
        travelFrequency: formData.travelFrequency,
        internationalSpend: formData.internationalSpend,
        creditScoreRange: formData.creditScoreRange,
      },
      existingCards: formData.hasExistingCards ? formData.existingCards : [],
    };

    try {
      window.localStorage.setItem("cardwise:profile", JSON.stringify(structuredProfile));
      window.localStorage.setItem(
        "cardwise:user",
        JSON.stringify({ ...activeUser, age: Number(formData.age) || 25 })
      );
    } catch {
      // ignore
    }

    window.setTimeout(() => {
      router.push("/results");
    }, 850);
  }

  const filteredCards = cardsData.filter(
    (c) =>
      c.name.toLowerCase().includes(cardSearch.toLowerCase()) ||
      c.issuer.toLowerCase().includes(cardSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Top Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-2.5">
          <span className="uppercase tracking-wider">Step {step} of {totalSteps}</span>
          <span className="text-black font-bold">
            {step === 1 && "About You"}
            {step === 2 && "Your Spending"}
            {step === 3 && "What Matters To You"}
            {step === 4 && "Fee Preference"}
            {step === 5 && "Reward Complexity"}
            {step === 6 && "Existing Cards"}
            {step === 7 && "Review & Complete"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-10 shadow-sm">
        {/* ================= STEP 1: ABOUT YOU ================= */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Personal Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Tell us a bit about yourself
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                We only ask what is directly needed to check basic card eligibility with issuers. No sensitive personal checks.
              </p>
            </div>

            <div className="space-y-6">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Age
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age === "prefer-not-to-say" ? "" : formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 26"
                    className="w-32 rounded-lg border border-neutral-200 bg-neutral-50/40 px-3.5 py-2.5 text-sm text-black font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, age: "prefer-not-to-say" })}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      formData.age === "prefer-not-to-say"
                        ? "bg-black text-white"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                    }`}
                  >
                    Prefer not to say
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Most credit cards in India require applicants to be 18 or older.
                </p>
              </div>

              {/* Employment Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Employment Status
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EMPLOYMENT_OPTIONS.map((opt) => {
                    const isSelected = formData.employment === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, employment: opt.id })}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? "border-black bg-neutral-900 text-white shadow-sm"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold">{opt.label}</p>
                          {isSelected && <Check className="h-3.5 w-3.5 text-[#DDF247]" strokeWidth={3} />}
                        </div>
                        <p className={`text-[11px] mt-0.5 leading-snug ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Annual Income Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {INCOME_RANGES.map((range) => {
                    const isSelected = formData.incomeRange === range;
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setFormData({ ...formData, incomeRange: range })}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-black text-white"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Helps eliminate cards with minimum income requirements that would not fit.
                </p>
              </div>

              {/* Location / City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Location / City
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full sm:w-64 rounded-lg border border-neutral-200 bg-neutral-50/40 px-3.5 py-2.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Certain cards offer regional dining or airport lounge perks tailored to specific hubs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: YOUR SPENDING ================= */}
        {step === 2 && (
          <div>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Natural Spend Distribution
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                  How do your regular monthly expenses break down?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                  Sensible ranges are fine — false precision is not required. CreditWise helps you earn on what you already spend, never encouraging unnecessary spending.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Approx. Monthly Spend
                </span>
                <span className="text-xl font-extrabold text-black cw-numeric block mt-0.5">
                  ₹{totalMonthlySpend.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  ≈ ₹{(totalMonthlySpend * 12).toLocaleString("en-IN")} / year
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {SPEND_CATEGORIES.map((cat) => {
                const val = formData.spending[cat.key] || 0;
                return (
                  <div
                    key={cat.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50/30 p-4 transition-colors hover:border-neutral-300"
                  >
                    <div className="sm:max-w-xs">
                      <p className="text-xs font-bold text-neutral-800">{cat.label}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{cat.hint}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1">
                        {cat.presets.map((preset) => {
                          const isPresetActive = val === preset;
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => handleSpendChange(cat.key, preset)}
                              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                                isPresetActive
                                  ? "bg-black text-white"
                                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                              }`}
                            >
                              {preset === 0 ? "₹0" : `₹${preset >= 1000 ? `${preset / 1000}k` : preset}`}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Input */}
                      <div className="relative w-28 shrink-0">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                          ₹
                        </span>
                        <input
                          id={`spend-input-${cat.key}`}
                          name={`spend-${cat.key}`}
                          aria-label={`Monthly spending on ${cat.label}`}
                          type="number"
                          min="0"
                          step="500"
                          value={val || ""}
                          onChange={(e) => handleSpendChange(cat.key, e.target.value)}
                          placeholder="0"
                          className="w-full rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 pl-6 text-xs font-bold text-black cw-numeric focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: WHAT MATTERS TO YOU ================= */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Reward Priorities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                What matters most to you?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                Select the benefits that actually make a difference to your daily routine. We will weight verified cards accordingly:
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {PRIORITIES.map((p) => {
                const isSelected = formData.priorities.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePriority(p.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold">{p.label}</p>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#DDF247] border-[#DDF247] text-black"
                            : "border-neutral-300"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                      </div>
                    </div>
                    <p className={`text-[11px] mt-1 leading-snug ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: FEE PREFERENCE ================= */}
        {step === 4 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Cost & Upfront Fees
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                How do you feel about annual card fees?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                CreditWise only highlights fee-based cards when verified math proves that everyday cashback or perks clearly out-earn the cost.
              </p>
            </div>

            <div className="space-y-3">
              {FEE_PREFERENCES.map((feeOpt) => {
                const isSelected = formData.feeTolerance === feeOpt.id;
                return (
                  <button
                    key={feeOpt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, feeTolerance: feeOpt.id })}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">{feeOpt.title}</p>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#DDF247]" strokeWidth={3} />
                      )}
                    </div>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                      {feeOpt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 5: REWARD COMPLEXITY ================= */}
        {step === 5 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Redemption Style
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                How much effort do you want to invest in rewards?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                Some users prefer automated cashback that hits their statement effortlessly. Others enjoy maximizing partner air miles transfers.
              </p>
            </div>

            <div className="space-y-3">
              {REWARD_COMPLEXITY_OPTIONS.map((style) => {
                const isSelected = formData.rewardStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, rewardStyle: style.id })}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">{style.title}</p>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#DDF247]" strokeWidth={3} />
                      )}
                    </div>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 6: EXISTING CARDS ================= */}
        {step === 6 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Current Wallet
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Do you already hold any credit cards?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                Helps us recommend complementary cards without suggesting duplicates you already carry.
              </p>
            </div>

            {/* Strict Privacy Callout */}
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-neutral-700 flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-bold block mb-0.5">Strict Privacy Guarantee</strong>
                We only record product names. We NEVER ask for card numbers, CVVs, expiry dates, PINs, or banking credentials.
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasExistingCards: false, existingCards: [] })}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  !formData.hasExistingCards
                    ? "bg-black text-white shadow-sm"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                No, looking for my first card
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasExistingCards: true })}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  formData.hasExistingCards
                    ? "bg-black text-white shadow-sm"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                Yes, I hold cards already
              </button>
            </div>

            {formData.hasExistingCards && (
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search verified card database (e.g. Amazon Pay, Millennia, Infinia)..."
                    value={cardSearch}
                    onChange={(e) => setCardSearch(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 pl-9 pr-3 py-2 text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {filteredCards.map((card) => {
                    const isSelected = formData.existingCards.includes(card.slug);
                    return (
                      <button
                        key={card.slug}
                        type="button"
                        onClick={() => toggleExistingCard(card.slug)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-black bg-neutral-900 text-white"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold leading-snug">{card.name}</p>
                          <p className={`text-[10px] mt-0.5 uppercase tracking-wider ${isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                            {card.issuer} · {card.network}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-[#DDF247] border-[#DDF247] text-black" : "border-neutral-300"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.existingCards.length > 0 && (
                  <p className="text-xs text-neutral-600 pt-1">
                    Selected: <strong>{formData.existingCards.length} cards</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 7: OPTIONAL INFO & REVIEW ================= */}
        {step === 7 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Review & Optional Context
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Optional context & final review
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                The questions below are strictly optional. Review your choices before we find cards that fit your spending habits.
              </p>
            </div>

            {/* Optional Fields Section */}
            <div className="space-y-4 mb-8">
              {/* Travel Frequency */}
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Travel Frequency <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_FREQUENCY_OPTIONS.map((freq) => {
                    const isSelected = formData.travelFrequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelFrequency: freq })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-black text-white"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {freq}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* International Spending */}
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    International Spending / Forex <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTL_SPEND_OPTIONS.map((opt) => {
                    const isSelected = formData.internationalSpend === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, internationalSpend: opt })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-black text-white"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Credit Score Range */}
              <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Self-Reported Credit Score <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CREDIT_SCORE_OPTIONS.map((score) => {
                    const isSelected = formData.creditScoreRange === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFormData({ ...formData, creditScoreRange: score })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-black text-white"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {score}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5">
                  Educational benchmark only. CreditWise never pulls hard bureau credit reports.
                </p>
              </div>
            </div>

            {/* Editable Profile Summary Section */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                  Your Profile Summary
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Click Edit on any section to modify
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {/* Step 1 summary */}
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">About You</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {formData.age === "prefer-not-to-say" ? "Age confidential" : `${formData.age} yrs`} · {formData.employment}
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      {formData.incomeRange} · {formData.city}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-neutral-700 hover:text-black inline-flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>

                {/* Step 2 summary */}
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Monthly Spend</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      ₹{totalMonthlySpend.toLocaleString("en-IN")} / month
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      Top: Groceries (₹{formData.spending.groceries}), Dining (₹{formData.spending.dining})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[11px] font-bold text-neutral-700 hover:text-black inline-flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>

                {/* Step 3 summary */}
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Priorities</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {formData.priorities.length > 0 ? formData.priorities.slice(0, 3).join(", ") : "None chosen"}
                    </p>
                    {formData.priorities.length > 3 && (
                      <p className="text-neutral-500 text-[11px]">
                        +{formData.priorities.length - 3} more priorities
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-[11px] font-bold text-neutral-700 hover:text-black inline-flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>

                {/* Step 4 & 5 summary */}
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Fee & Complexity</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {FEE_PREFERENCES.find((f) => f.id === formData.feeTolerance)?.title || "Moderate fee"}
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      {REWARD_COMPLEXITY_OPTIONS.find((r) => r.id === formData.rewardStyle)?.title || "Balanced"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-[11px] font-bold text-neutral-700 hover:text-black inline-flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>

                {/* Step 6 summary */}
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 flex justify-between items-start sm:col-span-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Existing Cards</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {formData.hasExistingCards && formData.existingCards.length > 0
                        ? `${formData.existingCards.length} verified cards registered`
                        : "No existing cards selected (looking for first card)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="text-[11px] font-bold text-neutral-700 hover:text-black inline-flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black py-2.5 px-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <Link
              href="/"
              className="text-xs font-semibold text-neutral-400 hover:text-black transition-colors"
            >
              Cancel
            </Link>
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={finishing}
              onClick={handleFinish}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-7 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm disabled:opacity-75"
            >
              {finishing ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-[#DDF247] animate-spin" />
                  <span>Finding cards that fit how you spend…</span>
                </>
              ) : (
                <>
                  <span>Find Cards That Fit How You Spend</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#DDF247]" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
