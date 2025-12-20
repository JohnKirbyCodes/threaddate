-- Add position fields to tags table for click-to-place identifier locations
-- Stores x/y as percentages (0.0 to 1.0) relative to clothing item image

ALTER TABLE tags
ADD COLUMN IF NOT EXISTS position_x decimal,
ADD COLUMN IF NOT EXISTS position_y decimal;

-- Add comment for documentation
COMMENT ON COLUMN tags.position_x IS 'X position as percentage (0.0-1.0) on clothing item image';
COMMENT ON COLUMN tags.position_y IS 'Y position as percentage (0.0-1.0) on clothing item image';
