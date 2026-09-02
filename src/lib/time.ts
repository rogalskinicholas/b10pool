import { fromZonedTime } from "date-fns-tz";
import type { Location } from "./locations";

export function timeZoneFor(location: Location): string {
  switch (location) {
    case "purdue":
    case "indy_downtown":
    case "indy_ind":
      return "America/Indiana/Indianapolis";
    default:
      return "America/Chicago";
  }
}

export function wallTimeToInstant(localDateTime: string, location: Location): Date {
  return fromZonedTime(localDateTime, timeZoneFor(location));
}

export function formatDeparture(iso: string, location: Location) {
  const timeZone = timeZoneFor(location);
  const date = new Date(iso);
  return {
    date: new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date),
  };
}

export function formatPrice(amount: number): string {
  if (amount === 0) return "Free";
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function todayInputValue(timeZone = "America/Chicago"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isDateInputValue(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
