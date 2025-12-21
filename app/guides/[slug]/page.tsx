import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin, CheckCircle2, AlertTriangle, DollarSign, BookOpen, ArrowRight } from "lucide-react";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo/json-ld";
import { getGuideBySlug, getAllGuideSlugs, type BrandGuide } from "@/lib/data/brand-guides";
import { getBrandBySlug } from "@/lib/queries/brands";
import { getTags } from "@/lib/queries/tags";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found | ThreadDate" };
  }

  return {
    title: `${guide.title} | ThreadDate`,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: guide.title,
      description: guide.description,
    },
  };
}

function generateGuideFAQs(guide: BrandGuide) {
  const faqs = [
    {
      question: `How do I know if my ${guide.brandName} is vintage?`,
      answer: `Check the tag style, manufacturing location, and construction details. ${guide.brandName} tags have evolved significantly over the decades. Key indicators include: ${guide.eraSections[0]?.tagCharacteristics.slice(0, 2).join(", ") || "tag style and manufacturing details"}.`,
    },
    {
      question: `What are the most valuable vintage ${guide.brandName} eras?`,
      answer: guide.valuableEras.join(" "),
    },
    {
      question: `How can I tell if vintage ${guide.brandName} is authentic?`,
      answer: `Key authentication tips: ${guide.authenticationTips.slice(0, 3).join(". ")}.`,
    },
    {
      question: `Where was vintage ${guide.brandName} manufactured?`,
      answer: `Manufacturing locations changed over time: ${guide.eraSections.map(s => `${s.era}: ${s.manufacturingLocations.join(", ")}`).join("; ")}.`,
    },
  ];

  return faqs;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Try to fetch brand data and sample tags
  const brand = await getBrandBySlug(guide.brandSlug);
  const sampleTags = brand
    ? await getTags({ brandId: brand.id, orderBy: "verification_score", orderDirection: "desc" }, 6)
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://threaddate.com" },
          { name: "Guides", url: "https://threaddate.com/guides" },
          { name: guide.title },
        ]}
      />
      <FAQSchema items={generateGuideFAQs(guide)} />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-stone-600">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        {" / "}
        <Link href="/guides" className="hover:text-orange-600">Guides</Link>
        {" / "}
        <span className="text-stone-900">{guide.brandName}</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          {brand?.logo_url && (
            <img
              src={brand.logo_url}
              alt={guide.brandName}
              className="h-16 w-16 object-contain rounded-lg bg-white border border-stone-200 p-2"
            />
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
              {guide.title}
            </h1>
            <p className="text-lg text-stone-600 mt-1">{guide.description}</p>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-stone-50 rounded-lg p-6 mt-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
            Quick Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-stone-500">Founded</p>
              <p className="font-medium text-stone-900">{guide.quickFacts.founded}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Headquarters</p>
              <p className="font-medium text-stone-900">{guide.quickFacts.headquarters}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Known For</p>
              <p className="font-medium text-stone-900">{guide.quickFacts.knownFor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose prose-stone max-w-none mb-10">
        <p className="text-lg text-stone-700 leading-relaxed">{guide.intro}</p>
      </div>

      {/* Era-by-Era Breakdown */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-orange-600" />
          Era-by-Era Dating Guide
        </h2>

        <div className="space-y-8">
          {guide.eraSections.map((section, index) => (
            <div
              key={section.era}
              id={section.era.toLowerCase().replace(/s$/, "s")}
              className="bg-white rounded-xl border border-stone-200 p-6 scroll-mt-20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-900">
                  {section.era}
                </h3>
                <span className="text-sm text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {section.yearRange}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tag Characteristics */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                    Tag Characteristics
                  </h4>
                  <ul className="space-y-1">
                    {section.tagCharacteristics.map((char, i) => (
                      <li key={i} className="text-stone-700 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">
                    Key Features
                  </h4>
                  <ul className="space-y-1">
                    {section.keyFeatures.map((feature, i) => (
                      <li key={i} className="text-stone-700 flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Manufacturing Locations */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <MapPin className="h-4 w-4 text-stone-400" />
                <span className="text-sm text-stone-500">Made in:</span>
                {section.manufacturingLocations.map((loc) => (
                  <span
                    key={loc}
                    className="text-sm bg-stone-100 text-stone-700 px-2 py-0.5 rounded"
                  >
                    {loc}
                  </span>
                ))}
              </div>

              {/* Tips */}
              {section.tips.length > 0 && (
                <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <p className="text-sm font-medium text-orange-800 mb-1">Pro Tips:</p>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {section.tips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Authentication Tips */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          Authentication Tips
        </h2>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <ul className="space-y-3">
            {guide.authenticationTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Common Fakes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-600" />
          Watch Out For
        </h2>
        <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
          <ul className="space-y-3">
            {guide.commonFakes.map((fake, i) => (
              <li key={i} className="flex items-start gap-3 text-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                {fake}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Valuable Eras */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-orange-600" />
          Most Valuable Eras
        </h2>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <ul className="space-y-3">
            {guide.valuableEras.map((era, i) => (
              <li key={i} className="flex items-start gap-3 text-orange-800">
                <DollarSign className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                {era}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sample Identifiers from Database */}
      {sampleTags.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-orange-600" />
            Community-Verified Examples
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sampleTags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.id}`}
                className="group rounded-lg border border-stone-200 overflow-hidden hover:border-orange-300 hover:shadow-md transition-all"
              >
                <div className="aspect-square bg-stone-50">
                  <img
                    src={tag.image_url}
                    alt={`${guide.brandName} ${tag.category}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-stone-900 group-hover:text-orange-600 text-sm truncate">
                    {tag.category}
                  </p>
                  <p className="text-xs text-stone-500">{tag.era}</p>
                </div>
              </Link>
            ))}
          </div>
          {brand && (
            <div className="mt-4 text-center">
              <Link
                href={`/brands/${brand.slug}`}
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                View all {guide.brandName} identifiers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">
          Have a Vintage {guide.brandName} Piece?
        </h2>
        <p className="text-orange-100 mb-4">
          Help grow our database by submitting your identifier photos.
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
        >
          Submit an Identifier
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
