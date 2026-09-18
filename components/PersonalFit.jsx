"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const REAL_LIFESTYLES = [
  {
    id: "commuter",
    name: "Everyday Food & Groceries",
    subtitle: "For regular supermarket and dining expenses",
    spendItems: [
      { label: "Groceries & Supermarkets", amount: "₹12,000 / month" },
      { label: "Food Delivery & Dining", amount: "₹8,000 / month" },
      { label: "Daily Fuel & Commute", amount: "₹4,000 / month" },
    ],
    card: {
      name: "HSBC Live+ Card",
      bank: "HSBC",
      img: "/credit-card-imgs/hsbc-live-plus.png",
      fee: "₹999 / year (Waived at ₹2,00,000 spend)",
      perk: "10% Cashback on dining, food delivery & groceries",
      why: "Cashback credits directly to your statement every month. Fits your highest everyday expenses without needing point conversions."
    }
  },
  {
    id: "online",
    name: "Online Shopper",
    subtitle: "For clothes, electronics, and digital payments",
    spendItems: [
      { label: "E-Commerce Shopping", amount: "₹15,000 / month" },
      { label: "Utility Bills & Recharges", amount: "₹4,000 / month" },
      { label: "Dining & Ordering In", amount: "₹5,000 / month" },
    ],
    card: {
      name: "SBI Cashback Card",
      bank: "SBI Card",
      img: "/credit-card-imgs/sbi-cashback.png",
      fee: "₹999 / year (Waived at ₹2,00,000 spend)",
      perk: "5% Cashback on almost all online spending",
      why: "Works across Amazon, Flipkart, Myntra, and other online stores. No merchant restrictions."
    }
  },
  {
    id: "starter",
    name: "Zero-Fee Beginner",
    subtitle: "For someone getting their first reliable card",
    spendItems: [
      { label: "Amazon & Everyday Shopping", amount: "₹8,000 / month" },
      { label: "Bills & Recharges", amount: "₹3,000 / month" },
      { label: "Other Card Purchases", amount: "₹3,000 / month" },
    ],
    card: {
      name: "Amazon Pay ICICI Card",
      bank: "ICICI Bank",
      img: "/credit-card-imgs/amazon-pay-icici.jpeg",
      fee: "Free forever (₹0 annual fee)",
      perk: "5% Unlimited cashback for Amazon Prime members",
      why: "Zero annual fee forever. No minimum spending target to maintain, and cashback is automatically credited."
    }
  }
];

export default function PersonalFit() {
  const [activeId, setActiveId] = useState("commuter");
  const activeLifestyle = REAL_LIFESTYLES.find((l) => l.id === activeId) || REAL_LIFESTYLES[0];

  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* ASYMMETRIC 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: EDITORIAL STATEMENT & TRANSPARENT 3-STEP FLOW (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              TRANSPARENT MATCHING
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.08]">
              Your spending is personal.{" "}
              <span className="text-neutral-400 font-normal block sm:inline">
                Your card should be too.
              </span>
            </h2>

            <p className="text-base text-neutral-600 font-normal leading-relaxed">
              We look at what you already spend each month and compare cards based on real value—so you never feel pressured to spend more just to earn points.
            </p>

            {/* 3-STEP PROCESS */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-neutral-100 font-mono font-bold text-neutral-900 flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-neutral-900">You tell CardWise how you spend</strong>
                  <p className="text-neutral-500 mt-0.5">Share your typical monthly categories like groceries, bills, or travel.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-neutral-100 font-mono font-bold text-neutral-900 flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-neutral-900">CardWise compares the cards</strong>
                  <p className="text-neutral-500 mt-0.5">We check the fees, earn rates, and waivers against your real numbers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-[#e4f222] font-mono font-bold text-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-neutral-900">You see which cards fit</strong>
                  <p className="text-neutral-500 mt-0.5">No pushy sales, no hidden catches—just the cards that make sense.</p>
                </div>
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

          {/* RIGHT COLUMN: INTERACTIVE LIFESTYLE DEMO (7 COLS) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-8 shadow-sm">
              
              {/* SELECTOR TABS */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200/60 pb-5">
                {REAL_LIFESTYLES.map((lifestyle) => {
                  const isActive = lifestyle.id === activeId;
                  return (
                    <button
                      key={lifestyle.id}
                      onClick={() => setActiveId(lifestyle.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
                      }`}
                    >
                      {lifestyle.name}
                    </button>
                  );
                })}
              </div>

              {/* CARD PREVIEW CONTAINER */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 space-y-6 shadow-xs">
                
                {/* PROFILE HEADER */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Example Lifestyle
                    </span>
                    <h3 className="text-lg font-bold text-neutral-950 mt-0.5">
                      {activeLifestyle.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {activeLifestyle.subtitle}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-semibold shrink-0">
                    <Check className="w-3 h-3" />
                    Good Fit
                  </span>
                </div>

                {/* MONTHLY SPEND DISTRIBUTION */}
                <div className="space-y-2 text-xs border-y border-neutral-100 py-3">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold mb-1">
                    Typical Monthly Spending
                  </span>
                  {activeLifestyle.spendItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-neutral-600 border-b border-neutral-50 last:border-0">
                      <span>{item.label}</span>
                      <span className="font-mono font-medium text-neutral-900">{item.amount}</span>
                    </div>
                  ))}
                </div>

                {/* MATCHED CARD DISPLAY */}
                <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative w-20 h-13 rounded-lg overflow-hidden border border-neutral-200 shadow-xs bg-neutral-900 shrink-0">
                    <Image
                      src={activeLifestyle.card.img}
                      alt={activeLifestyle.card.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-neutral-950">
                        {activeLifestyle.card.name}
                      </h4>
                      <span className="text-[11px] font-mono text-neutral-600 shrink-0">
                        {activeLifestyle.card.fee}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium">
                      {activeLifestyle.card.perk}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-normal pt-1">
                      💡 {activeLifestyle.card.why}
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
