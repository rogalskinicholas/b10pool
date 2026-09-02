import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;

export const getUserWithProfile = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return null;

  return { user, profile };
});

export async function requireUserWithProfile(next?: string) {
  const session = await getUserWithProfile();
  if (!session) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
  return session;
}
