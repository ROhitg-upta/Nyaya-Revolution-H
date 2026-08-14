"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { QuizResultCard } from "@/components/learning/quiz-result-card";
import { XpToast } from "@/components/learning/xp-toast";
import { Button } from "@/components/ui/button";
import { getJourney, getQuiz, learnRoutes } from "@/constants";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  XCircle,
  Zap,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

interface QuizProps {
  journeySlug: string;
}

export function Quiz({ journeySlug }: QuizProps) {
  const journey = getJourney(journeySlug);
  const questions = getQuiz(journeySlug);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [streak, setStreak] = useState(0);

  if (!journey || questions.length === 0) return null;
  const q = questions[index];
  const total = questions.length;
  const passed = correctCount / total >= 0.6;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const isCorrect = i === q.correctIndex;
    if (isCorrect) {
      setXp((prev) => prev + q.xp);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setShowXp(true);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
  };

  const handleRetry = () => {
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setXp(0);
    setCorrectCount(0);
    setFinished(false);
    setStreak(0);
  };

  if (finished) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <QuizResultCard
          correctCount={correctCount}
          totalQuestions={total}
          xpEarned={xp}
          passed={passed}
        />

        <div className="flex flex-wrap justify-center gap-3">
          {passed && (
            <Link href={learnRoutes.certificate(journeySlug)}>
              <Button className="rounded-xl">View certificate</Button>
            </Link>
          )}
          <Button
            variant="outline"
            onClick={handleRetry}
            className="glass rounded-xl"
          >
            <RotateCcw className="mr-1.5 size-4" />
            Try again
          </Button>
          <Link href={learnRoutes.journey(journeySlug)}>
            <Button variant="ghost" className="rounded-xl">
              <ArrowLeft className="mr-1.5 size-4" />
              Back to journey
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <XpToast xp={q.xp} show={showXp} onDone={() => setShowXp(false)} />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {/* Progress header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm font-medium">
              {index + 1} / {total}
            </span>
            {streak >= 2 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-warning flex items-center gap-1 text-xs font-bold"
              >
                {streak}x streak
              </motion.span>
            )}
          </div>
          <span className="text-brand flex items-center gap-1 text-sm font-semibold">
            <Zap className="size-4" />
            {xp} XP
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <motion.div
            animate={{
              width: `${((index + (answered ? 1 : 0)) / total) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-brand h-full rounded-full"
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="glass-strong flex flex-col gap-6 rounded-2xl p-6"
          >
            <h2 className="text-foreground text-lg leading-snug font-bold">
              {q.question}
            </h2>

            <div className="flex flex-col gap-3">
              {q.options.map((opt, i) => {
                let ringClass = "ring-1 ring-transparent hover:ring-brand/40";
                let bgClass = "";
                if (answered && i === q.correctIndex) {
                  ringClass = "ring-2 ring-emerald-500";
                  bgClass = "bg-emerald-500/5";
                } else if (answered && i === selected) {
                  ringClass = "ring-2 ring-red-500";
                  bgClass = "bg-red-500/5";
                }

                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={answered ? {} : { scale: 0.98 }}
                    disabled={answered}
                    onClick={() => handleSelect(i)}
                    className={cn(
                      "glass flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition-all",
                      ringClass,
                      bgClass,
                      answered && "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        answered && i === q.correctIndex
                          ? "bg-emerald-500/20 text-emerald-400"
                          : answered && i === selected
                            ? "bg-red-500/20 text-red-400"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {answered && i === q.correctIndex ? (
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

            {/* Explanation */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
                    selected === q.correctIndex
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300",
                  )}
                >
                  {selected === q.correctIndex ? (
                    <CheckCircle className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>{q.explanation}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {answered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <Button onClick={handleNext} className="rounded-xl">
                  {index + 1 >= total ? "See results" : "Next question"}
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
