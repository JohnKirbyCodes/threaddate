"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

interface SubmitTagData {
  brandId: number;
  category: string;
  era: string;
  yearStart?: number;
  yearEnd?: number;
  stitchType?: string;
  originCountry?: string;
  submissionNotes?: string;
  imageBase64: string;
}

export async function submitTag(data: SubmitTagData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit tags" };
  }

  try {
    // Convert base64 to buffer
    const base64Data = data.imageBase64.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    // Generate unique filename
    const filename = `${user.id}/${Date.now()}.jpg`;

    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("tag-images")
      .upload(filename, buffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload image" };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("tag-images").getPublicUrl(filename);

    // Insert tag record
    const tagData = {
      user_id: user.id,
      brand_id: data.brandId,
      category: data.category as Database["public"]["Enums"]["identifier_category_enum"],
      era: data.era as Database["public"]["Enums"]["era_enum"],
      year_start: data.yearStart,
      year_end: data.yearEnd,
      stitch_type: data.stitchType as Database["public"]["Enums"]["stitch_enum"] | undefined,
      origin_country: data.originCountry,
      submission_notes: data.submissionNotes,
      image_url: publicUrl,
      status: "pending" as const,
      verification_score: 0,
    } satisfies Database["public"]["Tables"]["tags"]["Insert"];

    const { data: tag, error: insertError } = await supabase
      .from("tags")
      .insert(tagData)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return { error: "Failed to create tag submission" };
    }

    // Revalidate relevant pages
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/brands/${data.brandId}`);

    return { success: true, tagId: tag.id };
  } catch (err: any) {
    console.error("Submit tag error:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
}
