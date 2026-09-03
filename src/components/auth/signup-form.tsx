"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FormError } from "@/components/form/field";
import { GradYearSelect } from "@/components/form/grad-year-select";
import { signUp } from "@/app/(auth)/actions";
import type { ActionState } from "@/lib/validation";

export function SignupForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signUp, {});

  if (state.success) {
    return (
      <div className="space-y-3 rounded-xl border bg-muted/40 p-5 text-sm">
        <MailCheck className="size-6 text-brand-foreground" />
        <p className="font-medium">Check your inbox</p>
        <p className="text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{state.values?.email}</span>.
          Click it to activate your account, then log in.
        </p>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t get it? Check spam, or wait a minute and try again.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <FormError message={state.error} />
      <Field label="Full name" htmlFor="full_name" errors={state.fieldErrors?.full_name}>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          placeholder="First and last name"
          defaultValue={state.values?.full_name}
          aria-invalid={Boolean(state.fieldErrors?.full_name)}
          required
        />
      </Field>
      <Field
        label="School email"
        htmlFor="email"
        errors={state.fieldErrors?.email}
        hint="Must be your .edu address."
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          defaultValue={state.values?.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          required
        />
      </Field>
      <Field label="Password" htmlFor="password" errors={state.fieldErrors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          aria-invalid={Boolean(state.fieldErrors?.password)}
          required
        />
      </Field>
      <Field label="Graduation year" htmlFor="grad_year" errors={state.fieldErrors?.grad_year}>
        <GradYearSelect
          id="grad_year"
          name="grad_year"
          defaultValue={state.values?.grad_year}
          invalid={Boolean(state.fieldErrors?.grad_year)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Phone (optional)"
          htmlFor="phone"
          errors={state.fieldErrors?.phone}
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 555-0123"
            defaultValue={state.values?.phone}
          />
        </Field>
        <Field
          label="Instagram (optional)"
          htmlFor="instagram"
          errors={state.fieldErrors?.instagram}
        >
          <Input
            id="instagram"
            name="instagram"
            placeholder="@handle"
            defaultValue={state.values?.instagram}
          />
        </Field>
      </div>
      <p className="text-xs text-muted-foreground">
        Contact info is only shown on rides you post, to signed-in students.
      </p>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
