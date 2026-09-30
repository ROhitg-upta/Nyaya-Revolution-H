/**
 * ============================================================================
 * SPRINT E18 — MULTI-WORKSPACE CITIZEN CASE BINDER & LINKED GRIEVANCE TYPES
 * ============================================================================
 * Domain models for higher-level organizational binders over multiple workspaces.
 * Strictly adheres to: Linked != Merged, Data Isolation, and Draft Status.
 */

import type {
  CasePrepAuthoritySnapshot,
  CitizenCasePrepWorkspace,
  DossierLanguage,
} from "./case-prep";

export type BinderStatus = "draft" | "active" | "ready_for_review" | "archived";

export type WorkspaceRelationshipType =
  | "primary"
  | "related"
  | "followup"
  | "group_member"
  | "supporting";

export type DocketReferenceType =
  | "docket"
  | "diary"
  | "acknowledgment"
  | "complaint"
  | "application"
  | "reference";

export type DocketStatus =
  | "pending"
  | "acknowledged"
  | "under_investigation"
  | "hearing_scheduled"
  | "resolved"
  | "closed";

export interface DocketReferenceRecord {
  id: string;
  binderId: string;
  workspaceId: string;
  workspaceTitle?: string;
  referenceType: DocketReferenceType;
  referenceNumber: string;
  authorityName: string;
  submittedAt: string; // YYYY-MM-DD
  status: DocketStatus;
  notes: string;
  createdAt: string;
}

export interface BinderParticipantRecord {
  id: string;
  binderId: string;
  roleLabel: string;
  nameOrLabel: string;
  organization: string;
  contactReference: string;
  dataMinimized: boolean;
  createdAt: string;
}

export interface BinderWorkspaceLink {
  id: string;
  binderId: string;
  workspaceId: string;
  relationshipType: WorkspaceRelationshipType;
  displayOrder: number;
  notes: string;
  addedAt: string;
  workspaceSnapshot?: CitizenCasePrepWorkspace;
}

export interface BinderTimelineEvent {
  id: string;
  sourceWorkspaceId: string;
  sourceWorkspaceTitle: string;
  eventDate: string; // YYYY-MM-DD
  isApproximateDate: boolean;
  eventTitle: string;
  eventTitleHi?: string;
  actionTaken: string;
  responseReceived: string;
  sourceOrNote: string;
  sortOrder: number;
  hasChronologyConflict?: boolean;
  conflictDetails?: string;
}

export type ProceduralTemplateType =
  | "first-appeal-generic-v1"
  | "grievance-escalation-v1"
  | "conciliation-followup-v1"
  | "authority-followup-request-v1";

export interface ProceduralTemplateSpec {
  templateId: ProceduralTemplateType;
  templateTitle: string;
  templateTitleHi: string;
  description: string;
  version: string;
  sourceType: "EDUCATIONAL_DRAFT" | "STATUTORY_FRAMEWORK_TEMPLATE";
  statutoryReference: string;
  officialFormAvailable: boolean;
  officialFormNotice: string;
  educationalDraftNotice: string;
}

export const PROCEDURAL_TEMPLATES_CATALOG: Record<
  ProceduralTemplateType,
  ProceduralTemplateSpec
