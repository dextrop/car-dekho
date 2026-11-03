// Builds the in-memory index over india_cars.json (models, variants, lookups).
import raw from './india_cars.json' with { type: 'json' };
import imageManifest from './images.json' with { type: 'json' };
import { normalizeText, slug } from './format.js';

export const META = {
  market: raw.market, currency: raw.currency, priceType: raw.price_type, dataAsOf: raw.data_as_of,
};

export const MODELS = [];
export const VARIANTS = [];
const VARIANT_BY_ID = new Map();
const MODEL_BY_KEY = new Map();

for (const b of raw.brands) {
  for (const m of b.models || []) {
    const key = `${slug(b.brand)}/${slug(m.model)}`;
    const model = {
      key, brand: b.brand, country: b.country_of_origin, data: m,
      name: m.model, body: m.body_type, segment: m.segment,
      fuels: m.fuel_options || [], seats: m.seating_capacity,
      min: m.current_price_range_inr?.min ?? null, max: m.current_price_range_inr?.max ?? null,
      variants: [],
    };
    const usedSlugs = new Set();
    (m.variants || []).forEach((v, i) => {
      // URL slug for /brand/model/<variant>; duplicates (same trim in petrol + CNG) get the fuel appended
      let vslug = slug(v.variant) || `variant-${i + 1}`;
      if (usedSlugs.has(vslug)) vslug = `${vslug}-${slug(v.fuel_type || '')}`;
      if (usedSlugs.has(vslug)) vslug = `${vslug}-${i + 1}`;
      usedSlugs.add(vslug);
      const variant = {
        id: `${key}/${i}`, idx: i, model, data: v, name: v.variant, price: v.ex_showroom_price_inr, slug: vslug,
        search: normalizeText([b.brand, m.model, v.variant, v.series, v.fuel_type, v.transmission, v.engine].filter(Boolean).join(' ')),
      };
      model.variants.push(variant);
      VARIANTS.push(variant);
      VARIANT_BY_ID.set(variant.id, variant);
    });
    const prices = model.variants.map(v => v.price).filter(p => typeof p === 'number');
    if (prices.length) { model.min = Math.min(...prices); model.max = Math.max(...prices); }
    model.search = normalizeText([b.brand, m.model, m.body_type, m.segment, ...model.fuels].join(' '));
    MODELS.push(model);
    MODEL_BY_KEY.set(key, model);
  }
}

export const BRANDS = raw.brands.map(b => b.brand);
export const BODY_TYPES = [...new Set(MODELS.map(m => m.body))].sort();
export const FUEL_TYPES = [...new Set(VARIANTS.map(v => v.data.fuel_type).filter(Boolean))].sort();

export const getModel = key => MODEL_BY_KEY.get(key) || null;
export const getVariantBySlug = (model, vslug) => model?.variants.find(v => v.slug === vslug) || null;
/** Brand by slug or name ("hyundai", "Hyundai", "maruti-suzuki"), or null. */
export const getBrand = s => { const k = slug(s || ''); return BRANDS.find(b => slug(b) === k) || null; };
export const brandSlug = brand => slug(brand);
export const modelsOfBrand = brand => MODELS.filter(m => m.brand === brand);
/** The brand's n most significant models: those with the widest variant line-ups. */
export const topModels = (brand, n = 3) => [...modelsOfBrand(brand)].sort((a, b) => b.variants.length - a.variants.length || a.name.localeCompare(b.name)).slice(0, n);
/**
 * A model's n headline trims, e.g. Creta -> SX, EX, S. Groups variants by trim level
 * (`series` when the data has it, else the variant name) and returns the most common ones.
 */
export function topVariants(model, n = 3) {
  const groups = new Map();
  for (const v of model.variants) {
    const label = v.data.series || v.name;
    const g = groups.get(label) || { name: label, count: 0, price: 0 };
    g.count += 1; g.price = Math.max(g.price, v.price || 0);
    groups.set(label, g);
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || b.price - a.price).slice(0, n);
}
/** Photos for a model (shared by all its variants): [{ file, thumb, title, author, license, license_url, page }]. */
export const getImages = key => imageManifest[key] || [];
export const getVariant = id => VARIANT_BY_ID.get(id) || null;
export const normalizeFeature = f => normalizeText(f);
