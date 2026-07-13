import { FREE_SHIPPING_THRESHOLD } from "@/lib/config/shipping";

/**
 * USP row: four true facts about the product and the terms, divided by
 * hairline rules. Mono labels in the inventory voice, custom line icons only
 * (no emoji, no generic icon set). All four statements are factual.
 */
const ICON = "h-6 w-6 stroke-ink";

function IconNever() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.25" className={ICON} aria-hidden>
      <path d="M4 8l8-4 8 4v8l-8 4-8-4V8z" strokeLinejoin="round" />
      <path d="M4 8l8 4 8-4M12 12v8" />
    </svg>
  );
}
function IconShip() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.25" className={ICON} aria-hidden>
      <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" strokeLinejoin="round" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </svg>
  );
}
function IconReturn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.25" className={ICON} aria-hidden>
      <path d="M4 9h11a5 5 0 010 10H8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5L3 9l4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconOne() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.25" className={ICON} aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M11 9l2-1v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UspRow() {
  const items = [
    { icon: <IconNever />, label: "Aldrig burna" },
    { icon: <IconShip />, label: `Fri frakt över ${FREE_SHIPPING_THRESHOLD} kr` },
    { icon: <IconReturn />, label: "14 dagars ångerrätt" },
    { icon: <IconOne />, label: "Ett exemplar av varje" },
  ];

  return (
    <section className="border-y border-rule">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 sm:grid-cols-4">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-4 py-5 sm:justify-center ${
              i > 0 ? "border-l border-rule" : ""
            } ${i === 2 ? "border-t border-rule sm:border-t-0" : ""} ${
              i === 3 ? "border-t border-rule sm:border-t-0" : ""
            }`}
          >
            {item.icon}
            <span className="meta text-ink-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
