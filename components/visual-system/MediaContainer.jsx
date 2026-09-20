"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/**
 * MediaContainer
 * Unified, production-grade media architecture for CreditWise visual sections.
 * 
 * Capabilities:
 * - Direct support for MP4, WebM (or dual source arrays for optimal browser codec support)
 * - Static artwork & high-res PNG/JPG images
 * - React-rendered interactive components & overlay UI
 * - Fully configurable masking: 'bottom' | 'radial' | 'edges' | 'top-bottom' | 'none'
 * - Restrained, smooth loading fade-in
 * - Strict video standards: autoplay, muted, loop, playsInline, preload="metadata", no controls
 * - Keeps CreditWise text, numbers, and live card UI rendered by React over the media
 */
export default function MediaContainer({
  videoSrc,
  videoSources, // optional array: [{ src: '/videos/example.webm', type: 'video/webm' }, ...]
  poster,
  imageSrc,
  imageAlt = "Visual media",
  children,
  aspectRatio = "aspect-auto",
  objectFit = "cover", // 'cover' | 'contain' | 'fill'
  mask = "none", // 'none' | 'bottom' | 'radial' | 'edges' | 'top-bottom' | 'custom'
  maskCustom,
  background = "bg-transparent",
  blur = false,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "metadata",
  controls = false,
  className = "",
  placeholderLabel,
}) {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && (videoSrc || videoSources)) {
      videoRef.current.play().catch(() => {
        // Browser autoplay policy graceful fallback
      });
    }
  }, [videoSrc, videoSources]);

  // Compute CSS mask style based on prop
  const getMaskStyle = () => {
    if (maskCustom) {
      return {
        WebkitMaskImage: maskCustom,
        maskImage: maskCustom,
      };
    }
    switch (mask) {
      case "bottom":
        return {
          WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
        };
      case "radial":
        return {
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 50%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 50%, transparent 100%)",
        };
      case "edges":
        return {
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        };
      case "top-bottom":
        return {
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        };
      case "none":
      default:
        return undefined;
    }
  };

  const hasVideo = Boolean(videoSrc || (videoSources && videoSources.length > 0));
  const hasImage = Boolean(imageSrc);

  return (
    <div
      className={`relative w-full ${aspectRatio} ${background} overflow-hidden flex flex-col items-center justify-center ${className}`}
      style={getMaskStyle()}
    >
      {/* 1. VIDEO LAYER (MP4 / WebM) */}
      {hasVideo && (
        <video
          ref={videoRef}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          preload={preload}
          controls={controls}
          onLoadedData={() => setIsMediaLoaded(true)}
          className={`absolute inset-0 w-full h-full ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } transition-opacity duration-700 ease-out ${
            isMediaLoaded ? "opacity-100" : "opacity-0"
          } ${blur ? "blur-xs" : ""}`}
          aria-label={imageAlt}
        >
          {videoSources ? (
            videoSources.map((v, i) => (
              <source key={i} src={v.src} type={v.type} />
            ))
          ) : (
            <source src={videoSrc} type={videoSrc?.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          )}
        </video>
      )}

      {/* 2. IMAGE LAYER (STATIC ARTWORK / GENERATED ASSETS) */}
      {!hasVideo && hasImage && (
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            isMediaLoaded ? "opacity-100" : "opacity-0"
          } ${blur ? "blur-xs" : ""}`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={objectFit === "contain" ? "object-contain" : "object-cover"}
            onLoad={() => setIsMediaLoaded(true)}
            priority={false}
          />
        </div>
      )}

      {/* 3. OPTIONAL CLEAN PLACEHOLDER (ONLY WHEN MEDIA IS PENDING) */}
      {!hasVideo && !hasImage && placeholderLabel && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/5 border border-black/10 text-xs font-mono text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e4f222]" />
            <span>{placeholderLabel}</span>
          </div>
        </div>
      )}

      {/* 4. REACT UI OVERLAY LAYER (EXACT NUMBERS, LABELS, BADGES, AND CARDS) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
