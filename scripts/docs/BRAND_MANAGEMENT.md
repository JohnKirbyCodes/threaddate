# Brand Data Management Guide

## Overview

This guide explains how to manage brand data in the ThreadDate database, including adding new brands, enriching existing brands with metadata, and maintaining data quality.

---

## Quick Start

### When a new brand is added to the database:

```bash
# 1. Identify what needs work
npm run identify:brands

# 2. Validate existing data quality
npm run validate:brands

# 3. Check current database status
npm run check:brands

# 4. Enrich brand metadata (start with Tier 1)
npm run enrich:brands -- --tier=1 --limit=10 --generate-template

# 5. Update production database
NODE_ENV=production npm run update:brands
```

---

## Brand Data Tiers

### Tier 1: High Priority (Major/Popular Brands)

**Criteria:**
- Active, well-known brand with strong market presence
- Has official website
- Likely has Wikipedia article
- Users frequently search for this brand

**Examples:**
- Streetwear: Stone Island, Kappa, Ellesse, Comme des Garcons
- Designer: Balenciaga, Chanel, Fendi, Armani, Moncler
- Outdoor: Arc'teryx, Marmot, Mountain Hardwear, Helly Hansen
- Hip-hop: Rocawear, Sean John, Karl Kani, FUBU, Pelle Pelle
- Active brands: Lululemon, Under Armour

**Goal:** Complete metadata (domain, website, Wikipedia, founded year)

---

### Tier 2: Medium Priority (Popular Vintage/Niche)

**Criteria:**
- Popular in specific communities (vintage collectors, outdoor enthusiasts, etc.)
- May have official website
- Worth having a logo for brand recognition

**Examples:**
- Vintage sportswear: Starter, Logo 7, Majestic, Mitchell & Ness
- Outdoor: Sierra Designs, Filson, Woolrich, Orvis
- Skate/Surf: Etnies, DC Shoes, O'Neill, Rip Curl
- Workwear: Pointer Brand, Round House, Ben Davis, Red Wing
- Heritage: Brooks Brothers, Gant, J.Crew, LL Bean
- Other: Guess, Diesel, Lucky Brand, Evisu

**Goal:** At minimum description + domain for logo

---

### Tier 3: Lower Priority (Defunct/Minimal Presence)

**Criteria:**
- Defunct brands (no longer in business)
- Obscure vintage brands
- No official website
- Unlikely to have Clearbit logo available
- Low search frequency

**Examples:**
- Obscure vintage: Brent, Karman, Signal, Power House
- Defunct retailers: Montgomery Ward
- Generic/minimal: Sportswear, Terra, Trench

**Goal:** Description only (no domain/URLs needed - already complete!)

---

## Brand Metadata Fields

