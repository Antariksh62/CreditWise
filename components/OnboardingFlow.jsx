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
  Store,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MAJOR_MERCHANTS, resolveMerchant } from "../lib/merchantRewardRules";

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

const CURATED_POPULAR_MERCHANTS = [
  { id: "amazon", name: "Amazon", category: "shopping", badge: "E-Commerce", hint: "5% on Amazon Pay ICICI, 5% on Cashback SBI" },
  { id: "flipkart", name: "Flipkart", category: "shopping", badge: "E-Commerce", hint: "5% on Flipkart Axis, 5% on Cashback SBI" },
  { id: "myntra", name: "Myntra", category: "shopping", badge: "Fashion", hint: "Accelerated fashion & festive offers" },
  { id: "bigbasket", name: "BigBasket / Tata Neu", category: "groceries", badge: "Tata Group", hint: "Up to 10% NeuCoins on Tata Neu Infinity" },
  { id: "swiggy", name: "Swiggy", category: "dining", badge: "Food & Instamart", hint: "10% cashback on Swiggy HDFC" },
  { id: "zomato", name: "Zomato", category: "dining", badge: "Food & Dining", hint: "Dining savings & instant food discounts" },
  { id: "blinkit", name: "Blinkit", category: "groceries", badge: "Quick Commerce", hint: "Quick grocery delivery cashback" },
  { id: "zepto", name: "Zepto", category: "groceries", badge: "Quick Commerce", hint: "Instant daily delivery rewards" },
  { id: "croma", name: "Croma", category: "shopping", badge: "Tata Group", hint: "Electronics & appliances NeuCoins rewards" },
  { id: "ajio", name: "AJIO", category: "shopping", badge: "Reliance Retail", hint: "Online fashion discounts & retail cashback" },
  { id: "airindia", name: "Air India", category: "travel", badge: "Airlines", hint: "Tata Neu / flight booking points" },
  { id: "makemytrip", name: "MakeMyTrip", category: "travel", badge: "Travel", hint: "Flights & hotel partner savings" },
  { id: "bpcl", name: "BPCL Petrol", category: "fuel", badge: "Fuel", hint: "Up to 4.25% valueback on BPCL SBI" },
  { id: "electricity", name: "Electricity Bills", category: "utilities", badge: "Utilities", hint: "5% cashback on Airtel Axis / Ace" },
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

export const PREFERRED_REWARD_TYPES = [
  { id: "Cashback", label: "Cashback", desc: "Direct statement credits automatically applied to your bill" },
  { id: "Reward Points", label: "Reward Points", desc: "Flexible points for vouchers, gifts, and catalog redemption" },
  { id: "Travel Benefits", label: "Travel Benefits", desc: "Air miles, airline partner transfers, hotels, and airport lounge access" },
  { id: "No Preference", label: "No Preference", desc: "Open to whichever structure yields the highest net monetary return" },
];

export const PREFERRED_CARD_CHARACTERISTICS = [
  { id: "Low Annual Fee", label: "Low / No Annual Fee", desc: "Lifetime free or easily waivable with everyday spending" },
  { id: "Premium Benefits", label: "Premium Benefits", desc: "Comprehensive airport lounge access, concierge, and luxury perks" },
  { id: "Simplicity", label: "Simplicity", desc: "Single-rate earning without portal multipliers or expiration tracking" },
  { id: "Maximum Rewards", label: "Maximum Rewards", desc: "High category multipliers, milestone vouchers, and transfer bonuses" },
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

export const ONBOARDING_DRAFT_KEY = "cardwise:onboarding_draft";

const INITIAL_FORM_DATA = {
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

  // Step 3: What Matters To You & Preferences
  preferredRewardType: "Cashback",
  preferredCardCharacteristics: "Simplicity",
  priorities: ["Cashback", "Dining", "Shopping"],

  // Step 4: Fee Preference
  feeTolerance: "moderate-fee",

  // Step 5: Reward Complexity
  rewardStyle: "balanced",

  // Step 6: Target Setup (Card Count)
  cardCount: 1,

  // Step 7: Optional Information
  travelFrequency: "Sometimes (2–4 trips/year)",
  internationalSpend: "Occasionally (online or travel)",
  creditScoreRange: "750+ (Excellent)",
};

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [inputMode, setInputMode] = useState("manual"); // "manual" | "ai"
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [isParsingNL, setIsParsingNL] = useState(false);
  const [nlFeedbackMessage, setNlFeedbackMessage] = useState(null);
  const [finishing, setFinishing] = useState(false);

  // Progressive Disclosure: Frequent Brands & Ecosystems
  const [showMerchantPicker, setShowMerchantPicker] = useState(false);
  const [merchantSearchQuery, setMerchantSearchQuery] = useState("");

  // Restore saved draft or profile on mount
  useEffect(() => {
    router.prefetch("/results");
    try {
      // 1. Check for in-progress draft first to preserve navigation/refresh progress
      const rawDraft = window.localStorage.getItem(ONBOARDING_DRAFT_KEY);
      if (rawDraft) {
        const draft = JSON.parse(rawDraft);
        if (draft && typeof draft === "object") {
          if (draft.step) setStep(Math.min(totalSteps, Math.max(1, Number(draft.step) || 1)));
          if (draft.formData) setFormData((prev) => ({ ...prev, ...draft.formData }));
          if (draft.inputMode) setInputMode(draft.inputMode);
          if (draft.naturalLanguageInput) setNaturalLanguageInput(draft.naturalLanguageInput);
          return;
        }
      }

      // 2. Otherwise restore from saved profile if available
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
          preferredRewardType: profile.preferences?.preferredRewardType || prev.preferredRewardType,
          preferredCardCharacteristics: profile.preferences?.preferredCardCharacteristics || prev.preferredCardCharacteristics,
          priorities: profile.preferences?.priorities || prev.priorities,
          feeTolerance: profile.preferences?.feeTolerance || prev.feeTolerance,
          rewardStyle: profile.preferences?.rewardStyle || prev.rewardStyle,
          cardCount: Number(profile.preferences?.cardCount || profile.cardCount) || prev.cardCount,
          travelFrequency: profile.preferences?.travelFrequency || prev.travelFrequency,
          internationalSpend: profile.preferences?.internationalSpend || prev.internationalSpend,
          creditScoreRange: profile.preferences?.creditScoreRange || prev.creditScoreRange,
        }));
      }

      const rawUser = window.localStorage.getItem("cardwise:user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user.age) {
          setFormData((prev) => ({ ...prev, age: String(user.age) }));
        }
      }
    } catch {
      // ignore
    }
  }, [router]);

  // Persist draft on every change so guest progress is never lost across navigation or refresh
  useEffect(() => {
    if (finishing) return;
    try {
      window.localStorage.setItem(
        ONBOARDING_DRAFT_KEY,
        JSON.stringify({ step, formData, inputMode, naturalLanguageInput })
      );
    } catch {
      // ignore
    }
  }, [step, formData, inputMode, naturalLanguageInput, finishing]);

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

  function handleMerchantSpendChange(merchantId, amount) {
    const parsed = Math.max(0, parseInt(amount, 10) || 0);
    setFormData((prev) => {
      const next = { ...(prev.merchants || {}) };
      if (parsed <= 0) {
        delete next[merchantId];
      } else {
        next[merchantId] = parsed;
      }
      return { ...prev, merchants: next };
    });
  }

  function handleAddMerchant(merchantId, initialAmount = 2500) {
    setFormData((prev) => {
      const next = { ...(prev.merchants || {}) };
      if (!next[merchantId]) {
        next[merchantId] = initialAmount;
      }
      return { ...prev, merchants: next };
    });
  }

  function handleRemoveMerchant(merchantId) {
    setFormData((prev) => {
      const next = { ...(prev.merchants || {}) };
      delete next[merchantId];
      return { ...prev, merchants: next };
    });
  }

  const availableMerchantsToDisplay = merchantSearchQuery.trim()
    ? MAJOR_MERCHANTS.filter((m) => {
        const q = merchantSearchQuery.toLowerCase().trim();
        return (
          m.name.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.aliases && m.aliases.some((a) => a.toLowerCase().includes(q)))
        );
      })
    : CURATED_POPULAR_MERCHANTS;

  async function handleAutoFillWithAI() {
    if (!naturalLanguageInput.trim()) return;
    setIsParsingNL(true);
    setNlFeedbackMessage(null);
    try {
      const res = await fetch("/api/parse-spending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: naturalLanguageInput }),
      });
      const data = await res.json();

      if (data.aiUnavailable) {
        // Fallback: Gemini API unavailable (rate limits, 503, timeout, config error)
        // Automatically switch interface to manual mode without losing previously entered numbers
        setInputMode("manual");
        if (data.categories) {
          const updates = {};
          Object.entries(data.categories).forEach(([k, v]) => {
            if (v > 0) updates[k] = v;
          });
          if (Object.keys(updates).length > 0) {
            setFormData((prev) => ({
              ...prev,
              spending: { ...prev.spending, ...updates },
            }));
          }
        }
        setNlFeedbackMessage({
          type: "fallback",
          text: data.message || "AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.",
        });
        return;
      }

      if (data.success && data.categories && Object.keys(data.categories).length > 0) {
        const updates = {};
        Object.entries(data.categories).forEach(([k, v]) => {
          if (v > 0) updates[k] = v;
        });
        setFormData((prev) => ({
          ...prev,
          spending: {
            ...prev.spending,
            ...updates,
          },
          preferredRewardType: data.preferences?.preferredRewardType || prev.preferredRewardType,
          preferredCardCharacteristics: data.preferences?.preferredCardCharacteristics || prev.preferredCardCharacteristics,
        }));
        const count = Object.keys(updates).length;
        setNlFeedbackMessage({
          type: "success",
          text: `Auto-filled ${count > 0 ? `${count} categories` : "numbers"} from your description. Review and adjust any values below.`,
        });
        // Switch to manual mode view so the user can immediately review & adjust
        setInputMode("manual");
      } else {
        setNlFeedbackMessage({
          type: "error",
          text: data.error || "Could not detect specific category amounts. Try: '₹12,000 groceries, ₹5,000 dining, ₹4,000 fuel'.",
        });
      }
    } catch {
      // Network or unexpected failure: automatically fallback to manual mode
      setInputMode("manual");
      setNlFeedbackMessage({
        type: "fallback",
        text: "AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.",
      });
    } finally {
      setIsParsingNL(false);
    }
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

  function handleRestartOnboarding() {
    try {
      window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);
      window.localStorage.removeItem("cardwise:profile");
      window.localStorage.removeItem("cardwise:selected_card_count");
    } catch {
      // ignore
    }
    setStep(1);
    setInputMode("manual");
    setNaturalLanguageInput("");
    setNlFeedbackMessage(null);
    setFormData(INITIAL_FORM_DATA);
  }

  function handleFinish() {
    setFinishing(true);

    let activeUser = null;
    try {
      const rawUser = window.localStorage.getItem("cardwise:user");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u && (u.email || u.fullName)) {
          activeUser = u;
        }
      }
    } catch {
      // fallback
    }

    const structuredProfile = {
      cardCount: Number(formData.cardCount) || 1,
      account: {
        fullName: activeUser ? activeUser.fullName : "Guest User",
        email: activeUser ? activeUser.email : "guest@creditwise.local",
        isGuest: !activeUser,
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
        cardCount: Number(formData.cardCount) || 1,
        preferredRewardType: formData.preferredRewardType,
        preferredCardCharacteristics: formData.preferredCardCharacteristics,
        priorities: formData.priorities,
        rewardStyle: formData.rewardStyle,
        feeTolerance: formData.feeTolerance,
        travelFrequency: formData.travelFrequency,
        internationalSpend: formData.internationalSpend,
        creditScoreRange: formData.creditScoreRange,
      },
      existingCards: [],
    };

    try {
      window.localStorage.setItem("cardwise:profile", JSON.stringify(structuredProfile));
      window.localStorage.setItem("cardwise:selected_card_count", String(formData.cardCount || 1));
      window.localStorage.removeItem(ONBOARDING_DRAFT_KEY);

      if (activeUser) {
        window.localStorage.setItem(
          "cardwise:user",
          JSON.stringify({ ...activeUser, age: Number(formData.age) || 25 })
        );
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch {
      // ignore
    }

    router.push("/results");
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Top Header & Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-2.5">
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-wider">Step {step} of {totalSteps}</span>
            <button
              type="button"
              onClick={handleRestartOnboarding}
              className="text-[11px] font-medium text-neutral-400 hover:text-black underline transition-colors"
              title="Clear saved draft and restart onboarding from step 1"
            >
              Restart onboarding
            </button>
          </div>
          <span className="text-black font-bold">
            {step === 1 && "About You"}
            {step === 2 && "Your Spending"}
            {step === 3 && "What Matters To You"}
            {step === 4 && "Fee Preference"}
            {step === 5 && "Reward Complexity"}
            {step === 6 && "Desired Setup"}
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
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-8 md:p-10 shadow-sm">
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

            {/* Input Mode Selector: Manual vs AI */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="inline-flex rounded-lg bg-neutral-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setInputMode("manual")}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    inputMode === "manual"
                      ? "bg-white text-black shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  Manual Questionnaire (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("ai")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    inputMode === "ai"
                      ? "bg-white text-black shadow-xs"
                      : "text-neutral-500 hover:text-black"
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-neutral-800" />
                  AI-Assisted (Optional)
                </button>
              </div>

              {inputMode === "ai" && (
                <button
                  type="button"
                  onClick={() => setInputMode("manual")}
                  className="text-[11px] font-semibold text-neutral-500 hover:text-black transition-colors"
                >
                  Switch to Manual Mode →
                </button>
              )}
            </div>

            {/* AI Assistant Panel (when inputMode === 'ai') */}
            {inputMode === "ai" && (
              <div className="mb-6 rounded-xl border border-neutral-200/90 bg-neutral-50/70 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-neutral-800 shrink-0" />
                  <label
                    htmlFor="nl-spend-input"
                    className="text-xs font-bold text-neutral-900"
                  >
                    AI-Assisted Spend Parsing
                  </label>
                </div>
                <p className="text-[11px] text-neutral-500 mb-2.5 leading-relaxed">
                  Describe your regular monthly expenses in plain words (e.g. &ldquo;₹12,000 groceries, ₹5,000 dining out, ₹3,500 fuel, ₹8,000 shopping&rdquo;). We will distribute them to the fields below.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="nl-spend-input"
                    type="text"
                    value={naturalLanguageInput}
                    onChange={(e) => setNaturalLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAutoFillWithAI();
                      }
                    }}
                    placeholder="e.g. ₹10,000 groceries, ₹6,000 dining, ₹4,000 fuel and ₹15,000 online shopping"
                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    disabled={isParsingNL || !naturalLanguageInput.trim()}
                    onClick={handleAutoFillWithAI}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50 shrink-0"
                  >
                    {isParsingNL ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Parsing…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 text-[#DDF247]" />
                        <span>Auto-fill with AI</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">
                    Gemini AI extraction is optional. You can review and adjust every amount.
                  </span>
                  <button
                    type="button"
                    onClick={() => setInputMode("manual")}
                    className="font-semibold text-neutral-600 hover:text-black"
                  >
                    Complete manually instead
                  </button>
                </div>
              </div>
            )}

            {/* Subtle Fallback Notification Banner */}
            {nlFeedbackMessage && nlFeedbackMessage.type === "fallback" && (
              <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">
                      AI-assisted onboarding is temporarily unavailable. No worries — you can complete your profile manually.
                    </span>
                    <span className="text-[11px] text-amber-800/80 block mt-0.5">
                      All your inputs are preserved below. Review the categories and adjust as needed.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setInputMode("manual");
                        setNlFeedbackMessage(null);
                      }}
                      className="mt-2 inline-flex items-center gap-1 rounded bg-black px-3 py-1.5 text-[11px] font-bold text-white hover:bg-neutral-800 transition-colors"
                    >
                      Continue Manually
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNlFeedbackMessage(null)}
                  className="text-amber-700 hover:text-amber-950 text-xs font-semibold shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Success message */}
            {nlFeedbackMessage && nlFeedbackMessage.type === "success" && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{nlFeedbackMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNlFeedbackMessage(null)}
                  className="text-emerald-700 hover:text-emerald-950 text-xs font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

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

            {/* Brand & Platform Accelerators (Progressive Disclosure) */}
            <div className="mt-8 rounded-xl border border-neutral-200/90 bg-white p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-neutral-800" />
                    <h3 className="text-sm font-bold text-neutral-900">
                      Frequent Brands & Platforms
                    </h3>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed max-w-xl">
                    Do you regularly order or shop on specific platforms? Co-branded cards like Amazon Pay ICICI, Swiggy HDFC, Flipkart Axis, Tata Neu, or BPCL give accelerated rewards when matched with your regular brands.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMerchantPicker(!showMerchantPicker)}
                  className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  <span>{showMerchantPicker ? "Hide Brand Selector" : "Choose Regular Brands"}</span>
                  {showMerchantPicker ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Active Declared Merchants List */}
              {Object.keys(formData.merchants || {}).length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Your Selected Brands ({Object.keys(formData.merchants).length})
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Subtracted automatically from category spend • No double counting
                    </span>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {Object.entries(formData.merchants).map(([mId, amt]) => {
                      const mInfo = resolveMerchant(mId) || { id: mId, name: mId, category: "other" };
                      return (
                        <div
                          key={mId}
                          className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200/90 bg-neutral-50/60 p-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-neutral-900 truncate">
                                {mInfo.name}
                              </span>
                              <span className="rounded bg-neutral-200/70 px-1.5 py-0.5 text-[9px] font-bold uppercase text-neutral-600">
                                {mInfo.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1.5">
                              {[1000, 2500, 5000, 10000].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleMerchantSpendChange(mId, preset)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                                    amt === preset
                                      ? "bg-black text-white"
                                      : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                                  }`}
                                >
                                  ₹{preset >= 1000 ? `${preset / 1000}k` : preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="relative w-24">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-neutral-400">
                                ₹
                              </span>
                              <input
                                type="number"
                                min="0"
                                step="500"
                                value={amt || ""}
                                onChange={(e) => handleMerchantSpendChange(mId, e.target.value)}
                                placeholder="0"
                                aria-label={`Monthly spend at ${mInfo.name}`}
                                className="w-full rounded-md border border-neutral-200 bg-white px-2 py-1 pl-5 text-xs font-bold text-black cw-numeric focus:outline-none focus:ring-2 focus:ring-black"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMerchant(mId)}
                              title={`Remove ${mInfo.name}`}
                              className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-black transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Add Curated Brands or Search */}
              {showMerchantPicker && (
                <div className="mt-5 border-t border-neutral-100 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      Tap a brand to add it to your spend breakdown:
                    </span>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                      <input
                        type="text"
                        value={merchantSearchQuery}
                        onChange={(e) => setMerchantSearchQuery(e.target.value)}
                        placeholder="Search brands (e.g. Swiggy, BPCL, Air India)..."
                        className="w-full rounded-md border border-neutral-200 bg-white px-2 py-1 pl-7 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableMerchantsToDisplay.map((m) => {
                      const isAdded = Boolean(formData.merchants?.[m.id]);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              handleRemoveMerchant(m.id);
                            } else {
                              handleAddMerchant(m.id, 2500);
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                            isAdded
                              ? "border-black bg-black text-white shadow-xs"
                              : "border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:border-neutral-300 hover:bg-white"
                          }`}
                        >
                          <span>{m.name}</span>
                          {isAdded ? (
                            <Check className="h-3 w-3 text-[#DDF247]" />
                          ) : (
                            <Plus className="h-3 w-3 text-neutral-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {availableMerchantsToDisplay.length === 0 && (
                    <p className="text-xs text-neutral-500 py-2">
                      No brands match &ldquo;{merchantSearchQuery}&rdquo;. Unlisted merchants are evaluated using standard category reward rates.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 3: WHAT MATTERS TO YOU ================= */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Reward Preferences & Characteristics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                What reward structure works best for you?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                Choose your preferred reward type and card style. CreditWise optimizes across verified terms to suit your everyday habits.
              </p>
            </div>

            {/* Section A: Preferred Reward Type */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                Preferred Reward Type
              </label>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PREFERRED_REWARD_TYPES.map((rt) => {
                  const isSelected = formData.preferredRewardType === rt.id;
                  return (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredRewardType: rt.id })}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "border-black bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold">{rt.label}</p>
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
                        {rt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section B: Preferred Card Characteristics */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                Preferred Card Characteristics
              </label>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PREFERRED_CARD_CHARACTERISTICS.map((pc) => {
                  const isSelected = formData.preferredCardCharacteristics === pc.id;
                  return (
                    <button
                      key={pc.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredCardCharacteristics: pc.id })}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "border-black bg-neutral-900 text-white shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold">{pc.label}</p>
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
                        {pc.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section C: Key Benefits / Everyday Categories */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800 block mb-2">
                Everyday Category Priorities (Select all that apply)
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {PRIORITIES.map((p) => {
                  const isSelected = formData.priorities.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePriority(p.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
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
                      <p className={`text-[10.5px] mt-0.5 leading-snug ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
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

        {/* ================= STEP 6: TARGET SETUP (CARD COUNT) ================= */}
        {step === 6 && (
          <div>
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Wallet Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black mt-1">
                How many credit cards do you want?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-xl">
                Choose the target number of cards you want in your wallet. Our engine will calculate the mathematically optimal setup for exactly this number.
              </p>
            </div>

            {/* TransUnion CIBIL Context Insight */}
            <div className="mb-6 rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-4 text-xs text-neutral-700 flex items-start gap-3">
              <Info className="h-4 w-4 text-neutral-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-neutral-900 block mb-0.5">
                  Did you know? Indian credit-card consumers hold approximately 2.1 live credit cards on average.
                </span>
                <span className="text-neutral-500 text-[11px] block mt-0.5">
                  Source: TransUnion CIBIL, Beyond the Swipe, March 2026. The figure is calculated from approximately 10.7 crore live cards across roughly 5.2 crore active credit-card consumers. Around 22% of active cardholders hold three or more cards.
                </span>
              </div>
            </div>

            {/* 3 Count Options */}
            <div className="space-y-3">
              {[
                {
                  count: 1,
                  title: "1 Credit Card",
                  badge: "Simplicity",
                  desc: "Single-card simplicity. One card for all your spending with zero wallet juggling or multiple statement tracking.",
                  fit: "Best if you prefer an effortless setup with zero complexity.",
                },
                {
                  count: 2,
                  title: "2 Credit Cards",
                  badge: "Strategic Pairing",
                  desc: "Strategic pairing. A versatile primary card for core everyday spends combined with a category specialist for elevated returns.",
                  fit: "Best balance between maximized earnings and manageable administration.",
                },
                {
                  count: 3,
                  title: "3 Credit Cards",
                  badge: "Full Optimization",
                  desc: "Optimized portfolio. Comprehensive category coverage ensuring high returns across groceries, dining, travel, and online purchases.",
                  fit: "Best if you want to extract the highest net monetary value across every spend area.",
                },
              ].map((opt) => {
                const isSelected = formData.cardCount === opt.count;
                return (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => setFormData({ ...formData, cardCount: opt.count })}
                    className={`w-full text-left p-5 rounded-xl border transition-all ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-sm"
                        : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{opt.title}</p>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-neutral-800 text-neutral-300"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {opt.badge}
                        </span>
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-[#DDF247]" strokeWidth={3} />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        isSelected ? "text-neutral-300" : "text-neutral-500"
                      }`}
                    >
                      {opt.desc}
                    </p>
                    <p
                      className={`text-[11px] mt-2 font-medium ${
                        isSelected ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      {opt.fit}
                    </p>
                  </button>
                );
              })}
            </div>
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
                    {Object.keys(formData.merchants || {}).length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {Object.entries(formData.merchants).map(([mId, amt]) => {
                          const mInfo = resolveMerchant(mId);
                          return (
                            <span key={mId} className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700">
                              {mInfo?.name || mId}: ₹{Number(amt).toLocaleString("en-IN")}
                            </span>
                          );
                        })}
                      </div>
                    )}
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
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Rewards & Characteristics</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {formData.preferredRewardType} · {formData.preferredCardCharacteristics}
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      {formData.priorities.length > 0 ? formData.priorities.slice(0, 3).join(", ") : "Balanced categories"}
                    </p>
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
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Desired Setup</span>
                    <p className="font-semibold text-neutral-900 mt-0.5">
                      {formData.cardCount} {formData.cardCount === 1 ? "Credit Card (Simplicity)" : formData.cardCount === 2 ? "Credit Cards (Strategic Pairing)" : "Credit Cards (Optimized Portfolio)"}
                    </p>
                    <p className="text-neutral-500 text-[11px]">
                      The recommendation engine will identify the best combination of exactly {formData.cardCount} cards.
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
