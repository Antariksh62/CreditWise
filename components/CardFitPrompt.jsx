"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function CardFitPrompt({ card }) {
  const [hasProfile, setHasProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const rawProfile = window.localStorage.getItem("cardwise:profile");
      if (rawProfile) {
        const parsed = JSON.parse(rawProfile);
        const categories = parsed?.spending?.categories || {};
        const total =
          Number(parsed?.spending?.totalMonthly) ||
          Object.values(categories).reduce((s, v) => s + (Number(v) || 0), 0);
        if (total > 0 || Object.keys(categories).length > 0) {
          setHasProfile(true);
        }
      }
    } catch {
      setHasProfile(false);
    }
  }, []);

  const cardName = card?.name || "this card";
  const targetHref = hasProfile ? "/results" : "/onboarding";

  return (
    <div className="mt-8 rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="max-w-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
            <Sparkles className="h-3.5 w-3.5 text-neutral-800 shrink-0" />
            <span>Personalized Fit Evaluation</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900">
            Wondering if this card is right for your spending?
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Compare this card against other options based on the way you spend.
          </p>
          {mounted && hasProfile && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>Your spending profile is ready. Click to see how {cardName} scores against other options.</span>
            </div>
          )}
        </div>

        <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
          <Link
            href={targetHref}
            prefetch={true}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-neutral-800 shadow-xs"
          >
            <span>Check my card fit</span>
            <ArrowRight className="h-4 w-4 text-[#DDF247] shrink-0" />
          </Link>
          <span className="text-[11px] text-neutral-400 font-normal">
            {mounted && hasProfile ? "Reuses your saved spending" : "Takes ~2 minutes • No account required"}
          </span>
        </div>
      </div>
    </div>
  );
}
