-- "Nick Rogalski" -> "Nick R."; shown to anyone who is not a verified student.
create or replace function public.redact_name(full_name text)
returns text
language sql
immutable
as $$
  select case
    when full_name is null or btrim(full_name) = '' then 'Student'
    when position(' ' in btrim(full_name)) = 0 then btrim(full_name)
    else split_part(btrim(full_name), ' ', 1)
      || ' ' || upper(left(regexp_replace(btrim(full_name), '^.*\s', ''), 1)) || '.'
  end;
$$;

alter table public.profiles
  add column display_name text generated always as (public.redact_name(full_name)) stored;

-- Anonymous visitors: redacted name only, never full_name.
revoke select on public.profiles from anon;
grant select (id, display_name, school_id, grad_year, created_at) on public.profiles to anon;

-- A signed-in user is "verified" only while their profile's school is active.
create or replace function public.is_verified_student()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.schools s on s.id = p.school_id
    where p.id = auth.uid()
      and s.is_active
  );
$$;
revoke execute on function public.is_verified_student() from public, anon;
grant execute on function public.is_verified_student() to authenticated;

drop policy "profiles viewable by everyone" on public.profiles;
create policy "profiles redacted for anon"
  on public.profiles for select to anon
  using (true);
create policy "profiles viewable by verified students"
  on public.profiles for select to authenticated
  using (public.is_verified_student() or (select auth.uid()) = id);

drop policy "rides viewable by everyone" on public.rides;
create policy "rides browsable by anon"
  on public.rides for select to anon
  using (true);
create policy "rides viewable by verified students"
  on public.rides for select to authenticated
  using (public.is_verified_student() or (select auth.uid()) = driver_id);

drop policy "drivers insert own rides" on public.rides;
create policy "verified drivers insert own rides"
  on public.rides for insert to authenticated
  with check ((select auth.uid()) = driver_id and public.is_verified_student());
