"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

type ClothingType = Database["public"]["Enums"]["clothing_type_enum"];
type Era = Database["public"]["Enums"]["era_enum"];
type IdentifierCategory = Database["public"]["Enums"]["identifier_category_enum"];
type StitchType = Database["public"]["Enums"]["stitch_enum"];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);
}

interface ClothingItemData {
  name: string;
  type: ClothingType;
  brandId: number;
  era: Era;
  description?: string;
  color?: string;
  size?: string;
  originCountry?: string; // Country of manufacture
  imageUrl?: string; // URL to uploaded photo in Supabase Storage
}

interface IdentifierData {
  id: string;
  croppedImage: string; // Now contains URL to pre-uploaded image in Supabase Storage
  category: IdentifierCategory;
  era: Era;
  yearStart?: number;
  yearEnd?: number;
  stitchType?: StitchType;
  originCountry?: string;
  submissionNotes?: string;
  positionX?: number; // Position on clothing image (0.0-1.0)
  positionY?: number;
}

interface SubmitClothingWithIdentifiersInput {
  clothingItem: ClothingItemData;
  identifiers: IdentifierData[];
}

export async function submitClothingWithIdentifiers(
  data: SubmitClothingWithIdentifiersInput
) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit" };
  }

  // Validation
  if (!data.identifiers || data.identifiers.length === 0) {
    return { error: "At least one identifier is required" };
  }

  const completeIdentifiers = data.identifiers.filter((i) => i.croppedImage);
  if (completeIdentifiers.length === 0) {
    return { error: "At least one identifier with an image is required" };
  }

  try {
    // Images are now pre-uploaded on the client side
    // Just use the URLs directly from the input

    // Step 1: Create clothing item
    let slug = generateSlug(data.clothingItem.name);

    // Check for existing slug and make unique if needed
    const { data: existing } = await supabase
      .from("clothing_items")
      .select("slug")
      .ilike("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    const clothingItemData: Database["public"]["Tables"]["clothing_items"]["Insert"] = {
      name: data.clothingItem.name,
      slug,
      type: data.clothingItem.type,
      era: data.clothingItem.era,
      description: data.clothingItem.description || null,
      color: data.clothingItem.color || null,
      size: data.clothingItem.size || null,
      origin_country: data.clothingItem.originCountry || null,
      image_url: data.clothingItem.imageUrl || null,
      created_by: user.id,
      status: "pending",
      verification_score: 0,
    };

    const { data: clothingItem, error: clothingError } = await supabase
      .from("clothing_items")
      .insert(clothingItemData)
      .select()
      .single();

    if (clothingError) {
      console.error("Clothing item insert error:", clothingError);
      return { error: "Failed to create clothing item" };
    }

    // Step 2: Create tags (images are already uploaded on client)
    const tagIds: number[] = [];

    for (const identifier of completeIdentifiers) {
      const tagData: Database["public"]["Tables"]["tags"]["Insert"] = {
        user_id: user.id,
        brand_id: data.clothingItem.brandId,
        clothing_item_id: clothingItem.id,
        category: identifier.category,
        era: identifier.era,
        year_start: identifier.yearStart || null,
        year_end: identifier.yearEnd || null,
        stitch_type: identifier.stitchType || null,
        origin_country: identifier.originCountry || null,
        submission_notes: identifier.submissionNotes || null,
        image_url: identifier.croppedImage, // Already a URL from client upload
        status: "pending",
        verification_score: 0,
        position_x: identifier.positionX ?? null,
        position_y: identifier.positionY ?? null,
      };

      const { data: tag, error: tagError } = await supabase
        .from("tags")
        .insert(tagData)
        .select()
        .single();

      if (tagError) {
        console.error("Tag insert error:", tagError);
        continue;
      }

      tagIds.push(tag.id);
    }

    if (tagIds.length === 0) {
      // All identifiers failed - clean up clothing item
      await supabase.from("clothing_items").delete().eq("id", clothingItem.id);
      return { error: "Failed to create any identifiers" };
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/clothing");
    revalidatePath(`/clothing/${clothingItem.slug}`);

    return {
      success: true,
      clothingItemId: clothingItem.id,
      clothingItemSlug: clothingItem.slug,
      tagIds,
      tagCount: tagIds.length,
    };
  } catch (err: any) {
    console.error("Submit clothing with identifiers error:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
}
