import type { Region } from "@/lib/locations";

// Tailwind needs literal class names, so each region's classes are spelled out here.
export const REGION_STYLES: Record<
  Region,
  { text: string; bg: string; soft: string; border: string; ring: string; dot: string }
> = {
  west: {
    text: "text-region-west",
    bg: "bg-region-west",
    soft: "bg-region-west/10",
    border: "border-region-west",
    ring: "ring-region-west/40",
    dot: "bg-region-west",
  },
  midwest: {
    text: "text-region-midwest",
    bg: "bg-region-midwest",
    soft: "bg-region-midwest/10",
    border: "border-region-midwest",
    ring: "ring-region-midwest/40",
    dot: "bg-region-midwest",
  },
  east: {
    text: "text-region-east",
    bg: "bg-region-east",
    soft: "bg-region-east/10",
    border: "border-region-east",
    ring: "ring-region-east/40",
    dot: "bg-region-east",
  },
};
