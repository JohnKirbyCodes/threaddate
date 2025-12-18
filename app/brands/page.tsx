import { BrandsHero } from "@/components/brands/brands-hero";
import { BrandsPageClient } from "@/components/brands/brands-page-client";
import {
  getBrandsWithTagCounts,
  getFeaturedBrands,
  getBrandStats,
} from "@/lib/queries/brands";

export default async function BrandsPage() {
  // Fetch all data in parallel
  const [brands, featuredBrands, stats] = await Promise.all([
    getBrandsWithTagCounts(),
    getFeaturedBrands(),
    getBrandStats(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <BrandsHero
          totalBrands={stats.totalBrands}
          verifiedBrands={stats.verifiedBrands}
          erasCovered={stats.erasCovered}
          featuredBrands={featuredBrands}
        />
      </div>

      {/* Client-side filtered brand list */}
      <BrandsPageClient brands={brands} />
    </div>
  );
}
