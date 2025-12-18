import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { brandData, type BrandData } from './brand-data';

// Load environment variables from .env.production if NODE_ENV is production
if (process.env.NODE_ENV === 'production') {
  config({ path: resolve(process.cwd(), '.env.production'), override: true });
}

// Helper to create slug from brand name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper to generate marketplace URLs
function generateMarketplaceUrls(brandName: string, slug: string) {
  return {
    ebay_url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(brandName)}`,
    poshmark_url: `https://poshmark.com/brand/${slug}`,
    depop_url: `https://www.depop.com/search/?q=${encodeURIComponent(brandName)}`
  };
}

async function updateBrands() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  console.log(`Connecting to: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`Updating ${brandData.length} brands with URLs and logos...`);

  // Transform brand data into database records
  const brandRecords = brandData.map((brand: BrandData) => {
    const slug = createSlug(brand.name);
    const marketplaceUrls = generateMarketplaceUrls(brand.name, slug);

    return {
      name: brand.name,
      slug,
      logo_url: brand.domain ? `https://logo.clearbit.com/${brand.domain}` : null,
      website_url: brand.website_url || null,
      wikipedia_url: brand.wikipedia_url || null,
      founded_year: brand.founded_year || null,
      description: brand.description || null,
      country_code: brand.country_code || null,
      ebay_url: marketplaceUrls.ebay_url,
      poshmark_url: marketplaceUrls.poshmark_url,
      depop_url: marketplaceUrls.depop_url,
      verified: false,
    };
  });

  // Insert in batches of 100 to avoid timeout
  const batchSize = 100;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < brandRecords.length; i += batchSize) {
    const batch = brandRecords.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('brands')
      .upsert(batch, {
        onConflict: 'slug',
        ignoreDuplicates: false
      });

    if (error) {
      console.error(`Error updating batch ${i / batchSize + 1}:`, error);
      errors += batch.length;
    } else {
      updated += batch.length;
      console.log(`✓ Updated batch ${i / batchSize + 1} (${batch.length} brands)`);
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`   Updated: ${updated} brands`);
  if (errors > 0) {
    console.log(`   Errors: ${errors} brands`);
  }
}

updateBrands().catch(console.error);
