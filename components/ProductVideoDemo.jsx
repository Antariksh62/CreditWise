"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CreditCardVisual from "./CreditCardVisual";

export default function ProductVideoDemo() {
  const [activeStep, setActiveStep] = useState(0); // 0: Select Category, 1: Calculating, 2: Matched Card Reveal
  const [selectedSpend, setSelectedSpend] = useState("online");
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play step sequence simulation like a product video
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full rounded-2xl border border-neutral-200 bg-white shadow-ramp overflow-hidden">
      {/* VIDEO / DEMO HEADER CONTROL BAR */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400 inline-block" />
          <span className="ml-2 font-sans font-semibold text-neutral-700 text-xs">
            cardwise.engine // match-demonstration
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 hover:text-black font-sans font-semibold transition-colors"
          >
            {isPlaying ? (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause demo
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play demo
              </>
            )}
          </button>
          <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] uppercase font-bold text-neutral-700">
            AUTOPLAY
          </span>
        </div>
      </div>

      {/* DEMO CANVAS CONTAINER WITH DOTTED BACKGROUND GRID */}
      <div className="relative bg-dotted p-6 sm:p-10 min-h-[420px] flex flex-col justify-center">
        {/* STEP 1: SPEND PREFERENCE INPUT */}
        {activeStep === 0 && (
          <div className="max-w-xl mx-auto w-full bg-white rounded-xl p-6 sm:p-8 border border-neutral-200 shadow-lift animate-cw-rise">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                STEP 1 OF 3 — SPEND PROFILE
              </span>
              <span className="text-xs font-mono text-neutral-500">₹40,000 / month</span>
            </div>
            <h4 className="text-xl font-bold text-black mb-4">
              Where do you spend the most every month?
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: "online", label: "Online Shopping", pct: "5.0% Cashback" },
                { id: "travel", label: "Flights & Hotels", pct: "Lounge & Miles" },
                { id: "dining", label: "Dining & Food", pct: "10% Rewards" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedSpend(opt.id);
                    setActiveStep(1);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedSpend === opt.id
                      ? "border-black bg-neutral-50 ring-2 ring-black"
                      : "border-neutral-200 hover:border-neutral-400 bg-white"
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-black">{opt.label}</div>
                  <div className="text-[11px] text-neutral-500">{opt.pct}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setActiveStep(1)}
              className="w-full py-2.5 bg-[#DDF247] text-black font-bold text-sm rounded-[6px] hover:bg-[#cee723] transition-colors"
            >
              Analyze 100+ Credit Cards →
            </button>
          </div>
        )}

        {/* STEP 2: REAL-TIME MATCHING ALGORITHM IN PROGRESS */}
        {activeStep === 1 && (
          <div className="max-w-md mx-auto w-full bg-black text-white rounded-xl p-8 border border-neutral-800 shadow-2xl text-center animate-cw-rise">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700 text-[#DDF247] font-bold text-lg mb-4 animate-spin">
              ⚡
            </div>
            <h4 className="text-xl font-bold text-white mb-2">
              Scoring Indian Card Database...
            </h4>
            <p className="text-xs text-neutral-400 mb-6">
              Calculating annual reward yield, lounge access value, and fee waivers for 100+ cards.
            </p>
            <div className="w-full bg-neutral-800 rounded-full h-2 mb-4 overflow-hidden">
              <div className="bg-[#DDF247] h-full rounded-full w-3/4 animate-pulse" />
            </div>
            <button
              onClick={() => setActiveStep(2)}
              className="text-xs text-[#DDF247] font-mono hover:underline"
            >
              Skip to result →
            </button>
          </div>
        )}

        {/* STEP 3: MATCHED CARD PRODUCT REVEAL */}
        {activeStep === 2 && (
          <div className="max-w-3xl mx-auto w-full bg-white rounded-xl p-6 sm:p-8 border border-neutral-200 shadow-lift animate-cw-rise grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 flex justify-center">
              <CreditCardVisual
                slug="sbi-cashback"
                title="SBI Cashback Credit Card"
                issuer="SBI Card"
                theme="emerald"
                size="md"
              />
            </div>

            <div className="md:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded bg-[#DDF247] px-2.5 py-1 text-xs font-extrabold text-black">
                ★ 96% CARDMATCH SCORE
              </div>
              <h3 className="text-2xl font-bold text-black leading-tight">
                SBI Cashback Credit Card
              </h3>
              <div className="border-t border-b border-neutral-200 py-3 my-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Est. Net Annual Value</span>
                  <span className="font-bold text-black">₹18,400 / yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Online Cashback Rate</span>
                  <span className="font-bold text-black">5% Flat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Annual Fee</span>
                  <span className="font-bold text-black">₹999 (Waived @ ₹2L)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/cards/sbi-cashback"
                  className="rounded-[6px] bg-black text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-800 transition-colors"
                >
                  View full analysis →
                </Link>
                <button
                  onClick={() => setActiveStep(0)}
                  className="text-xs text-neutral-500 hover:text-black font-semibold"
                >
                  Re-run demo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DEMO STEP INDICATORS FOOTER */}
      <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          {[
            { idx: 0, title: "01. Spend Input" },
            { idx: 1, title: "02. Algorithm Math" },
            { idx: 2, title: "03. Matched Reveal" },
          ].map((s) => (
            <button
              key={s.idx}
              onClick={() => setActiveStep(s.idx)}
              className={`font-mono font-semibold transition-colors ${
                activeStep === s.idx ? "text-black underline underline-offset-4" : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <span className="hidden sm:inline-block text-neutral-400 text-[11px]">
          CardWise Product Demonstration Canvas
        </span>
      </div>
    </div>
  );
}
