import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { LOCATIONS, REGIONS, REGION_IDS, locationsInRegion, type Region } from "@/lib/locations";
import { cn } from "@/lib/utils";
import { REGION_STYLES } from "./region-styles";

export function RegionCards({ rideCounts }: { rideCounts: Record<Region, number> }) {
  return (
    <div className="relative">
      {/* The road runs behind the cards; the car surfaces in the gaps between regions. */}
      <div className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 md:block" aria-hidden>
        <div className="road">
          <div className="road-car">
            <Car className="size-9 fill-background text-ink" strokeWidth={1.75} />
          </div>
        </div>
      </div>

      <div className="relative grid gap-5 md:grid-cols-3 md:gap-8">
        {REGION_IDS.map((id) => {
          const region = REGIONS[id];
          const styles = REGION_STYLES[id];
          const hubs = locationsInRegion(id);
          const campuses = hubs.filter((h) => LOCATIONS[h].kind === "campus");
          const others = hubs.filter((h) => LOCATIONS[h].kind !== "campus");
          const count = rideCounts[id];

          return (
            <Link
              key={id}
              href={`/rides?region=${id}`}
              className={cn(
                "group relative flex flex-col gap-4 rounded-2xl border-t-4 bg-card p-5 shadow-sm ring-1 ring-foreground/10 transition",
                "hover:-translate-y-1 hover:shadow-lg hover:ring-2",
                styles.border,
                styles.ring,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={cn("text-[11px] font-bold tracking-[0.16em] uppercase", styles.text)}>
                    {region.states}
                  </p>
                  <h3 className="mt-1 font-heading text-2xl font-extrabold tracking-tight">
                    {region.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{region.tagline}</p>
                </div>
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", styles.soft)}>
                  <ArrowRight className={cn("size-4 transition group-hover:translate-x-0.5", styles.text)} />
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {campuses.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium"
                  >
                    {LOCATIONS[h].short}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                + {others.map((h) => LOCATIONS[h].short).join(", ")}
              </p>

              <p className="mt-auto pt-2 text-sm font-medium">
                {count > 0 ? (
                  <>
                    <span className={cn("inline-block size-2 rounded-full align-middle", styles.dot)} />{" "}
                    {count} upcoming {count === 1 ? "ride" : "rides"}
                  </>
                ) : (
                  <span className="text-muted-foreground">No rides yet — be the first to post</span>
                )}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
