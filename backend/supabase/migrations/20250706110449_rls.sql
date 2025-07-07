-- Enable RLS and add owner-only policies for all tables

-- USERS TABLE
alter table users enable row level security;
create policy "Users: owner can access own row" on users
  for all
  using (id = auth.uid());

-- JOB_DESCRIPTIONS TABLE
alter table job_descriptions enable row level security;
create policy "Job Descriptions: owner can access own" on job_descriptions
  for all
  using (user_id = auth.uid());

-- RESUMES TABLE
alter table resumes enable row level security;
create policy "Resumes: all authenticated users can access" on resumes
  for all
  using (auth.role() = 'authenticated');

-- MATCHES TABLE
alter table matches enable row level security;
create policy "Matches: all authenticated users can access" on matches
  for all
  using (auth.role() = 'authenticated');

-- EMAIL TABLE
alter table email enable row level security;
create policy "Email: all authenticated users can access" on email
  for all
  using (auth.role() = 'authenticated'); 