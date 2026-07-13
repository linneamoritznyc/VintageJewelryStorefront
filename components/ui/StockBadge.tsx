import type { StockStatus } from "@/lib/utils/stock";

/**
 * Scarcity indicator, mono uppercase. Renders nothing when there's nothing to
 * say. A real low-stock count is in --signal, the ONLY place red appears on a
 * card, because it is the one thing here that is genuinely, factually scarce.
 * Sold out is a plain fact, shown in --ink-faint, not signal (it's not scarce,
 * it's gone).
 */
export function StockBadge({
  status,
  className = "",
}: {
  status: StockStatus;
  className?: string;
}) {
  if (!status.label) return null;

  if (!status.inStock) {
    return (
      <span
        className={`font-mono text-[11px] uppercase tracking-meta text-ink-faint ${className}`}
      >
        Slut
      </span>
    );
  }

  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-meta text-signal ${className}`}
    >
      {status.quantity} kvar
    </span>
  );
}
