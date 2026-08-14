import type { LucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SectionRowProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  seeAllHref?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionRow({
  icon: Icon,
  title,
  description,
  seeAllHref,
  children,
  className,
}: SectionRowProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            <Icon className="text-brand size-5" />
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {seeAllHref && (
          <a
            href={seeAllHref}
            className="text-brand hover:text-brand/80 shrink-0 text-sm font-medium transition-colors"
          >
            See all
          </a>
        )}
      </div>

      <div className="-mx-5 flex [scrollbar-width:none] gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
        {children}
      </div>
    </section>
  );
}
