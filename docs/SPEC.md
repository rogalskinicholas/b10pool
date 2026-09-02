# PROJECT INSTRUCTION MANUAL: B10Pool

## 1. Project Overview & Context
- **Project Name:** B10Pool (b10pool.com)
- **Concept:** A peer-to-peer student carpooling and ridesharing web platform initially connecting Midwest Big Ten campuses and nearby metropolitan hubs.
- **Initial MVP Hubs:**
  - Purdue University (West Lafayette, IN)
  - University of Illinois Urbana-Champaign (Urbana-Champaign, IL)
  - Chicago, IL (Downtown, O'Hare [ORD], Midway [MDW])
  - Indianapolis, IN (Downtown, Indianapolis International [IND])
- **Target Deadline:** Fast-paced 72-hour MVP sprint to production.

---

## 2. Tech Stack & Architecture
- **Framework:** Next.js (App Router, React 19 / latest, TypeScript)
- **Styling & UI:** Tailwind CSS, `shadcn/ui`, Lucide Icons
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security, Supabase Auth)
- **Deployment & Hosting:** Vercel (CI/CD via GitHub)
- **State Management:** React Server Components (RSC) + Server Actions; lightweight client state using standard React hooks (`useState`, `useOptimistic`).

---

## 3. Core Functional Requirements (MVP Scope)

### A. Authentication & Domain Whitelisting
- Restrict user registrations strictly to valid collegiate `.edu` domains (e.g., `@purdue.edu`, `@illinois.edu`, with an extensible regex or lookup list for future Big Ten schools).
- Support email magic-link or email/password authentication via Supabase Auth.
- Basic user profile creation: Full name, `.edu` email, phone number / Instagram handle for coordination, and graduation year/campus.

### B. Location Schema & Fixed Enums
To eliminate map-routing complexity in the MVP, enforce structured enum choices:
- `Purdue University (West Lafayette)`
- `UIUC (Urbana-Champaign)`
- `Chicago (Downtown / Loop)`
- `Chicago (ORD Airport)`
- `Chicago (MDW Airport)`
- `Indianapolis (Downtown)`
- `Indianapolis (IND Airport)`
/
### C. Ride Posting & Discovery Flow
1. **Driver Flow (Post a Ride):**
   - Form inputs: Origin, Destination, Departure Date & Time, Available Seats (1–6), Price per Seat ($ reimbursement estimation), Pickup/Dropoff specific notes, Preferred contact method (SMS / Instagram / WhatsApp / GroupMe).
   - Writes directly to Supabase `rides` table with `driver_id` reference.
2. **Passenger Flow (Find a Ride):**
   - Filter bar: Origin, Destination, Date.
   - Display cards showing: Driver Name, Campus, Departure Time, Seats Left, Cost per Seat, and Route.
   - Direct Call-to-Action: "Request Seat / Contact Driver" opening a native `tel:`, `sms:`, or external profile link directly to the driver.
3. **Driver Management:**
   - A simple "My Rides" dashboard allowing drivers to mark a ride as full or delete/cancel a listing.

---

## 4. Agent Operating Guidelines & Coding Standards

1. **Strict TypeScript & Type Safety:**
   - Always define explicit TypeScript interfaces/types matching the Supabase DB schema.
   - Avoid `any` types. Ensure all Server Actions and route handlers are type-safe.
2. **Component Architecture:**
   - Use `shadcn/ui` primitives (Dialog, Select, Button, Card, Badge, Calendar/Popover) for speed and accessibility.
   - Keep components modular in `@/components/rides`, `@/components/auth`, and `@/components/layout`.
3. **No Premature Optimization / Scope Creep:**
   - **Do NOT** integrate live payment gateways (e.g., Stripe) in MVP — carpooling cost-sharing is coordinated peer-to-peer.
   - **Do NOT** implement custom real-time socket chat in phase 1 — use direct contact links (`sms:`, `mailto:`, social handles).
   - **Do NOT** integrate complex Google Maps routing APIs — use predefined location enums.
4. **Security & RLS (Row Level Security):**
   - Ensure Supabase RLS policies only allow authenticated users to view ride contact details and only owners to mutate/delete their own ride listings.