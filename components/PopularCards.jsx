import cards from "../data/cards.json";
import SectionHeading from "./SectionHeading";
import CardGrid from "./CardGrid";

/**
 * PopularCards
 * ------------------------------------------------------------
 * Three hand-picked cards, one per major category, so the section
 * shows range rather than three near-identical cashback products.
 * Server component: the data import is resolved at build time.
 */

const FEATURED_SLUGS = ["hdfc-millennia-cashback", "axis-atlas", "amex-membership-rewards"];

export default function PopularCards() {
  const featured = FEATURED_SLUGS.map((slug) =>
    cards.find((card) => card.slug === slug),
  ).filter(Boolean);

  return (
    <section className="cw-rail cw-section border-b border-border">
      <div className="cw-container">
        <SectionHeading
          eyebrow="Popular right now"
          title="Cards people look at most"
          description="A cashback workhorse, a travel card and a points card — three different answers to three different spending habits."
          actionHref="/cards"
          actionLabel="View all 10 cards"
        />
        <CardGrid cards={featured} />
      </div>
    </section>
  );
}
