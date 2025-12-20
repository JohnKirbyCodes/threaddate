import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  config({ path: resolve(process.cwd(), '.env.production'), override: true });
}

async function checkBrandStatus() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get all brands
  const { data: brands, error } = await supabase
    .from('brands')
    .select('name, slug, logo_url, website_url, wikipedia_url, description, founded_year')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
    process.exit(1);
  }

  console.log(`Total brands in database: ${brands?.length || 0}\n`);

  // Analyze completeness
  let withLogos = 0;
  let withWebsites = 0;
  let withWikipedia = 0;
  let withDescriptions = 0;
  let withFoundedYear = 0;
  let complete = 0;
  const missingData: any[] = [];

  brands?.forEach(brand => {
    const hasLogo = !!brand.logo_url;
    const hasWebsite = !!brand.website_url;
    const hasWikipedia = !!brand.wikipedia_url;
    const hasDescription = !!brand.description;
    const hasFoundedYear = !!brand.founded_year;

    if (hasLogo) withLogos++;
    if (hasWebsite) withWebsites++;
    if (hasWikipedia) withWikipedia++;
    if (hasDescription) withDescriptions++;
    if (hasFoundedYear) withFoundedYear++;

    // Consider "complete" if it has description (minimum)
    if (hasDescription) {
      complete++;
    } else {
      missingData.push({
        name: brand.name,
        missing: {
          logo: !hasLogo,
          website: !hasWebsite,
          wikipedia: !hasWikipedia,
          description: !hasDescription,
          founded_year: !hasFoundedYear
        }
      });
    }
  });

  console.log('=== DATA COMPLETENESS ===');
  console.log(`Brands with logos:        ${withLogos} / ${brands?.length}`);
  console.log(`Brands with websites:     ${withWebsites} / ${brands?.length}`);
  console.log(`Brands with Wikipedia:    ${withWikipedia} / ${brands?.length}`);
  console.log(`Brands with descriptions: ${withDescriptions} / ${brands?.length}`);
  console.log(`Brands with founded year: ${withFoundedYear} / ${brands?.length}`);
  console.log(`\nComplete brands:          ${complete} / ${brands?.length}`);
  console.log(`Brands missing data:      ${missingData.length}\n`);

  if (missingData.length > 0) {
    console.log('=== BRANDS MISSING DESCRIPTION ===');
    missingData.slice(0, 10).forEach(brand => {
      console.log(`- ${brand.name}`);
    });
    if (missingData.length > 10) {
      console.log(`... and ${missingData.length - 10} more\n`);
    }
  }
}

checkBrandStatus().catch(console.error);
