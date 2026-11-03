import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Button, EmptyState, Panel, Spacer, Toolbar } from '@carcompare/ui';
import { normalizeFeature } from '@carcompare/data';
import { useSeo } from '../../lib/seo.js';
import { useCompare } from '../../store/compare.jsx';
import CompareTable from './CompareTable.jsx';

/** Side-by-side comparison of the selected variants: specs, then a feature matrix. */
export default function ComparePage() {
  const { variants, remove, clear, max } = useCompare();
  const [diffOnly, setDiffOnly] = useState(false);

  const features = useMemo(() => {
    const map = new Map();
    variants.forEach(v => (v.data.features || []).forEach(f => { const k = normalizeFeature(f); if (!map.has(k)) map.set(k, f); }));
    const sets = variants.map(v => new Set((v.data.features || []).map(normalizeFeature)));
    const rows = [...map.entries()].map(([key, label]) => ({ key, label, has: sets.map(s => s.has(key)) }));
    rows.sort((a, b) => b.has.filter(Boolean).length - a.has.filter(Boolean).length || a.label.localeCompare(b.label));
    return { rows, common: rows.filter(r => r.has.every(Boolean)).length };
  }, [variants]);

  useSeo(useMemo(() => {
    const names = variants.map(v => `${v.model.brand} ${v.model.name} ${v.name}`);
    const models = [...new Set(variants.map(v => `${v.model.brand} ${v.model.name}`))];
    return {
      title: names.length ? `Compare ${names.join(' vs ')}` : 'Compare Car Variants',
      description: names.length ? `Side-by-side comparison of ${names.join(', ')}: price, engine, power, features.` : 'Pick up to four variants from any cars and compare price, specs and features side by side.',
      keywords: ['Car Compare', 'Compare Variants', ...models.map(mn => `Compare ${mn} Variants`), ...names, ...(models.length > 1 ? [models.join(' vs ')] : [])],
    };
  }, [variants]));

  if (!variants.length) {
    return (
      <EmptyState title="Nothing to compare yet." action={<Button as={Link} to="/" variant="primary">Go to search</Button>}>
        Search for a car, open it and tick the variants you want to compare (up to {max}).
      </EmptyState>
    );
  }

  return (
    <>
      <Breadcrumbs linkAs={Link} items={[{ label: 'Search', to: '/' }, { label: 'Compare' }]} />
      <h1 className="page-title">Compare variants</h1>
      <p className="ui-muted" style={{ margin: '0 0 14px' }}>
        {variants.length} of {max} slots used · {features.rows.length} features in total, {features.common} common to all. Highlighted rows differ. ★ marks lowest price and highest power/torque.
      </p>
      <Toolbar className="cmp-toolbar">
        <label><input type="checkbox" checked={diffOnly} onChange={e => setDiffOnly(e.target.checked)} /> Show only differences</label>
        <Spacer />
        {variants.length < max && <Button as={Link} to="/" size="sm">+ Add another variant</Button>}
        <Button size="sm" variant="ghost" onClick={clear}>Clear all</Button>
        <Button size="sm" onClick={() => window.print()}>Print / Save PDF</Button>
      </Toolbar>
      <Panel flush className="cmp-wrap">
        <CompareTable variants={variants} featureRows={features.rows} diffOnly={diffOnly} onRemove={remove} />
      </Panel>
    </>
  );
}
