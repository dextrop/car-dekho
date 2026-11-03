import { cx } from '../cx.js';

export function Tag({ children, tone, className }) {
  return <span className={cx('ui-tag', tone && `tone-${tone}`, className)}>{children}</span>;
}

const FUEL_TONE = { Electric: 'electric', Diesel: 'diesel', CNG: 'cng', Hybrid: 'hybrid', 'Mild Hybrid': 'hybrid', Petrol: 'petrol' };
export function FuelTag({ fuel }) {
  if (!fuel) return null;
  return <Tag tone={FUEL_TONE[fuel] || 'neutral'}>{fuel}</Tag>;
}

export function TagGroup({ children, className, style }) {
  return <div className={cx('ui-tags', className)} style={style}>{children}</div>;
}
