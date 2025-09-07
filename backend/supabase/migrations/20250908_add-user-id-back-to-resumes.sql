-- Migration: Add user_id back to resumes table
-- This is needed for user-based access control

ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Add foreign key constraint
ALTER TABLE resumes
ADD CONSTRAINT fk_resumes_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_deleted ON resumes(user_id, is_deleted);
