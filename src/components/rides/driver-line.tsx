import { UserRound } from "lucide-react";
import type { RideListItem } from "@/lib/rides/queries";
import { cn } from "@/lib/utils";

// Driver identity block: student icon, name (first initial for public viewers,
// full name for verified students), then school and class year underneath.
export function DriverLine({
  driver,
  size = "md",
  className,
}: {
  driver: RideListItem["driver"];
  size?: "md" | "lg";
  className?: string;
}) {
  const name = driver?.name ?? "Student";
  const meta = [driver?.school, driver?.gradYear ? `Class of ${driver.gradYear}` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary",
          size === "lg" ? "size-11" : "size-8",
        )}
      >
        <UserRound className={size === "lg" ? "size-5" : "size-4"} />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={cn("truncate font-semibold", size === "lg" ? "text-base" : "text-sm")}>
          {name}
        </span>
        {meta && (
          <span className={cn("truncate text-muted-foreground", size === "lg" ? "text-sm" : "text-xs")}>
            {meta}
          </span>
        )}
      </span>
    </div>
  );
}
