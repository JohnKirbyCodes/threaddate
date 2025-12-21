import type { MetadataRoute } from 'next';
import { getAllBrandSlugs } from '@/lib/queries/brands';
import { getAllTagIds } from '@/lib/queries/tags';
import { getAllClothingItemSlugs } from '@/lib/queries/clothing-items';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://threaddate.com';

  // Fetch all dynamic routes
  const [brands, tags, clothingItems] = await Promise.all([
    getAllBrandSlugs(),
    getAllTagIds(),
    getAllClothingItemSlugs(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contribute`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  // Brand pages
  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.created_at ? new Date(brand.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Tag pages
  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tags/${tag.id}`,
    lastModified: tag.created_at ? new Date(tag.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Clothing item pages
  const clothingPages: MetadataRoute.Sitemap = clothingItems.map((item) => ({
    url: `${baseUrl}/clothing/${item.slug}`,
    lastModified: item.created_at ? new Date(item.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...brandPages, ...tagPages, ...clothingPages];
}
