/**
 * SPRINT E14 — CITIZEN CASE PREPARATION WORKSPACE, BILINGUAL DOSSIER & ASSISTED PARA-LEGAL HANDOFF
 * Domain Types, Authority Version Snapshots, Bilingual Presentation & Review Gate Contracts
 */

export type CasePrepWorkspaceStatus =
  | "draft"
  | "ready_for_review"
  | "exported"
  | "archived";

export type DossierLanguage = "en" | "hi";

export type AuthoritySourceLayer =
  | "USER_FACTS"
  | "VERIFIED_LEGAL_CONTENT"
  | "OFFICIAL_RESOURCE"
  | "AI_ASSISTANCE"
  | "COMMUNITY_EXPERIENCE";

export type AllowedAttachmentMimeType =
  | "application/pdf"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "text/plain";

export interface CasePrepTimelineEvent {
  id: string;
  eventDate: string; // YYYY-MM-DD
  isApproximateDate: boolean;
  eventTitle: string;
  eventTitleHi?: string;
  actionTaken: string;
  responseReceived: string;
  sourceOrNote: string;
  sortOrder: number;
}

export interface CasePrepParticipant {
  id: string;
  roleLabel: string;
  nameOrLabel: string;
  organization: string;
  contactReference: string;
}

export interface CasePrepChecklistItem {
  id: string;
  itemLabel: string;
  itemLabelHi: string;
  category: string;
  isChecked: boolean;
  userNote: string;
}

export interface CasePrepAttachmentItem {
  id: string;
  workspaceId: string;
  storagePath: string;
  filename: string;
  mimeType: AllowedAttachmentMimeType;
  fileSizeBytes: number;
  description: string;
  uploadedAt: string;
}

export interface CasePrepAuthoritySnapshot {
  id: string;
  authorityId: string;
  authorityName: string;
  authorityType: string;
  state: string;
  district: string | null;
  publishedVersionNumber: number;
  phone: string | null;
  helpline: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  sourceUrl: string;
  sourceType: string;
  verifiedAtSnapshot: string;
  capturedAt: string;
  liveFreshnessWarning:
    | "none"
    | "stale"
    | "review_due"
    | "conflicted"
    | "version_changed";
  liveWarningMessage?: string;
}

export interface CasePrepLinkedDraft {
  id: string;
  title: string;
  templateType: string;
  templateVersion: string;
  status: "draft" | "reviewed";
  createdAt: string;
  sourceReferences: string[];
  summaryExcerpt: string;
}

export interface CasePrepSourceBundleItem {
  id: string;
  sourceLayer: AuthoritySourceLayer;
  title: string;
  referenceCode: string;
  href: string;
  verifiedDate: string;
}

export interface CasePrepLokAdalatBridge {
  included: boolean;
  disputeCategory: string;
  disputeSummary: string;
  readinessChecklistCount: string;
  settlementDiscussionPoints: string[];
  preparationQuestions: string[];
  educationalStatusNotice: string;
}

export interface CasePrepQuestionItem {
  id: string;
  questionEn: string;
  questionHi: string;
  origin: "DETERMINISTIC_EDUCATIONAL" | "AI_SUGGESTION" | "USER_ADDED";
  isIncluded: boolean;
}

export interface CasePrepPiiDetectionItem {
  id: string;
  patternType: "aadhaar" | "pan" | "phone" | "email" | "bank_account";
  label: string;
  matchedValue: string;
  redactedReplacement: string;
  locationLabel: string;
  userDecision: "pending" | "keep" | "redact";
}

export interface CasePrepReviewGateState {
  factsCorrect: boolean;
  datesCorrect: boolean;
  removedUnnecessaryPrivateInfo: boolean;
  reviewedAttachedDocuments: boolean;
  checkedSelectedAuthority: boolean;
  reviewedGeneratedDrafts: boolean;
}

export interface CasePrepExportVersion {
  id: string;
  versionNumber: number;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  exportFormat: "pdf_print" | "bilingual_dossier" | "offline_text";
  exportedAt: string;
  authoritySnapshotVersion: number;
  authorityNameSnapshot: string;
  authoritySourceUrlSnapshot: string;
  titleSnapshot: string;
  summarySnapshotEn: string;
  summarySnapshotHi: string;
  timelineCountSnapshot: number;
  checklistCheckedCountSnapshot: number;
}

