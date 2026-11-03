import { Select, Toolbar } from '@carcompare/ui';
import { BODY_TYPES, FUEL_TYPES, BUDGETS, SORTS } from '@carcompare/data';

export default function Filters({ value, onChange }) {
  const set = k => v => onChange({ ...value, [k]: v });
  return (
    <Toolbar className="filters">
      <span className="lbl">Filter</span>
      <Select value={value.body} onChange={set('body')} options={BODY_TYPES} placeholder="All body types" aria-label="Body type" />
      <Select value={value.fuel} onChange={set('fuel')} options={FUEL_TYPES} placeholder="All fuels" aria-label="Fuel" />
      <Select value={value.budget} onChange={set('budget')} options={BUDGETS} placeholder="Any budget" aria-label="Budget" />
      <Select value={value.sort} onChange={set('sort')} options={SORTS} aria-label="Sort" />
    </Toolbar>
  );
}
