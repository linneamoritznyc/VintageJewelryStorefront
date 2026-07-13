import type { Metadata } from "next";
import { AngraForm } from "./AngraForm";

export const metadata: Metadata = {
  title: "Ångra ditt köp",
  description:
    "Ångra ditt köp inom 14 dagar. Ordernummer och e-post räcker, ingen inloggning krävs.",
};

export default function AngraKopPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Ångra ditt köp</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">
        Du har fjorton dagar på dig att ångra ett köp. Fyll i ordernummer och
        mejladress, så tar vi hand om resten. Ingen inloggning, ingen kontakt
        med kundtjänst krävs.
      </p>
      <AngraForm />
    </div>
  );
}
