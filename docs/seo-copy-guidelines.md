# ThreadDate SEO & Copy Guidelines

This document outlines the SEO infrastructure and copy guidelines implemented for ThreadDate. Follow these patterns when adding new pages or content.

---

## SEO Implementation

### Page Metadata

All pages should include metadata using Next.js patterns:

**Static pages** - Use exported `metadata` object:
```typescript
export const metadata: Metadata = {
  title: "Page Title | ThreadDate",
  description: "Page description under 160 characters.",
  openGraph: {
    title: "OpenGraph Title",
    description: "Description for social sharing.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Twitter Card Title",
    description: "Twitter description.",
  },
};
```

**Dynamic pages** - Use `generateMetadata()` function:
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchData(params.id);
  return {
    title: `${data.name} | ThreadDate`,
    description: `Dynamic description for ${data.name}`,
    openGraph: {
      images: data.image_url ? [{ url: data.image_url }] : [],
    },
  };
}
```

### Title Pattern
- Format: `{Page-Specific Title} | ThreadDate`
- Brand pages: `{Brand Name} Vintage Tags & Identifiers | ThreadDate`
- Tag pages: `{Brand} {Category} - {Era} | ThreadDate`
- Static pages: `{Page Name} | ThreadDate`

### Current Metadata Implementation

| Page | File | Type |
|------|------|------|
| Homepage | `app/page.tsx` | Static export |
| Brands List | `app/brands/page.tsx` | Static export |
| Brand Detail | `app/brands/[slug]/page.tsx` | `generateMetadata()` |
| Tag Detail | `app/tags/[id]/page.tsx` | `generateMetadata()` |

---

## Structured Data (JSON-LD)

Reusable JSON-LD components are in `components/seo/json-ld.tsx`.

### Available Components

**WebsiteSchema** - Site-wide schema (in root layout)
```tsx
<WebsiteSchema />
```

**OrganizationSchema** - ThreadDate entity (in root layout)
```tsx
<OrganizationSchema />
```

**BrandCollectionSchema** - For brand detail pages
```tsx
<BrandCollectionSchema
  name={brand.name}
  slug={brand.slug}
  description={brand.description}
  foundedYear={brand.founded_year}
  logoUrl={brand.logo_url}
  countryCode={brand.country_code}
  identifierCount={tags.length}
/>
```

**IdentifierSchema** - For tag detail pages
```tsx
<IdentifierSchema
  brandName={tag.brand.name}
  category={tag.category}
  era={tag.era}
  imageUrl={tag.image_url}
  datePublished={tag.created_at}
  description={tag.submission_notes}
/>
```

**BreadcrumbSchema** - For navigation breadcrumbs
```tsx
<BreadcrumbSchema
  items={[
    { name: "Home", url: "https://threaddate.com" },
    { name: "Brands", url: "https://threaddate.com/brands" },
    { name: brand.name },  // Last item has no URL
  ]}
/>
```

---

## Technical SEO Files

### robots.ts
Location: `app/robots.ts`

```typescript
rules: {
  userAgent: '*',
  allow: '/',
  disallow: ['/api/', '/profile/', '/admin/'],
},
sitemap: 'https://threaddate.com/sitemap.xml',
```

### sitemap.ts
Location: `app/sitemap.ts`

Dynamically generates URLs for:
- Static pages (/, /brands, /about, /search)
- All brand pages (`/brands/{slug}`)
- All tag pages (`/tags/{id}`)

Priority levels:
- Homepage: 1.0
- Brands list: 0.9
- Individual brands: 0.8
- Individual tags: 0.7

---

## Copy Guidelines

### Terminology

**Use these terms:**
- "identifier" (not "tag" or "label")
- "catalogued" or "documented" (not "verified" unless actually verified)
- "community" or "contributed"
- "era" (with decade format: "1990s")

**Avoid:**
- "verified" or "authenticated" (unless status is actually verified)
- Any stat showing "0" (reframe as opportunity)
- Overly sales-focused language

### Empty States

Never show empty counts. Instead, use CTAs:

```tsx
// Bad
<p>{tags.length} identifiers</p>  // Shows "0 identifiers"

// Good
{tags.length > 0 ? (
  <p>{tags.length} identifiers</p>
) : (
  <Link href="/submit">Contribute the first identifier →</Link>
)}
```

### Brand Voice

- **Informative** - Educational, reference-focused
- **Collector-oriented** - Speak to vintage enthusiasts
- **Community-driven** - Emphasize crowdsourced contributions
- **Not salesy** - Marketplace links are secondary to content

### Marketplace Links

Hierarchy of importance:
1. **Primary**: Brand info, identifiers, reference content
2. **Secondary**: Marketplace links (helpful, not pushy)
3. **Tertiary**: Contribute/submit CTAs

Implementation:
- Official website gets full-width row above third-party links
- Third-party marketplaces (Amazon, eBay, Poshmark, Depop) in grid
- Affiliate disclosure in footer: "Some links may be affiliate links. We may earn from qualifying purchases."

---

## LLM Optimization

### Principles for AI-Readable Content

LLMs extract structured information better than prose. Optimize for:

1. **Clear entity definitions** - First paragraph defines what the page is about
2. **Structured facts** - Use lists, tables, definition elements
3. **Consistent terminology** - Always use "identifier", always format eras as "1990s"
4. **Natural language questions** - Content should answer queries like "How do I date vintage Nike?"

### Semantic HTML

When possible, use semantic elements:
- `<article>` for main content
- `<section>` with clear headings
- `<dl>/<dt>/<dd>` for key-value facts
- `<time datetime="">` for dates/eras

---

## Checklist for New Pages

- [ ] Add `metadata` export or `generateMetadata()` function
- [ ] Include OpenGraph and Twitter card metadata
- [ ] Add appropriate JSON-LD schema component
- [ ] Add BreadcrumbSchema for navigation
- [ ] Handle empty states with CTAs, not zero counts
- [ ] Use consistent terminology ("identifier", "era")
- [ ] Ensure page is included in sitemap.ts
- [ ] Test with Google Rich Results Test

---

## File Reference

| File | Purpose |
|------|---------|
| `app/robots.ts` | Search engine crawl rules |
| `app/sitemap.ts` | Dynamic XML sitemap |
| `components/seo/json-ld.tsx` | Reusable JSON-LD components |
| `app/layout.tsx` | Site-wide schemas (Website, Organization) |
| `app/brands/[slug]/page.tsx` | Brand page metadata + schemas |
| `app/tags/[id]/page.tsx` | Tag page metadata + schemas |
