"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * CardFilters
 * ------------------------------------------------------------
 * Category filter rail for /cards. Each filter is a real <Link>
 * that writes ?category=... into the URL, which means:
 *   - the filtered view is shareable and bookmarkable
 *   - the homepage category tiles link straight into it
 *   - the back button works
 *
 * Preferable to local state for exactly those reasons.
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
      <ul className="flex flex-wrap gap-2">
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
                    ? "inline-flex items-center rounded-btn border border-accent bg-accent px-4 py-2 text-[0.875rem] font-medium text-accent-foreground"
                    : "inline-flex items-center rounded-btn border border-border bg-surface px-4 py-2 text-[0.875rem] font-medium text-muted transition-colors duration-200 hover:border-foreground/25 hover:text-foreground"
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

/** Shared filtering rule, used by the /cards page. */
export function filterCards(cards, category) {
  if (!category || category === "all") return cards;
  return cards.filter(
    (card) => card.category === category || (card.tags || []).includes(category),
  );
}
