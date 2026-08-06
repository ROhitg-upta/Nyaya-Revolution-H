import type { ReactNode } from "react";

import { type LucideIcon, Inbox } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.ComponentProps<"div"> {
  /** Icon shown in the illustration bubble. */
  icon?: LucideIcon;
  /** Primary message — short and specific. */
  title: string;
  /** Optional supporting copy. */
  description?: string;
  /** Optional call to action (e.g. a Button). */
  action?: ReactNode;
}

/**
 * Neutral empty state for lists, tables, and search results that have no data.
 * Composed from tokens only — works in light and dark mode.
 */
function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        "animate-in fade-in-0 zoom-in-95 duration-300",
        className,
      )}
      {...props}
    >
      <div
        className="text-muted-foreground bg-muted flex size-14 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <Icon className="size-6" />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-foreground text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
