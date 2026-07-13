/**
 * Lot numbers: the inventory voice of the "Lagret" concept. Each piece came
 * out of a warehouse, so it gets a stable catalogue lot reference. Derived
 * deterministically from the product handle so it needs no stored data and is
 * identical on the grid, the product page and the cart. This is a catalogue
 * reference, not a claim about anything, so it is honest by construction.
 */
export function lotNumber(handle: string): string {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    hash = (hash * 31 + handle.charCodeAt(i)) >>> 0;
  }
  // 1..999, zero-padded to three digits.
  const n = (hash % 999) + 1;
  return String(n).padStart(3, "0");
}

/** Zero-pad a plain integer to three digits, e.g. 36 -> "036". */
export function padLot(n: number): string {
  return String(Math.max(0, n)).padStart(3, "0");
}
