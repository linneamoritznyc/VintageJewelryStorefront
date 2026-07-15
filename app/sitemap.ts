import type { MetadataRoute } from "next";
import { store } from "@/lib/shopify";
import { SITE_URL } from "@/lib/config/site";

/**
 * Dynamic sitemap covering every crawlable URL: the static pages, every
 * collection, and every product. This is the main lever for getting the
 * whole catalog indexed (and for sitelinks). Product/collection fetches are
 * wrapped so a transient Shopify hiccup degrades to the static routes
 * instead of failing the build.
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((s) => ({
    url: `${SITE_URL}${s.path}`,
    lastModified: now,
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));

  try {
    const [collections, products] = await Promise.all([
      store.getCollections(),
      store.getAllProducts(),
    ]);

    for (const c of collections) {
      entries.push({
        url: `${SITE_URL}/kategori/${c.handle}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      });
    }

    for (const p of products) {
      entries.push({
        url: `${SITE_URL}/produkt/${p.handle}`,
        lastModified: p.createdAt ? new Date(p.createdAt) : now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    // Shopify unavailable at build: ship the static routes rather than fail.
  }

  return entries;
}
