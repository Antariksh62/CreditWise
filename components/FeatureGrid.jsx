"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SPEND_CATEGORIES = [
  {
    id: "groceries",
    name: "Groceries & Supermarkets",
    icon: "🛒",
    spendExample: "₹12,000 / mo",
    matchedCard: "HSBC Live+ Card",
    cardImg: "/credit-card-imgs/hsbc-live-plus.png",
    rewardPerk: "10% Cashback on dining & groceries",
    whyBetter: "Direct statement credit without complex point conversions",
  },
  {
    id: "fuel",
    name: "Fuel & Commute",
    icon: "⛽",
    spendExample: "₹6,000 / mo",
    matchedCard: "SBI BPCL Octane",
    cardImg: "/credit-card-imgs/sbi-bpcl-octane.png",
    rewardPerk: "7.25% Value back on BPCL fuel",
    whyBetter: "Covers daily commute costs plus surcharge waivers",
  },
  {
    id: "travel",
    name: "Travel & Flights",
    icon: "✈",
    spendExample: "₹25,000 / mo",
    matchedCard: "Axis Magnus",
    cardImg: "/credit-card-imgs/axis-magnus.png",
    rewardPerk: "24 EDGE Miles / ₹200 + Lounge Access",
    whyBetter: "1:4 miles transfer to 10+ international airlines",
  },
  {
    id: "dining",
    name: "Dining & Food Delivery",
    icon: "🍽",
    spendExample: "₹8,000 / mo",
    matchedCard: "HDFC Swiggy Black",
    cardImg: "/credit-card-imgs/hdfc-swiggy-blck.png",
    rewardPerk: "10% Cashback on Swiggy orders",
    whyBetter: "Automatic cashback applied to Swiggy Money wallet",
  },
  {
    id: "shopping",
    name: "Online Shopping",
    icon: "🛍",
    spendExample: "₹15,000 / mo",
    matchedCard: "SBI Cashback Card",
    cardImg: "/credit-card-imgs/sbi-cashback.png",
    rewardPerk: "Flat 5% Cashback across all e-commerce",
    whyBetter: "No merchant-specific restrictions or promo codes required",
  },
  {
    id: "bills",
    name: "Utility Bills & Recharges",
    icon: "⚡",
    spendExample: "₹7,500 / mo",
    matchedCard: "IDFC FIRST Power+",
    cardImg: "/credit-card-imgs/idfc-power-plus.png",
    rewardPerk: "6.5% Savings on utilities & recharges",
    whyBetter: "Transforms compulsory monthly bills into annual rewards",
  },
  {
    id: "upi",
    name: "UPI & Daily Payments",
    icon: "📱",
    spendExample: "₹10,000 / mo",
    matchedCard: "Kiwi Credit Card (RuPay)",
    cardImg: "/credit-card-imgs/kiwi.png",
    rewardPerk: "2% Cashback on UPI QR transactions",
    whyBetter: "Earn rewards on micro-spends previously paying 0%",
  },
];

