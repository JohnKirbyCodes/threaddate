import Link from "next/link";
import { Card } from "@/components/ui/card";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  founded_year: number | null;
}

interface BrandGridProps {
  brands: Brand[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brands/${brand.slug}`}>
          <Card className="group overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-orange-500">
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
            <div className="border-t border-stone-100 bg-white p-3 text-center">
              <h3 className="font-semibold text-stone-900 truncate">
                {brand.name}
              </h3>
              {brand.founded_year && (
                <p className="text-xs text-stone-500">
                  Est. {brand.founded_year}
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
