// Runs after `vite build`: writes dist/<route>/index.html for every page with that page's
// <title>, description and keywords already in the HTML, so crawlers and view-source see them
// without executing JavaScript. The React app then hydrates on top as usual.
// Set VITE_SITE_URL (e.g. https://car-dekho.example) to also emit canonical links.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { allRoutes, injectSeo } from '@carcompare/data';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const siteUrl = process.env.VITE_SITE_URL || '';
let n = 0;
for (const route of allRoutes()) {
  const html = injectSeo(template, route, siteUrl);
  const file = route === '/' ? join(dist, 'index.html') : join(dist, route, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  n++;
}
console.log(`prerendered ${n} routes into ${dist}`);
