"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Check, CreditCard } from "lucide-react";
import MediaContainer from "./MediaContainer";

const LIFESTYLE_PROFILES = [
  {
    id: "everyday",
    title: "Everyday Living",
    spendPills: ["Groceries (Primary)", "Dining (Frequent)", "Daily Commute"],
    matchedCard: "HSBC Live+ Card",
    matchedImg: "/credit-card-imgs/hsbc-live-plus.png",
    perk: "10% Cashback on dining, groceries & food delivery",
  },
  {
    id: "online",
    title: "Online Shopper",
    spendPills: ["E-Commerce (Primary)", "Subscriptions", "Utility Bills"],
    matchedCard: "SBI Cashback Card",
    matchedImg: "/credit-card-imgs/sbi-cashback.png",
    perk: "5% Direct Cashback on almost all online platforms",
  },
  {
    id: "travel",
    title: "Travel & Flights",
    spendPills: ["Airlines (Regular)", "Hotel Stays", "Forex Purchases"],
    matchedCard: "Axis Atlas Card",
    matchedImg: "/credit-card-imgs/axis-magnus.png",
    perk: "5x Edge Miles on direct airlines & 12 lounge visits",
  },
];

/**
 * PersonalMatchingVisual
 * Large interactive visual for Section 5 (Asymmetric text + visual).
 * Demonstrates how personal spending habits map directly into the card that fits.
 */
export default function PersonalMatchingVisual() {
  const [selectedId, setSelectedId] = useState("everyday");
  const current = LIFESTYLE_PROFILES.find((p) => p.id === selectedId) || LIFESTYLE_PROFILES[0];

  return (
    <MediaContainer maskBottom={false} className="min-h-[360px] sm:min-h-[420px] p-6 sm:p-9">
      <div className="w-full max-w-md space-y-6">
        
        {/* INTERACTIVE LIFESTYLE TABS */}
        <div className="flex flex-wrap gap-2 justify-center border-b border-neutral-100 pb-4">
          {LIFESTYLE_PROFILES.map((profile) => {
            const isActive = profile.id === selectedId;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => setSelectedId(profile.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {profile.title}
              </button>
            );
          })}
        </div>

        {/* PROFILE SPEND PILLS */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400 font-bold">
            <span>Your Spending Pattern</span>
            <span className="w-2 h-2 rounded-full bg-[#DDF247]" />
          </div>

          <div className="flex flex-wrap gap-2">
            {current.spendPills.map((pill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-100 text-xs text-neutral-700 font-medium"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* MATCH RESULT SLIP */}
        <div className="bg-white rounded-2xl border-2 border-neutral-950 p-4 sm:p-5 shadow-sm flex items-center gap-4">
          <div className="relative w-14 h-9 sm:w-16 sm:h-10 rounded-md overflow-hidden bg-neutral-900 border border-neutral-300 shrink-0 shadow-2xs">
            <Image
              src={current.matchedImg}
              alt={current.matchedCard}
              fill
              className="object-contain p-0.5"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-950 truncate">
                {current.matchedCard}
              </h4>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold shrink-0">
                Exact Fit
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-snug">
              {current.perk}
            </p>
          </div>
        </div>

      </div>
    </MediaContainer>
  );
}
