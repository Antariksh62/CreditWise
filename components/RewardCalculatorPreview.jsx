"use client";

import { useState } from "react";
import Link from "next/link";
import cards from "../data/cards.json";
import { calculateRewards, formatRupees } from "../lib/rewardCalculator";

export default function RewardCalculatorPreview() {
  const [selectedCardSlug, setSelectedCardSlug] = useState("hdfc-millennia-cashback");
  const [spend, setSpend] = useState({
    online: 15000,
    dining: 8000,
    travel: 12000,
    fuel: 5000,
    other: 10000,
  });

  const selectedCard = cards.find((c) => c.slug === selectedCardSlug) || cards[0];
  const calculationResult = calculateRewards(selectedCard, spend);
  const maxCategoryReward = Math.max(...calculationResult.perCategory.map((c) => c.rewards), 1);

  const handleSpendChange = (catKey, value) => {
    setSpend((prev) => ({ ...prev, [catKey]: Number(value) }));
  };

  return (
    <section id="reward-calculator" className="py-24 lg:py-32 bg-white border-t border-neutral-200">
      <div className="cw-container space-y-12">
        
        {/* HEADER SECTION WITH EXACT REQUIRED HEADLINE */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700">
            <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
            2. REWARD CALCULATOR PROOF
          </div>
          <h2 className="cw-h2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black leading-[1.08]">
            Know what your spending{" "}
            <span className="text-neutral-400">could earn back.</span>
          </h2>
          <p className="cw-body text-sm sm:text-base text-neutral-600 font-normal">
            Adjust your monthly spend profile to see estimated annual rewards and value back across real CardWise dataset cards.
          </p>
        </div>

        {/* CALCULATOR MAIN STAGE (2-COL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INTERACTIVE SPEND ASSUMPTIONS SLIDERS */}
          <div className="lg:col-span-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <span className="text-xs font-mono font-bold uppercase text-neutral-400">
                1. SPEND PROFILE INPUTS
              </span>
              <span className="text-xs font-mono font-bold text-black bg-white px-2.5 py-1 rounded border border-neutral-200">
                Monthly Total: {formatRupees(calculationResult.annualSpend / 12)}
              </span>
            </div>

            {/* CARD SELECTOR TOGGLE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-black font-mono uppercase">
                Select Card to Evaluate:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { slug: "hdfc-millennia-cashback", name: "HDFC Millennia" },
                  { slug: "sbi-cashback", name: "SBI Cashback" },
                  { slug: "axis-atlas", name: "Axis Atlas" },
                  { slug: "icici-amazon-pay", name: "ICICI Amazon" },
                  { slug: "hsbc-live-plus", name: "HSBC Live+" },
                  { slug: "idfc-first-select", name: "IDFC Select" },
                ].map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCardSlug(c.slug)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border text-left truncate ${
                      selectedCardSlug === c.slug
                        ? "bg-black text-[#DDF247] border-black shadow-sm"
                        : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SPEND SLIDERS */}
            <div className="space-y-4 pt-2">
              {[
                { key: "online", label: "Online Shopping", max: 50000, step: 1000 },
                { key: "dining", label: "Dining & Food Delivery", max: 30000, step: 1000 },
                { key: "travel", label: "Travel & Flights", max: 60000, step: 2000 },
                { key: "fuel", label: "Fuel & Commute", max: 20000, step: 500 },
                { key: "other", label: "Bills & Other Spends", max: 40000, step: 1000 },
              ].map((item) => (
                <div key={item.key} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-neutral-200">
                  <div className="flex justify-between text-xs font-bold text-black">
                    <span>{item.label}</span>
                    <span className="font-mono text-black">{formatRupees(spend[item.key])} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={item.max}
                    step={item.step}
                    value={spend[item.key]}
                    onChange={(e) => handleSpendChange(item.key, e.target.value)}
                    className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                </div>
              ))}
            </div>

            {/* CLEAR ASSUMPTIONS DISCLOSURE */}
            <div className="pt-2 text-[11px] text-neutral-500 font-mono space-y-1 border-t border-neutral-200">
              <p className="font-bold text-black">Calculation Assumptions &amp; Rules:</p>
              <p>• Based on annual spend profile: {formatRupees(calculationResult.annualSpend)} / year</p>
              <p>• Net value back accounts for annual fee ({selectedCard.annualFee === 0 ? "Lifetime Free" : formatRupees(selectedCard.annualFee)})</p>
              <p>• Takes into account monthly category reward caps and spend waiver rules.</p>
            </div>
          </div>

          {/* RIGHT: REAL-TIME VALUE BACK DISPLAY */}
          <div className="lg:col-span-6 rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-ramp space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  ESTIMATED VALUE BACK • {selectedCard.name.toUpperCase()}
                </span>
                <span className="cw-numeric text-3xl sm:text-5xl font-extrabold text-black leading-none tracking-tight">
                  {formatRupees(calculationResult.annualRewards)}
                </span>
              </div>
              <div className="text-right">
                <span className="inline-block rounded bg-[#DDF247] px-3 py-1.5 text-xs font-mono font-bold text-black border border-black shadow-sm">
                  {calculationResult.effectiveRate}% EFFECTIVE RATE
                </span>
                <span className="block text-[10px] text-neutral-500 font-mono mt-1">
                  Estimated Net Value Back
                </span>
              </div>
            </div>

            {/* BREAKDOWN BARS */}
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold uppercase text-neutral-400">
                Category Value Back Breakdown:
              </div>
              <ul className="space-y-3">
                {calculationResult.perCategory.map((row) => (
                  <li key={row.key} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-bold text-black">
                      <span>{row.label}</span>
                      <span className="font-mono text-black">{formatRupees(row.rewards)}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 border border-neutral-200">
                      {/* INLINE STYLE REQUIREMENT: Dynamic width calculated from rewards */}
                      <div
                        className="h-full rounded-full bg-[#DDF247] transition-all duration-300"
                        style={{ width: `${(row.rewards / maxCategoryReward) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-neutral-500">
                Looking for your personalized wallet match?
              </div>
              <Link
                href="/recommend"
                className="inline-flex items-center gap-2 rounded-[6px] bg-black text-[#DDF247] px-6 py-3 text-xs font-mono font-bold hover:bg-neutral-800 transition-all shrink-0"
              >
                Find your best card →
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}



