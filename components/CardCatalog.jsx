"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CardGrid from "./CardGrid";
import { filterCards } from "../lib/cardUtils";

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

  // Sync if URL searchParams change via browser navigation (back/forward) or mega menu
  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    setActiveCategory(urlCategory);
  }, [searchParams]);

  const handleSelectCategory = (categoryKey) => {
    setActiveCategory(categoryKey);
    const newUrl = categoryKey === "all" ? "/cards" : `/cards?category=${categoryKey}`;
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", newUrl);
    }
  };

  const filteredCards = useMemo(() => {
    return filterCards(initialCards, activeCategory);
  }, [initialCards, activeCategory]);

  const activeLabel = activeCategory === "all" ? null : LABELS[activeCategory] || activeCategory;

  return (
    <>
      {/* Page header with dynamic count */}
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Card Database
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2">
          {activeLabel || "Verified Credit Cards"}
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-600">
          {activeCategory === "all"
            ? `Compare all ${initialCards.length} verified credit cards across top Indian issuers with officially verified fees, reward structures, lounge access, and direct bank links.`
            : `Showing ${filteredCards.length} verified ${activeLabel?.toLowerCase() || "cards"} based on issuer documentation.`}
        </p>
      </div>

      {/* Filters (Instant 0ms client-side switching) */}
      <div className="mb-10">
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

      {/* Grid */}
      <CardGrid
        cards={filteredCards}
        emptyMessage={
          activeCategory === "all"
            ? "No credit cards found."
            : `No cards match the "${activeLabel || activeCategory}" filter right now.`
        }
      />
    </>
  );
}

