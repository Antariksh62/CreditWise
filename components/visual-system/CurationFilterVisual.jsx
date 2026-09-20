"use client";

import { Check, X, ShieldCheck } from "lucide-react";

const CANDIDATES = [
  {
    name: "HDFC Millennia",
    category: "5% Online Partner Cashback",
    status: "Approved",
    pass: true,
  },
  {
    name: "SBI Cashback",
    category: "5% Direct Statement Credit",
    status: "Approved",
    pass: true,
  },
  {
    name: "HSBC Live+",
    category: "10% Dining & Groceries",
    status: "Approved",
    pass: true,
  },
  {
    name: "Generic Rewards Card",
    category: "0.5% Restricted Points",
    status: "Filtered Out",
    pass: false,
    faded: true,
  },
  {
    name: "High Fee Restrictive Card",
    category: "₹5L Waiver Threshold",
    status: "Filtered Out",
    pass: false,
    deepFaded: true,
  },
];

/**
 * CurationFilterVisual
 * Expansive curation ledger window modeled directly on Ramp's accounting table reference.
 * Visualizes candidate cards passing strict criteria while unsuitable options fade away.
 */
export default function CurationFilterVisual() {
  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[370px] flex flex-col items-center justify-end overflow-hidden select-none">
      
      {/* LEDGER WINDOW ANCHORED AT BOTTOM (RAMP SOFTWARE LEDGER STYLE) */}
      <div className="w-[94%] sm:w-[90%] bg-white rounded-t-xl border-t border-x border-black/[0.09] shadow-sm flex flex-col overflow-hidden">
        
        {/* WINDOW HEADER */}
        <div className="h-9 px-3.5 bg-neutral-50/90 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
          </div>

          <span className="text-[11px] font-mono text-neutral-400 font-medium">
            CardWise.CurationEngine
          </span>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-[10px] font-mono text-emerald-700 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>8 of 31 Passed</span>
          </div>
        </div>

        {/* LEDGER ROWS */}
        <div className="p-3.5 sm:p-4 space-y-2">
          
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium pb-1 border-b border-neutral-100">
            <span>Evaluated Card</span>
            <span>Standard Result</span>
          </div>

          {CANDIDATES.map((c, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs transition-all ${
                c.pass
                  ? "bg-neutral-50/70 border border-neutral-200/50"
                  : c.deepFaded
                  ? "opacity-30 border border-transparent line-through"
                  : "opacity-50 border border-transparent line-through"
              }`}
            >
              <div className="min-w-0 pr-2">
                <div
                  className={`font-medium truncate ${
                    c.pass ? "text-neutral-900" : "text-neutral-500"
                  }`}
                >
                  {c.name}
                </div>
                <div className="text-[10px] text-neutral-400 truncate">
                  {c.category}
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 flex items-center gap-1 ${
                  c.pass
                    ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {c.pass ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <X className="w-2.5 h-2.5" />
                )}
                {c.status}
              </span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
