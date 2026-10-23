"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight, AlertTriangle } from "lucide-react";

/**
 * Global Error Boundary
 * ------------------------------------------------------------
 * Graceful error recovery for unexpected runtime exceptions.
 * Disclaims that local preferences remain intact and provides
 * a one-click reset action.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error locally for development diagnosis
    console.error("CreditWise runtime error caught by boundary:", error);
  }, [error]);

  return (
    <div className="cw-rail min-h-[70vh] flex items-center justify-center bg-[#FBFBFB]">
      <div className="cw-container py-16 max-w-lg mx-auto text-center px-4">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-xs">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 border border-amber-200 text-amber-800">
            <AlertTriangle className="h-6 w-6 text-amber-700" />
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
            Application Recovery
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Something went wrong
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 max-w-sm mx-auto leading-relaxed">
            We encountered an unexpected issue while rendering this page. Your saved cards and local preferences are safe.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:border-black hover:text-black transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
