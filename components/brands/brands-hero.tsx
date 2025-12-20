import Link from "next/link";
import { BrandGrid } from "@/components/home/brand-grid";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  founded_year: number | null;
}

interface BrandsHeroProps {
  totalBrands: number;
  featuredBrands: Brand[];
}

export function BrandsHero({
  totalBrands,
  featuredBrands,
}: BrandsHeroProps) {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-stone-50 py-12 mb-8 rounded-lg">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Explore Vintage Brands
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
            Discover {totalBrands} catalogued brands spanning over a century of fashion history
          </p>
        </div>

        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-stone-900 mb-2">
                Featured Brands
              </h2>
              <p className="text-stone-600">
                The Big 6 - Most popular vintage brands
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <BrandGrid brands={featuredBrands} />
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="#browse"
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Browse All Brands
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg border-2 border-orange-600 hover:bg-orange-50 transition-colors"
          >
            Submit a Brand
          </Link>
        </div>
      </div>
    </section>
  );
}
