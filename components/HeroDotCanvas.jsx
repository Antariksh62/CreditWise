"use client";

import { useEffect, useRef } from "react";

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

    // Grid config
    const gap = 16; // spacing between dots
    const baseRadius = 1.2;
    const maxRadius = 2.4;
    const eventHorizonRadius = 170; // Black hole gravitational reach
    const topFadeDistance = 140; // Pixels over which dots seamlessly fade in from top

    // Mouse coordinates relative to hero container
    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    // Reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      // Smooth fluid interpolation for black hole singularity focus
      mouse.x += (mouse.targetX - mouse.x) * 0.2;
      mouse.y += (mouse.targetY - mouse.y) * 0.2;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;

      const hasMouse = mouse.x > 0 && mouse.y > 0;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x0 = i * gap;
          const y0 = j * gap;

          // Top seamless opacity merge calculation
          let topFade = 1;
          if (y0 < topFadeDistance) {
            topFade = Math.pow(y0 / topFadeDistance, 1.8);
          }

          if (topFade <= 0.001) continue; // Skip invisible dots at very top edge

          let renderX = x0;
          let renderY = y0;
          let radius = baseRadius;
          let alpha = 0.12 * topFade;

          if (!prefersReducedMotion && hasMouse) {
            const dx = mouse.x - x0;
            const dy = mouse.y - y0;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < eventHorizonRadius && dist > 0.1) {
              // Normalized direction vector toward black hole center
              const ux = dx / dist;
              const uy = dy / dist;

              // Tangential vortex swirl vector
              const tx = -uy;
              const ty = ux;

              // Gravitational pull curve
              const factor = 1 - dist / eventHorizonRadius;
              const pullFactor = Math.pow(factor, 2.2);

              // Gravitational attraction displacement (pulls dots inward seamlessly)
              const pullAmount = pullFactor * 40;
              const swirlAmount = pullFactor * 12;

              renderX = x0 + ux * pullAmount + tx * swirlAmount;
              renderY = y0 + uy * pullAmount + ty * swirlAmount;

              radius = baseRadius + (maxRadius - baseRadius) * pullFactor;
              alpha = (0.12 + 0.35 * pullFactor) * topFade;
            }
          }

          ctx.beginPath();
          ctx.arc(renderX, renderY, radius, 0, Math.PI * 2);
          // Pure monochrome dark neutral dot fill — ZERO yellow or colored circles
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
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
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
        maskImage: "linear-gradient(to bottom, transparent 0%, black 140px)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 140px)",
      }}
      aria-hidden="true"
    />
  );
}
