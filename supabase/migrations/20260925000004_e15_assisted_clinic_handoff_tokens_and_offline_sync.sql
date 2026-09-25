-- ============================================================================
-- SPRINT E15 — ASSISTED PARA-LEGAL CLINIC MODE, EXPIRING HANDOFF TOKENS & OFFLINE PWA
-- Migration: 20260925000004_e15_assisted_clinic_handoff_tokens_and_offline_sync.sql
-- ============================================================================

-- 1. Frozen Handoff Snapshots (Immutable copy of ONLY citizen-selected sections)
CREATE TABLE IF NOT EXISTS public.case_prep_handoff_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_version INT NOT NULL DEFAULT 1,
  workspace_version_at_share INT NOT NULL DEFAULT 1,
  selected_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  included_attachment_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  authority_version_at_share INT NOT NULL DEFAULT 1,
  frozen_snapshot_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Handoff Sessions (Stores ONLY SHA-256 token_hash — NEVER plaintext token)
CREATE TABLE IF NOT EXISTS public.case_prep_handoff_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_id UUID NOT NULL REFERENCES public.case_prep_handoff_snapshots(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  token_prefix TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'DLSA Front Office Visit',
  share_label TEXT NOT NULL DEFAULT 'Legal Aid Clinic Helper',
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  max_accesses INT NOT NULL DEFAULT 25,
  access_count INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Handoff Security & Audit Events (Safe metadata only — zero plaintext tokens or dossier PII)
CREATE TABLE IF NOT EXISTS public.case_prep_handoff_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.case_prep_handoff_sessions(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES public.case_prep_workspaces(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'handoff_created',
    'handoff_opened',
    'handoff_revoked',
    'handoff_expired',
    'invalid_token',
    'rate_limit_triggered',
    'sync_success',
    'sync_conflict'
  )),
  safe_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (Citizen owns sessions, snapshots, and events; helper access is server-mediated)
ALTER TABLE public.case_prep_handoff_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_handoff_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_handoff_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner only access on case_prep_handoff_snapshots"
  ON public.case_prep_handoff_snapshots FOR ALL
  USING (auth.uid() = created_by_user_id)
  WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Owner only access on case_prep_handoff_sessions"
  ON public.case_prep_handoff_sessions FOR ALL
  USING (auth.uid() = created_by_user_id)
  WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Owner only access on case_prep_handoff_events"
  ON public.case_prep_handoff_events FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.case_prep_workspaces WHERE user_id = auth.uid()
    )
  );
