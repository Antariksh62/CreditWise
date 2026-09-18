"use client";

import Link from "next/link";
import { ArrowUpRight, Plane, Fuel, Globe, Utensils, Sparkles, Shield, Check, Filter } from "lucide-react";

export default function CurationStandards() {
  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* CENTERED EDITORIAL HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            OUR CURATION
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-neutral-950 leading-[1.08]">
            We don&apos;t list every card.{" "}
            <span className="text-neutral-400 font-normal block sm:inline">
              We list the cards worth considering.
            </span>
          </h2>
          <p className="text-base text-neutral-600 font-normal max-w-xl mx-auto pt-1 leading-relaxed">
            Not every card meets our standards. We filter out the noise so you only see what is genuinely useful.
          </p>
        </div>

        {/* 3-COLUMN RAMP-STYLE TILES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* TILE 1: STRICT STANDARDS */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
                    Strict standards
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    We filter out cards with weak rewards or restrictive rules.
                  </p>
                </div>
                <Link
                  href="/cards"
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-600 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                  aria-label="Browse cards"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* VISUAL PLACEHOLDER AREA */}
              <div className="relative mt-6 w-full min-h-[180px] rounded-2xl border border-neutral-200/80 bg-white p-5 flex flex-col items-center justify-center overflow-hidden shadow-xs">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.2]"
                  style={{
                    backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }}
                />

                <div className="relative z-10 w-full space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <span className="font-medium text-neutral-800">Clear return on spending</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[11px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                    <span className="font-medium text-neutral-800">Realistic fee waivers</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[11px] font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200/60 text-xs text-neutral-400">
                    <span>Weak earn rates</span>
                    <span className="font-mono text-[11px] text-neutral-400">Excluded</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mt-6 font-normal">
              Quality over quantity, always.
            </p>
          </div>

          {/* TILE 2: POINTS MADE SIMPLE */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
                    Points made simple
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    No confusing conversion math. We translate rewards into plain rupees.
                  </p>
                </div>
                <Link
                  href="/blog/cashback-vs-rewards"
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-600 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                  aria-label="Read guide"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* VISUAL PLACEHOLDER AREA */}
              <div className="relative mt-6 w-full min-h-[180px] rounded-2xl border border-neutral-200/80 bg-white p-5 flex flex-col items-center justify-center overflow-hidden shadow-xs">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.2]"
                  style={{
                    backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }}
                />

                <div className="relative z-10 w-full text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 text-xs font-mono text-neutral-600">
                    <span>Reward Points</span>
                    <span>→</span>
                    <span className="font-bold text-neutral-950">Actual Rupees</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700">
                    <span className="font-semibold text-neutral-950 block">Transparent value</span>
                    <span className="text-[11px] text-neutral-500">Know exactly what your points are worth before you choose.</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mt-6 font-normal">
              Clear value, zero guesswork.
            </p>
          </div>

          {/* TILE 3: BENEFITS THAT MATTER */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">
                    Benefits that matter
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Lounge visits, fuel waivers, and zero foreign markup—perks you actually use.
                  </p>
                </div>
                <Link
                  href="/compare"
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-600 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                  aria-label="Compare benefits"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* VISUAL PLACEHOLDER AREA */}
              <div className="relative mt-6 w-full min-h-[180px] rounded-2xl border border-neutral-200/80 bg-white p-4 flex flex-col items-center justify-center overflow-hidden shadow-xs">
                <div className="grid grid-cols-3 gap-2 w-full">
                  {[
                    { icon: Plane, label: "Lounge" },
                    { icon: Fuel, label: "Fuel Waiver" },
                    { icon: Globe, label: "Low Forex" },
                    { icon: Utensils, label: "Dining" },
                    { icon: Sparkles, label: "Cashback" },
                    { icon: Shield, label: "Cover" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-2 flex flex-col items-center justify-center text-center"
                      >
                        <Icon className="w-4 h-4 text-neutral-800 mb-1" strokeWidth={1.75} />
                        <span className="text-[10px] font-medium text-neutral-700">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mt-6 font-normal">
              Perks that fit real life.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
