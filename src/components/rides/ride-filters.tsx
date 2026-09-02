"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Location } from "@/lib/locations";
import { LocationSelect } from "./location-select";

export function RideFilters({
  origin,
  destination,
  date,
}: {
  origin?: Location;
  destination?: Location;
  date?: string;
}) {
  const hasFilters = Boolean(origin || destination || date);

  return (
    <form
      method="get"
      action="/rides"
      className="grid gap-3 rounded-xl border bg-muted/40 p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end"
    >
      <div className="space-y-1.5">
        <Label htmlFor="filter-origin">From</Label>
        <LocationSelect
          id="filter-origin"
          name="origin"
          defaultValue={origin}
          anyLabel="Anywhere"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filter-destination">To</Label>
        <LocationSelect
          id="filter-destination"
          name="destination"
          defaultValue={destination}
          anyLabel="Anywhere"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="filter-date">Date</Label>
        <Input id="filter-date" name="date" type="date" defaultValue={date} className="sm:w-40" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 sm:flex-none">
          <Search data-icon="inline-start" />
          Search
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="icon" aria-label="Clear filters" render={<Link href="/rides" />}>
            <X />
          </Button>
        )}
      </div>
    </form>
  );
}
