"use client";

import Link from "next/link";

export default function FeatureGrid() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="cw-container space-y-16">
        {/* EDITORIAL HEADER STATEMENT */}
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            INTELLIGENT CARD SELECTION
          </div>
          <h2 className="cw-h2">
            Cards &amp; rewards that{" "}
            <span className="text-neutral-400">handle themselves.</span>
          </h2>
          <p className="cw-body mt-4">
            CardWise automatically evaluates reward rates, annual fee waivers, lounge access rules, and forex charges across 100+ cards.
          </p>
        </div>

        {/* 2-COLUMN RAMP LARGE FEATURE BLOCK (Matching Screenshot 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FEATURE BLOCK 1 */}
          <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 flex flex-col justify-between overflow-hidden group hover:border-neutral-400 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Smart Matching Engine
                </h3>
                <p className="text-sm text-neutral-600 max-w-sm">
                  Personalized algorithms match your exact monthly spending against card reward tiers.
                </p>
              </div>
              <Link
                href="/recommend"
                className="h-10 w-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-black font-bold group-hover:bg-[#DDF247] group-hover:border-[#DDF247] transition-all"
                aria-label="Start quiz"
              >
                ↗
              </Link>
            </div>

            <div className="relative bg-white rounded-xl border border-neutral-200 p-6 shadow-sm bg-dotted">
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <span className="font-semibold text-black">💳 Online Shopping Spend</span>
                  <span className="font-bold text-emerald-600">Matched to SBI Cashback</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
                  <span className="font-semibold text-black">✈ International Flights</span>
                  <span className="font-bold text-emerald-600">Matched to Axis Atlas</span>
                </div>
              </div>
            </div>
          </div>

          {/* FEATURE BLOCK 2 */}
          <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-8 sm:p-10 flex flex-col justify-between overflow-hidden group hover:border-neutral-400 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Real-Time Yield Calculator
                </h3>
                <p className="text-sm text-neutral-600 max-w-sm">
                  Calculate exact net rupee returns after deducting annual fees and joining charges.
                </p>
              </div>
              <Link
                href="/#reward-calculator"
                className="h-10 w-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-black font-bold group-hover:bg-[#DDF247] group-hover:border-[#DDF247] transition-all"
                aria-label="Calculate rewards"
              >
                ↗
              </Link>
            </div>

            <div className="relative bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3">
                <span className="text-xs text-neutral-500 font-semibold">Monthly Spend Profile</span>
                <span className="text-xs font-mono font-bold text-black">₹45,000 / mo</span>
              </div>
              <div className="text-2xl font-bold text-black">
                ₹18,400 <span className="text-xs font-normal text-neutral-500">est. annual net return</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-COLUMN RAMP FEATURE TILES (Matching Screenshot 5) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-8 space-y-4 hover:border-neutral-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-neutral-400">01</span>
              <span className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold">↗</span>
            </div>
            <h4 className="text-xl font-bold text-black">Fee Waiver Tracking</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Know the exact spend threshold required to waive your annual recurring card fees.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-8 space-y-4 hover:border-neutral-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-neutral-400">02</span>
              <span className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold">↗</span>
            </div>
            <h4 className="text-xl font-bold text-black">Airport Lounge Finder</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Filter cards providing complimentary domestic &amp; international airport lounge access.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-8 space-y-4 hover:border-neutral-400 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-neutral-400">03</span>
              <span className="h-8 w-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold">↗</span>
            </div>
            <h4 className="text-xl font-bold text-black">Zero Forex Markup</h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Save up to 3.5% on overseas transactions with specialized travel cards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
