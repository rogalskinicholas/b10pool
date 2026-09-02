import Link from "next/link";
import { REGIONS, REGION_IDS } from "@/lib/locations";
import { Container } from "./container";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-10 text-sm text-muted-foreground">
      <Container className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-xs leading-relaxed">
            Student-run carpooling across the Big Ten footprint. B10 Pool is an
            independent project and is not affiliated with, endorsed by, or
            sponsored by the Big Ten Conference or any university. Ride at your
            own discretion.
          </p>
        </div>
        <nav className="space-y-2 text-xs">
          <p className="font-heading text-[11px] font-bold tracking-[0.14em] text-foreground uppercase">
            Rides
          </p>
          <Link href="/rides" className="block hover:text-foreground">
            Find a ride
          </Link>
          <Link href="/rides/new" className="block hover:text-foreground">
            Post a ride
          </Link>
          <Link href="/dashboard" className="block hover:text-foreground">
            My rides
          </Link>
        </nav>
        <nav className="space-y-2 text-xs">
          <p className="font-heading text-[11px] font-bold tracking-[0.14em] text-foreground uppercase">
            Regions
          </p>
          {REGION_IDS.map((id) => (
            <Link key={id} href={`/rides?region=${id}`} className="block hover:text-foreground">
              {REGIONS[id].label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
