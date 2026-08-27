"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import cards from "../data/cards.json";

/**
 * ComparisonTable (interactive)
 * ------------------------------------------------------------
 * Pick up to three cards and compare them across every field that
 * differs. Rendered as a real semantic <table> with a <caption>
 * and scoped header cells, exactly like the homepage preview.
 *
 * @param {string[]} initialSlugs pre-selected from ?cards= in the URL
 */

const MAX = 3;

const ROWS = [
  { label: "Bank", get: (c) => c.bank },
  { label: "Category", get: (c) => c.category.replace("-", " ") },
  {
    label: "Joining fee",
    get: (c) => (c.joiningFee === 0 ? "None" : `₹${c.joiningFee.toLocaleString("en-IN")}`),
  },
  {
    label: "Annual fee",
    get: (c) => (c.annualFee === 0 ? "Lifetime free" : `₹${c.annualFee.toLocaleString("en-IN")}`),
  },
  { label: "Cashback", get: (c) => (c.cashbackRate > 0 ? `${c.cashbackRate}%` : "—") },
  {
    label: "Reward rate",
    get: (c) => (c.rewardRate > 0 ? `${c.rewardRate} pts per ₹100` : "—"),
  },
  {
    label: "Lounge access",
    get: (c) => (c.loungeAccess > 0 ? `${c.loungeAccess} visits per year` : "None"),
  },
  { label: "Fuel", get: (c) => c.fuelBenefits },
  { label: "Dining", get: (c) => c.diningBenefits },
  { label: "Online shopping", get: (c) => c.onlineShoppingBenefits },
  { label: "Income required", get: (c) => c.incomeRequirement },
  { label: "Eligibility", get: (c) => c.eligibility },
];

export default function ComparisonTable({ initialSlugs = [] }) {
  const [selected, setSelected] = useState(() => {
    const valid = initialSlugs.filter((slug) => cards.some((c) => c.slug === slug));
    // Default to a useful trio so the page is never empty on first load.
    return valid.length > 0
      ? valid.slice(0, MAX)
      : ["hdfc-millennia-cashback", "axis-atlas"];
  });

  const chosen = selected
    .map((slug) => cards.find((c) => c.slug === slug))
    .filter(Boolean);

  function add(slug) {
    if (!slug || selected.includes(slug) || selected.length >= MAX) return;
    setSelected((prev) => [...prev, slug]);
  }

  function remove(slug) {
    setSelected((prev) => prev.filter((s) => s !== slug));
  }

  const available = cards.filter((c) => !selected.includes(c.slug));

  return (
    <div>
      {/* ---------- Selection controls ---------- */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {chosen.map((card) => (
          <span
            key={card.slug}
            className="inline-flex items-center gap-2 rounded-btn border border-border bg-surface py-1.5 pl-3.5 pr-2 text-[0.875rem]"
          >
            {card.name}
            <button
              type="button"
              onClick={() => remove(card.slug)}
              aria-label={`Remove ${card.name} from the comparison`}
              className="rounded p-0.5 text-muted transition-colors duration-200 hover:bg-subtle hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </span>
        ))}

        {selected.length < MAX && (
          <>
            <label htmlFor="add-card" className="sr-only">
              Add a card to the comparison
            </label>
            <select
              id="add-card"
              className="cw-input w-auto min-w-[240px] py-1.5 text-[0.875rem]"
              value=""
              onChange={(e) => add(e.target.value)}
            >
              <option value="">Add a card…</option>
              {available.map((card) => (
                <option key={card.slug} value={card.slug}>
                  {card.bank} — {card.name}
                </option>
              ))}
            </select>
          </>
        )}

        <span className="text-[0.8125rem] text-muted">
          {selected.length} of {MAX} selected
        </span>
      </div>

      {/* ---------- The table ---------- */}
      {chosen.length === 0 ? (
        <div className="cw-card px-6 py-14 text-center">
          <p className="cw-body">Add at least one card to start comparing.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">
              Feature-by-feature comparison of the selected CardWise credit cards.
            </caption>

            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="cw-eyebrow w-[180px] px-5 py-4 font-medium">
                  Feature
                </th>
                {chosen.map((card) => (
                  <th key={card.slug} scope="col" className="px-5 py-4 align-top">
                    <Link
                      href={`/cards/${card.slug}`}
                      className="block text-[0.9375rem] font-semibold transition-colors duration-200 hover:text-accent"
                    >
                      {card.name}
                    </Link>
                    <span className="block text-[0.8125rem] font-normal text-muted">
                      {card.bank}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <th
                    scope="row"
                    className="px-5 py-4 align-top text-[0.875rem] font-medium capitalize text-muted"
                  >
                    {row.label}
                  </th>
                  {chosen.map((card) => (
                    <td
                      key={card.slug}
                      className="px-5 py-4 align-top text-[0.9375rem] leading-relaxed"
                    >
                      {row.get(card)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
