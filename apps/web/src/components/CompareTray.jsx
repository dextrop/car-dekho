import { Link } from 'react-router-dom';
import { Button, Tray, TrayItem } from '@carcompare/ui';
import { formatINR } from '@carcompare/data';
import { useCompare } from '../store/compare.jsx';

export default function CompareTray({ hidden }) {
  const { variants, remove, clear } = useCompare();
  return (
    <Tray
      hidden={hidden || variants.length === 0}
      items={variants.map(v => (
        <TrayItem key={v.id} title={`${v.model.brand} ${v.model.name}`} subtitle={`${v.name} · ${formatINR(v.price)}`} onRemove={() => remove(v.id)} />
      ))}
      actions={<>
        <Button variant="ghost" onClick={clear}>Clear</Button>
        <Button as={Link} to="/compare" variant="primary">Compare</Button>
      </>}
    />
  );
}
