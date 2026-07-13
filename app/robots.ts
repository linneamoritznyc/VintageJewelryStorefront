import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config/site";

/**
 * robots.txt. The whole storefront is public and we WANT it crawled, by
 * classic search engines and by AI answer engines (ChatGPT/SearchGPT, Claude,
 * Perplexity, Gemini/Google AI Overviews, Applebot). They're listed
 * explicitly so intent is unambiguous; each is allowed full access. Only the
 * API and Next internals are disallowed.
 *
 * Google's AI features (AI Overviews, Gemini grounding) read content gated by
 * the "Google-Extended" token, so it is explicitly allowed here.
 */
const AI_AND_SEARCH_BOTS = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (classic + AI)
  "Googlebot",
  "Google-Extended",
  // Microsoft / Bing (powers Copilot)
  "bingbot",
  // Apple (Siri / Apple Intelligence)
  "Applebot",
  "Applebot-Extended",
  // Common Crawl (training corpus for many LLMs)
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/kassa"] },
      ...AI_AND_SEARCH_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
