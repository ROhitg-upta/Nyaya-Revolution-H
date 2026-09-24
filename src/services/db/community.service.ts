import {
  COMMUNITY_CATEGORIES,
  DEFAULT_LEARNING_BRIDGES,
  INITIAL_COMMUNITY_STORIES,
  INITIAL_STORY_COMMENTS,
} from "@/constants/community";
import { generateStorySlug, sanitizeUserText } from "@/lib/sanitization";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  CommunityStorySubmissionValues,
  StoryCommentCreateValues,
  StoryReportCreateValues,
} from "@/lib/validations";
import { analyzeCitizenStoryWithAI } from "@/services/ai/community-ai.service";
import type {
  CommunityCategorySlug,
  CommunityFeedFilter,
  CommunityStory,
  StoryComment,
  StoryIdentityMode,
  StoryMediaAttachment,
  StoryModerationStatus,
  StoryType,
  StoryVisibility,
} from "@/types/community";

// In-memory runtime store for immediate UX feedback & offline/demo resilience
const runtimeStories: CommunityStory[] = [...INITIAL_COMMUNITY_STORIES];
const runtimeComments: StoryComment[] = [...INITIAL_STORY_COMMENTS];
const runtimeHelpfulByUser = new Map<string, Set<string>>();
const runtimeSavedByUser = new Map<string, Set<string>>();

function resolveCategoryConfig(category: string) {
  return (
    COMMUNITY_CATEGORIES.find((c) => c.slug === category) ||
    COMMUNITY_CATEGORIES[0]
  );
}

function formatAuthorDisplay(
  identityMode: StoryIdentityMode,
  rawName?: string,
  rawRole?: string,
  state?: string
): { authorName: string; authorRole: string; authorInitials: string } {
  const locationSuffix = state && state !== "All India" ? ` • ${state}` : "";
  if (identityMode === "anonymous") {
    return {
      authorName: "Citizen Contributor (Anonymous)",
      authorRole: `Verified Community Member${locationSuffix}`,
      authorInitials: "CC",
    };
  }
  const cleanName = sanitizeUserText(rawName || "Citizen Contributor");
  const displayName =
    identityMode === "pseudonym" && !cleanName.toLowerCase().includes("pseudonym")
      ? `${cleanName} (Pseudonym)`
      : cleanName;
  const initials =
    cleanName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "NR";

  return {
    authorName: displayName,
    authorRole: sanitizeUserText(rawRole || `Citizen${locationSuffix}`),
    authorInitials: initials,
  };
}

function mapDbRowToCommunityStory(
  row: Record<string, unknown>,
  mediaRows: Record<string, unknown>[] = []
): CommunityStory {
  const categorySlug = ((row.category as string) || "general_awareness") as CommunityCategorySlug;
  const categoryConfig = resolveCategoryConfig(categorySlug);

  const mappedMedia: StoryMediaAttachment[] = mediaRows.map((m, idx) => ({
    id: String(m.id || `media-${idx}`),
    storyId: String(m.story_id || row.id),
    mediaType: ((m.media_type as string) || "image") as "image" | "audio" | "video",
    storageBucket: String(m.storage_bucket || "community-media"),
    storagePath: String(m.storage_path || ""),
    url: String(m.public_url || ""),
    fileName: String(m.file_name || "attachment"),
    mimeType: String(m.mime_type || "image/jpeg"),
    fileSizeBytes: Number(m.file_size_bytes || 1024),
    durationSeconds: m.duration_seconds ? Number(m.duration_seconds) : undefined,
    width: m.width ? Number(m.width) : undefined,
    height: m.height ? Number(m.height) : undefined,
    caption: m.caption ? String(m.caption) : undefined,
    altText: m.alt_text ? String(m.alt_text) : undefined,
    posterUrl: m.poster_url ? String(m.poster_url) : undefined,
    transcript: m.transcript ? String(m.transcript) : undefined,
    sortOrder: Number(m.sort_order ?? idx),
  }));

  const rawModStatus = String(row.moderation_status || "published");
  const normalizedStatus: StoryModerationStatus =
    rawModStatus === "approved"
      ? "published"
      : rawModStatus === "pending"
        ? "under_review"
        : (rawModStatus as StoryModerationStatus);

  return {
    id: String(row.id),
    slug: String(
      row.slug ||
        generateStorySlug(String(row.title || "story"), String(row.id).slice(0, 6))
    ),
    authorId: row.author_id ? String(row.author_id) : undefined,
    authorName: String(row.author_name || "Citizen Contributor"),
    authorRole: String(row.author_role || "Community Member"),
    authorInitials: String(row.author_initials || "CC"),
    identityMode: ((row.identity_mode as string) || "pseudonym") as StoryIdentityMode,
    visibility: ((row.visibility as string) || "public") as StoryVisibility,
    storyType: ((row.story_type as string) || "experience") as StoryType,
    category: categoryConfig.slug,
    categoryLabel: categoryConfig.label,
    locationState: row.location_state ? String(row.location_state) : "All India",
    title: String(row.title || ""),
    whatHappened: String(row.what_happened || ""),
    warningSigns: row.warning_signs ? String(row.warning_signs) : undefined,
    actionTaken: String(row.action_taken || ""),
    legalOutcome: String(row.legal_outcome || ""),
    citizenTakeaway: String(
      row.citizen_takeaway ||
        "Preserve written trails, official docket numbers, and verify rights through statutory procedures."
    ),
    resolutionStatus: String(row.resolution_status || "Resolved"),
    statutoryBacking: String(row.statutory_backing || categoryConfig.label),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    media: mappedMedia,
    aiSummary: row.ai_summary ? String(row.ai_summary) : undefined,
    aiEducationalNote: row.ai_educational_note
      ? String(row.ai_educational_note)
      : undefined,
    learningBridge:
      DEFAULT_LEARNING_BRIDGES[categoryConfig.slug] ||
      DEFAULT_LEARNING_BRIDGES.general_awareness,
    helpfulCount: Number(row.helpful_count || 0),
    commentCount: Number(row.comment_count || 0),
    moderationStatus: normalizedStatus,
    moderationNotes: row.moderation_notes ? String(row.moderation_notes) : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
    publishedAt: row.published_at ? String(row.published_at) : undefined,
  };
}

