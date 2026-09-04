/**
 * filterCards
 * ------------------------------------------------------------
 * Shared filtering rule used by the /cards server page and by the
 * client-side CardFilters rail.
 *
 * It lives in lib/ rather than inside CardFilters.jsx because a
 * server component cannot import a plain function out of a
 * "use client" module — Next.js turns every export of a client
 * module into a client reference, which is not callable on the
 * server.
 */
export function filterCards(cards, category) {
  if (!category || category === "all") return cards;
  return cards.filter(
    (card) => card.category === category || (card.tags || []).includes(category),
  );
}
