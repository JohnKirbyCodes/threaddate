#!/usr/bin/env npx tsx

/**
 * Upload local logo files to Supabase storage and update brand records
 *
 * Expects files in format: Brand_Name_Logo_ThreadDate.ext
 * Extracts brand name by removing "_Logo_ThreadDate" suffix
 *
 * Usage:
 *   npx tsx scripts/upload-local-logos.ts ~/Desktop/logo     # Dry run
 *   npx tsx scripts/upload-local-logos.ts ~/Desktop/logo --apply   # Upload
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";
import { readdir, readFile } from "fs/promises";
import { join, extname } from "path";

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
const logoDir = args.find((a) => !a.startsWith("--")) || "~/Desktop/logo";

// Expand ~ to home directory
const expandedDir = logoDir.replace(/^~/, process.env.HOME || "");

// Extract brand name from filename
// Format: Brand_Name_Logo_ThreadDate.ext -> Brand Name
function extractBrandName(filename: string): string | null {
  // Remove extension
  const withoutExt = filename.replace(/\.[^.]+$/, "");

  // Remove _Logo_ThreadDate suffix (case insensitive)
  const match = withoutExt.match(/^(.+?)_Logo_ThreadDate$/i);
  if (!match) return null;

  // Replace underscores with spaces and handle special cases
  let brandName = match[1]
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Handle special character replacements
  brandName = brandName
    .replace(/'/g, "'") // Smart quotes
    .replace(/ \+ /g, " + "); // Plus sign spacing

  return brandName;
}

// Create slug from brand name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Get content type from extension
function getContentType(ext: string): string {
  const map: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };
  return map[ext.toLowerCase()] || "image/png";
}

async function main() {
  console.log("📁 Upload local logos to Supabase\n");
  console.log(`Directory: ${expandedDir}`);
  console.log(`Mode: ${applyChanges ? "APPLY CHANGES" : "DRY RUN (use --apply to upload)"}\n`);

  // Read directory
  let files: string[];
  try {
    files = await readdir(expandedDir);
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
    process.exit(1);
  }

  // Filter for image files
  const imageExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"];
  const imageFiles = files.filter((f) =>
    imageExts.includes(extname(f).toLowerCase())
  );

  console.log(`Found ${imageFiles.length} image files\n`);

  const results = {
    success: [] as { file: string; brand: string }[],
    notFound: [] as { file: string; brandName: string }[],
    errors: [] as { file: string; error: string }[],
  };

  for (const file of imageFiles) {
    process.stdout.write(`Processing ${file}... `);

    const brandName = extractBrandName(file);
    if (!brandName) {
      console.log("❌ Invalid filename format");
      results.errors.push({ file, error: "Invalid filename format" });
      continue;
    }

    // Find brand in database (case-insensitive search)
    const { data: brands, error: searchError } = await supabase
      .from("brands")
      .select("id, name, slug")
      .ilike("name", brandName);

    if (searchError) {
      console.log(`❌ Search error: ${searchError.message}`);
      results.errors.push({ file, error: searchError.message });
      continue;
    }

    if (!brands || brands.length === 0) {
      console.log(`⏭️  Brand not found: "${brandName}"`);
      results.notFound.push({ file, brandName });
      continue;
    }

    const brand = brands[0];

    if (!applyChanges) {
      console.log(`✅ Found: ${brand.name}`);
      results.success.push({ file, brand: brand.name });
      continue;
    }

    // Read file
    const filePath = join(expandedDir, file);
    let buffer: Buffer;
    try {
      buffer = await readFile(filePath);
    } catch (err: any) {
      console.log(`❌ Read error: ${err.message}`);
      results.errors.push({ file, error: err.message });
      continue;
    }

    // Upload to Supabase storage
    const ext = extname(file).toLowerCase();
    const contentType = getContentType(ext);
    const storagePath = `brand-logos/${brand.slug}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("tag-images")
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.log(`❌ Upload error: ${uploadError.message}`);
      results.errors.push({ file, error: uploadError.message });
      continue;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("tag-images").getPublicUrl(storagePath);

    // Update brand record
    const { error: updateError } = await supabase
      .from("brands")
      .update({ logo_url: publicUrl })
      .eq("id", brand.id);

    if (updateError) {
      console.log(`❌ Update error: ${updateError.message}`);
      results.errors.push({ file, error: updateError.message });
      continue;
    }

    console.log(`✅ Uploaded for ${brand.name}`);
    results.success.push({ file, brand: brand.name });
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`⏭️  Brand not found: ${results.notFound.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);

  if (results.success.length > 0) {
    console.log("\nSuccessfully matched:");
    results.success.forEach((r) => console.log(`  - ${r.file} → ${r.brand}`));
  }

  if (results.notFound.length > 0) {
    console.log("\nBrands not found in database:");
    results.notFound.forEach((r) =>
      console.log(`  - ${r.file} → "${r.brandName}"`)
    );
  }

  if (results.errors.length > 0) {
    console.log("\nErrors:");
    results.errors.forEach((r) => console.log(`  - ${r.file}: ${r.error}`));
  }

  if (!applyChanges && results.success.length > 0) {
    console.log("\n💡 Run with --apply to upload logos");
  }
}

main().catch(console.error);
