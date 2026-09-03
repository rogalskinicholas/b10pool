import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Settings2, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { BlurredNotes, BlurredNotesLabel } from "@/components/rides/blurred-notes";
import { ContactDriverButton } from "@/components/rides/contact-driver-button";
import { DriverLine } from "@/components/rides/driver-line";
import { RideStatusBadge } from "@/components/rides/ride-status-badge";
import { RouteLabel } from "@/components/rides/route-label";
import { LOCATIONS } from "@/lib/locations";
import { getRide, getRideContact } from "@/lib/rides/queries";
import { getViewer } from "@/lib/supabase/auth";
import { formatDeparture, formatPrice } from "@/lib/time";

export const metadata: Metadata = { title: "Ride details" };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function RidePage({ params }: PageProps<"/rides/[id]">) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const viewer = await getViewer();
  const verified = viewer?.verified ?? false;
  const ride = await getRide(id, verified);
  if (!ride) notFound();

  const contact = verified ? await getRideContact(id) : null;
  const isOwner = viewer?.user.id === ride.driver_id;
  const { date, time } = formatDeparture(ride.departs_at, ride.origin);
  const loginHref = `/login?next=/rides/${ride.id}`;

  return (
    <Container className="max-w-2xl space-y-8 py-8">
      <Link
        href="/rides"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All rides
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <RideStatusBadge status={ride.status} seatsAvailable={ride.seats_available} />
        </div>
        <RouteLabel origin={ride.origin} destination={ride.destination} size="lg" />
        <p className="text-sm text-muted-foreground">
          {LOCATIONS[ride.origin].city} → {LOCATIONS[ride.destination].city}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-xl border p-4 sm:grid-cols-4">
        <Detail icon={CalendarDays} label="Date" value={date} />
        <Detail icon={Clock} label="Departs" value={time} />
        <Detail
          icon={Users}
          label="Seats left"
          value={`${ride.seats_available} of ${ride.seats_total}`}
        />
        <Detail icon={Wallet} label="Per seat" value={formatPrice(ride.price_per_seat)} />
      </dl>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Driver</h2>
        <DriverLine driver={ride.driver} size="lg" />
      </div>

      {ride.redacted ? (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Pickup &amp; details</h2>
          <BlurredNotes
            className="rounded-xl border p-4"
            cta={
              viewer ? (
                <BlurredNotesLabel>Only shown to students from active B10Pool schools</BlurredNotesLabel>
              ) : (
                <Link href={loginHref} className="rounded-full outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50">
                  <BlurredNotesLabel>Sign in to see pickup details</BlurredNotesLabel>
                </Link>
              )
            }
          />
        </div>
      ) : ride.notes ? (
        <div className="space-y-1">
          <h2 className="text-sm font-medium text-muted-foreground">Pickup &amp; details</h2>
          <p className="whitespace-pre-line text-sm">{ride.notes}</p>
        </div>
      ) : null}

      <div className="rounded-xl border bg-muted/40 p-5">
        {ride.status === "cancelled" ? (
          <p className="text-sm text-muted-foreground">This ride was cancelled by the driver.</p>
        ) : isOwner ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">This is your ride.</p>
            <Button variant="outline" render={<Link href="/dashboard" />}>
              <Settings2 data-icon="inline-start" />
              Manage in My rides
            </Button>
          </div>
        ) : viewer && !verified ? (
          <p className="text-sm text-muted-foreground">
            Contact info is only shown to students from active B10Pool schools.
          </p>
        ) : contact ? (
          <div className="space-y-3">
            {ride.status === "full" && (
              <p className="text-sm text-muted-foreground">
                This ride is marked full, but you can still reach out in case a seat opens up.
              </p>
            )}
            <ContactDriverButton method={contact.contact_method} value={contact.contact_value} />
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Sign in with your school email to see the driver&apos;s full name, pickup details,
              and contact info.
            </p>
            <Button render={<Link href={loginHref} />}>
              Sign in to contact
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
