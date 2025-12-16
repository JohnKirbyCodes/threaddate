import { notFound } from "next/navigation";
import Link from "next/link";
import { EraGroupedTagGrid } from "@/components/tags/era-grouped-tag-grid";
import { getBrandBySlug } from "@/lib/queries/brands";
import { getTags, type TagFilters } from "@/lib/queries/tags";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  // Get filters from search params
  const category = typeof search.category === "string" ? search.category as TagFilters["category"] : undefined;
  const era = typeof search.era === "string" ? search.era as TagFilters["era"] : undefined;

  // Fetch tags for this brand, ordered chronologically (newest to oldest)
  const tags = await getTags({
    brandId: brand.id,
    category,
    era,
    // Show all tags regardless of status - tags have badges to show pending/verified
    orderBy: "year_start",
    orderDirection: "desc",
  }, 50);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-stone-600">
        <Link href="/" className="hover:text-orange-600">
          Home
        </Link>
        {" / "}
        <Link href="/brands" className="hover:text-orange-600">
          Brands
        </Link>
        {" / "}
        <span className="text-stone-900">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-6">
        {brand.logo_url ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]" />
            <span className="relative text-4xl font-bold text-white">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-stone-900">{brand.name}</h1>
          {brand.founded_year && (
            <p className="mt-1 text-lg text-stone-600">
              Founded in {brand.founded_year}
            </p>
          )}
          {brand.description && (
            <p className="mt-3 text-stone-700 leading-relaxed max-w-2xl">
              {brand.description}
            </p>
          )}
          <p className="mt-2 text-sm text-stone-500">
            {tags.length} identifiers
          </p>

          {/* Affiliate Links */}
          {(brand.website_url || brand.wikipedia_url || brand.ebay_url || brand.poshmark_url || brand.depop_url) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {brand.website_url && (
                <a
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Website
                </a>
              )}
              {brand.wikipedia_url && (
                <a
                  href={brand.wikipedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-stone-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1 4.5v3h3v2h-3v3h-2v-3H6v-2h3v-3h2z"/>
                  </svg>
                  Wikipedia
                </a>
              )}
              {brand.ebay_url && (
                <a
                  href={brand.ebay_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.021 12.111v-.178c0-.799.588-1.437 1.316-1.437.755 0 1.318.638 1.318 1.437v.178c0 .799-.563 1.444-1.318 1.444-.728 0-1.316-.645-1.316-1.444zm6.694-.799c-.793 0-1.318.602-1.397 1.491h2.794c-.018-.889-.559-1.491-1.397-1.491zm-9.933 0c-.819 0-1.336.602-1.397 1.491h2.794c-.018-.889-.545-1.491-1.397-1.491zm13.366 1.491c-.061-.889-.578-1.491-1.397-1.491-.838 0-1.379.602-1.397 1.491h2.794z"/>
                  </svg>
                  eBay
                </a>
              )}
              {brand.poshmark_url && (
                <a
                  href={brand.poshmark_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  Poshmark
                </a>
              )}
              {brand.depop_url && (
                <a
                  href={brand.depop_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  Depop
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/brands/${slug}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !category && !era
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          All
        </Link>
        <Link
          href={`/brands/${slug}?category=Neck+Tag`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Neck Tag"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Neck Tags
        </Link>
        <Link
          href={`/brands/${slug}?category=Care+Tag`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Care Tag"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Care Tags
        </Link>
        <Link
          href={`/brands/${slug}?category=Button/Snap`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Button/Snap"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Buttons
        </Link>
        <Link
          href={`/brands/${slug}?category=Tab`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Tab"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Tabs
        </Link>
      </div>

      {/* Tags Grid - Grouped by Era */}
      {tags.length > 0 ? (
        <EraGroupedTagGrid tags={tags} />
      ) : (
        <div className="text-center py-12">
          <p className="text-stone-600">
            No identifiers found for {brand.name}.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700 font-medium"
          >
            Be the first to submit →
          </Link>
        </div>
      )}
    </div>
  );
}
