import { Button, FeatureList, KeyValue, Note } from '@carcompare/ui';
import { SPEC_ROWS } from '@carcompare/data';
import { useCompare } from '../../store/compare.jsx';

export default function VariantDetail({ variant: v }) {
  const { isSelected, toggle } = useCompare();
  const on = isSelected(v.id);
  const feats = v.data.features || [];
  return (
    <div className="vdetail vdetail-grid">
      <div>
        <h4>Specifications</h4>
        <KeyValue columns="1fr" items={SPEC_ROWS.map(([label, f]) => ({ label, value: f(v) }))} />
        <Note>{v.data.note}</Note>
        <div style={{ marginTop: 14 }}>
          <Button size="sm" on={on} onClick={() => toggle(v.id)}>{on ? '✓ In compare' : '+ Compare'}</Button>
        </div>
      </div>
      <div>
        <h4>Features <span className="ui-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>({feats.length})</span></h4>
        <FeatureList items={feats} emptyText="No feature list available for this variant." />
      </div>
    </div>
  );
}
