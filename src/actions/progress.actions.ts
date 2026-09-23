"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  bookmarkSchema,
  type BookmarkValues,
  practiceCompletionSchema,
  type PracticeCompletionValues,
  progressUpdateSchema,
  type ProgressUpdateValues,
} from "@/lib/validations";
import { progressService } from "@/services/db/progress.service";
import type { ActionResult } from "./types";

export type { ActionResult } from "./types";

/**
 * Server action to record user progress on a lesson.
 */
export async function updateLessonProgressAction(
  rawInput: ProgressUpdateValues
): Promise<ActionResult<{ completed: boolean }>> {
  try {
    const validated = progressUpdateSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    let userId: string | undefined;
    if (client) {
      const { data: { user } } = await client.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      // In offline/guest mode, return success so client state updates gracefully
      return { success: true, data: { completed: validated.completed } };
    }

    const ok = await progressService.updateLessonProgress(
      userId,
      validated.journeySlug,
      validated.lessonSlug,
      validated.completed
    );

    if (ok) {
      revalidatePath(`/learn/${validated.journeySlug}`);
      revalidatePath("/learn");
      revalidatePath("/profile");
      return { success: true, data: { completed: validated.completed } };
    }

    return { success: false, error: "Failed to persist lesson progress" };
  } catch (err) {
    console.error("updateLessonProgressAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown validation error",
    };
  }
}

/**
 * Server action to toggle or save a bookmark.
 */
export async function bookmarkItemAction(
  rawInput: BookmarkValues
): Promise<ActionResult<{ bookmarked: boolean }>> {
  try {
    const validated = bookmarkSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    if (!client) {
      return { success: true, data: { bookmarked: true } };
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { success: false, error: "Authentication required to bookmark items" };
    }

    // Check if bookmark already exists
    const { data: existing } = await client
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("content_type", validated.targetType)
      .eq("content_id", validated.targetSlug)
      .maybeSingle();

    if (existing) {
      // Remove bookmark
      await client.from("bookmarks").delete().eq("id", existing.id);
      revalidatePath("/profile");
      return { success: true, data: { bookmarked: false } };
    } else {
      // Create bookmark
      await client.from("bookmarks").insert({
        user_id: user.id,
        content_type: validated.targetType,
        content_id: validated.targetSlug,
      });
      revalidatePath("/profile");
      return { success: true, data: { bookmarked: true } };
    }
  } catch (err) {
    console.error("bookmarkItemAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Bookmark action failed",
    };
  }
}

/**
 * Server action to record AI practice scenario or simulation completion,
 * award XP, and advance user streaks.
 */
export async function recordPracticeCompletionAction(
  rawInput: PracticeCompletionValues
): Promise<
  ActionResult<{
    xpAwarded: number;
    totalXp: number;
    currentLevel: number;
    leveledUp: boolean;
    currentStreak: number;
    longestStreak: number;
    streakIncreased: boolean;
  }>
> {
  try {
    const validated = practiceCompletionSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    let userId = "guest-user";
    if (client) {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (user?.id) userId = user.id;
    }

    const result = await progressService.recordPracticeCompletion(
      userId,
      validated.scenarioId,
      validated.conceptName,
      validated.score,
      validated.maxScore,
      validated.isCorrect,
      validated.xpEarned
    );

    revalidatePath("/learn/scenarios");
    revalidatePath("/learn");
    revalidatePath("/profile");

    return { success: true, data: result };
  } catch (err) {
    console.error("recordPracticeCompletionAction error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to record practice completion",
    };
  }
}

