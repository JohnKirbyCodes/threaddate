#!/usr/bin/env npx tsx

/**
 * Add amazon_url column to brands table
 * Run this once to add the column, then populate with affiliate links
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
});

async function main() {
  console.log("Adding amazon_url column to brands table...\n");

  // Use Supabase's SQL execution via the management API
  // Since we can't run raw SQL directly, we'll need to do this via Dashboard
  // But we can test if the column exists by trying to select it

  const { data, error } = await supabase
    .from('brands')
    .select('amazon_url')
    .limit(1);

  if (error && error.message.includes('amazon_url')) {
    console.log("❌ Column 'amazon_url' does not exist.");
    console.log("\nPlease add it manually via Supabase Dashboard:");
    console.log("1. Go to https://supabase.com/dashboard");
    console.log("2. Select your project");
    console.log("3. Go to SQL Editor");
    console.log("4. Run this SQL:\n");
    console.log("   ALTER TABLE brands ADD COLUMN amazon_url TEXT;");
    console.log("\nOr run via Table Editor → brands → Add column → 'amazon_url' (text)");
  } else if (error) {
    console.log("Error:", error.message);
  } else {
    console.log("✅ Column 'amazon_url' already exists!");
    console.log("\nYou can now run:");
    console.log("   npx tsx scripts/generate-amazon-links.ts --tag=threaddate-20 --apply");
  }
}

main().catch(console.error);
