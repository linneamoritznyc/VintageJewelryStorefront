"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Image as ShopImage } from "@/lib/shopify/types";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Product image gallery. Supports the ~2 images per product in the catalog but
 * scales to any number. Main image + thumbnail strip; mobile-first.
 */
export function ProductGallery({ images, title }: { images: ShopImage[]; title: string }) {
  const t = useTranslations("product");
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [];
  const current = safeImages[active] ?? safeImages[0];

  if (!current) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden border border-line bg-bg-tile">
        <ProductImage
          image={current}
          className="aspect-square h-full w-full"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t("showImage", { number: i + 1 })}
              aria-current={i === active}
              className={`h-16 w-16 overflow-hidden border transition sm:h-20 sm:w-20 ${
                i === active ? "border-ink" : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage image={img} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
      <p className="sr-only">{title}</p>
    </div>
  );
}
