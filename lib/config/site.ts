/**
 * Site-wide identity used by metadata, robots.txt, the sitemap and llms.txt.
 * `SITE_URL` must be the real production origin (no trailing slash) for
 * those to produce correct absolute URLs — set `NEXT_PUBLIC_SITE_URL` in
 * Vercel once the domain is live; falls back to the Vercel preview URL,
 * then localhost, so nothing breaks before that.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
  "http://localhost:3000";

export const SITE_NAME = "Fyndlådan";

export const SITE_DESCRIPTION =
  "Vintagesmycken från ett svenskt varuhus, i originalskick. Deadstock, ett exemplar av det mesta, direkt ur lagret.";
