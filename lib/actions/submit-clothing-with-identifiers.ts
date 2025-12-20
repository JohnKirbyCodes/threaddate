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
  imageBase64?: string; // Photo of the clothing item
}

interface IdentifierData {
  id: string;
  croppedImage: string;
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
    // Step 1: Upload clothing image if provided
    let clothingImageUrl: string | null = null;
    if (data.clothingItem.imageBase64) {
      const base64Data = data.clothingItem.imageBase64.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const clothingFilename = `clothing/${user.id}/${Date.now()}.png`;

      const { error: clothingUploadError } = await supabase.storage
        .from("tag-images")
        .upload(clothingFilename, buffer, {
          contentType: "image/png",
          cacheControl: "3600",
        });

      if (!clothingUploadError) {
        const { data: urlData } = supabase.storage
          .from("tag-images")
          .getPublicUrl(clothingFilename);
        clothingImageUrl = urlData.publicUrl;
      }
    }

    // Step 2: Create clothing item
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
      image_url: clothingImageUrl,
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

    // Step 2: Upload images and create tags
    const tagIds: number[] = [];

    for (const identifier of completeIdentifiers) {
      // Convert base64 to buffer
      const base64Data = identifier.croppedImage.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      // Generate unique filename
      const filename = `${user.id}/${Date.now()}-${identifier.id.slice(0, 8)}.png`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("tag-images")
        .upload(filename, buffer, {
          contentType: "image/png",
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        // Continue with other identifiers, don't fail entire submission
        continue;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("tag-images").getPublicUrl(filename);

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
        image_url: publicUrl,
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
