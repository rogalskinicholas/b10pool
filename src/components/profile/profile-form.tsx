"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormError } from "@/components/form/field";
import { GradYearSelect } from "@/components/form/grad-year-select";
import { updateProfile } from "@/app/profile/actions";
import type { Profile } from "@/lib/supabase/auth";
import type { ActionState } from "@/lib/validation";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateProfile, {});

  useEffect(() => {
    if (state.success) toast.success("Profile saved");
  }, [state]);

  const v = state.values;
  const errs = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      <FormError message={state.error} />
      <Field label="Full name" htmlFor="full_name" errors={errs.full_name}>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          defaultValue={v?.full_name ?? profile.full_name}
          aria-invalid={Boolean(errs.full_name)}
          required
        />
      </Field>
      <Field label="Graduation year" htmlFor="grad_year" errors={errs.grad_year}>
        <GradYearSelect
          id="grad_year"
          name="grad_year"
          defaultValue={v?.grad_year ?? (profile.grad_year ? String(profile.grad_year) : undefined)}
          invalid={Boolean(errs.grad_year)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone" errors={errs.phone}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 555-0123"
            defaultValue={v?.phone ?? profile.phone ?? ""}
          />
        </Field>
        <Field label="Instagram" htmlFor="instagram" errors={errs.instagram}>
          <Input
            id="instagram"
            name="instagram"
            placeholder="@handle"
            defaultValue={v?.instagram ?? profile.instagram ?? ""}
          />
        </Field>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
