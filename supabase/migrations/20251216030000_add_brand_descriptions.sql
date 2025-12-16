-- Add description field to brands table
alter table brands add column description text;

-- Add sub-brand support
alter table brands add column parent_brand_id bigint references brands(id);

-- Add index for sub-brand queries
create index idx_brands_parent on brands(parent_brand_id);

-- Update tags to show on brand pages chronologically
-- Tags already have year_start and year_end, we'll use those for ordering
