"use client";

import { motion, useReducedMotion } from "motion/react";

import type { LucideIcon } from "@/lib/icons";

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Horizontal (desktop) / vertical (mobile) visual timeline for the learning
 * flow. Nodes reveal in sequence as they scroll into view.
 */
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <ol className="relative flex flex-col gap-6 md:flex-row md:gap-0">
      {/* connecting line */}
      <div className="via-brand/40 absolute top-6 left-6 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-transparent to-transparent md:top-6 md:left-0 md:h-px md:w-full md:bg-gradient-to-r" />

      {steps.map((step, index) => (
        <motion.li
          key={step.id}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="relative flex flex-1 items-start gap-4 md:flex-col md:items-center md:gap-3 md:px-2 md:text-center"
        >
          <span className="bg-background ring-brand/30 relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1">
            <span className="bg-gradient-brand glow-brand text-primary-foreground flex size-full items-center justify-center rounded-2xl">
              <step.icon className="size-5.5" />
            </span>
          </span>
          <div className="flex flex-col gap-1 md:items-center">
            <span className="text-muted-foreground text-xs font-medium">
              Step {index + 1}
            </span>
            <h3 className="text-foreground text-sm font-semibold">
              {step.title}
            </h3>
            <p className="text-muted-foreground max-w-[16rem] text-xs leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
