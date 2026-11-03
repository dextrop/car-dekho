/** items: [{ date, event }] */
export function Timeline({ items }) {
  return (
    <ul className="ui-timeline">
      {items.map((t, i) => (
        <li key={i}><span className="d">{t.date}</span><span>{t.event}</span></li>
      ))}
    </ul>
  );
}
