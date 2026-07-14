import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vår historia",
  description:
    "Historien bakom Fyndlådan, vintagesmycken i originalskick från ett svenskt varuhus.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <h1 className="text-heading font-light text-ink">Vår historia</h1>
      <div className="mt-6 space-y-5 text-body text-ink-muted">
        <p>
          Ett svenskt varuhus lade ner. Kvar blev lådvis med örhängen, halsband
          och armband som aldrig hann ut i butik, i originalförpackning, i
          originalskick.
        </p>
        <p>
          Vi köpte hela partiet. Nu säljer vi det vidare, till fasta priser,
          precis som det låg i lagret.
        </p>
        <p className="text-ink">
          Det är den enda leveransen som kommer. När ett fynd är slut går det
          till någon annan.
        </p>
      </div>
      <Link
        href="/kategori/orhangen"
        className="mt-8 inline-block border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
      >
        Se hela lagret
      </Link>
    </div>
  );
}
