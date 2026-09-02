create or replace function public.time_zone_for(loc public.location)
returns text
language sql
immutable
set search_path = public
as $$
  select case loc
    when 'uw' then 'America/Los_Angeles'
    when 'oregon' then 'America/Los_Angeles'
    when 'ucla' then 'America/Los_Angeles'
    when 'usc' then 'America/Los_Angeles'
    when 'sea' then 'America/Los_Angeles'
    when 'pdx' then 'America/Los_Angeles'
    when 'lax' then 'America/Los_Angeles'
    when 'purdue' then 'America/Indiana/Indianapolis'
    when 'indy_downtown' then 'America/Indiana/Indianapolis'
    when 'indy_ind' then 'America/Indiana/Indianapolis'
    when 'iu' then 'America/Indiana/Indianapolis'
    when 'michigan' then 'America/Detroit'
    when 'msu' then 'America/Detroit'
    when 'dtw' then 'America/Detroit'
    when 'ohio_state' then 'America/New_York'
    when 'penn_state' then 'America/New_York'
    when 'maryland' then 'America/New_York'
    when 'rutgers' then 'America/New_York'
    when 'nyc' then 'America/New_York'
    when 'ewr' then 'America/New_York'
    when 'phl' then 'America/New_York'
    when 'dc_downtown' then 'America/New_York'
    when 'bwi' then 'America/New_York'
    else 'America/Chicago'
  end;
$$;
