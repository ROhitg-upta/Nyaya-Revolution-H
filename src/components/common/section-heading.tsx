import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Center the heading block (default) or align left. */
  align?: "center" | "left";
  className?: string;
}

/**
 * Consistent section header used across the landing page: an optional eyebrow,
 * a balanced title, and supporting copy. Reveals on scroll.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "glass text-muted-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
            align === "center" ? "mx-auto" : "self-start",
          )}
        >
          <span className="bg-brand size-1.5 rounded-full" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
