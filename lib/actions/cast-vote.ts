"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function castVote(tagId: number, voteValue: 1 | -1) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to vote" };
  }

  // Upsert the vote (insert or update)
  const { error } = await supabase.from("votes").upsert(
    {
      user_id: user.id,
      tag_id: tagId,
      vote_value: voteValue,
    },
    {
      onConflict: "user_id,tag_id",
    }
  );

  if (error) {
    console.error("Error casting vote:", error);
    return { error: "Failed to cast vote" };
  }

  // Revalidate the tag detail page
  revalidatePath(`/tags/${tagId}`);

  return { success: true };
}

export async function removeVote(tagId: number) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to remove a vote" };
  }

  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("user_id", user.id)
    .eq("tag_id", tagId);

  if (error) {
    console.error("Error removing vote:", error);
    return { error: "Failed to remove vote" };
  }

  // Revalidate the tag detail page
  revalidatePath(`/tags/${tagId}`);

  return { success: true };
}
