import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import SearchPage from './pages/SearchPage/index.jsx';
import ModelPage from './pages/ModelPage/index.jsx';
import ComparePage from './pages/ComparePage/index.jsx';
import SitemapPage from './pages/SitemapPage/index.jsx';

/** Old /model/<brand>/<model> links keep working. */
function LegacyModelRedirect() {
  const { brand, model, variant } = useParams();
  return <Navigate to={`/${brand}/${model}${variant ? `/${variant}` : ''}`} replace />;
}

/*
 * URL scheme:
 *   /                          search (home)
 *   /<query>                   search results, e.g. /nexon
 *   /<brand>                   brand page, e.g. /hyundai
 *   /<brand>/<model>           model page, e.g. /hyundai/creta
 *   /<brand>/<model>/<variant> model page with that variant opened, e.g. /hyundai/creta/sx
 *   /compare                   compare selected variants
 *   /sitemap                   HTML sitemap (sitemap.xml is generated at build time)
 */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path=":q?" element={<SearchPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="sitemap" element={<SitemapPage />} />
        <Route path="model/:brand/:model/:variant?" element={<LegacyModelRedirect />} />
        <Route path=":brand/:model/:variant?" element={<ModelPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
