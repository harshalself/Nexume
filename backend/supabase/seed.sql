-- USERS
-- insert into users (id, email, password, first_name, last_name, profile_pic, is_deleted, created_at) values
--   ('11111111-1111-1111-1111-111111111111', 'admin@nexume.com', 'hashedpassword', 'Admin', 'User', null, false, now()),
--   ('22222222-2222-2222-2222-222222222222', 'jane.doe@example.com', 'hashedpassword2', 'Jane', 'Doe', null, false, now());

-- JOB_DESCRIPTIONS
-- insert into job_descriptions (id, user_id, title, description, status, is_deleted, created_at) values
--   ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'Frontend Developer', 'Develop and maintain web applications.', 'active', false, now()),
--   ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'Backend Developer', 'Build scalable backend services.', 'inactive', false, now());

-- RESUMES
-- insert into resumes (id, user_id, name, email, file_url, parsed_data, is_deleted, uploaded_at) values
--   ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222222', 'Jane Doe', 'jane.doe@example.com', 'https://example.com/resume/jane.pdf', '{"skills": ["JavaScript", "React"]}', false, now()),
--   ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@nexume.com', 'https://example.com/resume/admin.pdf', '{"skills": ["Node.js", "PostgreSQL"]}', false, now());

-- MATCHES
-- insert into matches (id, resume_id, job_id, match_score, match_details, matched_on) values
--   ('ccccccc1-cccc-cccc-cccc-ccccccccccc1', 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 87.65, '{"skills": ["JavaScript"]}', now()),
--   ('ccccccc2-cccc-cccc-cccc-ccccccccccc2', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 92.10, '{"skills": ["Node.js"]}', now());

-- EMAIL
-- insert into email (id, resume_id, job_id, email_sent, sent_at, status, email_address) values
--   ('ddddddd1-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', true, now(), 'sent', 'jane.doe@example.com'),
--   ('ddddddd2-dddd-dddd-dddd-ddddddddddd2', 'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', false, null, 'pending', 'admin@nexume.com');

-- Add more seed data as needed