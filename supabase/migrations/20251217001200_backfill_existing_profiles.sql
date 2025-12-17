-- Backfill profiles for existing users who don't have one
insert into public.profiles (id, username, avatar_url, reputation_score, role, created_at)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', u.email) as username,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  0 as reputation_score,
  'user' as role,
  u.created_at
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
