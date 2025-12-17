import Link from "next/link";
import { FilterPanel } from "@/components/search/filter-panel";
import { TagGrid } from "@/components/tags/tag-grid";
import { BrandCard } from "@/components/brands/brand-card";
import { getBrands, getBrandBySlug, searchBrands } from "@/lib/queries/brands";
import { getTags, type TagFilters } from "@/lib/queries/tags";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams;
  const brands = await getBrands();

  // Parse query and filters from search params
  const query = typeof search.q === "string" ? search.q : undefined;
  const brandSlug = typeof search.brand === "string" ? search.brand : undefined;
  const category = typeof search.category === "string" ? search.category as TagFilters["category"] : undefined;
  const era = typeof search.era === "string" ? search.era as TagFilters["era"] : undefined;
  const stitchType = typeof search.stitch === "string" ? search.stitch as TagFilters["stitchType"] : undefined;
  const originCountry = typeof search.origin === "string" ? search.origin : undefined;
  const status = typeof search.status === "string" ? search.status as TagFilters["status"] : undefined;

  // Search for matching brands if query is provided
  const matchingBrands = query ? await searchBrands(query) : [];

  // Get brand ID if brand slug is provided
  let brandId: number | undefined;
  if (brandSlug) {
    const brand = await getBrandBySlug(brandSlug);
    brandId = brand?.id;
  }

  // Fetch filtered tags
  const tags = await getTags(
    {
      brandId,
      category,
      era,
      stitchType,
      originCountry,
      status,
    },
    100
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">
          {query ? `Search Results for "${query}"` : "Search Identifiers"}
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          {matchingBrands.length > 0 && (
            <span className="mr-4">
              {matchingBrands.length} {matchingBrands.length === 1 ? "brand" : "brands"}
            </span>
          )}
          {tags.length} {tags.length === 1 ? "identifier" : "identifiers"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <FilterPanel brands={brands} />
        </aside>

        {/* Results */}
        <div className="lg:col-span-3 space-y-8">
          {/* Matching Brands */}
          {matchingBrands.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Brands</h2>
              <div className="space-y-3">
                {matchingBrands.map((brand: any) => (
                  <BrandCard
                    key={brand.id}
                    id={brand.id}
                    name={brand.name}
                    slug={brand.slug}
                    logoUrl={brand.logo_url}
                    tagCount={brand.tags?.[0]?.count}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Identifiers */}
          {tags.length > 0 ? (
            <div>
              {matchingBrands.length > 0 && (
                <h2 className="text-2xl font-bold text-stone-900 mb-4">Identifiers</h2>
              )}
              <TagGrid tags={tags} />
            </div>
          ) : !matchingBrands.length ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-200 py-16 text-center">
              <div className="rounded-full bg-stone-100 p-6">
                <svg
                  className="h-12 w-12 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                No results found
              </h3>
              <p className="mt-2 text-sm text-stone-600 max-w-sm">
                {query
                  ? `No brands or identifiers found for "${query}". Try a different search term.`
                  : "Try adjusting your filters or be the first to contribute this identifier!"
                }
              </p>
              <Link href="/submit" className="mt-6">
                <button className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
                  Submit This Tag
                </button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
