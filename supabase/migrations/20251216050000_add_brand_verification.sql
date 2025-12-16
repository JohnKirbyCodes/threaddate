-- Add verification fields to brands table
alter table brands
  add column verified boolean default false,
  add column verification_status text default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  add column created_by uuid references profiles(id),
  add column verified_by uuid references profiles(id),
  add column verified_at timestamptz;

-- Index for filtering verified brands
create index idx_brands_verification_status on brands(verification_status);
create index idx_brands_verified on brands(verified);

-- Update existing brands to be verified (seeded by admins)
update brands set
  verified = true,
  verification_status = 'verified';

-- Add comment
comment on column brands.verification_status is 'Status of brand verification: pending (user submitted), verified (admin approved), rejected';

-- Drop old admin-only policy
drop policy if exists "Only admins can insert brands" on brands;

-- New policy: Authenticated users can create brands (unverified)
create policy "Authenticated users can create brands"
  on brands for insert
  with check (
    auth.uid() is not null
  );

-- Auto-set created_by on insert
create or replace function set_brand_creator()
returns trigger as $$
begin
  new.created_by = auth.uid();
  -- User-created brands start as unverified
  if new.verified is null then
    new.verified = false;
  end if;
  if new.verification_status is null then
    new.verification_status = 'pending';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger set_brand_creator_trigger
  before insert on brands
  for each row
  execute function set_brand_creator();

-- Only admins can update verification status
create policy "Only admins can verify brands"
  on brands for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Public read access (all brands visible)
create policy "Brands are publicly readable"
  on brands for select
  using (true);
