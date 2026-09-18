"use client";

import { Play } from "lucide-react";

export default function VideoSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-neutral-200/80">
      {/* SEAMLESS CONTINUOUS DOT GRID PATTERN */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(#d1d5db 1.2px, transparent 1.2px)",
          backgroundSize: "16px 16px"
        }}
      />

      {/* FULL RESPONSIVE 16:9 INTENTIONAL MEDIA CONTAINER */}
      <div className="cw-container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-[#FBFBFB] shadow-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:border-neutral-300 transition-all duration-300">
          
          {/* AMBIENT LIGHT */}
          <div className="absolute inset-0 bg-radial from-white via-white/50 to-transparent opacity-90 pointer-events-none" />

          {/* INNER HAIRLINE ACCENT */}
          <div className="absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl border border-neutral-100 pointer-events-none" />

          {/* MINIMAL TACTILE PLAY BUTTON */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-neutral-200/90 shadow-sm flex items-center justify-center group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-900 fill-neutral-900 ml-1 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* SUBTLE CORNER LABEL */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/90 border border-neutral-200/80 text-xs font-mono text-neutral-600 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
            <span>CardWise Overview</span>
          </div>
        </div>
      </div>
    </section>
  );
}
