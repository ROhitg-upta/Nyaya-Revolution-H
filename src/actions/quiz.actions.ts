"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { quizSubmissionSchema, type QuizSubmissionValues } from "@/lib/validations";
import { progressService } from "@/services/db/progress.service";

export interface QuizSubmissionResult {
  score: number;
  totalQuestions: number;
  xpEarned: number;
  passed: boolean;
  userTotalXp?: number;
  userLevel?: number;
}

export async function submitQuizAttemptAction(
  rawInput: QuizSubmissionValues
): Promise<{ success: boolean; data?: QuizSubmissionResult; error?: string }> {
  try {
    const validated = quizSubmissionSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    let userId: string | undefined;
    if (client) {
      const { data: { user } } = await client.auth.getUser();
      userId = user?.id;
    }

    const passed = validated.score / validated.totalQuestions >= 0.7;

    if (!userId) {
      // Offline/guest session: return calculated result without persistence
      return {
        success: true,
        data: {
          score: validated.score,
          totalQuestions: validated.totalQuestions,
          xpEarned: validated.xpEarned,
          passed,
        },
      };
    }

    // Persist quiz attempt atomically
    const ok = await progressService.recordQuizAttempt(
      userId,
      validated.journeySlug,
      validated.lessonSlug,
      validated.score,
      validated.totalQuestions,
      validated.xpEarned
    );

    if (ok) {
      // Revalidate cache for learning and profile views
      revalidatePath(`/learn/${validated.journeySlug}`);
      revalidatePath("/learn");
      revalidatePath("/profile");

      return {
        success: true,
        data: {
          score: validated.score,
          totalQuestions: validated.totalQuestions,
          xpEarned: validated.xpEarned,
          passed,
        },
      };
    }

    return {
      success: false,
      error: "Failed to persist quiz attempt in database",
    };
  } catch (err) {
    console.error("submitQuizAttemptAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Quiz submission failed",
    };
  }
}
