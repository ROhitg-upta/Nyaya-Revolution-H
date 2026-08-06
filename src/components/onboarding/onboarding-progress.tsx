"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  current: number;
  total: number;
  labels: string[];
}

/** Segmented progress indicator with an animated fill for the active step. */
export function OnboardingProgress({
  current,
  total,
  labels,
}: OnboardingProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-brand text-xs font-semibold tracking-wide uppercase">
          Step {current + 1} of {total}
        </span>
        <span className="text-muted-foreground text-xs">{labels[current]}</span>
      </div>
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full"
          >
            <motion.div
              initial={false}
              animate={{ scaleX: index <= current ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "bg-gradient-brand h-full origin-left rounded-full",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
