-- Create clothing_type enum
create type clothing_type_enum as enum (
  'T-Shirt',
  'Sweatshirt',
  'Hoodie',
  'Jacket',
  'Coat',
  'Jeans',
  'Pants',
  'Shorts',
  'Dress',
  'Skirt',
  'Hat',
  'Shoes',
  'Boots',
  'Belt',
  'Bag',
  'Other'
);

-- Create clothing_items table
create table clothing_items (
  id bigint generated always as identity primary key,

  -- Core attributes
  name text not null,
  slug text unique not null,
  type clothing_type_enum not null,

  -- Optional descriptive fields
  description text,
  style_number text,
  color text,
  size text,

  -- Dating
  year_manufactured int,
  era era_enum,

  -- Image
  image_url text,

  -- Verification (community-curated)
  status status_enum default 'pending',
  verification_score int default 0,

  -- Provenance
  created_by uuid references profiles(id) not null,
  created_at timestamptz default now(),
  verified_by uuid references profiles(id),
  verified_at timestamptz,

  -- Notes
  submission_notes text
);

-- Add indexes
create index idx_clothing_items_type on clothing_items(type);
create index idx_clothing_items_status on clothing_items(status);
create index idx_clothing_items_era on clothing_items(era);
create index idx_clothing_items_created_by on clothing_items(created_by);
create index idx_clothing_items_name on clothing_items using gin(name gin_trgm_ops);
create index idx_clothing_items_slug on clothing_items(slug);

-- Add FK to tags table
alter table tags
  add column clothing_item_id bigint references clothing_items(id) on delete set null;

create index idx_tags_clothing_item on tags(clothing_item_id);

-- Enable RLS
alter table clothing_items enable row level security;

-- RLS Policies
create policy "Clothing items are viewable by everyone"
  on clothing_items for select
  using (true);

create policy "Authenticated users can create clothing items"
  on clothing_items for insert
  with check (auth.uid() = created_by);

create policy "Users can update own unverified clothing items"
  on clothing_items for update
  using (
    auth.uid() = created_by
    and status = 'pending'
  );

create policy "Admins can verify clothing items"
  on clothing_items for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'moderator')
    )
  );

-- Comments
comment on table clothing_items is 'Articles of vintage clothing that can have multiple identifiers';
comment on column clothing_items.slug is 'URL-safe unique identifier';
comment on column clothing_items.style_number is 'Manufacturer style/model number (e.g., "501", "Air Jordan 1")';
comment on column tags.clothing_item_id is 'Optional association with a specific article of clothing';
