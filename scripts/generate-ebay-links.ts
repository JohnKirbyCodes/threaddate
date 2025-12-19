#!/usr/bin/env npx tsx

/**
 * Generate eBay search links for all brands
 * Outputs a text file with one link per line for eBay affiliate bulk conversion
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";
import { writeFile } from "fs/promises";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

async function main() {
  // Fetch all brands
  const { data: brands, error } = await supabase
    .from("brands")
    .select("name, slug")
    .order("name");

  if (error) {
    console.error("Error fetching brands:", error);
    process.exit(1);
  }

  console.log(`Found ${brands.length} brands\n`);

  // Generate eBay search URLs
  const ebayLinks = brands.map((brand) => {
    // eBay vintage clothing search with brand name
    return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(brand.name + " vintage")}&_sacat=11450`;
  });

  // Write to file
  const outputPath = "./ebay-brand-links.txt";
  await writeFile(outputPath, ebayLinks.join("\n"));

  console.log(`✅ Generated ${ebayLinks.length} eBay links`);
  console.log(`📄 Saved to: ${outputPath}`);
  console.log("\nFirst 10 links:");
  ebayLinks.slice(0, 10).forEach((link) => console.log(`  ${link}`));
}

main().catch(console.error);
