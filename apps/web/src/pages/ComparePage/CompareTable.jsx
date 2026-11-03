import { Link } from 'react-router-dom';
import { Button, Thumb } from '@carcompare/ui';
import { modelThumb } from '../../lib/img.js';
import { SPEC_ROWS, formatINR } from '@carcompare/data';

const SPEC_WITH_MODEL = [
  ['Brand / Model', v => `${v.model.brand} ${v.model.name}`],
  ['Body type', v => v.model.body],
  ['Segment', v => v.model.segment],
  ...SPEC_ROWS,
  ['Safety rating (model)', v => v.model.data.safety_rating],
];

export default function CompareTable({ variants: vs, featureRows, diffOnly, onRemove }) {
  const many = vs.length > 1;
  const prices = vs.map(v => v.price).filter(p => typeof p === 'number');
  const best = {
    price: prices.length ? Math.min(...prices) : null,
    power: Math.max(...vs.map(v => v.data.power_ps || 0)),
    torque: Math.max(...vs.map(v => v.data.torque_nm || 0)),
  };
  const bestClass = (label, v) => {
    if (!many) return '';
    if (label === 'Ex-showroom price') return v.price === best.price ? 'best' : '';
    if (label === 'Power') return v.data.power_ps && v.data.power_ps === best.power ? 'best' : '';
    if (label === 'Torque') return v.data.torque_nm && v.data.torque_nm === best.torque ? 'best' : '';
    return '';
  };

  const specRows = SPEC_WITH_MODEL.map(([label, f]) => {
    const vals = vs.map(v => { const x = f(v); return (x === null || x === undefined || x === '') ? '—' : String(x); });
    const differs = new Set(vals).size > 1;
    return { label, vals, differs, empty: vals.every(x => x === '—') };
  }).filter(r => !r.empty && (!diffOnly || r.differs));

  const feats = featureRows.filter(r => !diffOnly || (r.has.some(Boolean) && r.has.some(x => !x)));
  const span = vs.length + 1;

  return (
    <table className="cmp">
      <thead>
        <tr>
          <th />
          {vs.map(v => (
            <th key={v.id} className="col-head">
              <Thumb src={modelThumb(v.model.key)} alt="" style={{ width: 150, marginBottom: 8 }} />
              <div className="b">{v.model.brand}</div>
              <div className="m"><Link to={`/${v.model.key}`}>{v.model.name}</Link></div>
              <div className="v">{v.name}</div>
              <div className="p">{formatINR(v.price)}</div>
              <div className="rm"><Button size="sm" variant="ghost" onClick={() => onRemove(v.id)}>Remove</Button></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="section"><td colSpan={span}>Specifications</td></tr>
        {specRows.length === 0 && <tr><td colSpan={span} className="ui-muted">No differences in specifications.</td></tr>}
        {specRows.map(r => (
          <tr key={r.label} className={r.differs ? 'diff' : ''}>
            <td>{r.label}</td>
            {r.vals.map((val, i) => <td key={vs[i].id} className={bestClass(r.label, vs[i])}>{val}</td>)}
          </tr>
        ))}
        <tr className="section"><td colSpan={span}>Features ({feats.length}{diffOnly ? ' differing' : ''})</td></tr>
        {feats.length === 0 && <tr><td colSpan={span} className="ui-muted">{diffOnly ? 'All features are identical across the selected variants.' : 'No feature data.'}</td></tr>}
        {feats.map(r => {
          const differs = r.has.some(Boolean) && r.has.some(x => !x);
          return (
            <tr key={r.key} className={differs ? 'diff' : ''}>
              <td>{r.label}</td>
              {r.has.map((h, i) => <td key={vs[i].id} className={h ? 'yes' : 'no'}>{h ? '✓' : '✕'}</td>)}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