> = {
  "first-appeal-generic-v1": {
    templateId: "first-appeal-generic-v1",
    templateTitle: "First Appeal / Review Representation — Generic",
    templateTitleHi: "प्रथम अपील / समीक्षा अभ्यावेदन — सामान्य प्रारूप",
    description:
      "Structured representation for filing before a designated First Appellate Authority or Departmental Review Officer following the expiry of a standard statutory response window (e.g., RTI Section 19(1) or administrative complaint escalation).",
    version: "v1.2",
    sourceType: "STATUTORY_FRAMEWORK_TEMPLATE",
    statutoryReference:
      "Section 19(1), Right to Information Act, 2005 / General Departmental Appellate Procedures",
    officialFormAvailable: true,
    officialFormNotice:
      "Note: If the relevant State Government or public authority prescribes a specific statutory appeal form (e.g., Form-D), transcribe these structured facts onto that official form.",
    educationalDraftNotice:
      "EDUCATIONAL DRAFT — User Review Required. Verify all dates, reference numbers, and facts before submission.",
  },
  "grievance-escalation-v1": {
    templateId: "grievance-escalation-v1",
    templateTitle: "Higher-Level Grievance Escalation Representation",
    templateTitleHi: "उच्च-स्तरीय शिकायत निवारण अभ्यावेदन",
    description:
      "Formal representation to a Nodal Officer, Banking Ombudsman, or Regulatory Authority when an initial docket (e.g., NCH 1915, RBI CMS, or NCRP 1930) remains unanswered or unresolved.",
    version: "v1.1",
    sourceType: "EDUCATIONAL_DRAFT",
    statutoryReference:
      "Consumer Protection Act, 2019 / RBI Integrated Ombudsman Scheme / CPGRAMS Guidelines",
    officialFormAvailable: false,
    officialFormNotice:
      "No single uniform national form is mandatory. This structured representation format aligns with consumer commission and ombudsman review norms.",
    educationalDraftNotice:
      "EDUCATIONAL DRAFT — User Review Required. Contains user-provided facts and chronologies only.",
  },
  "conciliation-followup-v1": {
    templateId: "conciliation-followup-v1",
    templateTitle: "Pre-Litigation Conciliation Follow-Up Brief",
    templateTitleHi: "प्री-लिटिगेशन सुलह अनुवर्ती विवरण",
    description:
      "Conciliation brief for DLSA Front Office or Permanent Lok Adalat summarizing prior undisputed notices, payments made, and points for amicable settlement.",
    version: "v1.0",
    sourceType: "STATUTORY_FRAMEWORK_TEMPLATE",
    statutoryReference:
      "Sections 19–22B, Legal Services Authorities Act, 1987 & NALSA Conciliation Guidelines",
    officialFormAvailable: true,
    officialFormNotice:
      "DLSA Front Offices provide standard pre-litigation application slips. This brief serves as the structured factual annexure.",
    educationalDraftNotice:
      "EDUCATIONAL DRAFT — User Review Required. Prepared for voluntary discussion before a conciliator.",
  },
  "authority-followup-request-v1": {
    templateId: "authority-followup-request-v1",
    templateTitle: "Procedural Follow-Up & Status Inward Request",
    templateTitleHi: "प्रक्रियात्मक अनुवर्ती एवं स्थिति अनुरोध पत्र",
    description:
      "Concise follow-up representation citing initial filing diary/docket number and requesting written status update on pending enquiry or verification.",
    version: "v1.0",
    sourceType: "EDUCATIONAL_DRAFT",
    statutoryReference:
      "Citizen Charter Guidelines & Public Service Delivery Standards",
    officialFormAvailable: false,
    officialFormNotice:
      "Standard written representation citing diary/inward receipt numbers.",
    educationalDraftNotice:
      "EDUCATIONAL DRAFT — User Review Required. Organize relevant diary receipts before sending.",
  },
};

export interface BinderReviewGateState {
  workspaceSeparationConfirmed: boolean;
  factsAccurate: boolean;
  datesVerified: boolean;
  docketsChecked: boolean;
  attachmentsAuthorized: boolean;
  draftWordingReviewed: boolean;
  privacyPreserved: boolean;
}

export interface BinderDocumentPackRecord {
  id: string;
  binderId: string;
  packVersion: number;
  title: string;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  templateType: ProceduralTemplateType;
  selectedWorkspaceIds: string[];
  selectedDocumentIds: string[];
  selectedAttachmentIds: string[];
  reviewGateCompleted: boolean;
  authoritySnapshots: CasePrepAuthoritySnapshot[];
  exportedAt: string;
  generatedTextEn?: string;
  generatedTextHi?: string;
}

export interface BinderStatusMatrixItem {
  workspaceId: string;
  workspaceTitle: string;
  category: string;
  relationshipType: WorkspaceRelationshipType;
  operationalStatus: string;
  e16SelfReportedOutcome: string;
  e17FollowupWindowStatus: string;
  elapsedDays: number;
  docketsCount: number;
  documentsCount: number;
  attachmentsCount: number;
}

export interface CitizenCaseBinder {
  id: string;
  ownerUserId: string;
  title: string;
  description: string;
  status: BinderStatus;
  primaryCategory: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  linkedWorkspaces: BinderWorkspaceLink[];
  dockets: DocketReferenceRecord[];
  participants: BinderParticipantRecord[];
  documentPacks: BinderDocumentPackRecord[];
}

export interface CreateBinderInput {
  title: string;
  description?: string;
  primaryCategory?: string;
  initialWorkspaceIds?: {
    workspaceId: string;
    relationshipType: WorkspaceRelationshipType;
  }[];
}

export interface AddWorkspaceToBinderInput {
  binderId: string;
  workspaceId: string;
  relationshipType: WorkspaceRelationshipType;
  notes?: string;
}

export interface AddDocketReferenceInput {
  binderId: string;
  workspaceId: string;
  referenceType: DocketReferenceType;
  referenceNumber: string;
  authorityName: string;
  submittedAt: string;
  status?: DocketStatus;
  notes?: string;
}

export interface GenerateBinderPackInput {
  binderId: string;
  packTitle: string;
  templateType: ProceduralTemplateType;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  selectedWorkspaceIds: string[];
  selectedAttachmentIds: string[];
  reviewGate: BinderReviewGateState;
}

export interface BinderExpiringHandoffSession {
  id: string;
  binderId: string;
  tokenHash: string;
  createdByName: string;
  clinicOrHelperNote: string;
  permittedSectionKeys: string[];
  selectedWorkspaceIds: string[];
  expiresAt: string;
  createdAt: string;
  status: "active" | "expired" | "revoked";
  binderSnapshot: {
    title: string;
    description: string;
    primaryCategory: string;
    linkedWorkspacesSummary: {
      id: string;
      title: string;
      category: string;
      relationshipType: string;
    }[];
    masterTimelineCount: number;
    docketsCount: number;
  };
}
