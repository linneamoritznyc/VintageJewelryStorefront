import type { StockStatus } from "@/lib/utils/stock";

/**
 * Honest low-stock note. Italic, sentence case, the same ink as everything
 * else, no separate "urgency" colour: the brand's one accent (olive) is
 * reserved for actions and active states, not for manufacturing pressure.
 */
export function StockBadge({
  status,
  className = "",
}: {
  status: StockStatus;
  className?: string;
}) {
  if (!status.label) return null;

  return <span className={`meta ${className}`}>{status.label}</span>;
}
