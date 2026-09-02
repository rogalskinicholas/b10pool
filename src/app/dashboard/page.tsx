import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/rides/empty-state";
import { RideActions } from "@/components/rides/ride-actions";
import { RideStatusBadge } from "@/components/rides/ride-status-badge";
import { RouteLabel } from "@/components/rides/route-label";
import { listMyRides, type MyRide } from "@/lib/rides/queries";
import { requireUserWithProfile } from "@/lib/supabase/auth";
import { formatDeparture, formatPrice } from "@/lib/time";

export const metadata: Metadata = { title: "My rides" };

export default async function DashboardPage() {
  const { user } = await requireUserWithProfile("/dashboard");
  const { all: rides, upcoming, past } = await listMyRides(user.id);

  return (
    <Container className="max-w-3xl space-y-8 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">My rides</h1>
          <p className="text-sm text-muted-foreground">
            Update seats, mark a ride full, or cancel it.
          </p>
        </div>
        <Button render={<Link href="/rides/new" />}>
          <Plus data-icon="inline-start" />
          Post a ride
        </Button>
      </div>

      {rides.length === 0 ? (
        <EmptyState
          title="You haven't posted any rides"
          description="Driving somewhere with empty seats? Post it and split the gas."
          action={<Button render={<Link href="/rides/new" />}>Post a ride</Button>}
        />
      ) : (
        <>
          <RideSection title="Upcoming" rides={upcoming} emptyText="No upcoming rides." />
          {past.length > 0 && <RideSection title="Past & cancelled" rides={past} />}
        </>
      )}
    </Container>
  );
}

function RideSection({
  title,
  rides,
  emptyText,
}: {
  title: string;
  rides: MyRide[];
  emptyText?: string;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      {rides.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {rides.map((ride) => {
            const { date, time } = formatDeparture(ride.departs_at, ride.origin);
            return (
              <li key={ride.id} className="rounded-xl border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <Link href={`/rides/${ride.id}`} className="hover:underline">
                      <RouteLabel origin={ride.origin} destination={ride.destination} />
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {date} · {time} · {formatPrice(ride.price_per_seat)}/seat
                    </p>
                    <RideStatusBadge status={ride.status} seatsAvailable={ride.seats_available} />
                  </div>
                  <RideActions ride={ride} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
