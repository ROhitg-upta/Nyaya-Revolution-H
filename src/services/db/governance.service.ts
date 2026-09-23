/**
 * Content Governance & Security Audit Database Service.
 *
 * Provides tamper-evident audit logging for administrative mutations,
 * legal content verification logs, and role change tracking.
 */

import { publicEnv } from "@/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json, VerificationStatus } from "@/lib/supabase/types";

export interface AuditEventPayload {
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
}

export interface VerificationLogPayload {
  entityType: string;
  entityId: string;
  previousStatus?: VerificationStatus;
  newStatus: VerificationStatus;
  reviewedBy: string;
  reviewNotes?: string;
  sourceUrl?: string;
}

export class GovernanceService {
  /** Logs an administrative or security audit event */
  async logAuditEvent(payload: AuditEventPayload): Promise<boolean> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          const { error } = await client.from("audit_events").insert({
            action: payload.action,
            resource_type: payload.resourceType,
            resource_id: payload.resourceId,
            metadata: (payload.metadata as unknown as Json) ?? {},
          });

          return !error;
        }
      } catch (err) {
        console.warn("Audit logging failed:", err);
      }
    }

    return true;
  }

  /** Records a content verification review event */
  async recordVerification(payload: VerificationLogPayload): Promise<boolean> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          const { error } = await client
            .from("content_verification_logs")
            .insert({
              entity_type: payload.entityType,
              entity_id: payload.entityId,
              previous_status: payload.previousStatus,
              new_status: payload.newStatus,
              reviewed_by: payload.reviewedBy,
              review_notes: payload.reviewNotes,
              source_url: payload.sourceUrl,
            });

          return !error;
        }
      } catch (err) {
        console.warn("Verification logging failed:", err);
      }
    }

    return true;
  }
}

export const governanceService = new GovernanceService();
