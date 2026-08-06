import { cn } from "@/lib/utils";

interface SectionProps extends React.ComponentProps<"section"> {
  /** Adds a subtle muted background band. */
  muted?: boolean;
}

/**
 * Layout primitive for landing sections: generous vertical rhythm and a
 * centered, padded container. Keeps whitespace consistent across the page.
 */
export function Section({
  muted = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative scroll-mt-24 py-24 sm:py-32",
        muted && "border-border/50 bg-card/20 border-y backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
