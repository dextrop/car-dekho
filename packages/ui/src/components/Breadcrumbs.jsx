import { Fragment } from 'react';

/** items: [{ label, to? }]. `linkAs` is the router Link component. */
export function Breadcrumbs({ items, linkAs: Link = 'a' }) {
  return (
    <nav className="ui-crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <Fragment key={i}>
          {i > 0 && <span aria-hidden="true">›</span>}
          {it.to ? <Link to={it.to} href={it.to}>{it.label}</Link> : <span>{it.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}
