import type { Image as ShopImage } from "@/lib/shopify/types";
import { JewelryArt } from "./jewelryArt";

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
    const { art } = mock;
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-bg-tile ${className}`}
        role="img"
        aria-label={image.altText ?? "Produktbild"}
      >
        <div className="h-[68%] w-[68%] opacity-80">
          <JewelryArt art={art} hue={80} metal="gold" />
        </div>
      </div>
    );
  }

  // Live image path.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={image.altText ?? ""}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      className={`object-cover ${className}`}
      width={image.width}
      height={image.height}
    />
  );
}
