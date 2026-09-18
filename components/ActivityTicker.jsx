"use client";

import { useState } from "react";
import Link from "next/link";

export default function ActivityTicker() {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-3 right-3 z-50 bg-black text-[#DDF247] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border border-neutral-800 shadow-lift flex items-center gap-2 hover:bg-neutral-900 transition-all"
        aria-label="Expand brand ticker"
      >
        <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
        CARDWISE ▲
      </button>
    );
  }

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-neutral-800 text-white py-2.5 px-4 text-xs font-mono">
      <div className="cw-container flex items-center justify-between gap-4">
        
        {/* BRAND SYSTEM TICKER TEXT */}
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 rounded bg-neutral-900 border border-neutral-800 text-[#DDF247] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DDF247]" />
            CARDWISE
          </span>

          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none text-xs font-bold tracking-wider uppercase text-neutral-300">
            <span className="text-white">SPEND OPTIMIZATION</span>
            <span className="text-[#DDF247]">•</span>
            <span className="text-white">DON&apos;T SPEND MORE</span>
            <span className="text-[#DDF247]">•</span>
            <span className="text-white">GET MORE BACK</span>
            <span className="text-[#DDF247]">•</span>
            <span className="text-neutral-400">CARDWISE</span>
            <span className="text-[#DDF247]">•</span>
            <span className="text-neutral-400">SPEND OPTIMIZATION</span>
            <span className="text-[#DDF247]">•</span>
            <span className="text-neutral-400">DON&apos;T SPEND MORE</span>
            <span className="text-[#DDF247]">•</span>
            <span className="text-neutral-400">GET MORE BACK</span>
          </div>
        </div>

        {/* QUICK LINK & DISMISS */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/recommend"
            className="hidden sm:inline-flex items-center gap-1 rounded bg-[#DDF247] text-black px-3 py-1 text-[11px] font-bold hover:bg-[#cee723] transition-all"
          >
            Find your card →
          </Link>
          <button
            onClick={() => setMinimized(true)}
            className="text-neutral-500 hover:text-white text-xs p-1 font-mono transition-colors"
            aria-label="Minimize ticker"
          >
            ✕
          </button>
        </div>

      </div>
    </aside>
  );
}

