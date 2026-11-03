import { Link, Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@carcompare/ui';
import { META, BRANDS, MODELS, VARIANTS } from '@carcompare/data';
import { useCompare } from '../store/compare.jsx';
import CompareTray from './CompareTray.jsx';

export default function Layout() {
  const { ids } = useCompare();
  const { pathname } = useLocation();
  return (
    <>
      <TopBar
        linkAs={Link}
        brand={<Link to="/" aria-label="Home"><span style={{ marginRight: 8 }}>🚗</span>Car-<em>Dekho</em></Link>}
        links={[
          { label: 'Search', to: '/', active: pathname === '/' },
          { label: 'Compare', to: '/compare', active: pathname === '/compare', badge: ids.length || null },
        ]}
      />
      <main className="ui-container">
        <Outlet />
      </main>
      <CompareTray hidden={pathname === '/compare'} />
      <footer className="footer">
        Prices are {META.priceType} in {META.currency} · data as of {META.dataAsOf} · {BRANDS.length} brands, {MODELS.length} models, {VARIANTS.length} variants
        <Link to="/sitemap">Sitemap</Link>
      </footer>
    </>
  );
}
