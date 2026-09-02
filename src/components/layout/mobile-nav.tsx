"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Car, LogOut, Menu, Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/app/(auth)/actions";
import { Logo } from "./logo";

export function MobileNav({ name }: { name: string | null }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        >
          <Menu />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>
              <Logo />
            </SheetTitle>
            {name && <p className="text-sm text-muted-foreground">Signed in as {name}</p>}
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-2">
            <NavLink href="/rides" onClick={close} icon={Search}>
              Find a ride
            </NavLink>
            <NavLink href="/rides/new" onClick={close} icon={Plus}>
              Post a ride
            </NavLink>
            {name ? (
              <>
                <Separator className="my-2" />
                <NavLink href="/dashboard" onClick={close} icon={Car}>
                  My rides
                </NavLink>
                <NavLink href="/profile" onClick={close} icon={User}>
                  Profile
                </NavLink>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="justify-start"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await signOut();
                    })
                  }
                >
                  <LogOut data-icon="inline-start" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Separator className="my-2" />
                <Button variant="outline" onClick={close} render={<Link href="/login" />}>
                  Log in
                </Button>
                <Button onClick={close} render={<Link href="/signup" />}>
                  Sign up
                </Button>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  onClick,
  children,
}: {
  href: "/rides" | "/rides/new" | "/dashboard" | "/profile";
  icon: typeof Search;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className="justify-start"
      onClick={onClick}
      render={<Link href={href} />}
    >
      <Icon data-icon="inline-start" />
      {children}
    </Button>
  );
}
