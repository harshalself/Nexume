-- Migration: Sync updates and soft deletes from auth.users to public.users

-- 1. Add is_deleted column if not present
alter table public.users
  add column if not exists is_deleted boolean default false;

-- 2. Update trigger function
create or replace function public.handle_update_user()
returns trigger as $$
begin
  update public.users
  set
    email = new.email,
    first_name = new.raw_user_meta_data->>'first_name',
    last_name = new.raw_user_meta_data->>'last_name'
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_updated
after update on auth.users
for each row execute procedure public.handle_update_user();

-- 3. Delete (soft delete) trigger function
create or replace function public.handle_delete_user()
returns trigger as $$
begin
  update public.users
  set is_deleted = true
  where id = old.id;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_deleted
after delete on auth.users
for each row execute procedure public.handle_delete_user(); 