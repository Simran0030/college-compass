const rawBaseUrl = import.meta.env.VITE_PUBLIC_URL ?? '';
export const siteUrl = rawBaseUrl.replace(/\/+$/, '');

export function withBaseUrl(path: string): string {
  if (!path) return siteUrl || '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (!siteUrl) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export const heroImagePath = '/images/pages/home/hero.svg';
export const heroImageUrl = withBaseUrl(heroImagePath);
