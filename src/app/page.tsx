import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, Search, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { RegionCards } from "@/components/regions/region-cards";
import { RideCard } from "@/components/rides/ride-card";
import { LOCATIONS, type Region } from "@/lib/locations";
import { listRides } from "@/lib/rides/queries";
import { formatSchoolList, listActiveSchools } from "@/lib/schools";
import { getViewer } from "@/lib/supabase/auth";

export default async function HomePage() {
  const viewer = await getViewer();
  const [rides, schools] = await Promise.all([
    listRides({ limit: 200 }, viewer?.verified ?? false),
    listActiveSchools(),
  ]);
  const schoolNames = formatSchoolList(schools.map((s) => s.name));

  const rideCounts: Record<Region, number> = { west: 0, midwest: 0, east: 0 };
  for (const ride of rides) {
    const regions = new Set([LOCATIONS[ride.origin].region, LOCATIONS[ride.destination].region]);
    for (const r of regions) rideCounts[r] += 1;
  }

  return (
    <div className="flex flex-col gap-20 pb-24">
      <section className="relative overflow-hidden border-b bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)/14%,_transparent_55%)]">
        <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Verified .edu students only
            </span>
            <h1 className="max-w-xl font-heading text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Drive the conference.
              <br />
              <span className="text-primary">Split the gas.</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              The Big Ten carpooling hub. Find a seat or fill your car between
              campuses, cities, and airports — West, Midwest, and East — with
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
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <Image
              src="/brand/mark-light.png"
              alt="B10 Pool — a globe of roads connecting Big Ten campuses"
              width={754}
              height={619}
              priority
              className="animate-float h-auto w-full drop-shadow-[0_24px_40px_rgba(16,152,208,0.25)]"
            />
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] text-primary uppercase">
                Pick your region
              </p>
              <h2 className="mt-1 font-heading text-3xl font-extrabold tracking-tight">
                Three regions, one road
              </h2>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Rides run between any two hubs. Start with your region, then narrow
              to a campus, city, or airport.
            </p>
          </div>
          <RegionCards rideCounts={rideCounts} />
        </Container>
      </section>

      <section>
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight">Leaving soon</h2>
              <p className="text-sm text-muted-foreground">The next rides across the conference.</p>
            </div>
            <Button variant="ghost" render={<Link href="/rides" />}>
              See all
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          {rides.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {rides.slice(0, 4).map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
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
          <h2 className="mb-6 font-heading text-2xl font-extrabold tracking-tight">How it works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Sign up with your .edu",
                body: "Only verified students from participating schools see full names and contact info.",
              },
              {
                icon: Search,
                title: "Find or post a ride",
                body: "Browse by region, hub, and date. Drivers set seats and a per-seat gas split.",
              },
              {
                icon: Wallet,
                title: "Coordinate directly",
                body: "Text, WhatsApp, Instagram, or GroupMe the driver. Split costs however you like.",
              },
            ].map((step, i) => (
              <div key={step.title} className="rounded-2xl border bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-primary/10">
                    <step.icon className="size-4 text-primary" />
                  </span>
                  <span className="font-heading text-xs font-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="font-heading font-bold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
