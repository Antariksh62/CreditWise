"use client";

import Link from "next/link";
import { ArrowUpRight, ShoppingBag, UtensilsCrossed, Fuel, Zap, ArrowRight, Check } from "lucide-react";

export default function DualStorySection() {
  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* EDITORIAL SECTION HEADER (RAMP DUAL-TONE OVERSIZED HEADLINE) */}
        <div className="max-w-3xl mb-14 sm:mb-18 space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            THE CARDWISE PHILOSOPHY
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-neutral-950 leading-[1.08]">
            Don&apos;t change how you spend.{" "}
            <span className="text-neutral-400 font-normal block sm:inline">
              Change how you&apos;re rewarded.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-2xl pt-1 leading-relaxed">
            You already buy groceries, fuel, meals, and tickets every month. CardWise helps that existing spending work for you.
          </p>
        </div>

        {/* TWO LARGE CARDS SIDE-BY-SIDE (RAMP 2-COLUMN STORY STRUCTURE) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CARD 1: WHAT IF YOUR EXPENSES COULD EARN TOO? */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-7 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              {/* TOP HEADER */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                    What if your expenses{" "}
                    <span className="text-neutral-400 font-normal">could earn too?</span>
                  </h3>
                  <p className="text-sm text-neutral-600 font-normal max-w-md leading-relaxed">
                    Everyday purchases can give real value back—without spending an extra rupee.
                  </p>
                </div>

                <Link
                  href="/recommend"
                  className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-700 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                  aria-label="Find your card"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* LARGE VISUAL / ANIMATION PLACEHOLDER AREA */}
              <div className="relative mt-8 w-full min-h-[260px] sm:min-h-[300px] rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden shadow-xs">
                {/* SUBTLE INNER GRID */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.2]"
                  style={{
                    backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }}
                />

                {/* VISUAL STORYTELLING: SPENDING FLOWING INTO VALUE */}
                <div className="relative z-10 w-full max-w-sm space-y-4">
                  {/* EXPENSE CHIPS */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-neutral-500" />
                      Groceries
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-neutral-500" />
                      Dining & Orders
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
                      <Fuel className="w-3.5 h-3.5 text-neutral-500" />
                      Fuel & Travel
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
                      <Zap className="w-3.5 h-3.5 text-neutral-500" />
                      Bills & Recharges
                    </span>
                  </div>

                  {/* FLOW ARROW */}
                  <div className="flex justify-center">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                      <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                    </div>
                  </div>

                  {/* REWARD OUTCOME PILL */}
                  <div className="mx-auto text-center px-4 py-3 rounded-xl bg-neutral-950 text-white shadow-xs max-w-xs">
                    <span className="text-xs font-mono text-[#e4f222] font-semibold block mb-0.5">
                      Direct Statement Return
                    </span>
                    <p className="text-xs text-neutral-300 font-normal">
                      Money back in your pocket every month
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500 font-normal">
              <span>Your everyday spending</span>
              <span className="font-mono text-neutral-900 font-semibold">Works harder for you</span>
            </div>
          </div>

          {/* CARD 2: WHEN DOES THE CARD PAY FOR ITSELF? */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-7 sm:p-10 flex flex-col justify-between overflow-hidden shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              {/* TOP HEADER */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                    When does the card{" "}
                    <span className="text-neutral-400 font-normal">pay for itself?</span>
                  </h3>
                  <p className="text-sm text-neutral-600 font-normal max-w-md leading-relaxed">
                    If a card has an annual fee, the rewards should easily cover it. Otherwise, it isn&apos;t worth having.
                  </p>
                </div>

                <Link
                  href="/compare"
                  className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-700 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                  aria-label="Compare cards"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* LARGE VISUAL / ANIMATION PLACEHOLDER AREA */}
              <div className="relative mt-8 w-full min-h-[260px] sm:min-h-[300px] rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 flex flex-col items-center justify-center overflow-hidden shadow-xs">
                {/* SUBTLE INNER GRID */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.2]"
                  style={{
                    backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }}
                />

                {/* VISUAL STORYTELLING: FEE CLEARED INTO PURE VALUE */}
                <div className="relative z-10 w-full max-w-xs space-y-4">
                  {/* COMPARISON BAR MOCK */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-neutral-600">
                      <span>Annual fee</span>
                      <span className="font-mono text-neutral-900">Covered</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-neutral-300 w-1/4 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-neutral-900">
                      <span>Value after fee</span>
                      <span className="font-mono text-emerald-700 font-bold">In your pocket</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                    </div>
                  </div>

                  {/* SIMPLE STATUS PILL */}
                  <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clear positive return on spending you already do</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500 font-normal">
              <span>Annual fee recovery</span>
              <span className="font-mono text-emerald-700 font-semibold">Net positive value</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
