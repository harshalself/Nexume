-- Migration: Add encrypted LLM API key columns to users table

alter table users
add column llm_api_key_encrypted text;

-- Optional: Initialization vector for encryption (if needed)
alter table users
add column llm_api_key_iv text; 