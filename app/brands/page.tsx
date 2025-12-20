import type { Metadata } from "next";
import { BrandsHero } from "@/components/brands/brands-hero";
import { BrandsPageClient } from "@/components/brands/brands-page-client";
import {
  getBrandsWithTagCounts,
  getFeaturedBrands,
  getBrandStats,
} from "@/lib/queries/brands";

export const metadata: Metadata = {
  title: "Browse Vintage Clothing Brands | ThreadDate",
  description:
    "Explore 260+ vintage clothing brands. Find tag guides, identifiers, and era references for Nike, Adidas, Champion, Levi's, and more.",
  openGraph: {
    title: "Browse 260+ Vintage Clothing Brands | ThreadDate",
    description:
      "Comprehensive guide to vintage clothing brands. Date your finds with community-verified identifiers.",
    type: "website",
  },
};

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
          featuredBrands={featuredBrands}
        />
      </div>

      {/* Client-side filtered brand list */}
      <BrandsPageClient brands={brands} />
    </div>
  );
}
