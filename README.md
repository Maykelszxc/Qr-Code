# Relay QR

Private admin tooling for pre-printed QR cards that redirect to Google Maps review pages.

## Setup

1. Create a Supabase project and enable Email/password authentication. Create the one admin user from the Supabase dashboard; public signup is not used.
2. Run `supabase/migrations/001_qr_management.sql` and then `supabase/migrations/002_multi_tenant_qr_ownership.sql` in the Supabase SQL editor (or with the Supabase CLI).
3. Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_` or expose it to the browser.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/admin/login`. Generate a batch, download the ZIP of PNGs, then assign each code a business and review URL from its detail page.

Each signed-in user has a separate QR-code inventory. Codes created before the ownership migration have no owner and must be manually assigned in Supabase if they should belong to an account.

The public redirect is `/r/{short_code}`. Active codes log a scan event without delaying the 302 redirect. Unknown, unassigned, empty-URL, and disabled codes go to `/inactive`.

## Deploy to Vercel

Import the repository into Vercel and add the four environment variables above. Set `NEXT_PUBLIC_APP_URL` to the deployed production URL, for example `https://qr.example.com`. Deploy with the default Next.js build settings.

## Useful commands

```bash
npm run lint
npm run build
```
