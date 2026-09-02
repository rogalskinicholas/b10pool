import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { getUserWithProfile } from "@/lib/supabase/auth";
import { Container } from "./container";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

export async function Navbar() {
  const session = await getUserWithProfile();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" aria-label="B10Pool home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" render={<Link href="/rides" />}>
            Find a ride
          </Button>
          <Button variant="ghost" render={<Link href="/rides/new" />}>
            Post a ride
          </Button>
          {session ? (
            <UserMenu name={session.profile.full_name} email={session.profile.email} />
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/login" />}>
                Log in
              </Button>
              <Button render={<Link href="/signup" />}>Sign up</Button>
            </>
          )}
        </nav>

        <MobileNav name={session?.profile.full_name ?? null} />
      </Container>
    </header>
  );
}
