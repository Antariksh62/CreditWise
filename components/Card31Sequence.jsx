"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// 31 REAL CREDIT CARDS WITH TRIMMED NATIVE ASPECT RATIOS
const ALL_31_CARDS = [
  { id: 1, name: "SBI Cashback", file: "sbi-cashback.png", isPortrait: true, ar: 0.637 },
  { id: 2, name: "HDFC Infinia", file: "hdfc-inifinia.png", isPortrait: false, ar: 2.054 },
  { id: 3, name: "Axis Magnus", file: "axis-magnus.png", isPortrait: true, ar: 0.635 },
  { id: 4, name: "Amex MRCC", file: "amex-mrcc.png", isPortrait: false, ar: 1.57 },
  { id: 5, name: "ICICI Amazon Pay", file: "amazon-pay-icici.jpeg", isPortrait: false, ar: 1.566 },
  { id: 6, name: "Flipkart Axis", file: "flipkart-axis-bank.png", isPortrait: false, ar: 1.658 },
  { id: 7, name: "HDFC Millennia", file: "hdfc-millenia.png", isPortrait: false, ar: 1.578 },
  { id: 8, name: "HSBC Live+", file: "hsbc-live-plus.png", isPortrait: true, ar: 0.648 },
  { id: 9, name: "Axis Horizon", file: "axis-horizon.png", isPortrait: false, ar: 1.512 },
  { id: 10, name: "HDFC Regalia Gold", file: "hdfc-regalia-gold.png", isPortrait: false, ar: 1.759 },
  { id: 11, name: "HSBC TravelOne", file: "hsbc-travel-one.png", isPortrait: true, ar: 0.614 },
  { id: 12, name: "BOB Etihad", file: "bob-ethiad.png", isPortrait: false, ar: 1.517 },
  { id: 13, name: "Federal Scapia", file: "scapia-cc.png", isPortrait: true, ar: 0.689 },
  { id: 14, name: "SBI BPCL Octane", file: "sbi-bpcl-octane.png", isPortrait: false, ar: 1.586 },
  { id: 15, name: "IDFC FIRST Power+", file: "idfc-power-plus.png", isPortrait: false, ar: 2.009 },
  { id: 16, name: "RBL IndianOil Extra", file: "rbl-indian-oil-extra.png", isPortrait: true, ar: 0.635 },
  { id: 17, name: "IndusInd EazyDiner", file: "indusind-easydiner.png", isPortrait: false, ar: 1.429 },
  { id: 18, name: "HDFC Swiggy Black", file: "hdfc-swiggy-blck.png", isPortrait: false, ar: 1.585 },
  { id: 19, name: "HDFC Swiggy Orange", file: "hdfc-swiggy-orgne.png", isPortrait: false, ar: 2.158 },
  { id: 20, name: "Tata Neu Infinity", file: "hdfc-tata-neu-inifity.png", isPortrait: true, ar: 0.621 },
  { id: 21, name: "Tata Neu Plus", file: "hdfc-tata-neu.png", isPortrait: false, ar: 1.923 },
  { id: 22, name: "SBI PhonePe Black", file: "sbi-phonepe-black.png", isPortrait: true, ar: 0.623 },
  { id: 23, name: "Kiwi RuPay", file: "kiwi.png", isPortrait: false, ar: 1.58 },
  { id: 24, name: "IndusInd Tiger", file: "indusind-tiger.png", isPortrait: true, ar: 0.63 },
  { id: 25, name: "HSBC RuPay Cashback", file: "hsbc-rupay-cashback.png", isPortrait: true, ar: 0.607 },
  { id: 26, name: "HDFC Diners Black Metal", file: "hdfc-diners-club-metal.png", isPortrait: false, ar: 1.58 },
  { id: 27, name: "HDFC Diners Privilege", file: "hdfc-diners-club-privilege.png", isPortrait: false, ar: 1.569 },
  { id: 28, name: "HDFC BizBlack", file: "hdfc-biz-black.png", isPortrait: false, ar: 2.164 },
  { id: 29, name: "HDFC Marriott Bonvoy", file: "hdfc-marriot-bonvoy.png", isPortrait: false, ar: 1.465 },
  { id: 30, name: "HSBC Premier", file: "hsbc-premier.png", isPortrait: false, ar: 1.185 },
  { id: 31, name: "BOB Eterna", file: "bob-eterna.png", isPortrait: false, ar: 1.55 },
];

