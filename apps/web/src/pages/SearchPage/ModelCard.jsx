import { Link } from 'react-router-dom';
import { Card, FuelTag, Tag, TagGroup, Thumb } from '@carcompare/ui';
import { modelThumb } from '../../lib/img.js';
import { formatRange } from '@carcompare/data';

export default function ModelCard({ result }) {
  const { model: m, variants, matchedVariants: mv, min, max } = result;
  return (
    <Card as={Link} to={`/${m.key}`} className="model-card">
      <Thumb bleed src={modelThumb(m.key)} alt={`${m.brand} ${m.name}`} />
      <div className="brand">{m.brand}</div>
      <h3>{m.name}</h3>
      <div className="price"><span className="range">{formatRange(min, max)}</span><small>ex-showroom</small></div>
      <TagGroup>
        <Tag>{m.body}</Tag>
        {m.fuels.map(f => <FuelTag key={f} fuel={f} />)}
        {m.seats && <Tag>{m.seats} seats</Tag>}
        <Tag>{variants.length} variant{variants.length === 1 ? '' : 's'}</Tag>
      </TagGroup>
      {mv && (
        <div className="match">
          {mv.length} matching variant{mv.length === 1 ? '' : 's'}: {mv.slice(0, 2).map(v => v.name).join(', ')}{mv.length > 2 ? '…' : ''}
        </div>
      )}
    </Card>
  );
}
