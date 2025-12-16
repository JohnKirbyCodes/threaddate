import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TagGrid } from "@/components/tags/tag-grid";
import { getTags } from "@/lib/queries/tags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, TrendingUp, Clock, CheckCircle2, XCircle } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user's submissions
  const { data: userTags } = await supabase
    .from("tags")
    .select(
      `
      *,
      brands (
        id,
        name,
        slug,
        logo_url
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Count stats
  const pendingCount = userTags?.filter((t) => t.status === "pending").length || 0;
  const verifiedCount =
    userTags?.filter((t) => t.status === "verified").length || 0;
  const rejectedCount =
    userTags?.filter((t) => t.status === "rejected").length || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          {user.user_metadata.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={profile?.username || "User"}
              className="h-24 w-24 rounded-full ring-4 ring-orange-100"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-600 ring-4 ring-orange-50">
              <User className="h-12 w-12" />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              {profile?.username || user.email}
            </h1>
            <p className="text-stone-600">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-orange-600">
                {profile?.reputation_score || 0} reputation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-600">
              Total Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-stone-900">
              {userTags?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-600 flex items-center gap-1">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-stone-600 flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900 mb-6">
          Your Submissions
        </h2>
        {userTags && userTags.length > 0 ? (
          <TagGrid tags={userTags} />
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
            <p className="text-stone-600 mb-4">
              You haven't submitted any identifiers yet
            </p>
            <a
              href="/submit"
              className="inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
            >
              Submit Your First Identifier
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
