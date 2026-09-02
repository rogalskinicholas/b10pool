-- Local calendar date of departure (in the origin hub's timezone) for simple date filtering.
create or replace function public.time_zone_for(loc public.location)
returns text
language sql
immutable
as $$
  select case loc
    when 'purdue' then 'America/Indiana/Indianapolis'
    when 'indy_downtown' then 'America/Indiana/Indianapolis'
    when 'indy_ind' then 'America/Indiana/Indianapolis'
    else 'America/Chicago'
  end;
$$;

alter table public.rides
  add column departs_on date not null default current_date;

create or replace function public.set_ride_departs_on()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.departs_on := (new.departs_at at time zone public.time_zone_for(new.origin))::date;
  return new;
end;
$$;

create trigger rides_set_departs_on
  before insert or update of departs_at, origin on public.rides
  for each row execute function public.set_ride_departs_on();

create index rides_departs_on_idx on public.rides (departs_on);

grant select (departs_on) on public.rides to anon;
