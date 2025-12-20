#!/usr/bin/env npx tsx

/**
 * Generate Amazon search links for all brands
 *
 * Amazon Associates doesn't have a bulk converter like eBay.
 * Options for affiliate links:
 *
 * 1. Manual: Add your tag directly to URLs (simplest)
 *    Format: ?tag=YOUR-TAG-20
 *
 * 2. SiteStripe: Use Amazon's browser toolbar to convert links one-by-one
 *
 * 3. Product Advertising API: Programmatic access (requires approval)
 *
 * This script generates URLs with your affiliate tag already included.
 *
 * Usage:
 *   npx tsx scripts/generate-amazon-links.ts                    # Uses default tag
 *   npx tsx scripts/generate-amazon-links.ts --tag=mytag-20     # Custom tag
 *   npx tsx scripts/generate-amazon-links.ts --apply            # Update database
 */

import { createClient } from "@supabase/supabase-js";
import { writeFile } from "fs/promises";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Use untyped client to bypass schema cache for new columns
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse CLI arguments
const args = process.argv.slice(2);
const applyChanges = args.includes("--apply");
const tagArg = args.find((a) => a.startsWith("--tag="));
const affiliateTag = tagArg ? tagArg.split("=")[1] : null;

async function main() {
  console.log("🛒 Generate Amazon affiliate links for brands\n");

  if (!affiliateTag) {
    console.log("⚠️  No affiliate tag provided. Use --tag=YOUR-TAG-20 to include affiliate tracking.\n");
    console.log("Example: npx tsx scripts/generate-amazon-links.ts --tag=threaddate-20\n");
  } else {
    console.log(`Affiliate Tag: ${affiliateTag}`);
  }

  console.log(`Mode: ${applyChanges ? "APPLY CHANGES" : "DRY RUN (generates file only)"}\n`);

  // Fetch all brands
  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug")
    .order("name");

  if (error) {
    console.error("Error fetching brands:", error);
    process.exit(1);
  }

  console.log(`Found ${brands.length} brands\n`);

  // Generate Amazon search URLs
  const amazonLinks: { brand: string; id: number; url: string }[] = [];

  for (const brand of brands) {
    // Amazon search URL for brand
    const searchQuery = brand.name;
    let url = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&i=fashion`;

    // Add affiliate tag if provided
    if (affiliateTag) {
      url += `&tag=${affiliateTag}`;
    }

    amazonLinks.push({
      brand: brand.name,
      id: brand.id,
      url,
    });
  }

  // Write to file (plain URLs for reference)
  const outputPath = "./amazon-brand-links.txt";
  await writeFile(outputPath, amazonLinks.map((l) => l.url).join("\n"));
  console.log(`📄 Saved ${amazonLinks.length} links to: ${outputPath}`);

  // Also create a CSV with brand names for easier review
  const csvPath = "./amazon-brand-links.csv";
  const csvContent = "Brand,Amazon URL\n" +
    amazonLinks.map((l) => `"${l.brand}","${l.url}"`).join("\n");
  await writeFile(csvPath, csvContent);
  console.log(`📄 Saved CSV to: ${csvPath}`);

  // Update database if --apply flag is set
  if (applyChanges && affiliateTag) {
    console.log("\nUpdating database...\n");

    let updated = 0;
    let errors = 0;

    for (const link of amazonLinks) {
      const { error: updateError } = await supabase
        .from("brands")
        .update({ amazon_url: link.url })
        .eq("id", link.id);

      if (updateError) {
        console.log(`❌ ${link.brand}: ${updateError.message}`);
        errors++;
      } else {
        console.log(`✅ ${link.brand}`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} brands`);
    if (errors > 0) {
      console.log(`❌ Errors: ${errors}`);
    }
  } else if (applyChanges && !affiliateTag) {
    console.log("\n⚠️  Cannot apply without affiliate tag. Use --tag=YOUR-TAG-20");
  }

  // Show sample links
  console.log("\nSample links:");
  amazonLinks.slice(0, 5).forEach((l) => {
    console.log(`  ${l.brand}: ${l.url.substring(0, 80)}...`);
  });

  if (!applyChanges) {
    console.log("\n💡 Run with --apply --tag=YOUR-TAG-20 to update the database");
  }
}

main().catch(console.error);
