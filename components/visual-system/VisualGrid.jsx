"use client";

/**
 * VisualGrid
 * Grid container providing Ramp-style generous proportions:
 * - 24-32px responsive gap (gap-6 lg:gap-8)
 * - Near full-width canvas
 * - Responsive column stacking:
 *     - 2-column: 1 column on mobile (<768px), 2 columns on tablet & desktop (>=768px)
 *     - 3-column: 1 column on mobile (<768px), 2 columns on tablet (>=768px with 3rd card centered/spanning), 3 columns on desktop (>=1024px)
 */
export default function VisualGrid({ columns = 2, children, className = "" }) {
  const colClass =
    columns === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 [&>*:last-child]:col-span-1 md:[&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1"
      : "grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8";

  return (
    <div className={`grid ${colClass} w-full ${className}`}>
      {children}
    </div>
  );
}
