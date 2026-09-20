"use client";

import {
  Plane,
  Fuel,
  Globe,
  Utensils,
  Film,
  ShieldCheck,
  Zap,
  Car,
  ShoppingBag,
} from "lucide-react";

const PERKS_CLUSTER = [
  // Center / Hero perks
  { icon: Plane, label: "Lounge Visits", detail: "Domestic & Intl", hero: true },
  { icon: Fuel, label: "1% Fuel Waiver", detail: "All fuel pumps", hero: true },
  { icon: Globe, label: "0% Forex Fee", detail: "Zero markup", hero: true },
  { icon: Utensils, label: "Dining 15-20%", detail: "Partner tables", hero: true },

  // Surrounding perks
  { icon: Film, label: "Movie BOGO", detail: "BookMyShow", hero: false },
  { icon: ShieldCheck, label: "Travel Cover", detail: "₹1 Cr Protection", hero: false },
  { icon: Zap, label: "24/7 Concierge", detail: "Global booking", hero: false },
  { icon: ShoppingBag, label: "Purchase Shield", detail: "90-day cover", hero: false },
  { icon: Car, label: "Roadside Help", detail: "Pan-India assist", hero: false },
];

/**
 * PerksMosaicVisual
 * Expansive lifestyle perk constellation modeled directly on Ramp's 200+ Integrations reference.
 * Floats lifestyle benefits seamlessly across the canvas, dissolving softly into the card edges.
 */
export default function PerksMosaicVisual() {
  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[370px] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      
      {/* EXPANSIVE PERKS CONSTELLATION WITH RADIAL EDGE MASKING */}
      <div
        className="w-full max-w-[380px] grid grid-cols-3 gap-2.5 sm:gap-3 transition-all duration-300"
        style={{
          maskImage:
            "radial-gradient(ellipse at center, black 65%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 65%, transparent 100%)",
        }}
      >
        {PERKS_CLUSTER.map((perk, idx) => {
          const Icon = perk.icon;
          return (
            <div
              key={idx}
              className={`rounded-xl border p-2.5 sm:p-3 flex flex-col items-center justify-center text-center transition-all ${
                perk.hero
                  ? "bg-white border-black/[0.08] shadow-2xs text-neutral-900"
                  : "bg-white/80 border-black/[0.05] text-neutral-600 opacity-80 hover:opacity-100"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                  perk.hero ? "bg-neutral-100/90 text-neutral-900" : "bg-neutral-50 text-neutral-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.8} />
              </div>

              <span className="text-[11px] font-medium text-neutral-900 leading-tight">
                {perk.label}
              </span>
              <span className="text-[9px] font-mono text-neutral-400 mt-0.5">
                {perk.detail}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
