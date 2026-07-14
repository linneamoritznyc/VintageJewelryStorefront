/**
 * Labeled placeholder for editorial/hero imagery that isn't product
 * photography (so <ProductImage>'s mock-art system doesn't apply). Flat,
 * bordered, clearly marked as a placeholder, real photography drops straight
 * into these slots later with no layout change.
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
      className={`flex items-center justify-center border border-rule bg-paper-sunk ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="meta text-center text-ink-faint">{label}</span>
    </div>
  );
}
