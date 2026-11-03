import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs, Button, EmptyState, FuelTag, Gallery, KeyValue, Note, Panel, Tag, TagGroup, Timeline } from '@carcompare/ui';
import { modelImages } from '../../lib/img.js';
import { getModel, getVariantBySlug, formatRange, slug, brandSlug } from '@carcompare/data';
import { useSeo } from '../../lib/seo.js';
import VariantTable from './VariantTable.jsx';

/** Model detail: price, variant table, overview, safety, colours and timeline. */
export default function ModelPage() {
  const { brand, model, variant } = useParams();
  const m = getModel(`${slug(brand)}/${slug(model)}`);
  const v = variant ? getVariantBySlug(m, slug(variant)) : null;

  useSeo();   // title / keywords come from seoForPath(pathname) in @carcompare/data

  if (!m) {
    return <EmptyState title="Model not found." action={<Button as={Link} to="/">Back to search</Button>} />;
  }
  const d = m.data;
  const notes = [d.price_basis && `Price basis: ${d.price_basis}`, d.note, d.safety_note, d.safety_rating_note, d.launch_date_note, d.launch_price_note, d.status_note, d.colours_note].filter(Boolean);

  return (
    <>
      <Breadcrumbs linkAs={Link} items={[{ label: 'Search', to: '/' }, { label: m.brand, to: `/${brandSlug(m.brand)}` }, { label: m.name }]} />
      <div className="model-head">
        <div>
          <h1>{m.brand} {m.name}</h1>
          <div className="sub">{m.segment || m.body}{d.status ? ` · ${d.status}` : ''}</div>
          <TagGroup style={{ marginTop: 10 }}>
            <Tag>{m.body}</Tag>
            {m.fuels.map(f => <FuelTag key={f} fuel={f} />)}
            {m.seats && <Tag>{m.seats} seats</Tag>}
            <Tag>{m.variants.length} variants</Tag>
          </TagGroup>
        </div>
        <div className="price-big">
          <div className="val">{formatRange(m.min, m.max)}</div>
          <div className="lbl">ex-showroom price range</div>
        </div>
      </div>

      <Gallery images={modelImages(m.key)} title={`${m.brand} ${m.name}`} />

      <VariantTable model={m} focusVariant={v} />

      <Panel title="Overview">
        <KeyValue items={[
          { label: 'Launched', value: d.launch_date },
          { label: 'Launch price', value: formatRange(d.launch_price_range_inr?.min, d.launch_price_range_inr?.max) },
          { label: 'Current price', value: formatRange(m.min, m.max) },
          { label: 'Body / segment', value: `${m.body}${m.segment ? ` · ${m.segment}` : ''}` },
          { label: 'Seating', value: m.seats ? `${m.seats}${d.seating_options ? ` (${[].concat(d.seating_options).join(', ')})` : ''}` : null },
          { label: 'Predecessor', value: d.predecessor },
          { label: 'Country of origin', value: m.country },
          { label: 'Data as of', value: d.data_as_of },
        ]} />
        {notes.length > 0 && <Note>{notes.map((n, i) => <div key={i}>{n}</div>)}</Note>}
      </Panel>

      <Panel title="Safety">
        <KeyValue items={[{ label: 'Rating', value: d.safety_rating || '—' }]} />
        {d.standard_safety_features?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="ui-kv-k" style={{ marginBottom: 6 }}>Standard safety features</div>
            <TagGroup>{d.standard_safety_features.map(f => <Tag key={f}>{f}</Tag>)}</TagGroup>
          </div>
        )}
      </Panel>

      {d.colours?.length > 0 && (
        <Panel title="Colours" count={d.colours.length}>
          <TagGroup>{d.colours.map(c => <Tag key={c}>{c}</Tag>)}</TagGroup>
        </Panel>
      )}
      {d.release_timeline?.length > 0 && (
        <Panel title="Timeline"><Timeline items={d.release_timeline} /></Panel>
      )}
    </>
  );
}
