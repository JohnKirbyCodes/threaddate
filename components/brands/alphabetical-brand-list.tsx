import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Tag, ChevronRight } from "lucide-react";
import { getCountryFlagEmoji } from "@/lib/utils/country-flags";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  founded_year: number | null;
  verified?: boolean;
  description?: string | null;
  tag_count?: number;
  country_code?: string | null;
}

interface AlphabeticalBrandListProps {
  brands: Brand[];
  viewMode: "grid" | "list";
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function AlphabeticalBrandList({
  brands,
  viewMode,
}: AlphabeticalBrandListProps) {
  // Group brands by first letter
  const groupedBrands = brands.reduce((acc, brand) => {
    const firstLetter = brand.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, Brand[]>);

  // Get letters that have brands
  const lettersWithBrands = ALPHABET.filter((letter) => groupedBrands[letter]);

  if (lettersWithBrands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">No brands found.</p>
      </div>
    );
  }

  return (
    <div id="browse" className="scroll-mt-24 space-y-12">
      {lettersWithBrands.map((letter) => {
        const brandsInSection = groupedBrands[letter];
        return (
          <section
            key={letter}
            id={`letter-${letter}`}
            className="scroll-mt-24"
          >
            {/* Section Header */}
            <div className="border-b border-stone-200 pb-3 mb-6">
              <h2 className="text-3xl font-bold text-stone-900">{letter}</h2>
              <p className="text-sm text-stone-500 mt-1">
                {brandsInSection.length}{" "}
                {brandsInSection.length === 1 ? "brand" : "brands"}
              </p>
            </div>

            {/* Brands Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {brandsInSection.map((brand) => (
                  <BrandCardGrid key={brand.id} brand={brand} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {brandsInSection.map((brand) => (
                  <BrandCardList key={brand.id} brand={brand} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

// Grid View Card
function BrandCardGrid({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`}>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-orange-500">
        {/* Verification Badge */}
        {brand.verified && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-green-600 text-white rounded-full p-1">
              <CheckCircle2 className="h-3 w-3" />
            </div>
          </div>
        )}

        {/* Logo */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-6">
          {brand.logo_url ? (
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-full w-full object-contain transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-100 text-2xl font-bold text-stone-400">
              {brand.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="border-t border-stone-100 bg-white p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-stone-900 truncate flex-1">
              {brand.country_code && <span className="mr-1">{getCountryFlagEmoji(brand.country_code)}</span>}
              {brand.name}
            </h3>
            {brand.verified && (
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center justify-between mt-1 text-xs text-stone-500">
            {brand.founded_year && <span>Est. {brand.founded_year}</span>}
            {brand.tag_count !== undefined && brand.tag_count > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {brand.tag_count}
              </span>
            )}
          </div>
        </div>

        {/* Hover overlay with description */}
        {brand.description && (
          <div className="absolute inset-0 bg-white/95 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-sm text-stone-700 line-clamp-6 text-center">
              {brand.description}
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}

// List View Card
function BrandCardList({ brand }: { brand: Brand }) {
  return (
    <Link href={`/brands/${brand.slug}`}>
      <Card className="group p-4 transition-all hover:shadow-md hover:ring-2 hover:ring-orange-500">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-16 h-16 flex-shrink-0 bg-white rounded border border-stone-200 p-2 overflow-hidden">
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={brand.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-stone-100 text-lg font-bold text-stone-400">
                {brand.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-stone-900 truncate">
                {brand.country_code && <span className="mr-1">{getCountryFlagEmoji(brand.country_code)}</span>}
                {brand.name}
              </h3>
              {brand.verified && (
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              )}
            </div>
            {brand.description && (
              <p className="text-sm text-stone-600 line-clamp-2 mt-1">
                {brand.description}
              </p>
            )}
            <div className="flex gap-4 mt-2 text-xs text-stone-500">
              {brand.founded_year && (
                <span>Founded {brand.founded_year}</span>
              )}
              {brand.tag_count !== undefined && brand.tag_count > 0 && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {brand.tag_count}{" "}
                  {brand.tag_count === 1 ? "identifier" : "identifiers"}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="text-stone-400 group-hover:text-orange-600 flex-shrink-0" />
        </div>
      </Card>
    </Link>
  );
}
