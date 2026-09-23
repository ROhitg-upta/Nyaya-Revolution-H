"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Trophy,
} from "@/lib/icons";
import { VerificationBadge } from "@/components/laws/verification-badge";
import { ContentDiscovery } from "@/components/common/content-discovery";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout";
import type { ScenarioEvaluation, ScenarioSimulation, ScenarioStepOption } from "@/types";

interface ScenarioSimulatorProps {
  scenario: ScenarioSimulation;
}

export function ScenarioSimulator({ scenario }: ScenarioSimulatorProps) {
  const [currentStepId, setCurrentStepId] = useState<string>(scenario.initialStepId);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [stepHistory, setStepHistory] = useState<{ stepId: string; option: ScenarioStepOption }[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentStep = scenario.steps[currentStepId];
  const selectedOption = currentStep?.options.find((opt) => opt.id === selectedOptionId);

  const totalScore = stepHistory.reduce((sum, h) => sum + h.option.points, 0);
  const maxPossible = (stepHistory.length || 1) * 25;
  const scorePct = Math.round((totalScore / maxPossible) * 100);

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
  };

  const handleProceed = () => {
    if (!selectedOption) return;

    const newHistory = [...stepHistory, { stepId: currentStepId, option: selectedOption }];
    setStepHistory(newHistory);

    if (selectedOption.nextStepId && scenario.steps[selectedOption.nextStepId]) {
      setCurrentStepId(selectedOption.nextStepId);
      setSelectedOptionId(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(scenario.initialStepId);
    setSelectedOptionId(null);
    setStepHistory([]);
    setIsFinished(false);
  };

  const getEvaluationBadge = (evaluation: ScenarioEvaluation) => {
    switch (evaluation) {
      case "optimal":
        return {
          icon: ShieldCheck,
          label: "Optimal Legal Action",
          className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "acceptable":
        return {
          icon: CheckCircle2,
          label: "Acceptable Action",
          className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "risky":
        return {
          icon: AlertTriangle,
          label: "Risky Action",
          className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "dangerous":
        return {
          icon: ShieldAlert,
          label: "Dangerous Mistake",
          className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
        };
    }
  };

  return (
    <Container size="narrow" gutter="page">
      {/* Back Link */}
      <Link
        href="/learn/scenarios"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        All Scenario Simulations
      </Link>

      {/* Scenario Briefing Card */}
      <div className="glass-strong border-brand/40 flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-brand/12 text-brand rounded-md px-2.5 py-1 text-xs font-bold tracking-wider uppercase">
              Interactive Legal Simulator
            </span>
            <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-semibold capitalize">
              {scenario.difficulty}
            </span>
          </div>
          <VerificationBadge
            source={scenario.source}
            status={scenario.verificationStatus}
            lastVerifiedAt={scenario.lastVerifiedAt}
          />
        </div>

        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {scenario.title}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
          {scenario.tagline}
        </p>

        <div className="border-border/60 bg-muted/20 text-muted-foreground rounded-2xl border p-4 text-xs sm:text-sm leading-relaxed">
          <strong className="text-foreground font-semibold">The Premise: </strong>
          {scenario.context}
        </div>
      </div>

      {/* Main Simulation View */}
      {!isFinished ? (
        <div className="mt-8 flex flex-col gap-6">
          {/* Step Update (if any) */}
          {currentStep?.situationUpdate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border-primary/30 flex items-start gap-3 rounded-2xl p-5"
            >
              <Scale className="text-primary mt-0.5 size-5 shrink-0" />
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-primary font-bold">Situation Update:</span>
                <p className="text-foreground/90 leading-relaxed">
                  {currentStep.situationUpdate}
                </p>
              </div>
            </motion.div>
          )}

          {/* Prompt */}
          <div className="glass flex flex-col gap-4 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-brand text-xs font-bold uppercase tracking-wider">
                Step {stepHistory.length + 1} Decision Point
              </span>
              <span className="text-muted-foreground text-xs font-medium">
                Score: {totalScore} XP
              </span>
            </div>
            <h2 className="text-foreground text-lg font-bold sm:text-xl">
              {currentStep?.prompt}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {currentStep?.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={Boolean(selectedOptionId)}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`glass text-foreground flex items-start gap-3.5 rounded-xl p-4 text-left text-sm transition-all ${
                      isSelected
                        ? "border-brand bg-brand/10 shadow-sm"
                        : "hover:border-border/80 hover:bg-muted/30"
                    } ${selectedOptionId ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isSelected
                          ? "bg-brand text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {opt.id.slice(-1).toUpperCase()}
                    </span>
                    <span className="leading-relaxed font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option Evaluation Feedback */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-strong flex flex-col gap-4 rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {(() => {
                    const badge = getEvaluationBadge(selectedOption.evaluation);
                    const Icon = badge.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}
                      >
                        <Icon className="size-3.5" />
                        {badge.label}
                      </span>
                    );
                  })()}
                  <span className="text-brand text-xs font-bold">
                    +{selectedOption.points} Points
                  </span>
                </div>

                <p className="text-foreground/95 text-sm leading-relaxed">
                  {selectedOption.feedback}
                </p>

                <div className="border-border/50 bg-muted/20 text-muted-foreground flex flex-col gap-1 rounded-xl border p-3 text-xs">
                  <div>
                    <strong className="text-foreground">Underlying Concept: </strong>
                    {selectedOption.legalConcept}
                  </div>
                  {selectedOption.statutorySection && (
                    <div>
                      <strong className="text-foreground">Statutory Section: </strong>
                      <span className="text-primary font-mono font-medium">
                        {selectedOption.statutorySection}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex justify-end">
                  <Button onClick={handleProceed} className="rounded-xl gap-1.5">
                    <span>
                      {selectedOption.nextStepId && scenario.steps[selectedOption.nextStepId]
                        ? "Continue Scenario"
                        : "Complete Simulation"}
                    </span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Debrief & Final Score */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 flex flex-col gap-6"
        >
          <div className="glass-strong border-brand/50 flex flex-col items-center gap-4 rounded-3xl p-8 text-center">
            <span className="bg-brand/15 text-brand flex size-14 items-center justify-center rounded-2xl shadow-sm">
              <Trophy className="size-7" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-brand text-xs font-bold uppercase tracking-wider">
                Simulation Debrief
              </span>
              <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
                Scenario Completed!
              </h2>
              <p className="text-muted-foreground text-sm">
                Final Decision Rating: <strong className="text-foreground">{totalScore} Points</strong> ({scorePct}%)
              </p>
            </div>

            <div className="border-border/50 bg-muted/15 flex w-full max-w-md flex-col gap-2 rounded-2xl border p-4 text-left text-xs">
              <h4 className="text-foreground font-bold">Key Tactical Learnings:</h4>
              <ul className="flex flex-col gap-1 text-muted-foreground list-disc pl-4">
                {scenario.learningOutcomes.map((outcome, idx) => (
                  <li key={idx}>{outcome}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <Button onClick={handleRestart} variant="outline" className="glass rounded-xl gap-1.5">
                <RotateCcw className="size-4" />
                Retry Scenario
              </Button>
              <Link href="/learn/scenarios">
                <Button className="rounded-xl">More Scenarios</Button>
              </Link>
            </div>
          </div>

          {/* Discovery Cross Link */}
          <ContentDiscovery
            title="Where to go next"
            subtitle="Apply this scenario to real statutes, landmark judgments, and structured learning journeys."
            understandHref={
              scenario.relatedLessonSlugs[0]
                ? `/learn/student-rights/${scenario.relatedLessonSlugs[0]}`
                : undefined
            }
            understandLabel="Related Lesson"
            deeperHref={
              scenario.relatedLawSlugs[0]
                ? `/laws/${scenario.relatedLawSlugs[0]}`
                : undefined
            }
            deeperLabel="Relevant Statutory Act"
            precedentHref="/case-studies/puttaswamy-privacy-2017"
            precedentLabel="Related Landmark Precedents"
          />
        </motion.div>
      )}
    </Container>
  );
}
