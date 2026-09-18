"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroDotCanvas from "./HeroDotCanvas";

export default function Hero() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    router.push(`/recommend?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="relative pt-12 pb-0 lg:pt-16 bg-white overflow-hidden border-b-0">
      <div className="cw-container relative z-10">
        {/* HERO EDITORIAL & TYPOGRAPHY HEADER */}
        <div className="max-w-4xl text-left space-y-4">
          {/* TOP FAINT STAT/LABEL BADGE */}
          <div className="inline-flex items-center gap-2 rounded border border-neutral-200/80 bg-neutral-50 px-2.5 py-1 text-[9px] font-medium text-neutral-600 tracking-wider uppercase">
            <span>INDIAN CREDIT CARD REWARDS OPTIMIZED:</span>
            <span className="rounded bg-neutral-200/80 px-1.5 py-0.5 font-mono text-[8px] font-bold text-black">
              100% TRANSPARENT
            </span>
          </div>

          {/* MAIN HEADLINE — SLEEK MEDIUM FONT WEIGHT */}
          <h1 className="text-4xl sm:text-6xl lg:text-[3.5rem] font-normal sm:font-medium tracking-tight text-neutral-950 leading-[1.05] max-w-3xl">
            What if your expenses could{" "}
            <span className="text-neutral-400 block sm:inline font-normal">
              earn rewards too?
            </span>
          </h1>
        </div>
      </div>

      {/* SEAMLESS DOT GRID PATTERN SECTION — MERGES BEAUTIFULLY FROM "earn rewards too?" LINE */}
      <div className="relative w-full pt-3 pb-4">
        {/* BLACK HOLE CURSOR-RESPONSIVE DOT CANVAS WITH TOP SEAMLESS FADE */}
        <HeroDotCanvas />

        <div className="cw-container relative z-10">
          {/* CONCISE FAINT 1-LINE SUBTITLE */}
          <p className="text-neutral-500 text-base sm:text-lg font-normal tracking-normal max-w-2xl leading-snug mb-6">
            Cards, rewards, lounge access, and cashback* – matched to your spending.
          </p>

          {/* EMAIL INPUT BOX RIGHT BELOW SUBTITLE */}
          <div className="mb-0 pb-2">
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 bg-white/90 backdrop-blur border border-neutral-200/90 rounded-[8px] p-1.5 max-w-md w-full shadow-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="What's your email address?"
                className="w-full bg-transparent px-3 py-2 text-sm text-black placeholder:text-neutral-400 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-[6px] bg-[#e4f222] px-5 py-2.5 text-sm font-medium text-black hover:bg-[#cee723] transition-colors whitespace-nowrap shadow-sm"
              >
                Get started for free
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
