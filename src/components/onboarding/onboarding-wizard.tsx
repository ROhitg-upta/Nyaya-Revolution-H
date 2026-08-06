"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { StepPreview } from "@/components/onboarding/step-preview";
import {
  StepGoal,
  StepInterests,
  StepOccupation,
  StepProfile,
} from "@/components/onboarding/steps";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { routes } from "@/constants";
import { ArrowLeft, ArrowRight, Sparkles } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type OnboardingData, emptyOnboardingData } from "@/types";

const STEP_LABELS = ["Profile", "Occupation", "Interests", "Goal", "Preview"];
const TOTAL = STEP_LABELS.length;
const ONBOARDING_KEY = "nyaya.onboarding";

export function OnboardingWizard() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [finishing, setFinishing] = useState(false);

  const update = (patch: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const stepValid = [
    data.name.trim().length >= 2 && !!data.ageGroup && !!data.language,
    !!data.occupation,
    data.interests.length >= 1,
    !!data.goal,
    true,
  ][step];

  const isLast = step === TOTAL - 1;

  function goNext() {
    if (!stepValid) return;
    if (isLast) {
      void finish();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  async function finish() {
    setFinishing(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
    }
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Your legal journey begins now!");
    router.push(routes.home);
  }

  const offset = reduceMotion ? 0 : 40;
  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? offset : -offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -offset : offset }),
  };

  return (
    <div className="glass-strong w-full max-w-2xl rounded-3xl p-6 sm:p-8">
      <OnboardingProgress current={step} total={TOTAL} labels={STEP_LABELS} />

      <div className="mt-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 ? <StepProfile data={data} update={update} /> : null}
            {step === 1 ? <StepOccupation data={data} update={update} /> : null}
            {step === 2 ? <StepInterests data={data} update={update} /> : null}
            {step === 3 ? <StepGoal data={data} update={update} /> : null}
            {step === 4 ? <StepPreview data={data} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          onClick={goBack}
          className={cn("rounded-xl", step === 0 && "invisible")}
        >
          <ArrowLeft />
          Back
        </Button>
        <Button
          size="lg"
          onClick={goNext}
          disabled={!stepValid || finishing}
          className="glow-hover rounded-xl px-6"
        >
          {finishing ? (
            <Spinner size="sm" label="Setting up" />
          ) : isLast ? (
            <>
              Start My Legal Journey
              <Sparkles />
            </>
          ) : (
            <>
              Continue
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
