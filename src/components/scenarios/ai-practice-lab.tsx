"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { generatePracticeScenarioAction } from "@/actions/ai.actions";
import { Button } from "@/components/ui/button";
import { usePracticeCompletion } from "@/hooks/use-practice-completion";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Flame,
  Loader2,
  RotateCcw,
  Scale,
  Sparkles,
  Zap,
} from "@/lib/icons";
import type { PracticeScenario } from "@/types";

const SUGGESTED_CONCEPTS = [
  "Police Detention Without Warrant (Article 22)",
  "Landlord Refusing Security Deposit Return",
  "WhatsApp Loan App Blackmail & Extortion",
  "Defective Goods & Consumer Forum Refund",
  "Traffic Police Demanding Physical Licence",
  "Unlawful Workplace Termination Without Notice",
];

export function AIPracticeLab() {
  const [selectedConcept, setSelectedConcept] = useState<string>(SUGGESTED_CONCEPTS[0]);
  const [customConcept, setCustomConcept] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scenario, setScenario] = useState<PracticeScenario | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const { recordCompletion, lastResult } = usePracticeCompletion();

  const handleGenerate = async (conceptToUse?: string) => {
    const concept = conceptToUse || customConcept.trim() || selectedConcept;
    setIsLoading(true);
    setSelectedOptionId(null);
    setCompleted(false);

    try {
      const res = await generatePracticeScenarioAction({
        conceptSlug: concept,
        difficulty: "beginner",
      });
      if (res.success && res.data) {
        setScenario(res.data.scenario);
      }
    } catch (err) {
      console.warn("Failed to generate AI scenario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    if (!scenario || completed) return;
    setSelectedOptionId(optionId);
    setCompleted(true);

    const chosen = scenario.options.find((opt) => opt.id === optionId);
    const isOptimal = Boolean(chosen?.isRecommended);

    await recordCompletion({
      scenarioId: scenario.id,
      conceptName: scenario.concept,
      score: isOptimal ? 25 : 10,
      maxScore: 25,
      isCorrect: isOptimal,
      xpEarned: isOptimal ? 25 : 10,
    });
  };

  const chosenOption = scenario?.options.find((opt) => opt.id === selectedOptionId);

  return (
    <div className="glass-strong border-brand/40 flex flex-col gap-6 rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-brand/15 text-brand flex size-8 items-center justify-center rounded-xl">
            <Brain className="size-4.5" />
          </span>
          <span className="text-brand text-xs font-bold uppercase tracking-wider">
            AI Practice Lab · Grounded Scenario Engine
          </span>
        </div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          Test Your Legal Intuition Under Pressure
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Generate an AI-simulated legal encounter grounded strictly in verified Indian statutes.
          Make your choice, learn the underlying procedural law, and earn daily streak XP.
        </p>
      </div>

      {/* Concept Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-foreground text-xs font-bold uppercase tracking-wider">
          Choose or Enter a Legal Situation Concept:
        </label>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_CONCEPTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setSelectedConcept(c);
                setCustomConcept("");
                handleGenerate(c);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedConcept === c && !customConcept
                  ? "bg-brand text-primary-foreground shadow-sm"
                  : "glass text-muted-foreground hover:text-foreground hover:border-brand/40"
              }`}
            >
              {c.split(" (")[0]}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Or type any Indian legal scenario..."
            value={customConcept}
            onChange={(e) => setCustomConcept(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customConcept.trim()) {
                handleGenerate();
              }
            }}
            className="border-border/60 bg-muted/20 text-foreground placeholder:text-muted-foreground flex-1 rounded-xl border px-4 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <Button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="rounded-xl gap-2 font-semibold"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            <span>Generate Scenario</span>
          </Button>
        </div>
      </div>

      {/* Scenario Challenge Card */}
      {scenario && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/60 bg-muted/10 flex flex-col gap-5 rounded-2xl border p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
            <span className="text-brand text-xs font-bold uppercase tracking-wider">
              {scenario.title}
            </span>
            {scenario.statutoryBacking && (
              <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                <Scale className="size-3" />
                {scenario.statutoryBacking}
              </span>
            )}
          </div>

          <div className="text-foreground text-sm sm:text-base font-medium leading-relaxed">
            {scenario.situationText}
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              What is your immediate legal decision?
            </span>
            {scenario.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              let optionClass = "glass text-foreground hover:border-brand/40";
              if (completed) {
                if (opt.isRecommended) {
                  optionClass = "border-emerald-500/50 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500/30";
                } else if (isSelected) {
                  optionClass = "border-red-500/50 bg-red-500/10 text-foreground ring-1 ring-red-500/30";
                } else {
                  optionClass = "opacity-60 glass text-muted-foreground";
                }
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={completed}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex items-start gap-3.5 rounded-xl border p-4 text-left text-sm transition-all ${optionClass}`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      completed && opt.isRecommended
                        ? "bg-emerald-500 text-white"
                        : completed && isSelected
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="leading-relaxed font-medium">{opt.text}</span>
                    {completed && (
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {opt.rationale}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & Gamification Reveal */}
          <AnimatePresence>
            {completed && chosenOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex flex-col gap-3.5 rounded-xl border p-4 sm:p-5 ${
                  chosenOption.isRecommended
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-amber-500/40 bg-amber-500/10"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {chosenOption.isRecommended ? (
                      <>
                        <CheckCircle2 className="text-emerald-500 size-5" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Optimal Statutory Action
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="text-amber-500 size-5" />
                        <span className="text-amber-600 dark:text-amber-400">
                          High Legal Risk / Procedural Error
                        </span>
                      </>
                    )}
                  </div>

                  {/* Award Chips */}
                  <div className="flex items-center gap-2">
                    <span className="bg-brand/20 text-brand border-brand/30 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold">
                      <Zap className="size-3 fill-current" />
                      +{chosenOption.isRecommended ? 25 : 10} XP
                    </span>
                    <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold">
                      <Flame className="size-3 fill-current" />
                      {lastResult?.currentStreak ?? 6} Days
                    </span>
                  </div>
                </div>

                <p className="text-foreground/95 text-sm leading-relaxed">
                  <strong className="text-foreground">Procedural Rationale: </strong>
                  {chosenOption.rationale}
                </p>

                <div className="border-border/40 text-muted-foreground border-t pt-2.5 text-xs leading-relaxed">
                  <strong className="text-foreground">Core Takeaway: </strong>
                  {scenario.learningTakeaway}
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOptionId(null);
                      setCompleted(false);
                    }}
                    className="glass rounded-xl gap-1 text-xs"
                  >
                    <RotateCcw className="size-3.5" />
                    Retry This Scenario
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleGenerate()}
                    className="rounded-xl gap-1 text-xs"
                  >
                    <Sparkles className="size-3.5" />
                    Next Practice Challenge
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
