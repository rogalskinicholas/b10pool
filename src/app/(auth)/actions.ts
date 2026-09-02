"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatSchoolList, listActiveSchools } from "@/lib/schools";
import {
  LOGIN_FIELDS,
  SIGNUP_FIELDS,
  fieldErrorsOf,
  formValues,
  loginSchema,
  safeNextPath,
  signupSchema,
  type ActionState,
} from "@/lib/validation";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formValues(formData, SIGNUP_FIELDS);
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values };
  }

  const schools = await listActiveSchools();
  const domain = parsed.data.email.split("@")[1];
  const school = schools.find((s) => s.email_domain === domain);
  if (!school) {
    return {
      values,
      fieldErrors: {
        email: [
          `B10Pool is currently open to ${formatSchoolList(schools.map((s) => s.name))} students. Use your school email.`,
        ],
      },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl()}/auth/confirm`,
      data: {
        full_name: parsed.data.full_name,
        grad_year: String(parsed.data.grad_year),
        phone: parsed.data.phone ?? "",
        instagram: parsed.data.instagram ?? "",
      },
    },
  });

  if (error) {
    return { error: error.message, values };
  }

  if (data.session) redirect("/rides");

  return { success: true, values };
}

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formValues(formData, LOGIN_FIELDS);
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error), values: { email: values.email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    const message =
      error.code === "email_not_confirmed"
        ? "Confirm your email first — check your inbox for the link."
        : "Invalid email or password.";
    return { error: message, values: { email: values.email } };
  }

  redirect(safeNextPath(formData.get("next")));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
