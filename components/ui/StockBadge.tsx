import { useTranslations } from "next-intl";
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
  const t = useTranslations("stock");
  if (!status.labelKey) return null;

  const label =
    status.labelKey === "soldOut" ? t("soldOut") : t("lowStock", { count: status.quantity });

  return <span className={`meta ${className}`}>{label}</span>;
}
