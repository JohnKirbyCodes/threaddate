#!/usr/bin/env npx tsx

/**
 * Auto-fetch logos for brands missing them
 *
 * This script:
 * 1. Fetches all brands with null logo_url from the database
 * 2. Uses known domain mappings for well-known brands
 * 3. Tries common domain patterns for unknown brands
 * 4. Updates the database with logo URLs (frontend handles 404 fallbacks)
 *
 * Usage:
 *   npx tsx scripts/auto-fetch-logos.ts              # Dry run (no changes)
 *   npx tsx scripts/auto-fetch-logos.ts --apply      # Actually update database
 *   npx tsx scripts/auto-fetch-logos.ts --limit=10   # Process only 10 brands
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

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
const limitArg = args.find(a => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1]) : undefined;

// Known domain mappings for CLOTHING brands only
// Empty string = skip (no logo available/not a clothing brand)
const KNOWN_DOMAINS: Record<string, string> = {
  // NON-CLOTHING BRANDS - Skip these (licensed/promotional, not clothing manufacturers)
  "Budweiser": "",
  "Coca-Cola": "",
  "Pepsi": "",
  "McDonald's": "",
  "Camel": "",
  "Marlboro": "",
  "Warner Bros": "",
  "Looney Tunes": "",
  "Planet Hollywood": "",
  "Mickey & Co": "",

  // Retail store brands (private label clothing lines)
  "Croft & Barrow": "kohls.com",
  "Sonoma": "kohls.com",
  "St. John's Bay": "jcpenney.com",
  "Faded Glory": "walmart.com",
  "Athletic Works": "walmart.com",
  "George": "walmart.com",
  "No Boundaries": "walmart.com",
  "Merona": "target.com",
  "Mossimo": "mossimo.com",
  "Towncraft": "jcpenney.com",

  // Fashion brands with known domains
  "ENYCE": "enyce.com",
  "Jordache": "jordache.com",
  "Bugle Boy": "bugleboy.com",
  "Gloria Vanderbilt": "gloriavanderbilt.com",
  "Mecca": "meccausa.com",
  "Chic": "chicjeans.com",
  "Sasson": "sasson.com",

  // Western wear
  "Panhandle Slim": "panhandleslim.com",
  "H Bar C": "hbarc.com",
  "Karman": "karmanwestern.com",

  // Workwear
  "Big Mac": "jcpenney.com",
  "Big Smith": "bigsmith.com",
  "Hercules": "sears.com",
  "Washington Dee Cee": "deecee.com",

  // Blank/Wholesale brands
  "Delta": "deltaapparel.com",
  "Tultex": "tultex.com",
  "Oneita": "oneita.com",
  "Stedman": "stedman.eu",
  "Healthknit": "healthknit.jp",
  "M&O": "mfruits.com",
  "Tee Jays": "teejays.eu",

  // Sports/Licensed
  "Pro Player": "proplayer.com",
  "Logo 7": "logo7.com",
  "Nutmeg": "nutmegmills.com",
  "Apex One": "apexone.com",

  // Vintage/defunct - skip (empty string)
  "Brockum": "",
  "Artex": "",
  "Screen Stars": "",
  "Magic Johnson Ts": "",
  "Mayo Spruce": "",
  "Spring Ford": "",
  "Bantam": "",
  "Brent": "",
  "Cheddar": "",
  "Giant": "",
  "Pilgrim": "",
  "Power House": "",
  "Signal": "",
  "Sportswear": "",
  "Terra": "",
  "Town & Country": "",
  "Trench": "",
  "Maurice Malone": "",
  "Jimmy'Z": "jimmyz.com",
  "White Stag": "whitestag.com",
  "Montgomery Ward": "wards.com",
  "Brahma": "brahma.com.br",

  // Military (no commercial logos)
  "US Air Force": "",
  "US Army": "",
  "US Navy": "",
  "USMC": "",
};

// Generate likely domain for unknown brands
function guessDomain(brandName: string, slug: string): string | null {
  // Check known domains first
  if (brandName in KNOWN_DOMAINS) {
    const domain = KNOWN_DOMAINS[brandName];
    return domain || null; // null if empty string (skip)
  }

  // Clean brand name for domain guessing
  const cleaned = brandName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");

  // Simple heuristic: try brandname.com
  return `${cleaned}.com`;
}

async function main() {
  console.log("🔍 Auto-fetch logos for brands\n");
  console.log(`Mode: ${applyChanges ? "APPLY CHANGES" : "DRY RUN (use --apply to update)"}`);
  if (limit) console.log(`Limit: ${limit} brands`);
  console.log("");

  // Fetch brands without logos
  let query = supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .is("logo_url", null)
    .order("name");

  if (limit) {
    query = query.limit(limit);
  }

  const { data: brands, error } = await query;

  if (error) {
    console.error("Error fetching brands:", error);
    process.exit(1);
  }

  console.log(`Found ${brands.length} brands without logos\n`);

  const results = {
    found: [] as { id: number; name: string; domain: string; logoUrl: string }[],
    skipped: [] as { id: number; name: string; reason: string }[],
    errors: [] as { id: number; name: string; error: string }[],
  };

  for (const brand of brands) {
    process.stdout.write(`Checking ${brand.name}... `);

    try {
      const domain = guessDomain(brand.name, brand.slug);

      if (!domain) {
        console.log("⏭️  Skipped (no logo available)");
        results.skipped.push({ id: brand.id, name: brand.name, reason: "No logo available" });
        continue;
      }

      const logoUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
      console.log(`✅ ${domain}`);

      results.found.push({
        id: brand.id,
        name: brand.name,
        domain,
        logoUrl,
      });

      if (applyChanges) {
        const { error: updateError } = await supabase
          .from("brands")
          .update({ logo_url: logoUrl })
          .eq("id", brand.id);

        if (updateError) {
          console.error(`  ⚠️  Update failed: ${updateError.message}`);
          results.errors.push({ id: brand.id, name: brand.name, error: updateError.message });
        }
      }
    } catch (err: any) {
      console.log(`⚠️  Error: ${err.message}`);
      results.errors.push({ id: brand.id, name: brand.name, error: err.message });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Logos set: ${results.found.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);
  console.log(`⚠️  Errors: ${results.errors.length}`);

  if (results.found.length > 0) {
    console.log("\nBrands with logos:");
    results.found.forEach(b => console.log(`  - ${b.name} → ${b.domain}`));
  }

  if (results.skipped.length > 0) {
    console.log("\nSkipped brands (no logo):");
    results.skipped.forEach(b => console.log(`  - ${b.name}`));
  }

  if (!applyChanges && results.found.length > 0) {
    console.log("\n💡 Run with --apply to update the database");
  }

  if (applyChanges && results.found.length > 0) {
    console.log(`\n✅ Updated ${results.found.length - results.errors.length} brands in the database`);
  }
}

main().catch(console.error);
