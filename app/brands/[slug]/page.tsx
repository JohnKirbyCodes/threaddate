import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { EraGroupedTagGrid } from "@/components/tags/era-grouped-tag-grid";
import { getBrandBySlug } from "@/lib/queries/brands";
import { getTags, type TagFilters } from "@/lib/queries/tags";
import { MarketplaceHero } from "@/components/brands/marketplace-hero";
import { MarketplaceFooterCTA } from "@/components/brands/marketplace-footer-cta";
import { BrandTimeline } from "@/components/brands/brand-timeline";
import { getBrandEraDistribution } from "@/lib/queries/brand-analytics";
import { getCountryFlagEmoji, getCountryName } from "@/lib/utils/country-flags";
import { BrandCollectionSchema, BreadcrumbSchema } from "@/components/seo/json-ld";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: "Brand Not Found | ThreadDate",
    };
  }

  const countryName = brand.country_code ? getCountryName(brand.country_code) : null;
  const foundedText = brand.founded_year ? `Founded ${brand.founded_year}` : "";
  const countryText = countryName ? `${countryName} brand` : "";
  const descParts = [countryText, foundedText].filter(Boolean).join(". ");

  const description = brand.description
    ? `${brand.description.slice(0, 120)}...`
    : `Date vintage ${brand.name} clothing with ThreadDate. ${descParts}. Community-verified identifiers for collectors.`;

  return {
    title: `${brand.name} Vintage Tags & Identifiers | ThreadDate`,
    description,
    openGraph: {
      title: `${brand.name} Vintage Identifier Guide | ThreadDate`,
      description,
      type: "website",
      images: brand.logo_url ? [{ url: brand.logo_url, alt: `${brand.name} logo` }] : [],
    },
    twitter: {
      card: "summary",
      title: `${brand.name} Vintage Tags | ThreadDate`,
      description,
    },
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  // Get filters from search params
  const category = typeof search.category === "string" ? search.category as TagFilters["category"] : undefined;
  const era = typeof search.era === "string" ? search.era as TagFilters["era"] : undefined;

  // Fetch tags for this brand, ordered chronologically (newest to oldest)
  const tags = await getTags({
    brandId: brand.id,
    category,
    era,
    // Show all tags regardless of status - tags have badges to show pending/verified
    orderBy: "year_start",
    orderDirection: "desc",
  }, 50);

  // Fetch era distribution for timeline
  const eraDistribution = await getBrandEraDistribution(brand.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://threaddate.com" },
          { name: "Brands", url: "https://threaddate.com/brands" },
          { name: brand.name },
        ]}
      />
      <BrandCollectionSchema
        name={brand.name}
        slug={slug}
        description={brand.description}
        foundedYear={brand.founded_year}
        logoUrl={brand.logo_url}
        countryCode={brand.country_code}
        identifierCount={tags.length}
      />

      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-stone-600">
        <Link href="/" className="hover:text-orange-600">
          Home
        </Link>
        {" / "}
        <Link href="/brands" className="hover:text-orange-600">
          Brands
        </Link>
        {" / "}
        <span className="text-stone-900">{brand.name}</span>
      </nav>

      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-6">
        {brand.logo_url ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <img
              src={brand.logo_url}
              alt={brand.name}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]" />
            <span className="relative text-4xl font-bold text-white">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-stone-900">
            {brand.country_code && <span className="mr-2">{getCountryFlagEmoji(brand.country_code)}</span>}
            {brand.name}
          </h1>
          {brand.founded_year && (
            <p className="mt-1 text-lg text-stone-600">
              Founded in {brand.founded_year}
              {brand.country_code && ` · ${getCountryName(brand.country_code)}`}
            </p>
          )}
          {brand.description && (
            <p className="mt-3 text-stone-700 leading-relaxed max-w-2xl">
              {brand.description}
            </p>
          )}
          {tags.length > 0 ? (
            <p className="mt-2 text-sm text-stone-500">
              {tags.length} identifier{tags.length !== 1 ? 's' : ''}
            </p>
          ) : (
            <Link
              href="/submit"
              className="mt-2 inline-block text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Contribute the first identifier →
            </Link>
          )}

          {/* Small reference links (website, Wikipedia) */}
          {(brand.website_url || brand.wikipedia_url) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {brand.website_url && (
                <a
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Official Website
                </a>
              )}
              {brand.wikipedia_url && (
                <a
                  href={brand.wikipedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1 4.5v3h3v2h-3v3h-2v-3H6v-2h3v-3h2z"/>
                  </svg>
                  Learn More on Wikipedia
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Brand Timeline - Sticky navigation */}
      {eraDistribution.length > 0 && !category && !era && (
        <BrandTimeline
          brandName={brand.name}
          brandSlug={slug}
          foundedYear={brand.founded_year}
          eras={eraDistribution}
        />
      )}

      {/* Marketplace Hero - Primary Shopping CTAs */}
      <div className="mb-8">
        <MarketplaceHero
          brandName={brand.name}
          brandSlug={slug}
          amazonUrl={brand.amazon_url ?? undefined}
          ebayUrl={brand.ebay_url ?? undefined}
          poshmarkUrl={brand.poshmark_url ?? undefined}
          depopUrl={brand.depop_url ?? undefined}
          websiteUrl={brand.website_url ?? undefined}
          identifierCount={tags.length}
        />
      </div>

      {/* Quick Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/brands/${slug}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !category && !era
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          All
        </Link>
        <Link
          href={`/brands/${slug}?category=Neck+Tag`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Neck Tag"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Neck Tags
        </Link>
        <Link
          href={`/brands/${slug}?category=Care+Tag`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Care Tag"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Care Tags
        </Link>
        <Link
          href={`/brands/${slug}?category=Button/Snap`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Button/Snap"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Buttons
        </Link>
        <Link
          href={`/brands/${slug}?category=Tab`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === "Tab"
              ? "bg-orange-600 text-white"
              : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
          }`}
        >
          Tabs
        </Link>
      </div>

      {/* Tags Grid - Grouped by Era */}
      {tags.length > 0 ? (
        <EraGroupedTagGrid tags={tags} />
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-lg">
          <p className="text-stone-600">
            No identifiers yet for {brand.name}.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700 font-medium"
          >
            Contribute the first identifier →
          </Link>
        </div>
      )}

      {/* Marketplace Footer CTA - Final Conversion Opportunity */}
      <MarketplaceFooterCTA
        brandName={brand.name}
        brandSlug={slug}
        amazonUrl={brand.amazon_url ?? undefined}
        ebayUrl={brand.ebay_url ?? undefined}
        poshmarkUrl={brand.poshmark_url ?? undefined}
        depopUrl={brand.depop_url ?? undefined}
      />
    </div>
  );
}
