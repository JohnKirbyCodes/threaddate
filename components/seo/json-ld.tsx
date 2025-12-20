/**
 * JSON-LD Structured Data Components for SEO
 *
 * These components render Schema.org structured data
 * to help search engines understand page content.
 */

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
  url?: string;
}

export function OrganizationSchema({
  name = "ThreadDate",
  description = "Community-driven vintage clothing identifier database",
  url = "https://threaddate.com",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo: `${url}/icon.svg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BrandSchemaProps {
  name: string;
  slug: string;
  description?: string;
  foundedYear?: number | null;
  logoUrl?: string | null;
  countryCode?: string | null;
  identifierCount: number;
}

export function BrandCollectionSchema({
  name,
  slug,
  description,
  foundedYear,
  logoUrl,
  countryCode,
  identifierCount,
}: BrandSchemaProps) {
  const baseUrl = "https://threaddate.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} Vintage Tags & Identifiers`,
    description: description || `Reference guide for dating vintage ${name} clothing`,
    url: `${baseUrl}/brands/${slug}`,
    about: {
      "@type": "Brand",
      name,
      ...(foundedYear && { foundingDate: foundedYear.toString() }),
      ...(logoUrl && { logo: logoUrl }),
    },
    numberOfItems: identifierCount,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: identifierCount,
      itemListElement: {
        "@type": "Thing",
        name: `${name} clothing identifiers`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface IdentifierSchemaProps {
  brandName: string;
  category: string;
  era?: string | null;
  imageUrl?: string | null;
  datePublished?: string | null;
  description?: string | null;
}

export function IdentifierSchema({
  brandName,
  category,
  era,
  imageUrl,
  datePublished,
  description,
}: IdentifierSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: `${brandName} ${category}${era ? ` - ${era}` : ""}`,
    description: description || `Vintage ${brandName} ${category.toLowerCase()} from ${era || "unknown era"}`,
    ...(imageUrl && { contentUrl: imageUrl }),
    ...(datePublished && { datePublished }),
    creator: {
      "@type": "Organization",
      name: "ThreadDate Community",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteSchemaProps {
  name?: string;
  description?: string;
  url?: string;
}

export function WebsiteSchema({
  name = "ThreadDate",
  description = "Community-driven vintage clothing identifier database",
  url = "https://threaddate.com",
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
