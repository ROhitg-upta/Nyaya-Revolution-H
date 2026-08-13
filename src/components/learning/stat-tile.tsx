import type { LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
}

/** Compact glass stat used across the learning dashboard. */
export function StatTile({
  icon: Icon,
  label,
  value,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn("glass flex items-center gap-3 rounded-2xl p-4", className)}
    >
      <span className="bg-brand/12 text-brand flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col">
        <span className="text-foreground text-xl font-bold">{value}</span>
        <span className="text-muted-foreground text-xs">{label}</span>
      </div>
    </div>
  );
}
