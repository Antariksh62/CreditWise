"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * ArrowButton
 * Minimal square secondary navigation button.
 * Responds smoothly to card hover by translating the arrow slightly along its direction.
 * Touch optimized: includes a generous 44px+ hit area for comfortable mobile interaction.
 */
export default function ArrowButton({
  href,
  onClick,
  ariaLabel = "Learn more",
  className = "",
}) {
  const buttonContent = (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-md bg-white border border-black/10 text-neutral-600 transition-colors duration-200 group-hover:border-black/25 group-hover:text-neutral-950 hover:bg-neutral-50/80 active:scale-95 shrink-0 ${className}`}
    >
      <ArrowUpRight
        className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.75}
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel}
        className="inline-flex items-center justify-center p-1.5 -m-1.5 touch-manipulation shrink-0"
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cursor-pointer inline-flex items-center justify-center p-1.5 -m-1.5 touch-manipulation shrink-0"
    >
      {buttonContent}
    </button>
  );
}
