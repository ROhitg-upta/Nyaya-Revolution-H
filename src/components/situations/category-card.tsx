"use client";

import type { SituationCategory } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: SituationCategory;
  selected: boolean;
  onSelect: () => void;
}

/** Selectable premium category chip that filters the situation grid. */
export function CategoryCard({
  category,
  selected,
  onSelect,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "glass group flex flex-col items-start gap-2.5 rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-1",
        selected
          ? "ring-brand glow-brand ring-2"
          : "hover:ring-brand/40 hover:ring-1",
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          selected
            ? "bg-brand text-brand-foreground"
            : "bg-brand/12 text-brand",
        )}
      >
        <category.icon className="size-5" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground text-sm font-semibold">
          {category.title}
        </span>
        <span className="text-muted-foreground text-xs leading-relaxed">
          {category.description}
        </span>
      </div>
    </button>
  );
}
