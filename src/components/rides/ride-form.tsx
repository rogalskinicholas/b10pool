"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormError } from "@/components/form/field";
import { createRide } from "@/app/rides/actions";
import {
  CONTACT_METHODS,
  CONTACT_METHOD_IDS,
  isContactMethod,
  type ContactMethod,
} from "@/lib/contact";
import { isLocation } from "@/lib/locations";
import type { ActionState } from "@/lib/validation";
import { LocationSelect } from "./location-select";

const SEAT_ITEMS = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: String(n),
  label: `${n} ${n === 1 ? "seat" : "seats"}`,
}));

const CONTACT_ITEMS = CONTACT_METHOD_IDS.map((id) => ({
  value: id,
  label: CONTACT_METHODS[id].label,
}));

// The browser's "now" for the datetime-local min; undefined during SSR to avoid a hydration mismatch.
let cachedMinDateTime: string | undefined;
const subscribeNoop = () => () => {};
const getMinDateTime = () =>
  (cachedMinDateTime ??= format(new Date(), "yyyy-MM-dd'T'HH:mm"));
const getServerMinDateTime = () => undefined;

export function RideForm({
  defaultContacts,
}: {
  defaultContacts: Record<ContactMethod, string>;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createRide, {});
  const initialMethod: ContactMethod = isContactMethod(state.values?.contact_method)
    ? state.values.contact_method
    : defaultContacts.sms
      ? "sms"
      : defaultContacts.instagram
        ? "instagram"
        : "sms";
  const [method, setMethod] = useState<ContactMethod>(initialMethod);
  const [contactValue, setContactValue] = useState(
    state.values?.contact_value ?? defaultContacts[initialMethod],
  );
  const minDateTime = useSyncExternalStore(
    subscribeNoop,
    getMinDateTime,
    getServerMinDateTime,
  );

  const v = state.values ?? {};
  const errs = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      <FormError message={state.error} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Leaving from" htmlFor="origin" errors={errs.origin}>
          <LocationSelect
            id="origin"
            name="origin"
            defaultValue={isLocation(v.origin) ? v.origin : undefined}
            placeholder="Pick an origin"
            invalid={Boolean(errs.origin)}
          />
        </Field>
        <Field label="Going to" htmlFor="destination" errors={errs.destination}>
          <LocationSelect
            id="destination"
            name="destination"
            defaultValue={isLocation(v.destination) ? v.destination : undefined}
            placeholder="Pick a destination"
            invalid={Boolean(errs.destination)}
          />
        </Field>
      </div>

      <Field
        label="Departure"
        htmlFor="departs_at"
        errors={errs.departs_at}
        hint="Local time at your departure spot."
      >
        <Input
          id="departs_at"
          name="departs_at"
          type="datetime-local"
          min={minDateTime}
          defaultValue={v.departs_at}
          aria-invalid={Boolean(errs.departs_at)}
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seats available" htmlFor="seats_total" errors={errs.seats_total}>
          <Select name="seats_total" items={SEAT_ITEMS} defaultValue={v.seats_total || "3"}>
            <SelectTrigger id="seats_total" className="w-full" aria-invalid={Boolean(errs.seats_total)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEAT_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Price per seat"
          htmlFor="price_per_seat"
          errors={errs.price_per_seat}
          hint="A gas split, not a fare. Enter 0 for free."
        >
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="price_per_seat"
              name="price_per_seat"
              type="number"
              inputMode="decimal"
              min={0}
              max={999}
              step={1}
              placeholder="20"
              className="pl-6"
              defaultValue={v.price_per_seat}
              aria-invalid={Boolean(errs.price_per_seat)}
              required
            />
          </div>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="How riders reach you" htmlFor="contact_method" errors={errs.contact_method}>
          <Select
            name="contact_method"
            items={CONTACT_ITEMS}
            value={method}
            onValueChange={(next) => {
              if (!isContactMethod(next)) return;
              setMethod(next);
              setContactValue(defaultContacts[next]);
            }}
          >
            <SelectTrigger id="contact_method" className="w-full" aria-invalid={Boolean(errs.contact_method)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label={CONTACT_METHODS[method].label}
          htmlFor="contact_value"
          errors={errs.contact_value}
          hint={CONTACT_METHODS[method].hint}
        >
          <Input
            id="contact_value"
            name="contact_value"
            type={method === "sms" || method === "whatsapp" ? "tel" : "text"}
            placeholder={CONTACT_METHODS[method].placeholder}
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            aria-invalid={Boolean(errs.contact_value)}
            required
          />
        </Field>
      </div>

      <Field
        label="Pickup & details (optional)"
        htmlFor="notes"
        errors={errs.notes}
        hint="Where you'll meet, luggage room, stops, music, etc."
      >
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={500}
          placeholder="Meeting spot, luggage room, and any drop-off flexibility."
          defaultValue={v.notes}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? "Posting…" : "Post ride"}
      </Button>
    </form>
  );
}
