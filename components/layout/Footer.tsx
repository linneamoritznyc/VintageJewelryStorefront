import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { RingMark } from "@/components/ui/RingMark";

export function Footer({ collections }: { collections: Collection[] }) {
  return (
    <footer className="mt-16 border-t border-sand bg-sand/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="flex items-center gap-1.5 font-display text-lg font-bold text-ink">
            <RingMark className="text-fuchsia-brand" size={20} />
            Fyndlådan
          </p>
          <p className="mt-2 max-w-xs text-sm text-plum-soft">
            Oanvända vintagesmycken från ett tömt lager. Aldrig burna, alltid
            långt under ursprungspris. Fynd så länge lagret räcker.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-ink">Handla</h4>
          <ul className="mt-3 space-y-2 text-sm text-plum-soft">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/kategori/${c.handle}`}
                  className="transition hover:text-fuchsia-brand"
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/paket" className="transition hover:text-fuchsia-brand">
                Skapa ditt paket
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-ink">Om oss</h4>
          <ul className="mt-3 space-y-2 text-sm text-plum-soft">
            <li>
              <Link href="/om-oss" className="transition hover:text-fuchsia-brand">
                Vår historia
              </Link>
            </li>
            <li>
              <Link
                href="/leverans"
                className="transition hover:text-fuchsia-brand"
              >
                Leverans &amp; retur
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-ink">Villkor</h4>
          <ul className="mt-3 space-y-2 text-sm text-plum-soft">
            <li>
              <Link href="/villkor" className="transition hover:text-fuchsia-brand">
                Köpvillkor
              </Link>
            </li>
            <li>
              <Link
                href="/integritet"
                className="transition hover:text-fuchsia-brand"
              >
                Integritetspolicy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand/80 px-4 py-4">
        <p className="mx-auto max-w-6xl text-center text-xs text-plum-soft/80">
          © {new Date().getFullYear()} Fyndlådan. Priser inkl. moms.
          Betalning och kassa hanteras säkert via Shopify.
        </p>
      </div>
    </footer>
  );
}
