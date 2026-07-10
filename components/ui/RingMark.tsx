/**
 * Fyndlådan ring emblem. The brand signature is a ring (a nod to jewelry and to
 * "fynd i lådan"). Kept as an inline SVG so it scales crisply and inherits
 * currentColor. Placeholder mark until a final logo exists.
 */
export function RingMark({
  className = "",
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="13" r="7.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.2 5.5 L12 1.8 L14.8 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="2.4" fill="currentColor" />
    </svg>
  );
}
