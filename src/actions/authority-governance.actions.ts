"use server";

import { revalidatePath } from "next/cache";
import {
  bulkMarkAuthoritiesReverified,
  getVerificationHealthStats,
  isAuthorizedGovernanceRole,
  listGovernedAuthorities,
  listImportBatches,
  listModeratorNotifications,
  listOpenAuthorityConflicts,
  listSourceHealthChecks,
  manualEditAuthorityRecord,
  parseAndValidateImportPayload,
  publishImportBatch,
  resolveAuthorityConflict,
  rollbackImportBatch,
  runSourceHealthCheck,
  scanResourcesForVerificationDue,
} from "@/services/governance/authority-governance.service";
import type {
  AuthorizedGovernanceRole,
  ManualAuthorityEditInput,
  ReviewDecisionType,
} from "@/types/authority-governance";

function assertAuthorizedRole(role: string): AuthorizedGovernanceRole {
  if (!isAuthorizedGovernanceRole(role)) {
    throw new Error(
      `Access Denied (403): Role '${role}' is not authorized to perform authority governance or ingestion mutations.`
    );
  }
  return role;
}

export async function fetchAuthorityGovernanceSnapshotAction() {
  return {
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
    conflicts: listOpenAuthorityConflicts(),
    batches: listImportBatches(),
    healthChecks: listSourceHealthChecks(),
    notifications: listModeratorNotifications(),
  };
}

export async function previewAuthorityImportBatchAction(params: {
  rawContent: string;
  fileFormat: "csv" | "json";
  sourceLabel: string;
  uploadedBy: string;
  uploadedRole: string;
}) {
  const role = assertAuthorizedRole(params.uploadedRole);
  const batch = parseAndValidateImportPayload({
    rawContent: params.rawContent,
    fileFormat: params.fileFormat,
    sourceLabel: params.sourceLabel,
    uploadedBy: params.uploadedBy,
    uploadedRole: role,
  });
  revalidatePath("/moderation");
  return {
    batch,
    stats: getVerificationHealthStats(),
    batches: listImportBatches(),
  };
}

export async function publishAuthorityImportBatchAction(params: {
  batchId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewNotes: string;
}) {
  const role = assertAuthorizedRole(params.reviewerRole);
  const res = publishImportBatch({
    batchId: params.batchId,
    reviewerName: params.reviewerName,
    reviewerRole: role,
    reviewNotes: params.reviewNotes,
  });
  revalidatePath("/moderation");
  revalidatePath("/action-center");
  revalidatePath("/search");
  return {
    ...res,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
    conflicts: listOpenAuthorityConflicts(),
    batches: listImportBatches(),
  };
}

export async function rollbackAuthorityImportBatchAction(params: {
  batchId: string;
  reviewerName: string;
  reviewerRole: string;
  reason: string;
}) {
  const role = assertAuthorizedRole(params.reviewerRole);
  const batch = rollbackImportBatch({
    batchId: params.batchId,
    reviewerName: params.reviewerName,
    reviewerRole: role,
    reason: params.reason,
  });
  revalidatePath("/moderation");
  revalidatePath("/action-center");
  revalidatePath("/search");
  return {
    batch,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
    batches: listImportBatches(),
  };
}

export async function resolveAuthorityConflictAction(params: {
  conflictId: string;
  decision: ReviewDecisionType;
  reviewerName: string;
  reviewerRole: string;
  reviewNotes: string;
  manualOverride?: Partial<{
    phone: string;
    address: string;
    website: string;
    sourceUrl: string;
  }>;
}) {
  const role = assertAuthorizedRole(params.reviewerRole);
  const res = resolveAuthorityConflict({
    conflictId: params.conflictId,
    decision: params.decision,
    reviewerName: params.reviewerName,
    reviewerRole: role,
    reviewNotes: params.reviewNotes,
    manualOverride: params.manualOverride,
  });
  revalidatePath("/moderation");
  revalidatePath("/action-center");
  revalidatePath("/search");
  return {
    ...res,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
    conflicts: listOpenAuthorityConflicts(),
  };
}

export async function manualEditAuthorityAction(
  input: Omit<ManualAuthorityEditInput, "reviewerRole"> & {
    reviewerRole: string;
  }
) {
  const role = assertAuthorizedRole(input.reviewerRole);
  const updatedAuthority = manualEditAuthorityRecord({
    ...input,
    reviewerRole: role,
  });
  revalidatePath("/moderation");
  revalidatePath("/action-center");
  revalidatePath("/search");
  return {
    updatedAuthority,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
  };
}

export async function bulkReverifyAuthoritiesAction(params: {
  authorityIds: string[];
  reviewerName: string;
  reviewerRole: string;
  notes: string;
}) {
  const role = assertAuthorizedRole(params.reviewerRole);
  const count = bulkMarkAuthoritiesReverified({
    authorityIds: params.authorityIds,
    reviewerName: params.reviewerName,
    reviewerRole: role,
    notes: params.notes,
  });
  revalidatePath("/moderation");
  revalidatePath("/action-center");
  return {
    updatedCount: count,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
  };
}

export async function triggerScheduledFreshnessScanAction(reviewerRole: string) {
  assertAuthorizedRole(reviewerRole);
  const report = scanResourcesForVerificationDue();
  revalidatePath("/moderation");
  return {
    report,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
  };
}

export async function triggerSourceHealthCheckAction(params: {
  reviewerRole: string;
  authorityId?: string;
}) {
  assertAuthorizedRole(params.reviewerRole);
  const healthChecks = runSourceHealthCheck(params.authorityId);
  revalidatePath("/moderation");
  return {
    healthChecks,
    stats: getVerificationHealthStats(),
    authorities: listGovernedAuthorities(),
  };
}