export default function Card31Sequence() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isPlayingAutoplay, setIsPlayingAutoplay] = useState(false);
  const autoplayRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Update viewport size
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Continuous scroll tracking
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isPlayingAutoplay) return;

      if (!ticking) {
        requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }
          const rect = containerRef.current.getBoundingClientRect();
          const totalScroll = rect.height - window.innerHeight;
          if (totalScroll > 0) {
            const current = -rect.top;
            const p = Math.max(0, Math.min(1, current / totalScroll));
            setScrollProgress(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPlayingAutoplay]);

  // Precompute arrival center times and transit windows
  // Tighter distance between cards so they stream in rapid succession ("fast fast")
  const timelineData = useMemo(() => {
    const centers = [];
    const windows = [];

    // Start early in the scroll track
    let currentC = 0.035;
    centers.push(currentC);
    windows.push(0.095);

    for (let i = 1; i < 31; i++) {
      const t = i / 30; // 0 to 1
      // Reduced spacing delta so cards stream closely behind each other
      // At start delta = 0.032, at end delta = 0.011
      const delta = 0.032 * Math.pow(1 - t, 1.4) + 0.011;
      currentC += delta;
      centers.push(currentC);

      // Transit duration: decreases as cards move faster
      const win = 0.09 * Math.pow(1 - t, 0.75) + 0.035;
      windows.push(win);
    }

    return { centers, windows };
  }, []);

  // Autoplay functionality (rapid accelerating montage: ~7.5 seconds)
  const toggleAutoplay = useCallback(() => {
    if (isPlayingAutoplay) {
      if (autoplayRef.current) cancelAnimationFrame(autoplayRef.current);
      setIsPlayingAutoplay(false);
    } else {
      setIsPlayingAutoplay(true);
      const startTime = performance.now();
      const duration = 7500; // 7.5 seconds brisk accelerating montage

      const step = (now) => {
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / duration);
        setScrollProgress(p);

        if (p < 1) {
          autoplayRef.current = requestAnimationFrame(step);
        } else {
          setIsPlayingAutoplay(false);
        }
      };

      autoplayRef.current = requestAnimationFrame(step);
    }
  }, [isPlayingAutoplay]);

  // Clean up autoplay
  useEffect(() => {
    return () => {
      if (autoplayRef.current) cancelAnimationFrame(autoplayRef.current);
    };
  }, []);

  // Compute exact vertical position, blur, and opacity for card i
  const getCardPhysics = useCallback(
    (index) => {
      const p = scrollProgress;
      const { centers, windows } = timelineData;

      const centerP = centers[index];
      const winP = windows[index];
      const halfWin = winP / 2;

      // Active viewport window with slight margin for seamless ingress/egress
      const startP = centerP - halfWin * 1.15;
      const endP = centerP + halfWin * 1.15;

      if (p < startP || p > endP) {
        return { isVisible: false, y: 0, opacity: 0, blur: 0, scale: 1 };
      }

      // Local progress of card: -1 (bottom entry) to +1 (top exit)
      const localProgress = (p - centerP) / halfWin;

      // Vertical travel distance across viewport (moves from down to up)
      const travelDist = viewport.height * 0.78;
      const y = -localProgress * travelDist;

      // Subtle horizontal micro-offset (-2.5px to +2.5px) for natural analog rhythm
      const microX = ((index % 5) - 2) * 1.2;

      // Smooth opacity fade at extreme edges
      const distFromEdge = 1 - Math.abs(localProgress);
      const opacity = Math.min(1, Math.max(0, distFromEdge * 3.6));

      // Speed progression index (0 to 1)
      const speedTier = index / 30;

      // Subtle dynamic motion blur: sharpens at dead-center viewing zone
      const maxBlur = speedTier * 2.0; // max 2px at top velocity
      const distFromCenterRatio = Math.min(1, Math.abs(y) / (viewport.height * 0.22));
      const blur = maxBlur * distFromCenterRatio;

      // Subtle scale breathing: slightly closer at center
      const scale = 1 + (1 - Math.min(1, Math.abs(localProgress))) * 0.03;

      return {
        isVisible: true,
        x: microX,
        y,
        opacity,
        blur,
        scale,
        zIndex: 10 + index,
      };
    },
    [scrollProgress, timelineData, viewport.height]
  );

  // Active card counter
  const activeIndex = useMemo(() => {
    let closestIndex = 0;
    let minDiff = 999;
    timelineData.centers.forEach((c, idx) => {
      const diff = Math.abs(scrollProgress - c);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    return closestIndex;
  }, [scrollProgress, timelineData.centers]);

  // Final moment reveal after card 31 exits (around p = 0.82)
  const isFinalMoment = scrollProgress >= 0.82;
  const finalOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.82) / 0.08));

  // Velocity indicator
  const speedLabel = useMemo(() => {
    if (scrollProgress < 0.18) return "01 / STEADY STREAM";
    if (scrollProgress < 0.38) return "02 / ACCELERATING";
    if (scrollProgress < 0.62) return "03 / RAPID FLOW";
    if (scrollProgress < 0.82) return "04 / MAXIMUM VELOCITY";
    return "05 / RESOLUTION";
  }, [scrollProgress]);

  return (
    <section
      ref={containerRef}
      id="cardwise-stream"
      aria-label="31-Card Accelerating Sequence"
      className="relative bg-white border-t border-neutral-200 min-h-[420vh] md:min-h-[460vh]"
    >
      {/* REDUCED MOTION ACCESSIBLE VIEW */}
      {isReducedMotion ? (
        <div className="py-24 px-6 max-w-5xl mx-auto space-y-16">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
              31 CARDS ANALYZED
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black mt-2">
              Over 30 credit cards in India. We help you find the one that fits how you spend.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_31_CARDS.map((card) => (
              <div
                key={card.id}
                className="relative aspect-[1.58/1] rounded-xl overflow-hidden p-1 flex items-center justify-center"
              >
                <Image
                  src={`/credit-card-imgs/${card.file}`}
                  alt={card.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            ))}
          </div>

          <div className="pt-8 text-center max-w-xl mx-auto space-y-4">
            <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
              SO MANY CARDS.
            </h3>
            <p className="text-xl text-neutral-600">Which one is right for you?</p>
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 rounded bg-black text-[#DDF247] px-8 py-3.5 text-base font-bold hover:bg-neutral-800 transition-colors"
            >
              Find your card →
            </Link>
          </div>
        </div>
      ) : (
        /* PINNED CENTRAL STREAM CANVAS */
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center pointer-events-none select-none bg-white">
          {/* TOP STREAM STATUS BAR */}
          <div className="absolute top-8 md:top-12 inset-x-0 z-20 flex items-center justify-between px-6 md:px-12 max-w-6xl mx-auto pointer-events-auto">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#DDF247] ring-4 ring-black/5" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
                THE CREDIT CARD MATRIX
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400">
                VELOCITY: <strong className="text-black font-semibold">{speedLabel}</strong>
              </span>

              <button
                onClick={toggleAutoplay}
                className="px-3.5 py-1.5 rounded-full border border-neutral-300 bg-white text-[11px] font-mono font-bold text-neutral-800 hover:border-black hover:bg-black hover:text-[#DDF247] transition-all shadow-xs"
                title={isPlayingAutoplay ? "Pause stream playback" : "Play continuous accelerating montage"}
              >
                {isPlayingAutoplay ? "PAUSE STREAM ❚❚" : "AUTO STREAM ▶"}
              </button>
            </div>
          </div>

          {/* CENTRAL CARD STREAM CORRIDOR */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              opacity: isFinalMoment ? Math.max(0, 1 - finalOpacity * 1.5) : 1,
              transition: "opacity 250ms ease",
            }}
          >
            {/* 31 STREAMING CARDS */}
            {ALL_31_CARDS.map((card, idx) => {
              const physics = getCardPhysics(idx);

              if (!physics.isVisible) return null;

              // True native dimensioning based on orientation
              // Landscape cards use wider footprint; portrait cards use taller footprint
              const isMobile = viewport.width < 768;
              const cardWidth = card.isPortrait
                ? isMobile ? "170px" : "240px"
                : isMobile ? "270px" : "380px";
              const cardHeight = card.isPortrait
                ? isMobile ? "265px" : "375px"
                : isMobile ? "170px" : "240px";

              return (
                <div
                  key={card.id}
                  className="absolute pointer-events-none will-change-transform flex items-center justify-center"
                  style={{
                    transform: `translate3d(${physics.x}px, ${physics.y}px, 0px) scale(${physics.scale})`,
                    opacity: physics.opacity,
                    filter: physics.blur > 0.1 ? `blur(${physics.blur.toFixed(2)}px)` : "none",
                    zIndex: physics.zIndex,
                    width: cardWidth,
                    height: cardHeight,
                  }}
                >
                  {/* ZERO ARTIFICIAL BORDER CONTAINER: Image renders with clean drop shadow */}
                  <div className="relative w-full h-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                    <Image
                      src={`/credit-card-imgs/${card.file}`}
                      alt={card.name}
                      fill
                      sizes="(max-width: 768px) 270px, 380px"
                      priority={idx < 5}
                      className="object-contain mix-blend-multiply rounded-xl"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUBTLE STREAM COUNTER AT BOTTOM */}
          <div
            className="absolute bottom-8 z-20 flex items-center gap-3 text-xs font-mono text-neutral-400 pointer-events-none transition-opacity duration-300"
            style={{ opacity: isFinalMoment ? 0 : 0.85 }}
          >
            <span>STREAMING CARD</span>
            <span className="font-bold text-black font-sans text-sm">
              {String(Math.min(31, activeIndex + 1)).padStart(2, "0")}
            </span>
            <span>OF 31</span>
          </div>

          {/* FINAL REVEAL (CLEAN ROOM TO BREATHE) */}
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 transition-all duration-700 bg-white"
            style={{
              opacity: finalOpacity,
              pointerEvents: finalOpacity > 0.6 ? "auto" : "none",
              transform: `scale(${0.96 + finalOpacity * 0.04})`,
            }}
          >
            <div className="max-w-3xl space-y-6">
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-black leading-none">
                SO MANY CARDS.
              </h2>
              <p className="text-xl sm:text-3xl md:text-4xl font-medium text-neutral-600 tracking-tight">
                Which one is right for you?
              </p>

              <div className="pt-6">
                <Link
                  href="/recommend"
                  className="inline-flex items-center gap-2 rounded-[6px] bg-black text-[#DDF247] px-9 py-4 text-base font-bold uppercase tracking-wider hover:bg-neutral-800 hover:shadow-ramp transition-all duration-200"
                >
                  Find your card →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
