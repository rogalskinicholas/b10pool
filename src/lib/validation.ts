import { z } from "zod";
import { LOCATION_IDS } from "./locations";
import { CONTACT_METHOD_IDS } from "./contact";

export type ActionState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Record<string, string>;
  success?: boolean;
};

export function formValues(formData: FormData, keys: readonly string[]) {
  const values: Record<string, string> = {};
  for (const key of keys) values[key] = String(formData.get(key) ?? "").trim();
  return values;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v.length ? v : null));

const gradYear = z.coerce
  .number({ message: "Pick your graduation year" })
  .int()
  .min(2020, "Pick your graduation year")
  .max(2040, "Pick your graduation year");

export const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  grad_year: gradYear,
  phone: optionalText(30),
  instagram: optionalText(50),
});
export const SIGNUP_FIELDS = [
  "full_name",
  "email",
  "password",
  "grad_year",
  "phone",
  "instagram",
] as const;

export const loginSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password"),
});
export const LOGIN_FIELDS = ["email", "password"] as const;

export const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(80),
  grad_year: gradYear,
  phone: optionalText(30),
  instagram: optionalText(50),
});
export const PROFILE_FIELDS = [
  "full_name",
  "grad_year",
  "phone",
  "instagram",
] as const;

export const rideSchema = z
  .object({
    origin: z.enum(LOCATION_IDS, { message: "Pick where you're leaving from" }),
    destination: z.enum(LOCATION_IDS, { message: "Pick where you're headed" }),
    departs_at: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "Pick a departure date and time"),
    seats_total: z.coerce
      .number({ message: "How many seats?" })
      .int()
      .min(1, "At least 1 seat")
      .max(6, "At most 6 seats"),
    price_per_seat: z.coerce
      .number({ message: "Enter a price (0 for free)" })
      .min(0, "Price can't be negative")
      .max(999, "That seems too high"),
    notes: optionalText(500),
    contact_method: z.enum(CONTACT_METHOD_IDS, {
      message: "Pick how riders should reach you",
    }),
    contact_value: z
      .string()
      .trim()
      .min(2, "Add your number, handle, or link")
      .max(200),
  })
  .refine((d) => d.origin !== d.destination, {
    message: "Destination must be different from origin",
    path: ["destination"],
  });
export const RIDE_FIELDS = [
  "origin",
  "destination",
  "departs_at",
  "seats_total",
  "price_per_seat",
  "notes",
  "contact_method",
  "contact_value",
] as const;

export function fieldErrorsOf(error: z.ZodError): ActionState["fieldErrors"] {
  return z.flattenError(error).fieldErrors as ActionState["fieldErrors"];
}

export function safeNextPath(value: unknown, fallback = "/rides"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
