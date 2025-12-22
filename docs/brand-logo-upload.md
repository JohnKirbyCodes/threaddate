# Brand Logo Upload Process

This document describes how to upload brand logos to ThreadDate.

## Overview

Brand logos are stored in Supabase Storage (`tag-images` bucket) under the `brand-logos/` folder. The upload script matches logo files to existing brands in the database and updates their `logo_url` field.

## File Naming Convention

Logo files must follow this format:
```
Brand_Name_Logo_ThreadDate.{ext}
```

**Examples:**
- `Nike_Logo_ThreadDate.png`
- `Levi's_Logo_ThreadDate.jpg`
- `Ralph_Lauren_Logo_ThreadDate.png`
- `LL_Bean_Logo_ThreadDate.jpg`
- `Ocean_Pacific_(OP)_Logo_ThreadDate.png`

**Rules:**
- Replace spaces with underscores (`_`)
- Use the exact brand name as it appears in the database
- Apostrophes and special characters are preserved (`Levi's`, `O'Neill`)
- Parenthetical suffixes are supported (`Ocean Pacific (OP)`)
- Supported formats: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.avif`
- **SVG files are NOT supported** by Supabase - convert to PNG first

## Upload Script

### Location
```
scripts/upload-local-logos.ts
```

### Usage

**Dry run (preview what will be uploaded):**
```bash
npx tsx scripts/upload-local-logos.ts /path/to/logos/folder
```

**Actually upload:**
```bash
npx tsx scripts/upload-local-logos.ts /path/to/logos/folder --apply
```

### Important: Production vs Local

The script uses environment variables to determine which Supabase instance to use:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**To upload to PRODUCTION**, explicitly set production credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://mpgouvekgyzsrktuvwor.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="your-production-service-role-key" \
npx tsx scripts/upload-local-logos.ts /path/to/logos --apply
```

Or source the production env file:
```bash
source .env.production && npx tsx scripts/upload-local-logos.ts /path/to/logos --apply
```

## Handling Common Issues

### Brand Not Found
If the script reports "Brand not found", the brand name in the filename doesn't match the database. Check:
1. Exact spelling (case-insensitive matching is used)
2. Special characters (`&` vs `and`, `'` vs `'`)
3. Brand may need to be added to the database first

**Common name mismatches:**
| File Name | Database Name |
|-----------|---------------|
| `Luck_Brand` | `Lucky Brand` |
| `Mountain_Hardware` | `Mountain Hardwear` |
| `Quicksilver` | `Quiksilver` |
| `Red_Wing_Shoes` | `Red Wing` |
| `M_&_O_Knits` | `M&O` |

### SVG Files Not Supported
Supabase Storage doesn't allow SVG uploads. Convert to PNG first:

**Using macOS qlmanage:**
```bash
qlmanage -t -s 512 -o . logo.svg
mv logo.svg.png logo.png
```

**Using ImageMagick:**
```bash
convert logo.svg logo.png
```

### Invalid Filename Format
Files must end with `_Logo_ThreadDate.{ext}`. Check for:
- Trailing underscores (`Mickey_&_Co_Logo_ThreadDate_.jpg` - wrong)
- Missing suffix
- Extra characters

## Adding New Brands

If a brand doesn't exist in the database, add it first:

```typescript
// Using Supabase dashboard or script
await supabase.from('brands').insert({
  name: 'Brand Name',
  slug: 'brand-name',
  founded_year: 1990,      // optional
  country_code: 'US'       // optional, ISO 2-letter code
});
```

Then run the upload script.

## Storage Structure

Logos are stored at:
```
tag-images/brand-logos/{slug}.{ext}
```

Example URLs:
- `https://mpgouvekgyzsrktuvwor.supabase.co/storage/v1/object/public/tag-images/brand-logos/nike.png`
- `https://mpgouvekgyzsrktuvwor.supabase.co/storage/v1/object/public/tag-images/brand-logos/patagonia.jpg`

## Batch Upload Workflow

1. **Prepare logos** in a folder with correct naming
2. **Dry run** to check matches:
   ```bash
   npx tsx scripts/upload-local-logos.ts ~/Desktop/logos
   ```
3. **Review output** - fix any filename issues
4. **Convert SVGs** to PNG if needed
5. **Add missing brands** to database
6. **Upload to production**:
   ```bash
   source .env.production && npx tsx scripts/upload-local-logos.ts ~/Desktop/logos --apply
   ```
7. **Verify** by checking a brand page on the live site

## Troubleshooting

### Logos showing localhost URLs
The script uploaded to local Supabase instead of production. Re-run with production credentials.

### Logo not updating on site
- Check browser cache (hard refresh: Cmd+Shift+R)
- Verify logo_url in database points to production Supabase
- Check Supabase Storage to confirm file exists

### Permission denied on upload
Ensure you're using the `SUPABASE_SERVICE_ROLE_KEY` (not the anon key).
