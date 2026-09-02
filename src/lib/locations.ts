import { Constants, type Enums } from "@/types/database";

export type Location = Enums<"location">;

type LocationInfo = {
  label: string;
  short: string;
  city: string;
  kind: "campus" | "city" | "airport";
};

export const LOCATIONS: Record<Location, LocationInfo> = {
  purdue: {
    label: "Purdue University",
    short: "Purdue",
    city: "West Lafayette, IN",
    kind: "campus",
  },
  uiuc: {
    label: "UIUC",
    short: "UIUC",
    city: "Urbana-Champaign, IL",
    kind: "campus",
  },
  chicago_downtown: {
    label: "Chicago (Downtown / Loop)",
    short: "Chicago",
    city: "Chicago, IL",
    kind: "city",
  },
  chicago_ord: {
    label: "Chicago O'Hare (ORD)",
    short: "ORD",
    city: "Chicago, IL",
    kind: "airport",
  },
  chicago_mdw: {
    label: "Chicago Midway (MDW)",
    short: "MDW",
    city: "Chicago, IL",
    kind: "airport",
  },
  indy_downtown: {
    label: "Indianapolis (Downtown)",
    short: "Indy",
    city: "Indianapolis, IN",
    kind: "city",
  },
  indy_ind: {
    label: "Indianapolis Airport (IND)",
    short: "IND",
    city: "Indianapolis, IN",
    kind: "airport",
  },
};

export const LOCATION_IDS = Constants.public.Enums.location;

export function isLocation(value: unknown): value is Location {
  return (
    typeof value === "string" &&
    (LOCATION_IDS as readonly string[]).includes(value)
  );
}

export function locationLabel(id: Location): string {
  return LOCATIONS[id].label;
}
