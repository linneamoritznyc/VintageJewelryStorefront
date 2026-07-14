/**
 * Labeled placeholder for editorial imagery not yet backed by real product
 * photography. Flat warm-grey block, italic caption, clearly marked as a
 * placeholder. Production uses real photos from the Shopify CDN; this exists
 * only for surfaces without a photo yet (e.g. hero/story blocks pending a
 * shoot).
 */
export function ArchivePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-bg-panel ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="text-body italic text-placeholder">{label}</span>
    </div>
  );
}
