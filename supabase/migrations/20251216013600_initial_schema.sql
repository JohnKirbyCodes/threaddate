-- Enable required extensions
create extension if not exists pg_trgm;

-- 1. ENUMS
-- Expanded Era Definitions for granular vintage dating (Updated range 1900-2020s)
create type era_enum as enum (
  'Pre-1900s',
  '1900s',
  '1910s',
  '1920s',
  '1930s',
  '1940s',
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  '2000s (Y2K)',
  '2010s',
  '2020s',
  'Modern'
);

create type stitch_enum as enum ('Single', 'Double', 'Chain', 'Other');
create type status_enum as enum ('pending', 'verified', 'rejected');

-- New: Identifier Categories to support non-tag dating methods
create type identifier_category_enum as enum (
  'Neck Tag',
  'Care Tag',
  'Button/Snap',
  'Zipper',
  'Tab',
  'Stitching',
  'Print/Graphic',
  'Hardware',
  'Other'
);

-- 2. PROFILES (Extends Auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  reputation_score int default 0,
  role text default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz default now()
);

-- 3. BRANDS
create table brands (
  id bigint generated always as identity primary key,
  name text not null,
  slug text unique not null,
  logo_url text,
  founded_year int,
  created_at timestamptz default now()
);

-- 4. TAGS (Core Entity - Now represents any Identifier)
create table tags (
  id bigint generated always as identity primary key,
  brand_id bigint references brands(id) not null,
  user_id uuid references profiles(id) not null,
  image_url text not null,
  category identifier_category_enum not null default 'Neck Tag',
  year_start int,
  year_end int,
  era era_enum not null,
  origin_country text,
  stitch_type stitch_enum,
  status status_enum default 'pending',
  verification_score int default 0,
  submission_notes text,
  created_at timestamptz default now()
);

-- 5. TAG EVIDENCE (Supporting Data)
create table tag_evidence (
  id bigint generated always as identity primary key,
  tag_id bigint references tags(id) on delete cascade not null,
  image_url text not null,
  description text,
  evidence_type text check (evidence_type in ('copyright', 'care_tag', 'catalog')),
  created_at timestamptz default now()
);

-- 6. VOTES
create table votes (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) not null,
  tag_id bigint references tags(id) not null,
  vote_value int check (vote_value in (-1, 1)),
  created_at timestamptz default now(),
  unique(user_id, tag_id)
);

-- 7. PERFORMANCE INDEXES
create index idx_tags_brand on tags(brand_id);
create index idx_tags_era on tags(era);
create index idx_tags_category on tags(category);
create index idx_tags_status on tags(status);
create index idx_brands_name on brands using gin(name gin_trgm_ops);

-- 8. AUTOMATION: Score Update Trigger
create or replace function update_tag_score()
returns trigger as $$
begin
  update tags
  set verification_score = (
    select coalesce(sum(vote_value), 0) from votes where tag_id = new.tag_id
  )
  where id = new.tag_id;
  return new;
end;
$$ language plpgsql;

create trigger on_vote_added
after insert or update on votes
for each row execute procedure update_tag_score();

-- 9. ROW LEVEL SECURITY POLICIES

-- Enable RLS
alter table profiles enable row level security;
alter table brands enable row level security;
alter table tags enable row level security;
alter table tag_evidence enable row level security;
alter table votes enable row level security;

-- Profiles: Public read, owner update
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Brands: Public read, admin write
create policy "Brands are viewable by everyone"
  on brands for select
  using (true);

create policy "Only admins can insert brands"
  on brands for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Only admins can update brands"
  on brands for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Tags: Public read, authenticated insert
create policy "Tags are viewable by everyone"
  on tags for select
  using (true);

create policy "Authenticated users can insert tags"
  on tags for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tags"
  on tags for update
  using (auth.uid() = user_id);

-- Tag Evidence: Public read, tag owner write
create policy "Tag evidence is viewable by everyone"
  on tag_evidence for select
  using (true);

create policy "Tag owners can insert evidence"
  on tag_evidence for insert
  with check (
    exists (
      select 1 from tags
      where tags.id = tag_id
      and tags.user_id = auth.uid()
    )
  );

-- Votes: Public read, authenticated insert/update
create policy "Votes are viewable by everyone"
  on votes for select
  using (true);

create policy "Authenticated users can vote"
  on votes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own votes"
  on votes for update
  using (auth.uid() = user_id);
