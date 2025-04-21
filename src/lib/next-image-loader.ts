
type ImageLoader = {
  src: string
  width: number
  quality?: number
}

export default function nextImageLoader({ src, width, quality }: ImageLoader) {
  return imageFormat(src, width, quality)
}


const CDN_IMAGE_DOMAIN = /^https?:\/\/(h5\.ahmq\.net|cdn\.vace\.me)/i;

/**
 * image format
 * @param url the image url
 * @param w max width
 * @param q image quality, only support jpg suffix
 * @param height max height
 */
export const imageFormat = (url: string, w?: number, q = 90, h?: number) => {
  if (!CDN_IMAGE_DOMAIN.test(url) || url.includes('?')) {
    return url
  }

  if (url.endsWith('.webp')) {
    return url
  }

  const canUseQuality = /\.(jpg|jpeg)$/.test(url);
  const isGif = /\.(gif)$/.test(url);
  let fileSuffix = "?x-oss-process=";

  fileSuffix += isGif
    ? "1/resize,m_lfit"
    : "image/auto-orient,1/resize,m_lfit";

  if (w) {
    fileSuffix += `,w_${w}`;
  }
  if (h) {
    fileSuffix += `,h_${h}`;
  }
  if (canUseQuality) {
    fileSuffix += `/quality,q_${q}/format,webp`;
  }
  return url + fileSuffix;
}
