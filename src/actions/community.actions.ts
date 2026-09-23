"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  citizenStorySchema,
  type CitizenStoryValues,
  contentFeedbackSchema,
  type ContentFeedbackValues,
} from "@/lib/validations";
import { communityService } from "@/services/db/community.service";
import type { ActionResult } from "./types";

/**
 * Submits a new citizen story for community moderation.
 */
export async function submitCitizenStoryAction(
  rawInput: CitizenStoryValues
): Promise<ActionResult<{ storyId: string; status: string }>> {
  try {
    const validated = citizenStorySchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    if (!client) {
      return {
        success: true,
        data: { storyId: "mock-offline-id", status: "pending" },
      };
    }

    const { data: { user } } = await client.auth.getUser();

    // Fetch author metadata from profile if available
    let authorName = "Citizen of India";
    let authorRole = "Verified Citizen";
    let authorInitials = "CI";

    if (user) {
      const { data: profile } = await client
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile && profile.full_name) {
        authorName = profile.full_name;
        authorRole = profile.role ?? "Citizen";
        authorInitials = profile.full_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
    }

    const authorId = user?.id ?? "00000000-0000-0000-0000-000000000000";

    const { data, error } = await client
      .from("citizen_stories")
      .insert({
        author_id: authorId,
        author_name: authorName,
        author_role: authorRole,
        author_initials: authorInitials,
        category: validated.category,
        title: validated.title,
        what_happened: validated.whatHappened,
        action_taken: validated.actionTaken,
        legal_outcome: validated.legalOutcome,
        resolution_status: validated.resolutionStatus,
        statutory_backing: validated.statutoryBacking ?? null,
        moderation_status: "pending",
      })
      .select("id, moderation_status")
      .single();

    if (error) {
      console.error("Story insert error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/community");
    return {
      success: true,
      data: { storyId: data.id, status: data.moderation_status },
    };
  } catch (err) {
    console.error("submitCitizenStoryAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Submission failed",
    };
  }
}

/**
 * Toggles helpful count on a citizen story.
 */
export async function toggleStoryHelpfulAction(
  storyId: string,
  helpful: boolean = true
): Promise<ActionResult<{ helpfulCount: number }>> {
  try {
    const newCount = await communityService.toggleHelpful(storyId, helpful);
    revalidatePath("/community");
    return { success: true, data: { helpfulCount: newCount } };
  } catch (err) {
    console.error("toggleStoryHelpfulAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to record helpful vote",
    };
  }
}

/**
 * Submits citizen/lawyer report or feedback on legal content accuracy.
 */
export async function submitContentFeedbackAction(
  rawInput: ContentFeedbackValues
): Promise<ActionResult<{ id: string }>> {
  try {
    const validated = contentFeedbackSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    if (!client) {
      return { success: true, data: { id: "mock-report-id" } };
    }

    const { data: { user } } = await client.auth.getUser();
    const reporterId = user?.id ?? "00000000-0000-0000-0000-000000000000";

    const { data, error } = await client
      .from("content_reports")
      .insert({
        reporter_id: reporterId,
        content_type: validated.contentType,
        content_id: validated.contentSlug,
        reason: validated.feedbackType,
        details: validated.comment ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: { id: data.id } };
  } catch (err) {
    console.error("submitContentFeedbackAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to record feedback",
    };
  }
}
