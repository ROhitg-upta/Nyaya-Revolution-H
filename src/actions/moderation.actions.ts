"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  moderationActionSchema,
  type ModerationActionValues,
  situationSubmissionSchema,
  type SituationSubmissionValues,
} from "@/lib/validations";
import { moderationService } from "@/services/db/moderation.service";
import type {
  ModerationQueueFilter,
  ModerationQueueItem,
  ModerationStats,
} from "@/types";
import type { ActionResult } from "./types";

/**
 * Retrieves items currently in the moderator verification queue.
 */
export async function getModerationQueueAction(
  filters?: ModerationQueueFilter
): Promise<ActionResult<ModerationQueueItem[]>> {
  try {
    const items = await moderationService.getModerationQueue(filters);
    return { success: true, data: items };
  } catch (err) {
    console.error("getModerationQueueAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load moderation queue",
    };
  }
}

/**
 * Retrieves summary statistics for the moderation dashboard.
 */
export async function getModerationStatsAction(): Promise<ActionResult<ModerationStats>> {
  try {
    const stats = await moderationService.getModerationStats();
    return { success: true, data: stats };
  } catch (err) {
    console.error("getModerationStatsAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load moderation stats",
    };
  }
}

/**
 * Verifies (approves, rejects, or requests revision for) a queue item.
 */
export async function verifyContentItemAction(
  rawInput: ModerationActionValues
): Promise<ActionResult<{ newStatus: string }>> {
  try {
    const validated = moderationActionSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    let moderatorId = "00000000-0000-0000-0000-000000000000";
    if (client) {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (user?.id) moderatorId = user.id;
    }

    const res = await moderationService.verifyContentItem(moderatorId, validated);

    revalidatePath("/moderation");
    revalidatePath("/situations");
    revalidatePath("/community");
    revalidatePath("/learn");

    return { success: true, data: { newStatus: res.newStatus } };
  } catch (err) {
    console.error("verifyContentItemAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to execute moderation action",
    };
  }
}

/**
 * Submits a new citizen legal situation for verification by advocates.
 */
export async function submitSituationAction(
  rawInput: SituationSubmissionValues
): Promise<ActionResult<{ situationId: string }>> {
  try {
    const validated = situationSubmissionSchema.parse(rawInput);
    const client = await createSupabaseServerClient();

    let authorId = "00000000-0000-0000-0000-000000000000";
    if (client) {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (user?.id) authorId = user.id;
    }

    const res = await moderationService.submitCitizenSituation(authorId, validated);

    revalidatePath("/moderation");
    revalidatePath("/situations");

    return { success: true, data: { situationId: res.situationId } };
  } catch (err) {
    console.error("submitSituationAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit situation",
    };
  }
}
