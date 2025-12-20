# Supabase Row Level Security (RLS) Verification Plan

This document outlines the RLS policies that should be configured in Supabase for ThreadDate security.

---

## Quick Reference: Access Control Matrix

| Table | Public Read | Auth Insert | Owner Update | Admin Update |
|-------|-------------|-------------|--------------|--------------|
| profiles | Yes | Own only | Own only | No |
| brands | Yes | Yes | No | Yes (verify) |
| tags | Yes | Yes | Own only | No |
| tag_evidence | Yes | Tag owner | Tag owner | No |
| votes | Yes | Yes | Own only | No |
| clothing_items | Yes | Yes | Own pending | Yes (verify) |

---

## Verification Checklist

### Step 1: Enable RLS on All Tables

In Supabase Dashboard > Database > Tables, verify RLS is **enabled** for:

- [ ] `profiles`
- [ ] `brands`
- [ ] `tags`
- [ ] `tag_evidence`
- [ ] `votes`
- [ ] `clothing_items`

**How to check:** Each table should show "RLS enabled" badge. If not, click the table → "Enable RLS" button.

---

### Step 2: Verify Policies Exist

For each table, go to **Authentication > Policies** and verify these policies exist:

---

## 1. PROFILES Table

**Purpose:** User account data extending Supabase auth

### Required Policies:

```sql
-- 1. Public read access (for leaderboard, tag submitter info)
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 2. Users can only insert their own profile (handled by trigger, but backup policy)
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 3. Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

### Verification Test:
```sql
-- Should return profiles (as anon)
SELECT username, reputation_score FROM profiles LIMIT 5;

-- Should fail (as anon)
UPDATE profiles SET username = 'hacked' WHERE id = 'some-uuid';
```

---

## 2. BRANDS Table

**Purpose:** Vintage brand catalog with affiliate links

### Required Policies:

```sql
-- 1. Public read access
CREATE POLICY "Brands are publicly readable"
ON brands FOR SELECT
USING (true);

-- 2. Authenticated users can create (unverified) brands
CREATE POLICY "Authenticated users can create brands"
ON brands FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Only admins can update/verify brands
CREATE POLICY "Admins can update brands"
ON brands FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

### Verification Test:
```sql
-- Should work (as anon)
SELECT name, slug FROM brands LIMIT 5;

-- Should fail (as regular authenticated user)
UPDATE brands SET verified = true WHERE slug = 'nike';
```

---

## 3. TAGS Table

**Purpose:** Core entity - clothing identifiers submitted by users

### Required Policies:

```sql
-- 1. Public read access
CREATE POLICY "Tags are viewable by everyone"
ON tags FOR SELECT
USING (true);

-- 2. Authenticated users can insert tags (with their user_id)
CREATE POLICY "Authenticated users can insert tags"
ON tags FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can only update their own tags
CREATE POLICY "Users can update own tags"
ON tags FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Users can only delete their own pending tags
CREATE POLICY "Users can delete own pending tags"
ON tags FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');
```

### Verification Test:
```sql
-- Should work (as anon)
SELECT id, category, era FROM tags LIMIT 5;

-- Should fail (as user trying to update someone else's tag)
UPDATE tags SET era = '1990s' WHERE user_id != auth.uid();
```

---

## 4. TAG_EVIDENCE Table

**Purpose:** Supporting documentation for tag submissions

### Required Policies:

```sql
-- 1. Public read access
CREATE POLICY "Tag evidence is viewable by everyone"
ON tag_evidence FOR SELECT
USING (true);

-- 2. Only tag owner can insert evidence
CREATE POLICY "Tag owners can insert evidence"
ON tag_evidence FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM tags
    WHERE tags.id = tag_id
    AND tags.user_id = auth.uid()
  )
);

-- 3. Only tag owner can update evidence
CREATE POLICY "Tag owners can update evidence"
ON tag_evidence FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM tags
    WHERE tags.id = tag_id
    AND tags.user_id = auth.uid()
  )
);

-- 4. Only tag owner can delete evidence
CREATE POLICY "Tag owners can delete evidence"
ON tag_evidence FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM tags
    WHERE tags.id = tag_id
    AND tags.user_id = auth.uid()
  )
);
```

---

## 5. VOTES Table

**Purpose:** Community verification votes on tags

### Required Policies:

