import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoForPath, SITE_NAME } from '@carcompare/data';

function upsertMeta(attr, name, content) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

/**
 * Keeps <title>, description, keywords, Open Graph tags and the canonical URL in sync with the
 * current route during client-side navigation. The server / prerender already put the same tags
 * in the HTML, so view-source shows them too. Pass an override to replace the route defaults
 * (the compare page does this with the selected variants).
 */
export function useSeo(override) {
  const { pathname } = useLocation();
  const seo = override || seoForPath(pathname);
  const kw = seo.keywords.filter(Boolean).join(', ');
  useEffect(() => {
    const full = seo.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME;
    document.title = full;
    upsertMeta('name', 'description', seo.description || '');
    upsertMeta('name', 'keywords', kw);
    upsertMeta('property', 'og:title', full);
    upsertMeta('property', 'og:description', seo.description || '');
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', location.origin + pathname);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = location.origin + pathname;
  }, [seo.title, seo.description, kw, pathname]);
}
