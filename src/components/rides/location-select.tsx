"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCATIONS, LOCATION_IDS, type Location } from "@/lib/locations";
import { cn } from "@/lib/utils";

const GROUPS = [
  { label: "Campuses", kind: "campus" },
  { label: "Cities", kind: "city" },
  { label: "Airports", kind: "airport" },
] as const;

const LOCATION_ITEMS = LOCATION_IDS.map((id) => ({
  value: id,
  label: LOCATIONS[id].label,
}));

type Props = {
  name: string;
  id?: string;
  defaultValue?: Location;
  placeholder?: string;
  anyLabel?: string;
  invalid?: boolean;
  className?: string;
};

export function LocationSelect({
  name,
  id,
  defaultValue,
  placeholder = "Select a location",
  anyLabel,
  invalid,
  className,
}: Props) {
  const items = anyLabel
    ? [{ value: "", label: anyLabel }, ...LOCATION_ITEMS]
    : LOCATION_ITEMS;
  const initial: string | null = defaultValue ?? (anyLabel ? "" : null);

  return (
    <Select name={name} items={items} defaultValue={initial}>
      <SelectTrigger id={id} className={cn("w-full", className)} aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {anyLabel && <SelectItem value="">{anyLabel}</SelectItem>}
        {GROUPS.map((group) => (
          <SelectGroup key={group.kind}>
            <SelectLabel>{group.label}</SelectLabel>
            {LOCATION_IDS.filter((loc) => LOCATIONS[loc].kind === group.kind).map(
              (loc) => (
                <SelectItem key={loc} value={loc}>
                  {LOCATIONS[loc].label}
                </SelectItem>
              ),
            )}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
