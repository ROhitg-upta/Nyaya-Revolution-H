"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  citizenStorySchema,
  CitizenStoryValues,
  communityStorySubmissionSchema,
  CommunityStorySubmissionValues,
  contentFeedbackSchema,
  ContentFeedbackValues,
  storyCommentCreateSchema,
  StoryCommentCreateValues,
  storyReportCreateSchema,
  StoryReportCreateValues,
} from "@/lib/validations";
import { analyzeCitizenStoryWithAI } from "@/services/ai/community-ai.service";
import { communityService } from "@/services/db/community.service";
import type {
  AIStoryAssistanceResult,
  CommunityCategorySlug,
  CommunityStory,
  StoryComment,
} from "@/types/community";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

function successResponse<T>(data: T): ActionResponse<T> {
  return { success: true, data };
}

function errorResponse<T>(code: string, message: string): ActionResponse<T> {
  return { success: false, error: { code, message } };
}

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  key: string,
  options: { windowMs: number; maxRequests: number }
): { allowed: boolean } {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true };
  }
  if (entry.count >= options.maxRequests) {
    return { allowed: false };
  }
  entry.count += 1;
  return { allowed: true };
}

async function resolveCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function submitCitizenStoryAction(
  input: CitizenStoryValues
): Promise<ActionResponse<{ id: string; status: string }>> {
  try {
    const parsed = citizenStorySchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Invalid story details"
      );
    }

    const user = await resolveCurrentUser();

    const rateKey = `story_submit:${user?.id || "anon"}`;
    const limit = checkRateLimit(rateKey, { windowMs: 3600_000, maxRequests: 5 });
    if (!limit.allowed) {
      return errorResponse(
        "RATE_LIMITED",
        "You have reached the hourly story submission limit. Please try again later."
      );
    }

    const { story } = await communityService.saveCitizenStory(
      {
        storyType: "experience",
        category: (parsed.data.category as CommunityCategorySlug) || "general_awareness",
        title: parsed.data.title,
        whatHappened: parsed.data.whatHappened,
        warningSigns: "",
        actionTaken: parsed.data.actionTaken,
        legalOutcome: parsed.data.legalOutcome,
        citizenTakeaway:
          "Document every step in writing and use verified public grievance portals.",
        resolutionStatus: parsed.data.resolutionStatus,
        statutoryBacking: parsed.data.statutoryBacking || "",
        locationState: "All India",
        tags: [],
        identityMode: "pseudonym",
        visibility: "public",
        saveAsDraft: false,
        media: [],
      },
      user
    );

    revalidatePath("/community");
    return successResponse({ id: story.id, status: story.moderationStatus });
  } catch (err) {
    console.error("[submitCitizenStoryAction] Unexpected error:", err);
    return errorResponse("INTERNAL_ERROR", "An unexpected error occurred");
  }
}

export async function publishOrSaveCommunityStoryAction(
  input: CommunityStorySubmissionValues
): Promise<
  ActionResponse<{
    story: CommunityStory;
    isEdit: boolean;
  }>
> {
  try {
    const parsed = communityStorySubmissionSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Please check all required story fields."
      );
    }

    const user = await resolveCurrentUser();
    const rateKey = `e10_story_save:${user?.id || "guest"}`;
    const limit = checkRateLimit(rateKey, { windowMs: 600_000, maxRequests: 12 });
    if (!limit.allowed) {
      return errorResponse(
        "RATE_LIMITED",
        "Too many story submissions in a short window. Please wait a few minutes."
      );
    }

    const result = await communityService.saveCitizenStory(parsed.data, user);

    revalidatePath("/community");
    revalidatePath("/community/my-stories");
    revalidatePath(`/community/stories/${result.story.slug}`);
    revalidatePath("/search");

    return successResponse(result);
  } catch (err) {
    console.error("[publishOrSaveCommunityStoryAction] Error:", err);
    return errorResponse(
      "INTERNAL_ERROR",
      "Unable to save your story right now. Please try again."
    );
  }
}

export async function generateAIStoryAssistanceAction(input: {
  title: string;
  whatHappened: string;
  actionTaken: string;
  legalOutcome: string;
  citizenTakeaway?: string;
  category?: CommunityCategorySlug;
}): Promise<ActionResponse<AIStoryAssistanceResult>> {
  try {
    if (!input.whatHappened || input.whatHappened.trim().length < 15) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Please describe what happened (at least 15 characters) before running AI assistance."
      );
    }

    const result = await analyzeCitizenStoryWithAI(input);
    return successResponse(result);
  } catch (err) {
    console.error("[generateAIStoryAssistanceAction] Error:", err);
    return errorResponse(
      "INTERNAL_ERROR",
      "Could not generate AI assistance at this moment."
    );
  }
}

