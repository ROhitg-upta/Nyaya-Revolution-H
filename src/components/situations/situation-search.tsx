"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { searchPlaceholders } from "@/constants";
import { Search, X } from "@/lib/icons";

interface SituationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Search bar for the Situation Engine. When empty and unfocused, it rotates
 * through example prompts as an animated placeholder. UI only — filtering is
 * handled by the parent.
 */
export function SituationSearch({ value, onChange }: SituationSearchProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value || focused) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % searchPlaceholders.length),
      2800,
    );
    return () => clearInterval(timer);
  }, [value, focused]);

  const showRotating = !value && !focused;

  return (
    <div className="glass-strong focus-within:ring-ring/50 relative flex items-center gap-3 rounded-2xl p-2 pl-5 transition focus-within:ring-2">
      <Search className="text-brand size-5 shrink-0" />
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Describe what happened to you"
          className="text-foreground w-full bg-transparent py-2.5 text-base outline-none sm:text-lg"
        />
        {showRotating ? (
          <div
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="truncate text-base sm:text-lg"
              >
                {searchPlaceholders[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-xl transition-colors"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
