import { createClient } from "@/lib/supabase/server";
import type { Location } from "@/lib/locations";

// Anonymous visitors only have column-level SELECT on these columns; never `select("*")` here.
const PUBLIC_RIDE_COLUMNS =
  "id, driver_id, origin, destination, departs_at, departs_on, seats_total, seats_available, price_per_seat, notes, status, created_at, driver:profiles(full_name, grad_year, school:schools(name))" as const;

export type RideFilters = {
  origin?: Location;
  destination?: Location;
  date?: string;
  limit?: number;
};

export async function listRides(filters: RideFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("rides")
    .select(PUBLIC_RIDE_COLUMNS)
    .in("status", ["open", "full"])
    .gte("departs_at", new Date().toISOString())
    .order("departs_at", { ascending: true })
    .limit(filters.limit ?? 100);

  if (filters.origin) query = query.eq("origin", filters.origin);
  if (filters.destination) query = query.eq("destination", filters.destination);
  if (filters.date) query = query.eq("departs_on", filters.date);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export type RideListItem = Awaited<ReturnType<typeof listRides>>[number];

export async function getRide(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rides")
    .select(PUBLIC_RIDE_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getRideContact(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rides")
    .select("contact_method, contact_value")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function listMyRides(driverId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("driver_id", driverId)
    .order("departs_at", { ascending: false });
  if (error) throw error;

  const now = Date.now();
  const upcoming = data.filter(
    (r) => r.status !== "cancelled" && new Date(r.departs_at).getTime() >= now,
  );
  const past = data.filter((r) => !upcoming.includes(r));
  return { all: data, upcoming, past };
}

export type MyRide = Awaited<ReturnType<typeof listMyRides>>["all"][number];
