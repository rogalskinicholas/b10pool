import { createAnonClient, createClient } from "@/lib/supabase/server";
import type { Location } from "@/lib/locations";
import type { Enums } from "@/types/database";

const RIDE_COLUMNS =
  "id, driver_id, origin, destination, departs_at, departs_on, seats_total, seats_available, price_per_seat, notes, status, created_at";

// Anonymous access only has column-level SELECT on display_name (first initial) and school;
// full_name and grad_year are for verified students.
const PUBLIC_COLUMNS =
  `${RIDE_COLUMNS}, driver:profiles(display_name, school:schools(name))` as const;
const VERIFIED_COLUMNS =
  `${RIDE_COLUMNS}, driver:profiles(full_name, grad_year, school:schools(name))` as const;

export type RideListItem = {
  id: string;
  driver_id: string;
  origin: Location;
  destination: Location;
  departs_at: string;
  departs_on: string;
  seats_total: number;
  seats_available: number;
  price_per_seat: number;
  notes: string | null;
  status: Enums<"ride_status">;
  created_at: string;
  driver: { name: string; gradYear: number | null; school: string | null } | null;
};

type RawDriver = (
  | { display_name: string | null }
  | { full_name: string; grad_year: number | null }
) & { school: { name: string } | null };
type RawRide = Omit<RideListItem, "driver"> & { driver: RawDriver | null };

function toRideListItem(row: RawRide): RideListItem {
  const { driver, ...ride } = row;
  return {
    ...ride,
    driver: driver
      ? {
          name:
            "full_name" in driver ? driver.full_name : (driver.display_name ?? "Student"),
          gradYear: "full_name" in driver ? driver.grad_year : null,
          school: driver.school?.name ?? null,
        }
      : null,
  };
}

async function clientFor(verified: boolean) {
  return verified ? await createClient() : createAnonClient();
}

// Not async on purpose: returning a PostgREST builder from an async function would await it.
function selectRides(supabase: Awaited<ReturnType<typeof clientFor>>, verified: boolean) {
  const columns: typeof PUBLIC_COLUMNS | typeof VERIFIED_COLUMNS = verified
    ? VERIFIED_COLUMNS
    : PUBLIC_COLUMNS;
  return supabase.from("rides").select(columns);
}

export type RideFilters = {
  origin?: Location;
  destination?: Location;
  date?: string;
  limit?: number;
};

export async function listRides(filters: RideFilters, verified: boolean) {
  const supabase = await clientFor(verified);
  let query = selectRides(supabase, verified)
    .in("status", ["open", "full"])
    .gte("departs_at", new Date().toISOString())
    .order("departs_at", { ascending: true })
    .limit(filters.limit ?? 100);

  if (filters.origin) query = query.eq("origin", filters.origin);
  if (filters.destination) query = query.eq("destination", filters.destination);
  if (filters.date) query = query.eq("departs_on", filters.date);

  const { data, error } = await query;
  if (error) throw error;
  return (data as RawRide[]).map(toRideListItem);
}

export async function getRide(id: string, verified: boolean) {
  const supabase = await clientFor(verified);
  const { data, error } = await selectRides(supabase, verified).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toRideListItem(data as RawRide) : null;
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
