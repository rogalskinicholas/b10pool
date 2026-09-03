<p align="center">
  <img src="public/brand/wordmark-light.png" alt="B10 Pool" width="420">
</p>

<p align="center"><strong>A carpooling hub for Big Ten students.</strong></p>

<p align="center">
  <a href="https://b10pool.vercel.app">Live site</a> ·
  <a href="#features">Features</a> ·
  <a href="#privacy-and-security">Privacy</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#expanding-to-a-new-campus">Expanding</a>
</p>

---

B10 Pool connects students who have a car with students who need a seat. Drivers post a trip between two hubs, riders find it, and the two coordinate directly. No booking fees, no middleman.

Trips run between campuses, cities, and airports across the three regions of the Big Ten: **West**, **Midwest**, and **East**. Sign-up is currently open to **Purdue** and **UIUC** students, with more campuses rolling out over time.

## Features

- **Verified students only.** Accounts require an email address from a participating university. Domains are checked server-side at sign-up, not just in the browser.
- **Region-first browsing.** Start from West, Midwest, or East, then narrow to a single campus, city, or airport to see every ride that starts or ends there.
- **Post a ride in under a minute.** Origin, destination, departure time, seats, price per seat, pickup notes, and how riders should reach you.
- **Driver dashboard.** Mark a ride full, reopen it, adjust seats, cancel, or delete.
- **Direct contact.** Riders reach drivers over text, WhatsApp, Instagram, or GroupMe. The app never sits in the middle of the conversation.
- **Timezone-aware.** Departure times are stored as instants and shown in the origin hub's local time, so a Los Angeles to Seattle ride and a Purdue to Chicago ride both read correctly.

## Privacy and security

Anyone can browse rides, but what they see depends on who they are.

| | Public visitor | Verified student |
| --- | --- | --- |
| Route, date, time, price, seats | Yes | Yes |
| Driver name | First initial only | Full name |
| Driver school and class year | Yes | Yes |
| Pickup notes and details | Blurred | Yes |
| Contact details | No | Yes |
| Post and manage rides | No | Yes |

This is enforced in the database, not only in the interface:

- Public requests use column-level grants, so full names, notes, and contact details are never sent to an unauthenticated client. The driver's initial comes from a generated column.
- Row Level Security policies check `is_verified_student()`, which requires a signed-in user whose school is currently active. Deactivating a school instantly moves its users back to the public view.
- Only a ride's driver can update or delete it.
- Privileged helper functions run with a pinned search path and cannot be called through the public API.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Server Actions) with TypeScript |
| UI | Tailwind CSS v4, shadcn/ui on Base UI, Lucide icons |
| Data and auth | Supabase (Postgres, Row Level Security, Supabase Auth) |
| Hosting | Vercel, deployed automatically from `main` |

## Getting started

Prerequisites: Node.js 20 or newer and a Supabase project.

```bash
git clone https://github.com/rogalskinicholas/b10pool.git
cd b10pool
npm install
cp .env.example .env.local
npm run dev
```

Fill in `.env.local` with your own project's values:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key (`sb_publishable_…`) |
| `NEXT_PUBLIC_SITE_URL` | The origin the app is served from, used in auth email links |

Apply the SQL in `supabase/migrations/` to your project in order, then open `http://localhost:3000`.

Before shipping:

```bash
npm run lint
npm run build
```

### Supabase auth settings

In the Supabase dashboard under Authentication → URL Configuration, set the Site URL to your deployed origin and add `<origin>/auth/confirm` for every origin you use (production, previews, and `http://localhost:3000`).

## Database

The schema is versioned in `supabase/migrations/` and consists of three tables.

- **`schools`** lists participating universities: an id, display name, email domain, home hub, and an active flag. Sign-ups are rejected unless the email domain matches an active row.
- **`profiles`** holds one row per user, created automatically by a trigger when a Supabase Auth user is inserted.
- **`rides`** holds one row per posted trip. `departs_at` is the real instant; `departs_on` is the calendar date in the origin hub's timezone, maintained by a trigger for date filtering.

Hubs are a Postgres enum (`location`) mirrored by `src/lib/locations.ts`, which carries each hub's label, region, kind, and timezone.

## Expanding to a new campus

Adding a university that already has a hub is a single row:

```sql
insert into public.schools (id, name, email_domain, location)
values ('msu', 'Michigan State University', 'msu.edu', 'msu');
```

If the campus is a new hub, first add a value to the `location` enum in a migration, then add its entry to `src/lib/locations.ts` and, if it is not in the Central timezone, to `time_zone_for()` in SQL.

## Project structure

```
src/app/              Routes, layouts, and server actions
src/components/       Layout, regions, rides, forms, auth, and shadcn/ui primitives
src/lib/              Supabase clients, ride queries, validation, hubs, timezones
src/proxy.ts          Session refresh and auth-gated routes
supabase/migrations/  Database schema, in order
public/brand/         Logo assets
docs/                 Product specification
```

## Disclaimer

B10 Pool is an independent student project. It is not affiliated with, endorsed by, or sponsored by the Big Ten Conference or any of its member universities. Riders and drivers arrange trips directly with each other.