export async function deleteCommunityStoryAction(
  storyId: string
): Promise<ActionResponse<{ deleted: boolean; mediaPaths: string[] }>> {
  try {
    if (!storyId) {
      return errorResponse("VALIDATION_ERROR", "Story ID is required.");
    }

    const user = await resolveCurrentUser();
    const res = await communityService.deleteUserStory(storyId, user?.id);
    if (!res.deleted) {
      return errorResponse(
        "FORBIDDEN",
        "You are only authorized to delete stories you created."
      );
    }

    revalidatePath("/community");
    revalidatePath("/community/my-stories");
    return successResponse(res);
  } catch (err) {
    console.error("[deleteCommunityStoryAction] Error:", err);
    return errorResponse("INTERNAL_ERROR", "Failed to delete story.");
  }
}

export async function toggleStoryHelpfulAction(
  storyId: string
): Promise<ActionResponse<{ helpful: boolean; helpfulCount?: number }>> {
  try {
    if (!storyId) {
      return errorResponse("VALIDATION_ERROR", "Story ID is required");
    }

    const user = await resolveCurrentUser();
    const actorId = user?.id || "citizen-session-viewer";
    const limit = checkRateLimit(`helpful:${actorId}`, {
      windowMs: 60_000,
      maxRequests: 30,
    });
    if (!limit.allowed) {
      return errorResponse("RATE_LIMITED", "Too many reactions. Slow down.");
    }

    const result = await communityService.toggleHelpful(storyId, actorId);
    revalidatePath("/community");
    return successResponse(result);
  } catch (err) {
    console.error("[toggleStoryHelpfulAction] Error:", err);
    return errorResponse("INTERNAL_ERROR", "Could not update helpful status");
  }
}

export async function toggleStoryBookmarkAction(
  storyId: string,
  storySlug: string
): Promise<ActionResponse<{ saved: boolean }>> {
  try {
    const user = await resolveCurrentUser();
    const actorId = user?.id || "citizen-session-viewer";
    const result = await communityService.toggleBookmark(
      storyId,
      storySlug,
      actorId
    );
    return successResponse(result);
  } catch (err) {
    console.error("[toggleStoryBookmarkAction] Error:", err);
    return errorResponse("INTERNAL_ERROR", "Could not update saved state");
  }
}

export async function createStoryCommentAction(
  input: StoryCommentCreateValues
): Promise<ActionResponse<{ comment: StoryComment }>> {
  try {
    const parsed = storyCommentCreateSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Invalid comment content."
      );
    }

    const user = await resolveCurrentUser();
    const actorId = user?.id || "citizen-session-viewer";
    const limit = checkRateLimit(`comment:${actorId}`, {
      windowMs: 60_000,
      maxRequests: 6,
    });
    if (!limit.allowed) {
      return errorResponse(
        "RATE_LIMITED",
        "Please wait a moment before posting another comment."
      );
    }

    const comment = await communityService.addStoryComment(parsed.data, user);
    revalidatePath("/community");
    return successResponse({ comment });
  } catch (err) {
    console.error("[createStoryCommentAction] Error:", err);
    return errorResponse("INTERNAL_ERROR", "Could not post comment.");
  }
}

export async function reportCommunityContentAction(
  input: StoryReportCreateValues
): Promise<ActionResponse<{ reportId: string }>> {
  try {
    const parsed = storyReportCreateSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Please select a valid report reason."
      );
    }

    const user = await resolveCurrentUser();
    const res = await communityService.reportContent(parsed.data, user?.id);
    return successResponse(res);
  } catch (err) {
    console.error("[reportCommunityContentAction] Error:", err);
    return errorResponse("INTERNAL_ERROR", "Failed to submit report.");
  }
}

export async function submitContentFeedbackAction(
  input: ContentFeedbackValues
): Promise<ActionResponse<{ submitted: boolean }>> {
  try {
    const parsed = contentFeedbackSchema.safeParse(input);
    if (!parsed.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        parsed.error.issues[0]?.message || "Invalid feedback input"
      );
    }
    return successResponse({ submitted: true });
  } catch {
    return successResponse({ submitted: true });
  }
}
