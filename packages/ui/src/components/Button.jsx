import { cx } from '../cx.js';

/**
 * Button. `as` lets it render as a link component (e.g. react-router Link).
 * variant: 'default' | 'primary' | 'ghost'; size: 'md' | 'sm'; on: toggled state.
 */
export function Button({ as: Comp = 'button', variant = 'default', size = 'md', on = false, className, children, ...rest }) {
  const props = Comp === 'button' ? { type: 'button', ...rest } : rest;
  return (
    <Comp className={cx('ui-btn', variant !== 'default' && variant, size === 'sm' && 'sm', on && 'on', className)} {...props}>
      {children}
    </Comp>
  );
}
