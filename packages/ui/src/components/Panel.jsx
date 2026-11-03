import { cx } from '../cx.js';

export function Panel({ title, count, actions, flush = false, className, children }) {
  return (
    <section className={cx('ui-panel', flush && 'flush', className)}>
      {(title || actions) && (
        <h2 className="ui-panel-title">
          {title}{count != null && <span className="ui-panel-count">{count}</span>}
          {actions && <span className="ui-panel-actions">{actions}</span>}
        </h2>
      )}
      {children}
    </section>
  );
}
