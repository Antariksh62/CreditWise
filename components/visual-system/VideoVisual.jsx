"use client";

import MediaContainer from "./MediaContainer";

/**
 * VideoVisual
 * Streamlined video wrapper component utilizing the unified MediaContainer architecture.
 */
export default function VideoVisual({
  src,
  poster,
  alt = "Visual demonstration",
  className = "",
  placeholderLabel,
  aspectRatio = "aspect-video",
  mask = "none",
  objectFit = "cover",
  children,
}) {
  return (
    <MediaContainer
      videoSrc={src}
      poster={poster}
      imageAlt={alt}
      aspectRatio={aspectRatio}
      mask={mask}
      objectFit={objectFit}
      placeholderLabel={placeholderLabel}
      className={className}
    >
      {children}
    </MediaContainer>
  );
}
