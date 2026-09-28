'use server';

/**
 * ============================================================================
 * SPRINT E16 — CITIZEN OUTCOMES & INSTITUTIONAL IMPACT SERVER ACTIONS
 * ============================================================================
 */

import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  deleteCitizenOutcomeFeedback,
  exportAggregateAnalyticsDataset,
  getCitizenOutcomeHistoryForCase,
  getInternalInstitutionalAnalytics,
  getPublicImpactSummary,
  submitOrUpdateCitizenOutcomeFeedback,
} from '@/services/analytics/outcome-feedback.service';
import type {
  AnalyticsTimeWindow,
  CitizenOutcomeFeedbackRecord,
  InstitutionalImpactDashboardSnapshot,
  PublicImpactSummary,
  SubmitCitizenOutcomeInput,
} from '@/types/outcome-analytics';

async function getCurrentAuthenticatedUser(): Promise<{
  id: string | null;
  role: string;
}> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return { id: null, role: 'citizen' };
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { id: null, role: 'citizen' };
    }
    const roleMeta =
      (user.app_metadata?.role as string) ||
      (user.user_metadata?.role as string) ||
      'citizen';
    return { id: user.id, role: roleMeta };
  } catch {
    return { id: null, role: 'citizen' };
  }
}

export async function submitCitizenOutcomeFeedbackAction(
  input: SubmitCitizenOutcomeInput
): Promise<{
  success: boolean;
  record?: CitizenOutcomeFeedbackRecord;
  error?: string;
}> {
  const { id } = await getCurrentAuthenticatedUser();
  return submitOrUpdateCitizenOutcomeFeedback(id, input);
}

export async function deleteCitizenOutcomeFeedbackAction(
  feedbackId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  const { id } = await getCurrentAuthenticatedUser();
  return deleteCitizenOutcomeFeedback(id, feedbackId);
}

export async function fetchCitizenOutcomeHistoryAction(
  caseId?: string | null
): Promise<CitizenOutcomeFeedbackRecord | null> {
  const { id } = await getCurrentAuthenticatedUser();
  return getCitizenOutcomeHistoryForCase(id, caseId);
}

export async function fetchInternalImpactAnalyticsAction(
  period: AnalyticsTimeWindow = '90d'
): Promise<{
  authorized: boolean;
  role: string;
  snapshot: InstitutionalImpactDashboardSnapshot;
}> {
  const { role } = await getCurrentAuthenticatedUser();
  const snapshot = await getInternalInstitutionalAnalytics({ period });
  return {
    authorized: true,
    role: role || 'moderator',
    snapshot,
  };
}

export async function fetchPublicImpactSummaryAction(
  period: AnalyticsTimeWindow = '90d'
): Promise<PublicImpactSummary> {
  return getPublicImpactSummary(period);
}

export async function exportAggregateAnalyticsAction(
  period: AnalyticsTimeWindow = '90d',
  format: 'csv' | 'json' = 'json'
): Promise<{
  filename: string;
  mimeType: string;
  content: string;
}> {
  return exportAggregateAnalyticsDataset(period, format);
}
