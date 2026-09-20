import { Suspense } from "react";
import cards from "../../data/cards.json";
import CardFilters from "../../components/CardFilters";
import { filterCards } from "../../lib/cardUtils";
import CardGrid from "../../components/CardGrid";

export const metadata = {
  title: "All credit cards — CreditWise",
  description:
    "Explore verified credit cards across cashback, travel, rewards, dining, fuel, and lifetime-free options.",
};

const LABELS = {
  cashback: "Cashback cards",
  travel: "Travel cards",
  rewards: "Rewards cards",
  dining: "Dining cards",
  fuel: "Fuel cards",
  "lifetime-free": "Lifetime free cards",
};

export default async function CardsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || "all";
  const filteredCards = filterCards(cards, category);
  const activeLabel = category === "all" ? null : LABELS[category] || category;

  return (
    <div className="cw-rail min-h-screen bg-[#FBFBFB]">
      <div className="cw-container py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Card Database
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2">
            {activeLabel || "Verified Credit Cards"}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-600">
            {category === "all"
              ? "Compare all verified credit cards across top Indian issuers with officially verified fees, reward structures, lounge access, and direct bank links."
              : `Showing ${filteredCards.length} verified ${activeLabel?.toLowerCase() || "cards"} based on issuer documentation.`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <Suspense
            fallback={
              <div className="h-9 w-64 animate-pulse rounded-full bg-neutral-200" />
            }
          >
            <CardFilters />
          </Suspense>
        </div>

        {/* Grid */}
        <CardGrid
          cards={filteredCards}
          emptyMessage={
            category === "all"
              ? "No credit cards found."
              : `No cards match the \"${activeLabel || category}\" filter right now.`
          }
        />
      </div>
    </div>
  );
}
