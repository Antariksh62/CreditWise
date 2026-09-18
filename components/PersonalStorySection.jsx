"use client";

import Link from "next/link";
import { ArrowRight, UserCheck, Sparkles, SlidersHorizontal, CreditCard } from "lucide-react";

export default function PersonalStorySection() {
  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ASYMMETRIC 2-COLUMN LAYOUT (RAMP SCREENSHOT 4 STYLE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: EDITORIAL STATEMENT (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              PERSONALIZATION
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.08]">
              Your spending is personal.{" "}
              <span className="text-neutral-400 font-normal block sm:inline">
                Your card should be too.
              </span>
            </h2>

            <p className="text-base text-neutral-600 font-normal leading-relaxed">
              Everyone spends differently. You tell CardWise how you live, we compare the cards, and you see which one fits.
            </p>

            {/* 3-STEP TRANSPARENT FLOW */}
            <div className="space-y-3 pt-2 border-t border-neutral-100 text-xs">
              <div className="flex items-center gap-3 text-neutral-700">
                <span className="w-5 h-5 rounded-full bg-neutral-100 font-mono font-bold text-neutral-900 flex items-center justify-center shrink-0">1</span>
                <span>You tell CardWise how you spend</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <span className="w-5 h-5 rounded-full bg-neutral-100 font-mono font-bold text-neutral-900 flex items-center justify-center shrink-0">2</span>
                <span>CardWise compares the cards</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-900 font-semibold">
                <span className="w-5 h-5 rounded-full bg-[#e4f222] font-mono font-bold text-black flex items-center justify-center shrink-0">3</span>
                <span>You see which cards fit</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/recommend"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 hover:text-neutral-700 transition-colors border-b-2 border-neutral-950 pb-1"
              >
                <span>Find the card that fits your spending</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: LARGE VISUAL PLACEHOLDER (7 COLS) */}
          <div className="lg:col-span-7">
            <div className="relative w-full min-h-[380px] sm:min-h-[440px] rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-8 sm:p-12 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm">
              
              {/* SUBTLE BACKGROUND GRID */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.25]"
                style={{
                  backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              />

              {/* VISUAL STORYTELLING: PERSONAL FIT DEMO */}
              <div className="relative z-10 w-full max-w-sm space-y-6">
                
                {/* FLOATING PERSONA CARD */}
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Your Spending Pattern
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#e4f222]" />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-neutral-700">
                      Groceries: Primary
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-neutral-700">
                      Dining: Regular
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-neutral-700">
                      Commute: Everyday
                    </span>
                  </div>
                </div>

                {/* MATCH CONNECTION */}
                <div className="flex justify-center">
                  <div className="px-3 py-1 rounded-full bg-neutral-100 text-[11px] font-mono text-neutral-600 border border-neutral-200 flex items-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-neutral-800" />
                    <span>Matched directly to your life</span>
                  </div>
                </div>

                {/* RESULT CARD MOCKUP */}
                <div className="bg-white rounded-2xl border-2 border-neutral-950 p-5 shadow-md text-left flex items-center gap-4">
                  <div className="w-12 h-8 rounded-md bg-neutral-950 flex items-center justify-center text-white shrink-0">
                    <CreditCard className="w-4 h-4 text-[#e4f222]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-950">The card that fits you</div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Rewards on what you already buy, without changing how you live.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
