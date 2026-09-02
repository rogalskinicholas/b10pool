import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { RideForm } from "@/components/rides/ride-form";
import { requireVerifiedViewer } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Post a ride" };

export default async function NewRidePage() {
  const { profile } = await requireVerifiedViewer("/rides/new");

  return (
    <Container className="max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Post a ride
        </h1>
        <p className="text-sm text-muted-foreground">
          Share where you&apos;re headed and how many seats you have. Riders
          will contact you directly.
        </p>
      </div>
      <RideForm
        defaultContacts={{
          sms: profile.phone ?? "",
          whatsapp: profile.phone ?? "",
          instagram: profile.instagram ?? "",
          groupme: "",
        }}
      />
    </Container>
  );
}
