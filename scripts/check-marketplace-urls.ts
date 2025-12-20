import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  config({ path: resolve(process.cwd(), '.env.production'), override: true });
}

async function checkMarketplaceUrls() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get all brands with marketplace URLs
  const { data: brands, error } = await supabase
    .from('brands')
    .select('name, slug, ebay_url, poshmark_url, depop_url')
    .order('name')
    .limit(10);

  if (error) {
    console.error('Error fetching brands:', error);
    process.exit(1);
  }

  console.log(`\n=== MARKETPLACE URL VERIFICATION (Sample of 10 brands) ===\n`);

  brands?.forEach(brand => {
    console.log(`Brand: ${brand.name}`);
    console.log(`  Slug: ${brand.slug}`);
    console.log(`  eBay: ${brand.ebay_url || '❌ MISSING'}`);
    console.log(`  Poshmark: ${brand.poshmark_url || '❌ MISSING'}`);
    console.log(`  Depop: ${brand.depop_url || '❌ MISSING'}`);
    console.log('');
  });

  // Count brands with marketplace URLs
  const { data: allBrands } = await supabase
    .from('brands')
    .select('ebay_url, poshmark_url, depop_url');

  const withEbay = allBrands?.filter(b => !!b.ebay_url).length || 0;
  const withPoshmark = allBrands?.filter(b => !!b.poshmark_url).length || 0;
  const withDepop = allBrands?.filter(b => !!b.depop_url).length || 0;

  console.log(`=== MARKETPLACE URL STATISTICS ===\n`);
  console.log(`Total brands: ${allBrands?.length || 0}`);
  console.log(`Brands with eBay URLs: ${withEbay} / ${allBrands?.length || 0}`);
  console.log(`Brands with Poshmark URLs: ${withPoshmark} / ${allBrands?.length || 0}`);
  console.log(`Brands with Depop URLs: ${withDepop} / ${allBrands?.length || 0}\n`);
}

checkMarketplaceUrls().catch(console.error);
