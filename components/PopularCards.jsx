import Link from "next/link";
import cards from "../data/cards.json";
import CardGrid from "./CardGrid";

// Select 3 top curated cards from actual dataset
const FEATURED_SLUGS = ["sbi-cashback", "axis-atlas", "hdfc-millennia-cashback"];

export default function PopularCards() {
  const featured = FEATURED_SLUGS.map((slug) =>
    cards.find((card) => card.slug === slug),
  ).filter(Boolean);

  return (
    <section className="py-24 lg:py-32 bg-white border-t border-neutral-200">
      <div className="cw-container space-y-12">
        {/* EDITORIAL SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-black" />
              2. CURATED CARDS &amp; GUIDES
            </div>
            <h2 className="cw-h2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black leading-[1.08]">
              Curated cards <span className="text-neutral-400">worth considering.</span>
            </h2>
            <p className="text-sm text-neutral-600 font-normal">
              Featured selections from the 30+ credit cards evaluated in the CardWise dataset.
            </p>
          </div>

          <Link
            href="/cards"
            className="inline-flex items-center gap-2 rounded-[6px] bg-black text-[#DDF247] px-6 py-3 text-xs font-mono font-bold hover:bg-neutral-800 transition-all shrink-0"
          >
            Browse all 10 cards →
          </Link>
        </div>

        {/* CURATED CARDS GRID */}
        <CardGrid cards={featured} />
      </div>
    </section>
  );
}



