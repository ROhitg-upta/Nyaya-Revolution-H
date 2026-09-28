-- ============================================================================
-- SPRINT E16 — VERIFIED OUTCOMES FEEDBACK LOOP & INSTITUTIONAL IMPACT ANALYTICS
-- Migration: 20260928000001_e16_citizen_outcomes_feedback_and_impact_analytics.sql
-- ============================================================================

-- 1. Citizen Outcome Feedback Records (Optional, Self-Reported, Privacy-First)
CREATE TABLE IF NOT EXISTS public.citizen_outcome_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES public.case_prep_workspaces(id) ON DELETE SET NULL,
  resource_id TEXT,
  authority_id TEXT,
  category TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'All India',
  is_anonymous_mode BOOLEAN NOT NULL DEFAULT true,
  consent_granted BOOLEAN NOT NULL DEFAULT true,
  contacted_resource BOOLEAN,
  contact_method TEXT NOT NULL DEFAULT 'Prefer Not to Say' CHECK (contact_method IN (
    'Phone',
    'Online Portal',
    'Email',
    'In Person',
    'Written Complaint',
    'Legal-Aid Office',
    'Other',
    'Prefer Not to Say'
  )),
  resource_experience TEXT NOT NULL DEFAULT 'do_not_know_yet' CHECK (resource_experience IN (
    'found_resource',
    'could_not_reach',
    'received_response',
    'still_waiting',
    'do_not_know_yet',
    'prefer_not_to_say'
  )),
  clarity_signal TEXT NOT NULL DEFAULT 'not_sure' CHECK (clarity_signal IN (
    'much_clearer',
    'a_little_clearer',
    'about_the_same',
    'less_clear',
    'not_sure',
    'prefer_not_to_say'
  )),
  preparation_value TEXT NOT NULL DEFAULT 'not_sure' CHECK (preparation_value IN (
    'very_helpful',
    'somewhat_helpful',
    'not_helpful',
    'not_used',
    'not_sure'
  )),
  current_outcome_status TEXT NOT NULL DEFAULT 'Not Sure' CHECK (current_outcome_status IN (
    'Not Started',
    'Contacted',
    'Awaiting Response',
    'Received Response',
    'Issue Partially Addressed',
    'Issue Resolved',
    'Still Ongoing',
    'Could Not Proceed',
    'Not Sure',
    'Prefer Not to Say'
  )),
  evidence_type TEXT NOT NULL DEFAULT 'SELF_REPORTED' CHECK (evidence_type IN ('SELF_REPORTED')),
  qualitative_helped_most TEXT NOT NULL DEFAULT '',
  qualitative_improvement_note TEXT NOT NULL DEFAULT '',
  reminder_opt_in BOOLEAN NOT NULL DEFAULT false,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Longitudinal Outcome Progression History (Preserves Status Transitions)
CREATE TABLE IF NOT EXISTS public.citizen_outcome_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES public.citizen_outcome_feedback(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  milestone_label TEXT NOT NULL,
  evidence_type TEXT NOT NULL DEFAULT 'SELF_REPORTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Privacy-Safe Platform Funnel & Impact Events (No Raw PII or Story Narratives)
CREATE TABLE IF NOT EXISTS public.platform_impact_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'situation_started',
    'lesson_completed',
    'resource_viewed',
    'resource_contacted',
    'handoff_created',
    'handoff_opened',
    'case_prep_exported',
    'outcome_feedback_submitted',
    'outcome_updated'
  )),
  category TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'All India',
  resource_type TEXT,
  authority_type TEXT,
  time_window_bucket TEXT NOT NULL DEFAULT '2026-09',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.citizen_outcome_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_outcome_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_impact_events ENABLE ROW LEVEL SECURITY;

-- Citizens can view, update, and delete their own feedback records
CREATE POLICY "Citizens manage own outcome feedback"
  ON public.citizen_outcome_feedback FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Citizens manage own outcome timeline events"
  ON public.citizen_outcome_timeline_events FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
