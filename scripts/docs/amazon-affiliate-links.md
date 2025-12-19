# Amazon Affiliate Links Setup

This document describes how to set up Amazon Associates affiliate links for ThreadDate brands.

## Overview

Unlike eBay's bulk link converter, Amazon Associates requires a different approach. Amazon offers several methods:

| Method | Bulk Support | Automation | Requirements |
|--------|--------------|------------|--------------|
| Direct Tag URLs | ✅ Yes | ✅ Easy | Associates account |
| SiteStripe | ❌ No | ❌ Manual | Browser toolbar |
| Product Advertising API | ✅ Yes | ✅ Full | API approval (harder to get) |

## Recommended Approach: Direct Tag URLs

The simplest method is adding your affiliate tag directly to Amazon search URLs. This is fully compliant with Amazon's Terms of Service.

### URL Format

```
https://www.amazon.com/s?k=SEARCH_TERM&i=fashion&tag=YOUR-TAG-20
```

Parameters:
- `k` - Search keywords
- `i=fashion` - Fashion department filter
- `tag` - Your Amazon Associates tracking ID

### Generate Links

```bash
# Generate links with your affiliate tag
npx tsx scripts/generate-amazon-links.ts --tag=threaddate-20

# Preview and update database
npx tsx scripts/generate-amazon-links.ts --tag=threaddate-20 --apply
```

This creates:
- `amazon-brand-links.txt` - Plain URLs (one per line)
- `amazon-brand-links.csv` - CSV with brand names and URLs

## Alternative: SiteStripe

Amazon's SiteStripe is a browser toolbar that appears when you're logged into Associates and browsing Amazon.

### How SiteStripe Works

1. Log into [Amazon Associates](https://affiliate-program.amazon.com/)
2. Browse to any Amazon page
3. Use the SiteStripe toolbar at the top to generate affiliate links

### Limitations

- **No bulk conversion** - Must visit each page individually
- **Manual process** - Click through each URL
- **Time consuming** - Not practical for 263+ brands

### When to Use SiteStripe

- Converting a few specific product links
- Creating deep links to specific items
- Testing that your tag is working

## Alternative: Product Advertising API

Amazon's PA-API allows programmatic link generation but:

- Requires separate approval process
- Must generate qualifying sales first
- Rate limited
- More complex implementation

Not recommended for initial setup.

## Database Setup

To store Amazon URLs, add the `amazon_url` column to the brands table:

```sql
ALTER TABLE brands ADD COLUMN amazon_url TEXT;
```

## Implementation Notes

### Current Script Behavior

The `generate-amazon-links.ts` script:

1. Fetches all brands from database
2. Generates Amazon search URLs: `[brand name] vintage clothing`
3. Adds affiliate tag if provided
4. Outputs to text and CSV files
5. Optionally updates database with `--apply`

### Search Strategy

Links search for `"[brand] vintage clothing"` in Amazon's Fashion department to show relevant results for vintage clothing shoppers.

## Compliance Notes

Amazon Associates Operating Agreement requires:

- Clearly identifying affiliate links
- Not cloaking or hiding affiliate nature
- Not using affiliate links in emails
- Updating links if your tag changes

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `scripts/generate-amazon-links.ts` | Generate Amazon affiliate URLs |

## Example Usage

```bash
# Step 1: Generate links with your tag
npx tsx scripts/generate-amazon-links.ts --tag=threaddate-20

# Step 2: Review generated files
cat amazon-brand-links.csv | head -20

# Step 3: Update database (after adding amazon_url column)
npx tsx scripts/generate-amazon-links.ts --tag=threaddate-20 --apply
```

## Comparison: eBay vs Amazon

| Feature | eBay Partner Network | Amazon Associates |
|---------|---------------------|-------------------|
| Bulk converter | ✅ Yes (Link Generator) | ❌ No |
| Direct tag URLs | ✅ Yes | ✅ Yes |
| Commission rate | 1-4% | 1-10% (varies) |
| Cookie duration | 24 hours | 24 hours |
| API access | Available | Requires approval |
