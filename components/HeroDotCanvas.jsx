"use client";

import { useEffect, useRef } from "react";

/**
 * HeroDotCanvas
 * Continuous interactive dotted matrix background.
 * Begins directly at the supporting text line and extends down ~1 full page.
 * 
 * Features:
 * - Enlarged cursor-reactive gravitational black-hole with smooth fluid inertia
 * - Touch-device support: tracks touch position on tap/drag with graceful release
 * - Subtle ambient depth fallback on touch devices when idle
 * - Mobile performance optimizations:
 *     - Caps canvas DPR at max 2 (prevents battery drain on 3x retina phones)
 *     - Dynamic dot spacing (21px on mobile, 18px on desktop) for 60fps mobile rendering
 *     - Suspends animation loop when page is hidden (document.visibilityState)
 * - Respects prefers-reduced-motion
 */
export default function HeroDotCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let gap = 18;
    const baseRadius = 1.15;
    const maxRadius = 3.2;
    const eventHorizonRadius = 240;

    // Mouse / touch coordinates relative to canvas with smooth fluid inertia
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x DPR for mobile performance
      width = rect.width;
      height = rect.height;

      // Adjust grid density on mobile to maintain 60fps performance
      gap = width < 640 ? 21 : 18;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateTargetPosition = (clientX, clientY) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x >= -150 && x <= width + 150 && y >= -150 && y <= height + 150) {
        mouse.targetX = x;
        mouse.targetY = y;
      } else {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
      }
    };

    const handleMouseMove = (e) => {
      updateTargetPosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Touch event handlers for mobile & tablet
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        updateTargetPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updateTargetPosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Visibility change handler to pause render loop when tab is backgrounded
    let isPageVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && !prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);
    handleResize();

    let frameCount = 0;

    const render = () => {
      if (!isPageVisible) return;
      frameCount++;

      // Fluid inertia interpolation so the gravity field glides with cursor / touch
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const hasInteraction = mouse.x > -200 && mouse.y > -200;

      // Subtle ambient curvature for touch devices when idle (centered at 55% width, 35% height)
      const ambientX = width * 0.52;
      const ambientY = Math.min(height * 0.45, 340);
      const ambientReach = width < 640 ? 160 : 200;
      // Gentle breathing pulsation
      const ambientPulse = 0.5 + 0.5 * Math.sin(frameCount * 0.025);

      for (let i = 0; i < cols; i++) {
        const x0 = i * gap;
        for (let j = 0; j < rows; j++) {
          const y0 = j * gap;

          let renderX = x0;
          let renderY = y0;
          let radius = baseRadius;
          let alpha = 0.11; // Base calm dot opacity

          if (!prefersReducedMotion) {
            if (hasInteraction) {
              const dx = mouse.x - x0;
              const dy = mouse.y - y0;

              // Fast bounding box test
              if (Math.abs(dx) < eventHorizonRadius && Math.abs(dy) < eventHorizonRadius) {
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < eventHorizonRadius && dist > 0.05) {
                  const ux = dx / dist;
                  const uy = dy / dist;
                  const tx = -uy;
                  const ty = ux;

                  const factor = 1 - dist / eventHorizonRadius;
                  const pullFactor = Math.pow(factor, 1.9);

                  const pullAmount = pullFactor * 48;
                  const swirlAmount = pullFactor * 13;

                  renderX = x0 + ux * pullAmount + tx * swirlAmount;
                  renderY = y0 + uy * pullAmount + ty * swirlAmount;

                  radius = baseRadius + (maxRadius - baseRadius) * pullFactor;
                  alpha = 0.11 + 0.65 * pullFactor;
                }
              }
            } else {
              // Idle fallback: subtle static gravitational presence with calm breathing
              const dx = ambientX - x0;
              const dy = ambientY - y0;

              if (Math.abs(dx) < ambientReach && Math.abs(dy) < ambientReach) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < ambientReach && dist > 0.05) {
                  const factor = 1 - dist / ambientReach;
                  const pullFactor = Math.pow(factor, 2.2);
                  const pullAmount = pullFactor * (12 + 4 * ambientPulse);

                  renderX = x0 + (dx / dist) * pullAmount;
                  renderY = y0 + (dy / dist) * pullAmount;
                  radius = baseRadius + 0.6 * pullFactor;
                  alpha = 0.11 + 0.18 * pullFactor;
                }
              }
            }
          }

          ctx.beginPath();
          ctx.arc(renderX, renderY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0px, black 15px, black calc(100% - 180px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0px, black 15px, black calc(100% - 180px), transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}
