import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface LoadingStateProps extends React.ComponentProps<"div"> {
  /** Optional message shown under the spinner. */
  label?: string;
  /** Fill the parent and centre vertically (e.g. a route or panel). */
  fullHeight?: boolean;
}

/**
 * Centred loading indicator for sections, panels, or full routes. For inline
 * content placeholders prefer <Skeleton /> instead.
 */
function LoadingState({
  label = "Loading…",
  fullHeight = false,
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div
      data-slot="loading-state"
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        fullHeight && "min-h-[60vh]",
        className,
      )}
      {...props}
    >
      <Spinner size="lg" className="text-brand" label={label} />
      {label ? <p className="text-muted-foreground text-sm">{label}</p> : null}
    </div>
  );
}

export { LoadingState };
