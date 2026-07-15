import type { Metadata, Viewport } from "next";
import { Cormorant } from "next/font/google";
import "./globals.css";

// One typeface, everywhere: headings, body, labels, prices, the wordmark.
// Weights 300/400/500 plus italics, per the brand design guide.
const cormorant = Cormorant({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
import { store } from "@/lib/shopify";
import { getSiteContent } from "@/lib/content";
import { CartProvider } from "@/lib/cart/CartContext";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { EmailPopup } from "@/components/marketing/EmailPopup";
import { JEWELRY_COLLECTION_HANDLES } from "@/lib/config/categories";
import { SITE_URL } from "@/lib/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fyndlådan, vintagesmycken i originalskick",
    template: "%s · Fyndlådan",
  },
  description:
    "Vintagesmycken från ett svenskt varuhus, i originalskick. Örhängen, halsband, armband och mer, ett exemplar av det mesta.",
  openGraph: {
    title: "Fyndlådan",
    description: "Vintagesmycken från ett svenskt varuhus, i originalskick.",
    locale: "sv_SE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F4EE",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Categories drive nav + footer; content drives the marketing surfaces.
  // Nav stays scoped to the four jewelry categories, keeping the accessory
  // and curated collections out of the primary nav clutter.
  const [allCollections, content] = await Promise.all([store.getCollections(), getSiteContent()]);
  const collections = allCollections.filter((c) => JEWELRY_COLLECTION_HANDLES.includes(c.handle));

  return (
    <html lang="sv" className={cormorant.variable}>
      <body>
        <CartProvider>
          <AnnouncementBanner content={content.announcement} />
          <Header collections={collections} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer collections={collections} />
          <CartDrawer />
          <EmailPopup content={content.emailPopup} />
        </CartProvider>
      </body>
    </html>
  );
}
