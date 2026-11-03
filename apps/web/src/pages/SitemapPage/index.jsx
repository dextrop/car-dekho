import { Link } from 'react-router-dom';
import { Breadcrumbs, Panel } from '@carcompare/ui';
import { BRANDS, MODELS, VARIANTS, modelsOfBrand, brandSlug, formatINR, formatRange } from '@carcompare/data';
import { useSeo } from '../../lib/seo.js';

/** Human-readable sitemap: every brand, model and variant page. The XML version is /sitemap.xml. */
export default function SitemapPage() {
  useSeo();
  return (
    <>
      <Breadcrumbs linkAs={Link} items={[{ label: 'Search', to: '/' }, { label: 'Sitemap' }]} />
      <h1 className="page-title">Sitemap</h1>
      <p className="ui-muted" style={{ margin: '0 0 14px' }}>
        {BRANDS.length} brands · {MODELS.length} models · {VARIANTS.length} variants. Machine-readable version: <a href="/sitemap.xml">sitemap.xml</a>.
      </p>
      <Panel title="Pages">
        <ul className="sitemap-list">
          <li><Link to="/">Home / search</Link></li>
          <li><Link to="/compare">Compare variants</Link></li>
          <li><Link to="/sitemap">Sitemap</Link></li>
        </ul>
      </Panel>
      {BRANDS.map(b => (
        <Panel key={b} title={<Link to={`/${brandSlug(b)}`}>{b}</Link>} count={`${modelsOfBrand(b).length} models`}>
          <div className="sitemap-brand">
            {modelsOfBrand(b).map(m => (
              <details key={m.key} className="sitemap-model">
                <summary><Link to={`/${m.key}`}>{m.name}</Link> <span className="ui-muted">{formatRange(m.min, m.max)} · {m.variants.length} variants</span></summary>
                <ul className="sitemap-list">
                  {m.variants.map(v => (
                    <li key={v.id}><Link to={`/${m.key}/${v.slug}`}>{m.name} {v.name}</Link> <span className="ui-muted">{v.data.fuel_type} · {formatINR(v.price)}</span></li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </Panel>
      ))}
    </>
  );
}
