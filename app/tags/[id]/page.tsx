import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin, Tag, ExternalLink, CheckCircle2, Clock, XCircle, Shirt } from "lucide-react";
import { VotingUI } from "@/components/tags/voting-ui";
import { getTagById, getUserVoteForTag } from "@/lib/queries/tag-detail";
import { createClient } from "@/lib/supabase/server";
import { IdentifierSchema, BreadcrumbSchema } from "@/components/seo/json-ld";
import { buildEbaySearchUrl } from "@/lib/utils/affiliate";

// Helper to check if a string looks like an email
function looksLikeEmail(str: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

// Get safe display name that never exposes emails
function getSafeDisplayName(username: string | null): string {
  if (!username) return "Contributor";
  if (looksLikeEmail(username)) return "Contributor";
  return username;
}

interface TagDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TagDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const tagId = parseInt(id);

  if (isNaN(tagId)) {
    return {
      title: "Identifier Not Found | ThreadDate",
    };
  }

  const tag = await getTagById(tagId);

  if (!tag) {
    return {
      title: "Identifier Not Found | ThreadDate",
    };
  }

  const brandName = tag.brands?.name || "Unknown Brand";
  const category = tag.category || "Identifier";
  const era = tag.era || "";

  const title = `${brandName} ${category}${era ? ` - ${era}` : ""} | ThreadDate`;
  const description = `${brandName} ${category.toLowerCase()} from ${era || "vintage era"}. Community-documented vintage clothing identifier on ThreadDate.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: tag.image_url ? [{ url: tag.image_url, alt: `${brandName} ${category}` }] : [],
    },
    twitter: {
      card: tag.image_url ? "summary_large_image" : "summary",
      title,
      description,
      images: tag.image_url ? [tag.image_url] : [],
    },
  };
}

// Marketplace search URLs - format: "vintage {era} {brand} clothing"
function buildSearchUrls(brandName: string, era?: string) {
  // Build era-specific query: "vintage 1970s Sears clothing"
  const isModern = era?.includes("Modern");
  const searchQuery = isModern
    ? `${brandName} clothing`
    : `vintage${era ? ` ${era}` : ""} ${brandName} clothing`;
  const query = encodeURIComponent(searchQuery);

  return {
    ebay: buildEbaySearchUrl(searchQuery),
    amazon: `https://www.amazon.com/s?k=${query}&i=fashion`,
    poshmark: `https://poshmark.com/search?query=${query}&type=listings`,
    depop: `https://www.depop.com/search/?q=${query}`,
    etsy: `https://www.etsy.com/search?q=${query}&explicit=1&category=clothing`,
  };
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
      bg: "bg-green-50 border-green-200",
      label: "Verified",
    },
    pending: {
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
      label: "Pending",
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      label: "Rejected",
    },
  };

  const safeStatus = tag.status || "pending";
  const StatusIcon = statusConfig[safeStatus].icon;
  const marketplaceUrls = buildSearchUrls(tag.brands.name, tag.era);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* JSON-LD Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://threaddate.com" },
          { name: tag.brands.name, url: `https://threaddate.com/brands/${tag.brands.slug}` },
          { name: tag.category },
        ]}
      />
      <IdentifierSchema
        brandName={tag.brands.name}
        category={tag.category}
        era={tag.era}
        imageUrl={tag.image_url}
        datePublished={tag.created_at}
        description={tag.submission_notes}
      />

      {/* Header */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-500 mb-4">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          {" / "}
          <Link href={`/brands/${tag.brands.slug}`} className="hover:text-orange-600">{tag.brands.name}</Link>
          {" / "}
          <span className="text-stone-700">{tag.category}</span>
        </nav>

        {/* Title Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Brand Logo */}
            <Link href={`/brands/${tag.brands.slug}`} className="shrink-0">
              {tag.brands.logo_url ? (
                <img
                  src={tag.brands.logo_url}
                  alt={tag.brands.name}
                  className="h-14 w-14 object-contain rounded-lg bg-white border border-stone-200 p-1"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{tag.brands.name.charAt(0)}</span>
                </div>
              )}
            </Link>

            {/* Title & Era */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900">
                {tag.brands.name} {tag.category}
              </h1>
              <p className="text-lg text-stone-600 mt-0.5">
                {tag.era}
                {tag.year_start && tag.year_end && ` (${tag.year_start}–${tag.year_end})`}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium shrink-0 ${statusConfig[safeStatus].bg} ${statusConfig[safeStatus].color}`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig[safeStatus].label}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image + Voting */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-stone-200 p-4 md:p-6">
            <div className="flex gap-4 md:gap-6">
              {/* Voting */}
              <VotingUI
                tagId={tag.id}
                currentScore={tag.verification_score || 0}
                userVote={userVote}
                isAuthenticated={!!user}
              />

              {/* Image */}
              <div className="flex-1">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-stone-50">
                  <img
                    src={tag.image_url}
                    alt={`${tag.brands.name} ${tag.category}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="mt-4 flex flex-wrap gap-3">
            {tag.origin_country && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full text-sm text-stone-700">
                <MapPin className="h-3.5 w-3.5" />
                Made in {tag.origin_country}
              </div>
            )}
            {tag.stitch_type && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full text-sm text-stone-700">
                <Tag className="h-3.5 w-3.5" />
                {tag.stitch_type} stitch
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full text-sm text-stone-700">
              <Calendar className="h-3.5 w-3.5" />
              {tag.era}
            </div>
          </div>

          {/* Submission Notes */}
          {tag.submission_notes && (
            <div className="mt-4 bg-stone-50 rounded-lg p-4 border border-stone-200">
              <p className="text-sm font-medium text-stone-700 mb-1">Notes</p>
              <p className="text-sm text-stone-600">{tag.submission_notes}</p>
            </div>
          )}

          {/* Evidence */}
          {tag.tag_evidence && tag.tag_evidence.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-stone-900 mb-3">Supporting Evidence</h2>
              <div className="grid grid-cols-2 gap-4">
                {tag.tag_evidence.map((evidence) => (
                  <div key={evidence.id} className="bg-white rounded-lg border border-stone-200 overflow-hidden">
                    <div className="aspect-square bg-stone-50">
                      <img
                        src={evidence.image_url}
                        alt={evidence.description || "Evidence"}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    {(evidence.description || evidence.evidence_type) && (
                      <div className="p-3">
                        {evidence.description && (
                          <p className="text-sm text-stone-600">{evidence.description}</p>
                        )}
                        {evidence.evidence_type && (
                          <span className="inline-block mt-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {evidence.evidence_type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* From Clothing Item */}
          {tag.clothing_items && (
            <Link
              href={`/clothing/${tag.clothing_items.slug}`}
              className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-orange-300 hover:shadow-sm transition-all"
            >
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">From Garment</p>
              <div className="flex items-center gap-3">
                {tag.clothing_items.image_url ? (
                  <img
                    src={tag.clothing_items.image_url}
                    alt={tag.clothing_items.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-stone-100 flex items-center justify-center">
                    <Shirt className="h-6 w-6 text-stone-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 truncate">{tag.clothing_items.name}</p>
                  <p className="text-sm text-stone-500">{tag.clothing_items.type}</p>
                </div>
              </div>
            </Link>
          )}

          {/* Shop Similar */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">Shop Similar</p>
            <div className="space-y-2">
              {/* Primary marketplaces */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={marketplaceUrls.ebay}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                >
                  eBay
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={marketplaceUrls.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-amber-700 hover:bg-amber-50 hover:border-amber-200 transition-colors cursor-pointer"
                >
                  Amazon
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              {/* Secondary marketplaces */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={marketplaceUrls.poshmark}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                >
                  Poshmark
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={marketplaceUrls.depop}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                >
                  Depop
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={marketplaceUrls.etsy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer"
                >
                  Etsy
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* View All Brand Identifiers */}
          <Link
            href={`/brands/${tag.brands.slug}`}
            className="flex items-center justify-between bg-orange-50 rounded-xl border border-orange-200 p-4 hover:bg-orange-100 transition-colors"
          >
            <div>
              <p className="font-medium text-orange-900">View all {tag.brands.name} identifiers</p>
              <p className="text-sm text-orange-700">Browse the full collection</p>
            </div>
            <ExternalLink className="h-5 w-5 text-orange-600" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-stone-200">
        <p className="text-sm text-stone-500">
          Contributed by <span className="font-medium text-stone-700">{getSafeDisplayName(tag.profiles.username)}</span>
          {tag.created_at && (
            <> on {new Date(tag.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
          )}
        </p>
      </div>
    </div>
  );
}
