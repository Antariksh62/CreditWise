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
