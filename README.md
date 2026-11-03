# Car-Dekho — React

React version of the car search and compare site, organised as an npm-workspaces monorepo:

```
react-app/
├─ apps/web/                 the website (Vite + React + React Router)
│  └─ src/
│     ├─ pages/              one folder per page/view
│     │  ├─ SearchPage/      index.jsx, Filters.jsx, ModelCard.jsx
│     │  ├─ ModelPage/       index.jsx, VariantTable.jsx, VariantDetail.jsx
│     │  └─ ComparePage/     index.jsx, CompareTable.jsx
│     ├─ components/         app-level chrome (Layout, CompareTray)
│     ├─ lib/img.js          resolves photo paths from the manifest to URLs
│     ├─ store/compare.jsx   compare selection (React context + localStorage)
│     ├─ App.jsx             routes
│     └─ main.jsx            entry
├─ packages/ui/              @carcompare/ui — shared React UI module
│  └─ src/
│     ├─ components/         Button, Tag, Chip, Card, Panel, KeyValue, Select,
│     │                      SearchInput, Checkbox, Breadcrumbs, EmptyState, Timeline,
│     │                      FeatureList, Note, Kbd, Toolbar, TopBar, Tray, Toast,
│     │                      Thumb (ratio image + placeholder), Gallery (photo carousel)
│     ├─ styles.css          design tokens (light/dark) + component styles
│     └─ index.js            public exports
└─ packages/data/            @carcompare/data — framework-agnostic data layer
   └─ src/
      ├─ india_cars.json     dataset (copy of ../india_cars.json)
      ├─ images.json         photo manifest (copy of ../images/manifest.json)
      ├─ catalog.js          builds the model/variant index and lookups
      ├─ search.js           searchModels(), BUDGETS, SORTS
      ├─ specs.js            SPEC_ROWS shared by variant detail and compare
      └─ format.js           formatINR, formatRange, slug, normalizeText
```

## Run

Requires Node 18+.

```bash
cd react-app
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in apps/web/dist
npm run preview    # serve the production bundle
```

## Update the data

Edit `../india_cars.json` and/or refetch photos with `python3 ../fetch-images.py`, then copy
both into the data package:

```bash
npm run sync-data
```

## Photos

`apps/web/public/images` is a symlink to the shared `../images` folder, so the dev server and
the production build serve the same files as the vanilla site. `getImages(modelKey)` from
`@carcompare/data` returns the manifest entries; `lib/img.js` turns them into URLs and the
`Gallery` / `Thumb` components from `@carcompare/ui` display them with the Commons credit.

## How the modules fit together

- **Pages** (`apps/web/src/pages/*`) hold only page logic and layout. They import
  visual building blocks from `@carcompare/ui` and data from `@carcompare/data`.
- **`@carcompare/ui`** contains every reusable visual component plus the global
  stylesheet. Components are router-agnostic: pass `as={Link}` / `linkAs={Link}`
  to make them navigate. Import styles once with `import '@carcompare/ui/styles.css'`.
- **`@carcompare/data`** has no React dependency, so search and formatting can be
  reused in tests, scripts, or a server.
- **Compare selection** lives in `store/compare.jsx` (`useCompare()`), persisted
  to localStorage, capped at 4 variants.

## Routes

| Route | Page |
|---|---|
| `/` | Search (initial screen) |
| `/<query>` e.g. `/nexon` | Search results; `/?q=nexon` redirects here |
| `/<brand>` e.g. `/hyundai` | Brand page: all models of that brand |
| `/<brand>/<model>` e.g. `/hyundai/creta` | Model detail with variants |
| `/<brand>/<model>/<variant>` e.g. `/hyundai/creta/sx` | Model page with that variant expanded; opening a row updates the URL |
| `/compare` | Side-by-side compare |
| `/model/<brand>/<model>` | Legacy, redirects to `/<brand>/<model>` |

### Page keywords / SEO

Every URL gets its own `<title>`, `<meta name="description">`, `<meta name="keywords">` and
Open Graph tags, visible in **view-source** (not only in the DOM):

- The rules live in one place, `seoForPath(pathname)` in `packages/data/src/seo.js`.
- **Dev server**: a small Vite plugin (`seoHtml` in `vite.config.js`) injects the tags for the
  requested URL into `index.html`, so `curl http://localhost:5173/hyundai/creta` already shows them.
- **Build**: `npm run build` runs `scripts/prerender.mjs`, which writes
  `dist/<route>/index.html` for every page (home, compare, 14 brands, 130 models, ~1500
  variants) with the tags baked in. `npm run preview` and static hosts (Netlify, Vercel,
  nginx `try_files $uri $uri/ /index.html`) serve `/hyundai/creta` from that folder.
- **In the browser**: the `useSeo` hook keeps the tags in sync during client-side navigation.
- Set `VITE_SITE_URL=https://your-domain` when building to also emit `<link rel="canonical">`.
- Search-result URLs such as `/nexon` are not prerendered (unbounded); they get their tags from
  the dev plugin or from the browser hook.

| Page | Keywords |
|---|---|
| Home `/` | Car Compare, Compare Variants, then every brand name |
| Brand `/hyundai` | All Variants of Hyundai, Hyundai Car, Hyundai Car Price, Compare Hyundai Car Variants, top 3 Hyundai models (by variant count) |
| Model `/hyundai/creta` | All Variants of Hyundai Creta, Hyundai Car, Hyundai Creta Price, Compare Creta Variants, top 3 Creta trim levels |
| Variant `/hyundai/creta/sx` | Hyundai Creta SX, Hyundai Creta SX Price, then the model keywords |
| Search `/nexon` | nexon Car, nexon Price, Compare nexon Variants, top 3 matching models |
| Compare | Car Compare, Compare Variants, Compare <model> Variants, each selected variant, "A vs B" |

Clean URLs (BrowserRouter). The dev server and `npm run preview` already serve `index.html`
for every route. When deploying `apps/web/dist` to a static host, add a rewrite so unknown
paths fall back to `index.html` (Netlify `_redirects`: `/* /index.html 200`; Vercel / nginx
`try_files $uri /index.html`), otherwise a refresh on `/model/...` returns 404.
