-- users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  first_name text not null,
  last_name text not null,
  profile_pic text,
  is_deleted boolean default false,
  created_at timestamp default now()
);

-- job_descriptions table
create table if not exists job_descriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id),
  title text not null,
  description text,
  status text default 'active' check (status in ('active', 'inactive')),
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- resumes table
create table if not exists resumes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id),
  name text,
  email text,
  file_url text,
  parsed_data text,
  is_deleted boolean default false,
  uploaded_at timestamptz default now()
);

-- matches table
create table if not exists matches (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid not null references resumes(id),
  job_id uuid not null references job_descriptions(id),
  match_score decimal,
  match_details jsonb,
  matched_on timestamp default now()
);

-- email table
create table if not exists email (
  id uuid primary key default uuid_generate_v4(),
  resume_id uuid references resumes(id),
  job_id uuid references job_descriptions(id),
  email_sent boolean default false,
  sent_at timestamp,
  status text,
  email_address text
);