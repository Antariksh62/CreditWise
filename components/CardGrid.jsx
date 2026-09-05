import CreditCard from "./CreditCard";
import Reveal from "./Reveal";

/**
 * CardGrid
 * ------------------------------------------------------------
 * Three-up on desktop, two-up on tablet, one-up on mobile.
 * Each tile reveals on scroll with a 60ms stagger so the row
 * arrives as a sequence rather than a flash.
 *
 * @param {Array}  cards    card records
 * @param {object} scores   optional { [slug]: matchScore }
 * @param {string} emptyMessage shown when the list is empty
 */
export default function CardGrid({ cards, scores = {}, emptyMessage = "No cards match these filters." }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="cw-card px-6 py-14 text-center">
        <p className="cw-body">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Reveal key={card.slug} delay={index * 60}>
          <CreditCard
            card={card}
            matchScore={scores[card.slug] ?? null}
          />
        </Reveal>
      ))}
    </div>
  );
}
