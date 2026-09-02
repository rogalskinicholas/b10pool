import Link from "next/link";
import { CalendarDays, GraduationCap } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RideListItem } from "@/lib/rides/queries";
import { formatDeparture, formatPrice } from "@/lib/time";
import { RideStatusBadge } from "./ride-status-badge";
import { RouteLabel } from "./route-label";

export function RideCard({ ride }: { ride: RideListItem }) {
  const { date, time } = formatDeparture(ride.departs_at, ride.origin);
  const gradYear = ride.driver?.gradYear ? `'${String(ride.driver.gradYear).slice(-2)}` : "";
  const school = ride.driver?.school;

  return (
    <Link href={`/rides/${ride.id}`} className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <Card className="h-full transition group-hover:ring-foreground/25">
        <CardHeader>
          <CardTitle>
            <RouteLabel origin={ride.origin} destination={ride.destination} />
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {date} · {time}
          </CardDescription>
          <CardAction className="text-right">
            <div className="font-heading text-lg font-semibold">{formatPrice(ride.price_per_seat)}</div>
            <div className="text-xs text-muted-foreground">per seat</div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" />
            <span className="truncate">
              {ride.driver?.name ?? "Student"}
              {school ? ` · ${school} ${gradYear}` : ""}
            </span>
          </div>
          <RideStatusBadge status={ride.status} seatsAvailable={ride.seats_available} />
        </CardContent>
      </Card>
    </Link>
  );
}
