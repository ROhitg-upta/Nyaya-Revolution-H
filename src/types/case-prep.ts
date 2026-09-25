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
