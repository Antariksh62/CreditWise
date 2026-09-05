import Link from "next/link";
import cards from "../data/cards.json";
import CardGrid from "./CardGrid";

const FEATURED_SLUGS = ["sbi-cashback", "axis-atlas", "hdfc-millennia-cashback"];

export default function PopularCards() {
  const featured = FEATURED_SLUGS.map((slug) =>
    cards.find((card) => card.slug === slug),
  ).filter(Boolean);

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-neutral-200">
      <div className="cw-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              CURATED CATALOGUE
            </div>
            <h2 className="cw-h2">
              Popular cards <span className="text-neutral-400">in India.</span>
            </h2>
          </div>
          <Link
            href="/cards"
            className="inline-flex items-center gap-1.5 font-bold text-sm text-black hover:underline"
          >
            Browse all 10 cards →
          </Link>
        </div>
        <CardGrid cards={featured} />
      </div>
    </section>
  );
}


