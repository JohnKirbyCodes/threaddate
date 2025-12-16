import { createClient } from "@/lib/supabase/server";

export async function getBrands(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("brands")
    .select("id, name, slug, logo_url, verified, verification_status, founded_year, description")
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
    "levis",
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
