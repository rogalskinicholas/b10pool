import Link from "next/link";
import { REGIONS, REGION_IDS, type Region } from "@/lib/locations";
import { cn } from "@/lib/utils";
import { REGION_STYLES } from "./region-styles";

export function RegionTabs({ active }: { active?: Region }) {
  const tab = (href: string, label: string, isActive: boolean, region?: Region) => (
    <Link
      key={label}
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
        isActive
          ? "bg-ink text-background shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {region && (
        <span
          className={cn(
            "size-2 rounded-full",
            REGION_STYLES[region].dot,
            isActive && "ring-2 ring-background/60",
          )}
        />
      )}
      {label}
    </Link>
  );

  return (
    <nav
      aria-label="Region"
      className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border bg-background p-1"
    >
      {tab("/rides", "All regions", !active)}
      {REGION_IDS.map((id) => tab(`/rides?region=${id}`, REGIONS[id].label, active === id, id))}
    </nav>
  );
}
