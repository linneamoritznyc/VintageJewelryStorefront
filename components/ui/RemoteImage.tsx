"use client";

import { useState } from "react";
import NextImage from "next/image";

/**
 * next/image for real (Shopify CDN) product photos, with graceful
 * degradation: if the source fails to load (real photography is still being
 * sourced, or a CDN hiccup), it falls back to a clean sunk-paper placeholder
 * rather than a broken-image icon. Keeps the catalogue looking intentional
 * during the pre-photography period.
 */
export function RemoteImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={`flex items-center justify-center bg-paper-sunk ${className}`}
        role="img"
        aria-label={alt || "Produktbild kommer snart"}
      >
        <span className="meta text-ink-faint/70">Bild kommer</span>
      </span>
    );
  }

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "100vw"}
        priority={priority}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
