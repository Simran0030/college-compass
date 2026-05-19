export interface SeoRoute {
  path: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const seoRoutes: SeoRoute[] = [
  { path: '/',          changefreq: 'weekly',  priority: 1.0 },
  { path: '/colleges',  changefreq: 'daily',   priority: 0.9 },
  { path: '/compare',   changefreq: 'weekly',  priority: 0.7 },
  { path: '/predictor', changefreq: 'weekly',  priority: 0.8 },
  // /wishlist is user-specific (noindex) — intentionally excluded from sitemap
];
