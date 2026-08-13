"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getJourney, getQuiz, learnRoutes } from "@/constants";
import {
  ArrowRight,
  Award,
  Check,
  RefreshCw,
  Trophy,
  X,
  Zap,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export function Quiz({ journeySlug }: { journeySlug: string }) {
  const journey = getJourney(journeySlug);
  const questions = getQuiz(journeySlug);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!journey || questions.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        No quiz available for this journey yet.
      </p>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function choose(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    setAnswered(true);
    if (optionIndex === question.correctIndex) {
      setXp((x) => x + question.xp);
      setCorrectCount((c) => c + 1);
    }
  }

  function nextQuestion() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setXp(0);
    setCorrectCount(0);
    setFinished(false);
  }

  if (finished) {
    const passed = correctCount / questions.length >= 0.6;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong mx-auto flex max-w-md flex-col items-center gap-5 rounded-3xl p-8 text-center"
      >
        <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-16 items-center justify-center rounded-3xl">
          <Trophy className="size-8" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="text-foreground text-2xl font-bold">
            {passed ? "Great work!" : "Good try!"}
          </h2>
          <p className="text-muted-foreground text-sm">
            You scored {correctCount} / {questions.length}
          </p>
        </div>
        <div className="text-warning flex items-center gap-1.5 text-lg font-bold">
          <Zap className="size-5" />+{xp} XP
        </div>
        <div className="flex w-full flex-col gap-2.5">
          {passed ? (
            <a href={learnRoutes.certificate(journey.slug)}>
              <Button size="lg" className="glow-hover w-full rounded-xl">
                <Award />
                View certificate
              </Button>
            </a>
          ) : null}
          <Button
            size="lg"
            variant="outline"
            onClick={restart}
            className="glass w-full rounded-xl"
          >
            <RefreshCw />
            Try again
          </Button>
          <a href={learnRoutes.journey(journey.slug)}>
            <Button variant="ghost" className="w-full rounded-xl">
              Back to journey
            </Button>
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      {/* progress */}
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span className="text-warning flex items-center gap-1 font-semibold">
            <Zap className="size-3" />
            {xp} XP
          </span>
        </div>
        <div className="bg-muted h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-gradient-brand h-full rounded-full transition-all duration-500"
            style={{
              width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="glass-strong flex flex-col gap-5 rounded-3xl p-6 sm:p-8"
        >
          <h2 className="text-foreground text-xl font-semibold">
            {question.question}
          </h2>

          <div className="flex flex-col gap-3">
            {question.options.map((option, optionIndex) => {
              const isCorrect = optionIndex === question.correctIndex;
              const isChosen = optionIndex === selected;
              const showState = answered && (isCorrect || isChosen);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => choose(optionIndex)}
                  disabled={answered}
                  className={cn(
                    "glass flex items-center gap-3 rounded-xl p-4 text-left text-sm transition-all",
                    !answered && "hover:ring-brand/40 hover:ring-1",
                    showState && isCorrect && "ring-success ring-2",
                    showState &&
                      !isCorrect &&
                      isChosen &&
                      "ring-destructive ring-2",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      showState &&
                        isCorrect &&
                        "border-success bg-success text-success-foreground",
                      showState &&
                        !isCorrect &&
                        isChosen &&
                        "border-destructive bg-destructive text-destructive-foreground",
                      !showState && "border-border text-muted-foreground",
                    )}
                  >
                    {showState && isCorrect ? (
                      <Check className="size-3.5" />
                    ) : showState && isChosen ? (
                      <X className="size-3.5" />
                    ) : (
                      String.fromCharCode(65 + optionIndex)
                    )}
                  </span>
                  <span className="text-foreground">{option}</span>
                </button>
              );
            })}
          </div>

          {answered ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass rounded-xl p-4"
            >
              <p className="text-foreground text-sm font-medium">
                {selected === question.correctIndex ? "Correct!" : "Not quite."}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </motion.div>
          ) : null}

          <Button
            size="lg"
            onClick={nextQuestion}
            disabled={!answered}
            className="glow-hover rounded-xl"
          >
            {isLast ? "See results" : "Next question"}
            <ArrowRight />
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
