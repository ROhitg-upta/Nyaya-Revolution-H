"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, HelpCircle, RotateCcw, XCircle } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import type { InteractiveScenarioPayload } from "@/types";

interface InteractiveScenarioProps {
  scenario: InteractiveScenarioPayload;
}

export function InteractiveScenarioBlock({ scenario }: InteractiveScenarioProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!scenario || !scenario.options?.length) return null;

  const selectedOption = scenario.options.find((opt) => opt.id === selectedId);

  return (
    <div className="glass-strong border-brand/30 flex flex-col gap-5 rounded-2xl p-6">
      <div className="flex items-center gap-2">
        <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-lg">
          <HelpCircle className="size-4.5" />
        </span>
        <div>
          <span className="text-brand text-xs font-bold uppercase tracking-wider">
            Decision Challenge
          </span>
          <h3 className="text-foreground text-base font-bold">
            What would you do?
          </h3>
        </div>
      </div>

      {scenario.context ? (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {scenario.context}
        </p>
      ) : null}

      <p className="text-foreground text-sm font-semibold">
        {scenario.prompt}
      </p>

      {/* Choice Buttons */}
      <div className="flex flex-col gap-2.5">
        {scenario.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedId(opt.id)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? opt.isOptimal
                    ? "border-success bg-success/10 text-foreground ring-1 ring-success"
                    : "border-destructive bg-destructive/10 text-foreground ring-1 ring-destructive"
                  : "border-border/60 hover:border-brand/40 glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected
                    ? opt.isOptimal
                      ? "bg-success text-success-foreground"
                      : "bg-destructive text-destructive-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {opt.id.toUpperCase()}
              </span>
              <span className="text-sm font-medium leading-relaxed">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback Reveal */}
      <AnimatePresence>
        {selectedOption ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden rounded-xl border p-4 text-sm leading-relaxed ${
              selectedOption.isOptimal
                ? "border-success/40 bg-success/10 text-foreground"
                : "border-destructive/40 bg-destructive/10 text-foreground"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {selectedOption.isOptimal ? (
                <>
                  <CheckCircle2 className="text-success size-5" />
                  <span className="text-success">Best Legal Choice</span>
                </>
              ) : (
                <>
                  <XCircle className="text-destructive size-5" />
                  <span className="text-destructive">High Legal Risk / Suboptimal</span>
                </>
              )}
            </div>

            <p className="mt-2 text-foreground/90">{selectedOption.feedback}</p>

            {selectedOption.legalConsequence ? (
              <p className="border-border/40 text-muted-foreground mt-3 border-t pt-2 text-xs">
                <strong className="text-foreground">Legal Consequence: </strong>
                {selectedOption.legalConsequence}
              </p>
            ) : null}

            <div className="mt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedId(null)}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="size-3.5" />
                Try another option
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
