-- Migration: Add missing database fixes
-- This migration adds the fixes that were manually applied but not included in migrations

-- 1. Add company column to job_descriptions table
ALTER TABLE job_descriptions
ADD COLUMN IF NOT EXISTS company text;

-- 2. Add index for company field
CREATE INDEX IF NOT EXISTS idx_job_descriptions_company ON job_descriptions(company);

-- 3. Add llm_api_key_iv column to users table (for encryption)
ALTER TABLE users ADD COLUMN IF NOT EXISTS llm_api_key_iv text;

-- 4. Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_resume_job ON matches(resume_id, job_id);

-- 5. Ensure all required indexes exist (these should already exist but let's be safe)
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_deleted ON resumes(user_id, is_deleted);