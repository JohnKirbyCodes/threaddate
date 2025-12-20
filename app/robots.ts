import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/', '/admin/'],
    },
    sitemap: 'https://threaddate.com/sitemap.xml',
  };
}
