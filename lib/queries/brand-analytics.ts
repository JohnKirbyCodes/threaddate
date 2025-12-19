import { createClient } from "@/lib/supabase/server";

export interface EraDistribution {
  era: string;
  count: number;
  yearStart: number;
  yearEnd: number;
  avgVerificationScore: number;
}

export interface EraInsights {
  mostCommonEra: {
    era: string;
    count: number;
  } | null;
  highestVerifiedEra: {
    era: string;
    avgScore: number;
  } | null;
  totalEras: number;
  newestIdentifier: {
    era: string;
    createdAt: string;
  } | null;
}

export async function getBrandEraDistribution(
  brandId: number
): Promise<EraDistribution[]> {
  const supabase = await createClient();

  // Get all tags for brand with era and year info
  const { data: tags, error } = await supabase
    .from("tags")
    .select("era, year_start, year_end, verification_score")
    .eq("brand_id", brandId);

  if (error || !tags) {
    console.error("Error fetching brand era distribution:", error);
    return [];
  }

  // Group by era, count, get year ranges
  const distribution = tags.reduce((acc: Record<string, EraDistribution>, tag) => {
    if (!tag.era) return acc;

    if (!acc[tag.era]) {
      acc[tag.era] = {
        era: tag.era,
        count: 0,
        yearStart: tag.year_start || 0,
        yearEnd: tag.year_end || 0,
        avgVerificationScore: 0,
      };
    }

    acc[tag.era].count++;
    acc[tag.era].avgVerificationScore += tag.verification_score || 0;

    return acc;
  }, {});

  // Convert to array, calculate averages, sort by year
  return Object.values(distribution)
    .map((item) => ({
      ...item,
      avgVerificationScore:
        item.count > 0 ? Math.round(item.avgVerificationScore / item.count) : 0,
    }))
    .sort((a, b) => a.yearStart - b.yearStart);
}

export async function getBrandEraInsights(
  brandId: number
): Promise<EraInsights> {
  const supabase = await createClient();

  // Get all verified tags with era info
  const { data: tags } = await supabase
    .from("tags")
    .select("era, verification_score, created_at")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (!tags || tags.length === 0) {
    return {
      mostCommonEra: null,
      highestVerifiedEra: null,
      totalEras: 0,
      newestIdentifier: null,
    };
  }

  // Find most common era
  const eraCounts: Record<string, number> = {};
  const eraScores: Record<string, { total: number; count: number }> = {};

  tags.forEach((tag) => {
    if (!tag.era) return;

    eraCounts[tag.era] = (eraCounts[tag.era] || 0) + 1;

    if (!eraScores[tag.era]) {
      eraScores[tag.era] = { total: 0, count: 0 };
    }
    if (tag.verification_score) {
      eraScores[tag.era].total += tag.verification_score;
      eraScores[tag.era].count += 1;
    }
  });

  // Get most common era
  const mostCommonEra = Object.entries(eraCounts).reduce(
    (max, [era, count]) => {
      return count > (max?.count || 0) ? { era, count } : max;
    },
    null as { era: string; count: number } | null
  );

  // Get highest verified era (by average score)
  const highestVerifiedEra = Object.entries(eraScores).reduce(
    (max, [era, { total, count }]) => {
      if (count === 0) return max;
      const avgScore = Math.round(total / count);
      return avgScore > (max?.avgScore || 0) ? { era, avgScore } : max;
    },
    null as { era: string; avgScore: number } | null
  );

  // Get newest identifier
  const newestIdentifier = tags[0] && tags[0].created_at
    ? {
        era: tags[0].era || "Unknown",
        createdAt: tags[0].created_at,
      }
    : null;

  return {
    mostCommonEra,
    highestVerifiedEra,
    totalEras: Object.keys(eraCounts).length,
    newestIdentifier,
  };
}

export interface RelatedBrand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  founded_year: number | null;
  tag_count: number;
}

export async function getRelatedBrands(
  brandId: number,
  foundedYear: number | null,
  currentTagCount: number,
  limit: number = 6
): Promise<RelatedBrand[]> {
  const supabase = await createClient();

  // Define year range (±10 years from founded year)
  const yearMin = foundedYear ? foundedYear - 10 : null;
  const yearMax = foundedYear ? foundedYear + 10 : null;

  // Define tag count range (within 50%)
  const tagMin = Math.floor(currentTagCount * 0.5);
  const tagMax = Math.ceil(currentTagCount * 1.5);

  // Build query
  let query = supabase
    .from("brands")
    .select(`
      id,
      name,
      slug,
      logo_url,
      founded_year,
      tags:tags(count)
    `)
    .neq("id", brandId);

  // Add founded year filter if available
  if (yearMin && yearMax) {
    query = query
      .gte("founded_year", yearMin)
      .lte("founded_year", yearMax);
  }

  const { data: brands, error } = await query.limit(50);

  if (error || !brands) {
    console.error("Error fetching related brands:", error);
    return [];
  }

  // Calculate tag counts and filter by count range
  const brandsWithCounts = brands
    .map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo_url: brand.logo_url,
      founded_year: brand.founded_year,
      tag_count: Array.isArray(brand.tags) ? brand.tags.length : 0,
    }))
    .filter((brand) => {
      return brand.tag_count >= tagMin && brand.tag_count <= tagMax;
    })
    .sort((a, b) => b.tag_count - a.tag_count)
    .slice(0, limit);

  return brandsWithCounts;
}
