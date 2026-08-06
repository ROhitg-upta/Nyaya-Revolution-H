"use client";

import { useState } from "react";

import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ActionChecklistProps {
  items: string[];
}

/**
 * Interactive checklist (UI only) — toggling items ticks them off and updates a
 * progress count. State is local; nothing is persisted.
 */
export function ActionChecklist({ items }: ActionChecklistProps) {
  const [done, setDone] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const checked = done.has(index);
          return (
            <li key={item}>
              <button
                type="button"
                aria-pressed={checked}
                onClick={() => toggle(index)}
                className="glass hover:ring-brand/40 flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all hover:ring-1"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border transition-all",
                    checked
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border",
                  )}
                >
                  {checked ? <Check className="size-3.5" /> : null}
                </span>
                <span
                  className={cn(
                    "text-sm leading-relaxed transition-colors",
                    checked
                      ? "text-muted-foreground line-through"
                      : "text-foreground",
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground text-xs">
        {done.size} of {items.length} done
      </p>
    </div>
  );
}
