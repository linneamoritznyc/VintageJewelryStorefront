import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";
import { RingMark } from "@/components/ui/RingMark";

export function Footer({ collections }: { collections: Collection[] }) {
  return (
    <footer className="mt-16 border-t border-rule bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="flex items-center gap-1.5 font-display text-lg text-ink">
            <RingMark size={18} />
            Fyndlådan
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink-muted">
            Vintagesmycken från ett svenskt varuhus, i originalskick. Rakt ur
            lagret, ett exemplar av det mesta.
          </p>
        </div>

        <div>
          <h4 className="meta text-ink">Handla</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link href={`/kategori/${c.handle}`} className="transition hover:text-ink">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/paket" className="transition hover:text-ink">
                Skapa ditt paket
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="meta text-ink">Om oss</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/om-oss" className="transition hover:text-ink">
                Vår historia
              </Link>
            </li>
            <li>
              <Link href="/leverans" className="transition hover:text-ink">
                Leverans &amp; retur
              </Link>
            </li>
            <li>
              <Link href="/angra-kop" className="transition hover:text-ink">
                Ångra ditt köp
              </Link>
            </li>
            <li>
              <a
                href="https://shopify.com/102317621595/account"
                className="transition hover:text-ink"
              >
                Mitt konto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="meta text-ink">Villkor</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/villkor" className="transition hover:text-ink">
                Köpvillkor
              </Link>
            </li>
            <li>
              <Link href="/integritet" className="transition hover:text-ink">
                Integritetspolicy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rule px-4 py-4">
        <p className="mx-auto max-w-6xl text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} Fyndlådan. Priser inkl. moms.
          Betalning och kassa hanteras säkert via Shopify.
        </p>
      </div>
    </footer>
  );
}
