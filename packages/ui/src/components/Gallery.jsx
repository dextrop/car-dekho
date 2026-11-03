import { useEffect, useState } from 'react';
import { cx } from '../cx.js';

/**
 * Photo gallery: main image, prev/next, thumbnail strip, and a credit line.
 * images: [{ src, thumb, alt, credit?: { author, license, licenseUrl, page } }]
 */
export function Gallery({ images, title = '' }) {
  const [idx, setIdx] = useState(0);
  const n = images.length;
  useEffect(() => { setIdx(0); }, [images]);
  useEffect(() => {
    if (n < 2) return;
    const onKey = e => {
      if (e.target.matches?.('input,select,textarea')) return;
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + n) % n);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n]);
  if (!n) return null;
  const im = images[Math.min(idx, n - 1)];
  const c = im.credit;
  return (
    <section className="ui-panel ui-gallery">
      <div className="ui-gallery-main">
        <img src={im.src} alt={`${title} photo ${idx + 1} of ${n}`} />
        {n > 1 && <>
          <button type="button" className="ui-gallery-nav prev" aria-label="Previous photo" onClick={() => setIdx((idx - 1 + n) % n)}>‹</button>
          <button type="button" className="ui-gallery-nav next" aria-label="Next photo" onClick={() => setIdx((idx + 1) % n)}>›</button>
        </>}
        <span className="ui-gallery-count">{idx + 1} / {n}</span>
      </div>
      {n > 1 && (
        <div className="ui-gallery-thumbs">
          {images.map((t, i) => (
            <button key={t.src} type="button" className={cx(i === idx && 'on')} aria-label={`Photo ${i + 1}`} onClick={() => setIdx(i)}>
              <img loading="lazy" src={t.thumb || t.src} alt="" />
            </button>
          ))}
        </div>
      )}
      {c && (
        <div className="ui-gallery-credit">
          Photo: <a href={c.page} target="_blank" rel="noopener noreferrer">{c.author}</a>
          {' · '}{c.licenseUrl ? <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">{c.license}</a> : c.license}
          {' · via Wikimedia Commons'}
        </div>
      )}
    </section>
  );
}
