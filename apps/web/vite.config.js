import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { injectSeo } from '@carcompare/data';

/** Dev server: put the right <title>/<meta keywords> for the requested URL into index.html. */
function seoHtml() {
  return {
    name: 'car-dekho-seo-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const url = ctx.originalUrl || ctx.path || '/';
        const pathname = url.split('?')[0];
        return injectSeo(html, pathname.startsWith('/index.html') ? '/' : pathname, process.env.VITE_SITE_URL || '');
      },
    },
    /** `vite preview`: serve the prerendered dist/<route>/index.html before the SPA fallback kicks in
     *  (static hosts such as Netlify, Vercel or nginx `try_files $uri $uri/ /index.html` do this natively). */
    configurePreviewServer(server) {
      const dist = server.config.build.outDir;
      server.middlewares.use((req, res, next) => {
        const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
        if (req.method !== 'GET' || /\.[a-z0-9]+$/i.test(pathname)) return next();
        const file = join(dist, pathname, 'index.html');
        const root = join(dist, 'index.html');
        if (!existsSync(root)) return next();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        // prerendered page if there is one; otherwise (search URLs like /nexon) inject the tags on the fly
        res.end(existsSync(file) ? readFileSync(file) : injectSeo(readFileSync(root, 'utf8'), pathname, process.env.VITE_SITE_URL || ''));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), seoHtml()],
  base: '/',
  // The ui/data workspaces ship raw JSX/ESM, so let Vite compile them too.
  optimizeDeps: { exclude: ['@carcompare/ui', '@carcompare/data'] },
  build: { chunkSizeWarningLimit: 6000 },
});
