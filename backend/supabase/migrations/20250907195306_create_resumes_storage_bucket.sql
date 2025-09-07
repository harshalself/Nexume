-- Create storage bucket for resumes (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false,
  5242880, -- 5MB in bytes
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Create policy for users to upload their own resumes
CREATE POLICY "Users can upload their own resumes" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to view their own resumes
CREATE POLICY "Users can view their own resumes" ON storage.objects
  FOR SELECT 
  USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to update their own resumes
CREATE POLICY "Users can update their own resumes" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create policy for users to delete their own resumes
CREATE POLICY "Users can delete their own resumes" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'resumes' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
