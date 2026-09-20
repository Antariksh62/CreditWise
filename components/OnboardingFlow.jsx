"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard as CardIcon,
  Search,
  Building,
  Info,
  CheckCircle2,
} from "lucide-react";
import cardsData from "../data/cards.json";

const EMPLOYMENT_OPTIONS = [
  { id: "salaried", label: "Salaried", desc: "Regular monthly payroll or compensation" },
  { id: "self-employed", label: "Self-employed", desc: "Freelancers, consultants, professionals" },
  { id: "business-owner", label: "Business owner", desc: "Enterprise, retail, or SME operator" },
  { id: "student", label: "Student", desc: "Full-time student or scholar" },
  { id: "other", label: "Other", desc: "Homemaker, retired, or transitional" },
];

const INCOME_RANGES = [
  "Under ₹3 Lakhs",
  "₹3L – ₹6L",
  "₹6L – ₹12L",
  "₹12L – ₹25L",
  "₹25L – ₹50L",
  "₹50L+",
  "I&apos;d rather not say",
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
];

const SPEND_CATEGORIES = [
  { key: "groceries", label: "Groceries & Supermarket", defaultVal: 10000 },
  { key: "dining", label: "Dining & Food Delivery", defaultVal: 6000 },
  { key: "shopping", label: "Online & Retail Shopping", defaultVal: 10000 },
  { key: "travel", label: "Travel, Flights & Hotels", defaultVal: 5000 },
  { key: "fuel", label: "Fuel & EV Charging", defaultVal: 3500 },
  { key: "utilities", label: "Utilities & Bills", defaultVal: 4000 },
  { key: "entertainment", label: "Entertainment & Movies", defaultVal: 2000 },
  { key: "subscriptions", label: "Streaming & Subscriptions", defaultVal: 1500 },
  { key: "rent", label: "Rent & Society Maintenance", defaultVal: 15000 },
  { key: "other", label: "Other Day-to-Day Expenses", defaultVal: 5000 },
];

const MATTERS_OPTIONS = [
  "Cashback",
  "Reward points",
  "Travel",
  "Airport lounge access",
  "Fuel savings",
  "Dining",
  "Shopping",
  "International spending",
  "Low/no annual fee",
  "Simple rewards",
  "Overall value",
];

const REWARD_STYLES = [
  {
    id: "simple",
    title: "Keep it simple",
    desc: "Direct statement cashback or automatic bill credits. Zero point conversion math or catalogue hunting.",
  },
  {
    id: "balanced",
    title: "Some optimization is okay",
    desc: "Category multipliers, quarterly vouchers, and brand acceleration that yield solid returns with minimal effort.",
  },
  {
    id: "optimizer",
    title: "I&apos;m happy to optimize",
    desc: "Air miles transfers, airline and hotel partner conversion, portal multipliers, and multi-card wallet strategies.",
  },
];

const FEE_OPTIONS = [
  {
    id: "no-fee",
    title: "Prefer no annual fee",
    desc: "Lifetime free cards or products where the fee easily reverses through standard spend thresholds.",
  },
  {
    id: "moderate-fee",
    title: "Fee is okay if the value is clear",
    desc: "₹500 to ₹3,000 yearly fee where welcome vouchers, cashback, or airport lounge visits easily surpass the cost.",
  },
  {
    id: "high-fee",
    title: "Higher fee is okay if benefits justify it",
    desc: "₹5,000+ premium or metal tiers with unlimited global lounge access, concierge desk, golf, and luxury privileges.",
  },
];

const BANK_OPTIONS = [
  "HDFC Bank",
  "ICICI Bank",
  "SBI (State Bank of India)",
  "Axis Bank",
  "Bank of Baroda / BOBCARD",
  "IndusInd Bank",
  "HSBC India",
  "IDFC FIRST Bank",
  "YES Bank",
  "RBL Bank",
  "Other Bank",
];

