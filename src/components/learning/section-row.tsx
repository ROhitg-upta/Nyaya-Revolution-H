import type { ReactNode } from "react";

import { type LucideIcon, ArrowRight } from "@/lib/icons";

interface SectionRowProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  seeAllHref?: string;
  children: ReactNode;
}

/**
 * Titled horizontal carousel used for every home dashboard row. Children scroll
 * horizontally on small screens and wrap into the row on larger ones.
 */
export function SectionRow({
  icon: Icon,
  title,
  description,
  seeAllHref,
  children,
}: SectionRowProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
            {Icon ? <Icon className="text-brand size-5" /> : null}
            {title}
          </h2>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {seeAllHref ? (
          <a
            href={seeAllHref}
            className="text-brand inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
          >
            See all
            <ArrowRight className="size-3.5" />
          </a>
        ) : null}
      </div>
      <div className="-mx-1 flex [scrollbar-width:none] gap-4 overflow-x-auto px-1 pb-2 [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </section>
  );
}
