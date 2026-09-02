import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/rides/empty-state";
import { RideCard } from "@/components/rides/ride-card";
import { RideFilters } from "@/components/rides/ride-filters";
import { isLocation } from "@/lib/locations";
import { listRides } from "@/lib/rides/queries";
import { isDateInputValue } from "@/lib/time";

export const metadata: Metadata = { title: "Find a ride" };

export default async function RidesPage({ searchParams }: PageProps<"/rides">) {
  const sp = await searchParams;
  const origin = isLocation(sp.origin) ? sp.origin : undefined;
  const destination = isLocation(sp.destination) ? sp.destination : undefined;
  const date = isDateInputValue(sp.date) ? sp.date : undefined;
  const hasFilters = Boolean(origin || destination || date);

  const rides = await listRides({ origin, destination, date });

  return (
    <Container className="space-y-6 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Find a ride
          </h1>
          <p className="text-sm text-muted-foreground">
            Upcoming rides between Big Ten hubs.
          </p>
        </div>
        <Button render={<Link href="/rides/new" />}>
          <Plus data-icon="inline-start" />
          Post a ride
        </Button>
      </div>

      <RideFilters origin={origin} destination={destination} date={date} />

      {rides.length ? (
        <>
          <p className="text-sm text-muted-foreground">
            {`${rides.length} ${rides.length === 1 ? "ride" : "rides"} ${hasFilters ? "match your filters" : "upcoming"}`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={hasFilters ? "No rides match those filters" : "No upcoming rides yet"}
          description={
            hasFilters
              ? "Try a different date or clear the filters. Or post a ride and let riders come to you."
              : "Be the first to post a ride for this route."
          }
          action={
            <div className="flex gap-2">
              {hasFilters && (
                <Button variant="outline" render={<Link href="/rides" />}>
                  Clear filters
                </Button>
              )}
              <Button render={<Link href="/rides/new" />}>Post a ride</Button>
            </div>
          }
        />
      )}
    </Container>
  );
}
