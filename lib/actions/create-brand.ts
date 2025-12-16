"use server";

import { createClient } from "@/lib/supabase/server";
import slugify from "slugify";

export interface CreateBrandResult {
  success: boolean;
  brandId?: number;
  error?: string;
}

export async function createBrand(brandName: string): Promise<CreateBrandResult> {
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Authentication required" };
  }

  // Validate brand name
  const trimmedName = brandName.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: "Brand name must be at least 2 characters" };
  }

  if (trimmedName.length > 100) {
    return { success: false, error: "Brand name must be less than 100 characters" };
  }

  // Generate slug
  const slug = slugify(trimmedName, { lower: true, strict: true });

  // Check if brand already exists
  const { data: existing } = await supabase
    .from("brands")
    .select("id, name, verified, verification_status")
    .eq("slug", slug)
    .single();

  if (existing) {
    return {
      success: false,
      error: `Brand "${existing.name}" already exists${existing.verified ? '' : ' (pending verification)'}`
    };
  }

  // Insert brand (starts as unverified)
  const { data, error } = await supabase
    .from("brands")
    .insert({
      name: trimmedName,
      slug,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating brand:", error);
    return { success: false, error: error.message };
  }

  return { success: true, brandId: data.id };
}
