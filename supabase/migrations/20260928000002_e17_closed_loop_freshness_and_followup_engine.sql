-- ============================================================================
-- SPRINT E17 — CLOSED-LOOP AUTHORITY SELF-HEALING, PROCEDURAL ESCALATION
--              WINDOWS & CITIZEN FOLLOW-UP ENGINE
-- ============================================================================
-- Defines:
-- 1. `public.authority_freshness_alerts`:
--    Threshold-triggered moderator verification tickets generated when >= 3
--    non-contradictory citizen check-ins report `could_not_reach`.
--    Enforces anti-poisoning governance: citizen reports NEVER auto-mutate
--    official directory rows without human moderator verification (`vN -> vN+1`).
-- 2. `public.citizen_procedural_followups`:
--    Owner-only private follow-up log & procedural reference window tracker
--    (Docket/Diary reference, contacted_at date, target_window_days,
--    escalation readiness notes, and follow-up addendum history).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.authority_freshness_alerts (
  id TEXT PRIMARY KEY,
  authority_id TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  authority_type TEXT NOT NULL,
  state_code TEXT NOT NULL DEFAULT 'DL',
  trigger_reason TEXT NOT NULL,
  unreached_report_count INTEGER NOT NULL DEFAULT 3 CHECK (unreached_report_count >= 1),
  total_window_reports INTEGER NOT NULL DEFAULT 3 CHECK (total_window_reports >= 1),
  window_days INTEGER NOT NULL DEFAULT 30,
  priority_badge TEXT NOT NULL DEFAULT 'HIGH_PRIORITY_CITIZEN_SIGNAL',
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_review', 'resolved_updated', 'dismissed_verified')),
  current_version_number INTEGER NOT NULL DEFAULT 1,
  resolved_by_version INTEGER,
  verified_fallback_channel TEXT NOT NULL,
  verified_fallback_url TEXT,
  moderator_resolution_note TEXT,
  official_source_url TEXT NOT NULL DEFAULT 'https://nalsa.gov.in',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_authority_freshness_alerts_status
  ON public.authority_freshness_alerts(status, authority_id);

ALTER TABLE public.authority_freshness_alerts ENABLE ROW LEVEL SECURITY;

-- Public & authenticated citizens can read active freshness alerts & fallback channels
DROP POLICY IF EXISTS "authority_freshness_alerts_select_all" ON public.authority_freshness_alerts;
CREATE POLICY "authority_freshness_alerts_select_all"
  ON public.authority_freshness_alerts
  FOR SELECT
  USING (true);

-- Only moderators / admins can update or resolve authority freshness alerts
DROP POLICY IF EXISTS "authority_freshness_alerts_moderator_write" ON public.authority_freshness_alerts;
CREATE POLICY "authority_freshness_alerts_moderator_write"
  ON public.authority_freshness_alerts
  FOR ALL
  USING (
    auth.jwt() ->> 'role' IN ('admin', 'moderator', 'legal_educator')
    OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'moderator', 'legal_educator')
  );

-- ============================================================================
-- 2. Citizen Private Procedural Follow-Up & Escalation Tracker
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.citizen_procedural_followups (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_key TEXT NOT NULL,
  pathway_title TEXT NOT NULL,
  docket_or_diary_ref TEXT NOT NULL DEFAULT '',
  authority_contacted_name TEXT NOT NULL,
  contact_channel_used TEXT NOT NULL,
  contacted_at DATE NOT NULL,
  target_window_days INTEGER NOT NULL DEFAULT 30 CHECK (target_window_days > 0),
  reminder_interval_days INTEGER NOT NULL DEFAULT 15 CHECK (reminder_interval_days > 0),
  followup_status TEXT NOT NULL DEFAULT 'awaiting_within_window'
    CHECK (followup_status IN (
      'awaiting_within_window',
      'window_elapsed_escalation_ready',
      'acknowledgment_received',
      'followup_submitted',
      'resolved_closed'
    )),
  summary_of_response TEXT NOT NULL DEFAULT ''
    CHECK (char_length(summary_of_response) <= 400),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_citizen_procedural_followups_case
  ON public.citizen_procedural_followups(case_id, user_id);

ALTER TABLE public.citizen_procedural_followups ENABLE ROW LEVEL SECURITY;

-- Strict Owner-Only RLS for Citizen Procedural Follow-Up Logs
DROP POLICY IF EXISTS "citizen_procedural_followups_owner_select" ON public.citizen_procedural_followups;
CREATE POLICY "citizen_procedural_followups_owner_select"
  ON public.citizen_procedural_followups
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "citizen_procedural_followups_owner_insert" ON public.citizen_procedural_followups;
CREATE POLICY "citizen_procedural_followups_owner_insert"
  ON public.citizen_procedural_followups
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "citizen_procedural_followups_owner_update" ON public.citizen_procedural_followups;
CREATE POLICY "citizen_procedural_followups_owner_update"
  ON public.citizen_procedural_followups
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "citizen_procedural_followups_owner_delete" ON public.citizen_procedural_followups;
CREATE POLICY "citizen_procedural_followups_owner_delete"
  ON public.citizen_procedural_followups
  FOR DELETE
  USING (auth.uid() = user_id);
