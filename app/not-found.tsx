import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <span aria-hidden className="text-6xl">
        🔍
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-ink">
        Fyndet gömmer sig
      </h1>
      <p className="mt-2 text-plum-soft">
        Sidan du letar efter finns inte – eller så är fyndet redan sålt. Men det
        finns fler skatter att hitta.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-pill bg-fuchsia-brand px-6 py-3 font-bold text-white transition hover:bg-fuchsia-deep"
      >
        Tillbaka till startsidan
      </Link>
    </div>
  );
}
