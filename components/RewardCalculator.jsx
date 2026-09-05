"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import cards from "../data/cards.json";
import {
  SPEND_CATEGORIES,
  calculateRewards,
  formatRupees,
  rankCardsByRewards,
} from "../lib/rewardCalculator";

/**
 * RewardCalculator (interactive)
 * ------------------------------------------------------------
 * The working version of the homepage preview. The user types a
 * monthly amount per category and picks a card; the estimate
 * recalculates on every keystroke via useMemo.
 *
 * It also ranks the whole catalogue against the same profile, so
 * the user can see whether a better-value card exists.
 */

const DEFAULT_SPEND = {
  online: 12000,
  dining: 6000,
  travel: 8000,
  fuel: 4000,
  other: 10000,
};

export default function RewardCalculator() {
  const [spend, setSpend] = useState(DEFAULT_SPEND);
  const [slug, setSlug] = useState(cards[0].slug);

  const card = cards.find((c) => c.slug === slug) || cards[0];

  const result = useMemo(() => calculateRewards(card, spend), [card, spend]);
  const ranked = useMemo(() => rankCardsByRewards(cards, spend, 5), [spend]);

  function update(key, value) {
    // Strip anything that is not a digit so the state stays numeric.
    const clean = String(value).replace(/[^0-9]/g, "");
    setSpend((prev) => ({ ...prev, [key]: clean === "" ? 0 : Number(clean) }));
  }

  const maxCategory = Math.max(...result.perCategory.map((c) => c.rewards), 1);

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr]">
      {/* ---------------- Inputs ---------------- */}
      <form className="cw-card h-fit p-6" onSubmit={(e) => e.preventDefault()}>
        <h2 className="cw-h3 mb-1">Your monthly spending</h2>
        <p className="mb-6 text-[0.875rem] text-muted">
          Approximate rupees per month in each category.
        </p>

        <div className="space-y-4">
          {SPEND_CATEGORIES.map((category) => (
            <div key={category.key}>
              <label
                htmlFor={`spend-${category.key}`}
                className="mb-1.5 block text-[0.875rem] font-medium"
              >
                {category.label}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.9375rem] text-muted">
                  ₹
                </span>
                <input
                  id={`spend-${category.key}`}
                  name={category.key}
                  type="text"
                  inputMode="numeric"
                  className="cw-input cw-numeric pl-7"
                  value={spend[category.key] || ""}
                  placeholder={String(category.placeholder)}
                  onChange={(e) => update(category.key, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <label htmlFor="card-select" className="mb-1.5 block text-[0.875rem] font-medium">
            Card to estimate
          </label>
          <select
            id="card-select"
            className="cw-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            {cards.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.bank} — {c.name}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* ---------------- Results ---------------- */}
      <div className="space-y-6">
        <div className="cw-card p-7">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="cw-eyebrow mb-2">{card.name}</p>
              <p className="cw-numeric text-[2.25rem] font-semibold leading-none tracking-[-0.02em]">
                {formatRupees(result.annualRewards)}
              </p>
              <p className="mt-1.5 text-[0.875rem] text-muted">
                estimated rewards per year on {formatRupees(result.annualSpend)} of spending
              </p>
            </div>
            <div className="text-right">
              <span className="cw-badge-accent">{result.effectiveRate}% effective</span>
              <p className="cw-numeric mt-2 text-[0.875rem] text-muted">
                {formatRupees(result.netAnnualRewards)} after the{" "}
                {card.annualFee === 0 ? "₹0" : formatRupees(card.annualFee)} fee
              </p>
            </div>
          </div>

          <ul className="space-y-3.5">
            {result.perCategory.map((row) => (
              <li key={row.key}>
                <div className="mb-1.5 flex items-baseline justify-between gap-4">
                  <span className="text-[0.875rem]">
                    {row.label}{" "}
                    <span className="cw-numeric text-muted">at {row.rate}%</span>
                  </span>
                  <span className="cw-numeric text-[0.875rem] font-medium">
                    {formatRupees(row.rewards)}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                  {/* INLINE CSS: computed bar width. */}
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300 ease-cardwise"
                    style={{ width: `${(row.rewards / maxCategory) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-border pt-4 text-[0.8125rem] text-muted">
            Estimates only. Real cards apply monthly caps, excluded categories and
            variable point valuations. Reward points are valued at ₹0.25 each.
          </p>
        </div>

        {/* Best-value ranking for the same profile */}
        <div className="cw-card p-7">
          <h2 className="cw-h3 mb-4">Best value for this spending profile</h2>
          <ol className="divide-y divide-border">
            {ranked.map((row, index) => (
              <li
                key={row.card.slug}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <span className="cw-numeric text-[0.8125rem] text-muted">
                    {index + 1}
                  </span>
                  <Link
                    href={`/cards/${row.card.slug}`}
                    className="text-[0.9375rem] font-medium transition-colors duration-200 hover:text-accent"
                  >
                    {row.card.name}
                  </Link>
                </div>
                <span className="cw-numeric text-[0.9375rem]">
                  {formatRupees(row.netAnnualRewards)}{" "}
                  <span className="text-[0.8125rem] text-muted">net / yr</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
