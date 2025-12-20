import { createClient } from "@/lib/supabase/client";

/**
 * Upload an image to Supabase Storage from the client.
 * This avoids sending large base64 strings to server actions,
 * which can exceed Vercel's 4.5MB payload limit.
 */
export async function uploadImageToStorage(
  base64: string,
  folder: string = "uploads"
): Promise<string> {
  const supabase = createClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to upload images");
  }

  // Convert base64 to blob
  const base64Data = base64.split(",")[1];
  if (!base64Data) {
    throw new Error("Invalid base64 image data");
  }

  // Detect content type from base64 header
  const contentTypeMatch = base64.match(/^data:([^;]+);base64,/);
  const contentType = contentTypeMatch?.[1] || "image/png";

  // Determine file extension
  const extension = contentType.includes("jpeg") || contentType.includes("jpg")
    ? "jpg"
    : contentType.includes("webp")
      ? "webp"
      : "png";

  const blob = await fetch(base64).then(r => r.blob());

  // Generate unique filename with user folder for RLS
  const filename = `${user.id}/${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;

  const { error } = await supabase.storage
    .from("tag-images")
    .upload(filename, blob, {
      contentType,
      cacheControl: "3600",
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data } = supabase.storage.from("tag-images").getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage.
 * Useful for cleanup if user abandons form.
 */
export async function deleteImageFromStorage(publicUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract path from public URL
  const urlParts = publicUrl.split("/tag-images/");
  if (urlParts.length < 2) {
    console.warn("Invalid storage URL, cannot delete:", publicUrl);
    return;
  }

  const path = urlParts[1];

  const { error } = await supabase.storage
    .from("tag-images")
    .remove([path]);

  if (error) {
    console.error("Delete error:", error);
  }
}
