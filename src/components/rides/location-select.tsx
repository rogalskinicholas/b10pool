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
import {
  LOCATIONS,
  LOCATION_IDS,
  REGIONS,
  REGION_IDS,
  type Location,
  type Region,
} from "@/lib/locations";
import { cn } from "@/lib/utils";

const KIND_LABEL = { campus: "Campus", city: "City", airport: "Airport" } as const;

type Props = {
  name: string;
  id?: string;
  defaultValue?: Location;
  placeholder?: string;
  anyLabel?: string;
  region?: Region;
  invalid?: boolean;
  className?: string;
};

export function LocationSelect({
  name,
  id,
  defaultValue,
  placeholder = "Select a location",
  anyLabel,
  region,
  invalid,
  className,
}: Props) {
  const regions = region ? [region] : REGION_IDS;
  const ids = LOCATION_IDS.filter((loc) => regions.includes(LOCATIONS[loc].region));
  const items = [
    ...(anyLabel ? [{ value: "", label: anyLabel }] : []),
    ...ids.map((loc) => ({ value: loc, label: LOCATIONS[loc].label })),
  ];
  const initial: string | null = defaultValue ?? (anyLabel ? "" : null);

  return (
    <Select name={name} items={items} defaultValue={initial}>
      <SelectTrigger id={id} className={cn("w-full", className)} aria-invalid={invalid}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {anyLabel && <SelectItem value="">{anyLabel}</SelectItem>}
        {regions.map((r) => (
          <SelectGroup key={r}>
            <SelectLabel>{REGIONS[r].label}</SelectLabel>
            {ids
              .filter((loc) => LOCATIONS[loc].region === r)
              .map((loc) => (
                <SelectItem key={loc} value={loc}>
                  <span className="flex w-full items-center justify-between gap-3">
                    {LOCATIONS[loc].label}
                    <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                      {KIND_LABEL[LOCATIONS[loc].kind]}
                    </span>
                  </span>
                </SelectItem>
              ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
