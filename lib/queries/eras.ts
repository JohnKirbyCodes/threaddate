import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Era = Database["public"]["Enums"]["era_enum"];

// Eras we want to create hub pages for
export const FEATURED_ERAS: Era[] = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s (Y2K)",
];

// URL-safe slug mapping
export const ERA_SLUGS: Record<string, Era> = {
  "1950s": "1950s",
  "1960s": "1960s",
  "1970s": "1970s",
  "1980s": "1980s",
  "1990s": "1990s",
  "2000s": "2000s (Y2K)",
};

export const ERA_TO_SLUG: Record<Era, string> = {
  "Pre-1900s": "pre-1900s",
  "1900s": "1900s",
  "1910s": "1910s",
  "1920s": "1920s",
  "1930s": "1930s",
  "1940s": "1940s",
  "1950s": "1950s",
  "1960s": "1960s",
  "1970s": "1970s",
  "1980s": "1980s",
  "1990s": "1990s",
  "2000s (Y2K)": "2000s",
  "2010s": "2010s",
  "2020s": "2020s",
  "Modern": "modern",
};

export interface EraStats {
  era: Era;
  tagCount: number;
  brandCount: number;
  topBrands: Array<{
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    tagCount: number;
  }>;
  categories: Array<{
    category: string;
    count: number;
  }>;
  countries: Array<{
    country: string;
    count: number;
  }>;
}

export async function getEraStats(era: Era): Promise<EraStats | null> {
  const supabase = await createClient();

  // Get all tags for this era with brand info
  const { data: tags, error } = await supabase
    .from("tags")
    .select(`
      id,
      category,
      origin_country,
      brands!inner (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .eq("era", era)
    .in("status", ["verified", "pending"]);

  if (error) {
    console.error("Error fetching era stats:", error);
    return null;
  }

  if (!tags || tags.length === 0) {
    return {
      era,
      tagCount: 0,
      brandCount: 0,
      topBrands: [],
      categories: [],
      countries: [],
    };
  }

  // Count by brand
  const brandCounts = new Map<number, { brand: any; count: number }>();
  for (const tag of tags) {
    const brand = tag.brands as any;
    const existing = brandCounts.get(brand.id);
    if (existing) {
      existing.count++;
    } else {
      brandCounts.set(brand.id, { brand, count: 1 });
    }
  }

  // Get top brands sorted by count
  const topBrands = Array.from(brandCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
    .map(({ brand, count }) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url,
      tagCount: count,
    }));

  // Count by category
  const categoryCounts = new Map<string, number>();
  for (const tag of tags) {
    const cat = tag.category || "Other";
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  }
  const categories = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Count by country
  const countryCounts = new Map<string, number>();
  for (const tag of tags) {
    if (tag.origin_country) {
      countryCounts.set(tag.origin_country, (countryCounts.get(tag.origin_country) || 0) + 1);
    }
  }
  const countries = Array.from(countryCounts.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    era,
    tagCount: tags.length,
    brandCount: brandCounts.size,
    topBrands,
    categories,
    countries,
  };
}

export async function getTagsByEra(era: Era, limit = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select(`
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      )
    `)
    .eq("era", era)
    .in("status", ["verified", "pending"])
    .order("verification_score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching tags by era:", error);
    return [];
  }

  return data || [];
}
