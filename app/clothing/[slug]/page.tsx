import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin, Shirt, Tag, Palette, Ruler, Globe, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClothingItemBySlug } from "@/lib/queries/clothing-items";
import { createClient } from "@/lib/supabase/server";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { getCountryFlagEmoji } from "@/lib/utils/country-flags";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ClothingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ClothingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getClothingItemBySlug(slug);

  if (!item) {
    return {
      title: "Clothing Item Not Found | ThreadDate",
    };
  }

  const era = item.era || "";
  const type = item.type || "Clothing";

  const title = `${item.name} | ThreadDate`;
  const description = `${era ? `${era} ` : ""}${type} - ${item.name}. Community-documented vintage clothing with identifiers on ThreadDate.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: item.image_url ? [{ url: item.image_url, alt: item.name }] : [],
    },
    twitter: {
      card: item.image_url ? "summary_large_image" : "summary",
      title,
      description,
      images: item.image_url ? [item.image_url] : [],
    },
  };
}

export default async function ClothingPage({ params }: ClothingPageProps) {
  const { slug } = await params;
  const item = await getClothingItemBySlug(slug);

  if (!item) {
    notFound();
  }

  // Fetch associated tags/identifiers
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select(`
      id,
      category,
      era,
      year_start,
      year_end,
      image_url,
      status,
      verification_score,
      origin_country,
      position_x,
      position_y,
      brands!inner(id, name, slug, logo_url)
    `)
    .eq("clothing_item_id", item.id)
    .order("created_at", { ascending: false });

  const identifiers = tags || [];

  // Status badge helper
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const countryFlag = item.origin_country ? getCountryFlagEmoji(item.origin_country) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* JSON-LD Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://threaddate.com" },
          { name: "Clothing", url: "https://threaddate.com/clothing" },
          { name: item.name },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-stone-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-stone-900 font-medium">{item.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Header */}
          <div className="flex items-start gap-6">
            {item.image_url ? (
              <ImageLightbox src={item.image_url} alt={item.name}>
                <button className="flex-shrink-0 cursor-zoom-in">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-48 w-48 rounded-lg object-cover border border-stone-200 shadow-sm"
                  />
                </button>
              </ImageLightbox>
            ) : (
              <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-400">
                <Shirt className="h-16 w-16" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-stone-900">{item.name}</h1>
                  <p className="mt-1 text-lg text-stone-600">{item.type}</p>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-stone-600">
                {item.era && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.era}
                  </span>
                )}
                {item.color && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1">
                    <Palette className="h-3.5 w-3.5" />
                    {item.color}
                  </span>
                )}
                {item.size && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1">
                    <Ruler className="h-3.5 w-3.5" />
                    {item.size}
                  </span>
                )}
                {item.origin_country && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1">
                    {countryFlag && <span>{countryFlag}</span>}
                    Made in {item.origin_country}
                  </span>
                )}
                {item.style_number && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1">
                    <FileText className="h-3.5 w-3.5" />
                    #{item.style_number}
                  </span>
                )}
                {item.year_manufactured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.year_manufactured}
                  </span>
                )}
              </div>

              {item.description && (
                <p className="mt-4 text-stone-700">{item.description}</p>
              )}
            </div>
          </div>

          {/* Identifiers Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Identifiers ({identifiers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {identifiers.length === 0 ? (
                <p className="text-stone-500 text-center py-8">
                  No identifiers have been added to this item yet.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {identifiers.map((tag: any, index: number) => (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.id}`}
                      className="group flex gap-4 rounded-lg border border-stone-200 p-4 hover:border-orange-300 hover:bg-orange-50/50 transition-colors"
                    >
                      {tag.image_url ? (
                        <img
                          src={tag.image_url}
                          alt={`${tag.category} identifier`}
                          className="h-20 w-20 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-md bg-stone-100 flex items-center justify-center flex-shrink-0">
                          <Tag className="h-8 w-8 text-stone-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-stone-900 group-hover:text-orange-600">
                            {tag.category}
                          </p>
                          {getStatusBadge(tag.status)}
                        </div>
                        {tag.brands && (
                          <p className="text-sm text-stone-600 mt-0.5">
                            {tag.brands.name}
                          </p>
                        )}
                        {tag.era && (
                          <p className="text-sm text-stone-500 mt-1">{tag.era}</p>
                        )}
                        {(tag.year_start || tag.year_end) && (
                          <p className="text-xs text-stone-400 mt-1">
                            {tag.year_start && tag.year_end
                              ? `${tag.year_start} - ${tag.year_end}`
                              : tag.year_start || tag.year_end}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Identifier Locations on Clothing Image */}
          {item.image_url && identifiers.some((t: any) => t.position_x !== null && t.position_y !== null) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Identifier Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="max-h-96 w-auto rounded-lg border border-stone-200"
                  />
                  {identifiers
                    .filter((t: any) => t.position_x !== null && t.position_y !== null)
                    .map((tag: any, idx: number) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.id}`}
                        className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white hover:bg-orange-700 transition-colors"
                        style={{
                          left: `${(tag.position_x ?? 0) * 100}%`,
                          top: `${(tag.position_y ?? 0) * 100}%`,
                        }}
                        title={tag.category}
                      >
                        {idx + 1}
                      </Link>
                    ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {identifiers
                    .filter((t: any) => t.position_x !== null && t.position_y !== null)
                    .map((tag: any, idx: number) => (
                      <Link
                        key={tag.id}
                        href={`/tags/${tag.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-sm hover:bg-orange-100 transition-colors"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        {tag.category}
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Links */}
          {identifiers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Associated Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(identifiers.map((t: any) => t.brands?.slug).filter(Boolean)))
                    .map((brandSlug) => {
                      const brand = identifiers.find((t: any) => t.brands?.slug === brandSlug)?.brands;
                      if (!brand) return null;
                      return (
                        <Link
                          key={brand.slug}
                          href={`/brands/${brand.slug}`}
                          className="flex items-center gap-3 rounded-lg border border-stone-200 p-3 hover:border-orange-300 hover:bg-orange-50/50 transition-colors"
                        >
                          {brand.logo_url ? (
                            <>
                              <img
                                src={brand.logo_url}
                                alt={brand.name}
                                className="h-12 w-12 rounded-md object-contain bg-white p-1 border border-stone-100"
                              />
                              <span className="text-sm text-stone-500">
                                {brand.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="h-12 w-12 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <span className="text-xl font-bold text-white">
                                  {brand.name.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-stone-900">
                                {brand.name}
                              </span>
                            </>
                          )}
                        </Link>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
