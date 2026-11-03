import { cx } from '../cx.js';
export function Toolbar({ children, className, style }) { return <div className={cx('ui-toolbar', className)} style={style}>{children}</div>; }
export function Spacer() { return <span className="ui-spacer" />; }
