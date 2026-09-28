'use server';

/**
 * ============================================================================
 * SPRINT E17 — CLOSED-LOOP AUTHORITY SELF-HEALING & PROCEDURAL FOLLOW-UP ACTIONS
 * ============================================================================
 */

import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  generatePrivacySafeIcsReminder,
  getAuthorityFreshnessAlerts,
  getCitizenProceduralFollowupForCase,
  resolveAuthorityFreshnessAlert,
  saveOrUpdateCitizenProceduralFollowup,
} from '@/services/action/closed-loop-followup.service';
import type {
  AuthorityFreshnessAlertRecord,
  CitizenProceduralFollowupRecord,
  ProceduralPathwayKey,
  ResolveAuthorityFreshnessAlertInput,
  SaveCitizenFollowupInput,
} from '@/types/closed-loop-followup';

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function fetchAuthorityFreshnessAlertsAction(): Promise<
  AuthorityFreshnessAlertRecord[]
> {
  return getAuthorityFreshnessAlerts();
}

export async function resolveAuthorityFreshnessAlertAction(
  input: ResolveAuthorityFreshnessAlertInput
): Promise<{
  success: boolean;
  updatedAlert?: AuthorityFreshnessAlertRecord;
  error?: string;
}> {
  return resolveAuthorityFreshnessAlert(input);
}

export async function fetchCitizenProceduralFollowupAction(
  caseId: string,
  defaultPathway: ProceduralPathwayKey = 'cyber_fraud_1930',
  defaultAuthorityName = 'National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)'
): Promise<CitizenProceduralFollowupRecord> {
  return getCitizenProceduralFollowupForCase(
    caseId,
    defaultPathway,
    defaultAuthorityName
  );
}

export async function saveCitizenProceduralFollowupAction(
  input: SaveCitizenFollowupInput
): Promise<{
  success: boolean;
  record: CitizenProceduralFollowupRecord;
}> {
  const userId = await getAuthenticatedUserId();
  return saveOrUpdateCitizenProceduralFollowup(userId, input);
}

export async function exportPrivacySafeIcsReminderAction(
  intervalDays: 7 | 15 | 30,
  pathwayKey: ProceduralPathwayKey
): Promise<{
  filename: string;
  mimeType: string;
  icsContent: string;
}> {
  return generatePrivacySafeIcsReminder({ intervalDays, pathwayKey });
}
