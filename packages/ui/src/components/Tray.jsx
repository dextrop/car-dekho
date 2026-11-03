/** Fixed bottom tray with a horizontally scrolling item list and an action area. */
export function Tray({ items, actions, hidden }) {
  if (hidden) return null;
  return (
    <div className="ui-tray">
      <div className="ui-tray-inner">
        <div className="ui-tray-items">{items}</div>
        <div className="ui-tray-actions">{actions}</div>
      </div>
    </div>
  );
}
export function TrayItem({ title, subtitle, onRemove }) {
  return (
    <div className="ui-tray-item">
      <div className="t"><b>{title}</b><span>{subtitle}</span></div>
      {onRemove && <button type="button" title="Remove" aria-label={`Remove ${title}`} onClick={onRemove}>×</button>}
    </div>
  );
}
