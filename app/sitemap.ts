import type { MetadataRoute } from "next";
import { store } from "@/lib/shopify";
import { SITE_URL } from "@/lib/config/site";

/**
 * Dynamic sitemap covering every crawlable URL: the static pages, every
 * collection, and every product, each in both locales (Swedish unprefixed,
 * English under /en) with an alternates.languages entry linking the two so
 * crawlers know they're translations of the same page, not duplicates.
 * Product/collection fetches are wrapped so a transient Shopify hiccup
 * degrades to the static routes instead of failing the build.
 */

const STATIC_PATHS: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/paket", priority: 0.8, changeFrequency: "weekly" },
  { path: "/om-oss", priority: 0.6, changeFrequency: "monthly" },
  { path: "/leverans", priority: 0.5, changeFrequency: "monthly" },
  { path: "/angra-kop", priority: 0.5, changeFrequency: "monthly" },
  { path: "/villkor", priority: 0.3, changeFrequency: "yearly" },
  { path: "/integritet", priority: 0.3, changeFrequency: "yearly" },
];

function localizedEntry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified: Date,
): MetadataRoute.Sitemap[number] {
  const svPath = path === "/" ? "" : path;
  return {
    url: `${SITE_URL}${svPath}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        sv: `${SITE_URL}${svPath}`,
        en: `${SITE_URL}/en${svPath}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((s) =>
    localizedEntry(s.path, s.priority, s.changeFrequency, now),
  );

  try {
    const [collections, products] = await Promise.all([
      store.getCollections(),
      store.getAllProducts(),
    ]);

    for (const c of collections) {
      entries.push(localizedEntry(`/kategori/${c.handle}`, 0.9, "daily", now));
    }

    for (const p of products) {
      entries.push(
        localizedEntry(
          `/produkt/${p.handle}`,
          0.8,
          "weekly",
          p.createdAt ? new Date(p.createdAt) : now,
        ),
      );
    }
  } catch {
    // Shopify unavailable at build: ship the static routes rather than fail.
  }

  return entries;
}
