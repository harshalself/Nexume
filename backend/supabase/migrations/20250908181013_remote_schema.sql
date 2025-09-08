

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_delete_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  update public.users
  set is_deleted = true
  where id = old.id;
  return old;
end;
$$;


ALTER FUNCTION "public"."handle_delete_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email, first_name, last_name, profile_pic)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_update_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  update public.users
  set
    email = new.email,
    first_name = new.raw_user_meta_data->>'first_name',
    last_name = new.raw_user_meta_data->>'last_name'
  where id = new.id;
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_update_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."email" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "resume_id" "uuid",
    "job_id" "uuid",
    "email_sent" boolean DEFAULT false,
    "sent_at" timestamp without time zone,
    "status" "text",
    "email_address" "text"
);


ALTER TABLE "public"."email" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_descriptions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'active'::"text",
    "is_deleted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "job_descriptions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text"])))
);


ALTER TABLE "public"."job_descriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."matches" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "resume_id" "uuid" NOT NULL,
    "job_id" "uuid" NOT NULL,
    "match_score" numeric,
    "match_details" "jsonb",
    "matched_on" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."resumes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text",
    "email" "text",
    "file_url" "text",
    "parsed_data" "text",
    "is_deleted" boolean DEFAULT false,
    "uploaded_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid"
);


ALTER TABLE "public"."resumes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" "text" NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "profile_pic" "text",
    "is_deleted" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "llm_api_key_encrypted" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."email"
    ADD CONSTRAINT "email_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_descriptions"
    ADD CONSTRAINT "job_descriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."resumes"
    ADD CONSTRAINT "resumes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_resumes_user_deleted" ON "public"."resumes" USING "btree" ("user_id", "is_deleted");



CREATE INDEX "idx_resumes_user_id" ON "public"."resumes" USING "btree" ("user_id");



ALTER TABLE ONLY "public"."email"
    ADD CONSTRAINT "email_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."job_descriptions"("id");



ALTER TABLE ONLY "public"."email"
    ADD CONSTRAINT "email_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id");



ALTER TABLE ONLY "public"."resumes"
    ADD CONSTRAINT "fk_resumes_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."job_descriptions"
    ADD CONSTRAINT "job_descriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."job_descriptions"("id");



ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id");



CREATE POLICY "Email: all authenticated users can access" ON "public"."email" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Job Descriptions: owner can access own" ON "public"."job_descriptions" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Matches: all authenticated users can access" ON "public"."matches" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Resumes: all authenticated users can access" ON "public"."resumes" USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Users: owner can access own row" ON "public"."users" USING (("id" = "auth"."uid"()));



ALTER TABLE "public"."email" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_descriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."resumes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_update_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_update_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_update_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."email" TO "anon";
GRANT ALL ON TABLE "public"."email" TO "authenticated";
GRANT ALL ON TABLE "public"."email" TO "service_role";



GRANT ALL ON TABLE "public"."job_descriptions" TO "anon";
GRANT ALL ON TABLE "public"."job_descriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."job_descriptions" TO "service_role";



GRANT ALL ON TABLE "public"."matches" TO "anon";
GRANT ALL ON TABLE "public"."matches" TO "authenticated";
GRANT ALL ON TABLE "public"."matches" TO "service_role";



GRANT ALL ON TABLE "public"."resumes" TO "anon";
GRANT ALL ON TABLE "public"."resumes" TO "authenticated";
GRANT ALL ON TABLE "public"."resumes" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
