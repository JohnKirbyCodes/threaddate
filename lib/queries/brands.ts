import { createClient } from "@/lib/supabase/server";

export async function getBrands(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("brands")
    .select("id, name, slug, logo_url, verified, verification_status, founded_year, description, country_code")
    .order("verified", { ascending: false }) // Verified brands first
    .order("name", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return data || [];
}

export async function getBrandBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching brand:", error);
    return null;
  }

  return data;
}

export async function getFeaturedBrands() {
  // Get "The Big 6" featured brands
  const featuredSlugs = [
    "nike",
    "adidas",
    "champion",
    "levi-s",
    "wrangler",
    "carhartt",
  ];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .in("slug", featuredSlugs)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching featured brands:", error);
    return [];
  }

  return data || [];
}

export async function searchBrands(query: string, limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select(`
      id,
      name,
      slug,
      logo_url,
      verified,
      country_code,
      tags(count)
    `)
    .ilike("name", `%${query}%`)
    .order("verified", { ascending: false })
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error searching brands:", error);
    return [];
  }

  return data || [];
}

export async function getBrandsWithTagCounts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select(`
      id,
      name,
      slug,
      logo_url,
      verified,
      verification_status,
      founded_year,
      description,
      country_code,
      tags(count)
    `)
    .order("verified", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching brands with tag counts:", error);
    return [];
  }

  // Transform the data to include tag_count
  return (data || []).map((brand: any) => ({
    ...brand,
    tag_count: Array.isArray(brand.tags) ? brand.tags.length : 0,
    tags: undefined, // Remove the tags array
  }));
}

export async function getBrandStats() {
  const supabase = await createClient();

  // Get total brands
  const { count: totalBrands, error: totalError } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    console.error("Error fetching total brands:", totalError);
    return {
      totalBrands: 0,
      verifiedBrands: 0,
      erasCovered: 0,
    };
  }

  // Get verified brands count
  const { count: verifiedBrands, error: verifiedError } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true })
    .eq("verified", true);

  if (verifiedError) {
    console.error("Error fetching verified brands:", verifiedError);
  }

  // Get unique eras covered from tags
  const { data: erasData, error: erasError } = await supabase
    .from("tags")
    .select("era")
    .not("era", "is", null);

  if (erasError) {
    console.error("Error fetching eras:", erasError);
  }

  const uniqueEras = new Set(erasData?.map((t) => t.era) || []);

  return {
    totalBrands: totalBrands || 0,
    verifiedBrands: verifiedBrands || 0,
    erasCovered: uniqueEras.size,
  };
}
