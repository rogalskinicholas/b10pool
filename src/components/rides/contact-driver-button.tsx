import { AtSign, MessageCircle, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTACT_METHODS,
  contactDisplay,
  contactHref,
  type ContactMethod,
} from "@/lib/contact";

const ICONS = {
  sms: MessageSquare,
  whatsapp: MessageCircle,
  instagram: AtSign,
  groupme: Users,
} as const;

export function ContactDriverButton({
  method,
  value,
}: {
  method: ContactMethod;
  value: string;
}) {
  const href = contactHref(method, value);
  const Icon = ICONS[method];
  const info = CONTACT_METHODS[method];
  const external = method !== "sms";

  return (
    <div className="space-y-2">
      {href ? (
        <Button
          size="lg"
          className="w-full sm:w-auto"
          render={
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            />
          }
        >
          <Icon data-icon="inline-start" />
          {info.cta}
        </Button>
      ) : null}
      <p className="text-sm text-muted-foreground">
        {info.label}:{" "}
        <span className="select-all font-medium text-foreground">
          {contactDisplay(method, value)}
        </span>
      </p>
    </div>
  );
}
