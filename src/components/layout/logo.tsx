import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const lg = size === "lg";
  return (
    <span className={cn("inline-flex items-center", lg ? "gap-3" : "gap-2.5", className)}>
      <Image
        src="/brand/mark-light.png"
        alt=""
        width={754}
        height={619}
        priority
        className={cn("w-auto shrink-0", lg ? "h-14" : "h-9")}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading font-black tracking-tight text-ink",
            lg ? "text-2xl" : "text-[17px]",
          )}
        >
          B<span className="text-primary">10</span> <span className="text-primary">Pool</span>
        </span>
        <span
          className={cn(
            "mt-1 font-medium tracking-[0.16em] text-muted-foreground uppercase",
            lg ? "text-xs" : "text-[9.5px]",
          )}
        >
          A Carpooling Hub
        </span>
      </span>
    </span>
  );
}
