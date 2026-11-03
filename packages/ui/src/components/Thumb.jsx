import { cx } from '../cx.js';

export const CAR_PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 100'><rect width='160' height='100' fill='#e6e8ec'/><path d='M30 62h100l-8-18a8 8 0 0 0-7-5H52a8 8 0 0 0-7 5z' fill='#b9bfc9'/><rect x='22' y='60' width='116' height='14' rx='5' fill='#a8afbb'/><circle cx='50' cy='76' r='8' fill='#6c7380'/><circle cx='112' cy='76' r='8' fill='#6c7380'/></svg>");

/** Fixed-ratio image. Falls back to a car silhouette when src is missing. bleed: stretch to card edges. */
export function Thumb({ src, alt = '', ratio = '16 / 10', bleed = false, className, style }) {
  const empty = !src;
  return (
    <div className={cx('ui-thumb', empty && 'empty', bleed && 'bleed', className)} style={{ aspectRatio: ratio, ...style }}>
      <img loading={empty ? undefined : 'lazy'} src={src || CAR_PLACEHOLDER} alt={alt} />
    </div>
  );
}
