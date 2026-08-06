import { type LucideIcon, ArrowRight } from "@/lib/icons";

interface LearningPathCardProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  meta: string;
  actionLabel: string;
}

/**
 * Compact CTA card for a related learning path or quiz. UI only — the action
 * is a placeholder until the learning module ships.
 */
export function LearningPathCard({
  icon: Icon,
  eyebrow,
  title,
  meta,
  actionLabel,
}: LearningPathCardProps) {
  return (
    <div className="glass glow-hover group flex flex-col gap-4 rounded-2xl p-5 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-11 items-center justify-center rounded-xl">
          <Icon className="size-5.5" />
        </span>
        <div className="flex flex-col">
          <span className="text-brand text-xs font-semibold tracking-wide uppercase">
            {eyebrow}
          </span>
          <h3 className="text-foreground text-base font-semibold">{title}</h3>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{meta}</p>
      <span className="text-brand inline-flex items-center gap-1.5 text-sm font-medium">
        {actionLabel}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  );
}
