/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // When real Shopify data is wired in, product images are served from the
    // Shopify CDN. Add the CDN host here so next/image can optimize them.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  async redirects() {
    return [
      // Canonical routes now match the real Shopify page handles.
      { source: "/villkor", destination: "/kopvillkor", permanent: true },
      { source: "/integritet", destination: "/integritetspolicy", permanent: true },
      // The Shopify content page for the bundle builder; the interactive
      // tool itself lives at /paket.
      { source: "/skapa-ditt-eget-paket", destination: "/paket", permanent: false },
    ];
  },
};

module.exports = nextConfig;
