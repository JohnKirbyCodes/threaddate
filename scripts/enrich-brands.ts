import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { brandData, type BrandData } from './brand-data';

interface EnrichmentTemplate {
  name: string;
  current: {
    domain?: string;
    website_url?: string;
    wikipedia_url?: string;
    founded_year?: number;
    description: string;
  };
  suggested: {
    domain?: string;
    website_url?: string;
    wikipedia_url?: string;
    founded_year?: number;
  };
}

// Parse command line arguments
const args = process.argv.slice(2);
const tierArg = args.find(arg => arg.startsWith('--tier='))?.split('=')[1];
const limitArg = args.find(arg => arg.startsWith('--limit='))?.split('=')[1];
const generateTemplate = args.includes('--generate-template');

const tier = tierArg ? parseInt(tierArg) : 1;
const limit = limitArg ? parseInt(limitArg) : 10;

// Tier 1 brands (from identify-new-brands.ts logic)
const TIER_1_KEYWORDS = [
  'stone island', 'kappa', 'ellesse', 'sergio tacchini', 'comme des garcons',
  'cp company', 'maison margiela', 'helmut lang', 'yohji yamamoto',
  'issey miyake', 'jean paul gaultier', 'balenciaga', 'chanel', 'fendi',
  'givenchy', 'dolce & gabbana', 'armani', 'hermes', 'moschino', 'moncler',
  "arc'teryx", 'marmot', 'mountain hardwear', 'helly hansen', 'kelty',
  'rocawear', 'sean john', 'karl kani', 'phat farm', 'pelle pelle',
  'fubu', 'cross colours', 'ecko', 'lululemon', 'under armour', 'eddie bauer'
];

function isTier1(brandName: string): boolean {
  const lower = brandName.toLowerCase();
  return TIER_1_KEYWORDS.some(keyword => lower.includes(keyword));
}

function generateEnrichmentTemplate() {
  // Find brands needing enrichment
  const brandsNeedingWork = brandData.filter(brand => {
    if (tier === 1 && !isTier1(brand.name)) return false;
    return !brand.domain || !brand.website_url || !brand.wikipedia_url || !brand.founded_year;
  }).slice(0, limit);

  const template: EnrichmentTemplate[] = brandsNeedingWork.map(brand => ({
    name: brand.name,
    current: {
      domain: brand.domain,
      website_url: brand.website_url,
      wikipedia_url: brand.wikipedia_url,
      founded_year: brand.founded_year,
      description: brand.description || ''
    },
    suggested: {
      domain: undefined,
      website_url: undefined,
      wikipedia_url: undefined,
      founded_year: undefined
    }
  }));

  const templatePath = resolve(process.cwd(), 'brand-enrichment-template.json');
  writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf-8');

  console.log('\n=== ENRICHMENT TEMPLATE GENERATED ===\n');
  console.log(`Template saved to: ${templatePath}`);
  console.log(`Brands to enrich: ${template.length}\n`);
  console.log('Next steps:');
  console.log('1. Edit brand-enrichment-template.json');
  console.log('2. Fill in the "suggested" fields for each brand');
  console.log('3. Run: npm run enrich:brands -- --apply-template\n');
  console.log('Tip: Research brands using:');
  console.log('  - Google: "{brand name} official website"');
  console.log('  - Wikipedia: "{brand name} wikipedia"');
  console.log('  - Test logos: https://logo.clearbit.com/{domain}\n');
}

function applyTemplate() {
  const templatePath = resolve(process.cwd(), 'brand-enrichment-template.json');

  try {
    const templateContent = readFileSync(templatePath, 'utf-8');
    const template: EnrichmentTemplate[] = JSON.parse(templateContent);

    console.log('\n=== APPLYING ENRICHMENT TEMPLATE ===\n');

    let updatedCount = 0;
    const updates: string[] = [];

    template.forEach(item => {
      const brand = brandData.find(b => b.name === item.name);
      if (!brand) {
        console.log(`⚠️  Brand not found: ${item.name}`);
        return;
      }

      const changes: string[] = [];

      if (item.suggested.domain && item.suggested.domain !== brand.domain) {
        brand.domain = item.suggested.domain;
        changes.push(`domain: ${item.suggested.domain}`);
      }

      if (item.suggested.website_url && item.suggested.website_url !== brand.website_url) {
        brand.website_url = item.suggested.website_url;
        changes.push(`website: ${item.suggested.website_url}`);
      }

      if (item.suggested.wikipedia_url && item.suggested.wikipedia_url !== brand.wikipedia_url) {
        brand.wikipedia_url = item.suggested.wikipedia_url;
        changes.push('wikipedia: added');
      }

      if (item.suggested.founded_year && item.suggested.founded_year !== brand.founded_year) {
        brand.founded_year = item.suggested.founded_year;
        changes.push(`founded: ${item.suggested.founded_year}`);
      }

      if (changes.length > 0) {
        updates.push(`  ✓ ${brand.name}: ${changes.join(', ')}`);
        updatedCount++;
      }
    });

    if (updatedCount === 0) {
      console.log('No updates to apply. Template may be empty or unchanged.\n');
      return;
    }

    console.log('Updates to apply:\n');
    updates.forEach(update => console.log(update));
    console.log(`\nTotal brands to update: ${updatedCount}\n`);

    // This would write back to brand-data.ts
    // For now, just show what would be updated
    console.log('⚠️  DRY RUN MODE');
    console.log('To actually update brand-data.ts, you need to manually apply these changes.\n');
    console.log('Alternatively, update the brandData array programmatically and regenerate the file.\n');

  } catch (error) {
    console.error('Error reading template:', error);
    console.log('\nMake sure you generated a template first:');
    console.log('  npm run enrich:brands -- --generate-template\n');
  }
}

function showUsage() {
  console.log('\n=== BRAND ENRICHMENT TOOL ===\n');
  console.log('This tool helps you add metadata (domains, URLs, founded years) to brands.\n');
  console.log('Usage:\n');
  console.log('  Generate template for manual enrichment:');
  console.log('    npm run enrich:brands -- --tier=1 --limit=10 --generate-template\n');
  console.log('  Apply template changes:');
  console.log('    npm run enrich:brands -- --apply-template\n');
  console.log('Options:');
  console.log('  --tier=<1|2|3>     Filter by brand tier (default: 1)');
  console.log('  --limit=<number>   Number of brands to include (default: 10)');
  console.log('  --generate-template Generate enrichment template JSON');
  console.log('  --apply-template   Apply changes from template (NOT YET IMPLEMENTED)\n');
  console.log('Current Status:\n');

  // Show counts
  const needingWork = brandData.filter(b =>
    !b.domain || !b.website_url || !b.wikipedia_url || !b.founded_year
  );

  const tier1Needing = needingWork.filter(b => isTier1(b.name));

  console.log(`  Total brands: ${brandData.length}`);
  console.log(`  Brands needing enrichment: ${needingWork.length}`);
  console.log(`  Tier 1 brands needing work: ${tier1Needing.length}\n`);

  console.log('Recommended workflow:\n');
  console.log('  1. npm run identify:brands      # See what needs work');
  console.log('  2. npm run enrich:brands -- --generate-template');
  console.log('  3. Edit brand-enrichment-template.json manually');
  console.log('  4. Manually update scripts/brand-data.ts with the changes');
  console.log('  5. npm run validate:brands      # Validate changes');
  console.log('  6. NODE_ENV=production npm run update:brands\n');
}

function main() {
  if (generateTemplate) {
    generateEnrichmentTemplate();
  } else if (args.includes('--apply-template')) {
    applyTemplate();
  } else {
    showUsage();
  }
}

main();
