import { ArrowRight } from "lucide-react";
import { LOCATIONS, type Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

export function RouteLabel({
  origin,
  destination,
  size = "md",
  className,
}: {
  origin: Location;
  destination: Location;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-semibold tracking-tight",
        size === "lg" ? "text-3xl sm:text-4xl" : "text-lg",
        className,
      )}
    >
      <span>{LOCATIONS[origin].short}</span>
      <ArrowRight
        className={cn("shrink-0 text-muted-foreground", size === "lg" ? "size-7" : "size-4")}
      />
      <span>{LOCATIONS[destination].short}</span>
    </span>
  );
}