export const communityService = {
  /**
   * Backwards-compatible getter + full Sprint E10 filtered feed query.
   * Strictly returns ONLY published + public/community_only stories in public feeds.
   */
  async getStories(category?: string): Promise<CommunityStory[]> {
    return this.getCommunityFeed({
      category: (category as CommunityCategorySlug) || "all",
      mode: "for_you",
    });
  },

  async getCommunityFeed(
    filter: CommunityFeedFilter = {},
    viewerUserId?: string
  ): Promise<CommunityStory[]> {
    let combinedStories: CommunityStory[] = [...runtimeStories];

    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data: dbRows, error } = await supabase
          .from("citizen_stories")
          .select("*")
          .in("moderation_status", ["published", "approved"])
          .in("visibility", ["public", "community_only"])
          .order("created_at", { ascending: false })
          .limit(30);

        if (!error && dbRows && dbRows.length > 0) {
          const typedRows = dbRows as Record<string, unknown>[];
          const storyIds = typedRows.map((r) => String(r.id));
          const { data: mediaData } = await supabase
            .from("story_media")
            .select("*")
            .in("story_id", storyIds)
            .order("sort_order", { ascending: true });

          const mediaByStory = new Map<string, Record<string, unknown>[]>();
          ((mediaData || []) as Record<string, unknown>[]).forEach((m) => {
            const sid = String(m.story_id);
            const list = mediaByStory.get(sid) || [];
            list.push(m);
            mediaByStory.set(sid, list);
          });

          const mappedDbStories = typedRows.map((row) =>
            mapDbRowToCommunityStory(
              row,
              mediaByStory.get(String(row.id)) || []
            )
          );

          const existingIds = new Set(mappedDbStories.map((s) => s.id));
          combinedStories = [
            ...mappedDbStories,
            ...runtimeStories.filter((s) => !existingIds.has(s.id)),
          ];
        }
      }
    } catch {
      // Fallback to runtimeStories smoothly
    }

    let results = combinedStories.filter(
      (s) =>
        s.moderationStatus === "published" &&
        (s.visibility === "public" || s.visibility === "community_only")
    );

    if (filter.category && filter.category !== "all") {
      results = results.filter((s) => s.category === filter.category);
    }

    if (filter.storyType && filter.storyType !== "all") {
      results = results.filter((s) => s.storyType === filter.storyType);
    }

    if (filter.tag) {
      const targetTag = filter.tag.toLowerCase();
      results = results.filter((s) =>
        s.tags.some((t) => t.toLowerCase() === targetTag)
      );
    }

    if (filter.mediaOnly) {
      results = results.filter((s) => s.media.length > 0);
    }

    if (filter.searchQuery && filter.searchQuery.trim().length > 0) {
      const q = filter.searchQuery.trim().toLowerCase();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.whatHappened.toLowerCase().includes(q) ||
          s.actionTaken.toLowerCase().includes(q) ||
          s.citizenTakeaway.toLowerCase().includes(q) ||
          s.statutoryBacking.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const mode = filter.mode || "for_you";
    if (mode === "latest") {
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (mode === "most_helpful") {
      results.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else {
      results.sort((a, b) => {
        const scoreA = a.helpfulCount + (a.media.length > 0 ? 25 : 0);
        const scoreB = b.helpfulCount + (b.media.length > 0 ? 25 : 0);
        return scoreB - scoreA;
      });
    }

    if (viewerUserId) {
      const helpfulSet = runtimeHelpfulByUser.get(viewerUserId) || new Set();
      const savedSet = runtimeSavedByUser.get(viewerUserId) || new Set();
      results = results.map((s) => ({
        ...s,
        isHelpfulByUser: helpfulSet.has(s.id),
        isSavedByUser: savedSet.has(s.id),
      }));
    }

    return results;
  },

  async getStoryBySlugOrId(
    slugOrId: string,
    viewerUserId?: string
  ): Promise<CommunityStory | null> {
    const localMatch = runtimeStories.find(
      (s) => s.slug === slugOrId || s.id === slugOrId
    );

    let targetStory: CommunityStory | null = localMatch || null;

    if (!targetStory) {
      try {
        const supabase = await createSupabaseServerClient();
        if (supabase) {
          const { data: row } = await supabase
            .from("citizen_stories")
            .select("*")
            .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
            .maybeSingle();

          if (row) {
            const typedRow = row as Record<string, unknown>;
            const { data: mediaRows } = await supabase
              .from("story_media")
              .select("*")
              .eq("story_id", String(typedRow.id))
              .order("sort_order", { ascending: true });

            targetStory = mapDbRowToCommunityStory(
              typedRow,
              (mediaRows || []) as Record<string, unknown>[]
            );
          }
        }
      } catch {
        // Ignore DB error if offline
      }
    }

    if (!targetStory) return null;

    const isOwner = Boolean(
      viewerUserId && targetStory.authorId === viewerUserId
    );
    const isPubliclyAccessible =
      targetStory.moderationStatus === "published" &&
      targetStory.visibility !== "private_draft";

    if (!isPubliclyAccessible && !isOwner) {
      return null;
    }

    if (viewerUserId) {
      const helpfulSet = runtimeHelpfulByUser.get(viewerUserId) || new Set();
      const savedSet = runtimeSavedByUser.get(viewerUserId) || new Set();
      return {
        ...targetStory,
        isHelpfulByUser: helpfulSet.has(targetStory.id),
        isSavedByUser: savedSet.has(targetStory.id),
      };
    }

    return targetStory;
  },

  async getUserOwnStories(userId?: string): Promise<CommunityStory[]> {
    const ownRuntime = runtimeStories.filter(
      (s) =>
        (userId && s.authorId === userId) ||
        s.authorId === "local-citizen-author"
    );

    if (!userId) {
      return ownRuntime;
    }

    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data: rows } = await supabase
          .from("citizen_stories")
          .select("*")
          .eq("author_id", userId)
          .order("updated_at", { ascending: false });

        if (rows && rows.length > 0) {
          const mapped = (rows as Record<string, unknown>[]).map((r) =>
            mapDbRowToCommunityStory(r)
          );
          const ids = new Set(mapped.map((m) => m.id));
          return [...mapped, ...ownRuntime.filter((r) => !ids.has(r.id))];
        }
      }
    } catch {
      // Fallback to ownRuntime
    }

    return ownRuntime;
  },

  async saveCitizenStory(
    values: CommunityStorySubmissionValues,
    user?: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null
  ): Promise<{ story: CommunityStory; isEdit: boolean }> {
    const cleanTitle = sanitizeUserText(values.title);
    const cleanWhatHappened = sanitizeUserText(values.whatHappened);
    const cleanWarningSigns = sanitizeUserText(values.warningSigns || "");
    const cleanActionTaken = sanitizeUserText(values.actionTaken);
    const cleanOutcome = sanitizeUserText(values.legalOutcome);
    const cleanTakeaway = sanitizeUserText(values.citizenTakeaway);

    const aiAnalysis = await analyzeCitizenStoryWithAI({
      title: cleanTitle,
      whatHappened: cleanWhatHappened,
      actionTaken: cleanActionTaken,
      legalOutcome: cleanOutcome,
      citizenTakeaway: cleanTakeaway,
      category: values.category,
    });

    const authorId = user?.id || "local-citizen-author";
    const fallbackName =
      values.authorDisplayName ||
      (user?.user_metadata?.full_name as string) ||
      user?.email?.split("@")[0] ||
      "Citizen Contributor";

    const authorDisplay = formatAuthorDisplay(
      values.identityMode,
      fallbackName,
      values.authorRoleLabel,
      values.locationState
    );

    const categoryConfig = resolveCategoryConfig(values.category);
    const isDraft =
      values.saveAsDraft || values.visibility === "private_draft";

    const targetModerationStatus: StoryModerationStatus = isDraft
      ? "draft"
      : aiAnalysis.privacyWarnings.length > 0
        ? "under_review"
        : "published";

    const nowIso = new Date().toISOString();
    const existingIndex = values.storyId
      ? runtimeStories.findIndex((s) => s.id === values.storyId)
      : -1;
    const isEdit = existingIndex >= 0;

    const storyId =
      values.storyId ||
      `story-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const slug =
      isEdit && runtimeStories[existingIndex]
        ? runtimeStories[existingIndex].slug
        : generateStorySlug(cleanTitle);

    const attachments: StoryMediaAttachment[] = (values.media || []).map(
      (m, index) => ({
        id: m.id || `media-${Date.now()}-${index}`,
        storyId,
        mediaType: m.mediaType,
        storageBucket: "community-media",
        storagePath: m.storagePath,
        url: m.url,
        fileName: m.fileName,
        mimeType: m.mimeType,
        fileSizeBytes: m.fileSizeBytes,
        durationSeconds: m.durationSeconds,
        width: m.width,
        height: m.height,
        caption: m.caption ? sanitizeUserText(m.caption) : undefined,
        altText: m.altText ? sanitizeUserText(m.altText) : cleanTitle,
        posterUrl: m.posterUrl,
        transcript: m.transcript ? sanitizeUserText(m.transcript) : undefined,
        sortOrder: index,
      })
    );

    const newStory: CommunityStory = {
      id: storyId,
      slug,
      authorId,
      authorName: authorDisplay.authorName,
      authorRole: authorDisplay.authorRole,
      authorInitials: authorDisplay.authorInitials,
      identityMode: values.identityMode,
      visibility: values.visibility,
      storyType: values.storyType,
      category: values.category,
      categoryLabel: categoryConfig.label,
      locationState: values.locationState || "All India",
      title: cleanTitle,
      whatHappened: cleanWhatHappened,
      warningSigns: cleanWarningSigns || undefined,
      actionTaken: cleanActionTaken,
      legalOutcome: cleanOutcome,
      citizenTakeaway: cleanTakeaway,
      resolutionStatus:
        values.resolutionStatus === "resolved"
          ? "Resolved"
          : values.resolutionStatus === "mediated"
            ? "Mediated"
            : "Ongoing",
      statutoryBacking:
        sanitizeUserText(values.statutoryBacking || "") ||
        aiAnalysis.learningBridge.legalAreaTitle,
      tags:
        values.tags.length > 0 ? values.tags : aiAnalysis.suggestedTags,
      media: attachments,
      aiSummary: sanitizeUserText(values.aiSummary || aiAnalysis.aiSummary),
      aiEducationalNote: sanitizeUserText(
        values.aiEducationalNote || aiAnalysis.aiEducationalNote
      ),
      learningBridge: aiAnalysis.learningBridge,
      helpfulCount: isEdit ? runtimeStories[existingIndex].helpfulCount : 1,
      commentCount: isEdit ? runtimeStories[existingIndex].commentCount : 0,
      moderationStatus: targetModerationStatus,
      moderationNotes:
        aiAnalysis.privacyWarnings.length > 0
          ? `Held for privacy check: ${aiAnalysis.privacyWarnings.join(" ")}`
          : undefined,
      createdAt: isEdit ? runtimeStories[existingIndex].createdAt : nowIso,
      updatedAt: nowIso,
      publishedAt:
        targetModerationStatus === "published" ? nowIso : undefined,
    };

    if (isEdit) {
      runtimeStories[existingIndex] = newStory;
    } else {
      runtimeStories.unshift(newStory);
    }

    return { story: newStory, isEdit };
  },

  async deleteUserStory(
    storyId: string,
    userId?: string
  ): Promise<{ deleted: boolean; mediaPaths: string[] }> {
    const idx = runtimeStories.findIndex((s) => s.id === storyId);
    let mediaPaths: string[] = [];

    if (idx >= 0) {
      const target = runtimeStories[idx];
      if (
        userId &&
        target.authorId &&
        target.authorId !== userId &&
        target.authorId !== "local-citizen-author"
      ) {
        return { deleted: false, mediaPaths: [] };
      }
      mediaPaths = target.media.map((m) => m.storagePath);
      runtimeStories.splice(idx, 1);
    }

    if (userId) {
      try {
        const supabase = await createSupabaseServerClient();
        if (supabase) {
          await supabase
            .from("citizen_stories")
            .delete()
            .eq("id", storyId)
            .eq("author_id", userId);
        }
      } catch {
        // Ignore if offline
      }
    }

    return { deleted: true, mediaPaths };
  },

  async toggleHelpful(
    storyId: string,
    userId: string
  ): Promise<{ helpful: boolean; helpfulCount: number }> {
    const userSet = runtimeHelpfulByUser.get(userId) || new Set<string>();
    const story = runtimeStories.find((s) => s.id === storyId);
    let isNowHelpful = false;

    if (userSet.has(storyId)) {
      userSet.delete(storyId);
      isNowHelpful = false;
      if (story) {
        story.helpfulCount = Math.max(0, story.helpfulCount - 1);
      }
    } else {
      userSet.add(storyId);
      isNowHelpful = true;
      if (story) {
        story.helpfulCount += 1;
      }
    }
    runtimeHelpfulByUser.set(userId, userSet);

    return {
      helpful: isNowHelpful,
      helpfulCount: story ? story.helpfulCount : isNowHelpful ? 1 : 0,
    };
  },

  async toggleBookmark(
    storyId: string,
    storySlug: string,
    userId: string
  ): Promise<{ saved: boolean }> {
    const userSet = runtimeSavedByUser.get(userId) || new Set<string>();
    let isSaved = false;

    if (userSet.has(storyId)) {
      userSet.delete(storyId);
      isSaved = false;
    } else {
      userSet.add(storyId);
      isSaved = true;
    }
    runtimeSavedByUser.set(userId, userSet);

    return { saved: isSaved };
  },

  async getStoryComments(storyId: string): Promise<StoryComment[]> {
    const localComments = runtimeComments.filter((c) => c.storyId === storyId);

    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data } = await supabase
          .from("story_comments")
          .select("*")
          .eq("story_id", storyId)
          .eq("moderation_status", "approved")
          .order("created_at", { ascending: true });

        if (data && data.length > 0) {
          const dbComments: StoryComment[] = (
            data as Record<string, unknown>[]
          ).map((row) => ({
            id: String(row.id),
            storyId: String(row.story_id),
            authorId: row.author_id ? String(row.author_id) : undefined,
            authorName: String(row.author_name || "Citizen Contributor"),
            authorRole: String(row.author_role || "Community Member"),
            identityMode: ((row.identity_mode as string) ||
              "pseudonym") as StoryIdentityMode,
            content: String(row.content || ""),
            isEdited: Boolean(row.is_edited),
            createdAt: String(row.created_at),
            updatedAt: String(row.updated_at || row.created_at),
          }));
          const ids = new Set(dbComments.map((c) => c.id));
          return [
            ...dbComments,
            ...localComments.filter((c) => !ids.has(c.id)),
          ];
        }
      }
    } catch {
      // Fallback to localComments
    }

    return localComments;
  },

  async addStoryComment(
    values: StoryCommentCreateValues,
    user?: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null
  ): Promise<StoryComment> {
    const cleanContent = sanitizeUserText(values.content);
    const fallbackName =
      values.authorDisplayName ||
      (user?.user_metadata?.full_name as string) ||
      user?.email?.split("@")[0] ||
      "Citizen Contributor";

    const authorDisplay = formatAuthorDisplay(
      values.identityMode,
      fallbackName,
      "Community Contributor"
    );

    const nowIso = new Date().toISOString();
    const comment: StoryComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      storyId: values.storyId,
      authorId: user?.id || "local-citizen-author",
      authorName: authorDisplay.authorName,
      authorRole: authorDisplay.authorRole,
      identityMode: values.identityMode,
      content: cleanContent,
      isEdited: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    runtimeComments.push(comment);
    const parentStory = runtimeStories.find((s) => s.id === values.storyId);
    if (parentStory) {
      parentStory.commentCount += 1;
    }

    return comment;
  },

  async reportContent(
    values: StoryReportCreateValues,
    reporterId?: string
  ): Promise<{ reportId: string }> {
    const reportId = `rep-${Date.now()}-${reporterId ? reporterId.slice(0, 4) : "anon"}`;
    return { reportId };
  },
};
