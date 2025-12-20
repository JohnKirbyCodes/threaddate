-- Add amazon_url column to brands table for Amazon affiliate links
ALTER TABLE brands ADD COLUMN IF NOT EXISTS amazon_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN brands.amazon_url IS 'Amazon affiliate search URL for this brand';
