import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CreditCardVisual from "./CreditCardVisual";
import SpendLimitWidget from "./SpendLimitWidget";

/**
 * Hero
 * ------------------------------------------------------------
 * The Stripe move: a 7/5 asymmetric split, oversized tight-tracked
 * display type on the left, one primary and one secondary action,
 * and a concrete product artifact on the right.
 *
 * The Ramp move: that artifact is a real credit card with a data
 * widget attached, not an abstract illustration or gradient mesh.
 *
 * Entrance animation is a single staggered rise, runs once, and is
 * switched off entirely under prefers-reduced-motion.
 */
export default function Hero() {
  return (
    <section className="cw-rail border-b border-border bg-background">
      <div className="cw-container grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[7fr_5fr] lg:gap-16">
        {/* ---------------- Left: copy ---------------- */}
        <div>
          <p className="cw-eyebrow cw-enter cw-enter-1 mb-5">
            Credit cards, explained clearly
          </p>

          <h1 className="cw-display cw-enter cw-enter-2 max-w-[16ch] text-balance">
            Find the credit card that fits how you actually spend
          </h1>

          <p className="cw-enter cw-enter-3 mt-6 max-w-[52ch] text-lead text-muted">
            Answer five questions and CardWise ranks ten real Indian credit cards
            against your spending. Every score is a transparent rule you can read —
            no black box, no affiliate ranking.
          </p>

          <div className="cw-enter cw-enter-4 mt-8 flex flex-wrap items-center gap-3">
            <Link href="/recommend" className="cw-btn-primary">
              Find your card
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
            <Link href="/cards" className="cw-btn-secondary">
              Browse all cards
            </Link>
          </div>

          {/* Quiet supporting stats — hairline separated, no boxes. */}
          <dl className="cw-enter cw-enter-4 mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-6">
            {[
              { value: "10", label: "Cards compared" },
              { value: "5", label: "Questions asked" },
              { value: "0", label: "Affiliate links" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="cw-numeric block text-[1.5rem] font-semibold tracking-[-0.02em]">
                    {stat.value}
                  </span>
                  <span className="text-[0.8125rem] text-muted">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------------- Right: product artifact ---------------- */}
        <div className="cw-enter cw-enter-3 relative flex justify-center lg:justify-end">
          <div className="relative">
            <CreditCardVisual
              tint="emerald"
              issuer="CardWise"
              name="Everyday Cashback"
              size="lg"
            />
            {/* Ramp-style data widget attached to the lower-left corner. */}
            <SpendLimitWidget
              className="absolute -bottom-10 -left-6 hidden sm:block"
              label="Estimated annual value"
              spent={24800}
              limit={32000}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
