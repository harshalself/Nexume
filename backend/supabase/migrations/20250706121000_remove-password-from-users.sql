-- Migration: Remove password column from users table

alter table users
drop column if exists password; 