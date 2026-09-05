"use client";

import Link from "next/link";
import ProductVideoDemo from "./ProductVideoDemo";

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-white overflow-hidden">
      <div className="cw-container">
        {/* HERO EDITORIAL TYPOGRAPHY */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1 text-xs font-semibold text-neutral-800">
            <span className="h-2 w-2 rounded-full bg-[#DDF247]" />
            CARDWISE ENGINE 3.0
          </div>

          <h1 className="cw-hero-title">
            Find the card{" "}
            <span className="text-neutral-400 block sm:inline">
              that works harder for you.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Compare rewards, fees, lounge access, and real-world net rupee returns across India&apos;s leading credit cards in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/recommend"
              className="rounded-[6px] bg-[#DDF247] px-7 py-3.5 text-base font-bold text-black transition-all hover:bg-[#cee723] active:translate-y-px shadow-sm"
            >
              Find my card →
            </Link>
            <Link
              href="/cards"
              className="rounded-[6px] border border-neutral-300 bg-white px-7 py-3.5 text-base font-semibold text-black hover:bg-neutral-50 transition-colors"
            >
              Explore cards
            </Link>
          </div>
        </div>

        {/* LARGE RAMP-STYLE PRODUCT DEMONSTRATION MEDIA AREA */}
        <div className="max-w-5xl mx-auto">
          <ProductVideoDemo />
        </div>
      </div>
    </section>
  );
}
