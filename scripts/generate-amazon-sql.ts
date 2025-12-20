#!/usr/bin/env npx tsx

/**
 * Generate SQL statements to update Amazon URLs for all brands
 * Use this when PostgREST schema cache hasn't refreshed yet
 *
 * Usage:
 *   npx tsx scripts/generate-amazon-sql.ts --tag=threaddate-20
 *
 * Then copy the output SQL and run it in Supabase SQL Editor
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

// Parse CLI arguments
const args = process.argv.slice(2);
const tagArg = args.find((a) => a.startsWith("--tag="));
const affiliateTag = tagArg ? tagArg.split("=")[1] : null;

async function main() {
  console.log("🛒 Generate SQL to update Amazon affiliate links\n");

  if (!affiliateTag) {
    console.error("❌ Affiliate tag required. Use --tag=YOUR-TAG-20");
    process.exit(1);
  }

  console.log(`Affiliate Tag: ${affiliateTag}\n`);

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

  // Generate SQL statements
  const sqlStatements: string[] = [
    "-- Amazon affiliate URL updates for all brands",
    `-- Generated with tag: ${affiliateTag}`,
    `-- Date: ${new Date().toISOString()}`,
    "",
    "BEGIN;",
    ""
  ];

  for (const brand of brands) {
    const searchQuery = brand.name;
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}&i=fashion&tag=${affiliateTag}`;

    // Escape single quotes in URL for SQL
    const escapedUrl = url.replace(/'/g, "''");

    sqlStatements.push(`UPDATE brands SET amazon_url = '${escapedUrl}' WHERE id = ${brand.id};`);
  }

  sqlStatements.push("");
  sqlStatements.push("COMMIT;");
  sqlStatements.push("");
  sqlStatements.push(`-- Updated ${brands.length} brands`);

  const sql = sqlStatements.join("\n");

  // Write to file
  const outputPath = "./amazon-url-updates.sql";
  await writeFile(outputPath, sql);
  console.log(`📄 Saved SQL to: ${outputPath}`);
  console.log(`\n💡 Run this SQL in Supabase SQL Editor to update all brands`);
  console.log(`   Or wait for PostgREST cache to refresh and use generate-amazon-links.ts --apply`);
}

main().catch(console.error);
