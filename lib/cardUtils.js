/**
 * Shared card filtering utility function.
 */
export function filterCards(cards, category) {
  if (!category || category === "all") return cards;
  return cards.filter(
    (card) => card.category === category || (card.tags || []).includes(category),
  );
}
