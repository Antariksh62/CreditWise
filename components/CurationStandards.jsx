"use client";

import Reveal from "./Reveal";
import VisualCard from "./visual-system/VisualCard";
import VisualGrid from "./visual-system/VisualGrid";
import CurationFilterVisual from "./visual-system/CurationFilterVisual";
import PointsConverterVisual from "./visual-system/PointsConverterVisual";
import PerksMosaicVisual from "./visual-system/PerksMosaicVisual";

/**
 * CurationStandards
 * Near-full-width 3-column editorial section matching the Ramp reference:
 * - ~90px desktop page margin, 16-24px on mobile/tablet
 * - Generous responsive whitespace (py-20 sm:py-28 lg:py-36)
 * - 24-32px gap between cards
 * - Black / grey typography hierarchy
 * - Subtle viewport entrance reveal
 */
export default function CurationStandards() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-white border-b border-neutral-200/80 overflow-hidden">
      {/* NEAR FULL-WIDTH CONTAINER */}
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
        
        {/* EDITORIAL SECTION HEADER WITH SUBTLE REVEAL */}
        <Reveal>
          <div className="max-w-4xl mb-10 sm:mb-14 lg:mb-18">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium mb-3">
              OUR CURATION STANDARDS
            </p>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-normal tracking-tight leading-[1.15] sm:leading-[1.12]">
              <span className="text-neutral-950 font-normal sm:font-medium">
                We don&apos;t list every card.{" "}
              </span>
              <span className="text-neutral-400 font-normal">
                We list the cards worth considering.
              </span>
            </h2>
          </div>
        </Reveal>

        {/* 3-COLUMN RAMP-STYLE PRODUCT CANVASES */}
        <Reveal delay={140} variant="visual" className="w-full">
          <VisualGrid columns={3}>
            {/* PILLAR 1: STRICT STANDARDS */}
            <VisualCard
              titlePart1="Strict standards"
              titlePart2="for every card"
              href="/cards"
              ariaLabel="Browse curated cards"
            >
              <CurationFilterVisual />
            </VisualCard>

            {/* PILLAR 2: POINTS MADE SIMPLE */}
            <VisualCard
              titlePart1="Points made simple"
              titlePart2="in plain rupees"
              href="/blog/cashback-vs-rewards"
              ariaLabel="Read guide on rewards"
            >
              <PointsConverterVisual />
            </VisualCard>

            {/* PILLAR 3: BENEFITS THAT MATTER */}
            <VisualCard
              titlePart1="Benefits that matter"
              titlePart2="in everyday life"
              href="/compare"
              ariaLabel="Compare card benefits"
            >
              <PerksMosaicVisual />
            </VisualCard>
          </VisualGrid>
        </Reveal>

      </div>
    </section>
  );
}
