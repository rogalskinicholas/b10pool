import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder shown where the ride's pickup & details would be. The real notes are never
// sent to public viewers (the column isn't granted to `anon`), so this is purely a visual
// stand-in that is blurred, unselectable, and hidden from assistive tech.
const PLACEHOLDER =
  "Meeting at the parking garage next to the union around 4pm. Room for one bag each — text me when you're on the way.";

export function BlurredNotes({
  cta,
  compact = false,
  className,
}: {
  cta: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <p
        aria-hidden
        className={cn(
          "pointer-events-none text-sm text-muted-foreground blur-[5px] select-none",
          compact ? "line-clamp-1" : "whitespace-pre-line",
        )}
      >
        {PLACEHOLDER}
      </p>
      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
        {cta}
      </div>
    </div>
  );
}

export function BlurredNotesLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-semibold shadow-sm">
      <Lock className="size-3 text-primary" />
      {children}
    </span>
  );
}
