import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProfileForm } from "@/components/profile/profile-form";
import { listActiveSchools } from "@/lib/schools";
import { requireUserWithProfile } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [{ profile }, schools] = await Promise.all([
    requireUserWithProfile("/profile"),
    listActiveSchools(),
  ]);
  const school = schools.find((s) => s.id === profile.school_id);

  return (
    <Container className="max-w-lg space-y-6 py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your contact info is prefilled when you post a ride. It&apos;s only shown on rides you post.
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-4 rounded-xl border bg-muted/40 p-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Email</dt>
          <dd className="mt-1 truncate font-medium">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">School</dt>
          <dd className="mt-1 font-medium">{school?.name ?? profile.school_id}</dd>
        </div>
      </dl>
      <ProfileForm profile={profile} />
    </Container>
  );
}
