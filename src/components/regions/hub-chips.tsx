import Link from "next/link";
import { Building2, GraduationCap, Plane } from "lucide-react";
import { LOCATIONS, locationsInRegion, type Location, type Region } from "@/lib/locations";
import { cn } from "@/lib/utils";

const KIND_ICONS = { campus: GraduationCap, city: Building2, airport: Plane } as const;

export function HubChips({
  region,
  active,
}: {
  region: Region;
  active?: Location;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {locationsInRegion(region).map((id) => {
        const hub = LOCATIONS[id];
        const Icon = KIND_ICONS[hub.kind];
        const isActive = active === id;
        return (
          <Link
            key={id}
            href={isActive ? `/rides?region=${region}` : `/rides?region=${region}&hub=${id}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
              isActive
                ? "border-ink bg-ink text-background"
                : "bg-background hover:border-foreground/40 hover:bg-muted",
            )}
            title={hub.label}
          >
            <Icon className="size-3.5 opacity-70" />
            {hub.short}
          </Link>
        );
      })}
    </div>
  );
}
