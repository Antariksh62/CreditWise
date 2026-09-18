"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function DualWorkflow() {
  return (
    <section className="py-24 lg:py-32 bg-white border-b border-neutral-200/80 overflow-hidden">
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* SECTION HEADER (EDITORIAL OVERSIZED DUAL-TONE HEADLINE) */}
        <div className="max-w-3xl mb-14 sm:mb-16 space-y-4">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
            HOW REWARDS SHOULD WORK
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-neutral-950 leading-[1.08]">
            Don&apos;t change how you spend.{" "}
            <span className="text-neutral-400 font-normal block sm:inline">
              Change how you&apos;re rewarded.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-2xl pt-1 leading-relaxed">
            You already buy groceries, fuel, meals, and tickets every month. We look at that existing spending to show you which cards actually give real value back.
          </p>
        </div>

        {/* TWO-COLUMN LARGE VISUAL MODULES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CARD A: DAILY EXPENSE MATCHING */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-7 sm:p-9 flex flex-col justify-between overflow-hidden shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            
            {/* SUBTLE BACKGROUND GRID ACCENT */}
            <div 
              className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-[0.25]"
              style={{
                backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            <div>
              {/* TOP HEADER & CORNER ARROW BUTTON */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                    What if your expenses{" "}
                    <span className="text-neutral-400 font-normal">could earn too?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                    We look at how you already spend and match cards to your real lifestyle.
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

              {/* DEMO SLIP: REAL-WORLD EXPENSE MATCH */}
              <div className="space-y-3 pt-2">
                <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-xs max-w-sm">
                  <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium">
                    <span className="text-base">🛒</span>
                    <span>₹4,000 spent on groceries & dining</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 pl-6 font-normal">
                    Looking up cards that reward everyday food and supermarket purchases...
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs max-w-md ml-auto sm:translate-y-1">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-neutral-900">
                        10% Cashback: ₹400 credited directly to your statement
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5 font-normal leading-relaxed">
                        With <span className="font-semibold text-neutral-800">HSBC Live+ Card</span>, cashback is applied right to your statement balance. No points to convert.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD ASSET ANCHOR */}
            <div className="relative mt-8 pt-6 border-t border-neutral-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-9 rounded-md overflow-hidden border border-neutral-200 shadow-xs bg-neutral-900">
                  <Image
                    src="/credit-card-imgs/hsbc-live-plus.png"
                    alt="HSBC Live+ Card"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900">HSBC Live+ Card</div>
                  <div className="text-[11px] text-neutral-500">₹999/yr • 10% Cashback on dining & groceries</div>
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md font-semibold">
                Cashback Card
              </span>
            </div>
          </div>

          {/* CARD B: WHEN DOES THE CARD PAY FOR ITSELF? */}
          <div className="group relative rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] p-7 sm:p-9 flex flex-col justify-between overflow-hidden shadow-sm hover:border-neutral-400 hover:shadow-md transition-all duration-300">
            
            {/* SUBTLE BACKGROUND GRID ACCENT */}
            <div 
              className="absolute top-0 right-0 w-80 h-80 pointer-events-none opacity-[0.25]"
              style={{
                backgroundImage: "radial-gradient(#9ca3af 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            <div>
              {/* TOP HEADER & CORNER ARROW BUTTON */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                    When does the card{" "}
                    <span className="text-neutral-400 font-normal">pay for itself?</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                    We compare the annual fee against what you actually get back, so you know if it&apos;s worth it.
                  </p>
                </div>

                <Link
                  href="/compare"
                  className="w-9 h-9 rounded-full border border-neutral-200 bg-white flex items-center justify-center shrink-0 text-neutral-700 group-hover:border-neutral-900 group-hover:text-black transition-colors shadow-xs"
                  aria-label="Compare fees and rewards"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* REALISTIC BREAKDOWN CARD */}
              <div className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-xs font-semibold text-neutral-800">
                    SBI Cashback Card — Value Breakdown
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                    Pays For Itself
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                    <span>Card Annual Fee</span>
                    <span className="font-semibold text-neutral-900 font-mono">₹999 / year</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                    <span>If you spend online</span>
                    <span className="font-mono text-neutral-900">₹20,000 / month</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                    <span>5% Cashback earned in a year</span>
                    <span className="font-semibold text-emerald-600 font-mono">+₹12,000 / year</span>
                  </div>
                  <div className="flex justify-between py-1 pt-2 font-bold text-neutral-950 text-sm">
                    <span>Real value after fees</span>
                    <span className="text-neutral-950 font-mono">+₹11,001 in your pocket</span>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-xl p-3 text-[11px] text-neutral-600 leading-relaxed border border-neutral-100">
                  ✨ <strong className="text-neutral-900">Break-even:</strong> The ₹999 fee is covered within your first month of normal spending. The fee is waived completely if you spend over ₹2,00,000 in a year.
                </div>
              </div>
            </div>

            {/* CARD ASSET ANCHOR */}
            <div className="relative mt-8 pt-6 border-t border-neutral-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-9 rounded-md overflow-hidden border border-neutral-200 shadow-xs bg-neutral-900">
                  <Image
                    src="/credit-card-imgs/sbi-cashback.png"
                    alt="SBI Cashback Card"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-900">SBI Cashback Card</div>
                  <div className="text-[11px] text-neutral-500">₹999/yr • 5% Cashback on almost all online spending</div>
                </div>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md font-semibold">
                Fee Cleared
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
