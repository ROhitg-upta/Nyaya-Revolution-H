import { Scale } from "@/lib/icons";
import type { ApplicableLaw } from "@/types";

/** Displays a single applicable law with its reference and plain-language note. */
export function LawCard({ law }: { law: ApplicableLaw }) {
  return (
    <div className="glass hover:ring-brand/30 flex flex-col gap-2 rounded-xl p-4 transition-all hover:ring-1">
      <div className="flex items-start gap-3">
        <span className="bg-brand/12 text-brand flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Scale className="size-4.5" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-foreground text-sm font-semibold">{law.name}</h3>
          <span className="text-brand text-xs font-medium">
            {law.reference}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {law.description}
      </p>
    </div>
  );
}
