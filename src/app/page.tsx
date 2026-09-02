import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Plane,
  Search,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { RideCard } from "@/components/rides/ride-card";
import { listRides } from "@/lib/rides/queries";
import { LOCATIONS, LOCATION_IDS } from "@/lib/locations";
import { formatSchoolList, listActiveSchools } from "@/lib/schools";

const HUB_ICONS = {
  campus: GraduationCap,
  city: Building2,
  airport: Plane,
} as const;

export default async function HomePage() {
  const [rides, schools] = await Promise.all([
    listRides({ limit: 4 }),
    listActiveSchools(),
  ]);
  const schoolNames = formatSchoolList(schools.map((s) => s.name));

  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="border-b bg-muted/40">
        <Container className="flex flex-col items-start gap-6 py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand-foreground" />
            Verified .edu students only
          </span>
          <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Big Ten rides, <span className="text-brand-foreground underline decoration-brand decoration-4 underline-offset-4">shared</span>.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Skip the $120 Uber and the six-hour bus. Find or offer a seat
            between campus, Chicago, Indianapolis, and the airports — with
            students from {schoolNames}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/rides" />}>
              <Search data-icon="inline-start" />
              Find a ride
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/rides/new" />}>
              Post a ride
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                Upcoming trips
              </h2>
              <p className="text-sm text-muted-foreground">
                The next rides leaving soon.
              </p>
            </div>
            <Button variant="ghost" render={<Link href="/rides" />}>
              See all
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          {rides.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No rides posted yet. Be the first —{" "}
              <Link href="/rides/new" className="font-medium text-foreground underline underline-offset-4">
                post a ride
              </Link>
              .
            </div>
          )}
        </Container>
      </section>

      <section>
        <Container>
          <h2 className="mb-6 font-heading text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Sign up with your .edu",
                body: "Only verified students from participating schools can post or contact drivers.",
              },
              {
                icon: Search,
                title: "Find or post a ride",
                body: "Filter by origin, destination, and date. Drivers set seats and a per-seat gas split.",
              },
              {
                icon: Wallet,
                title: "Coordinate directly",
                body: "Text, WhatsApp, Instagram, or GroupMe the driver. Split costs however you like.",
              },
            ].map((step) => (
              <div key={step.title} className="rounded-xl border p-5">
                <step.icon className="mb-3 size-5 text-brand-foreground" />
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <h2 className="mb-2 font-heading text-2xl font-semibold tracking-tight">
            Where we go
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            More campuses are on the way. Rides run between any two hubs.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LOCATION_IDS.map((id) => {
              const hub = LOCATIONS[id];
              const Icon = HUB_ICONS[hub.kind];
              return (
                <Link
                  key={id}
                  href={`/rides?destination=${id}`}
                  className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted/50"
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{hub.label}</div>
                    <div className="truncate text-xs text-muted-foreground">{hub.city}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
