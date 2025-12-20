import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type ClothingType = Database["public"]["Enums"]["clothing_type_enum"];

export async function getClothingItems(limit?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("clothing_items")
    .select(`
      id,
      name,
      slug,
      type,
      description,
      color,
      size,
      style_number,
      era,
      year_manufactured,
      image_url,
      status,
      verification_score,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching clothing items:", error);
    return [];
  }

  return data || [];
}

export async function getClothingItemBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching clothing item:", error);
    return null;
  }

  return data;
}

export async function getClothingItemById(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching clothing item:", error);
    return null;
  }

  return data;
}

export async function searchClothingItems(query: string, limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select(`
      id,
      name,
      slug,
      type,
      color,
      era,
      image_url,
      status
    `)
    .or(`name.ilike.%${query}%,style_number.ilike.%${query}%`)
    .order("status", { ascending: true }) // verified first
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error searching clothing items:", error);
    return [];
  }

  return data || [];
}

export async function getClothingItemsWithTagCounts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select(`
      id,
      name,
      slug,
      type,
      color,
      era,
      image_url,
      status,
      tags(count)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching clothing items with tag counts:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    ...item,
    tag_count: Array.isArray(item.tags) ? item.tags.length : 0,
    tags: undefined,
  }));
}

export async function getClothingItemsByType(type: ClothingType) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select("*")
    .eq("type", type)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching clothing items by type:", error);
    return [];
  }

  return data || [];
}

type Era = Database["public"]["Enums"]["era_enum"];

export interface ClothingItemFilters {
  brandName?: string;
  type?: ClothingType;
  era?: Era;
  originCountry?: string;
}

export async function getFilteredClothingItems(
  filters: ClothingItemFilters,
  limit = 20
) {
  const supabase = await createClient();

  let query = supabase
    .from("clothing_items")
    .select(`
      id,
      name,
      slug,
      type,
      color,
      size,
      era,
      image_url,
      status,
      origin_country,
      tags(brand_id, brands(id, name, slug, logo_url))
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.era) {
    query = query.eq("era", filters.era);
  }

  if (filters.originCountry) {
    query = query.ilike("origin_country", `%${filters.originCountry}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered clothing items:", error);
    return [];
  }

  // If brand filter is specified, filter results to only include items with matching brands
  let results = data || [];
  if (filters.brandName) {
    const brandLower = filters.brandName.toLowerCase();
    results = results.filter((item: any) =>
      item.tags?.some((tag: any) =>
        tag.brands?.name?.toLowerCase().includes(brandLower)
      )
    );
  }

  // Extract primary brand for each item
  return results.map((item: any) => {
    const brand = item.tags?.[0]?.brands;
    return {
      ...item,
      brand,
      tags: undefined,
    };
  });
}

export async function getClothingItemsByBrandId(brandId: number, limit = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clothing_items")
    .select(`
      id,
      name,
      slug,
      type,
      era,
      image_url,
      status,
      tags!inner(brand_id)
    `)
    .eq("tags.brand_id", brandId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching clothing items by brand ID:", error);
    return [];
  }

  // Deduplicate (a clothing item might have multiple tags from same brand)
  const uniqueItems = new Map();
  for (const item of data || []) {
    if (!uniqueItems.has(item.id)) {
      uniqueItems.set(item.id, {
        ...item,
        tags: undefined,
      });
    }
  }

  return Array.from(uniqueItems.values());
}

export async function searchClothingItemsByBrand(brandName: string, limit = 10) {
  const supabase = await createClient();

  // First find matching brands
  const { data: brands } = await supabase
    .from("brands")
    .select("id")
    .ilike("name", `%${brandName}%`);

  if (!brands || brands.length === 0) {
    return [];
  }

  const brandIds = brands.map(b => b.id);

  // Get clothing items that have tags from those brands
  const { data, error } = await supabase
    .from("clothing_items")
    .select(`
      id,
      name,
      slug,
      type,
      color,
      size,
      era,
      image_url,
      status,
      origin_country,
      tags!inner(brand_id, brands!inner(id, name, slug, logo_url))
    `)
    .in("tags.brand_id", brandIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error searching clothing items by brand:", error);
    return [];
  }

  // Extract unique clothing items with their primary brand
  const uniqueItems = new Map();
  for (const item of data || []) {
    if (!uniqueItems.has(item.id)) {
      const brand = item.tags?.[0]?.brands;
      uniqueItems.set(item.id, {
        ...item,
        brand: brand,
        tags: undefined
      });
    }
  }

  return Array.from(uniqueItems.values());
}
