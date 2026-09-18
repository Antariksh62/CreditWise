"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Plane, Fuel, Globe, Utensils, Film, Sparkles, Shield, Coins, Tag } from "lucide-react";

export default function StandardsGrid() {
  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* CENTERED EDITORIAL HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            OUR CURATION STANDARDS
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-neutral-950 leading-[1.08]">
            We don&apos;t list every card.{" "}
            <span className="text-neutral-400 font-normal block sm:inline">
              We list the cards worth considering.
            </span>
          </h2>
          <p className="text-base text-neutral-600 font-normal max-w-xl mx-auto pt-1 leading-relaxed">
            Not every card meets our standards. We look at fees, how rewards actually work, and whether the perks make sense for how you live.
          </p>
        </div>

        {/* 3-COLUMN TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TILE 1: STRICT CURATION */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold tracking-tight text-neutral-950 leading-snug">
                  Only cards{" "}
                  <span className="text-neutral-400 font-normal">that pass our review</span>
                </h3>
                <Link
                  href="/cards"
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-600 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* CURATION TABLE */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 font-bold border-b border-neutral-100 pb-2">
                  <span>Card Example</span>
                  <span>CardWise Status</span>
                </div>

                {[
                  { name: "HDFC Millennia", issuer: "HDFC Bank", pass: true, detail: "5% Online Cashback" },
                  { name: "SBI Cashback", issuer: "SBI Card", pass: true, detail: "Direct Statement Credit" },
                  { name: "Axis Atlas", issuer: "Axis Bank", pass: true, detail: "Clear Travel Miles" },
                  { name: "Amazon Pay ICICI", issuer: "ICICI Bank", pass: true, detail: "Lifetime Free" },
                  { name: "Generic Retail Cards", issuer: "Standard Banks", pass: false, detail: "Weak 0.5% Returns" }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-neutral-50 last:border-0">
                    <div>
                      <div className="font-semibold text-neutral-900 leading-none">{row.name}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{row.detail}</div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium flex items-center gap-1 ${
                      row.pass ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                    }`}>
                      {row.pass ? <Check className="w-2.5 h-2.5" /> : null}
                      {row.pass ? "Recommended" : "Filtered Out"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-6 font-normal leading-relaxed">
              We filter out cards with weak rewards or restrictive rules, and only highlight cards that give genuine value.
            </p>
          </div>

          {/* TILE 2: HOW REWARDS ACTUALLY WORK (POINTS VS HONEST CASH) */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold tracking-tight text-neutral-950 leading-snug">
                  How rewards{" "}
                  <span className="text-neutral-400 font-normal">actually work</span>
                </h3>
                <Link
                  href="/blog/cashback-vs-rewards"
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-600 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* POINT CONVERSION COMPARISON MODULE */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 space-y-3.5 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold">Marketing vs Reality</span>
                  <div className="text-xs text-neutral-500">Bank Ad: &quot;Earn 4 Reward Points per ₹150&quot;</div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>What 1 point is worth</span>
                    <span className="font-mono font-semibold text-neutral-900">₹0.25 (25 paise)</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>What you actually get</span>
                    <span className="font-mono font-semibold text-neutral-900">₹1 back per ₹150 spent</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200/60 flex justify-between items-center text-xs font-bold text-neutral-950">
                    <span>Versus direct cashback</span>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">₹7.50 back per ₹150</span>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-neutral-600 leading-relaxed">
                  💡 <strong className="text-neutral-900">CardWise rule:</strong> A 5% direct cashback card puts 7× more cash back in your pocket than complicated points you never end up redeeming.
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-6 font-normal leading-relaxed">
              We translate reward points into plain rupees so you can compare cards easily without getting confused.
            </p>
          </div>

          {/* TILE 3: USEFUL BENEFITS YOU ACTUALLY USE */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold tracking-tight text-neutral-950 leading-snug">
                  Useful benefits{" "}
                  <span className="text-neutral-400 font-normal">you actually use</span>
                </h3>
                <Link
                  href="/compare"
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-600 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* BENEFIT TILES */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { icon: Plane, label: "Lounge Access", highlight: true },
                  { icon: Fuel, label: "1% Fuel Waiver", highlight: false },
                  { icon: Globe, label: "Low Forex Fee", highlight: true },
                  { icon: Utensils, label: "Dining Offers", highlight: false },
                  { icon: Film, label: "Movie Tickets", highlight: false },
                  { icon: Sparkles, label: "Milestone Bonus", highlight: true },
                  { icon: Shield, label: "Travel Cover", highlight: false },
                  { icon: Coins, label: "Statement Cash", highlight: true },
                  { icon: Tag, label: "Fee Waivers", highlight: false },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border p-2.5 flex flex-col items-center justify-center text-center transition-all ${
                        item.highlight
                          ? "bg-white border-neutral-200 shadow-xs group-hover:border-neutral-300"
                          : "bg-neutral-100/70 border-transparent text-neutral-600"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-neutral-800 mb-1" strokeWidth={1.75} />
                      <span className="text-[10px] font-medium text-neutral-800 leading-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-neutral-500 mt-6 font-normal leading-relaxed">
              Every perk, fee waiver, and condition explained in simple everyday language.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
