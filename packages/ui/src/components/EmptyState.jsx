export function EmptyState({ title, children, action }) {
  return (
    <div className="ui-empty">
      {title && <b>{title}</b>}
      {children && <div>{children}</div>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
