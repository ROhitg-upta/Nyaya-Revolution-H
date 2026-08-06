import { getCategory, situationRoute } from "@/constants";
import { ArrowRight } from "@/lib/icons";
import type { Situation } from "@/types";

/** Card linking to a situation's detail page. */
export function SituationCard({ situation }: { situation: Situation }) {
  const category = getCategory(situation.category);
  return (
    <a
      href={situationRoute(situation.slug)}
      className="focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="glass glow-hover relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-5 hover:-translate-y-1">
        <div className="bg-brand/20 pointer-events-none absolute -top-14 -right-14 size-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />
        <div className="relative flex items-center justify-between">
          <span className="bg-brand/12 text-brand ring-brand/15 flex size-11 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover/card:scale-110">
            <situation.icon className="size-5.5" />
          </span>
          {category ? (
            <span className="text-muted-foreground bg-muted/60 rounded-full px-2.5 py-1 text-xs font-medium">
              {category.title}
            </span>
          ) : null}
        </div>
        <div className="relative flex flex-1 flex-col gap-1.5">
          <h3 className="text-foreground text-base leading-snug font-semibold">
            {situation.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {situation.tagline}
          </p>
        </div>
        <span className="text-brand relative inline-flex items-center gap-1.5 text-sm font-medium">
          Understand my rights
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/card:translate-x-1" />
        </span>
      </div>
    </a>
  );
}
