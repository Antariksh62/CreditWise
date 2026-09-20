"use client";

import Reveal from "./Reveal";
import VisualCard from "./visual-system/VisualCard";
import VisualGrid from "./visual-system/VisualGrid";
import ExpenseStreamVisual from "./visual-system/ExpenseStreamVisual";
import FeeBreakEvenVisual from "./visual-system/FeeBreakEvenVisual";

/**
 * DualStorySection
 * Near-full-width 2-column editorial card section matching the Ramp reference:
 * - 80-90px desktop page margin, 16-24px on mobile/tablet
 * - Generous responsive whitespace (py-20 sm:py-28 lg:py-36)
 * - Black / grey typography hierarchy
 * - Subtle viewport entrance reveal
 */
export default function DualStorySection() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white border-b border-neutral-200/80 overflow-hidden">
      {/* NEAR FULL-WIDTH CONTAINER */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
        
        {/* EDITORIAL SECTION HEADER WITH SUBTLE REVEAL */}
        <Reveal>
          <div className="max-w-4xl mb-10 sm:mb-14 lg:mb-18">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium mb-3">
              THE CREDITWISE PHILOSOPHY
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-normal tracking-tight leading-[1.15] sm:leading-[1.12]">
              <span className="text-neutral-950 font-normal sm:font-medium">
                Don&apos;t change how you spend.{" "}
              </span>
              <span className="text-neutral-400 font-normal">
                Change how you&apos;re rewarded.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* 2-COLUMN RAMP-STYLE PRODUCT CANVASES */}
        <Reveal delay={140} variant="visual" className="w-full">
          <VisualGrid columns={2}>
            {/* CARD A: WHAT IF YOUR EXPENSES COULD EARN TOO? */}
            <VisualCard
              titlePart1="What if your expenses"
              titlePart2="could earn too?"
              href="/recommend"
              ariaLabel="Explore expense matching"
            >
              <ExpenseStreamVisual />
            </VisualCard>

            {/* CARD B: WHEN DOES THE CARD PAY FOR ITSELF? */}
            <VisualCard
              titlePart1="When does the card"
              titlePart2="pay for itself?"
              href="/compare"
              ariaLabel="Compare fee recovery"
            >
              <FeeBreakEvenVisual />
            </VisualCard>
          </VisualGrid>
        </Reveal>

      </div>
    </section>
  );
}
