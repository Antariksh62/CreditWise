"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * CardFilters
 * ------------------------------------------------------------
 * Category filter rail for /cards. Uses URL parameters for shareability.
 * Styled as Stripe/Ramp rounded pill filters.
 */

const FILTERS = [
  { key: "all", label: "All cards" },
  { key: "cashback", label: "Cashback" },
  { key: "travel", label: "Travel" },
  { key: "rewards", label: "Rewards" },
  { key: "dining", label: "Dining" },
  { key: "fuel", label: "Fuel" },
  { key: "lifetime-free", label: "Lifetime free" },
];

export default function CardFilters() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "all";

  return (
    <nav aria-label="Filter cards by category" className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = active === filter.key;
        const href =
          filter.key === "all" ? "/cards" : `/cards?category=${filter.key}`;

        return (
          <Link
            key={filter.key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              isActive
                ? "bg-black text-white shadow-sm"
                : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-black"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
