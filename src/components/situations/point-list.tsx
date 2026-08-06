import { Ban, Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PointListProps {
  items: string[];
  /** "positive" for rights/allowed, "danger" for what-not-to-do. */
  tone?: "positive" | "danger";
}

/** Simple marked list for rights and "what NOT to do" content. */
export function PointList({ items, tone = "positive" }: PointListProps) {
  const danger = tone === "danger";
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
              danger
                ? "bg-destructive/15 text-destructive"
                : "bg-success/15 text-success",
            )}
          >
            {danger ? <Ban className="size-3" /> : <Check className="size-3" />}
          </span>
          <span className="text-muted-foreground text-sm leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
