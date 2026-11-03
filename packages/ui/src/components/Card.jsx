import { cx } from '../cx.js';

/** Surface card. Pass `as={Link}` + `to` to make the whole card clickable. */
export function Card({ as: Comp = 'div', className, children, ...rest }) {
  return <Comp className={cx('ui-card', Comp !== 'div' && 'interactive', className)} {...rest}>{children}</Comp>;
}
