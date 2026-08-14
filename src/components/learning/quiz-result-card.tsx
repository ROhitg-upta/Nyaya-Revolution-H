"use client";

import { motion } from "motion/react";

import { ProgressRing } from "@/components/learning/progress-ring";
import { Award, CheckCircle, Target, XCircle, Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface QuizResultCardProps {
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  passed: boolean;
}

export function QuizResultCard({
  correctCount,
  totalQuestions,
  xpEarned,
  passed,
}: QuizResultCardProps) {
  const pct = Math.round((correctCount / totalQuestions) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="glass-strong flex flex-col items-center gap-6 rounded-3xl p-8"
    >
      <ProgressRing value={pct} size={120} strokeWidth={10}>
        <span className="text-foreground text-3xl font-bold">{pct}%</span>
      </ProgressRing>

      <div className="text-center">
        <h2
          className={cn(
            "text-2xl font-bold",
            passed ? "text-emerald-400" : "text-foreground",
          )}
        >
          {passed ? "Congratulations!" : "Keep practicing!"}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {passed
            ? "You've passed the quiz and earned a certificate."
            : "You need at least 60% to pass. Try again!"}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <div className="glass flex flex-col items-center gap-1 rounded-xl px-5 py-3">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="size-4 text-emerald-400" />
            <span className="text-foreground text-lg font-bold">
              {correctCount}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">Correct</span>
        </div>

        <div className="glass flex flex-col items-center gap-1 rounded-xl px-5 py-3">
          <div className="flex items-center gap-1.5">
            <XCircle className="size-4 text-red-400" />
            <span className="text-foreground text-lg font-bold">
              {totalQuestions - correctCount}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">Incorrect</span>
        </div>

        <div className="glass flex flex-col items-center gap-1 rounded-xl px-5 py-3">
          <div className="flex items-center gap-1.5">
            <Zap className="size-4 text-amber-400" />
            <span className="text-foreground text-lg font-bold">
              {xpEarned}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">XP earned</span>
        </div>

        <div className="glass flex flex-col items-center gap-1 rounded-xl px-5 py-3">
          <div className="flex items-center gap-1.5">
            <Target className="text-brand size-4" />
            <span className="text-foreground text-lg font-bold">
              {totalQuestions}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">Questions</span>
        </div>
      </div>

      {passed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2"
        >
          <Award className="text-brand size-5" />
          <span className="text-brand text-sm font-semibold">
            Certificate unlocked
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
