const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // When real Shopify data is wired in, product images are served from the
    // Shopify CDN. Add the CDN host here so next/image can optimize them.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

module.exports = withNextIntl(nextConfig);
