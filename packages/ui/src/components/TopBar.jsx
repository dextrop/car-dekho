/**
 * Sticky app header. `brand` is the logo node, `links` are [{ label, to, active, badge }].
 * `linkAs` is the router's NavLink/Link component.
 */
export function TopBar({ brand, links = [], linkAs: Link = 'a' }) {
  return (
    <header className="ui-topbar">
      <div className="ui-topbar-brand">{brand}</div>
      <nav className="ui-topnav">
        {links.map(l => (
          <Link key={l.label} to={l.to} href={l.to} className={l.active ? 'active' : undefined}>
            {l.label}{l.badge ? <span className="ui-pill">{l.badge}</span> : null}
          </Link>
        ))}
      </nav>
    </header>
  );
}
