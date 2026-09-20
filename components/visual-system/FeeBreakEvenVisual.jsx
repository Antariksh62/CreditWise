"use client";

import { useState } from "react";
import { CornerDownRight, CheckCircle2 } from "lucide-react";

const SPEND_TIERS = [
  { label: "₹15k/mo", spendAnnual: 180000, cashbackRate: 0.05, fee: 999 },
  { label: "₹25k/mo", spendAnnual: 300000, cashbackRate: 0.05, fee: 999 },
  { label: "₹40k/mo", spendAnnual: 480000, cashbackRate: 0.05, fee: 999 },
];

/**
 * FeeBreakEvenVisual
 * Large statement reconciliation window modeled directly on the Ramp invoice reference.
 * Displays line items for annual card fee recovery, cashback rewards, and net pocket value.
 */
export default function FeeBreakEvenVisual() {
  const [tierIdx, setTierIdx] = useState(1);
  const current = SPEND_TIERS[tierIdx];

  const annualCashback = current.spendAnnual * current.cashbackRate;
  const isWaived = current.spendAnnual >= 200000;
  const effectiveFee = isWaived ? 0 : current.fee;
  const netValue = annualCashback - effectiveFee;
  const breakEvenMonths = Math.ceil(current.fee / ((current.spendAnnual / 12) * current.cashbackRate));

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[360px] flex flex-col items-center justify-end overflow-hidden select-none">
      
      {/* 1. DOCUMENT WINDOW ANCHORED AT BOTTOM (RAMP INVOICE COMPOSITION) */}
      <div className="w-[94%] sm:w-[90%] bg-white rounded-t-xl sm:rounded-t-2xl border-t border-x border-black/[0.09] shadow-sm flex flex-col overflow-hidden">
        
        {/* WINDOW TITLEBAR */}
        <div className="h-9 px-3.5 bg-neutral-50/90 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
          </div>

          <span className="text-[11px] font-mono text-neutral-400 font-medium">
            CardWise.Reconciliation
          </span>

          <div className="w-6" />
        </div>

        {/* DOCUMENT BODY */}
        <div className="p-4 sm:p-5 space-y-3.5 sm:space-y-4">
          
          {/* HEADER & SPEND TOGGLE */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
            <div>
              <div className="text-sm font-semibold text-neutral-900 tracking-tight">
                Draft Statement #CW-14884
              </div>
              <div className="text-[11px] text-neutral-500 font-normal">
                Online Spending Recovery
              </div>
            </div>

            {/* Interactive Spend Selector */}
            <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-md">
              {SPEND_TIERS.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTierIdx(idx)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    idx === tierIdx
                      ? "bg-white text-black font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* LINE ITEMS */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              Line Items
            </div>

            {/* LINE ITEM 01: ANNUAL CARD FEE */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-400 mr-2 text-[11px]">01</span>
                <span className="font-medium text-neutral-800 flex-1">Annual Card Fee</span>
                <span className="font-mono text-neutral-900 font-medium px-2 py-0.5 bg-neutral-50 border border-neutral-200/80 rounded">
                  {isWaived ? "₹0.00" : `₹${current.fee}.00`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-5 text-[10px] text-neutral-500">
                <CornerDownRight className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="px-1.5 py-0.5 rounded bg-neutral-100/70 border border-neutral-200/60 font-mono">
                  {isWaived ? "Spend Waived at ₹2L" : "Standard Annual Fee"}
                </span>
              </div>
            </div>

            {/* LINE ITEM 02: CASHBACK REWARDS */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-neutral-400 mr-2 text-[11px]">02</span>
                <span className="font-medium text-neutral-800 flex-1">Online Cashback (5%)</span>
                <span className="font-mono text-emerald-600 font-semibold px-2 py-0.5 bg-emerald-50/70 border border-emerald-200/70 rounded">
                  +₹{annualCashback.toLocaleString("en-IN")}.00
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-5 text-[10px] text-neutral-500">
                <CornerDownRight className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="px-1.5 py-0.5 rounded bg-neutral-100/70 border border-neutral-200/60 font-mono">
                  From {current.label} everyday spending
                </span>
              </div>
            </div>

            {/* LINE ITEM 03: NET WALLET VALUE */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-neutral-950">Net Value Recovered</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 bg-[#e4f222]/20 px-2.5 py-1 rounded border border-[#e4f222]/40">
                +₹{netValue.toLocaleString("en-IN")}.00
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
