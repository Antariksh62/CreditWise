"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * CardFilters
 * ------------------------------------------------------------
 * Category filter rail for /cards. Uses URL parameters for shareability.
 * Styled as Stripe rounded pill filters.
 */

const FILTERS = [
  { key: "all", label: "All cards" },
  { key: "cashback", label: "Cashback" },
  { key: "travel", label: "Travel" },
  { key: "rewards", label: "Rewards" },
  { key: "fuel", label: "Fuel" },
  { key: "lifetime-free", label: "Lifetime free" },
];

export default function CardFilters() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "all";

  return (
    <nav aria-label="Filter cards by category" className="mb-10">
      <ul className="flex flex-wrap gap-2.5">
        {FILTERS.map((filter) => {
          const isActive = active === filter.key;
          const href = filter.key === "all" ? "/cards" : `/cards?category=${filter.key}`;

          return (
            <li key={filter.key}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "inline-flex items-center rounded-full border border-accent bg-accent px-4 py-2 text-[0.875rem] font-semibold text-white shadow-sm"
                    : "inline-flex items-center rounded-full border border-border bg-surface px-4 py-2 text-[0.875rem] font-semibold text-muted transition-all duration-200 hover:border-accent/40 hover:bg-accent-soft/50 hover:text-foreground"
                }
              >
                {filter.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

