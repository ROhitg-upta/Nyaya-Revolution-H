/**
 * SPRINT E10 — COMMUNITY VOICE, CITIZEN STORIES, MEDIA UPLOAD & STORY-TO-LEARNING PLATFORM
 * Domain Types & Contracts
 */

export type StoryType =
  | "experience"
  | "awareness"
  | "outcome"
  | "learning"
  | "question"
  | "resource";

export type StoryVisibility =
  | "public"
  | "community_only"
  | "unlisted"
  | "private_draft";

export type StoryIdentityMode = "real_name" | "pseudonym" | "anonymous";

export type StoryModerationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "published"
  | "needs_edit"
  | "rejected"
  | "archived";

export type CommunityCategorySlug =
  | "consumer"
  | "cyber"
  | "workplace"
  | "tenancy"
  | "police_rights"
  | "family_safety"
  | "education"
  | "rti_civic"
  | "traffic_transport"
  | "general_awareness";

export type StoryMediaType = "image" | "audio" | "video";

export interface StoryMediaAttachment {
  id: string;
  storyId: string;
  mediaType: StoryMediaType;
  storageBucket: string;
  storagePath: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  caption?: string;
  altText?: string;
  posterUrl?: string;
  transcript?: string;
  sortOrder: number;
}

export interface StoryLearningBridgeData {
  situationSlug: string;
  situationTitle: string;
  legalAreaTitle: string;
  rightsSummary: string;
  journeySlug: string;
  journeyTitle: string;
  recommendedLessons: {
    slug: string;
    title: string;
    durationMinutes: number;
  }[];
  relatedConcepts: {
    title: string;
    statutoryReference: string;
    summary: string;
  }[];
  practiceScenarioPrompt: string;
}

export interface CommunityStory {
  id: string;
  slug: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  identityMode: StoryIdentityMode;
  visibility: StoryVisibility;
  storyType: StoryType;
  category: CommunityCategorySlug;
  categoryLabel: string;
  locationState?: string;
  title: string;
  whatHappened: string;
  warningSigns?: string;
  actionTaken: string;
  legalOutcome: string;
  citizenTakeaway: string;
  resolutionStatus: string;
  statutoryBacking: string;
  tags: string[];
  media: StoryMediaAttachment[];
  aiSummary?: string;
  aiEducationalNote?: string;
  learningBridge: StoryLearningBridgeData;
  helpfulCount: number;
  commentCount: number;
  isHelpfulByUser?: boolean;
  isSavedByUser?: boolean;
  moderationStatus: StoryModerationStatus;
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StoryComment {
  id: string;
  storyId: string;
  authorId?: string;
  authorName: string;
  authorRole: string;
  identityMode: StoryIdentityMode;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityNotification {
  id: string;
  userId: string;
  actorName?: string;
  notificationType:
    | "story_submitted"
    | "story_published"
    | "story_needs_edit"
    | "story_rejected"
    | "story_helpful"
    | "story_comment"
    | "learning_recommendation";
  title: string;
  message: string;
  storyId?: string;
  storySlug?: string;
  isRead: boolean;
  createdAt: string;
}

export type CommunityFeedMode = "for_you" | "latest" | "most_helpful";

export interface CommunityFeedFilter {
  mode?: CommunityFeedMode;
  category?: CommunityCategorySlug | "all";
  storyType?: StoryType | "all";
  tag?: string;
  searchQuery?: string;
  mediaOnly?: boolean;
}

export interface PIIWarningDetection {
  hasPII: boolean;
  detectedTypes: ("aadhaar" | "phone" | "pan" | "email" | "bank_account")[];
  redactedPreview: string;
  warningMessages: string[];
}

export interface AIStoryAssistanceResult {
  suggestedCategory: CommunityCategorySlug;
  suggestedTags: string[];
  suggestedTitle: string;
  aiSummary: string;
  aiEducationalNote: string;
  privacyWarnings: string[];
  learningBridge: StoryLearningBridgeData;
}
