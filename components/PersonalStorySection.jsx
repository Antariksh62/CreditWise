"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Utensils, Fuel, Plane, Globe } from "lucide-react";

/**
 * PersonalStorySection
 * Scroll-driven cinematic visual section modeled directly on the Ramp reference video.
 * 
 * Responsive behavior:
 * - Desktop/Laptop (>=1024px): 195vh scroll track with sticky 100dvh container, full progressive reveal
 * - Tablet (768-1023px): 175vh scroll track, peripheral spending nodes placed cleanly
 * - Mobile (<768px): 160vh scroll track with 100dvh container, compact card layout preventing vertical clipping
 * - Touch-safe: uses 100dvh to handle mobile URL bar resizing cleanly
 */
export default function PersonalStorySection() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animId;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height - windowHeight;

      if (totalDist <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalDist));

      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(() => {
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Compute smooth animation parameters driven by scrollProgress
  const headerOpacity = Math.min(1, Math.max(0, scrollProgress * 6.2));
  const headerTranslateY = Math.max(0, (1 - Math.min(1, scrollProgress * 6.2)) * 14);

  const visualProgress = Math.max(0, Math.min(1, (scrollProgress - 0.10) / 0.48));
  const visualOpacity = 0.2 + visualProgress * 0.8;
  const visualScale = 0.95 + visualProgress * 0.05;
  const visualBlur = (1 - visualProgress) * 5;
  const peripheralOpacity = 0.15 + visualProgress * 0.25;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white border-b border-neutral-200/80 min-h-[160vh] sm:min-h-[175vh] lg:min-h-[195vh]"
    >
      {/* STICKY FULL-VIEWPORT CONTAINER (100dvh FOR MOBILE BROWSER COMPATIBILITY) */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full flex flex-col justify-between items-center py-6 sm:py-10 lg:py-14 overflow-hidden select-none">
        
        {/* 1. LARGE CENTERED EDITORIAL HEADING & SUPPORTING TEXT */}
        <div
          className="text-center max-w-3xl mx-auto px-4 z-20 space-y-2 sm:space-y-3 transition-opacity duration-200"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerTranslateY}px)`,
          }}
        >
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
            PERSONALIZED CARD MATCHING
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-[3.5rem] font-normal sm:font-medium tracking-tight leading-[1.1] sm:leading-[1.08]">
            <span className="text-neutral-950 block">Your spending is personal.</span>
            <span className="text-neutral-400 font-normal block">Your card should be too.</span>
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-neutral-500 font-normal max-w-xl mx-auto hidden xs:block">
            Instead of generic rankings, we analyze your actual expense categories to pinpoint the exact card that maximizes your real-world net return.
          </p>
        </div>

        {/* 2. LARGE VISUAL CANVAS (PROGRESSIVELY CLARIFIES AS USER SCROLLS) */}
        <div
          className="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-4 my-auto flex items-center justify-center transition-all duration-150 ease-out"
          style={{
            maskImage: "radial-gradient(ellipse 85% 72% at 50% 50%, black 50%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 85% 72% at 50% 50%, black 50%, transparent 100%)",
          }}
        >
          
          {/* PERIPHERAL FLOATING SPENDING NODES (TABLET & DESKTOP ONLY) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 hidden md:block"
            style={{ opacity: peripheralOpacity }}
          >
            {/* Left Node 1: Dining & Groceries */}
            <div className="absolute left-4 top-16 bg-white/90 rounded-xl border border-black/[0.07] px-3.5 py-2 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-neutral-800">Swiggy & Groceries</div>
                <div className="text-[10px] text-neutral-400">₹8,500/mo · 10% Cashback</div>
              </div>
            </div>

            {/* Left Node 2: Fuel */}
            <div className="absolute left-8 bottom-16 bg-white/90 rounded-xl border border-black/[0.07] px-3.5 py-2 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Fuel className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-neutral-800">Daily Commute</div>
                <div className="text-[10px] text-neutral-400">1% Surcharge Waived</div>
              </div>
            </div>

            {/* Right Node: Travel & Flights */}
            <div className="absolute right-4 top-16 bg-white/90 rounded-xl border border-black/[0.07] px-3.5 py-2 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Plane className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-neutral-800">Flight Bookings</div>
                <div className="text-[10px] text-neutral-400">8 Complimentary Lounges</div>
              </div>
            </div>

            {/* Right Node 2: Forex */}
            <div className="absolute right-8 bottom-16 bg-white/90 rounded-xl border border-black/[0.07] px-3.5 py-2 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-neutral-800">Zero Forex Markup</div>
                <div className="text-[10px] text-neutral-400">Save 3.5% on Overseas Spend</div>
              </div>
            </div>
          </div>

          {/* 3. CENTRAL PRODUCT STORYTELLING CANVAS (FOCUSED & CRISP) */}
          <div
            className="relative z-10 w-full max-w-2xl bg-[#F6F6F4] rounded-xl sm:rounded-2xl border border-black/[0.09] shadow-lg p-5 sm:p-7 lg:p-8 space-y-4 sm:space-y-6 transition-all duration-200 ease-out"
            style={{
              filter: `blur(${visualBlur}px)`,
              opacity: visualOpacity,
              transform: `scale(${visualScale})`,
            }}
          >
            
            {/* MATCH HEADER RAIL */}
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 sm:pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e4f222]" />
                <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 font-semibold tracking-wider uppercase">
                  CARDWISE PERSONAL FIT ENGINE
                </span>
              </div>

              <div className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] sm:text-xs font-mono font-semibold">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>98% Match</span>
              </div>
            </div>

            {/* MAIN CARD RECOMMENDATION DISPLAY */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
              
              {/* PHYSICAL CARD VISUAL */}
              <div className="sm:col-span-5 flex justify-center">
                <div className="relative w-44 sm:w-52 h-26 sm:h-32 rounded-xl bg-gradient-to-br from-[#1c1c1f] via-[#121214] to-[#0a0a0c] border border-neutral-700/60 shadow-xl p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-white text-black font-extrabold text-[9px]">
                        cw
                      </div>
                      <span className="text-white text-xs font-bold tracking-tight">
                        cardwise
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                      PREFERRED
                    </span>
                  </div>

                  <div className="flex items-center gap-2 my-auto">
                    <div className="w-6 sm:w-7 h-4 sm:h-5 rounded-xs bg-amber-200/90 border border-amber-400/50" />
                    <span className="text-[9px] font-mono text-neutral-400">•••• 4819</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-[9px] font-mono text-neutral-400">HSBC LIVE+</span>
                    <span className="text-[10px] font-bold text-[#e4f222] bg-white/10 px-1.5 py-0.5 rounded">
                      10% Back
                    </span>
                  </div>
                </div>
              </div>

              {/* LIVE VALUE BREAKDOWN (RESOLVES AS USER SCROLLS) */}
              <div className="sm:col-span-7 space-y-2.5 sm:space-y-3">
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                    Calculated Annual Value
                  </span>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-neutral-950 tracking-tight">
                    +₹22,080{" "}
                    <span className="text-xs font-normal font-sans text-neutral-500">
                      net in your pocket
                    </span>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fee fully covered in Month 1 of groceries & dining</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>8 complimentary domestic airport lounge visits / yr</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero foreign markup on international purchases</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION FOOTER */}
            <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
              <span className="text-[11px] sm:text-xs text-neutral-400 font-normal">
                Matches ₹25,000/mo spend
              </span>
              <Link
                href="/recommend"
                className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-semibold text-neutral-950 hover:underline"
              >
                <span>Find your match</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

        {/* 4. BOTTOM SCROLL PROGRESS INDICATOR */}
        <div className="z-20 flex items-center gap-2 text-[10px] font-mono text-neutral-400">
          <span>PROGRESS</span>
          <div className="w-14 sm:w-16 h-1 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span>{Math.round(scrollProgress * 100)}%</span>
        </div>

      </div>
    </section>
  );
}
