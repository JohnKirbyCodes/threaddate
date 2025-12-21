import Link from "next/link";
import type { Metadata } from "next";
import { Shirt, Calendar, CheckCircle2, Clock } from "lucide-react";
import { FilterPanel } from "@/components/search/filter-panel";
import { TagGrid } from "@/components/tags/tag-grid";
import { BrandCard } from "@/components/brands/brand-card";
import { getBrands, getBrandBySlug, searchBrands } from "@/lib/queries/brands";
import { getTags, type TagFilters } from "@/lib/queries/tags";
import { searchClothingItemsByBrand, getFilteredClothingItems } from "@/lib/queries/clothing-items";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Search Vintage Clothing Identifiers | ThreadDate",
  description: "Search and filter vintage clothing tags, labels, buttons, and zippers across 260+ brands and multiple decades. Find identifiers by brand, era, category, or origin country.",
  openGraph: {
    title: "Search Vintage Clothing Identifiers | ThreadDate",
    description: "Search and filter vintage clothing tags, labels, buttons, and zippers across 260+ brands and multiple decades.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Search Vintage Clothing Identifiers | ThreadDate",
    description: "Search and filter vintage clothing tags, labels, buttons, and zippers across 260+ brands.",
  },
};

type ClothingType = Database["public"]["Enums"]["clothing_type_enum"];

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
  const clothingType = typeof search.clothingType === "string" ? search.clothingType as ClothingType : undefined;

  // Search for matching brands if query is provided
  const matchingBrands = query ? await searchBrands(query) : [];

  // Get clothing items - either by search query or by filters
  const hasClothingFilters = clothingType || era || originCountry;
  let matchingClothingItems: any[] = [];

  if (query) {
    // Search by brand name when query is provided
    matchingClothingItems = await searchClothingItemsByBrand(query, 20);
    // Apply additional filters if set
    if (clothingType) {
      matchingClothingItems = matchingClothingItems.filter(item => item.type === clothingType);
    }
    if (era) {
      matchingClothingItems = matchingClothingItems.filter(item => item.era === era);
    }
  } else if (hasClothingFilters) {
    // No query but filters are set - get filtered clothing items
    matchingClothingItems = await getFilteredClothingItems({
      type: clothingType,
      era,
      originCountry,
    }, 20);
  }

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
          {matchingClothingItems.length > 0 && (
            <span className="mr-4">
              {matchingClothingItems.length} {matchingClothingItems.length === 1 ? "clothing item" : "clothing items"}
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

          {/* Matching Clothing Items */}
          {matchingClothingItems.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Clothing Items</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {matchingClothingItems.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/clothing/${item.slug}`}
                    className="group flex gap-4 rounded-lg border border-stone-200 bg-white p-4 hover:border-orange-300 hover:shadow-md transition-all"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-20 w-20 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-md bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <Shirt className="h-8 w-8 text-stone-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-stone-900 group-hover:text-orange-600 truncate">
                          {item.name}
                        </p>
                        {item.status === "verified" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : item.status === "pending" ? (
                          <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        ) : null}
                      </div>
                      <p className="text-sm text-stone-600 mt-0.5">{item.type}</p>
                      {item.era && (
                        <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.era}
                        </p>
                      )}
                      {item.brand && (
                        <p className="text-xs text-stone-400 mt-1">
                          by {item.brand.name}
                        </p>
                      )}
                    </div>
                  </Link>
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
          ) : !matchingBrands.length && !matchingClothingItems.length ? (
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
