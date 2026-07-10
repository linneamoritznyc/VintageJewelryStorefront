import type { Image as ShopImage } from "@/lib/shopify/types";

/**
 * Renders a product image. During development, mock images use a `mock:seed:hue`
 * URL and are drawn as a deterministic gradient placeholder (no network needed,
 * stable between server and client render). When live, image URLs are real
 * Shopify CDN links and this component renders a normal <img> (swap to
 * next/image if desired).
 */

function parseMock(url: string): { seed: string; hue: number } | null {
  if (!url.startsWith("mock:")) return null;
  const [, seed, hueStr] = url.split(":");
  const hue = Number(hueStr);
  return { seed: seed ?? "x", hue: Number.isFinite(hue) ? hue : 320 };
}

/** Simple deterministic glyph pick so placeholders vary a little. */
const GLYPHS = ["◈", "❀", "✶", "◍", "✦", "❋", "◆", "✿"];
function glyphFor(seed: string): string {
  let sum = 0;
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i);
  return GLYPHS[sum % GLYPHS.length];
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
    const { hue, seed } = mock;
    const h2 = (hue + 40) % 360;
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 62% 82%), hsl(${h2} 55% 72%))`,
        }}
        role="img"
        aria-label={image.altText ?? "Produktbild"}
      >
        <span
          aria-hidden
          className="select-none text-6xl opacity-80 drop-shadow-sm"
          style={{ color: `hsl(${hue} 45% 32%)` }}
        >
          {glyphFor(seed)}
        </span>
        <span
          aria-hidden
          className="absolute right-3 top-3 text-lg opacity-70"
          style={{ color: `hsl(${h2} 45% 30%)` }}
        >
          ✧
        </span>
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
