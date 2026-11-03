const trim2 = x => (Math.round(x * 100) / 100).toFixed(2).replace(/\.?0+$/, '');

/** 2499000 -> "₹24.99 L", 85000000 -> "₹8.5 Cr" */
export function formatINR(n) {
  if (typeof n !== 'number') return '—';
  if (n >= 1e7) return '₹' + trim2(n / 1e7) + ' Cr';
  if (n >= 1e5) return '₹' + trim2(n / 1e5) + ' L';
  return '₹' + n.toLocaleString('en-IN');
}
/** 2499000 -> "₹24,99,000" */
export function formatINRFull(n) { return typeof n === 'number' ? '₹' + n.toLocaleString('en-IN') : '—'; }

export function formatRange(min, max) {
  if (min == null && max == null) return 'Price N/A';
  if (min === max || max == null) return formatINR(min);
  return formatINR(min) + ' – ' + formatINR(max);
}
export const dash = v => (v === null || v === undefined || v === '') ? '—' : v;
export const normalizeText = s => String(s || '').toLowerCase().replace(/[^a-z0-9.+ ]+/g, ' ').replace(/\s+/g, ' ').trim();
export const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
