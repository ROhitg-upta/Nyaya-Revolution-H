"use server";

/**
 * ============================================================================
 * SPRINT E18 — CITIZEN CASE BINDER SERVER ACTIONS
 * ============================================================================
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_AUTHORIZED_CITIZEN_ID,
} from "@/services/action/case-prep-workspace.service";
import {
  addDocketReference,
  createBinder,
  createBinderExpiringHandoff,
  getAvailableWorkspacesForUser,
  getBinderById,
  getBinderMasterTimeline,
  getBinderStatusMatrix,
  getOrCreateDefaultBinder,
  generateBinderDocumentPack,
  linkWorkspaceToBinder,
  unlinkWorkspaceFromBinder,
} from "@/services/action/case-binder.service";
import type {
  AddDocketReferenceInput,
  AddWorkspaceToBinderInput,
  BinderDocumentPackRecord,
  BinderExpiringHandoffSession,
  BinderStatusMatrixItem,
  BinderTimelineEvent,
  CitizenCaseBinder,
  CreateBinderInput,
  DocketReferenceRecord,
  GenerateBinderPackInput,
} from "@/types/case-binder";
import type { CitizenCasePrepWorkspace } from "@/types/case-prep";

async function getEffectiveUserId(): Promise<string> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return DEFAULT_AUTHORIZED_CITIZEN_ID;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || DEFAULT_AUTHORIZED_CITIZEN_ID;
  } catch {
    return DEFAULT_AUTHORIZED_CITIZEN_ID;
  }
}

export async function getOrCreateDefaultBinderAction(): Promise<CitizenCaseBinder> {
  const userId = await getEffectiveUserId();
  return getOrCreateDefaultBinder(userId);
}

export async function getBinderByIdAction(
  binderId: string
): Promise<CitizenCaseBinder | null> {
  const userId = await getEffectiveUserId();
  return getBinderById(binderId, userId);
}

export async function createBinderAction(
  input: CreateBinderInput
): Promise<CitizenCaseBinder> {
  const userId = await getEffectiveUserId();
  return createBinder(userId, input);
}

export async function linkWorkspaceToBinderAction(
  input: AddWorkspaceToBinderInput
): Promise<{ success: boolean; binder?: CitizenCaseBinder; error?: string }> {
  const userId = await getEffectiveUserId();
  return linkWorkspaceToBinder(input, userId);
}

export async function unlinkWorkspaceFromBinderAction(
  binderId: string,
  workspaceId: string
): Promise<{ success: boolean; binder?: CitizenCaseBinder; error?: string }> {
  const userId = await getEffectiveUserId();
  return unlinkWorkspaceFromBinder(binderId, workspaceId, userId);
}

export async function addDocketReferenceAction(
  input: AddDocketReferenceInput
): Promise<{ success: boolean; docket?: DocketReferenceRecord; error?: string }> {
  const userId = await getEffectiveUserId();
  return addDocketReference(input, userId);
}

export async function getBinderMasterTimelineAction(
  binderId: string
): Promise<BinderTimelineEvent[]> {
  const userId = await getEffectiveUserId();
  return getBinderMasterTimeline(binderId, userId);
}

export async function getBinderStatusMatrixAction(
  binderId: string
): Promise<BinderStatusMatrixItem[]> {
  const userId = await getEffectiveUserId();
  return getBinderStatusMatrix(binderId, userId);
}

export async function generateBinderDocumentPackAction(
  input: GenerateBinderPackInput
): Promise<{ success: boolean; pack?: BinderDocumentPackRecord; error?: string }> {
  const userId = await getEffectiveUserId();
  return generateBinderDocumentPack(input, userId);
}

export async function createBinderExpiringHandoffAction(params: {
  binderId: string;
  createdByName: string;
  clinicOrHelperNote: string;
  durationHours: number;
}): Promise<{
  success: boolean;
  handoffSession?: BinderExpiringHandoffSession;
  plaintextToken?: string;
  error?: string;
}> {
  const userId = await getEffectiveUserId();
  return createBinderExpiringHandoff({ ...params, userId });
}

export async function getAvailableWorkspacesAction(): Promise<
  CitizenCasePrepWorkspace[]
> {
  const userId = await getEffectiveUserId();
  return getAvailableWorkspacesForUser(userId);
}
