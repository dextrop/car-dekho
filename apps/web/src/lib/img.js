import { getImages } from '@carcompare/data';
import { CAR_PLACEHOLDER } from '@carcompare/ui';

/** Resolve a manifest path to an absolute URL under public/images (base is '/'). */
export const imgUrl = path => `${import.meta.env.BASE_URL}images/${path}`;

/** Gallery-ready image list for a model key. */
export function modelImages(key) {
  return getImages(key).map(im => ({
    src: imgUrl(im.file), thumb: imgUrl(im.thumb), alt: im.title,
    credit: { author: im.author, license: im.license, licenseUrl: im.license_url, page: im.page },
  }));
}
/** Small card thumbnail (or placeholder) for a model key. */
export const modelThumb = key => { const im = getImages(key)[0]; return im ? imgUrl(im.thumb) : CAR_PLACEHOLDER; };
