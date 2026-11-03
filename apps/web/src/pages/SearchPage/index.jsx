import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Chip, ChipGroup, EmptyState, Kbd, SearchInput } from '@carcompare/ui';
import { BRANDS, MODELS, VARIANTS, META, searchModels, getBrand, brandSlug } from '@carcompare/data';
import { useSeo } from '../../lib/seo.js';
import Filters from './Filters.jsx';
import ModelCard from './ModelCard.jsx';

const DEFAULT_FILTERS = { body: '', fuel: '', budget: '', sort: 'relevance' };

/** URL for a search: "nexon ev" -> "/nexon%20ev", a brand -> "/hyundai", "" -> "/". */
export const searchPath = query => {
  if (!query) return '/';
  const brand = getBrand(query);
  return brand ? `/${brandSlug(brand)}` : `/${encodeURIComponent(query)}`;
};

/**
 * Initial screen: search box, brand chips, filters and the model result grid.
 * Routes: "/" (home), "/<query>" (search results) and "/<brand>" (brand page).
 */
export default function SearchPage() {
  const { q: pathQ = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const legacyQ = params.get('q');
  const brand = getBrand(pathQ);                 // "/hyundai" -> "Hyundai", else null
  const q = legacyQ ?? (brand ? '' : pathQ);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  // Old-style /?q=nexon links are redirected to /nexon; brand pages canonicalise to their slug (/Hyundai -> /hyundai).
  useEffect(() => {
    if (legacyQ !== null) navigate(searchPath(legacyQ), { replace: true });
    else if (brand && pathQ !== brandSlug(brand)) navigate(`/${brandSlug(brand)}`, { replace: true });
  }, [legacyQ, brand, pathQ, navigate]);

  const setQ = value => navigate(searchPath(value), { replace: true });
  const pickBrand = b => navigate(brand === b ? '/' : `/${brandSlug(b)}`);
  const results = useMemo(() => searchModels({ q, brand: brand || '', ...filters }), [q, brand, filters]);
  const activeFilters = ['body', 'fuel', 'budget'].filter(k => filters[k]).length;
  const openTop = () => { if (results[0]) navigate(`/${results[0].model.key}`); };

  useSeo();   // title / keywords come from seoForPath(pathname) in @carcompare/data

  const heading = brand ? `${brand}: ${results.length} model${results.length === 1 ? '' : 's'}`
    : q ? `${results.length} result${results.length === 1 ? '' : 's'} for “${q}”`
    : activeFilters ? `${results.length} models match your filters` : 'All models';

  return (
    <>
      <section className={`hero ${q || brand ? 'compact' : ''}`}>
        <h1>{brand ? `${brand} cars` : 'Find your next car'}</h1>
        <p>Search {MODELS.length} models and {VARIANTS.length} variants from {BRANDS.length} brands. Ex-showroom prices, as of {META.dataAsOf}.</p>
        <SearchInput ref={inputRef} value={q} onChange={setQ} onEnter={openTop} aria-label="Search cars"
          placeholder={brand ? `Search within ${brand} or any car…` : 'Try “Creta”, “Nexon EV”, “Maruti CNG”, “diesel automatic SUV”…'} />
        <div className="stats">
          <span><b>{BRANDS.length}</b> brands</span><span><b>{MODELS.length}</b> models</span><span><b>{VARIANTS.length}</b> variants</span>
          <span>Press <Kbd>Enter</Kbd> to open top result</span>
        </div>
        <ChipGroup>
          {BRANDS.map(b => <Chip key={b} active={brand === b} onClick={() => pickBrand(b)}>{b}</Chip>)}
        </ChipGroup>
      </section>

      <Filters value={filters} onChange={setFilters} />

      <div className="results-head">
        <h2>{heading}</h2>
        {results.length > 0 && <span className="ui-muted">Open a model to see variants, prices and features</span>}
      </div>

      {results.length === 0 ? (
        <EmptyState title="No cars found.">Try a shorter name, a different spelling, or clear the filters.</EmptyState>
      ) : (
        <div className="grid">
          {results.slice(0, 200).map(r => <ModelCard key={r.model.key} result={r} />)}
        </div>
      )}
    </>
  );
}
