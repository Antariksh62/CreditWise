"use client";

import { useRef, useEffect } from "react";

/**
 * CreditCardVisual
 * ------------------------------------------------------------
 * Interactive 3D credit card presentation with holographic foil shift,
 * pointer-reactive specular highlight, and entry glare sweep over real
 * card artwork.
 *
 * Performance-optimized:
 * - Uses requestAnimationFrame for all coordinate updates
 * - Mutates CSS custom properties directly on the element (0 React re-renders)
 * - Uses passive pointer listeners and numeric coordinate storage
 * - No synchronous layout reads (avoiding layout reflows)
 * - Uses GPU-accelerated compositing layer (translateZ(0))
 * - Native lazy loading with async image decoding
 */

const MAX_X = 10; // Maximum tilt degrees along X axis
const MAX_Y = 12; // Maximum tilt degrees along Y axis

const HORIZONTAL_SIZES = {
  sm: "w-[240px]",
  md: "w-[320px]",
  lg: "w-[380px]",
};

const VERTICAL_SIZES = {
  sm: "h-[185px] w-auto",
  md: "h-[240px] w-auto",
  lg: "h-[300px] w-auto",
};

export default function CreditCardVisual({
  issuer = "CardWise",
  name = "Credit Card",
  image = null,
  orientation = "horizontal",
  size = "md",
  priority = false,
  className = "",
}) {
  const cardRef = useRef(null);
  const isVertical = orientation === "vertical";

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let rect = null;
    let frameId = 0;
    let clientX = 0;
    let clientY = 0;
    let isTracking = false;

    const paint = () => {
      frameId = 0;
      if (!isTracking || !rect) return;

      const px = (clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
      const py = (clientY - rect.top) / rect.height - 0.5; // -0.5 … 0.5

      card.style.setProperty("--cw-rx", (-py * MAX_X * 2).toFixed(2) + "deg");
      card.style.setProperty("--cw-ry", (px * MAX_Y * 2).toFixed(2) + "deg");
      card.style.setProperty("--cw-mx", ((px + 0.5) * 100).toFixed(1) + "%");
      card.style.setProperty("--cw-my", ((py + 0.5) * 100).toFixed(1) + "%");
    };

    const onPointerEnter = (e) => {
      if (e.pointerType === "touch") return;
      rect = card.getBoundingClientRect();
      isTracking = true;
      clientX = e.clientX;
      clientY = e.clientY;
      card.dataset.live = "";
      
      // Trigger sweep animation smoothly without forcing synchronous reflow
      card.removeAttribute("data-sweep");
      requestAnimationFrame(() => {
        if (card && isTracking) {
          card.dataset.sweep = "";
        }
      });
    };

    const onPointerMove = (e) => {
      if (e.pointerType === "touch" || !isTracking) return;
      clientX = e.clientX;
      clientY = e.clientY;

      if (!frameId) {
        frameId = requestAnimationFrame(paint);
      }
    };

    const reset = () => {
      isTracking = false;
      card.removeAttribute("data-live");
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      card.style.setProperty("--cw-rx", "0deg");
      card.style.setProperty("--cw-ry", "0deg");
      card.style.setProperty("--cw-mx", "50%");
      card.style.setProperty("--cw-my", "50%");
    };

    const onFocus = () => {
      card.removeAttribute("data-sweep");
      requestAnimationFrame(() => {
        if (card) card.dataset.sweep = "";
      });
    };

    card.addEventListener("pointerenter", onPointerEnter, { passive: true });
    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", reset, { passive: true });
    card.addEventListener("blur", reset, { passive: true });
    card.addEventListener("focus", onFocus, { passive: true });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      card.removeEventListener("pointerenter", onPointerEnter);
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", reset);
      card.removeEventListener("blur", reset);
      card.removeEventListener("focus", onFocus);
    };
  }, []);

  const sizeClass = isVertical
    ? VERTICAL_SIZES[size] || VERTICAL_SIZES.md
    : HORIZONTAL_SIZES[size] || HORIZONTAL_SIZES.md;

  const aspectClass = isVertical ? "aspect-[0.63/1]" : "aspect-[1.586/1]";

  return (
    <div
      className={`cw-card-scene relative max-w-full select-none ${className}`}
    >
      <div
        ref={cardRef}
        tabIndex={0}
        role="img"
        aria-label={`${issuer} ${name} Credit Card`}
        className={`cw-card-3d relative ${aspectClass} ${sizeClass} max-w-full shadow-card hover:shadow-card-hover bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800`}
      >
        {/* Layer 1: Verified Real Card Image */}
        {image ? (
          <img
            src={image}
            alt={`${issuer} ${name} Credit Card`}
            className="cw-card-3d__img"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs font-semibold text-neutral-300">
            {issuer} {name}
          </div>
        )}

        {/* Layer 2: Prismatic Foil Shimmer (color-dodge) */}
        <span className="cw-card-3d__foil" aria-hidden="true" />

        {/* Layer 3: Specular Highlight (overlay) */}
        <span className="cw-card-3d__spec" aria-hidden="true" />

        {/* Layer 4: Entry Glare Sweep */}
        <span className="cw-card-3d__glare" aria-hidden="true" />
      </div>
    </div>
  );
}
