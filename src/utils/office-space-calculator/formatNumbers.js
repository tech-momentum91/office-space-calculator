const compactNumberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/**
 * Format a number in compact notation (e.g. 15000 → "15k", 1200000 → "1.2m").
 * Uses lowercase k/m/b to match UI style.
 * Returns "—" for invalid/non-finite numbers.
 */
export function formatCompact(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return '—';
  return compactNumberFormatter.format(num).replace('K', 'k').replace('M', 'm').replace('B', 'b');
}
