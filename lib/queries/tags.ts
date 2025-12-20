import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export interface TagFilters {
  brandId?: number;
  clothingItemId?: number;
  category?: Database["public"]["Enums"]["identifier_category_enum"];
  era?: Database["public"]["Enums"]["era_enum"];
  stitchType?: Database["public"]["Enums"]["stitch_enum"];
  originCountry?: string;
  status?: Database["public"]["Enums"]["status_enum"];
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
      ),
      clothing_items (
        id,
        name,
        slug,
        type,
        color
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

  if (filters.clothingItemId) {
    query = query.eq("clothing_item_id", filters.clothingItemId);
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

export async function getTotalTagCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("tags")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching tag count:", error);
    return 0;
  }

  return count || 0;
}

export async function getAllTagIds() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tag IDs:", error);
    return [];
  }

  return data || [];
}
