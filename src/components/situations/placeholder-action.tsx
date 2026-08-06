import { type LucideIcon, ChevronRight } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

interface PlaceholderActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Short "coming soon" style label. */
  badge?: string;
}

/**
 * Non-functional utility row (Nearby Police Station, Download Checklist, Need a
 * Lawyer). Clearly marked as a placeholder — wired up in a later sprint.
 */
export function PlaceholderAction({
  icon: Icon,
  title,
  description,
  badge = "Soon",
}: PlaceholderActionProps) {
  return (
    <div className="glass flex items-center gap-3 rounded-xl p-3.5 opacity-90">
      <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
        <Icon className="size-4.5" />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-foreground text-sm font-medium">{title}</span>
        <span className="text-muted-foreground text-xs">{description}</span>
      </div>
      <Badge variant="secondary">{badge}</Badge>
      <ChevronRight className="text-muted-foreground/50 size-4" />
    </div>
  );
}
