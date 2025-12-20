import { brandData } from './brand-data';

interface ValidationIssue {
  brand: string;
  field: string;
  issue: string;
  value?: string;
}

function validateBrandData() {
  const issues: ValidationIssue[] = [];
  const brandNames = new Map<string, number>();
  const brandSlugs = new Map<string, string[]>();

  // Helper to create slug (same logic as update-brands.ts)
  function createSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  brandData.forEach((brand, index) => {
    const brandNum = index + 1;

    // Check for duplicates
    const lowerName = brand.name.toLowerCase();
    if (brandNames.has(lowerName)) {
      issues.push({
        brand: brand.name,
        field: 'name',
        issue: `Duplicate brand name (also at position ${brandNames.get(lowerName)})`
      });
    } else {
      brandNames.set(lowerName, brandNum);
    }

    // Check for slug conflicts
    const slug = createSlug(brand.name);
    if (!brandSlugs.has(slug)) {
      brandSlugs.set(slug, []);
    }
    brandSlugs.get(slug)!.push(brand.name);

    // Validate domain
    if (brand.domain) {
      if (brand.domain.startsWith('http://') || brand.domain.startsWith('https://')) {
        issues.push({
          brand: brand.name,
          field: 'domain',
          issue: 'Domain should not include http:// or https://',
          value: brand.domain
        });
      }
      if (brand.domain.startsWith('www.')) {
        issues.push({
          brand: brand.name,
          field: 'domain',
          issue: 'Domain should not include www. prefix',
          value: brand.domain
        });
      }
      if (brand.domain.includes('/')) {
        issues.push({
          brand: brand.name,
          field: 'domain',
          issue: 'Domain should not include paths',
          value: brand.domain
        });
      }
    }

    // Validate website_url
    if (brand.website_url) {
      if (!brand.website_url.startsWith('https://') && !brand.website_url.startsWith('http://')) {
        issues.push({
          brand: brand.name,
          field: 'website_url',
          issue: 'Website URL must start with https:// or http://',
          value: brand.website_url
        });
      }
    }

    // Validate wikipedia_url
    if (brand.wikipedia_url) {
      if (!brand.wikipedia_url.startsWith('https://')) {
        issues.push({
          brand: brand.name,
          field: 'wikipedia_url',
          issue: 'Wikipedia URL must start with https://',
          value: brand.wikipedia_url
        });
      }
      if (!brand.wikipedia_url.includes('wikipedia.org')) {
        issues.push({
          brand: brand.name,
          field: 'wikipedia_url',
          issue: 'Wikipedia URL should contain wikipedia.org',
          value: brand.wikipedia_url
        });
      }
    }

    // Validate founded_year
    if (brand.founded_year) {
      const currentYear = new Date().getFullYear();
      if (brand.founded_year < 1700 || brand.founded_year > currentYear) {
        issues.push({
          brand: brand.name,
          field: 'founded_year',
          issue: `Founded year should be between 1700 and ${currentYear}`,
          value: String(brand.founded_year)
        });
      }
    }

    // Validate description
    if (!brand.description) {
      issues.push({
        brand: brand.name,
        field: 'description',
        issue: 'Missing description (required for all brands)'
      });
    } else if (brand.description.length < 20) {
      issues.push({
        brand: brand.name,
        field: 'description',
        issue: 'Description is too short (should be at least 20 characters)',
        value: brand.description
      });
    }
  });

  // Check for slug conflicts
  brandSlugs.forEach((brands, slug) => {
    if (brands.length > 1) {
      brands.forEach(brandName => {
        issues.push({
          brand: brandName,
          field: 'slug',
          issue: `Slug conflict: "${slug}" is generated for multiple brands: ${brands.join(', ')}`
        });
      });
    }
  });

  // Report
  console.log('\n=== BRAND DATA VALIDATION ===\n');
  console.log(`Total brands: ${brandData.length}`);
  console.log(`Validation issues: ${issues.length}\n`);

  if (issues.length === 0) {
    console.log('✅ All validation checks passed!\n');
    console.log('Brand data is clean and ready for deployment.\n');
    return;
  }

  // Group issues by type
  const duplicateIssues = issues.filter(i => i.issue.includes('Duplicate') || i.issue.includes('conflict'));
  const domainIssues = issues.filter(i => i.field === 'domain');
  const urlIssues = issues.filter(i => i.field.includes('url'));
  const yearIssues = issues.filter(i => i.field === 'founded_year');
  const descriptionIssues = issues.filter(i => i.field === 'description');

  if (duplicateIssues.length > 0) {
    console.log('❌ DUPLICATE BRANDS / SLUG CONFLICTS\n');
    duplicateIssues.forEach(issue => {
      console.log(`  • ${issue.brand}`);
      console.log(`    ${issue.issue}`);
    });
    console.log('');
  }

  if (domainIssues.length > 0) {
    console.log('⚠️  DOMAIN FORMATTING ISSUES\n');
    domainIssues.forEach(issue => {
      console.log(`  • ${issue.brand}`);
      console.log(`    ${issue.issue}`);
      console.log(`    Current value: "${issue.value}"`);
    });
    console.log('');
  }

  if (urlIssues.length > 0) {
    console.log('⚠️  URL FORMATTING ISSUES\n');
    urlIssues.forEach(issue => {
      console.log(`  • ${issue.brand} (${issue.field})`);
      console.log(`    ${issue.issue}`);
      if (issue.value) console.log(`    Current value: "${issue.value}"`);
    });
    console.log('');
  }

  if (yearIssues.length > 0) {
    console.log('⚠️  FOUNDED YEAR ISSUES\n');
    yearIssues.forEach(issue => {
      console.log(`  • ${issue.brand}`);
      console.log(`    ${issue.issue}`);
      if (issue.value) console.log(`    Current value: ${issue.value}`);
    });
    console.log('');
  }

  if (descriptionIssues.length > 0) {
    console.log('⚠️  DESCRIPTION ISSUES\n');
    descriptionIssues.slice(0, 10).forEach(issue => {
      console.log(`  • ${issue.brand}`);
      console.log(`    ${issue.issue}`);
    });
    if (descriptionIssues.length > 10) {
      console.log(`    ... and ${descriptionIssues.length - 10} more`);
    }
    console.log('');
  }

  console.log('=== SUMMARY ===\n');
  console.log(`Duplicate/Conflict issues: ${duplicateIssues.length}`);
  console.log(`Domain issues: ${domainIssues.length}`);
  console.log(`URL issues: ${urlIssues.length}`);
  console.log(`Year issues: ${yearIssues.length}`);
  console.log(`Description issues: ${descriptionIssues.length}`);
  console.log('');

  console.log('Fix these issues in scripts/brand-data.ts before deploying.\n');

  // Exit with error code if there are critical issues (duplicates)
  if (duplicateIssues.length > 0) {
    process.exit(1);
  }
}

validateBrandData();
