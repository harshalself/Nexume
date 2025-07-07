# Supabase CLI Workflow for Local and Remote Development

This guide outlines a complete development workflow using the Supabase CLI, including local setup, migrations, syncing, and deployment.

---

## 🧰 1. Install Supabase CLI (locally in project)

```bash
npm install --save-dev supabase
```

---

## 🚀 2. Initialize Supabase Project

```bash
supabase init
```

> Creates the `supabase/` directory with configuration files.

---

## ▶️ 3. Start Local Supabase Services

```bash
supabase start
```

> Starts local containers for database, auth, storage, and studio using Docker.

---

## 🔐 4. Login to Supabase Account

```bash
supabase login
```

> Authenticates your CLI with your Supabase account.

---

## 🔗 5. Link Local Project with Remote Supabase Project

```bash
supabase link --project-ref <your-project-ref>
```

> Connects the local project with your remote Supabase instance.

---

## 🔄 6. Sync Remote Schema to Local

```bash
supabase db pull
# or selectively:
supabase db pull --schema auth,storage
```

> Pulls the schema from the remote project to your local setup.

---

## 🛜 7. Connect to Remote Database (Optional)

```bash
supabase db remote connect
```

> Opens a direct connection to your remote database.

---

## 📦 8. Apply Migrations to Local DB

```bash
supabase migration up
```

> Applies all migration files to your local database.

---

## 🧹 9. Reset Local DB (Drop & Reapply Migrations + Seed)

```bash
supabase db reset
```

> Useful when developing locally to reset DB to a clean state.

---

## ✍️ 10. Create a New Migration

```bash
supabase migration new <migration-name>
```

> Generates a new SQL file under `supabase/migrations/`.

---

## 🔎 11. Generate Migration by Schema Diff

```bash
supabase db diff --schema public
```

> Automatically generate a migration file by comparing local DB schema changes.

---

## ⬆️ 12. Push Migrations to Remote Supabase Project

```bash
supabase db push
```

> Applies all local migrations to the linked remote project.

---

## 🛑 13. Stop Local Supabase Stack

```bash
supabase stop
```

> Stops local Docker containers and services.

---

## ✅ Tips

- Keep your `.env` clean and secure.
- Use version control to track `supabase/migrations`.
- Use `supabase gen types` to sync DB types with your code.
