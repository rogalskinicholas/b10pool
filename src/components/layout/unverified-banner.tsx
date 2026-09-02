import { ShieldAlert } from "lucide-react";
import { getViewer } from "@/lib/supabase/auth";
import { Container } from "./container";

export async function UnverifiedBanner() {
  const viewer = await getViewer();
  if (!viewer || viewer.verified) return null;

  return (
    <div className="border-b bg-muted/60 text-sm">
      <Container className="flex items-center gap-2 py-2 text-muted-foreground">
        <ShieldAlert className="size-4 shrink-0" />
        <span>
          {viewer.school?.name ?? "Your school"} isn&apos;t active on B10 Pool right now, so you can
          browse rides but can&apos;t see driver contact info or post rides.
        </span>
      </Container>
    </div>
  );
}
