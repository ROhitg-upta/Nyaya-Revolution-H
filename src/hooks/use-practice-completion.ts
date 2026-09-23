"use client";

import { useState } from "react";
import { toast } from "sonner";
import { recordPracticeCompletionAction } from "@/actions/progress.actions";

export interface PracticeCompletionParams {
  scenarioId: string;
  conceptName: string;
  score: number;
  maxScore: number;
  isCorrect: boolean;
  xpEarned?: number;
}

export function usePracticeCompletion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{
    xpAwarded: number;
    totalXp: number;
    currentLevel: number;
    leveledUp: boolean;
    currentStreak: number;
    longestStreak: number;
    streakIncreased: boolean;
  } | null>(null);

  const recordCompletion = async (params: PracticeCompletionParams) => {
    setIsSubmitting(true);
    try {
      const res = await recordPracticeCompletionAction({
        scenarioId: params.scenarioId,
        conceptName: params.conceptName,
        score: params.score,
        maxScore: params.maxScore,
        isCorrect: params.isCorrect,
        xpEarned: params.xpEarned ?? 25,
      });

      if (res.success && res.data) {
        setLastResult(res.data);

        // Toast celebration
        if (res.data.leveledUp) {
          toast.success(
            `🎉 Level Up! You reached Level ${res.data.currentLevel}! (+${res.data.xpAwarded} XP)`,
            {
              description: `Streak active: ${res.data.currentStreak} days 🔥 · Total XP: ${res.data.totalXp}`,
              duration: 5000,
            }
          );
        } else if (res.data.streakIncreased) {
          toast.success(
            `+${res.data.xpAwarded} XP! 🔥 ${res.data.currentStreak}-Day Streak Extended!`,
            {
              description: `Keep learning daily to defend your constitutional rights.`,
              duration: 4000,
            }
          );
        } else {
          toast.success(`+${res.data.xpAwarded} XP Earned!`, {
            description: `Decision verified: ${params.conceptName}`,
            duration: 3500,
          });
        }

        return res.data;
      } else {
        console.warn("Practice completion recording notice:", res.error);
      }
    } catch (err) {
      console.warn("Failed to record practice completion:", err);
    } finally {
      setIsSubmitting(false);
    }

    return null;
  };

  return {
    recordCompletion,
    isSubmitting,
    lastResult,
  };
}
