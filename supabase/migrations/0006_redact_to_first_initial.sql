-- Public view shows only the first initial: "Nick Rogalski" -> "N."
create or replace function public.redact_name(full_name text)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when full_name is null or btrim(full_name) = '' then 'Student'
    else upper(left(btrim(full_name), 1)) || '.'
  end;
$$;

-- Stored generated columns only recompute on write; force a recompute of existing rows.
update public.profiles set full_name = full_name;

-- Anonymous visitors: initial + school only (no graduation year).
revoke select on public.profiles from anon;
grant select (id, display_name, school_id, created_at) on public.profiles to anon;
