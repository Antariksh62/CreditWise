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
          <div className="cw-enter cw-enter-1 mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft/70 px-3.5 py-1 text-[0.8125rem] font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            10 Indian Credit Cards Ranked · Rule-Based Scoring
          </div>

          <h1 className="cw-display cw-enter cw-enter-2 max-w-[16ch] text-balance">
            Find the credit card that fits{" "}
            <span className="bg-gradient-to-r from-accent via-emerald-700 to-accent bg-clip-text text-transparent">
              how you actually spend
            </span>
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

          {/* Partner bank strip — Stripe customer logo cue */}
          <div className="cw-enter cw-enter-4 mt-10 border-t border-border/80 pt-6">
            <p className="text-[0.75rem] font-semibold uppercase tracking-widest text-muted/70 mb-3">
              Cards ranked across major Indian issuers
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] font-semibold tracking-tight text-muted/60">
              <span>HDFC BANK</span>
              <span className="text-border">•</span>
              <span>SBI CARD</span>
              <span className="text-border">•</span>
              <span>AXIS BANK</span>
              <span className="text-border">•</span>
              <span>ICICI BANK</span>
              <span className="text-border">•</span>
              <span>AMEX</span>
            </div>
          </div>
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
