import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./server";
import type { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;

export type Viewer = {
  user: User;
  profile: Profile;
  school: { name: string; is_active: boolean } | null;
  // True only while the viewer's school is active; gates full names, contact info, and posting.
  verified: boolean;
};

export const getViewer = cache(async (): Promise<Viewer | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*, school:schools(name, is_active)")
    .eq("id", user.id)
    .maybeSingle();
  if (!data) return null;

  const { school, ...profile } = data;
  return { user, profile, school, verified: school?.is_active ?? false };
});

export async function requireViewer(next?: string): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
  return viewer;
}

export async function requireVerifiedViewer(next?: string): Promise<Viewer> {
  const viewer = await requireViewer(next);
  if (!viewer.verified) redirect("/rides");
  return viewer;
}
