import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HubChips } from "@/components/regions/hub-chips";
import { RegionTabs } from "@/components/regions/region-tabs";
import { REGION_STYLES } from "@/components/regions/region-styles";
import { EmptyState } from "@/components/rides/empty-state";
import { RideCard } from "@/components/rides/ride-card";
import { RideFilters } from "@/components/rides/ride-filters";
import { LOCATIONS, REGIONS, isLocation, isRegion } from "@/lib/locations";
import { listRides } from "@/lib/rides/queries";
import { getViewer } from "@/lib/supabase/auth";
import { isDateInputValue } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Find a ride" };

export default async function RidesPage({ searchParams }: PageProps<"/rides">) {
  const sp = await searchParams;
  const region = isRegion(sp.region) ? sp.region : undefined;
  const origin = isLocation(sp.origin) ? sp.origin : undefined;
  const destination = isLocation(sp.destination) ? sp.destination : undefined;
  const date = isDateInputValue(sp.date) ? sp.date : undefined;
  const hasFilters = Boolean(origin || destination || date);

  const viewer = await getViewer();
  const rides = await listRides(
    { region, origin, destination, date },
    viewer?.verified ?? false,
  );

  const clearHref = region ? `/rides?region=${region}` : "/rides";

  return (
    <Container className="space-y-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {region && (
            <p
              className={cn(
                "text-[11px] font-bold tracking-[0.16em] uppercase",
                REGION_STYLES[region].text,
              )}
            >
              {REGIONS[region].states}
            </p>
          )}
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">
            {region ? `${REGIONS[region].label} rides` : "Find a ride"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {region ? REGIONS[region].tagline : "Upcoming rides across the Big Ten footprint."}
          </p>
        </div>
        <Button render={<Link href="/rides/new" />}>
          <Plus data-icon="inline-start" />
          Post a ride
        </Button>
      </div>

      <RegionTabs active={region} />

      {region && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Hubs in this region</p>
          <HubChips region={region} active={destination} />
        </div>
      )}

      <RideFilters region={region} origin={origin} destination={destination} date={date} />

      {rides.length ? (
        <>
          <p className="text-sm text-muted-foreground">
            {`${rides.length} ${rides.length === 1 ? "ride" : "rides"} ${hasFilters ? "match your filters" : "upcoming"}${destination ? ` to ${LOCATIONS[destination].short}` : ""}`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title={
            hasFilters
              ? "No rides match those filters"
              : region
                ? `No ${REGIONS[region].label} rides yet`
                : "No upcoming rides yet"
          }
          description={
            hasFilters
              ? "Try a different date or clear the filters. Or post a ride and let riders come to you."
              : "Be the first to post a ride here."
          }
          action={
            <div className="flex gap-2">
              {hasFilters && (
                <Button variant="outline" render={<Link href={clearHref} />}>
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
