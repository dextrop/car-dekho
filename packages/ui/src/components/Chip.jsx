import { cx } from '../cx.js';

export function Chip({ active, children, ...rest }) {
  return <button type="button" className={cx('ui-chip', active && 'on')} aria-pressed={!!active} {...rest}>{children}</button>;
}
export function ChipGroup({ children, className }) {
  return <div className={cx('ui-chips', className)}>{children}</div>;
}
