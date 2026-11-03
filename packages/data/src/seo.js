// Title / description / keywords for every URL of the site. Pure function of the path, so the
// same rules run in the browser (useSeo), in the Vite dev server (transformIndexHtml) and in the
// build-time prerender that writes a static HTML file per route.
import { BRANDS, MODELS, VARIANTS, getBrand, getModel, getVariantBySlug, topModels, topVariants } from './catalog.js';
import { searchModels } from './search.js';
import { formatINR, formatRange, slug } from './format.js';

export const SITE_NAME = 'Car-Dekho';

const home = () => ({
  title: 'Car Prices, Variants & Compare India',
  description: `Search ${MODELS.length} models and ${VARIANTS.length} variants from ${BRANDS.length} brands in India. Variant-wise ex-showroom prices, features and side-by-side comparison.`,
  keywords: ['Car Compare', 'Compare Variants', ...BRANDS],
});

/** SEO fields for a pathname such as "/", "/hyundai", "/hyundai/creta/sx", "/nexon" or "/compare". */
export function seoForPath(pathname) {
  const parts = decodeURIComponent(pathname || '/').split('/').filter(Boolean);
  if (parts[0] === 'model') parts.shift();                      // legacy /model/<brand>/<model>
  if (parts.length === 0) return home();

  if (parts[0] === 'sitemap') return {
    title: 'Sitemap – All Brands, Models & Variants',
    description: `Every page on ${SITE_NAME}: ${BRANDS.length} brands, ${MODELS.length} models and ${VARIANTS.length} variants with prices.`,
    keywords: ['Sitemap', 'All Cars', 'All Car Variants', ...BRANDS],
  };
  if (parts[0] === 'compare') return {
    title: 'Compare Car Variants',
    description: 'Pick up to four variants from any cars and compare price, specs and features side by side.',
    keywords: ['Car Compare', 'Compare Variants', 'Compare Car Prices', 'Car Specs Comparison'],
  };

  if (parts.length === 1) {
    const brand = getBrand(parts[0]);
    if (brand) return {
      title: `${brand} Cars – Price, Variants & Compare`,
      description: `All ${brand} cars sold in India with variant-wise ex-showroom prices and features. Compare ${brand} variants side by side.`,
      keywords: [`All Variants of ${brand}`, `${brand} Car`, `${brand} Car Price`, `Compare ${brand} Car Variants`, ...topModels(brand).map(m => `${brand} ${m.name}`)],
    };
    const q = parts[0];
    const top = searchModels({ q, sort: 'relevance' }).slice(0, 3).map(r => `${r.model.brand} ${r.model.name}`);
    return {
      title: `${q} – Cars, Price & Variants`,
      description: `Search results for "${q}": models, variant prices and features. Compare variants side by side.`,
      keywords: [`${q} Car`, `${q} Price`, `Compare ${q} Variants`, ...top],
    };
  }

  const m = getModel(`${slug(parts[0])}/${slug(parts[1])}`);
  if (!m) return { title: 'Not found', description: '', keywords: [] };
  const full = `${m.brand} ${m.name}`;
  const base = [`All Variants of ${full}`, `${m.brand} Car`, `${full} Price`, `Compare ${m.name} Variants`, ...topVariants(m).map(t => `${m.name} ${t.name}`)];
  const v = parts[2] ? getVariantBySlug(m, slug(parts[2])) : null;
  if (v) return {
    title: `${full} ${v.name} – Price ${formatINR(v.price)}, Specs & Features`,
    description: `${full} ${v.name}: ex-showroom price ${formatINR(v.price)}, ${[v.data.fuel_type, v.data.transmission].filter(Boolean).join(' ')}. Full features list and comparison with other ${m.name} variants.`,
    keywords: [`${full} ${v.name}`, `${full} ${v.name} Price`, ...base],
  };
  return {
    title: `${full} – Price ${formatRange(m.min, m.max)}, Variants & Features`,
    description: `${full} price in India: ${formatRange(m.min, m.max)} ex-showroom. ${m.variants.length} variants with specs and features, compare any of them side by side.`,
    keywords: base,
  };
}

/** Every static route worth prerendering: home, compare, brands, models and variants. */
export function allRoutes() {
  const routes = ['/', '/compare', '/sitemap'];
  for (const b of BRANDS) routes.push(`/${slug(b)}`);
  for (const m of MODELS) {
    routes.push(`/${m.key}`);
    for (const v of m.variants) routes.push(`/${m.key}/${v.slug}`);
  }
  return routes;
}

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Inject title / description / keywords / Open Graph (and canonical when siteUrl is given) into an index.html string. */
export function injectSeo(html, pathname, siteUrl = '') {
  const seo = seoForPath(pathname);
  const title = seo.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME;
  const kw = seo.keywords.filter(Boolean).join(', ');
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="keywords" content="${escapeHtml(kw)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:type" content="website">`,
    siteUrl ? `<link rel="canonical" href="${escapeHtml(siteUrl.replace(/\/$/, '') + pathname)}">` : '',
  ].filter(Boolean).join('\n    ');
  return html
    .replace(/<title>[^<]*<\/title>\s*/i, '')
    .replace(/<meta name="(description|keywords)"[^>]*>\s*/gi, '')
    .replace(/<meta property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace('</head>', `    ${tags}\n  </head>`);
}
