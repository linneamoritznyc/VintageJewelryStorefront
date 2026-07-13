import type { Image as ShopImage } from "@/lib/shopify/types";
import { JewelryArt } from "./jewelryArt";
import { RemoteImage } from "./RemoteImage";

/**
 * Renders a product image. During development, mock images use a `mock:art:hue`
 * URL and are drawn as a jewelry illustration (see jewelryArt) on a tinted
 * gradient, no network needed, stable between server and client render. When
 * live, image URLs are real Shopify CDN links and this component renders a
 * normal <img> (swap to next/image if desired).
 */

function parseMock(url: string): { art: string; hue: number } | null {
  if (!url.startsWith("mock:")) return null;
  const [, art, hueStr] = url.split(":");
  const hue = Number(hueStr);
  return { art: art ?? "ring-pearl", hue: Number.isFinite(hue) ? hue : 320 };
}

export function ProductImage({
  image,
  className = "",
  sizes,
  priority,
}: {
  image: ShopImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const mock = parseMock(image.url);

  if (mock) {
    const { hue, art } = mock;
    const h2 = (hue + 40) % 360;
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 58% 90%), hsl(${h2} 48% 82%))`,
        }}
        role="img"
        aria-label={image.altText ?? "Produktbild"}
      >
        <div className="h-[72%] w-[72%]">
          <JewelryArt art={art} hue={hue} />
        </div>
        <span
          aria-hidden
          className="absolute right-3 top-3 text-sm opacity-50"
          style={{ color: `hsl(${h2} 45% 35%)` }}
        >
          ✧
        </span>
      </div>
    );
  }

  // Live image path: next/image optimizes the Shopify CDN source (AVIF/WebP,
  // responsive sizes, lazy below the fold), with a clean fallback if the photo
  // is missing or blocked.
  return (
    <RemoteImage
      src={image.url}
      alt={image.altText ?? ""}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
