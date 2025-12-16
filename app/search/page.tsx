import Link from "next/link";
import { FilterPanel } from "@/components/search/filter-panel";
import { TagGrid } from "@/components/tags/tag-grid";
import { getBrands, getBrandBySlug } from "@/lib/queries/brands";
import { getTags, type TagFilters } from "@/lib/queries/tags";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams;
  const brands = await getBrands();

  // Parse filters from search params
  const brandSlug = typeof search.brand === "string" ? search.brand : undefined;
  const category = typeof search.category === "string" ? search.category as TagFilters["category"] : undefined;
  const era = typeof search.era === "string" ? search.era as TagFilters["era"] : undefined;
  const stitchType = typeof search.stitch === "string" ? search.stitch as TagFilters["stitchType"] : undefined;
  const originCountry = typeof search.origin === "string" ? search.origin : undefined;
  const status = typeof search.status === "string" ? search.status as TagFilters["status"] : undefined;

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
          Search Identifiers
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          {tags.length} {tags.length === 1 ? "result" : "results"} found
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <FilterPanel brands={brands} />
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          {tags.length > 0 ? (
            <TagGrid tags={tags} />
          ) : (
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
                No tags found
              </h3>
              <p className="mt-2 text-sm text-stone-600 max-w-sm">
                Try adjusting your filters or be the first to contribute this
                identifier!
              </p>
              <Link href="/submit" className="mt-6">
                <button className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
                  Submit This Tag
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
