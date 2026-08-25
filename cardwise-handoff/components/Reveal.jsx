"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal
 * ------------------------------------------------------------
 * Wraps children in a div that fades and rises 12px into view
 * the first time it enters the viewport. Uses IntersectionObserver
 * so nothing animates until the user actually scrolls to it.
 *
 * The motion itself lives in globals.css (.cw-reveal / .is-visible)
 * so `prefers-reduced-motion` can switch it off in one place.
 *
 * @param {number} delay  stagger in milliseconds
 * @param {string} as     element tag to render (default "div")
 */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the browser cannot observe, just show the content.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger via a timeout rather than a CSS delay so the
            // element does not sit invisible if it enters mid-scroll.
            window.setTimeout(() => el.classList.add("is-visible"), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`cw-reveal ${className}`}>
      {children}
    </Tag>
  );
}
