/** Definition grid. items: [{ label, value }] — items with empty values are skipped. */
export function KeyValue({ items, columns }) {
  const shown = items.filter(i => i.value !== null && i.value !== undefined && i.value !== '');
  return (
    <div className="ui-kv" style={columns ? { gridTemplateColumns: columns } : undefined}>
      {shown.map(i => (
        <div key={i.label}>
          <div className="ui-kv-k">{i.label}</div>
          <div className="ui-kv-v">{i.value}</div>
        </div>
      ))}
    </div>
  );
}
