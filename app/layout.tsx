import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display / headings, an editorial serif (not luxury-soft). Optical sizing off
// so headings read as catalogue type, not fashion masthead.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

// Interface, a clean grotesque for nav, buttons, body, forms.
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

// The inventory voice, mono for lot numbers, prices, stock counts, SKUs.
const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
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

export const metadata: Metadata = {
  title: {
    default: "Fyndlådan, oanvända vintagesmycken till fyndpris",
    template: "%s · Fyndlådan",
  },
  description:
    "Oanvända vintagesmycken från ett tömt lager. Aldrig burna, alltid långt under ursprungspris. Örhängen, halsband, armband och mer, fynd så länge lagret räcker.",
  openGraph: {
    title: "Fyndlådan",
    description:
      "Oanvända vintagesmycken från ett tömt lager. Fynd så länge lagret räcker.",
    locale: "sv_SE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F1EA",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Categories drive nav + footer; content drives the marketing surfaces.
  const [collections, content] = await Promise.all([
    store.getCollections(),
    getSiteContent(),
  ]);

  return (
    <html
      lang="sv"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
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
