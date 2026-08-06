import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { AlertTriangle, type LucideIcon, RefreshCw } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface ErrorStateProps extends React.ComponentProps<"div"> {
  /** Icon shown in the illustration bubble. */
  icon?: LucideIcon;
  /** Short, human error headline. */
  title?: string;
  /** Optional supporting copy — avoid leaking raw error details to users. */
  description?: string;
  /** When provided, renders a "Try again" button wired to this handler. */
  onRetry?: () => void;
  /** Label for the retry button. */
  retryLabel?: string;
  /** Custom action(s), rendered instead of the default retry button. */
  action?: ReactNode;
}

/**
 * Standard error state for failed data loads or actions. Uses the destructive
 * token for the icon while keeping the overall surface calm and on-brand.
 */
function ErrorState({
  icon: Icon = AlertTriangle,
  title = "Something went wrong",
  description = "We couldn't complete your request. Please try again.",
  onRetry,
  retryLabel = "Try again",
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        "animate-in fade-in-0 zoom-in-95 duration-300",
        className,
      )}
      {...props}
    >
      <div
        className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full"
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
      {action ??
        (onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw />
            {retryLabel}
          </Button>
        ) : null)}
    </div>
  );
}

export { ErrorState };
