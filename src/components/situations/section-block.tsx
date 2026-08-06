import type { ReactNode } from "react";

import type { LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SectionBlockProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
  /** Tints the icon tile (e.g. destructive for "What NOT to do"). */
  tone?: "brand" | "danger";
}

/** Glass panel wrapper used for every situation-detail section. */
export function SectionBlock({
  icon: Icon,
  title,
  children,
  className,
  tone = "brand",
}: SectionBlockProps) {
  return (
    <section className={cn("glass rounded-2xl p-6", className)}>
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl",
            tone === "danger"
              ? "bg-destructive/12 text-destructive"
              : "bg-brand/12 text-brand",
          )}
        >
          <Icon className="size-5" />
        </span>
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
