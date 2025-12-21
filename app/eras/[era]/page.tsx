import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin, Tag, ArrowRight } from "lucide-react";
import { TagGrid } from "@/components/tags/tag-grid";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo/json-ld";
import { getEraStats, getTagsByEra, ERA_SLUGS, FEATURED_ERAS, ERA_TO_SLUG } from "@/lib/queries/eras";
import type { Database } from "@/lib/supabase/types";

type Era = Database["public"]["Enums"]["era_enum"];

interface EraPageProps {
  params: Promise<{ era: string }>;
}

// Generate static params for featured eras
export async function generateStaticParams() {
  return FEATURED_ERAS.map((era) => ({
    era: ERA_TO_SLUG[era],
  }));
}

export async function generateMetadata({ params }: EraPageProps): Promise<Metadata> {
  const { era: eraSlug } = await params;
  const era = ERA_SLUGS[eraSlug] as Era | undefined;

  if (!era) {
    return { title: "Era Not Found | ThreadDate" };
  }

  const displayEra = era === "2000s (Y2K)" ? "2000s" : era;

  return {
    title: `${displayEra} Vintage Clothing Identifiers | ThreadDate`,
    description: `Browse vintage clothing tags, labels, and identifiers from the ${displayEra}. Find authentic ${displayEra} vintage pieces by comparing tags to our community-verified database.`,
    openGraph: {
      title: `${displayEra} Vintage Clothing Guide | ThreadDate`,
      description: `Date and authenticate ${displayEra} vintage clothing with our community-verified identifier database.`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${displayEra} Vintage Tags | ThreadDate`,
      description: `Browse ${displayEra} vintage clothing identifiers.`,
    },
  };
}

// Era-specific context for LLM optimization
const ERA_CONTEXT: Record<string, { description: string; characteristics: string[]; countries: string[] }> = {
  "1950s": {
    description: "The 1950s marked the post-war boom in American manufacturing. Clothing labels from this era often feature simple, elegant designs with union labels and 'Made in USA' tags.",
    characteristics: ["Union labels common", "Simple single-line tags", "Quality American manufacturing", "RN numbers introduced"],
    countries: ["USA", "Japan"],
  },
  "1960s": {
    description: "The 1960s saw the rise of youth culture and mod fashion. Tags from this era begin showing care instructions and more detailed branding.",
    characteristics: ["Care instructions appearing", "Bold graphic designs", "Synthetic fabrics emerging", "International imports increasing"],
    countries: ["USA", "Japan", "Hong Kong"],
  },
  "1970s": {
    description: "The 1970s featured disco, denim, and the beginning of offshore manufacturing. Tags show more care symbols and country of origin requirements.",
    characteristics: ["Care symbols standardized", "Polyester blend tags", "Offshore manufacturing begins", "Designer labels emerge"],
    countries: ["USA", "Taiwan", "Korea", "Hong Kong"],
  },
  "1980s": {
    description: "The 1980s brought bold colors, athletic wear, and increased global manufacturing. Tags became more detailed with sizing and care information.",
    characteristics: ["Athletic wear boom", "Neon and bold colors", "Designer logos prominent", "Asian manufacturing expands"],
    countries: ["USA", "China", "Taiwan", "Korea"],
  },
  "1990s": {
    description: "The 1990s defined streetwear and casual fashion. Tags from this era show the full transition to global manufacturing with detailed care labels.",
    characteristics: ["Streetwear dominates", "Oversized fits", "Grunge and hip-hop influence", "Global supply chains"],
    countries: ["China", "Bangladesh", "Indonesia", "Mexico"],
  },
  "2000s": {
    description: "The 2000s (Y2K era) featured low-rise fits, logomania, and fast fashion. Tags show modern care symbols and barcode integration.",
    characteristics: ["Fast fashion emergence", "Logo-heavy designs", "Low-rise silhouettes", "Digital integration begins"],
    countries: ["China", "Vietnam", "Bangladesh", "India"],
  },
};

function generateEraFAQs(era: Era, stats: { tagCount: number; brandCount: number }) {
  const displayEra = era === "2000s (Y2K)" ? "2000s" : era;
  const context = ERA_CONTEXT[displayEra] || ERA_CONTEXT["1990s"];

  return [
    {
      question: `How do I identify ${displayEra} vintage clothing?`,
      answer: `${displayEra} clothing can be identified by specific tag characteristics: ${context.characteristics.join(", ")}. Common manufacturing countries include ${context.countries.join(", ")}. ThreadDate has ${stats.tagCount} documented identifiers from this era.`,
    },
    {
      question: `What makes ${displayEra} vintage clothing valuable?`,
      answer: `${displayEra} pieces are valued for their quality construction, unique styling, and cultural significance. ${context.description} Condition, brand, and authenticity all affect value.`,
    },
    {
      question: `Where was ${displayEra} clothing typically manufactured?`,
      answer: `${displayEra} clothing was commonly manufactured in ${context.countries.join(", ")}. Check the 'Made in' label on your tag and compare to documented examples to verify authenticity.`,
    },
    {
      question: `How do I date a ${displayEra} tag?`,
      answer: `Compare your tag to verified examples in our database. Look for era-specific features like ${context.characteristics.slice(0, 2).join(" and ")}. Our community has documented ${stats.tagCount} identifiers across ${stats.brandCount} brands from this period.`,
    },
  ];
}

export default async function EraPage({ params }: EraPageProps) {
  const { era: eraSlug } = await params;
  const era = ERA_SLUGS[eraSlug] as Era | undefined;

  if (!era) {
    notFound();
  }

  const [stats, tags] = await Promise.all([
    getEraStats(era),
    getTagsByEra(era, 50),
  ]);

  if (!stats) {
    notFound();
  }

  const displayEra = era === "2000s (Y2K)" ? "2000s" : era;
  const context = ERA_CONTEXT[displayEra] || ERA_CONTEXT["1990s"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://threaddate.com" },
          { name: "Eras", url: "https://threaddate.com/eras" },
          { name: `${displayEra} Vintage` },
        ]}
      />
      <FAQSchema items={generateEraFAQs(era, stats)} />

      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-stone-600">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        {" / "}
        <span className="text-stone-900">{displayEra} Vintage</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-stone-900">{displayEra} Vintage</h1>
            <p className="text-lg text-stone-600">
              {stats.tagCount} identifiers · {stats.brandCount} brands
            </p>
          </div>
        </div>

        {/* Era Description - LLM optimized */}
        <div className="bg-stone-50 rounded-lg p-6 mb-6">
          <p className="text-stone-700 leading-relaxed mb-4">
            {context.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {context.characteristics.map((char) => (
              <span
                key={char}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-stone-600 border border-stone-200"
              >
                <Tag className="h-3 w-3" />
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {stats.countries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">
            Common Manufacturing Countries
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.countries.map(({ country, count }) => (
              <span
                key={country}
                className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5 text-sm text-stone-700"
              >
                <MapPin className="h-3.5 w-3.5" />
                {country}
                <span className="text-stone-500">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Top Brands for this Era */}
      {stats.topBrands.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Top {displayEra} Brands
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats.topBrands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-stone-200 bg-white p-4 hover:border-orange-300 hover:shadow-md transition-all group"
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">{brand.name.charAt(0)}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-stone-900 group-hover:text-orange-600 truncate max-w-full">
                    {brand.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {brand.tagCount} identifier{brand.tagCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {stats.categories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-3">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.categories.map(({ category, count }) => (
              <span
                key={category}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 border border-stone-200"
              >
                {category} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags Grid */}
      {tags.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            All {displayEra} Identifiers
          </h2>
          <TagGrid tags={tags} />
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-stone-200 rounded-lg">
          <p className="text-stone-600">
            No identifiers documented yet for the {displayEra}.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            Contribute the first identifier
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Browse Other Eras */}
      <div className="mt-12 pt-8 border-t border-stone-200">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">
          Browse Other Eras
        </h2>
        <div className="flex flex-wrap gap-2">
          {FEATURED_ERAS.filter((e) => e !== era).map((otherEra) => {
            const slug = ERA_TO_SLUG[otherEra];
            const display = otherEra === "2000s (Y2K)" ? "2000s" : otherEra;
            return (
              <Link
                key={otherEra}
                href={`/eras/${slug}`}
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-orange-100 hover:text-orange-700 transition-colors"
              >
                {display}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
