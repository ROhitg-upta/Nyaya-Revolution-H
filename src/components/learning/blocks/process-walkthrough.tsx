"use client";

import { motion } from "motion/react";
import { Clock, Landmark } from "@/lib/icons";
import type { ProcessStep } from "@/types";

interface ProcessWalkthroughProps {
  steps: ProcessStep[];
}

export function ProcessWalkthroughBlock({ steps }: ProcessWalkthroughProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative flex flex-col gap-6 pl-2">
      {/* Vertical connecting line */}
      <div className="border-brand/25 absolute top-4 bottom-4 left-6 w-px border-l-2 border-dashed" />

      {steps.map((step, idx) => (
        <motion.div
          key={`step-${step.stepNumber}-${idx}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: idx * 0.06 }}
          className="relative flex items-start gap-4"
        >
          {/* Step Number Circle */}
          <span className="bg-gradient-brand text-primary-foreground glow-brand relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md">
            {step.stepNumber}
          </span>

          {/* Step Card */}
          <div className="glass flex-1 rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-foreground text-base font-bold">
                {step.title}
              </h3>
              {step.expectedTimeline ? (
                <span className="bg-brand/12 text-brand inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                  <Clock className="size-3" />
                  {step.expectedTimeline}
                </span>
              ) : null}
            </div>

            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {step.description}
            </p>

            {step.authority ? (
              <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
                <Landmark className="text-brand size-3.5" />
                <span>Authority: <strong className="text-foreground">{step.authority}</strong></span>
              </div>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
