"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { CheckCircle, Lightbulb, XCircle } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface MiniChallengeProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
  onComplete?: (correct: boolean) => void;
}

export function MiniChallenge({
  question,
  options,
  correctIndex,
  explanation,
  xp,
  onComplete,
}: MiniChallengeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === correctIndex;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    onComplete?.(i === correctIndex);
  };

  return (
    <div className="glass-strong flex flex-col gap-5 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="bg-brand/12 flex size-9 items-center justify-center rounded-xl">
          <Lightbulb className="text-brand size-5" />
        </div>
        <div>
          <span className="text-brand text-xs font-semibold tracking-wider uppercase">
            Mini challenge
          </span>
          <span className="text-muted-foreground ml-2 text-xs">+{xp} XP</span>
        </div>
      </div>

      <p className="text-foreground text-sm leading-relaxed font-medium">
        {question}
      </p>

      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          let ring = "ring-1 ring-transparent hover:ring-brand/40";
          if (answered && i === correctIndex) ring = "ring-2 ring-emerald-500";
          else if (answered && i === selected) ring = "ring-2 ring-red-500";

          return (
            <motion.button
              key={i}
              type="button"
              whileTap={answered ? {} : { scale: 0.98 }}
              disabled={answered}
              onClick={() => handleSelect(i)}
              className={cn(
                "glass flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all",
                ring,
                answered && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  answered && i === correctIndex
                    ? "bg-emerald-500/20 text-emerald-400"
                    : answered && i === selected
                      ? "bg-red-500/20 text-red-400"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {answered && i === correctIndex ? (
                  <CheckCircle className="size-4" />
                ) : answered && i === selected ? (
                  <XCircle className="size-4" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="text-foreground">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={cn(
            "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
            correct
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300",
          )}
        >
          {correct ? (
            <CheckCircle className="mt-0.5 size-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 size-4 shrink-0" />
          )}
          <span>{explanation}</span>
        </motion.div>
      )}
    </div>
  );
}
