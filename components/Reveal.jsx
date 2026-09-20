"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal
 * ------------------------------------------------------------
 * Viewport-based entrance reveal component for CreditWise sections.
 * Makes the page feel like ONE continuous visual story:
 * - Headings quietly fade and translate 14px upward into position
 * - Large visuals and cards reveal progressively with subtle clarity transition
 * - Decorative elements appear gradually
 * - Preserves 100% normal browser scrolling (no scroll-jacking)
 * - Complies with `prefers-reduced-motion` in globals.css
 *
 * @param {number} delay      stagger delay in milliseconds
 * @param {string} as         HTML element tag to render (default "div")
 * @param {string} variant    "default" | "visual" | "fade"
 * @param {string} className  additional Tailwind classes
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  variant = "default",
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the browser cannot observe, reveal immediately
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(() => {
                if (el) el.classList.add("is-visible");
              }, delay);
            } else {
              el.classList.add("is-visible");
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const baseClass =
    variant === "visual"
      ? "cw-reveal-visual"
      : variant === "fade"
      ? "cw-reveal-fade"
      : "cw-reveal";

  return (
    <Tag ref={ref} className={`${baseClass} ${className}`}>
      {children}
    </Tag>
  );
}
