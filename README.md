# B10Pool

Peer-to-peer carpooling for Big Ten students. Find or post rides between Purdue, UIUC, Chicago (Loop / ORD / MDW), and Indianapolis (Downtown / IND).

**Stack:** Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind v4 · shadcn/ui (Base UI) · Supabase (Postgres + Auth + RLS) · Vercel

## Local development

```bash
cp .env.example .env.local   # fill in Supabase URL + publishable key
npm install
npm run dev
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (`sb_publishable_…`) key |
| `NEXT_PUBLIC_SITE_URL` | Public site origin, used for auth email redirects |

`npm run lint` and `npm run build` must pass before deploying.

## Database

Schema lives in `supabase/migrations/` and is applied to the hosted project. Key pieces:

- `schools` — the **rollout lever**. Adding a college = one row (`id`, `name`, `email_domain`, `location`). Signups are rejected server-side unless the email domain matches an active school.
- `profiles` — auto-created from `auth.users` by the `handle_new_user()` trigger.
- `rides` — one row per posted ride. `departs_at` is a real instant; `departs_on` (set by trigger) is the calendar date in the origin hub's timezone for date filtering.

Row Level Security: anyone can browse rides, but anonymous visitors only get a redacted driver name (`profiles.display_name`, e.g. "Nick R.") and never contact details. Full names, contact info, and posting are limited to **verified students** — signed-in users whose school is active (`is_verified_student()` is checked inside the policies, so deactivating a school instantly demotes its users to the public view). Only the driver can update or delete their own rides.

### Adding a new campus

1. If it's a new hub, add a value to the `location` enum and a label in `src/lib/locations.ts` (+ timezone in `src/lib/time.ts` and `time_zone_for()` in SQL if not Central).
2. `insert into schools (id, name, email_domain, location) values ('msu', 'Michigan State University', 'msu.edu', 'msu');`

## Project layout

```
src/app/            routes (rides, dashboard, profile, auth) + server actions
src/components/     layout, auth, rides, form, ui (shadcn)
src/lib/            supabase clients, queries, validation, locations, contact, time
src/proxy.ts        session refresh + auth-gated routes
supabase/migrations SQL schema
docs/SPEC.md        original product spec
```
