#!/usr/bin/env npx tsx

/**
 * Generate era-specific affiliate links for all brand + era combinations
 *
 * This queries the tags table to find all unique brand + era pairs,
 * then generates search queries like "vintage 1970s Sears clothing"
 *
 * Output: CSV file for eBay Partner Network bulk upload
 *
 * Usage:
 *   npx tsx scripts/generate-era-affiliate-csv.ts
 */

import { createClient } from "@supabase/supabase-js";
import { writeFile } from "fs/promises";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BrandEraLink {
  brand_name: string;
  brand_slug: string;
  era: string;
  search_query: string;
  ebay_url: string;
  amazon_url: string;
}

async function main() {
  console.log("🔗 Generate era-specific affiliate links\n");

  // Fetch all tags with their brand info and era
  const { data: tags, error } = await supabase
    .from("tags")
    .select(`
      era,
      brands!inner (
        id,
        name,
        slug
      )
    `)
    .not("era", "is", null)
    .order("era");

  if (error) {
    console.error("Error fetching tags:", error);
    process.exit(1);
  }

  console.log(`Found ${tags.length} tags with era info\n`);

  // Also get all brands (for brands without tags yet)
  const { data: allBrands, error: brandsError } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name");

  if (brandsError) {
    console.error("Error fetching brands:", brandsError);
    process.exit(1);
  }

  // Define all eras we want to generate links for
  const allEras = [
    "Pre-1920s",
    "1920s",
    "1930s",
    "1940s",
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "Modern (2020s)",
  ];

  // Create a set of unique brand + era combinations from actual tags
  const brandEraSet = new Set<string>();
  const brandEraLinks: BrandEraLink[] = [];

  // First add combinations from actual tags
  for (const tag of tags) {
    const brand = tag.brands as any;
    const key = `${brand.slug}|${tag.era}`;

    if (!brandEraSet.has(key)) {
      brandEraSet.add(key);

      const searchQuery = buildSearchQuery(brand.name, tag.era);

      brandEraLinks.push({
        brand_name: brand.name,
        brand_slug: brand.slug,
        era: tag.era,
        search_query: searchQuery,
        ebay_url: buildEbayUrl(searchQuery),
        amazon_url: buildAmazonUrl(searchQuery),
      });
    }
  }

  console.log(`Found ${brandEraLinks.length} unique brand + era combinations from existing tags\n`);

  // Generate links for ALL brand + era combinations (comprehensive coverage)
  console.log(`Generating all brand x era combinations for ${allBrands.length} brands...\n`);

  for (const brand of allBrands) {
    for (const era of allEras) {
      const key = `${brand.slug}|${era}`;

      if (!brandEraSet.has(key)) {
        brandEraSet.add(key);

        const searchQuery = buildSearchQuery(brand.name, era);

        brandEraLinks.push({
          brand_name: brand.name,
          brand_slug: brand.slug,
          era: era,
          search_query: searchQuery,
          ebay_url: buildEbayUrl(searchQuery),
          amazon_url: buildAmazonUrl(searchQuery),
        });
      }
    }
  }

  // Sort by brand name, then era
  brandEraLinks.sort((a, b) => {
    if (a.brand_name !== b.brand_name) {
      return a.brand_name.localeCompare(b.brand_name);
    }
    return a.era.localeCompare(b.era);
  });

  // Split into files of max 1000 rows to stay well under eBay's 1500 line limit
  const maxRowsPerFile = 1000;
  const fileCount = Math.ceil(brandEraLinks.length / maxRowsPerFile);

  for (let i = 0; i < fileCount; i++) {
    const start = i * maxRowsPerFile;
    const end = Math.min(start + maxRowsPerFile, brandEraLinks.length);
    const chunk = brandEraLinks.slice(start, end);

    const csvHeader = "brand_name,brand_slug,era,search_query,ebay_url,amazon_url";
    const csvRows = chunk.map(link =>
      `"${escapeCSV(link.brand_name)}","${link.brand_slug}","${link.era}","${escapeCSV(link.search_query)}","${link.ebay_url}","${link.amazon_url}"`
    );

    const csvContent = csvHeader + "\n" + csvRows.join("\n");

    const suffix = fileCount > 1 ? `-part${i + 1}` : "";
    const outputPath = `./affiliate-links-by-era${suffix}.csv`;

    await writeFile(outputPath, csvContent);
    console.log(`📄 Saved ${chunk.length} rows to: ${outputPath}`);
  }

  // Also generate a plain text file with just eBay URLs (for bulk converter)
  const ebayUrlsPath = "./ebay-era-links.txt";
  await writeFile(ebayUrlsPath, brandEraLinks.map(l => l.ebay_url).join("\n"));
  console.log(`📄 Saved eBay URLs to: ${ebayUrlsPath}`);

  // Summary
  console.log("\n✅ Summary:");
  console.log(`   Total links: ${brandEraLinks.length}`);
  console.log(`   Unique brands: ${new Set(brandEraLinks.map(l => l.brand_slug)).size}`);
  console.log(`   Unique eras: ${new Set(brandEraLinks.map(l => l.era)).size}`);

  // Show sample
  console.log("\n📋 Sample entries:");
  brandEraLinks.slice(0, 5).forEach(link => {
    console.log(`   ${link.brand_name} (${link.era}): ${link.search_query}`);
  });
}

function buildSearchQuery(brandName: string, era: string): string {
  // Format: "vintage 1970s Sears clothing"
  // Skip "Modern" era prefix as it's not vintage
  if (era.includes("Modern")) {
    return `${brandName} clothing`;
  }
  return `vintage ${era} ${brandName} clothing`;
}

function buildEbayUrl(searchQuery: string): string {
  // eBay clothing category: 11450
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}&_sacat=11450`;
}

function buildAmazonUrl(searchQuery: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&i=fashion`;
}

function escapeCSV(str: string): string {
  // Escape double quotes by doubling them
  return str.replace(/"/g, '""');
}

main().catch(console.error);
