import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { BRAND_GUIDES } from "@/lib/data/brand-guides";
import { getBrandBySlug } from "@/lib/queries/brands";

export const metadata: Metadata = {
  title: "Vintage Dating Guides | ThreadDate",
  description: "Comprehensive guides to dating vintage clothing from top brands like Levi's, Nike, and Champion. Learn to identify eras by tags, labels, and construction.",
  openGraph: {
    title: "Vintage Clothing Dating Guides | ThreadDate",
    description: "Learn to date vintage clothing with our comprehensive brand guides.",
    type: "website",
  },
};

export default async function GuidesPage() {
  const guides = Object.values(BRAND_GUIDES);

  // Fetch brand data for logos
  const brandsData = await Promise.all(
    guides.map(async (guide) => {
      const brand = await getBrandBySlug(guide.brandSlug);
      return { guide, brand };
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://threaddate.com" },
          { name: "Guides" },
        ]}
      />

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              Vintage Dating Guides
            </h1>
            <p className="text-lg text-stone-600">
              Comprehensive guides for authenticating and dating vintage clothing
            </p>
          </div>
        </div>

        <p className="text-stone-700 leading-relaxed max-w-3xl mt-4">
          Our pillar guides provide in-depth information on dating vintage clothing from
          the most sought-after brands. Learn to identify eras by tag styles, manufacturing
          locations, construction details, and more.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brandsData.map(({ guide, brand }) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all"
          >
            {/* Header with Logo */}
            <div className="p-6 pb-4 flex items-center gap-4">
              {brand?.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={guide.brandName}
                  className="h-14 w-14 object-contain rounded-lg bg-stone-50 border border-stone-100 p-2"
                />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {guide.brandName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                  {guide.brandName}
                </h2>
                <p className="text-sm text-stone-500">Dating Guide</p>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-4">
              <p className="text-stone-600 text-sm line-clamp-2">
                {guide.description}
              </p>
            </div>

            {/* Eras covered */}
            <div className="px-6 pb-4">
              <p className="text-xs text-stone-500 mb-2">Eras covered:</p>
              <div className="flex flex-wrap gap-1.5">
                {guide.eraSections.map((section) => (
                  <span
                    key={section.era}
                    className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                  >
                    {section.era}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
                Read Guide
              </span>
              <ArrowRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="mt-12 bg-stone-50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          More Guides Coming Soon
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto">
          We're working on comprehensive dating guides for Carhartt, Patagonia,
          The North Face, Ralph Lauren, and more. Check back soon!
        </p>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-stone-600 mb-4">
          Know a brand inside and out? Help us write a guide!
        </p>
        <Link
          href="/contribute"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
        >
          Learn how to contribute
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
