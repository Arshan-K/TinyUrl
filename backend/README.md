# Aganitha - URL shortener backend

This folder contains a minimal Express (Node.js) backend for a URL shortener. It's designed to work with a Postgres database via the `DATABASE_URL` environment variable.

Core features implemented:
- Create short links (optional custom code)
- Redirecting `/code` to the original URL with 302 and click counting
- List all links
- Delete a link (by id)

Prerequisites
- Node.js v22+
- A Postgres database

Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `PORT` as needed.

2. Create the `links` table (run the SQL in `migrations/create_links.sql`). Example with psql:

```powershell
pSQL -f migrations/create_links.sql -d your_db_name
```

If your Postgres setup doesn't have `gen_random_uuid()`, either enable `pgcrypto` or change the `id` default to use `uuid_generate_v4()` from `uuid-ossp`.

3. Install dependencies:

```powershell
cd backend
npm install
```

4. Start server:

```powershell
npm start
```

API endpoints
- POST /api/links  — create a link. JSON body: { url, code? }
- GET  /api/links  — list links
- DELETE /api/links/:id — delete by id
- GET /:code — redirect (public)

Notes
- Custom codes must be 3-64 chars and contain only letters, numbers, `_` or `-`.
- The app expects a Postgres database and `DATABASE_URL` in the environment. You mentioned you have a database available — just set `DATABASE_URL` in `.env`.
