import { createClient } from "@/lib/supabase/server";

export async function getTagById(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select(
      `
      *,
      brands (
        id,
        name,
        slug,
        logo_url,
        founded_year
      ),
      profiles!tags_user_id_fkey (
        id,
        username,
        avatar_url,
        reputation_score
      ),
      clothing_items (
        id,
        name,
        slug,
        type,
        era,
        image_url
      ),
      tag_evidence (
        id,
        image_url,
        description,
        evidence_type
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching tag:", error);
    return null;
  }

  return data;
}

export async function getUserVoteForTag(tagId: number, userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votes")
    .select("vote_value")
    .eq("tag_id", tagId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user vote:", error);
    return null;
  }

  return data?.vote_value || null;
}