const CREDIT_SCORE_RANGES = [
  "Don&apos;t know",
  "Below 650",
  "650–749",
  "750+",
  "Prefer not to say",
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 9;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    age: 25,
    employment: "salaried",
    incomeRange: "₹6L – ₹12L",
    city: "Bengaluru",
    // Step 2
    spending: {
      groceries: 10000,
      dining: 6000,
      shopping: 10000,
      travel: 5000,
      fuel: 3500,
      utilities: 4000,
      entertainment: 2000,
      subscriptions: 1500,
      rent: 15000,
      other: 5000,
    },
    // Step 3
    priorities: ["Cashback", "Dining", "Shopping"],
    // Step 4
    rewardStyle: "balanced",
    // Step 5
    feeTolerance: "moderate-fee",
    // Step 6
    travelFrequency: "Sometimes",
    internationalSpend: "Occasionally",
    // Step 7
    hasExistingCards: false,
    existingCards: [],
    // Step 8
    existingBanks: [],
    // Step 9
    creditScoreRange: "750+",
  });

  const [cardSearch, setCardSearch] = useState("");
  const [finishing, setFinishing] = useState(false);

  // Prefill initial user data if present in localStorage
  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem("cardwise:user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user.age) {
          setFormData((prev) => ({ ...prev, age: user.age }));
        }
      }

      const rawProfile = window.localStorage.getItem("cardwise:profile");
      if (rawProfile) {
        const profile = JSON.parse(rawProfile);
        setFormData((prev) => ({
          ...prev,
          ...(profile.profile || {}),
          spending: profile.spending?.categories || prev.spending,
          priorities: profile.preferences?.priorities || prev.priorities,
          rewardStyle: profile.preferences?.rewardStyle || prev.rewardStyle,
          feeTolerance: profile.preferences?.feeTolerance || prev.feeTolerance,
          travelFrequency: profile.preferences?.travelFrequency || prev.travelFrequency,
          internationalSpend: profile.preferences?.internationalSpend || prev.internationalSpend,
          existingCards: profile.existingCards || prev.existingCards,
          hasExistingCards: (profile.existingCards || []).length > 0,
          existingBanks: profile.preferences?.existingBanks || prev.existingBanks,
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

  function togglePriority(item) {
    setFormData((prev) => {
      const exists = prev.priorities.includes(item);
      const next = exists
        ? prev.priorities.filter((p) => p !== item)
        : [...prev.priorities, item];
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

  function toggleBank(bank) {
    setFormData((prev) => {
      const exists = prev.existingBanks.includes(bank);
      const next = exists
        ? prev.existingBanks.filter((b) => b !== bank)
        : [...prev.existingBanks, bank];
      return { ...prev, existingBanks: next };
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
        age: Number(formData.age),
        updatedAt: new Date().toISOString(),
      },
      profile: {
        age: Number(formData.age),
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
        existingBanks: formData.existingBanks,
        creditScoreRange: formData.creditScoreRange,
      },
      existingCards: formData.hasExistingCards ? formData.existingCards : [],
    };

    try {
      window.localStorage.setItem("cardwise:profile", JSON.stringify(structuredProfile));
      // Also update base user profile info
      window.localStorage.setItem(
        "cardwise:user",
        JSON.stringify({ ...activeUser, age: Number(formData.age) })
      );
    } catch {
      // ignore
    }

    window.setTimeout(() => {
      router.push("/results");
    }, 800);
  }

  const filteredCards = cardsData.filter((c) =>
    c.name.toLowerCase().includes(cardSearch.toLowerCase()) ||
    c.issuer.toLowerCase().includes(cardSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Top Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-2">
          <span>STEP {step} OF {totalSteps}</span>
          <span className="text-black font-bold">
            {step === 1 && "About You"}
            {step === 2 && "Your Spending"}
            {step === 3 && "What Matters"}
            {step === 4 && "Reward Style"}
            {step === 5 && "Fee Preference"}
            {step === 6 && "Travel & International"}
            {step === 7 && "Existing Cards"}
            {step === 8 && "Banking Relationships"}
            {step === 9 && "Credit Profile"}
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
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Helps filter cards based on basic eligibility without asking for invasive personal details.
              </p>
            </div>

            <div className="space-y-6">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Your Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full sm:w-48 rounded-lg border border-neutral-200 bg-neutral-50/40 px-3.5 py-2.5 text-sm text-black font-semibold focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Employment */}
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
                        <p className="text-xs font-bold">{opt.label}</p>
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
                  Approximate Annual Income
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
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Current City (Optional)
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
                  Natural Spend Habits
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                  Where does your money typically flow?
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                  Approximate monthly figures are completely fine. We optimize your existing expenses.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Total Monthly Spend
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-neutral-100 bg-neutral-50/30 p-3.5"
                  >
                    <div className="sm:max-w-xs">
                      <p className="text-xs font-bold text-neutral-800">{cat.label}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="500"
                          value={val || ""}
                          onChange={(e) => handleSpendChange(cat.key, e.target.value)}
                          placeholder="0"
                          className="w-32 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 pl-6 text-xs sm:text-sm font-bold text-black cw-numeric focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div className="hidden sm:flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSpendChange(cat.key, 0)}
                          className="px-2 py-1 text-[10px] font-semibold text-neutral-500 hover:text-black border border-neutral-200 rounded bg-white"
                        >
                          ₹0
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSpendChange(cat.key, cat.defaultVal)}
                          className="px-2 py-1 text-[10px] font-semibold text-neutral-500 hover:text-black border border-neutral-200 rounded bg-white"
                        >
                          Typ.
                        </button>
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
                Priorities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                What matters most to you in a card?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Select all benefits and categories that align with your lifestyle:
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {MATTERS_OPTIONS.map((item) => {
                const isSelected = formData.priorities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => togglePriority(item)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-black text-white shadow-sm"
                        : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 text-[#DDF247]" strokeWidth={3} />}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: REWARD STYLE ================= */}
        {step === 4 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Reward Management
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                How simple or optimized do you want rewards to be?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Choose the level of effort you are comfortable putting into your reward strategy:
              </p>
            </div>

            <div className="space-y-3">
              {REWARD_STYLES.map((style) => {
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
                    <p className={`text-xs mt-1 leading-relaxed ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                      {style.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 5: FEES ================= */}
        {step === 5 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Fee Comfort
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                How do you feel about annual fees?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                CreditWise only recommends fee-based cards when proven math demonstrates net positive returns.
              </p>
            </div>

            <div className="space-y-3">
              {FEE_OPTIONS.map((feeOpt) => {
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
                    <p className={`text-xs mt-1 leading-relaxed ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                      {feeOpt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 6: TRAVEL / INTERNATIONAL ================= */}
        {step === 6 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Mobility & Forex
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                How often do you travel & spend internationally?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Helps prioritize 0% forex markup, airline co-brands, and lounge quotas.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Domestic & International Travel Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Rarely", "Sometimes", "Frequently"].map((freq) => {
                    const isSelected = formData.travelFrequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelFrequency: freq })}
                        className={`p-3.5 rounded-xl text-xs font-bold text-center transition-all ${
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  International Transactions (Overseas or foreign sites)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Never", "Occasionally", "Frequently"].map((freq) => {
                    const isSelected = formData.internationalSpend === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFormData({ ...formData, internationalSpend: freq })}
                        className={`p-3.5 rounded-xl text-xs font-bold text-center transition-all ${
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
            </div>
          </div>
        )}

        {/* ================= STEP 7: EXISTING CARDS ================= */}
        {step === 7 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Card Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Do you already hold any credit cards?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Select your current cards so we can find complementary cards without recommending duplicates.
              </p>
            </div>

            {/* Strict Privacy Callout */}
            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs text-neutral-700 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-bold block mb-0.5">Privacy Safeguard</strong>
                We only record product names. We NEVER ask for card numbers, CVVs, expiry dates, or banking passwords.
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasExistingCards: false, existingCards: [] })}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  !formData.hasExistingCards
                    ? "bg-black text-white"
                    : "border border-neutral-200 bg-white text-neutral-700"
                }`}
              >
                No, this will be my first card
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasExistingCards: true })}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  formData.hasExistingCards
                    ? "bg-black text-white"
                    : "border border-neutral-200 bg-white text-neutral-700"
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
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#DDF247] border-[#DDF247] text-black" : "border-neutral-300"
                        }`}>
                          {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {formData.existingCards.length > 0 && (
                  <p className="text-xs text-neutral-500 pt-1">
                    Selected: <strong>{formData.existingCards.length} cards</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 8: BANKING RELATIONSHIPS ================= */}
        {step === 8 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Optional Pre-Approvals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Which banks do you currently hold accounts with?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Existing relationships often make card approvals faster. We never ask for account numbers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {BANK_OPTIONS.map((bank) => {
                const isSelected = formData.existingBanks.includes(bank);
                return (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => toggleBank(bank)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold leading-tight">{bank}</span>
                      {isSelected && <Check className="h-3 w-3 text-[#DDF247] shrink-0" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 9: CREDIT PROFILE ================= */}
        {step === 9 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Self-Reported Score
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                Do you know your approximate credit score?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                Educational estimate only. CreditWise never runs hard bureau checks.
              </p>
            </div>

            <div className="space-y-2.5">
              {CREDIT_SCORE_RANGES.map((range) => {
                const isSelected = formData.creditScoreRange === range;
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setFormData({ ...formData, creditScoreRange: range })}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">{range}</span>
                    {isSelected && <Check className="h-4 w-4 text-[#DDF247]" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-black py-2.5 px-4 rounded-lg transition-colors"
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
              className="inline-flex items-center gap-2 rounded-lg bg-black px-7 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-sm disabled:opacity-50"
            >
              {finishing ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-[#DDF247] animate-pulse" />
                  Generating Your Recommendations…
                </>
              ) : (
                <>
                  Complete Onboarding & View Matches →
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
