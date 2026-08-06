"use client";

import { type LucideIcon, Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: LucideIcon;
  selected: boolean;
  onSelect: () => void;
  /** Compact pill style for short options (age, language). */
  compact?: boolean;
}

/**
 * Selectable glass card used across onboarding steps for both single- and
 * multi-select. Accessible as a toggle button (`aria-pressed`).
 */
export function OptionCard({
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
  compact = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "glass group relative flex items-center gap-3 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5",
        compact ? "justify-center px-4 py-3" : "p-4",
        selected
          ? "ring-brand glow-brand ring-2"
          : "hover:ring-brand/40 hover:ring-1",
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
            selected
              ? "bg-brand text-brand-foreground"
              : "bg-brand/12 text-brand",
          )}
        >
          <Icon className="size-5" />
        </span>
      ) : null}

      <span className="flex flex-1 flex-col">
        <span className="text-foreground text-sm font-semibold">{label}</span>
        {description ? (
          <span className="text-muted-foreground text-xs leading-relaxed">
            {description}
          </span>
        ) : null}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all",
          compact && !Icon ? "hidden" : "",
          selected
            ? "border-brand bg-brand text-brand-foreground scale-100"
            : "border-border scale-90 opacity-0 group-hover:opacity-100",
        )}
      >
        <Check className="size-3" />
      </span>
    </button>
  );
}
