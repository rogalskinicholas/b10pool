import { Constants, type Enums } from "@/types/database";

export type ContactMethod = Enums<"contact_method">;

type ContactInfo = {
  label: string;
  placeholder: string;
  hint: string;
  cta: string;
};

export const CONTACT_METHODS: Record<ContactMethod, ContactInfo> = {
  sms: {
    label: "Text (SMS)",
    placeholder: "(555) 555-0123",
    hint: "Riders will open a text to this number.",
    cta: "Text driver",
  },
  whatsapp: {
    label: "WhatsApp",
    placeholder: "(555) 555-0123",
    hint: "Riders will open a WhatsApp chat to this number.",
    cta: "Message on WhatsApp",
  },
  instagram: {
    label: "Instagram",
    placeholder: "@yourhandle",
    hint: "Riders will open your Instagram profile.",
    cta: "DM on Instagram",
  },
  groupme: {
    label: "GroupMe",
    placeholder: "https://groupme.com/join_group/...",
    hint: "Paste a GroupMe join link (or your GroupMe name).",
    cta: "Open GroupMe",
  },
};

export const CONTACT_METHOD_IDS = Constants.public.Enums.contact_method;

export function isContactMethod(value: unknown): value is ContactMethod {
  return (
    typeof value === "string" &&
    (CONTACT_METHOD_IDS as readonly string[]).includes(value)
  );
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function toE164Digits(value: string): string {
  const digits = digitsOnly(value);
  return digits.length === 10 ? `1${digits}` : digits;
}

export function contactHref(method: ContactMethod, value: string): string | null {
  const trimmed = value.trim();
  switch (method) {
    case "sms":
      return `sms:+${toE164Digits(trimmed)}`;
    case "whatsapp":
      return `https://wa.me/${toE164Digits(trimmed)}`;
    case "instagram":
      return `https://instagram.com/${trimmed.replace(/^@/, "")}`;
    case "groupme":
      return /^https?:\/\//i.test(trimmed) ? trimmed : null;
  }
}

export function contactDisplay(method: ContactMethod, value: string): string {
  const trimmed = value.trim();
  if (method === "instagram") return `@${trimmed.replace(/^@/, "")}`;
  return trimmed;
}
