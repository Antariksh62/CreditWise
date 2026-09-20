"use client";

import { ArrowDown, Coins, Sparkles, CheckCircle2 } from "lucide-react";

/**
 * PointsConverterVisual
 * Expansive value translation visual modeled directly on Ramp's Cash & Treasury reference.
 * Shows complex bank reward pitches translating into transparent, direct rupee reality.
 */
export default function PointsConverterVisual() {
  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[370px] flex flex-col items-center justify-end overflow-hidden select-none">
      
      {/* VALUE TRANSLATION WINDOW ANCHORED AT BOTTOM (RAMP CASH & TREASURY COMPOSITION) */}
      <div className="w-[94%] sm:w-[90%] bg-white rounded-t-xl border-t border-x border-black/[0.09] shadow-sm flex flex-col overflow-hidden">
        
        {/* WINDOW TITLEBAR */}
        <div className="h-9 px-3.5 bg-neutral-50/90 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
          </div>

          <span className="text-[11px] font-mono text-neutral-400 font-medium">
            CardWise.ValueStream
          </span>

          <div className="w-6" />
        </div>

        {/* WINDOW BODY */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* BANK MARKETING PITCH (CONVERTED) */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-medium">
                Bank Marketing Pitch
              </span>
              <span className="text-xs font-medium text-neutral-600 line-through">
                &quot;Earn 4 Reward Points per ₹150&quot;
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-100 shrink-0">
              Vague Math
            </span>
          </div>

          {/* FLOWING CONVERSION ARROW / WAVE */}
          <div className="flex items-center justify-center -my-1">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-mono font-medium shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#e4f222]" />
              <span>Translating to Rupee Reality</span>
              <ArrowDown className="w-3 h-3" />
            </div>
          </div>

          {/* DIRECT RUPEE RETURN HERO DISPLAY */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-neutral-50 to-white border border-neutral-200/80 shadow-2xs space-y-1 text-center">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              <Coins className="w-3 h-3" />
              Direct Rupee Reality
            </div>
            
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950 tracking-tight pt-0.5">
              ₹1.00 <span className="text-sm font-normal text-neutral-500 font-sans">back per ₹150</span>
            </div>

            <div className="text-[11px] text-neutral-500 font-normal">
              0.67% base rate vs 5% direct statement credit
            </div>
          </div>

          {/* BOTTOM STATEMENT APPROVAL SLIP */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-100 text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              10,000 Points = ₹2,500 Cash
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded font-semibold">
              Pure Value
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
