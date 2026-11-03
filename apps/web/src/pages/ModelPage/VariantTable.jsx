import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, FuelTag, Panel, Select, Spacer, Toolbar } from '@carcompare/ui';
import { formatINR, formatINRFull } from '@carcompare/data';
import { useCompare } from '../../store/compare.jsx';
import VariantDetail from './VariantDetail.jsx';

const sortValue = (v, key) => key === 'price' ? (typeof v.price === 'number' ? v.price : 9e12) : key === 'power' ? (v.data.power_ps ?? -1) : key === 'name' ? v.name : v.idx;

export default function VariantTable({ model, focusVariant = null }) {
  const { isSelected, toggle, replaceWith, max } = useCompare();
  const navigate = useNavigate();
  const [fuel, setFuel] = useState('');
  const [trans, setTrans] = useState('');
  const [sort, setSort] = useState({ key: 'price', dir: 'asc' });
  const [open, setOpen] = useState(() => new Set(focusVariant ? [focusVariant.id] : []));
  // /brand/model/<variant>: expand that row and bring it into view
  useEffect(() => {
    if (!focusVariant) return;
    setOpen(prev => prev.has(focusVariant.id) ? prev : new Set([...prev, focusVariant.id]));
    const t = setTimeout(() => document.getElementById(`variant-${focusVariant.slug}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
    return () => clearTimeout(t);
  }, [focusVariant]);

  const fuelOpts = useMemo(() => [...new Set(model.variants.map(v => v.data.fuel_type).filter(Boolean))].sort(), [model]);
  const transOpts = useMemo(() => [...new Set(model.variants.map(v => v.data.transmission).filter(Boolean))].sort(), [model]);

  const visible = useMemo(() => {
    const sgn = sort.dir === 'desc' ? -1 : 1;
    return model.variants
      .filter(v => (!fuel || v.data.fuel_type === fuel) && (!trans || v.data.transmission === trans))
      .sort((a, b) => { const x = sortValue(a, sort.key), y = sortValue(b, sort.key); return (typeof x === 'string' ? x.localeCompare(y) : x - y) * sgn; });
  }, [model, fuel, trans, sort]);

  const toggleSort = key => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  const arrow = key => sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';
  const toggleOpen = v => {
    const opening = !open.has(v.id);
    setOpen(prev => { const n = new Set(prev); opening ? n.add(v.id) : n.delete(v.id); return n; });
    // keep the address bar on the row the user is looking at (deep-linkable variants)
    navigate(opening ? `/${model.key}/${v.slug}` : `/${model.key}`, { replace: true });
  };
  const allOpen = visible.length > 0 && visible.every(v => open.has(v.id));

  return (
    <Panel title="Variants" count={`${visible.length} of ${model.variants.length}`}>
      <Toolbar>
        <Select value={fuel} onChange={setFuel} options={fuelOpts} placeholder="All fuels" aria-label="Fuel" />
        <Select value={trans} onChange={setTrans} options={transOpts} placeholder="All transmissions" aria-label="Transmission" />
        <Spacer />
        <Button size="sm" onClick={() => setOpen(allOpen ? new Set() : new Set(visible.map(v => v.id)))}>{allOpen ? 'Collapse all' : 'Expand all'}</Button>
        <Button size="sm" title={`Select the first ${max} visible variants`} onClick={() => replaceWith(visible.map(v => v.id))}>Select top {max}</Button>
        <Button as={Link} to="/compare" size="sm" variant="primary">Compare selected</Button>
      </Toolbar>
      <p className="ui-muted" style={{ fontSize: 13, margin: '0 0 10px' }}>Tick variants to compare (up to {max}, across any models). Click a row for full specs and features.</p>
      <div className="table-wrap">
        <table className="vtable">
          <thead>
            <tr>
              <th style={{ width: 34 }} />
              <th className="sortable" onClick={() => toggleSort('name')}>Variant{arrow('name')}</th>
              <th>Fuel</th>
              <th className="hide-m">Engine</th>
              <th className="hide-m">Transmission</th>
              <th className="sortable hide-m" onClick={() => toggleSort('power')}>Power{arrow('power')}</th>
              <th className="sortable" onClick={() => toggleSort('price')}>Price{arrow('price')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={7} className="ui-muted" style={{ textAlign: 'center', padding: 24 }}>No variants match these filters.</td></tr>}
            {visible.map(v => {
              const d = v.data, sel = isSelected(v.id);
              const power = d.power_ps ? `${d.power_ps} PS` : d.power_kw ? `${d.power_kw} kW` : '—';
              return (
                <Fragment key={v.id}>
                  <tr id={`variant-${v.slug}`} className={`vrow ${sel ? 'sel' : ''}`} onClick={() => toggleOpen(v)}>
                    <td onClick={e => e.stopPropagation()}><Checkbox checked={sel} onChange={() => toggle(v.id)} label={`Add ${v.name} to compare`} /></td>
                    <td><div className="vname">{v.name}{d.series && <small>{d.series}</small>}{d.note && <small>{d.note}</small>}</div></td>
                    <td><FuelTag fuel={d.fuel_type} /></td>
                    <td className="hide-m">{d.engine || '—'}{d.displacement_cc && <><br /><small className="ui-muted">{d.displacement_cc} cc</small></>}</td>
                    <td className="hide-m">{d.transmission || '—'}</td>
                    <td className="num hide-m">{power}{d.torque_nm && <><br /><small className="ui-muted">{d.torque_nm} Nm</small></>}</td>
                    <td className="price" title={formatINRFull(v.price)}>{formatINR(v.price)}</td>
                  </tr>
                  {open.has(v.id) && <tr className="vdetail"><td colSpan={7}><VariantDetail variant={v} /></td></tr>}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
