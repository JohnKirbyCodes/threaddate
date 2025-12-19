#!/usr/bin/env npx tsx

/**
 * Fetch brand logos from Wikipedia and upload to Supabase storage
 *
 * This script:
 * 1. Reads brands from the database that have wikipedia_url but no logo_url
 * 2. Fetches the Wikipedia page and extracts the infobox image
 * 3. Downloads the image
 * 4. Uploads to Supabase storage bucket
 * 5. Updates the brand's logo_url
 *
 * Usage:
 *   npx tsx scripts/fetch-wikipedia-logos.ts              # Dry run
 *   npx tsx scripts/fetch-wikipedia-logos.ts --apply      # Actually fetch and upload
 *   npx tsx scripts/fetch-wikipedia-logos.ts --limit=10   # Process only 10 brands
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
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1]) : undefined;

// Extract Wikipedia page title from URL
function getWikipediaTitle(url: string): string | null {
  try {
    const match = url.match(/wikipedia\.org\/wiki\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

// Extract logo filename from Wikipedia infobox wikitext
function extractLogoFromWikitext(wikitext: string): string | null {
  // Look for logo field in infobox (various formats)
  // | logo = filename.svg
  // | logo = [[File:filename.svg|...]]
  // |logo=filename.png
  const logoPatterns = [
    // Match: | logo = [[File:filename.svg|...]]
    /\|\s*logo\s*=\s*\[\[(?:File|Image):([^\]|]+)/i,
    // Match: | logo = filename.svg (simple format, most common)
    /\|\s*logo\s*=\s*([^\n\|{}<>]+\.(?:svg|png|jpg|jpeg|gif))/i,
    // Match: | image_logo = ...
    /\|\s*image_logo\s*=\s*\[\[(?:File|Image):([^\]|]+)/i,
    /\|\s*image_logo\s*=\s*([^\n\|{}<>]+\.(?:svg|png|jpg|jpeg|gif))/i,
  ];

  for (const pattern of logoPatterns) {
    const match = wikitext.match(pattern);
    if (match && match[1]) {
      // Clean up the filename
      let filename = match[1].trim();
      // Remove any trailing parameters or whitespace
      filename = filename.split("|")[0].trim();
      // Skip if it looks like a photo, not a logo
      const lowerFilename = filename.toLowerCase();
      if (lowerFilename.includes("headquarters") ||
          lowerFilename.includes("hq") ||
          lowerFilename.includes("building") ||
          lowerFilename.includes("store") ||
          lowerFilename.includes("office") ||
          lowerFilename.includes("storefront") ||
          lowerFilename.includes("flagship")) {
        continue;
      }
      return filename;
    }
  }

  return null;
}

// Get the actual image URL from a Wikipedia filename
async function getImageUrlFromFilename(filename: string): Promise<string | null> {
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=256&format=json`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "ThreadDate/1.0 (https://threaddate.com; contact@threaddate.com)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const pages = data.query?.pages;

    if (!pages) return null;

    // Get the first (and only) page
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    // Check for imageinfo - it may exist even with pageId "-1" for Commons files
    const imageInfo = page?.imageinfo?.[0];
    if (!imageInfo) return null;

    // Prefer thumburl (scaled) for consistent sizing, fallback to original
    return imageInfo.thumburl || imageInfo.url || null;
  } catch (error) {
    console.error(`Error getting image URL for ${filename}:`, error);
    return null;
  }
}

// Fetch the logo URL from Wikipedia infobox
async function getWikipediaImageUrl(title: string): Promise<string | null> {
  try {
    // Use MediaWiki API to get page wikitext (contains infobox)
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "ThreadDate/1.0 (https://threaddate.com; contact@threaddate.com)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.error) {
      return null;
    }

    const wikitext = data.parse?.wikitext?.["*"];
    if (!wikitext) {
      return null;
    }

    // Extract logo filename from infobox
    const logoFilename = extractLogoFromWikitext(wikitext);
    if (!logoFilename) {
      return null;
    }

    // Get the actual image URL
    return await getImageUrlFromFilename(logoFilename);
  } catch (error) {
    console.error(`Error fetching Wikipedia image for ${title}:`, error);
    return null;
  }
}

// Download image and return as buffer
async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ThreadDate/1.0 (https://threaddate.com; contact@threaddate.com)",
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return { buffer, contentType };
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return null;
  }
}

// Get file extension from content type
function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return map[contentType] || "png";
}

// Upload to Supabase storage
async function uploadToSupabase(
  slug: string,
  buffer: Buffer,
  contentType: string
): Promise<string | null> {
  try {
    const extension = getExtension(contentType);
    const filename = `brand-logos/${slug}.${extension}`;

    const { error } = await supabase.storage
      .from("tag-images") // Using existing bucket
      .upload(filename, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`Upload error for ${slug}:`, error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("tag-images")
      .getPublicUrl(filename);

    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${slug}:`, error);
    return null;
  }
}

async function main() {
  console.log("🖼️  Fetch Wikipedia logos for brands\n");
  console.log(`Mode: ${applyChanges ? "APPLY CHANGES" : "DRY RUN (use --apply to fetch and upload)"}`);
  if (limit) console.log(`Limit: ${limit} brands`);
  console.log("");

  // Fetch brands with wikipedia_url but no logo_url
  let query = supabase
    .from("brands")
    .select("id, name, slug, logo_url, wikipedia_url")
    .not("wikipedia_url", "is", null)
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

  console.log(`Found ${brands.length} brands with Wikipedia URLs but no logo\n`);

  const results = {
    success: [] as { name: string; url: string }[],
    noImage: [] as string[],
    errors: [] as { name: string; error: string }[],
  };

  for (const brand of brands) {
    process.stdout.write(`Processing ${brand.name}... `);

    try {
      const title = getWikipediaTitle(brand.wikipedia_url!);
      if (!title) {
        console.log("❌ Invalid Wikipedia URL");
        results.errors.push({ name: brand.name, error: "Invalid Wikipedia URL" });
        continue;
      }

      const imageUrl = await getWikipediaImageUrl(title);
      if (!imageUrl) {
        console.log("⏭️  No image found");
        results.noImage.push(brand.name);
        continue;
      }

      if (!applyChanges) {
        console.log(`✅ Found: ${imageUrl.substring(0, 60)}...`);
        results.success.push({ name: brand.name, url: imageUrl });
        continue;
      }

      // Download the image
      const imageData = await downloadImage(imageUrl);
      if (!imageData) {
        console.log("❌ Failed to download");
        results.errors.push({ name: brand.name, error: "Failed to download image" });
        continue;
      }

      // Upload to Supabase
      const publicUrl = await uploadToSupabase(brand.slug, imageData.buffer, imageData.contentType);
      if (!publicUrl) {
        console.log("❌ Failed to upload");
        results.errors.push({ name: brand.name, error: "Failed to upload to storage" });
        continue;
      }

      // Update brand record
      const { error: updateError } = await supabase
        .from("brands")
        .update({ logo_url: publicUrl })
        .eq("id", brand.id);

      if (updateError) {
        console.log(`❌ Failed to update: ${updateError.message}`);
        results.errors.push({ name: brand.name, error: updateError.message });
        continue;
      }

      console.log("✅ Uploaded");
      results.success.push({ name: brand.name, url: publicUrl });

    } catch (err: any) {
      console.log(`❌ Error: ${err.message}`);
      results.errors.push({ name: brand.name, error: err.message });
    }

    // Rate limiting - be nice to Wikipedia
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`⏭️  No image: ${results.noImage.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);

  if (results.success.length > 0 && !applyChanges) {
    console.log("\nBrands with available logos:");
    results.success.slice(0, 20).forEach((b) => console.log(`  - ${b.name}`));
    if (results.success.length > 20) {
      console.log(`  ... and ${results.success.length - 20} more`);
    }
    console.log("\n💡 Run with --apply to download and upload logos");
  }

  if (results.noImage.length > 0) {
    console.log("\nBrands without Wikipedia images:");
    results.noImage.forEach((name) => console.log(`  - ${name}`));
  }

  if (results.errors.length > 0) {
    console.log("\nErrors:");
    results.errors.forEach((e) => console.log(`  - ${e.name}: ${e.error}`));
  }
}

main().catch(console.error);
