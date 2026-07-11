import type { StockStatus } from "@/lib/utils/stock";

/**
 * Scarcity/stock indicator. Only renders something when there's a message , 
 * low stock ("Endast 1 kvar") or sold out. Playful, not stressful.
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
        className={`inline-flex items-center gap-1 rounded-pill bg-ink/10 px-2.5 py-1 text-xs font-semibold text-ink/70 ${className}`}
      >
        {status.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill bg-gold-soft/60 px-2.5 py-1 text-xs font-bold text-plum ${className}`}
    >
      <span aria-hidden className="animate-sparkle">
        ✦
      </span>
      {status.label}
    </span>
  );
}
