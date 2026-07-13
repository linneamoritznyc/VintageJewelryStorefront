import type { StockStatus } from "@/lib/utils/stock";

/**
 * Stock indicator in the inventory voice. Only renders when there is something
 * true to say (genuinely low stock, or sold out). Low stock uses the red
 * signal, which is the ONLY place on the card red is allowed, because it is
 * factually scarce. Sold out is neutral ink. No sparkle, no manufactured
 * urgency: the scarcity is real.
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
        className={`meta inline-flex items-center bg-paper px-2 py-1 text-ink-muted ring-1 ring-rule ${className}`}
      >
        {status.label}
      </span>
    );
  }

  return (
    <span
      className={`meta inline-flex items-center bg-paper-raised px-2 py-1 font-medium text-signal ring-1 ring-signal/40 ${className}`}
    >
      {status.label}
    </span>
  );
}
