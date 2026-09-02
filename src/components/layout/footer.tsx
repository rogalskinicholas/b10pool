import Link from "next/link";
import { Container } from "./container";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t py-8 text-sm text-muted-foreground">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Logo className="text-foreground" />
          <p className="text-xs">
            Student-run carpooling. Not affiliated with the Big Ten Conference or
            any university. Ride at your own discretion.
          </p>
        </div>
        <nav className="flex gap-4 text-xs">
          <Link href="/rides" className="hover:text-foreground">
            Find a ride
          </Link>
          <Link href="/rides/new" className="hover:text-foreground">
            Post a ride
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
