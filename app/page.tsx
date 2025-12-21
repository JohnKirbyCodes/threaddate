import Link from "next/link";
import type { Metadata } from "next";
import { Plus, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandGrid } from "@/components/home/brand-grid";
import { EraSlider } from "@/components/home/era-slider";
import { TagGrid } from "@/components/tags/tag-grid";
import { SearchBar } from "@/components/layout/search-bar";
import { getFeaturedBrands, getBrandStats } from "@/lib/queries/brands";
import { getRecentTags, getTotalTagCount } from "@/lib/queries/tags";

export const metadata: Metadata = {
  title: "ThreadDate | Date Your Vintage Clothing Finds",
  description:
    "Community-driven database for dating vintage clothing. Identify tags, buttons, zippers, and labels from 260+ brands across 10+ decades. Built by collectors, for collectors.",
  openGraph: {
    title: "ThreadDate - Vintage Clothing Identifier Database",
    description:
      "Date your vintage finds using our crowdsourced tag and identifier reference. Browse 260+ brands and community-verified identifiers.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ThreadDate | Date Your Vintage Clothing",
    description:
      "Community-driven database for dating vintage clothing tags, buttons, and identifiers.",
  },
};

export default async function HomePage() {
  const [featuredBrands, recentTags, brandStats, totalSubmissions] = await Promise.all([
    getFeaturedBrands(),
    getRecentTags(12),
    getBrandStats(),
    getTotalTagCount(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold text-stone-900 md:text-5xl lg:text-6xl">
          Date Your Vintage Finds
        </h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Crowdsourced database for dating vintage clothing tags, buttons,
          zippers, and identifiers. Built by collectors, for collectors.
        </p>

        {/* Desktop Search */}
        <div className="hidden md:block max-w-2xl mx-auto pt-6">
          <SearchBar
            size="large"
            className="w-full"
            placeholder="Search brands, eras, or identifiers..."
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/search">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Database
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Identifier
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Featured Brands</h2>
          <Link
            href="/brands"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            View All →
          </Link>
        </div>
        <BrandGrid brands={featuredBrands} />
      </section>

      {/* Era Slider - Mobile Optimized */}
      <section className="md:hidden">
        <EraSlider />
      </section>

      {/* Recent Submissions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h2 className="text-2xl font-bold text-stone-900">
              Recently Submitted
            </h2>
          </div>
          <Link
            href="/search"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            View All →
          </Link>
        </div>
        <TagGrid tags={recentTags} />
      </section>

      {/* Stats Section */}
      <section className="rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-center">
          <div>
            <p className="text-4xl font-bold">{brandStats.totalBrands}+</p>
            <p className="mt-2 text-orange-100">Brands Catalogued</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{totalSubmissions}+</p>
            <p className="mt-2 text-orange-100">Community Submissions</p>
          </div>
          <div>
            <p className="text-4xl font-bold">10+</p>
            <p className="mt-2 text-orange-100">Decades Covered</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-900 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
              1
            </div>
            <h3 className="font-semibold text-stone-900">Submit</h3>
            <p className="text-sm text-stone-600">
              Upload photos of vintage clothing tags, buttons, zippers, or other
              identifiers
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
              2
            </div>
            <h3 className="font-semibold text-stone-900">Verify</h3>
            <p className="text-sm text-stone-600">
              Community votes on accuracy using catalogs, copyright dates, and
              evidence
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
              3
            </div>
            <h3 className="font-semibold text-stone-900">Reference</h3>
            <p className="text-sm text-stone-600">
              Use the database to date your vintage finds and authenticate pieces
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
