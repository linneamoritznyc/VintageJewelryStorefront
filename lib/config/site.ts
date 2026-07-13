/**
 * Canonical site identity, single source for SEO/metadata, structured data,
 * the sitemap and robots. When the real .se domain is connected, set
 * NEXT_PUBLIC_SITE_URL in the environment and everything (canonicals, OG URLs,
 * sitemap, JSON-LD) follows automatically, no code change.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://vintage-jewelry-storefront.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Fyndlådan";

export const SITE_TAGLINE = "Vintage och second hand-smycken från svenska lager";

/**
 * Default meta description. Written for the search intent Fyndlådan wants to
 * win in Sweden (vintage / second hand / begagnade smycken) while staying
 * honest, no fabricated claims.
 */
export const SITE_DESCRIPTION =
  "Fyndlådan säljer vintage och second hand-smycken i Sverige: oanvända, aldrig burna örhängen, halsband, armband och ringar räddade ur tömda varuhuslager. Hållbar lyx från 69 kr, med 14 dagars ångerrätt.";

export const SITE_KEYWORDS = [
  "vintage smycken",
  "second hand smycken",
  "begagnade smycken",
  "deadstock smycken",
  "vintage örhängen",
  "vintage halsband",
  "vintage armband",
  "hållbara smycken",
  "smycken Sverige",
  "billiga vintagesmycken",
];

/** Absolute URL helper for canonicals, OG and JSON-LD. */
export function absoluteUrl(path = ""): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
