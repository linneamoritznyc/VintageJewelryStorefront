import type { Product, Collection, BlogArticle } from "@/lib/shopify/types";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/config/site";

/**
 * Builders for schema.org JSON-LD. Kept out of the page components so each page
 * just picks the schema it needs. Only real, honest facts go in here (prices,
 * availability, the actual 14-day return policy), no invented ratings or
 * fake "was" prices.
 */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Only real http(s) images (mock placeholder URLs use a "mock:" scheme). */
function realImages(urls: string[]): string[] {
  return urls.filter((u) => /^https?:\/\//.test(u));
}

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/icon.svg"),
    email: "hej@fyndladan.se",
    areaServed: { "@type": "Country", name: "Sweden" },
    currenciesAccepted: "SEK",
    slogan: "Skattjakt bland vintagesmycken",
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "sv-SE",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(
  crumbs: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function productSchema(
  product: Product,
  categoryTitle?: string,
): Record<string, unknown> {
  const url = absoluteUrl(`/produkt/${product.handle}`);
  const price = product.priceRange.minVariantPrice.amount;
  const currency = product.priceRange.minVariantPrice.currencyCode;
  const images = realImages(product.images.map((i) => i.url));
  const sku = product.variants[0]?.sku || product.variants[0]?.id;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.title,
    description: product.description || product.vintageBlurb || product.title,
    ...(images.length ? { image: images } : {}),
    ...(sku ? { sku } : {}),
    brand: { "@type": "Brand", name: product.vendor || SITE_NAME },
    ...(categoryTitle ? { category: categoryTitle } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price,
      // Never-worn deadstock: honest condition is "new/unused".
      itemCondition: "https://schema.org/NewCondition",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": ORG_ID },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "SE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFees",
      },
    },
  };
}

export function collectionSchema(
  collection: Collection,
  products: Product[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(`/kategori/${collection.handle}`)}#collection`,
    name: collection.title,
    description: collection.description || SITE_DESCRIPTION,
    url: absoluteUrl(`/kategori/${collection.handle}`),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/produkt/${p.handle}`),
        name: p.title,
      })),
    },
  };
}

export function articleSchema(article: BlogArticle): Record<string, unknown> {
  const url = absoluteUrl(`/blogg/${article.handle}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    url,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: "sv-SE",
    author: { "@type": "Organization", name: SITE_NAME, "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}
