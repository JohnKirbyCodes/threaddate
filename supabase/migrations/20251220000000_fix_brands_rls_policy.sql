-- Fix brands RLS policy to allow authenticated users to create brands
-- Previously only admins could insert, but the app allows any authenticated user
-- to create brands (which start as unverified)

-- Drop the restrictive admin-only policy
DROP POLICY IF EXISTS "Only admins can insert brands" ON brands;

-- Create new policy allowing any authenticated user to insert brands
DROP POLICY IF EXISTS "Authenticated users can create brands" ON brands;
CREATE POLICY "Authenticated users can create brands"
  ON brands FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Note: Brands created by users will have:
-- - verified = false (default)
-- - verification_status = 'pending' (default)
-- Only admins can update brands to set verified = true
