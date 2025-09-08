# 📊 Nexume Backend Database Schema

This document describes the current database schema based on Supabase migrations and reflects the actual structure used by the application.

## 📋 Schema Overview

The Nexume backend uses PostgreSQL via Supabase with the following core tables:

## 🗃️ Tables

### 1. **users** table

Stores user authentication and profile information.

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  profile_pic text,
  is_deleted boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  llm_api_key_encrypted text,
  llm_api_key_iv text
);
```

**Key Features:**

- Integrates with Supabase Auth (`auth.users`)
- Soft delete pattern with `is_deleted`
- Encrypted LLM API key storage
- No password field (uses Supabase Auth)

### 2. **job_descriptions** table

Stores job postings and descriptions.

```sql
CREATE TABLE job_descriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  description text,
  company text,  -- Optional company name
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

**Key Features:**

- Links to user who created the job
- Optional company field for enhanced matching
- Status enum: 'active' or 'inactive'
- Soft delete pattern
- Timezone-aware timestamps

### 3. **resumes** table

Stores resume files and processed data.

```sql
CREATE TABLE resumes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  name text,
  email text,
  file_url text,
  parsed_data text, -- JSONB containing processed resume data
  is_deleted boolean DEFAULT false,
  uploaded_at timestamptz DEFAULT now()
);
```

**Key Features:**

- References `auth.users` (Supabase Auth)
- Stores file URL for Supabase Storage
- `parsed_data` contains JSON with:
  ```json
  {
    "text": "full extracted text",
    "wordCount": 245,
    "sections": {
      "contact": "...",
      "summary": "...",
      "experience": "...",
      "education": "...",
      "skills": "..."
    },
    "keywords": ["javascript", "react", "node.js", ...]
  }
  ```

### 4. **matches** table

Stores resume-job matching results.

```sql
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id uuid NOT NULL REFERENCES resumes(id),
  job_id uuid NOT NULL REFERENCES job_descriptions(id),
  match_score decimal,
  match_details jsonb,
  matched_on timestamp DEFAULT now()
);
```

**Key Features:**

- Links resumes to job descriptions
- Stores numeric match score
- `match_details` contains analysis JSON
- Tracks when match was calculated

### 5. **email** table

Tracks email communications for candidates.

```sql
CREATE TABLE email (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id uuid REFERENCES resumes(id),
  job_id uuid REFERENCES job_descriptions(id),
  email_sent boolean DEFAULT false,
  sent_at timestamp,
  status text,
  email_address text
);
```

**Key Features:**

- Links to specific resume-job combinations
- Tracks email status and delivery
- Stores recipient email address

## 🔒 Storage

### **resumes** bucket

Supabase Storage bucket for resume files.

**Configuration:**

- Bucket ID: `resumes`
- File size limit: 5MB
- Allowed MIME types:
  - `application/pdf`
  - `application/msword`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Public: `false`

**Access Policies:**

- Users can upload, view, update, and delete files
- Access controlled at API level (custom JWT auth)

## 🔐 Security Features

### Row Level Security (RLS)

- Enabled on all tables
- User-based access control
- Soft delete pattern across all entities

### Authentication Integration

- Custom JWT tokens for API authentication
- Supabase Auth for user management
- Encrypted sensitive data storage

## 📈 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_user_deleted ON resumes(user_id, is_deleted);
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_matches_resume_job ON matches(resume_id, job_id);
```

## 🔄 Migration History

1. **20250706110448_init-schema.sql** - Initial table creation
2. **20250706110449_rls.sql** - Row Level Security setup
3. **20250706120000_add-llm-api-key-to-users.sql** - LLM API key fields
4. **20250706121000_remove-password-from-users.sql** - Remove password column
5. **20250706121500_sync-auth-users-to-users.sql** - Auth synchronization
6. **20250706122000_sync-auth-user-update-delete.sql** - Auth triggers
7. **20250707_remove-user-id-from-resumes.sql** - Temporary user_id removal
8. **20250907195306_create_resumes_storage_bucket.sql** - Storage bucket setup
9. **20250907195923_fix_storage_policies.sql** - Storage policy updates
10. **20250908_add-user-id-back-to-resumes.sql** - Restore user_id with constraints
11. **20250908_add-company-to-job-descriptions.sql** - Add company field to job_descriptions

## 📋 Current Status

✅ **Fully Implemented:**

- User authentication and management
- Job description CRUD operations
- Resume upload and storage
- Text processing and analysis
- Basic matching algorithms

⏳ **In Development:**

- Enhanced AI matching
- Email automation
- Advanced analytics

❌ **Not Yet Implemented:**

- Candidate management UI
- Advanced reporting
- Bulk operations
