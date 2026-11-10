/**
 * Shared card utilities: filtering and transparent fee + 18% GST calculations.
 */

export const GST_RATE = 0.18;

/**
 * Calculates complete fee breakdown including statutory 18% GST.
 * In India, banking services and credit card fees incur 18% GST.
 */
export function calculateFeeWithGST(baseFee) {
  const base = Math.max(0, Number(baseFee) || 0);
  if (base === 0) {
    return {
      base: 0,
      gst: 0,
      total: 0,
      isFree: true,
      formattedBase: "₹0",
      formattedGST: "₹0",
      formattedTotal: "Lifetime Free",
      displayTotal: "Lifetime Free",
      displayBreakdown: "Lifetime Free (₹0)",
    };
  }
  const gst = Math.round(base * GST_RATE);
  const total = base + gst;
  return {
    base,
    gst,
    total,
    isFree: false,
    formattedBase: `₹${base.toLocaleString("en-IN")}`,
    formattedGST: `₹${gst.toLocaleString("en-IN")}`,
    formattedTotal: `₹${total.toLocaleString("en-IN")}`,
    displayTotal: `₹${total.toLocaleString("en-IN")}`,
    displayBreakdown: `₹${total.toLocaleString("en-IN")} (₹${base.toLocaleString("en-IN")} + 18% GST)`,
  };
}

/**
 * Formats a credit card fee with clear 18% GST transparency.
 *
 * @param {number} fee - The base fee in INR
 * @param {"full" | "short" | "total-only" | "breakdown"} style
 * @returns {string}
 */
export function formatFee(fee, style = "full") {
  if (!fee || fee === 0) return "Lifetime Free";
  const { formattedBase, formattedGST, formattedTotal } = calculateFeeWithGST(fee);

  switch (style) {
    case "total-only":
      return formattedTotal;
    case "short":
      return `${formattedTotal}/yr (incl. GST)`;
    case "breakdown":
      return `${formattedBase} + ${formattedGST} (18% GST) = ${formattedTotal}`;
    case "full":
    default:
      return `${formattedTotal} (${formattedBase} + 18% GST)`;
  }
}

/**
 * Shared card filtering utility function.
 */
export function filterCards(cards, category) {
  if (!category || category === "all") return cards;
  return cards.filter(
    (card) => card.category === category || (card.tags || []).includes(category),
  );
}

/**
 * Normalizes text for case-insensitive, accent-insensitive search.
 */
export function normalizeSearchText(str) {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks whether an individual card matches a given search query.
 */
export function isCardMatchingQuery(card, query = "") {
  const cleanQuery = normalizeSearchText(query);
  if (!cleanQuery) return true;
  if (!card) return false;

  const tokens = cleanQuery.split(" ").filter(Boolean);
  if (tokens.length === 0) return true;

  const searchableParts = [
    card.name,
    card.issuer,
    card.bank,
    card.network,
    card.category,
    card.goodFor,
    card.shortDescription,
    card.rewardSummary,
    ...(card.tags || []),
    ...(card.benefits || []),
    // Alias enhancements for real-world user search terms
    (card.issuer === "American Express" || card.bank === "American Express") ? "amex amex-mrcc mrcc" : "",
    (card.issuer === "BOBCARD" || card.bank === "BOBCARD") ? "bob bank of baroda baroda" : "",
    (card.annualFee === 0) ? "lifetime free ltf zero fee no annual fee lifetime-free free" : "",
    (card.loungeAccess > 0 || (card.loungeBenefits && !card.loungeBenefits.toLowerCase().includes("none"))) ? "lounge airport lounge domestic international priority pass dreamfolks" : "",
    (card.forexBenefits && card.forexBenefits.includes("0%")) ? "zero forex 0 forex no markup zero-forex" : "",
    (card.network && card.network.toLowerCase().includes("rupay")) ? "rupay upi scan pay" : "",
  ];

  const searchableText = normalizeSearchText(searchableParts.filter(Boolean).join(" "));
  return tokens.every((token) => searchableText.includes(token));
}

/**
 * Unified search & category filter for credit cards.
 *
 * @param {Array} cards - All cards
 * @param {string} query - Freeform search string
 * @param {string} category - Category filter key (default: "all")
 * @returns {Array} Filtered and matched cards
 */
export function searchCards(cards, query = "", category = "all") {
  if (!cards || !Array.isArray(cards)) return [];

  // Filter by category if requested
  const categoryPool = filterCards(cards, category);

  // If no query, return the category pool
  const cleanQuery = normalizeSearchText(query);
  if (!cleanQuery) return categoryPool;

  const matched = categoryPool.filter((card) => isCardMatchingQuery(card, cleanQuery));

  // Relevance ranking:
  // 1. Direct card name contains query string
  // 2. Issuer/bank contains query string
  // 3. Perk / benefit / tag matches
  return matched.sort((a, b) => {
    const aName = normalizeSearchText(a.name);
    const bName = normalizeSearchText(b.name);
    const aNameMatch = aName.includes(cleanQuery);
    const bNameMatch = bName.includes(cleanQuery);
    if (aNameMatch && !bNameMatch) return -1;
    if (!aNameMatch && bNameMatch) return 1;

    const aIssuer = normalizeSearchText(a.issuer || a.bank);
    const bIssuer = normalizeSearchText(b.issuer || b.bank);
    const aIssuerMatch = aIssuer.includes(cleanQuery);
    const bIssuerMatch = bIssuer.includes(cleanQuery);
    if (aIssuerMatch && !bIssuerMatch) return -1;
    if (!aIssuerMatch && bIssuerMatch) return 1;

    return 0;
  });
}