```sql
-- 1. Public read access (for displaying vote counts)
CREATE POLICY "Votes are viewable by everyone"
ON votes FOR SELECT
USING (true);

-- 2. Authenticated users can vote (with their user_id)
CREATE POLICY "Authenticated users can vote"
ON votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own votes
CREATE POLICY "Users can update own votes"
ON votes FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Users can delete their own votes
CREATE POLICY "Users can delete own votes"
ON votes FOR DELETE
USING (auth.uid() = user_id);
```

### Additional Constraint:
Ensure unique constraint exists: `UNIQUE(user_id, tag_id)` - prevents duplicate votes.

---

## 6. CLOTHING_ITEMS Table

**Purpose:** Specific vintage clothing articles

### Required Policies:

```sql
-- 1. Public read access
CREATE POLICY "Clothing items are viewable by everyone"
ON clothing_items FOR SELECT
USING (true);

-- 2. Authenticated users can create items
CREATE POLICY "Authenticated users can create clothing items"
ON clothing_items FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- 3. Users can update their own pending items
CREATE POLICY "Users can update own pending items"
ON clothing_items FOR UPDATE
USING (
  auth.uid() = created_by
  AND status = 'pending'
);

-- 4. Admins can update any item (for verification)
CREATE POLICY "Admins can update any clothing item"
ON clothing_items FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'moderator')
  )
);
```

---

## 7. Storage Bucket: tag-images

### Required Policies:

```sql
-- 1. Public read access for all images
CREATE POLICY "Public read access for tag images"
ON storage.objects FOR SELECT
USING (bucket_id = 'tag-images');

-- 2. Authenticated users can upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'tag-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Users can update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'tag-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'tag-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Verification Steps in Supabase Dashboard

### A. Check RLS Status

1. Go to **Database > Tables**
2. For each table, verify the "RLS" badge shows "Enabled"
3. If disabled, click table → "Enable RLS"

### B. Review Existing Policies

1. Go to **Authentication > Policies**
2. Select each table from dropdown
3. Compare existing policies against this document
4. Add missing policies

### C. Test with SQL Editor

Run these tests in **SQL Editor**:

```sql
-- Test 1: Verify public read works
SET ROLE anon;
SELECT COUNT(*) FROM brands; -- Should work
SELECT COUNT(*) FROM tags;   -- Should work

-- Test 2: Verify anon can't write
SET ROLE anon;
INSERT INTO brands (name, slug) VALUES ('Test', 'test'); -- Should FAIL

-- Test 3: Verify auth user can insert
SET ROLE authenticated;
-- (Need to set auth.uid() context for proper testing)

-- Test 4: Verify cross-user update fails
-- (Requires two test users)
```

### D. Test via Application

1. Open browser DevTools Network tab
2. Perform these actions:
   - View brands page (should work)
   - Try to vote without logging in (should fail)
   - Submit a tag while logged in (should work)
   - Try to update someone else's tag via API (should fail)

---

## Common Issues & Fixes

### Issue: "new row violates row-level security policy"

**Cause:** INSERT policy missing or incorrect `WITH CHECK` clause.

**Fix:** Ensure INSERT policy uses `WITH CHECK (auth.uid() = user_id)` or similar.

### Issue: Users can see all data but can't insert

**Cause:** SELECT policy exists but INSERT policy missing.

**Fix:** Add INSERT policy with appropriate `WITH CHECK`.

### Issue: Authenticated requests failing

**Cause:** `auth.uid()` returning NULL.

**Fix:** Verify JWT is being passed correctly. Check Supabase client configuration.

### Issue: Admin operations failing

**Cause:** `profiles.role` not being checked correctly.

**Fix:** Ensure admin user has `role = 'admin'` in profiles table.

---

## Migration SQL (If Policies Don't Exist)

Create a migration file if policies need to be added:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tag_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

-- Then add all policies listed above...
```

---

## Security Audit Checklist

After implementing RLS, verify:

- [ ] Anonymous users can read public data
- [ ] Anonymous users cannot write to any table
- [ ] Authenticated users can only insert with their own user_id
- [ ] Users cannot update/delete other users' data
- [ ] Admins can verify brands and clothing items
- [ ] Vote uniqueness is enforced (one vote per user per tag)
- [ ] Storage bucket enforces user-folder isolation
- [ ] No sensitive data exposed (password hashes, etc.)

---

## Related Files

- Database queries: `lib/queries/*.ts`
- Server actions: `lib/actions/*.ts`
- Supabase client: `lib/supabase/server.ts`, `lib/supabase/client.ts`
- Migrations: `supabase/migrations/*.sql`
