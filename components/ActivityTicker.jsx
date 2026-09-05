"use client";

import { useState } from "react";
import Link from "next/link";

export default function ActivityTicker() {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-3 right-3 z-40 bg-black text-white px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-ramp flex items-center gap-2 hover:bg-neutral-800 transition-all"
        aria-label="Expand live activity ticker"
      >
        <span className="h-2 w-2 rounded-full bg-[#DDF247] animate-pulse" />
        LIVE STATS ▲
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-ramp py-2 px-4 text-xs font-sans text-neutral-800">
      <div className="cw-container flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] bg-black text-[#DDF247] px-2 py-0.5 rounded">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DDF247] animate-pulse" />
            CARDWISE LIVE
          </span>

          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 text-xs">
            <span className="font-semibold text-neutral-900">
              100+ Cards Analyzed
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600">
              Top Yield: <strong className="text-black">₹18,400/yr</strong>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600">
              Zero Forex Fee Cards: <strong className="text-black">3 Verified</strong>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600">
              Average Match Time: <strong className="text-black">45 Seconds</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <Link
            href="/recommend"
            className="hidden sm:inline-block text-[11px] font-bold text-black hover:underline"
          >
            Find your match →
          </Link>
          <button
            onClick={() => setMinimized(true)}
            className="text-neutral-400 hover:text-black text-xs p-1"
            aria-label="Minimize ticker"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
