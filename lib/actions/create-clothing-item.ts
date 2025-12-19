"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);
}

interface CreateClothingItemData {
  name: string;
  type: Database["public"]["Enums"]["clothing_type_enum"];
  description?: string;
  styleNumber?: string;
  color?: string;
  size?: string;
  yearManufactured?: number;
  era?: Database["public"]["Enums"]["era_enum"];
  submissionNotes?: string;
}

export async function createClothingItem(data: CreateClothingItemData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create clothing items" };
  }

  try {
    // Generate base slug
    let slug = generateSlug(data.name);

    // Check for existing slug and make unique if needed
    const { data: existing } = await supabase
      .from("clothing_items")
      .select("slug")
      .ilike("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    const clothingItemData = {
      name: data.name,
      slug,
      type: data.type,
      description: data.description,
      style_number: data.styleNumber,
      color: data.color,
      size: data.size,
      year_manufactured: data.yearManufactured,
      era: data.era,
      submission_notes: data.submissionNotes,
      created_by: user.id,
      status: "pending" as const,
      verification_score: 0,
    } satisfies Database["public"]["Tables"]["clothing_items"]["Insert"];

    const { data: clothingItem, error: insertError } = await supabase
      .from("clothing_items")
      .insert(clothingItemData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return { error: "Failed to create clothing item" };
    }

    revalidatePath("/clothing");

    return { success: true, clothingItem };
  } catch (err: any) {
    console.error("Create clothing item error:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
}
