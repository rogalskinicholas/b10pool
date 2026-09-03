-- Public (anonymous / unverified) viewers see the driver's first initial, school, and
-- class year. Ride notes (pickup spot and details) are now verified-students only, so
-- the blurred "Pickup & details" block in the UI is backed by the database, not just CSS.

revoke select on public.profiles from anon;
grant select (id, display_name, school_id, grad_year, created_at) on public.profiles to anon;

revoke select on public.rides from anon;
grant select (
  id, driver_id, origin, destination, departs_at, departs_on,
  seats_total, seats_available, price_per_seat, status, created_at, updated_at
) on public.rides to anon;
