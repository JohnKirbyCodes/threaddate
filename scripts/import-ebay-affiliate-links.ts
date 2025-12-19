#!/usr/bin/env npx tsx

/**
 * Import eBay affiliate links from CSV and update brand records
 *
 * Parses the CSV from eBay's affiliate link converter and updates
 * the ebay_url field for each brand in the database.
 *
 * Usage:
 *   npx tsx scripts/import-ebay-affiliate-links.ts path/to/file.csv           # Dry run
 *   npx tsx scripts/import-ebay-affiliate-links.ts path/to/file.csv --apply   # Update database
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";
import { readFile } from "fs/promises";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Parse CLI arguments
const args = process.argv.slice(2);
const applyChanges = args.includes("--apply");
const csvPath = args.find((a) => !a.startsWith("--"));

if (!csvPath) {
  console.error("Usage: npx tsx scripts/import-ebay-affiliate-links.ts <csv-file> [--apply]");
  process.exit(1);
}

// Extract brand name from eBay search URL
function extractBrandFromUrl(url: string): string | null {
  try {
    const match = url.match(/_nkw=([^&]+)/);
    if (!match) return null;

    let searchTerm = decodeURIComponent(match[1]);
    // Remove " vintage" suffix
    searchTerm = searchTerm.replace(/\s+vintage$/i, "");
    return searchTerm;
  } catch {
    return null;
  }
}

async function main() {
  console.log("📥 Import eBay affiliate links\n");
  console.log(`CSV: ${csvPath}`);
  console.log(`Mode: ${applyChanges ? "APPLY CHANGES" : "DRY RUN (use --apply to update)"}\n`);

  // Read CSV file
  let csvContent: string;
  try {
    csvContent = await readFile(csvPath, "utf-8");
  } catch (err) {
    console.error(`Error reading CSV: ${err}`);
    process.exit(1);
  }

  // Parse CSV (skip header row)
  const lines = csvContent.trim().split("\n").slice(1);
  console.log(`Found ${lines.length} links in CSV\n`);

  // Fetch all brands from database
  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .select("id, name, slug, ebay_url");

  if (brandsError) {
    console.error("Error fetching brands:", brandsError);
    process.exit(1);
  }

  // Create a map of brand names (lowercase) to brand records
  const brandMap = new Map<string, typeof brands[0]>();
  brands.forEach((brand) => {
    brandMap.set(brand.name.toLowerCase(), brand);
  });

  const results = {
    updated: [] as { brand: string; url: string }[],
    notFound: [] as string[],
    errors: [] as { brand: string; error: string }[],
  };

  for (const line of lines) {
    // Parse CSV line (handle commas in URLs)
    const parts = line.split(",");
    if (parts.length < 2) continue;

    const originalUrl = parts[0];
    const affiliateUrl = parts[1];

    if (!affiliateUrl || affiliateUrl === originalUrl) continue;

    const brandName = extractBrandFromUrl(originalUrl);
    if (!brandName) {
      results.errors.push({ brand: "unknown", error: `Could not parse brand from: ${originalUrl}` });
      continue;
    }

    // Find brand in database (case-insensitive)
    const brand = brandMap.get(brandName.toLowerCase());
    if (!brand) {
      results.notFound.push(brandName);
      continue;
    }

    if (!applyChanges) {
      console.log(`✅ ${brand.name} → affiliate link found`);
      results.updated.push({ brand: brand.name, url: affiliateUrl });
      continue;
    }

    // Update database
    const { error: updateError } = await supabase
      .from("brands")
      .update({ ebay_url: affiliateUrl })
      .eq("id", brand.id);

    if (updateError) {
      console.log(`❌ ${brand.name}: ${updateError.message}`);
      results.errors.push({ brand: brand.name, error: updateError.message });
      continue;
    }

    console.log(`✅ ${brand.name} → updated`);
    results.updated.push({ brand: brand.name, url: affiliateUrl });
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Updated: ${results.updated.length}`);
  console.log(`⏭️  Not found: ${results.notFound.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);

  if (results.notFound.length > 0) {
    console.log("\nBrands not found in database:");
    results.notFound.slice(0, 20).forEach((name) => console.log(`  - ${name}`));
    if (results.notFound.length > 20) {
      console.log(`  ... and ${results.notFound.length - 20} more`);
    }
  }

  if (results.errors.length > 0) {
    console.log("\nErrors:");
    results.errors.forEach((e) => console.log(`  - ${e.brand}: ${e.error}`));
  }

  if (!applyChanges && results.updated.length > 0) {
    console.log("\n💡 Run with --apply to update the database");
  }
}

main().catch(console.error);
