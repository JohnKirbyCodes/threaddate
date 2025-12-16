import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Tag, User, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VotingUI } from "@/components/tags/voting-ui";
import { getTagById, getUserVoteForTag } from "@/lib/queries/tag-detail";
import { createClient } from "@/lib/supabase/server";

interface TagDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { id } = await params;
  const tagId = parseInt(id);

  if (isNaN(tagId)) {
    notFound();
  }

  const tag = await getTagById(tagId);

  if (!tag) {
    notFound();
  }

  // Get current user and their vote
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userVote = user ? await getUserVoteForTag(tagId, user.id) : null;

  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      label: "Verified",
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      label: "Pending Verification",
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      label: "Rejected",
    },
  };

  const StatusIcon = statusConfig[tag.status].icon;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-stone-600">
        <Link href="/" className="hover:text-orange-600">
          Home
        </Link>
        {" / "}
        <Link href={`/brands/${tag.brands.slug}`} className="hover:text-orange-600">
          {tag.brands.name}
        </Link>
        {" / "}
        <span className="text-stone-900">Tag #{tag.id}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image and Voting */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <VotingUI
                  tagId={tag.id}
                  currentScore={tag.verification_score}
                  userVote={userVote}
                  isAuthenticated={!!user}
                />

                <div className="flex-1">
                  <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-lg bg-stone-100">
                    <img
                      src={tag.image_url}
                      alt={`${tag.brands.name} ${tag.category}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{tag.brands.name} - {tag.category}</CardTitle>
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusConfig[tag.status].bg} ${statusConfig[tag.status].color}`}
                >
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig[tag.status].label}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    <strong>Era:</strong> {tag.era}
                  </span>
                </div>

                {tag.year_start && tag.year_end && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      <strong>Years:</strong> {tag.year_start}-{tag.year_end}
                    </span>
                  </div>
                )}

                {tag.origin_country && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      <strong>Origin:</strong> {tag.origin_country}
                    </span>
                  </div>
                )}

                {tag.stitch_type && (
                  <div className="flex items-center gap-2 text-stone-600">
                    <Tag className="h-4 w-4" />
                    <span>
                      <strong>Stitch:</strong> {tag.stitch_type}
                    </span>
                  </div>
                )}
              </div>

              {tag.submission_notes && (
                <div className="mt-4 rounded-md bg-stone-50 p-4">
                  <div className="flex items-start gap-2 text-stone-700">
                    <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Submission Notes</p>
                      <p className="mt-1 text-sm text-stone-600">
                        {tag.submission_notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence */}
          {tag.tag_evidence && tag.tag_evidence.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Supporting Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {tag.tag_evidence.map((evidence) => (
                    <div key={evidence.id} className="space-y-2">
                      <div className="aspect-square overflow-hidden rounded-md bg-stone-100">
                        <img
                          src={evidence.image_url}
                          alt={evidence.description || "Evidence"}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      {evidence.description && (
                        <p className="text-sm text-stone-600">
                          {evidence.description}
                        </p>
                      )}
                      {evidence.evidence_type && (
                        <span className="inline-block rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-600">
                          {evidence.evidence_type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/brands/${tag.brands.slug}`}>
                <div className="flex items-center gap-3 hover:opacity-80">
                  {tag.brands.logo_url ? (
                    <img
                      src={tag.brands.logo_url}
                      alt={tag.brands.name}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-stone-100 text-xl font-bold text-stone-400">
                      {tag.brands.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-stone-900">
                      {tag.brands.name}
                    </p>
                    {tag.brands.founded_year && (
                      <p className="text-sm text-stone-500">
                        Est. {tag.brands.founded_year}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Submitter Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submitted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {tag.profiles.avatar_url ? (
                  <img
                    src={tag.profiles.avatar_url}
                    alt={tag.profiles.username || "User"}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-stone-900">
                    {tag.profiles.username || "Anonymous"}
                  </p>
                  <p className="text-sm text-stone-500">
                    {tag.profiles.reputation_score} reputation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-stone-600">
              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(tag.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Category:</strong> {tag.category}
              </p>
              <p>
                <strong>ID:</strong> #{tag.id}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
