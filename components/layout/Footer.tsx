import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";

export function Footer({ collections }: { collections: Collection[] }) {
  return (
    <footer className="mt-16 border-t border-line bg-bg">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="wordmark text-ink">Fyndlådan</p>
        </div>

        <div>
          <h4 className="text-body italic text-ink-label">Handla</h4>
          <ul className="mt-3 space-y-2 text-body">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link href={`/kategori/${c.handle}`} className="text-ink-muted transition hover:text-ink">
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/paket" className="text-ink-muted transition hover:text-ink">
                Skapa ditt paket
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-body italic text-ink-label">Om oss</h4>
          <ul className="mt-3 space-y-2 text-body">
            <li>
              <Link href="/om-oss" className="text-ink-muted transition hover:text-ink">
                Vår historia
              </Link>
            </li>
            <li>
              <Link href="/leverans" className="text-ink-muted transition hover:text-ink">
                Leverans och retur
              </Link>
            </li>
            <li>
              <Link href="/angra-kop" className="text-ink-muted transition hover:text-ink">
                Ångra ditt köp
              </Link>
            </li>
            <li>
              <a
                href="https://shopify.com/102317621595/account"
                className="text-ink-muted transition hover:text-ink"
              >
                Mitt konto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-body italic text-ink-label">Villkor</h4>
          <ul className="mt-3 space-y-2 text-body">
            <li>
              <Link href="/villkor" className="text-ink-muted transition hover:text-ink">
                Köpvillkor
              </Link>
            </li>
            <li>
              <Link href="/integritet" className="text-ink-muted transition hover:text-ink">
                Integritetspolicy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-6 py-4">
        <p className="mx-auto max-w-6xl text-center text-small text-ink-muted">
          © {new Date().getFullYear()} Fyndlådan.
        </p>
      </div>
    </footer>
  );
}
