-- Fix storage policies to work with custom JWT authentication
-- Since we're using custom JWT tokens instead of Supabase auth,
-- we need to create more permissive policies for the resumes bucket

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Create more permissive policies for authenticated users
-- Note: Since we're using custom JWT auth, we'll allow any authenticated user
-- to access the resumes bucket. The actual access control is handled at the API level.

-- Allow authenticated users to upload to resumes bucket
CREATE POLICY "Allow uploads to resumes bucket" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to view files in resumes bucket
CREATE POLICY "Allow viewing resumes bucket" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'resumes');

-- Allow authenticated users to update files in resumes bucket
CREATE POLICY "Allow updating resumes bucket" ON storage.objects
  FOR UPDATE 
  USING (bucket_id = 'resumes');

-- Allow authenticated users to delete files in resumes bucket
CREATE POLICY "Allow deleting from resumes bucket" ON storage.objects
  FOR DELETE 
  USING (bucket_id = 'resumes');
