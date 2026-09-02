"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/lib/supabase/auth";
import {
  PROFILE_FIELDS,
  fieldErrorsOf,
  formValues,
  profileSchema,
  type ActionState,
} from "@/lib/validation";

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getViewer();
  if (!session) redirect("/login?next=/profile");

  const values = formValues(formData, PROFILE_FIELDS);
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", session.user.id);

  if (error) return { error: "Couldn't save your profile.", values };

  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { success: true, values };
}
