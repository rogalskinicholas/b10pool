import { createAnonClient, createClient } from "@/lib/supabase/server";
import { locationsInRegion, type Location, type Region } from "@/lib/locations";
import type { Enums } from "@/types/database";

// Public (anon) access is limited by column-level grants: the driver's first initial
// (display_name), school, and class year — never full_name, and never the ride's notes
// (pickup spot & details). Verified students get everything.
const PUBLIC_COLUMNS =
  "id, driver_id, origin, destination, departs_at, departs_on, seats_total, seats_available, price_per_seat, status, created_at, driver:profiles(display_name, grad_year, school:schools(name))";
const VERIFIED_COLUMNS =
  "id, driver_id, origin, destination, departs_at, departs_on, seats_total, seats_available, price_per_seat, notes, status, created_at, driver:profiles(full_name, grad_year, school:schools(name))";

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
  /** Pickup spot & details. Always null for public viewers — the column isn't sent. */
  notes: string | null;
  status: Enums<"ride_status">;
  created_at: string;
  /** True when fetched for a public viewer (name is an initial, notes withheld). */
  redacted: boolean;
  driver: { name: string; gradYear: number | null; school: string | null } | null;
};

type RawDriver = ({ display_name: string | null } | { full_name: string }) & {
  grad_year: number | null;
  school: { name: string } | null;
};
type RawRide = Omit<RideListItem, "driver" | "notes" | "redacted"> & {
  notes?: string | null;
  driver: RawDriver | null;
};

function toRideListItem(row: RawRide, verified: boolean): RideListItem {
  const { driver, notes, ...ride } = row;
  return {
    ...ride,
    notes: verified ? (notes ?? null) : null,
    redacted: !verified,
    driver: driver
      ? {
          name:
            "full_name" in driver ? driver.full_name : (driver.display_name ?? "Student"),
          gradYear: driver.grad_year,
          school: driver.school?.name ?? null,
        }
      : null,
  };
}

async function clientFor(verified: boolean) {
  return verified ? await createClient() : createAnonClient();
}

// Not async on purpose: returning a PostgREST builder from an async function would await it.
// The select-string parser can't type a union of two column lists, so the row type is
// stated explicitly; `RawRide` covers both shapes.
function selectRides(supabase: Awaited<ReturnType<typeof clientFor>>, verified: boolean) {
  return supabase.from("rides").select<string, RawRide>(verified ? VERIFIED_COLUMNS : PUBLIC_COLUMNS);
}

export type RideFilters = {
  region?: Region;
  /** Rides that start OR end at this hub (used by the region hub chips). */
  hub?: Location;
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

  if (filters.hub) {
    // A hub implies its region, so this replaces the region filter.
    query = query.or(`origin.eq.${filters.hub},destination.eq.${filters.hub}`);
  } else if (filters.region) {
    const hubs = locationsInRegion(filters.region).join(",");
    query = query.or(`origin.in.(${hubs}),destination.in.(${hubs})`);
  }
  if (filters.origin) query = query.eq("origin", filters.origin);
  if (filters.destination) query = query.eq("destination", filters.destination);
  if (filters.date) query = query.eq("departs_on", filters.date);

  const { data, error } = await query;
  if (error) throw error;
  return data.map((row) => toRideListItem(row, verified));
}

export async function getRide(id: string, verified: boolean) {
  const supabase = await clientFor(verified);
  const { data, error } = await selectRides(supabase, verified).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toRideListItem(data, verified) : null;
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
