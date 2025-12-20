import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { brandData } from './brand-data';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  config({ path: resolve(process.cwd(), '.env.production'), override: true });
}

// Brand tier categorization
const TIER_1_KEYWORDS = [
  // Streetwear
  'stone island', 'kappa', 'ellesse', 'sergio tacchini', 'comme des garcons',
  'cp company', 'maison margiela', 'helmut lang', 'yohji yamamoto',
  'issey miyake', 'jean paul gaultier',
  // Designer/Luxury
  'balenciaga', 'chanel', 'fendi', 'givenchy', 'dolce & gabbana',
  'armani', 'hermes', 'moschino', 'moncler',
  // Outdoor/Technical
  "arc'teryx", 'marmot', 'mountain hardwear', 'helly hansen', 'kelty',
  // Hip-hop/Urban
  'rocawear', 'sean john', 'karl kani', 'phat farm', 'pelle pelle',
  'fubu', 'cross colours', 'ecko',
  // Active brands with strong presence
  'lululemon', 'under armour', 'eddie bauer'
];

const TIER_2_KEYWORDS = [
  // Vintage sportswear
  'starter', 'logo 7', 'apex one', 'chalk line', 'majestic', 'mitchell & ness',
  'nutmeg', 'artex', 'pro player',
  // Outdoor
  'sierra designs', 'kelty', 'filson', 'woolrich', 'orvis',
  // Skate/Surf
  'etnies', 'dc shoes', 'vision street wear', "o'neill", 'rip curl',
  'lightning bolt', 'gotcha', 'rusty',
  // Denim/Workwear
  'pointer brand', 'round house', 'ben davis', 'stan ray', 'five brother',
  'red wing', 'wolverine',
  // Vintage brands with following
  'russell athletic', 'hummel', 'diadora', 'le coq sportif', 'lotto',
  'kappa', 'ellesse', 'sergio tacchini',
  // Heritage
  'brooks brothers', 'gant', 'j.crew', 'll bean', "lands' end",
  // Other notable
  'guess', 'diesel', 'lucky brand', 'evisu', 'replay'
];

function categorizeBrand(brandName: string, hasMetadata: boolean): 1 | 2 | 3 {
  const lowerName = brandName.toLowerCase();

  // If already has full metadata, lower priority
  if (hasMetadata) return 3;

  // Check Tier 1
  if (TIER_1_KEYWORDS.some(keyword => lowerName.includes(keyword))) {
    return 1;
  }

  // Check Tier 2
  if (TIER_2_KEYWORDS.some(keyword => lowerName.includes(keyword))) {
    return 2;
  }

  // Everything else is Tier 3
  return 3;
}

async function identifyNewBrands() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get all brands from database
  const { data: dbBrands, error } = await supabase
    .from('brands')
    .select('name, slug, logo_url, website_url, wikipedia_url, founded_year, description')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    process.exit(1);
  }

  // Create sets for comparison
  const brandDataNames = new Set(brandData.map(b => b.name.toLowerCase()));
  const dbBrandNames = new Set(dbBrands?.map(b => b.name.toLowerCase()) || []);

  // Find new brands (in DB but not in brand-data.ts)
  const newBrands = dbBrands?.filter(
    db => !brandDataNames.has(db.name.toLowerCase())
  ) || [];

  // Find brands needing enrichment (missing metadata)
  interface BrandNeedingEnrichment {
    name: string;
    missing: string[];
    tier: 1 | 2 | 3;
  }

  const brandsNeedingEnrichment: BrandNeedingEnrichment[] = [];

  brandData.forEach(brand => {
    const missing: string[] = [];

    if (!brand.domain) missing.push('domain');
    if (!brand.website_url) missing.push('website');
    if (!brand.wikipedia_url) missing.push('wikipedia');
    if (!brand.founded_year) missing.push('founded_year');

    if (missing.length > 0) {
      const hasMetadata = !!brand.domain || !!brand.website_url || !!brand.wikipedia_url || !!brand.founded_year;
      brandsNeedingEnrichment.push({
        name: brand.name,
        missing,
        tier: categorizeBrand(brand.name, hasMetadata)
      });
    }
  });

  // Sort by tier
  const tier1 = brandsNeedingEnrichment.filter(b => b.tier === 1);
  const tier2 = brandsNeedingEnrichment.filter(b => b.tier === 2);
  const tier3 = brandsNeedingEnrichment.filter(b => b.tier === 3);

  // Report
  console.log('\n=== BRAND DATA STATUS ===\n');
  console.log(`Total brands in database: ${dbBrands?.length || 0}`);
  console.log(`Total brands in brand-data.ts: ${brandData.length}`);
  console.log(`Brands needing enrichment: ${brandsNeedingEnrichment.length}\n`);

  if (newBrands.length > 0) {
    console.log('=== NEW BRANDS (In DB but not in brand-data.ts) ===');
    newBrands.forEach(brand => {
      console.log(`- ${brand.name}`);
    });
    console.log(`\nTotal: ${newBrands.length} new brands\n`);
  } else {
    console.log('✅ No new brands found (DB and brand-data.ts are in sync)\n');
  }

  console.log('=== BRANDS NEEDING ENRICHMENT ===\n');

  if (tier1.length > 0) {
    console.log(`TIER 1 - High Priority (${tier1.length} brands)`);
    console.log('Major streetwear, designer, outdoor, and active brands\n');
    tier1.slice(0, 15).forEach(brand => {
      console.log(`  • ${brand.name}`);
      console.log(`    Missing: ${brand.missing.join(', ')}`);
    });
    if (tier1.length > 15) {
      console.log(`    ... and ${tier1.length - 15} more`);
    }
    console.log('');
  }

  if (tier2.length > 0) {
    console.log(`TIER 2 - Medium Priority (${tier2.length} brands)`);
    console.log('Popular vintage, outdoor, skate, and heritage brands\n');
    tier2.slice(0, 10).forEach(brand => {
      console.log(`  • ${brand.name}`);
      console.log(`    Missing: ${brand.missing.join(', ')}`);
    });
    if (tier2.length > 10) {
      console.log(`    ... and ${tier2.length - 10} more`);
    }
    console.log('');
  }

  if (tier3.length > 0) {
    console.log(`TIER 3 - Lower Priority (${tier3.length} brands)`);
    console.log('Niche, defunct, or minimal-presence brands\n');
    console.log('  (Most Tier 3 brands may not need logos/URLs)\n');
  }

  console.log('=== NEXT STEPS ===\n');
  console.log('1. Start with Tier 1 brands:');
  console.log('   npm run enrich:brands -- --tier 1 --limit 10\n');
  console.log('2. Validate data quality:');
  console.log('   npm run validate:brands\n');
  console.log('3. Update production:');
  console.log('   NODE_ENV=production npm run update:brands\n');
}

identifyNewBrands().catch(console.error);
