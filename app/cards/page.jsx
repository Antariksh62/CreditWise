import { Suspense } from "react";
import cards from "../../data/cards.json";
import CardFilters from "../../components/CardFilters";
import { filterCards } from "../../lib/cardUtils";
import CardGrid from "../../components/CardGrid";

/**
 * /cards — the full catalogue
 * ------------------------------------------------------------
 * Reads ?category= from the URL (searchParams) so the homepage
 * category tiles and the navbar mega-menu links land on a filtered
 * view that is shareable and bookmarkable.
 *
 * CardFilters uses useSearchParams, which Next.js requires to sit
 * inside a Suspense boundary on a server-rendered page.
 */

export const metadata = {
  title: "All credit cards",
  description:
    "Browse all ten CardWise credit cards, filtered by cashback, travel, rewards, fuel or lifetime-free.",
};

const LABELS = {
  cashback: "Cashback cards",
  travel: "Travel cards",
  rewards: "Rewards cards",
  fuel: "Fuel cards",
  "lifetime-free": "Lifetime-free cards",
};

export default async function CardsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category || "all";
  const visible = filterCards(cards, category);

  return (
    <div className="cw-rail">
      <div className="cw-container py-14 md:py-20">
        <header className="mb-10 max-w-[52ch]">
          <p className="cw-eyebrow mb-3">Catalogue</p>
          <h1 className="cw-h2">{LABELS[category] || "All credit cards"}</h1>
          <p className="cw-body mt-3 text-lead">
            {visible.length} {visible.length === 1 ? "card" : "cards"} in the CardWise
            sample data set. Fees and benefits are realistic demo values, not live offers.
          </p>
        </header>

        <Suspense fallback={<div className="mb-10 h-10" />}>
          <CardFilters />
        </Suspense>

        <CardGrid
          cards={visible}
          emptyMessage="No cards in this category yet. Try another filter."
        />
      </div>
    </div>
  );
}
