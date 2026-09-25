"use server";

import { revalidatePath } from "next/cache";
import {
  addOrUpdateTimelineEvent,
  addParticipantToWorkspace,
  addPrivateAttachmentToWorkspace,
  applyRedactionDecision,
  computeWorkspaceCompletion,
  deletePrivateAttachmentFromWorkspace,
  deleteTimelineEvent,
  getWorkspaceForUser,
  linkVerifiedAuthoritySnapshotToWorkspace,
  scanWorkspaceForSensitivePii,
  toggleChecklistItem,
  updateReviewGateAndExportDossier,
  updateWorkspaceSummaryAndLanguages,
} from "@/services/action/case-prep-workspace.service";
import type {
  CasePrepReviewGateState,
  DossierLanguage,
} from "@/types/case-prep";

export async function fetchCasePrepWorkspaceAction(params: {
  workspaceId?: string;
  requestingUserId: string;
}) {
  return getWorkspaceForUser(params);
}

export async function saveCasePrepSummaryAction(params: {
  workspaceId: string;
  requestingUserId: string;
  title: string;
  situationCategory: string;
  situationSummaryEn: string;
  situationSummaryHi?: string;
  userDescriptionEn: string;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  userPrivateNotes: string;
}) {
  const ws = updateWorkspaceSummaryAndLanguages(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
    piiDetections: scanWorkspaceForSensitivePii(ws),
  };
}

export async function addCasePrepTimelineEventAction(params: {
  workspaceId: string;
  requestingUserId: string;
  eventDate: string;
  isApproximateDate: boolean;
  eventTitle: string;
  actionTaken: string;
  responseReceived: string;
  sourceOrNote: string;
}) {
  const ws = addOrUpdateTimelineEvent(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
    piiDetections: scanWorkspaceForSensitivePii(ws),
  };
}

export async function deleteCasePrepTimelineEventAction(params: {
  workspaceId: string;
  requestingUserId: string;
  eventId: string;
}) {
  const ws = deleteTimelineEvent(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
  };
}

export async function toggleCasePrepChecklistAction(params: {
  workspaceId: string;
  requestingUserId: string;
  itemId: string;
  userNote?: string;
}) {
  const ws = toggleChecklistItem(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
  };
}

export async function addCasePrepParticipantAction(params: {
  workspaceId: string;
  requestingUserId: string;
  roleLabel: string;
  nameOrLabel: string;
  organization: string;
  contactReference: string;
}) {
  const ws = addParticipantToWorkspace(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
    piiDetections: scanWorkspaceForSensitivePii(ws),
  };
}

export async function uploadCasePrepAttachmentMetadataAction(params: {
  workspaceId: string;
  requestingUserId: string;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  description: string;
}) {
  const ws = addPrivateAttachmentToWorkspace(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
  };
}

export async function deleteCasePrepAttachmentAction(params: {
  workspaceId: string;
  requestingUserId: string;
  attachmentId: string;
}) {
  const ws = deletePrivateAttachmentFromWorkspace(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
  };
}

export async function linkCasePrepAuthorityAction(params: {
  workspaceId: string;
  requestingUserId: string;
  authorityId: string;
}) {
  const ws = linkVerifiedAuthoritySnapshotToWorkspace(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
  };
}

export async function applyCasePrepPiiDecisionAction(params: {
  workspaceId: string;
  requestingUserId: string;
  matchedValue: string;
  redactedReplacement: string;
  decision: "keep" | "redact";
}) {
  const ws = applyRedactionDecision(params);
  revalidatePath("/action-center/case-prep");
  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
    piiDetections: scanWorkspaceForSensitivePii(ws),
  };
}

export async function exportVerifiedCasePrepDossierAction(params: {
  workspaceId: string;
  requestingUserId: string;
  reviewGate: CasePrepReviewGateState;
  exportFormat: "pdf_print" | "bilingual_dossier" | "offline_text";
}) {
  const res = updateReviewGateAndExportDossier(params);
  revalidatePath("/action-center/case-prep");
  return {
    ...res,
    completion: computeWorkspaceCompletion(res.workspace),
  };
}
