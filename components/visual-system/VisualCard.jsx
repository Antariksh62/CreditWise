"use client";

import ArrowButton from "./ArrowButton";

/**
 * VisualCard
 * Editorial product canvas component reproducing the Ramp reference layout.
 * Supports both 2-column feature canvases and 3-column pillar canvases.
 * 
 * Responsive behavior:
 * - Mobile: comfortable min-h-[480px] with p-5 padding to prevent cramped visuals
 * - Tablet & Desktop: min-h-[520px] / min-h-[550px] with p-7/p-8 generous whitespace
 * - Hover interaction stays calm and restrained
 */
export default function VisualCard({
  title,
  titlePart1,
  titlePart2,
  badge,
  href,
  onClick,
  ariaLabel,
  children,
  minHeight = "min-h-[480px] sm:min-h-[520px] lg:min-h-[550px]",
  className = "",
}) {
  return (
    <div
      className={`group relative rounded-xl lg:rounded-2xl border border-black/[0.08] bg-[#F6F6F4] flex flex-col justify-between overflow-hidden transition-colors duration-300 hover:border-black/[0.14] ${minHeight} w-full ${className}`}
    >
      {/* SUBTLE CARD BACKGROUND DOT MATRIX (FAINT DECORATIVE FIELD) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.22] transition-opacity duration-500 group-hover:opacity-[0.28]"
        style={{
          backgroundImage: "radial-gradient(#71717a 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(circle at 60% 40%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 60% 40%, black 20%, transparent 80%)",
        }}
      />

      {/* 1. TOP HEADER: EDITORIAL HEADLINE + ARROW BUTTON */}
      <div className="relative z-10 p-5 sm:p-7 lg:p-8 flex items-start justify-between gap-3 sm:gap-4">
        <div className="max-w-[260px] sm:max-w-[340px]">
          {badge && (
            <span className="inline-block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium mb-1.5">
              {badge}
            </span>
          )}

          <h3 className="text-xl sm:text-[25px] lg:text-[26px] font-normal leading-[1.2] tracking-tight">
            {titlePart1 && (
              <span className="text-neutral-950 font-normal sm:font-medium block">
                {titlePart1}
              </span>
            )}
            {titlePart2 && (
              <span className="text-neutral-400 font-normal block">
                {titlePart2}
              </span>
            )}
            {!titlePart1 && !titlePart2 && (
              <span className="text-neutral-950 font-normal sm:font-medium">
                {title}
              </span>
            )}
          </h3>
        </div>

        {(href || onClick) && (
          <ArrowButton
            href={href}
            onClick={onClick}
            ariaLabel={ariaLabel || (typeof title === "string" ? title : "Learn more")}
          />
        )}
      </div>

      {/* 2. LOWER REGION: EXPANSIVE MEDIA / VISUAL CANVAS (SUBTLE RESTRAINED HOVER) */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-end overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.012] group-hover:-translate-y-0.5">
        {children}
      </div>
    </div>
  );
}
