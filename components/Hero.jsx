"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import HeroDotCanvas from "./HeroDotCanvas";

export default function Hero() {
  return (
    <section className="relative pt-12 lg:pt-16 bg-white overflow-hidden">
      {/* 1. HERO TOP EDITORIAL HEADER */}
      <div className="cw-container relative z-10">
        <div className="max-w-4xl text-left space-y-4">
          {/* EDITORIAL EYEBROW */}
          <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium">
            INDIAN CREDIT CARD REWARDS · 100% TRANSPARENT
          </p>

          {/* MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-6xl lg:text-[3.5rem] font-normal sm:font-medium tracking-tight text-neutral-950 leading-[1.05] max-w-3xl">
            Find credit cards that{" "}
            <span className="text-neutral-400 block sm:inline font-normal">
              reward the way you spend.
            </span>
          </h1>
        </div>
      </div>

      {/* 2. CONTINUOUS DOTTED MATRIX ENVIRONMENT */}
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] pt-4 pb-20">
        {/* INTERACTIVE CANVAS EXTENDING ACROSS THE ENTIRE CONTINUOUS FIELD */}
        <HeroDotCanvas />

        <div className="cw-container relative z-10">
          {/* SUPPORTING TEXT */}
          <p className="text-neutral-600 text-base sm:text-lg font-normal tracking-normal max-w-2xl leading-relaxed mb-8">
            Tell us where your money goes. We&apos;ll help you discover credit cards that could give you better returns on the spending you already do.
          </p>

          {/* DUAL ACTION CTAs: PRIMARY RECOMMENDATION & SECONDARY CATALOGUE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-5 max-w-2xl">
            {/* PRIMARY CTA */}
            <div className="flex-1 max-w-md">
              <Link
                href="/onboarding"
                prefetch={true}
                className="group flex items-center justify-between sm:justify-center gap-3 rounded-xl bg-black px-6 py-4 text-sm sm:text-base font-bold text-white transition-all hover:bg-neutral-800 shadow-md hover:shadow-lg"
              >
                <span>Find cards that fit my spending</span>
                <ArrowRight className="h-4 w-4 text-[#DDF247] transition-transform group-hover:translate-x-1 shrink-0" />
              </Link>
              <p className="mt-2.5 text-xs text-neutral-500 font-medium sm:text-left leading-normal">
                Get personalized recommendations based on your spending habits.
              </p>
            </div>

            {/* SECONDARY CTA */}
            <div className="shrink-0">
              <Link
                href="/cards"
                prefetch={true}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white/95 backdrop-blur-xs px-5 py-4 text-sm sm:text-base font-semibold text-neutral-900 transition-colors hover:border-black hover:bg-white shadow-2xs"
              >
                <Compass className="h-4 w-4 text-neutral-500 shrink-0" />
                <span>Explore all 31 cards</span>
              </Link>
              <p className="mt-2.5 text-xs text-neutral-400 font-normal sm:text-center leading-normal">
                Curated catalogue · Verified terms
              </p>
            </div>
          </div>

          {/* TRANSPARENT TRUST BADGES */}
          <div className="mt-10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5 font-medium text-neutral-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              No account required
            </span>
            <span className="text-neutral-300">•</span>
            <span>Optimizes existing spend</span>
            <span className="text-neutral-300">•</span>
            <span>Zero sponsored rankings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