export interface CitizenCasePrepWorkspace {
  id: string;
  ownerUserId: string;
  title: string;
  status: CasePrepWorkspaceStatus;
  situationCategory: string;
  situationSlug: string;
  situationSummaryEn: string;
  situationSummaryHi: string;
  originalStoryRef: string;
  userDescriptionEn: string;
  userDescriptionHi: string;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  selectedState: string;
  selectedDistrict: string | null;
  timeline: CasePrepTimelineEvent[];
  participants: CasePrepParticipant[];
  checklist: CasePrepChecklistItem[];
  attachments: CasePrepAttachmentItem[];
  linkedAuthoritySnapshot: CasePrepAuthoritySnapshot | null;
  lokAdalatBridge: CasePrepLokAdalatBridge;
  linkedDrafts: CasePrepLinkedDraft[];
  sourceBundle: CasePrepSourceBundleItem[];
  questionsToDiscuss: CasePrepQuestionItem[];
  userPrivateNotes: string;
  reviewGate: CasePrepReviewGateState;
  exportHistory: CasePrepExportVersion[];
  createdAt: string;
  updatedAt: string;
  lastExportedAt: string | null;
}

export interface WorkspaceCompletionReport {
  completedCount: number;
  totalCount: number;
  percentage: number;
  sections: {
    id: string;
    label: string;
    isComplete: boolean;
    missingReason?: string;
  }[];
  missingRequiredForExport: string[];
}

// ============================================================================
// SPRINT E15 — ASSISTED PARA-LEGAL CLINIC MODE, EXPIRING HANDOFF & OFFLINE PWA
// ============================================================================

export type HandoffExpiryDuration = "30m" | "1h" | "4h" | "24h";

export type HandoffSectionKey =
  | "situationSummary"
  | "timeline"
  | "checklist"
  | "participants"
  | "verifiedResources"
  | "lokAdalatPreparation"
  | "existingDrafts"
  | "questions"
  | "notes";

export interface HandoffShareScope {
  sections: HandoffSectionKey[];
  includedAttachmentIds: string[]; // Opt-in only (default empty)
  purpose: string;
  shareLabel: string;
  expiryDuration: HandoffExpiryDuration;
  maxAccesses?: number;
}

export interface FrozenHandoffSnapshot {
  id: string;
  workspaceId: string;
  snapshotVersion: number;
  workspaceVersionAtShare: number;
  authorityVersionAtShare: number;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  selectedSections: HandoffSectionKey[];
  purpose: string;
  shareLabel: string;
  createdAt: string;
  // Frozen section payloads (undefined if excluded by citizen)
  title: string;
  situationCategory: string;
  situationSummaryEn?: string;
  situationSummaryHi?: string;
  timeline?: CasePrepTimelineEvent[];
  checklist?: CasePrepChecklistItem[];
  participants?: CasePrepParticipant[];
  linkedAuthoritySnapshot?: CasePrepAuthoritySnapshot | null;
  lokAdalatBridge?: CasePrepLokAdalatBridge;
  linkedDrafts?: CasePrepLinkedDraft[];
  questionsToDiscuss?: CasePrepQuestionItem[];
  userPrivateNotes?: string;
  includedAttachments: {
    id: string;
    filename: string;
    mimeType: AllowedAttachmentMimeType;
    fileSizeBytes: number;
    description: string;
  }[];
}

export interface CasePrepHandoffSession {
  id: string;
  workspaceId: string;
  createdByUserId: string;
  snapshotId: string;
  tokenHash: string; // SHA-256 hash at rest (plaintext never persisted)
  tokenPrefix: string; // Safe display prefix e.g. "nyh_8f2a..."
  purpose: string;
  shareLabel: string;
  expiresAt: string; // UTC ISO
  revokedAt: string | null;
  maxAccesses: number;
  accessCount: number;
  lastAccessedAt: string | null;
  createdAt: string;
  selectedCountsSummary: {
    hasSituationSummary: boolean;
    timelineCount: number;
    checklistCount: number;
    participantsCount: number;
    hasVerifiedAuthority: boolean;
    attachmentsCount: number;
    draftsCount: number;
  };
}

export interface CasePrepHandoffAuditEvent {
  id: string;
  sessionId?: string;
  workspaceId: string;
  eventType:
    | "handoff_created"
    | "handoff_opened"
    | "handoff_revoked"
    | "handoff_expired"
    | "invalid_token"
    | "rate_limit_triggered"
    | "sync_success"
    | "sync_conflict";
  safeSummary: string;
  createdAt: string;
}

export type OfflineSyncConnectionStatus =
  | "online_synced"
  | "offline_local_only"
  | "saved_on_device"
  | "syncing"
  | "conflict_detected";

