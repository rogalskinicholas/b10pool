"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/supabase/auth";
import { wallTimeToInstant } from "@/lib/time";
import {
  RIDE_FIELDS,
  fieldErrorsOf,
  formValues,
  rideSchema,
  type ActionState,
} from "@/lib/validation";
import type { Enums } from "@/types/database";

type RideStatus = Enums<"ride_status">;
type Result = { error?: string };

function revalidateRide(id: string) {
  revalidatePath("/");
  revalidatePath("/rides");
  revalidatePath(`/rides/${id}`);
  revalidatePath("/dashboard");
}

export async function createRide(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getViewer();
  if (!session) redirect("/login?next=/rides/new");

  const values = formValues(formData, RIDE_FIELDS);
  if (!session.verified) {
    return {
      error: "Your school isn't active on B10Pool right now, so you can't post rides.",
      values,
    };
  }
  const parsed = rideSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values };
  }

  const departsAt = wallTimeToInstant(parsed.data.departs_at, parsed.data.origin);
  if (Number.isNaN(departsAt.getTime())) {
    return { fieldErrors: { departs_at: ["Pick a valid date and time"] }, values };
  }
  if (departsAt.getTime() < Date.now()) {
    return { fieldErrors: { departs_at: ["Departure must be in the future"] }, values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rides")
    .insert({
      driver_id: session.user.id,
      origin: parsed.data.origin,
      destination: parsed.data.destination,
      departs_at: departsAt.toISOString(),
      seats_total: parsed.data.seats_total,
      seats_available: parsed.data.seats_total,
      price_per_seat: parsed.data.price_per_seat,
      notes: parsed.data.notes,
      contact_method: parsed.data.contact_method,
      contact_value: parsed.data.contact_value,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Couldn't post your ride. Please try again.", values };
  }

  revalidateRide(data.id);
  redirect(`/rides/${data.id}`);
}

export async function updateRideStatus(
  rideId: string,
  status: RideStatus,
): Promise<Result> {
  const session = await getViewer();
  if (!session) return { error: "Sign in to manage rides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("rides")
    .update({ status })
    .eq("id", rideId)
    .eq("driver_id", session.user.id);

  if (error) return { error: "Couldn't update the ride." };
  revalidateRide(rideId);
  return {};
}

export async function adjustSeats(rideId: string, delta: 1 | -1): Promise<Result> {
  const session = await getViewer();
  if (!session) return { error: "Sign in to manage rides." };

  const supabase = await createClient();
  const { data: ride } = await supabase
    .from("rides")
    .select("seats_total, seats_available, status")
    .eq("id", rideId)
    .eq("driver_id", session.user.id)
    .maybeSingle();
  if (!ride) return { error: "Ride not found." };

  const seats = Math.min(ride.seats_total, Math.max(0, ride.seats_available + delta));
  const status: RideStatus =
    ride.status === "cancelled" ? "cancelled" : seats === 0 ? "full" : "open";

  const { error } = await supabase
    .from("rides")
    .update({ seats_available: seats, status })
    .eq("id", rideId)
    .eq("driver_id", session.user.id);

  if (error) return { error: "Couldn't update seats." };
  revalidateRide(rideId);
  return {};
}

export async function deleteRide(rideId: string): Promise<Result> {
  const session = await getViewer();
  if (!session) return { error: "Sign in to manage rides." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("rides")
    .delete()
    .eq("id", rideId)
    .eq("driver_id", session.user.id);

  if (error) return { error: "Couldn't delete the ride." };
  revalidateRide(rideId);
  return {};
}
