import type { MetadataRoute } from "next";
import { store } from "@/lib/shopify";
import { SITE_URL } from "@/lib/config/site";
import { SYSTEM_COLLECTION_HANDLES } from "@/lib/config/navigation";

/**
 * Dynamic sitemap covering every crawlable URL: the static pages, all
 * collections, every product, and every blog article. This is the main lever
 * for getting the whole catalog indexed (and for sitelinks). Product/blog
 * fetches are wrapped so a transient Shopify hiccup degrades to the static
 * routes instead of failing the build.
 */

const STATIC_PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/paket", priority: 0.8, changeFrequency: "weekly" },
  { path: "/skapa-ditt-eget-paket", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blogg", priority: 0.7, changeFrequency: "weekly" },
  { path: "/om-oss", priority: 0.6, changeFrequency: "monthly" },
  { path: "/leverans", priority: 0.5, changeFrequency: "monthly" },
  { path: "/angerratt", priority: 0.5, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/kopvillkor", priority: 0.3, changeFrequency: "yearly" },
  { path: "/integritetspolicy", priority: 0.3, changeFrequency: "yearly" },
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
    const [collections, products, articles] = await Promise.all([
      store.getCollections(),
      store.getAllProducts(),
      store.getBlogArticles(),
    ]);

    for (const c of collections) {
      if ((SYSTEM_COLLECTION_HANDLES as readonly string[]).includes(c.handle)) continue;
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

    for (const a of articles) {
      entries.push({
        url: `${SITE_URL}/blogg/${a.handle}`,
        lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Shopify unavailable at build: ship the static routes rather than fail.
  }

  return entries;
}
