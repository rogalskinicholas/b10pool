-- Enums
create type public.location as enum (
  'purdue',
  'uiuc',
  'chicago_downtown',
  'chicago_ord',
  'chicago_mdw',
  'indy_downtown',
  'indy_ind'
);

create type public.contact_method as enum ('sms', 'instagram', 'whatsapp', 'groupme');

create type public.ride_status as enum ('open', 'full', 'cancelled');

-- Schools: the rollout lever. Adding a college = insert a row.
create table public.schools (
  id text primary key,
  name text not null,
  email_domain text not null unique,
  location public.location not null,
  is_active boolean not null default true
);

insert into public.schools (id, name, email_domain, location) values
  ('purdue', 'Purdue University', 'purdue.edu', 'purdue'),
  ('uiuc', 'University of Illinois Urbana-Champaign', 'illinois.edu', 'uiuc');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  school_id text not null references public.schools (id),
  grad_year int check (grad_year between 2020 and 2040),
  phone text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Rides
create table public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles (id) on delete cascade,
  origin public.location not null,
  destination public.location not null,
  departs_at timestamptz not null,
  seats_total int not null check (seats_total between 1 and 6),
  seats_available int not null check (seats_available >= 0),
  price_per_seat numeric(6, 2) not null check (price_per_seat >= 0),
  notes text,
  contact_method public.contact_method not null,
  contact_value text not null,
  status public.ride_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rides_origin_destination_differ check (origin <> destination),
  constraint rides_seats_available_lte_total check (seats_available <= seats_total)
);

create index rides_departs_at_idx on public.rides (departs_at);
create index rides_route_idx on public.rides (origin, destination, departs_at);
create index rides_driver_idx on public.rides (driver_id);

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger rides_set_updated_at
  before update on public.rides
  for each row execute function public.set_updated_at();

-- Email whitelist: resolves an email to an active school by domain
create or replace function public.school_for_email(p_email text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.schools
  where is_active
    and email_domain = lower(split_part(p_email, '@', 2))
  limit 1;
$$;

create or replace function public.is_allowed_email(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.school_for_email(p_email) is not null;
$$;

-- Auto-create a profile on signup; reject non-whitelisted domains server-side
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_school text;
begin
  v_school := public.school_for_email(new.email);
  if v_school is null then
    raise exception 'Email domain not allowed. Use your school .edu email.';
  end if;

  insert into public.profiles (id, full_name, email, school_id, grad_year, phone, instagram)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)),
    new.email,
    v_school,
    nullif(new.raw_user_meta_data ->> 'grad_year', '')::int,
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'instagram', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.schools enable row level security;
alter table public.profiles enable row level security;
alter table public.rides enable row level security;

create policy "schools are public"
  on public.schools for select
  using (true);

create policy "profiles viewable by everyone"
  on public.profiles for select
  using (true);

create policy "users insert own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "users update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "rides viewable by everyone"
  on public.rides for select
  using (true);

create policy "drivers insert own rides"
  on public.rides for insert to authenticated
  with check ((select auth.uid()) = driver_id);

create policy "drivers update own rides"
  on public.rides for update to authenticated
  using ((select auth.uid()) = driver_id)
  with check ((select auth.uid()) = driver_id);

create policy "drivers delete own rides"
  on public.rides for delete to authenticated
  using ((select auth.uid()) = driver_id);

-- Anonymous visitors can browse rides but never see contact details or private profile fields.
-- Column-level grants: anon must select explicit columns (select * is denied).
revoke all on public.rides from anon;
grant select (
  id, driver_id, origin, destination, departs_at,
  seats_total, seats_available, price_per_seat, notes, status, created_at, updated_at
) on public.rides to anon;

revoke all on public.profiles from anon;
grant select (id, full_name, school_id, grad_year, created_at) on public.profiles to anon;
