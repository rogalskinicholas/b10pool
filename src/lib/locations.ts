import { Constants, type Enums } from "@/types/database";

export type Location = Enums<"location">;
export type Region = "west" | "midwest" | "east";
export type LocationKind = "campus" | "city" | "airport";

type RegionInfo = {
  label: string;
  tagline: string;
  states: string;
};

export const REGIONS: Record<Region, RegionInfo> = {
  west: {
    label: "West",
    tagline: "Pacific campuses, LA to Seattle.",
    states: "WA OR CA",
  },
  midwest: {
    label: "Midwest",
    tagline: "The heartland — where B10 Pool started.",
    states: "IN IL MI OH WI MN IA NE",
  },
  east: {
    label: "East",
    tagline: "Happy Valley to the Hudson.",
    states: "PA MD NJ",
  },
};

export const REGION_IDS = ["west", "midwest", "east"] as const satisfies readonly Region[];

type LocationInfo = {
  label: string;
  short: string;
  city: string;
  kind: LocationKind;
  region: Region;
  timeZone: string;
};

const LA = "America/Los_Angeles";
const CHI = "America/Chicago";
const IND = "America/Indiana/Indianapolis";
const DET = "America/Detroit";
const NY = "America/New_York";

export const LOCATIONS: Record<Location, LocationInfo> = {
  // West
  uw: { label: "University of Washington", short: "UW", city: "Seattle, WA", kind: "campus", region: "west", timeZone: LA },
  oregon: { label: "University of Oregon", short: "Oregon", city: "Eugene, OR", kind: "campus", region: "west", timeZone: LA },
  ucla: { label: "UCLA", short: "UCLA", city: "Los Angeles, CA", kind: "campus", region: "west", timeZone: LA },
  usc: { label: "USC", short: "USC", city: "Los Angeles, CA", kind: "campus", region: "west", timeZone: LA },
  sea: { label: "Seattle–Tacoma Airport (SEA)", short: "SEA", city: "Seattle, WA", kind: "airport", region: "west", timeZone: LA },
  pdx: { label: "Portland Airport (PDX)", short: "PDX", city: "Portland, OR", kind: "airport", region: "west", timeZone: LA },
  lax: { label: "Los Angeles Airport (LAX)", short: "LAX", city: "Los Angeles, CA", kind: "airport", region: "west", timeZone: LA },

  // Midwest
  purdue: { label: "Purdue University", short: "Purdue", city: "West Lafayette, IN", kind: "campus", region: "midwest", timeZone: IND },
  uiuc: { label: "UIUC", short: "UIUC", city: "Urbana-Champaign, IL", kind: "campus", region: "midwest", timeZone: CHI },
  iu: { label: "Indiana University", short: "IU", city: "Bloomington, IN", kind: "campus", region: "midwest", timeZone: IND },
  northwestern: { label: "Northwestern", short: "Northwestern", city: "Evanston, IL", kind: "campus", region: "midwest", timeZone: CHI },
  michigan: { label: "University of Michigan", short: "Michigan", city: "Ann Arbor, MI", kind: "campus", region: "midwest", timeZone: DET },
  msu: { label: "Michigan State", short: "Mich. State", city: "East Lansing, MI", kind: "campus", region: "midwest", timeZone: DET },
  ohio_state: { label: "Ohio State", short: "Ohio State", city: "Columbus, OH", kind: "campus", region: "midwest", timeZone: NY },
  wisconsin: { label: "University of Wisconsin", short: "Wisconsin", city: "Madison, WI", kind: "campus", region: "midwest", timeZone: CHI },
  minnesota: { label: "University of Minnesota", short: "Minnesota", city: "Minneapolis, MN", kind: "campus", region: "midwest", timeZone: CHI },
  iowa: { label: "University of Iowa", short: "Iowa", city: "Iowa City, IA", kind: "campus", region: "midwest", timeZone: CHI },
  nebraska: { label: "University of Nebraska", short: "Nebraska", city: "Lincoln, NE", kind: "campus", region: "midwest", timeZone: CHI },
  chicago_downtown: { label: "Chicago (Downtown / Loop)", short: "Chicago", city: "Chicago, IL", kind: "city", region: "midwest", timeZone: CHI },
  indy_downtown: { label: "Indianapolis (Downtown)", short: "Indy", city: "Indianapolis, IN", kind: "city", region: "midwest", timeZone: IND },
  chicago_ord: { label: "Chicago O'Hare (ORD)", short: "ORD", city: "Chicago, IL", kind: "airport", region: "midwest", timeZone: CHI },
  chicago_mdw: { label: "Chicago Midway (MDW)", short: "MDW", city: "Chicago, IL", kind: "airport", region: "midwest", timeZone: CHI },
  indy_ind: { label: "Indianapolis Airport (IND)", short: "IND", city: "Indianapolis, IN", kind: "airport", region: "midwest", timeZone: IND },
  dtw: { label: "Detroit Airport (DTW)", short: "DTW", city: "Detroit, MI", kind: "airport", region: "midwest", timeZone: DET },
  msp: { label: "Minneapolis–St. Paul Airport (MSP)", short: "MSP", city: "Minneapolis, MN", kind: "airport", region: "midwest", timeZone: CHI },

  // East
  penn_state: { label: "Penn State", short: "Penn State", city: "State College, PA", kind: "campus", region: "east", timeZone: NY },
  maryland: { label: "University of Maryland", short: "Maryland", city: "College Park, MD", kind: "campus", region: "east", timeZone: NY },
  rutgers: { label: "Rutgers", short: "Rutgers", city: "New Brunswick, NJ", kind: "campus", region: "east", timeZone: NY },
  nyc: { label: "New York City (Manhattan)", short: "NYC", city: "New York, NY", kind: "city", region: "east", timeZone: NY },
  dc_downtown: { label: "Washington, DC (Downtown)", short: "DC", city: "Washington, DC", kind: "city", region: "east", timeZone: NY },
  ewr: { label: "Newark Airport (EWR)", short: "EWR", city: "Newark, NJ", kind: "airport", region: "east", timeZone: NY },
  phl: { label: "Philadelphia Airport (PHL)", short: "PHL", city: "Philadelphia, PA", kind: "airport", region: "east", timeZone: NY },
  bwi: { label: "Baltimore/Washington Airport (BWI)", short: "BWI", city: "Baltimore, MD", kind: "airport", region: "east", timeZone: NY },
};

// Display order: grouped by region (West → East), campuses first within each region.
const KIND_ORDER: Record<LocationKind, number> = { campus: 0, city: 1, airport: 2 };
export const LOCATION_IDS = [...Constants.public.Enums.location].sort((a, b) => {
  const ra = REGION_IDS.indexOf(LOCATIONS[a].region);
  const rb = REGION_IDS.indexOf(LOCATIONS[b].region);
  if (ra !== rb) return ra - rb;
  const ka = KIND_ORDER[LOCATIONS[a].kind];
  const kb = KIND_ORDER[LOCATIONS[b].kind];
  if (ka !== kb) return ka - kb;
  return LOCATIONS[a].label.localeCompare(LOCATIONS[b].label);
});

export function isLocation(value: unknown): value is Location {
  return (
    typeof value === "string" &&
    (Constants.public.Enums.location as readonly string[]).includes(value)
  );
}

export function isRegion(value: unknown): value is Region {
  return typeof value === "string" && (REGION_IDS as readonly string[]).includes(value);
}

export function locationsInRegion(region: Region): Location[] {
  return LOCATION_IDS.filter((id) => LOCATIONS[id].region === region);
}

export function locationLabel(id: Location): string {
  return LOCATIONS[id].label;
}
