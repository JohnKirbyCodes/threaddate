# eBay Affiliate Links Setup

This document describes how to generate and import eBay affiliate links for all brands in the ThreadDate database.

## Overview

ThreadDate uses eBay's Partner Network affiliate program to monetize brand pages. Each brand page displays an "Shop on eBay" button that links to eBay search results for vintage items from that brand, with affiliate tracking parameters.

## Prerequisites

- eBay Partner Network account
- Campaign ID from your eBay Partner Network dashboard
- Access to the eBay Link Generator tool

## Step 1: Generate eBay Search Links

Run the link generation script to create a text file with eBay search URLs for all brands:

```bash
npx tsx scripts/generate-ebay-links.ts
```

This creates `ebay-brand-links.txt` in the project root containing one URL per line:

```
https://www.ebay.com/sch/i.html?_nkw=Levi's%20vintage&_sacat=11450
https://www.ebay.com/sch/i.html?_nkw=Champion%20vintage&_sacat=11450
...
```

Each URL:
- Searches for "[brand name] vintage"
- Uses category 11450 (Clothing, Shoes & Accessories)

## Step 2: Convert Links to Affiliate Links (eBay Link Generator)

Use eBay's bulk link conversion feature to add your affiliate tracking:

1. Go to the [eBay Partner Network Link Generator](https://partner.ebay.com/tools/link-generator)

2. Select **"Bulk Link Upload"** tab

3. Click **"Upload File"** and select `ebay-brand-links.txt`

4. Configure your campaign:
   - **Campaign**: Select your campaign (e.g., "Baseline")
   - **Custom ID**: Optional tracking parameter

5. Click **"Generate Links"**

6. Download the CSV file with converted affiliate links

Reference: [eBay Link Generator Quick Start Guide](https://partnerhelp.ebay.com/helpcenter/s/article/Link-Generator-Quick-Start-Guide?language=en_US)

## Step 3: Import Affiliate Links to Database

Run the import script with the downloaded CSV:

```bash
# Dry run (preview changes)
npx tsx scripts/import-ebay-affiliate-links.ts "/path/to/downloaded.csv"

# Apply changes to database
npx tsx scripts/import-ebay-affiliate-links.ts "/path/to/downloaded.csv" --apply
```

The script:
- Parses the CSV (columns: Original URL, New URL, Error)
- Extracts brand name from each search URL
- Matches brands in the database (case-insensitive)
- Updates the `ebay_url` field with the affiliate link

## Affiliate Link Format

The converted URLs include these eBay Partner Network parameters:

| Parameter | Description |
|-----------|-------------|
| `mkcid=1` | Marketing channel ID (affiliate) |
| `mkrid=711-53200-19255-0` | Publisher ID |
| `toolid=20023` | Link Generator tool ID |
| `campid=XXXXXXX` | Your campaign ID |
| `customid=XXX` | Custom tracking ID |
| `siteid=0` | eBay US site |
| `mkevt=1` | Marketing event tracking |

Example affiliate URL:
```
https://www.ebay.com/sch/i.html?_nkw=Carhartt%20vintage&_sacat=11450&mkcid=1&mkrid=711-53200-19255-0&toolid=20023&campid=5339135007&customid=Baseline&siteid=0&mkevt=1
```

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `scripts/generate-ebay-links.ts` | Generate eBay search URLs for all brands |
| `scripts/import-ebay-affiliate-links.ts` | Import affiliate links from eBay CSV |

## Updating Links

To update affiliate links (e.g., new campaign):

1. Regenerate `ebay-brand-links.txt` if brands have changed
2. Upload to eBay Link Generator with new campaign settings
3. Download new CSV
4. Run import script with `--apply`

## Troubleshooting

### Brand not found in database
The import script matches brand names case-insensitively. If a brand isn't found:
- Check the brand name in the CSV matches the database
- Ensure the brand exists in the `brands` table

### Missing affiliate parameters
If links aren't converting:
- Verify your eBay Partner Network account is active
- Check campaign is properly configured in eBay dashboard
