import Link from "next/link";
import { ArrowRight } from "lucide-react";
import cards from "../data/cards.json";
import { calculateRewards, formatRupees } from "../lib/rewardCalculator";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/**
 * RewardCalculatorPreview
 * ------------------------------------------------------------
 * A display-only calculation using a fixed example spending
 * profile. It runs the real calculateRewards() function at render
 * time, so the numbers shown here are the same numbers the full
 * calculator would produce.
 *
 * Lightweight by design: no inputs, no state, no client JS. The
 * CTA sends the user to the working calculator.
 *
 * The per-category bars use INLINE CSS for their widths, because
 * the width is a genuinely computed value (Assignment 1: inline
 * CSS used where the value cannot be known ahead of time).
 */

const EXAMPLE_SPEND = {
  online: 12000,
  dining: 6000,
  travel: 8000,
  fuel: 4000,
  other: 10000,
};

export default function RewardCalculatorPreview() {
  const card = cards.find((c) => c.slug === "hdfc-millennia-cashback");
  const result = calculateRewards(card, EXAMPLE_SPEND);
  const maxCategory = Math.max(...result.perCategory.map((c) => c.rewards), 1);

  return (
    <section className="cw-rail cw-section border-b border-border">
      <div className="cw-container grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Reward calculator"
            title="See what a card is actually worth to you"
            description="Enter your monthly spending by category and CardWise estimates the annual return, net of the annual fee."
          />
          <Link href="/compare" className="cw-btn-primary">
            Calculate your rewards
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>

        <Reveal>
          <div className="cw-card p-7">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="cw-eyebrow mb-2">Example: {card.name}</p>
                <p className="cw-numeric text-[2rem] font-semibold leading-none tracking-[-0.02em]">
                  {formatRupees(result.annualRewards)}
                </p>
                <p className="mt-1.5 text-[0.875rem] text-muted">
                  estimated rewards per year on{" "}
                  {formatRupees(result.annualSpend)} of spending
                </p>
              </div>
              <span className="cw-badge-accent shrink-0">
                {result.effectiveRate}% effective
              </span>
            </div>

            <ul className="space-y-3.5">
              {result.perCategory.map((row) => (
                <li key={row.key}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-4">
                    <span className="text-[0.875rem]">{row.label}</span>
                    <span className="cw-numeric text-[0.875rem] font-medium">
                      {formatRupees(row.rewards)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                    {/* INLINE CSS: width is computed from the data. */}
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(row.rewards / maxCategory) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-border pt-4 text-[0.8125rem] text-muted">
              Estimates only. Real cards apply monthly caps and category exclusions.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
