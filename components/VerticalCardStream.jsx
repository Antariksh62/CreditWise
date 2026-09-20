"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import cards from "../data/cards.json";

// Curated selection of 8 cards
const STREAM_CARDS = cards.slice(0, 8).map((c, i) => ({
  ...c,
  displayRate: c.cashbackRate > 0 ? `${c.cashbackRate}% Cashback` : `${c.rewardRate}x Reward Points`,
  loungeText: c.loungeAccess > 0 ? `${c.loungeAccess} Visits/yr` : "None",
  feeText: c.annualFee === 0 ? "Lifetime Free (₹0)" : `₹${c.annualFee.toLocaleString("en-IN")} / yr`,
  imgSrc: [
    "/credit-card-imgs/hdfc-millenia.png",
    "/credit-card-imgs/sbi-cashback.png",
    "/credit-card-imgs/axis-magnus.png",
    "/credit-card-imgs/hdfc-regalia-gold.png",
    "/credit-card-imgs/amex-mrcc.png",
    "/credit-card-imgs/amazon-pay-icici.jpeg",
    "/credit-card-imgs/idfc-power-plus.png",
    "/credit-card-imgs/sbi-bpcl-octane.png",
  ][i] || c.image,
}));

export default function VerticalCardStream() {
  const sectionRef = useRef(null);
  const cardElementsRef = useRef([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    let animId;
    let currentP = 0;
    let targetP = 0;
    const N = STREAM_CARDS.length;
    const SPACING_Y = 320; // Vertical distance in px between cards

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScroll = rect.height - window.innerHeight;
      if (totalScroll <= 0) return;
      const scrolled = -rect.top;
      targetP = Math.max(0, Math.min(1, scrolled / totalScroll));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const updateLoop = () => {
      // Smooth lerp interpolation for silky motion
      currentP += (targetP - currentP) * 0.14;

      let closestIdx = 0;
      let minDelta = Infinity;

      for (let i = 0; i < N; i++) {
        const el = cardElementsRef.current[i];
        if (!el) continue;

        // Position where card i is centered
        const centerProgress = i / (N - 1);
        // Distance in card units from center
        const delta = (centerProgress - currentP) * (N - 1);
        const absDelta = Math.abs(delta);

        if (absDelta < minDelta) {
          minDelta = absDelta;
          closestIdx = i;
        }

        // Vertical movement
        const translateY = delta * SPACING_Y;
        // Scale reduces subtly as card moves away from focal center
        const scale = Math.max(0.76, 1.02 - absDelta * 0.12);
        // Opacity smoothly fades
        const opacity = Math.max(0, Math.min(1, 1 - Math.pow(absDelta / 2.1, 1.6)));
        // Subtle depth blur on non-focal cards
        const blur = absDelta > 0.35 ? Math.min((absDelta - 0.35) * 2.5, 4.5) : 0;
        // Z-index prioritizes center card
        const zIndex = Math.round(100 - absDelta * 10);

        el.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.zIndex = `${zIndex}`;
        el.style.pointerEvents = absDelta < 0.4 ? "auto" : "none";
      }

      setActiveCardIndex(closestIdx);
      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white h-[650vh]"
      aria-label="Scroll-driven credit card stream"
    >
      {/* STICKY FULLSCREEN VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* CONTINUOUS DOT-GRID PATTERN */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#d1d5db 1.2px, transparent 1.2px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* TOP & BOTTOM SOFT EDGE FADE VIGNETTES */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-30" />

        {/* TOP EDITORIAL STATUS PILL */}
        <div className="absolute top-8 z-40 px-4 py-1.5 rounded-full bg-white/95 border border-neutral-200/90 shadow-2xs flex items-center gap-2 text-xs font-mono text-neutral-600 backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
          <span>Curated Stream</span>
          <span className="text-neutral-400">•</span>
          <span className="font-semibold text-neutral-900">
            {activeCardIndex + 1} of {STREAM_CARDS.length}
          </span>
        </div>

        {/* VERTICAL SPATIAL CARDS CONTAINER */}
        <div className="relative w-full max-w-lg h-full flex items-center justify-center pointer-events-none">
          {STREAM_CARDS.map((card, idx) => (
            <div
              key={card.slug}
              ref={(el) => (cardElementsRef.current[idx] = el)}
              className="absolute w-[340px] sm:w-[400px] md:w-[440px] will-change-transform transition-[filter] duration-150"
              style={{
                top: "50%",
                marginTop: "-140px",
                transform: "translate3d(0, 0, 0) scale(1)",
                opacity: idx === 0 ? 1 : 0,
              }}
            >
              {/* CARD ARTICLE (EXISTING CREDITWISE DESIGN) */}
              <article className="rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-neutral-900/5 overflow-hidden transition-colors hover:border-neutral-400">
                
                {/* TOP VISUAL BAND WITH CARD IMAGE */}
                <div className="relative h-32 sm:h-36 bg-gradient-to-b from-neutral-50 to-neutral-100/70 border-b border-neutral-200/80 flex items-center justify-center p-4">
                  <div className="relative w-44 sm:w-48 h-24 sm:h-28 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-300 shadow-sm">
                    <Image
                      src={card.imgSrc}
                      alt={card.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* TOP RATE BADGE */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md bg-[#DDF247] text-neutral-950 text-[10px] font-mono font-bold shadow-2xs border border-neutral-900/10">
                    {card.displayRate}
                  </div>
                </div>

                {/* CARD BODY CONTENT */}
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* TITLE ROW */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                        {card.bank}
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-neutral-950 leading-snug">
                        {card.name}
                      </h3>
                    </div>
                  </div>

                  {/* KEY FIGURES GRID */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-y border-neutral-100 py-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                        Annual Fee
                      </span>
                      <span className="font-mono font-bold text-neutral-900">
                        {card.feeText}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block font-semibold">
                        Lounge Access
                      </span>
                      <span className="font-mono font-bold text-neutral-900">
                        {card.loungeText}
                      </span>
                    </div>
                  </div>

                  {/* ACTION LINKS */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/cards/${card.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-colors shadow-2xs"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/compare?cards=${card.slug}`}
                      className="inline-flex items-center justify-center text-xs font-semibold py-2.5 px-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                    >
                      Compare
                    </Link>
                  </div>

                </div>

              </article>
            </div>
          ))}
        </div>

        {/* BOTTOM HELPER HINT */}
        <div className="absolute bottom-6 z-40 text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
          <span>Scroll to explore cards</span>
          <span className="animate-bounce">↓</span>
        </div>

      </div>
    </section>
  );
}
