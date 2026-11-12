"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import CardGrid from "./CardGrid";
import { searchCards } from "../lib/cardUtils";

const LABELS = {
  cashback: "Cashback cards",
  travel: "Travel cards",
  rewards: "Rewards cards",
  dining: "Dining cards",
  fuel: "Fuel cards",
  "lifetime-free": "Lifetime free cards",
};

const FILTERS = [
  { key: "all", label: "All cards" },
  { key: "cashback", label: "Cashback" },
  { key: "travel", label: "Travel" },
  { key: "rewards", label: "Rewards" },
  { key: "dining", label: "Dining" },
  { key: "fuel", label: "Fuel" },
  { key: "lifetime-free", label: "Lifetime free" },
];

export default function CardCatalog({ initialCards = [], initialCategory = "all" }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync if URL searchParams change via browser navigation (back/forward) or mega menu
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    const urlQuery = searchParams.get("q") || "";
    setActiveCategory(urlCategory);
    setSearchQuery(urlQuery);
  }, [searchParams]);

  const updateUrl = (categoryKey, query) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      if (categoryKey && categoryKey !== "all") {
        params.set("category", categoryKey);
      }
      if (query && query.trim()) {
        params.set("q", query.trim());
      }
      const qs = params.toString();
      const newUrl = qs ? `/cards?${qs}` : "/cards";
      window.history.replaceState(null, "", newUrl);
    }
  };

  const handleSelectCategory = (categoryKey) => {
    setActiveCategory(categoryKey);
    updateUrl(categoryKey, searchQuery);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    updateUrl(activeCategory, val);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateUrl(activeCategory, "");
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setActiveCategory("all");
    updateUrl("all", "");
  };

  const filteredCards = useMemo(() => {
    return searchCards(initialCards, searchQuery, activeCategory);
  }, [initialCards, searchQuery, activeCategory]);

  const allCategoryMatchCount = useMemo(() => {
    if (!searchQuery.trim() || activeCategory === "all") return filteredCards.length;
    return searchCards(initialCards, searchQuery, "all").length;
  }, [initialCards, searchQuery, activeCategory, filteredCards.length]);

  const activeLabel = activeCategory === "all" ? null : LABELS[activeCategory] || activeCategory;

  return (
    <>
      {/* Page header with dynamic count */}
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Card Database
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2">
          {activeLabel || "Verified Credit Cards"}
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-600">
          {activeCategory === "all" && !searchQuery.trim()
            ? `Compare all ${initialCards.length} verified credit cards across top Indian issuers with officially verified fees, reward structures, lounge access, and direct bank links.`
            : `Showing ${filteredCards.length} verified ${activeLabel?.toLowerCase() || "cards"}${searchQuery.trim() ? ` matching "${searchQuery.trim()}"` : ""} based on issuer documentation.`}
        </p>
      </div>

      {/* Helpful Discovery Prompt for Unsure Users */}
      <div className="mb-8 rounded-2xl border border-neutral-200/90 bg-gradient-to-r from-neutral-50 via-white to-neutral-50/80 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <Sparkles className="h-3 w-3 text-neutral-900" />
              Personalized Spending Match
            </span>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              Not sure which card is right for you?
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Tell us about your spending habits and discover which cards from our catalogue could reward you better.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-1.5">
            <Link
              href="/onboarding"
              prefetch={true}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-neutral-800 shadow-xs"
            >
              <span>Get personalized recommendations</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#DDF247]" />
            </Link>
            <span className="text-[11px] text-neutral-400 font-normal">
              Takes ~2 minutes • No account required
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Search Input */}
      <div className="mb-6 max-w-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by card name, bank (HDFC, SBI, Axis...), or perks (lounge, cashback)..."
            aria-label="Search credit cards by name, bank, or perks"
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 p-1 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {searchQuery.trim() && (
          <div className="mt-2.5 flex items-center justify-between text-xs text-neutral-500">
            <span>
              Found <strong>{filteredCards.length}</strong> {filteredCards.length === 1 ? "card" : "cards"}
              {activeCategory !== "all" && ` in ${activeLabel}`}
            </span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-neutral-600 hover:text-black font-semibold underline underline-offset-2"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Category Filter Pills (Instant 0ms client-side switching) */}
      <div className="mb-8">
        <nav aria-label="Filter cards by category" className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeCategory === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => handleSelectCategory(filter.key)}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search Results or Curation-Informed No-Results Experience */}
      {filteredCards.length > 0 ? (
        <CardGrid cards={filteredCards} />
      ) : (
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 mb-4 text-neutral-500">
            <Search className="h-5 w-5" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Catalogue Search
          </span>

          <h2 data-testid="no-results-title" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
            We couldn&apos;t find this card in our catalogue.
          </h2>

          <p data-testid="no-results-body" className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
            CreditWise currently features a curated selection of credit cards that meet our listing and information standards. This card may not be part of our current catalogue.
          </p>

          {/* Helpful context if found in other categories */}
          {activeCategory !== "all" && allCategoryMatchCount > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700">
              <span>
                We found <strong>{allCategoryMatchCount}</strong> {allCategoryMatchCount === 1 ? "card" : "cards"} matching &ldquo;{searchQuery.trim()}&rdquo; in other categories.
              </span>
              <button
                type="button"
                onClick={() => handleSelectCategory("all")}
                className="ml-2 font-bold text-black hover:underline"
              >
                Show all categories →
              </button>
            </div>
          )}

          {/* Curation transparency note distinguishing unlisted vs excluded */}
          <div className="mt-6 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-4 text-[11px] sm:text-xs text-neutral-500 text-left leading-relaxed">
            <span className="font-semibold text-neutral-800 block mb-1">
              About our listing criteria:
            </span>
            CreditWise lists cards that provide verified fee schedules, transparent reward terms, and genuine value for regular spending. Unlisted cards may be pending editorial auditing or are yet to be scheduled for inclusion.
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear search query
              </button>
            )}
            <button
              type="button"
              onClick={handleResetAll}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-5 py-2 text-xs font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Explore all {initialCards.length} verified cards
            </button>
            <Link
              href="/onboarding"
              prefetch={true}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-black px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>Get personalized recommendations</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#DDF247]" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

