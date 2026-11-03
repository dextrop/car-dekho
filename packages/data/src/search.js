import { MODELS } from './catalog.js';
import { normalizeText } from './format.js';

export const BUDGETS = [
  { value: '0-500000', label: 'Under ₹5 L' },
  { value: '500000-1000000', label: '₹5–10 L' },
  { value: '1000000-1500000', label: '₹10–15 L' },
  { value: '1500000-2500000', label: '₹15–25 L' },
  { value: '2500000-5000000', label: '₹25–50 L' },
  { value: '5000000-10000000', label: '₹50 L–1 Cr' },
  { value: '10000000-Infinity', label: 'Above ₹1 Cr' },
];
export const SORTS = [
  { value: 'relevance', label: 'Sort: Relevance' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
];

/**
 * Search models. state: { q, brand, body, fuel, budget, sort }.
 * Returns [{ model, score, variants (matching filters), matchedVariants|null, min, max }].
 */
export function searchModels(state) {
  const tokens = normalizeText(state.q).split(' ').filter(Boolean);
  const [bmin, bmax] = state.budget ? state.budget.split('-').map(Number) : [null, null];
  const out = [];
  for (const m of MODELS) {
    if (state.brand && m.brand !== state.brand) continue;
    if (state.body && m.body !== state.body) continue;
    let vs = m.variants;
    if (state.fuel) vs = vs.filter(v => v.data.fuel_type === state.fuel);
    if (bmin !== null) vs = vs.filter(v => typeof v.price === 'number' && v.price >= bmin && v.price < bmax);
    if ((state.fuel || bmin !== null) && !vs.length) continue;

    let score = 0, matchedVariants = null;
    if (tokens.length) {
      if (tokens.every(t => m.search.includes(t))) {
        score = 10;
        const nm = normalizeText(m.name), nb = normalizeText(m.brand);
        for (const t of tokens) {
          if (nm === t) score += 20; else if (nm.startsWith(t)) score += 8; else if (nm.includes(t)) score += 4; else if (nb.startsWith(t)) score += 2;
        }
      } else {
        matchedVariants = vs.filter(v => tokens.every(t => v.search.includes(t)));
        if (!matchedVariants.length) continue;
        score = 5 + Math.min(matchedVariants.length, 5) * 0.2;
      }
    }
    const prices = vs.map(v => v.price).filter(p => typeof p === 'number');
    out.push({ model: m, score, variants: vs, matchedVariants, min: prices.length ? Math.min(...prices) : m.min, max: prices.length ? Math.max(...prices) : m.max });
  }
  const byName = (a, b) => (a.model.brand + a.model.name).localeCompare(b.model.brand + b.model.name);
  if (state.sort === 'price-asc') out.sort((a, b) => (a.min ?? 9e12) - (b.min ?? 9e12));
  else if (state.sort === 'price-desc') out.sort((a, b) => (b.max ?? -1) - (a.max ?? -1));
  else if (state.sort === 'name' || !tokens.length) out.sort(byName);
  else out.sort((a, b) => b.score - a.score || byName(a, b));
  return out;
}
