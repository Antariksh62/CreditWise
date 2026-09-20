"use client";

import VideoVisual from "./visual-system/VideoVisual";

/**
 * VideoSection
 * Full-width responsive 16:9 media viewport matching the Ramp video architecture.
 * Ready to receive production video assets via VideoVisual.
 */
export default function VideoSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-neutral-200/80">
      {/* SEAMLESS CONTINUOUS DOT GRID PATTERN */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(#d1d5db 1.2px, transparent 1.2px)",
          backgroundSize: "16px 16px"
        }}
      />

      {/* FULL RESPONSIVE 16:9 INTENTIONAL MEDIA CONTAINER */}
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="relative w-full rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] shadow-sm overflow-hidden p-3 sm:p-4 hover:border-neutral-300 transition-all duration-300">
          <VideoVisual
            alt="CreditWise overview film"
            placeholderLabel="CreditWise in 60 seconds"
            aspectRatio="aspect-video"
          />
        </div>
      </div>
    </section>
  );
}
