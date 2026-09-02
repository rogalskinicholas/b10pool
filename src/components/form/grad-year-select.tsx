"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const START_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 7 }, (_, i) => String(START_YEAR + i));
const ITEMS = YEARS.map((y) => ({ value: y, label: y }));

export function GradYearSelect({
  id,
  name,
  defaultValue,
  invalid,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  invalid?: boolean;
}) {
  return (
    <Select name={name} items={ITEMS} defaultValue={defaultValue || null}>
      <SelectTrigger id={id} className="w-full" aria-invalid={invalid}>
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
