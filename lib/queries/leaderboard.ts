import { createClient } from "@/lib/supabase/server";

export async function getLeaderboardUsers(limit = 50) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      avatar_url,
      reputation_score,
      role,
      created_at
    `)
    .not("username", "is", null) // Only show users with usernames
    .order("reputation_score", { ascending: false })
    .order("created_at", { ascending: true }) // Tie-breaker: earlier members rank higher
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data || [];
}

export async function getUserStats(userId: string) {
  const supabase = await createClient();

  // Get tag counts
  const { count: totalTags } = await supabase
    .from("tags")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: verifiedTags } = await supabase
    .from("tags")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "verified");

  const { count: votesCast } = await supabase
    .from("votes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return {
    totalTags: totalTags || 0,
    verifiedTags: verifiedTags || 0,
    votesCast: votesCast || 0,
  };
}
