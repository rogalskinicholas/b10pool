import Link from "next/link";
import { CalendarDays, GraduationCap } from "lucide-react";
import { REGION_STYLES } from "@/components/regions/region-styles";
import { LOCATIONS } from "@/lib/locations";
import type { RideListItem } from "@/lib/rides/queries";
import { formatDeparture, formatPrice } from "@/lib/time";
import { cn } from "@/lib/utils";
import { RideStatusBadge } from "./ride-status-badge";
import { RouteLabel } from "./route-label";

export function RideCard({ ride }: { ride: RideListItem }) {
  const { date, time } = formatDeparture(ride.departs_at, ride.origin);
  const gradYear = ride.driver?.gradYear ? `'${String(ride.driver.gradYear).slice(-2)}` : "";
  const school = ride.driver?.school;
  const region = LOCATIONS[ride.origin].region;

  return (
    <Link
      href={`/rides/${ride.id}`}
      className="group block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <article
        className={cn(
          "flex h-full flex-col gap-4 rounded-2xl border-l-4 bg-card p-4 ring-1 ring-foreground/10 transition",
          "group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-foreground/20",
          REGION_STYLES[region].border,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <RouteLabel origin={ride.origin} destination={ride.destination} />
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-3.5" />
              {date} · {time}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-heading text-xl font-extrabold tracking-tight">
              {formatPrice(ride.price_per_seat)}
            </div>
            <div className="text-[11px] text-muted-foreground">per seat</div>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" />
            <span className="truncate">
              {ride.driver?.name ?? "Student"}
              {school ? ` · ${school} ${gradYear}` : ""}
            </span>
          </div>
          <RideStatusBadge status={ride.status} seatsAvailable={ride.seats_available} />
        </div>
      </article>
    </Link>
  );
}
