"use client";

import { useState, useEffect } from "react";
import { Utensils, Fuel, Plane, CheckCircle2 } from "lucide-react";

const EXPENSE_RECEIPTS = [
  {
    id: 1,
    merchant: "Swiggy & Supermarkets",
    amount: "₹4,200",
    rewardText: "+₹420 (10% Cashback applied)",
    icon: Utensils,
    tag: "Everyday Dining",
  },
  {
    id: 2,
    merchant: "IndianOil Station",
    amount: "₹2,800",
    rewardText: "+₹28 (1% Surcharge Waived)",
    icon: Fuel,
    tag: "Daily Commute",
  },
  {
    id: 3,
    merchant: "MakeMyTrip Flights",
    amount: "₹6,500",
    rewardText: "+₹650 (Travel Points Credited)",
    icon: Plane,
    tag: "Domestic Travel",
  },
];

/**
 * ExpenseStreamVisual
 * Large visual canvas showing everyday expenses transforming into cashback
 * anchored over an expansive physical credit card, with subtle decorative curved dot tracks.
 */
export default function ExpenseStreamVisual() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % EXPENSE_RECEIPTS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const current = EXPENSE_RECEIPTS[activeIdx];
  const Icon = current.icon;

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[360px] flex flex-col items-center justify-end overflow-hidden select-none">
      
      {/* 1. DECORATIVE CURVED DOT FIELD (TRUE ROUND DOT TRACKS MATCHING RAMP REFERENCE) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="dotFade" cx="80%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#71717a" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#71717a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Dynamic sweeping curved circular dot streams */}
        <path
          d="M 280,-40 C 260,110 220,230 70,380"
          stroke="url(#dotFade)"
          strokeWidth="2.5"
          strokeDasharray="0 11"
          strokeLinecap="round"
        />
        <path
          d="M 320,-40 C 300,100 260,220 120,380"
          stroke="url(#dotFade)"
          strokeWidth="2.5"
          strokeDasharray="0 11"
          strokeLinecap="round"
        />
        <path
          d="M 360,-40 C 340,90 300,210 170,380"
          stroke="url(#dotFade)"
          strokeWidth="2.5"
          strokeDasharray="0 11"
          strokeLinecap="round"
        />
        <path
          d="M 400,-40 C 380,80 340,200 220,380"
          stroke="url(#dotFade)"
          strokeWidth="2.5"
          strokeDasharray="0 11"
          strokeLinecap="round"
        />
        <path
          d="M 440,-40 C 420,70 380,190 270,380"
          stroke="url(#dotFade)"
          strokeWidth="2.5"
          strokeDasharray="0 11"
          strokeLinecap="round"
        />
        <path
          d="M 480,-40 C 460,60 420,180 320,380"
          stroke="url(#dotFade)"
          strokeWidth="2.5"
          strokeDasharray="0 11"
          strokeLinecap="round"
        />
      </svg>

      {/* 2. FLOATING RECEIPT / NOTIFICATION PILL */}
      <div className="relative z-20 mb-5 sm:mb-6 w-[90%] max-w-[340px] transition-all duration-500 ease-out">
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-black/[0.09] p-3 sm:p-3.5 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-neutral-900 truncate">
                {current.amount} at {current.merchant}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{current.rewardText}</span>
              </div>
            </div>
          </div>

          <span className="w-2 h-2 rounded-full bg-[#e4f222] shrink-0" />
        </div>
      </div>

      {/* 3. LARGE PHYSICAL CREDIT CARD ANCHORED AT BOTTOM (RAMP SCALE) */}
      <div className="relative z-10 w-[92%] sm:w-[86%] max-w-[440px] h-[210px] sm:h-[240px] rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-br from-[#1c1c1f] via-[#121214] to-[#0a0a0c] border-t border-x border-neutral-700/60 shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden translate-y-3 sm:translate-y-2">
        
        {/* Subtle Card Surface Texture / Ripple Lines */}
        <div
          className="absolute -left-16 -top-16 w-64 h-64 rounded-full border border-white/[0.07] pointer-events-none"
          style={{
            boxShadow:
              "0 0 0 20px rgba(255,255,255,0.03), 0 0 0 40px rgba(255,255,255,0.02), 0 0 0 60px rgba(255,255,255,0.015)",
          }}
        />

        {/* Card Header: Brand + Status */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-white text-black font-extrabold text-[10px]">
              cw
            </div>
            <span className="text-white text-sm font-bold tracking-tight">
              cardwise
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-right">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-semibold">
              SIGNATURE
            </span>
          </div>
        </div>

        {/* EMV Chip & Contactless */}
        <div className="relative z-10 flex items-center gap-3 my-auto pt-2">
          {/* Metallic Chip */}
          <div className="w-10 h-7 rounded-sm bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-300 border border-amber-400/60 p-1 flex flex-col justify-between opacity-90 shadow-inner">
            <div className="h-[1px] bg-amber-600/30 w-full" />
            <div className="h-[1px] bg-amber-600/30 w-full" />
          </div>

          {/* Contactless waves */}
          <svg
            className="w-4 h-4 text-neutral-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8.5 16.5a5 5 0 0 1 0-9" />
            <path d="M12 19a8.5 8.5 0 0 0 0-14" />
          </svg>
        </div>

        {/* Card Bottom: Masked Number + Brand */}
        <div className="relative z-10 flex items-end justify-between pt-1">
          <div>
            <div className="text-[11px] font-mono tracking-widest text-neutral-400">
              •••• 4819
            </div>
            <div className="text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">
              PREFERRED MEMBER
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-4 w-4 rounded-full bg-red-500/80 -mr-1.5" />
            <div className="h-4 w-4 rounded-full bg-amber-400/80" />
          </div>
        </div>

      </div>

    </div>
  );
}
