"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const ack = window.localStorage.getItem("cardwise:cookie-notice-dismissed");
      if (!ack) {
        setDismissed(false);
      }
    } catch {
      setDismissed(true);
    }
  }, []);

  function handleDismiss() {
    try {
      window.localStorage.setItem("cardwise:cookie-notice-dismissed", "true");
    } catch {}
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <aside
      aria-label="Privacy and Local Storage Notice"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all sm:left-auto sm:right-6 sm:max-w-md"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-neutral-100 p-2 text-black shrink-0">
          <Cookie className="h-4 w-4" />
        </div>
        <div className="flex-1 text-xs text-neutral-600 leading-relaxed">
          <p className="font-bold text-neutral-900 mb-0.5">Privacy-First Experience</p>
          <p>
            CreditWise uses no third-party tracking cookies or advertising pixels. We use local browser storage exclusively for your card preferences and bookmarks.{" "}
            <Link href="/cookies" className="font-semibold text-black underline hover:text-neutral-700">
              Learn more
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 shrink-0 transition-colors"
        >
          Got it
        </button>
      </div>
    </aside>
  );
}