import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading font-semibold tracking-tight",
        className,
      )}
    >
      <span className="grid size-7 place-items-center rounded-md bg-brand text-[11px] font-bold text-brand-foreground">
        B10
      </span>
      <span>Pool</span>
    </span>
  );
}
