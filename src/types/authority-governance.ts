/**
 * SPRINT E13 — MODERATOR AUTHORITY INGESTION CONSOLE & AUTOMATED SOURCE FRESHNESS ENGINE
 * Unified Domain Types, Versioned Import Contracts & Governance State Machine
 */

import type {
  AuthorityVerificationLifecycleState,
  LegalAuthorityTier,
  LegalServiceAuthorityRecord,
} from "./action-engine";

export type AuthorizedGovernanceRole =
  | "admin"
  | "moderator"
  | "advocate"
  | "legal_educator";

export type ImportBatchLifecycleStatus =
  | "uploaded"
  | "validating"
  | "ready_for_review"
  | "processing"
  | "published"
  | "rolled_back"
  | "failed"
  | "cancelled";

export type ImportRowClassification =
  | "NEW"
  | "CHANGED"
  | "UNCHANGED"
  | "CONFLICTED"
  | "INVALID"
  | "DUPLICATE";

export type AuthorityConflictType =
  | "contact_conflict"
  | "address_conflict"
  | "website_conflict"
  | "jurisdiction_conflict"
  | "authority_name_conflict"
  | "source_conflict"
  | "status_conflict";

export type ReviewDecisionType =
  | "accept_import"
  | "keep_existing"
  | "manual_edit"
  | "reject_import"
  | "request_reverification"
  | "archive_record";

/**
 * Versioned Import Contract (Phase 4)
 * Maps strictly by field names (never relies on CSV column position).
 */
export interface AuthorityImportSchemaV1 {
  schemaVersion: "1.0";
  authorityName: string;
  authorityType: LegalAuthorityTier;
  state: string;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  helpline?: string | null;
  email?: string | null;
  website?: string | null;
  jurisdiction?: string;
  services?: string[];
  sourceUrl: string;
  sourceType:
    | "nalsa_portal"
    | "official_slsa_directory"
    | "ecourts_district_portal";
}

export interface FieldDiffItem {
  field: string;
  label: string;
  currentValue: string | null;
  importedValue: string | null;
  conflictType: AuthorityConflictType;
}

export interface AuthorityImportPreviewRow {
  rowNumber: number;
  classification: ImportRowClassification;
  authorityName: string;
  authorityType: string;
  state: string;
  district: string | null;
  sourceUrl: string;
  existingAuthorityId?: string;
  validationErrors: string[];
  fieldDiffs: FieldDiffItem[];
  normalizedCandidate: LegalServiceAuthorityRecord | null;
}

export interface AuthorityImportBatch {
  id: string;
  sourceLabel: string;
  fileFormat: "csv" | "json";
  uploadedBy: string;
  uploadedRole: AuthorizedGovernanceRole;
  status: ImportBatchLifecycleStatus;
  sourceFingerprint: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  newRecords: number;
  changedRecords: number;
  conflictedRecords: number;
  duplicateRecords: number;
  unchangedRecords: number;
  rows: AuthorityImportPreviewRow[];
  preBatchSnapshots: LegalServiceAuthorityRecord[];
  publishedAuthorityIds: string[];
  rollbackReason?: string;
  rolledBackBy?: string;
  rolledBackAt?: string;
  startedAt: string;
  completedAt?: string;
}

export interface AuthorityConflictItem {
  id: string;
  authorityId: string;
  authorityName: string;
  state: string;
  district: string | null;
  batchId?: string;
  conflictTypes: AuthorityConflictType[];
  sourceA: {
    sourceUrl: string;
    sourceType: string;
    verifiedAt: string;
  };
  sourceB: {
    sourceUrl: string;
    sourceType: string;
    importedAt: string;
  };
  currentPublishedRecord: LegalServiceAuthorityRecord;
  importedCandidateRecord: LegalServiceAuthorityRecord;
  fieldDiffs: FieldDiffItem[];
  resolutionStatus: "open" | ReviewDecisionType;
  resolvedBy?: string;
  resolvedAt?: string;
  reviewNotes?: string;
  createdAt: string;
}

export interface AuthorityVersionSnapshot {
  id: string;
  authorityId: string;
  versionNumber: number;
  snapshot: LegalServiceAuthorityRecord;
  sourceUrl: string;
  sourceType: string;
  verifiedBy: string;
  changeReason: string;
  importBatchId?: string;
  isActivePublished: boolean;
  createdAt: string;
}

export type GovernanceAuditEventType =
  | "import"
  | "validation"
  | "conflict_created"
  | "conflict_resolved"
  | "record_edited"
  | "record_verified"
  | "record_published"
  | "record_archived"
  | "rollback"
  | "source_health_change";

export interface AuthorityAuditLogItem {
  id: string;
  authorityId: string;
  authorityName: string;
  eventType: GovernanceAuditEventType;
  actorName: string;
  actorRole: AuthorizedGovernanceRole;
  summary: string;
  reviewNotes?: string;
  versionNumber?: number;
  batchId?: string;
  createdAt: string;
}

export interface VerificationFreshnessInfo {
  status: "fresh" | "review_due" | "stale";
  ageInDays: number;
  daysUntilReview: number;
  reason: string;
}

export interface VerificationHealthDashboardStats {
  totalGoverned: number;
  freshCount: number;
  reviewDueCount: number;
  staleCount: number;
  conflictedCount: number;
  missingSourceCount: number;
  openImportBatches: number;
  healthySourcesCount: number;
  sourcesRequiringReviewCount: number;
}

export interface SourceHealthCheckItem {
  id: string;
  authorityId: string;
  authorityName: string;
  state: string;
  sourceUrl: string;
  httpStatus: number | null;
  reachable: boolean;
  redirectUrl: string | null;
  lastObservedFingerprint: string;
  fingerprintChanged: boolean;
  requiresHumanReview: boolean;
  statusNote: string;
  lastCheckedAt: string;
  lastSuccessfulCheckAt: string | null;
}

export interface ModeratorNotificationItem {
  id: string;
  eventType:
    | "conflict_detected"
    | "record_stale"
    | "review_due"
    | "source_unreachable"
    | "import_ready"
    | "batch_rolled_back";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  relatedAuthorityId?: string;
  relatedBatchId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface GovernedAuthorityDetail {
  authority: LegalServiceAuthorityRecord & {
    activeVersion: number;
    freshness: VerificationFreshnessInfo;
  };
  versions: AuthorityVersionSnapshot[];
  auditTimeline: AuthorityAuditLogItem[];
  openConflicts: AuthorityConflictItem[];
  sourceHealth: SourceHealthCheckItem | null;
}

export interface ManualAuthorityEditInput {
  authorityId: string;
  officeName: string;
  phone: string | null;
  helpline: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  jurisdiction: string;
  sourceUrl: string;
  verificationStatus: AuthorityVerificationLifecycleState;
  reviewNotes: string;
  reviewerName: string;
  reviewerRole: AuthorizedGovernanceRole;
}
