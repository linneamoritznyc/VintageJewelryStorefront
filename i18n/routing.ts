import { defineRouting } from "next-intl/routing";

/**
 * Supported locales. Swedish stays unprefixed (`localePrefix: "as-needed"`)
 * so every existing URL (/, /paket, /kategori/orhangen, ...) keeps working
 * unchanged for the default market; English lives under /en/... .
 */
export const routing = defineRouting({
  locales: ["sv", "en"],
  defaultLocale: "sv",
  localePrefix: "as-needed",
});
