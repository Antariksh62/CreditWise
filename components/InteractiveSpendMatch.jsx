"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import cards from "../data/cards.json";
import { calculateRewards, formatRupees } from "../lib/rewardCalculator";

const CARD_IMAGE_MAP = {
  "sbi-cashback": "/credit-card-imgs/sbi-cashback.png",
  "hsbc-live-plus": "/credit-card-imgs/hsbc-live-plus.png",
  "icici-amazon-pay": "/credit-card-imgs/amazon-pay-icici.jpeg",
  "hdfc-millennia-cashback": "/credit-card-imgs/hdfc-millenia.png",
  "hdfc-regalia-gold": "/credit-card-imgs/hdfc-regalia-gold.png",
  "axis-atlas": "/credit-card-imgs/axis-magnus.png",
  "amex-membership-rewards": "/credit-card-imgs/amex-mrcc.png",
  "bpcl-sbi-octane": "/credit-card-imgs/sbi-bpcl-octane.png",
  "idfc-first-select": "/credit-card-imgs/idfc-power-plus.png",
  "axis-ace": "/credit-card-imgs/flipkart-axis-bank.png"
};

const PRESET_PROFILES = [
  {
    id: "online",
    label: "Online Shopping",
    icon: "🛒",
    spend: { online: 15000, dining: 4000, travel: 2000, fuel: 2000, other: 2000 },
    monthlyTotal: 25000
  },
  {
    id: "food",
    label: "Groceries & Dining",
    icon: "🍽️",
    spend: { online: 5000, dining: 12000, travel: 3000, fuel: 3000, other: 7000 },
    monthlyTotal: 30000
  },
  {
    id: "travel",
    label: "Flights & Travel",
    icon: "✈️",
    spend: { online: 5000, dining: 6000, travel: 25000, fuel: 4000, other: 5000 },
    monthlyTotal: 45000
  },
  {
    id: "beginner",
    label: "Zero Annual Fee",
    icon: "⚡",
    spend: { online: 8000, dining: 3000, travel: 1000, fuel: 1000, other: 2000 },
    monthlyTotal: 15000
  }
];

export default function InteractiveSpendMatch() {
  const [activeProfileId, setActiveProfileId] = useState("online");
  const activeProfile = PRESET_PROFILES.find((p) => p.id === activeProfileId) || PRESET_PROFILES[0];

  // Evaluate all cards using the real calculator
  const evaluatedCards = cards.map((card) => {
    const calc = calculateRewards(card, activeProfile.spend);
    return {
      card,
      calc,
    };
  });

  // Sort by net value after fee
  evaluatedCards.sort((a, b) => b.calc.netValue - a.calc.netValue);

  // Top 3 cards for this exact spend
  const topThree = evaluatedCards.slice(0, 3);

  return (
    <section className="py-24 lg:py-32 bg-[#FAFAFA] border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* EDITORIAL HEADER */}
        <div className="max-w-3xl mb-12 sm:mb-14 space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            SEE WHAT YOU COULD GET BACK
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-neutral-950 leading-[1.08]">
            Compare cards{" "}
            <span className="text-neutral-400 font-normal block sm:inline">
              without doing the math yourself.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-2xl pt-1 leading-relaxed">
            Pick a spending pattern to see what real credit cards actually give back after accounting for annual fees.
          </p>
        </div>

        {/* LIFESTYLE SPEND TOGGLE TABS */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {PRESET_PROFILES.map((profile) => {
            const isActive = profile.id === activeProfileId;
            return (
              <button
                key={profile.id}
                onClick={() => setActiveProfileId(profile.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white border border-neutral-200/90 text-neutral-700 hover:border-neutral-300 hover:text-black"
                }`}
              >
                <span>{profile.icon}</span>
                <span>{profile.label}</span>
                <span className="text-xs ml-1 font-mono text-neutral-400">
                  (₹{profile.monthlyTotal.toLocaleString("en-IN")}/mo)
                </span>
              </button>
            );
          })}
        </div>

        {/* 3 MATCHED CARDS DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map(({ card, calc }, idx) => {
            const isBestMatch = idx === 0;
            const imgSrc = CARD_IMAGE_MAP[card.slug] || card.image;

            return (
              <div
                key={card.slug}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 ${
                  isBestMatch
                    ? "bg-white border-2 border-neutral-950 shadow-md"
                    : "bg-white border border-neutral-200/90 shadow-xs hover:border-neutral-300"
                }`}
              >
                {/* BEST FIT BADGE */}
                {isBestMatch && (
                  <div className="absolute -top-3.5 left-7 inline-flex items-center gap-1.5 rounded-full bg-[#e4f222] px-3 py-0.5 text-[11px] font-bold text-black border border-neutral-900 shadow-xs">
                    <Sparkles className="w-3 h-3 text-black" />
                    Top fit for this spending
                  </div>
                )}

                <div>
                  {/* CARD HEADER & IMAGE */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                        {card.bank}
                      </span>
                      <h3 className="text-lg font-bold text-neutral-950 mt-0.5 leading-snug">
                        {card.name}
                      </h3>
                    </div>

                    <div className="relative w-16 h-10 rounded-md overflow-hidden border border-neutral-200 bg-neutral-900 shrink-0 shadow-xs">
                      <Image
                        src={imgSrc}
                        alt={card.name}
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                  </div>

                  {/* VALUE BREAKDOWN IN PLAIN RUPEES */}
                  <div className="space-y-3 border-t border-neutral-100 pt-4 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Annual fee</span>
                      <span className="font-mono font-medium text-neutral-900">
                        {card.annualFee === 0 ? "Free forever (₹0)" : `₹${card.annualFee.toLocaleString("en-IN")} / yr`}
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-600">
                      <span>Estimated rewards</span>
                      <span className="font-mono font-semibold text-emerald-600">
                        +{formatRupees(calc.annualRewards)} / yr
                      </span>
                    </div>

                    <div className="flex justify-between text-neutral-950 font-bold pt-2 border-t border-neutral-100 text-sm">
                      <span>Value after fees</span>
                      <span className="font-mono text-neutral-950">
                        {formatRupees(calc.netValue)} / yr
                      </span>
                    </div>
                  </div>

                  {/* SIMPLE HUMAN EXPLANATION */}
                  <div className="mt-5 p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 leading-relaxed">
                    {calc.feeWaived ? (
                      <span>
                        ✅ <strong>Annual fee waived:</strong> Your spending exceeds the waiver threshold, making this card free for you.
                      </span>
                    ) : card.annualFee === 0 ? (
                      <span>
                        ⚡ <strong>Zero fee stress:</strong> No annual fee to track. Every rupee earned is pure value back.
                      </span>
                    ) : (
                      <span>
                        💡 <strong>Pays for itself:</strong> Your estimated rewards cover the fee, leaving you with {formatRupees(calc.netValue)} back.
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTTOM LINK */}
                <div className="pt-6 mt-6 border-t border-neutral-100">
                  <Link
                    href={`/cards/${card.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black hover:underline"
                  >
                    <span>See card details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
