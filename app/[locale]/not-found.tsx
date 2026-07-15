import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-heading font-light text-ink">Fyndet är borta</h1>
      <p className="mt-2 text-body text-ink-muted">
        Sidan du letar efter finns inte, eller så är fyndet redan sålt. Fler fynd väntar i lagret.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block border border-accent bg-accent px-6 py-3 text-body text-bg transition hover:border-accent-hover hover:bg-accent-hover"
      >
        Tillbaka till startsidan
      </Link>
    </div>
  );
}
