import { createClient } from "@/lib/supabase/server";

export interface TagFilters {
  brandId?: number;
  category?: string;
  era?: string;
  stitchType?: string;
  originCountry?: string;
  status?: "pending" | "verified" | "rejected";
  orderBy?: "verification_score" | "created_at" | "year_start" | "year_end";
  orderDirection?: "asc" | "desc";
}

export async function getTags(filters: TagFilters = {}, limit = 20) {
  const supabase = await createClient();

  let query = supabase
    .from("tags")
    .select(
      `
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      )
    `
    )
    .limit(limit);

  // Apply custom ordering if specified, otherwise use default
  if (filters.orderBy) {
    query = query.order(filters.orderBy, {
      ascending: filters.orderDirection === "asc"
    });
  } else {
    query = query
      .order("verification_score", { ascending: false })
      .order("created_at", { ascending: false });
  }

  // Apply filters
  if (filters.brandId) {
    query = query.eq("brand_id", filters.brandId);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.era) {
    query = query.eq("era", filters.era);
  }

  if (filters.stitchType) {
    query = query.eq("stitch_type", filters.stitchType);
  }

  if (filters.originCountry) {
    query = query.ilike("origin_country", `%${filters.originCountry}%`);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data || [];
}

export async function getRecentVerifiedTags(limit = 12) {
  return getTags({ status: "verified" }, limit);
}
