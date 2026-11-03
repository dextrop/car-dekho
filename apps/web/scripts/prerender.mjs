// Runs after `vite build`:
//  - writes dist/<route>/index.html for every page with that page's <title>, description and
//    keywords already in the HTML, so crawlers and view-source see them without running JavaScript;
//  - writes dist/sitemap.xml (every page) and dist/robots.txt pointing at it;
//  - writes dist/404.html (GitHub Pages serves it for unknown paths, so /nexon-style search URLs work).
// The site URL comes from VITE_SITE_URL, else from public/CNAME (GitHub Pages custom domain).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allRoutes, injectSeo, MODELS } from '@carcompare/data';

const web = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(web, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const cname = join(web, 'public', 'CNAME');
const siteUrl = (process.env.VITE_SITE_URL || (existsSync(cname) ? `https://${readFileSync(cname, 'utf8').trim()}` : '')).replace(/\/$/, '');

// 1. one HTML file per route
const routes = allRoutes();
for (const route of routes) {
  const file = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, injectSeo(template, route, siteUrl));
}
writeFileSync(join(dist, '404.html'), injectSeo(template, '/', siteUrl));

// 2. sitemap.xml + robots.txt
const lastmod = MODELS.reduce((d, m) => (m.data.data_as_of > d ? m.data.data_as_of : d), '') || new Date().toISOString().slice(0, 10);
const priority = r => (r === '/' ? '1.0' : r.split('/').length === 2 ? '0.8' : r.split('/').length === 3 ? '0.7' : '0.5');
const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(r => `  <url><loc>${siteUrl}${r === '/' ? '/' : r}</loc><lastmod>${lastmod}</lastmod><priority>${priority(r)}</priority></url>`),
  '</urlset>', ''].join('\n');
writeFileSync(join(dist, 'sitemap.xml'), xml);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`prerendered ${routes.length} routes, sitemap.xml, robots.txt and 404.html into ${dist} (site: ${siteUrl || 'relative'})`);