| Field          | Required | Example                                      | Notes                                  |
|----------------|----------|----------------------------------------------|----------------------------------------|
| name           | ✅       | "Nike"                                       | Exact brand name                       |
| description    | ✅       | "American athletic footwear company..."      | 1-2 sentences, what they're known for  |
| domain         | Tier 1-2 | "nike.com"                                   | For Clearbit logo API (no http://)     |
| website_url    | Tier 1   | "https://www.nike.com"                       | Official website                       |
| wikipedia_url  | Tier 1   | "https://en.wikipedia.org/wiki/Nike,_Inc."   | Wikipedia article                      |
| founded_year   | Tier 1   | 1964                                         | Year brand was founded                 |

**Auto-generated fields** (handled by update-brands.ts):
- `slug` - URL-friendly version of name
- `ebay_url` - eBay search link
- `poshmark_url` - Poshmark brand page
- `depop_url` - Depop search link

---

## Workflow for Adding Metadata

### Step-by-Step Process:

#### 1. Research the brand

**Find official website:**
- Google: "{brand name} official website"
- Verify it's the authentic site (not resellers)

**Find Wikipedia article:**
- Google: "{brand name} wikipedia"
- Ensure it's the right brand (check founding info matches)

**Find founded year:**
- Check Wikipedia "Founded" section
- Check brand's About page
- Look for "Est. YYYY" on website

**Extract domain for logo:**
- Visit official website
- Extract just the domain (e.g., `nike.com` from `https://www.nike.com`)
- DO NOT include `www.`, `http://`, or `https://`
- Test the logo: Open `https://logo.clearbit.com/{domain}` in browser

#### 2. Update brand-data.ts

**Location:** `/scripts/brand-data.ts`

Find the brand in the file. If it's in the "REMAINING BRANDS" section, add the metadata:

```typescript
// BEFORE (minimal)
{
  name: "Kappa",
  description: "Italian sportswear brand known for..."
}

// AFTER (enriched)
{
  name: "Kappa",
  domain: "kappa.com",
  website_url: "https://www.kappa.com",
  wikipedia_url: "https://en.wikipedia.org/wiki/Kappa_(brand)",
  founded_year: 1916,
  description: "Italian sportswear brand known for banda side stripes and retro tracksuits."
}
```

**Field order:**
1. name
2. domain
3. website_url
4. wikipedia_url
5. founded_year
6. description

#### 3. Validate

```bash
npm run validate:brands
```

This checks for:
- No duplicate brands
- Properly formatted domains (no http://, no www.)
- Properly formatted URLs (must start with https://)
- Valid founded years (1700-2025)
- All brands have descriptions

#### 4. Test locally

```bash
# Update local database
npm run update:brands

# Start dev server (if not running)
npm run dev

# Visit brand page
open http://localhost:3000/brands/{slug}
```

Verify:
- ✅ Logo displays (or gradient fallback if no domain)
- ✅ Website link works
- ✅ Wikipedia link works
- ✅ Description shows correctly
- ✅ Founded year displays
- ✅ Marketplace links work

#### 5. Deploy to production

```bash
NODE_ENV=production npm run update:brands
```

#### 6. Verify production

Visit `https://www.threaddate.com/brands/{slug}` and check all fields display correctly.

---

## Scripts Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `npm run identify:brands` | Find new brands and brands needing enrichment | Shows Tier 1/2/3 breakdown |
| `npm run validate:brands` | Check brand-data.ts for errors | Catches duplicates, bad URLs |
| `npm run enrich:brands` | Generate template for adding metadata | `--tier=1 --limit=10` |
| `npm run check:brands` | Check production database status | Shows completion stats |
| `npm run update:brands` | Batch update database from brand-data.ts | Updates local DB |
| `NODE_ENV=production npm run update:brands` | Update production database | **Use with caution!** |

---

## Using the Enrichment Tool

### Generate a template:

```bash
npm run enrich:brands -- --tier=1 --limit=10 --generate-template
```

This creates `brand-enrichment-template.json` with 10 Tier 1 brands needing work.

### Manually fill in the template:

```json
[
  {
    "name": "Kappa",
    "current": {
      "description": "Italian sportswear brand..."
    },
    "suggested": {
      "domain": "kappa.com",
      "website_url": "https://www.kappa.com",
      "wikipedia_url": "https://en.wikipedia.org/wiki/Kappa_(brand)",
      "founded_year": 1916
    }
  }
]
```

### Apply changes manually:

Currently, you need to manually copy the data from the template into `scripts/brand-data.ts`. Future versions may automate this step.

---

## Common Issues

### Logo not showing?

**Checklist:**
- ✅ Check domain is correct format: `nike.com` (not `www.nike.com` or `https://nike.com`)
- ✅ Test directly in browser: `https://logo.clearbit.com/{domain}`
- ✅ Some brands don't have logos in Clearbit - that's OK! Fallback gradient displays

**Common domain mistakes:**
```typescript
// ❌ WRONG
domain: "https://nike.com"
domain: "www.nike.com"
domain: "nike.com/en-us"

// ✅ CORRECT
domain: "nike.com"
```

### Duplicate brand error?

```bash
npm run validate:brands
```

This will show exactly which brands are duplicated. Remove from "REMAINING BRANDS" section if already in "TOP 50 BRANDS".

### Wikipedia URL not found?

Not all brands have Wikipedia articles, especially:
- Defunct brands
- Niche/obscure brands
- Private label brands (Cherokee, George, etc.)

**Solution:** Leave `wikipedia_url` field empty. It's optional.

### URL says "Not Found" when I visit it

The brand may have:
- Changed their domain
- Gone out of business
- Been acquired (check for redirects)

**Solution:**
- Try searching "{brand name} official site"
- Check if they were acquired (use new parent company domain)
- For defunct brands, skip website_url field

---

## Maintenance Schedule

### Weekly Check (5 minutes)

```bash
npm run identify:brands
```

Review if any new brands were added to the database.

### Monthly Enrichment (30-60 minutes)

Work through 10-20 brands:

```bash
# Week 1-2: Tier 1 brands
npm run enrich:brands -- --tier=1 --limit=10 --generate-template

# Week 3-4: Tier 2 brands
npm run enrich:brands -- --tier=2 --limit=15 --generate-template
```

### Quarterly Validation

```bash
npm run validate:brands
npm run check:brands
```

Ensure data quality remains high.

---

## Current Status (as of implementation)

**Total brands:** 263

**Completion:**
- ✅ Descriptions: 263/263 (100%)
- ⚠️ Logos (domains): 49/263 (19%)
- ⚠️ Websites: 49/263 (19%)
- ⚠️ Wikipedia: 49/263 (19%)
- ⚠️ Founded years: 49/263 (19%)

**Remaining work:**
- ~35 Tier 1 brands need full metadata
- ~50 Tier 2 brands need at least logos
- ~130 Tier 3 brands are complete (description only)

---

## Tips & Best Practices

### Research Tips

**Finding domains:**
1. Visit official website
2. Look at URL in browser
3. Extract just the domain part
4. Test: `https://logo.clearbit.com/{domain}`

**Verifying Wikipedia:**
- Check the "Founded" date matches other sources
- Ensure it's about the clothing brand (not a different company with same name)
- Example: "Gap Inc." not "Gap, Pennsylvania"

**Founded years:**
- Wikipedia is most reliable source
- Brand "About" pages often have founding info
- If unsure, leave blank rather than guess

### Quality Over Speed

- It's better to enrich 5 brands with accurate data than 20 with errors
- When in doubt, leave a field blank
- Test logos before committing
- Verify URLs actually work before adding them

### Batch Processing

Work in batches of 5-10 brands at a time:
1. Research all brands in batch
2. Update brand-data.ts
3. Validate
4. Test locally
5. Deploy

This prevents context-switching and catches errors earlier.

---

## Future Enhancements

- **Automated research:** Use web scraping/APIs to suggest metadata
- **Logo upload:** Allow custom logo uploads to Supabase Storage
- **Affiliate links:** Convert marketplace URLs to affiliate tracking links
- **Community contributions:** Allow users to suggest brand metadata
- **Brand verification:** Admin approval workflow for user-submitted brands
- **Alternative logo sources:** Fallback if Clearbit doesn't have logo

---

## Questions?

If you're unsure about any step, run:

```bash
npm run identify:brands
npm run enrich:brands
```

Both provide helpful guidance and show current status.

For validation and quality checks:

```bash
npm run validate:brands
npm run check:brands
```

---

**Last updated:** 2025-12-17
**Maintainer:** Claude Code
**Related files:** `scripts/brand-data.ts`, `scripts/update-brands.ts`
