/** Two-column tick list of feature strings. */
export function FeatureList({ items, emptyText = 'No feature list available.' }) {
  if (!items?.length) return <div className="ui-muted">{emptyText}</div>;
  return <ul className="ui-feat-list">{items.map((f, i) => <li key={i}>{f}</li>)}</ul>;
}
