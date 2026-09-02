import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const listActiveSchools = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select("id, name, email_domain, location")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
});

export function formatSchoolList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}