export default function FeatureGrid() {
  const [activeCategory, setActiveCategory] = useState(SPEND_CATEGORIES[0]);

  return (
    <section className="py-24 lg:py-32 bg-white border-t border-neutral-200">
      <div className="cw-container space-y-24">
        
        {/* COMPOSITION 1: EDITORIAL HEADLINE & STORYTELLING STATEMENT */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700">
            <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
            CARDWISE PRODUCT PHILOSOPHY
          </div>

          <h2 className="cw-h2 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.08]">
            Not more spending.<br />
            <span className="text-neutral-400">Better rewards.</span>
          </h2>

          <p className="cw-body text-base sm:text-lg text-neutral-600 font-normal max-w-2xl leading-relaxed">
            CardWise is built around how you actually spend. You already spend on groceries, fuel, travel, dining, shopping, bills, and UPI — our engine finds the cards that reward those exact expenses.
          </p>
        </div>


        {/* COMPOSITION 2: LARGE VISUAL FLOW DIAGRAM (SPEND → CATEGORY → REWARD → CHOICE) */}
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-10 lg:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <div>
              <div className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                EDITORIAL VISUAL FLOW
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mt-1">
                Don&apos;t change how you spend. Change how you&apos;re rewarded.
              </h3>
            </div>
            <span className="text-xs font-mono text-neutral-500 bg-white border border-neutral-200 px-3 py-1.5 rounded-full shrink-0">
              4-STEP OPTIMIZATION PIPELINE
            </span>
          </div>

          {/* 4-STEP VISUAL PIPELINE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* STEP 1: EXISTING SPENDING */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3 relative group hover:border-black transition-all">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-neutral-400">STEP 01</span>
                <span className="bg-neutral-100 text-black font-bold px-2 py-0.5 rounded">INPUT</span>
              </div>
              <div className="text-sm font-bold text-black">Existing Spending</div>
              <div className="space-y-1.5 text-xs text-neutral-600 font-mono">
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span>Groceries</span>
                  <span className="font-semibold text-black">₹12,000</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1">
                  <span>Flight Booking</span>
                  <span className="font-semibold text-black">₹25,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Dining &amp; Delivery</span>
                  <span className="font-semibold text-black">₹8,000</span>
                </div>
              </div>
            </div>

            {/* STEP 2: CATEGORY MAPPING */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3 relative group hover:border-black transition-all">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-neutral-400">STEP 02</span>
                <span className="bg-neutral-100 text-black font-bold px-2 py-0.5 rounded">ANALYSIS</span>
              </div>
              <div className="text-sm font-bold text-black">Category Breakdown</div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <span className="font-medium text-black">High-Volume Dining</span>
                  <span className="font-bold text-amber-600">Primary</span>
                </div>
                <div className="p-2 rounded bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <span className="font-medium text-black">Air Travel Volume</span>
                  <span className="font-bold text-blue-600">Secondary</span>
                </div>
              </div>
            </div>

            {/* STEP 3: CARD REWARD OPPORTUNITY */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3 relative group hover:border-black transition-all">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-neutral-400">STEP 03</span>
                <span className="bg-[#DDF247] text-black font-bold px-2 py-0.5 rounded">OPPORTUNITY</span>
              </div>
              <div className="text-sm font-bold text-black">Reward Tier Match</div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                  ✓ 10% Dining &amp; Grocery Cashback
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
                  ✓ 5X SmartBuy Travel Multiplier
                </div>
              </div>
            </div>

            {/* STEP 4: BETTER CHOICE */}
            <div className="rounded-2xl border-2 border-black bg-white p-5 space-y-3 relative shadow-ramp hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-black">STEP 04</span>
                <span className="bg-black text-[#DDF247] font-bold px-2 py-0.5 rounded">RECOMMENDED</span>
              </div>
              <div className="text-sm font-bold text-black">Better Choice</div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1">
                <div className="font-bold text-black">Optimal Card Portfolio</div>
                <div className="text-neutral-500 text-[11px]">
                  Highest net yield returned directly on your existing wallet expenses.
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* COMPOSITION 3: INTERACTIVE 7 SPEND CATEGORY EXPLORER */}
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              EXPLORE CATEGORY MATCHES
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold text-black tracking-tight">
              7 core categories. Every rupee accounted for.
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 font-normal">
              Select a spend category below to see how CardWise identifies the card that maximizes returns for that exact budget item.
            </p>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200">
            {SPEND_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                  activeCategory.id === cat.id
                    ? "bg-black text-[#DDF247] border-black shadow-sm"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* ACTIVE CATEGORY SHOWCASE BOARD */}
          <div className="rounded-3xl border border-neutral-200 bg-dotted bg-white p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* LEFT: SPEND & MATCH EXPLANATION */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1 text-xs font-mono font-bold text-neutral-700">
                <span>CATEGORY:</span>
                <span className="text-black uppercase">{activeCategory.name}</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-neutral-400 uppercase">Typical Monthly Budget</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-black font-mono">
                  {activeCategory.spendExample}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="text-xs font-mono font-bold uppercase text-neutral-400">
                  CARDWISE MATCH REASONING
                </div>
                <div className="text-base font-bold text-black">
                  {activeCategory.rewardPerk}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {activeCategory.whyBetter}
                </p>
              </div>

              <div>
                <Link
                  href="/recommend"
                  className="inline-flex items-center gap-2 rounded-[6px] bg-black text-[#DDF247] px-6 py-3 text-xs font-mono font-bold hover:bg-neutral-800 transition-all"
                >
                  Match your full spend profile →
                </Link>
              </div>
            </div>

            {/* RIGHT: MATCHED CARD VISUAL DISPLAY */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase bg-[#DDF247] text-black px-2.5 py-1 rounded">
                TOP CANDIDATE FOR {activeCategory.name.toUpperCase()}
              </span>

              <div
                className={`relative w-full overflow-hidden rounded-xl bg-neutral-200 shadow-lift ${
                  activeCategory.id === "dining" || activeCategory.id === "upi"
                    ? "aspect-[0.63/1] max-w-[180px]"
                    : "aspect-[1.58/1] max-w-[280px]"
                }`}
              >
                <Image
                  src={activeCategory.cardImg}
                  alt={activeCategory.matchedCard}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>

              <div className="text-center space-y-1">
                <div className="text-base font-bold text-black">{activeCategory.matchedCard}</div>
                <div className="text-xs text-neutral-500 font-mono">Evaluated in demo dataset</div>
              </div>
            </div>
          </div>
        </div>


        {/* COMPOSITION 4: RESTRAINED CLOSING PHILOSOPHY STATEMENT */}
        <div className="rounded-3xl border border-neutral-200 bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-mono font-bold text-[#DDF247] uppercase tracking-wider">
              CLEAR MATHEMATICAL MATCHING
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
              Ready to see what your wallet could earn back?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
              Take the 60-second spending quiz to calculate net returns after annual fees across all 31 cards.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 rounded-[6px] bg-[#DDF247] px-8 py-4 text-base font-bold text-black hover:bg-[#cee723] transition-all shadow-sm"
            >
              Start 60-Second Quiz →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

