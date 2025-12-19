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
