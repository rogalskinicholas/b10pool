import { Badge } from "@/components/ui/badge";
import type { Enums } from "@/types/database";

export function RideStatusBadge({
  status,
  seatsAvailable,
}: {
  status: Enums<"ride_status">;
  seatsAvailable: number;
}) {
  if (status === "cancelled") return <Badge variant="destructive">Cancelled</Badge>;
  if (status === "full" || seatsAvailable === 0) return <Badge variant="secondary">Full</Badge>;
  return (
    <Badge variant="outline" className="border-brand bg-brand/30 text-brand-foreground">
      {seatsAvailable} {seatsAvailable === 1 ? "seat" : "seats"} left
    </Badge>
  );
}
