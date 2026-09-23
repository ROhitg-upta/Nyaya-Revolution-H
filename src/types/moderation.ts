/**
 * Content Governance & Moderation Domain Types.
 *
 * Shapes data for the advocate/educator verification queue,
 * citizen submission lifecycle, and audit logs.
 */

export type ModerationEntityType = "situation" | "quiz" | "story" | "report";

export type ModerationStatus =
  | "draft"
  | "needs_review"
  | "pending"
  | "verified"
  | "published"
  | "rejected"
  | "flagged"
  | "archived";

export interface ModerationQueueItem {
  id: string;
  entityType: ModerationEntityType;
  title: string;
  summary: string;
  authorName: string;
  authorRole: string;
  submittedAt: string;
  status: ModerationStatus;
  category: string;
  statutoryReference?: string;
  riskRating?: "low" | "medium" | "high" | "urgent";
  details: {
    whatHappened?: string;
    immediateActions?: string[];
    dontDo?: string[];
    options?: {
      id: string;
      text: string;
      isRecommended: boolean;
      rationale: string;
    }[];
    correctExplanation?: string;
    reason?: string;
    [key: string]: unknown;
  };
}

export interface ModerationQueueFilter {
  entityType?: "all" | ModerationEntityType;
  status?: "all" | "pending_review" | "verified" | "rejected";
  search?: string;
}

export interface VerificationActionInput {
  entityType: ModerationEntityType;
  entityId: string;
  decision: "approve" | "reject" | "revise";
  reviewNotes?: string;
  revisedData?: Record<string, unknown>;
}

export interface ModerationStats {
  pendingReview: number;
  verifiedToday: number;
  flaggedCount: number;
  avgReviewMinutes: number;
}
