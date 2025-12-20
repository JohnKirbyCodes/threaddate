-- Add origin_country field to clothing_items table
ALTER TABLE clothing_items
ADD COLUMN IF NOT EXISTS origin_country text;

COMMENT ON COLUMN clothing_items.origin_country IS 'Country where the clothing item was manufactured';
