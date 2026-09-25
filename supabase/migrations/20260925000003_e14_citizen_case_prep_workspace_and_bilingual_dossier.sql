-- ============================================================================
-- SPRINT E14 — CITIZEN CASE PREP WORKSPACE, BILINGUAL DOSSIER & HANDOFF
-- Migration: 20260925000003_e14_citizen_case_prep_workspace_and_bilingual_dossier.sql
-- ============================================================================

-- 1. Citizen Case Preparation Workspaces (Private by Default)
CREATE TABLE IF NOT EXISTS public.case_prep_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready_for_review', 'exported', 'archived')),
  situation_category TEXT NOT NULL DEFAULT 'Tenancy & Housing',
  situation_slug TEXT,
  situation_summary TEXT NOT NULL DEFAULT '',
  original_story_ref TEXT,
  user_description TEXT NOT NULL DEFAULT '',
  primary_language TEXT NOT NULL DEFAULT 'en' CHECK (primary_language IN ('en', 'hi')),
  secondary_language TEXT NOT NULL DEFAULT 'hi' CHECK (secondary_language IN ('en', 'hi', 'none')),
  selected_state TEXT NOT NULL DEFAULT 'Delhi',
  selected_district TEXT,
  lok_adalat_summary TEXT,
  lok_adalat_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  linked_draft_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  linked_learning_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_to_discuss JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_private_notes TEXT NOT NULL DEFAULT '',
  completed_sections INT NOT NULL DEFAULT 0,
  total_sections INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_exported_at TIMESTAMPTZ
);

-- 2. Chronological Timeline Events
CREATE TABLE IF NOT EXISTS public.case_prep_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  is_approximate_date BOOLEAN NOT NULL DEFAULT false,
  event_title TEXT NOT NULL,
  action_taken TEXT NOT NULL DEFAULT '',
  response_received TEXT NOT NULL DEFAULT '',
  source_or_note TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Parties / Organizations Involved
CREATE TABLE IF NOT EXISTS public.case_prep_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_label TEXT NOT NULL,
  name_or_label TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  contact_reference TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Context-Aware Document & Information Checklist Items
CREATE TABLE IF NOT EXISTS public.case_prep_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_label TEXT NOT NULL,
  item_label_hi TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Information to Keep for Discussion',
  is_checked BOOLEAN NOT NULL DEFAULT false,
  user_note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Private Attachment Metadata Index (Files stored in private storage bucket)
CREATE TABLE IF NOT EXISTS public.case_prep_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN ('application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain')),
  file_size_bytes INT NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760),
  description TEXT NOT NULL DEFAULT '',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Verified Resource & Authority Version Snapshots (Preserves E13 Authority Version at Link/Export Time)
CREATE TABLE IF NOT EXISTS public.case_prep_resource_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  authority_id TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  authority_type TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  published_version_number INT NOT NULL DEFAULT 1,
  snapshot_json JSONB NOT NULL,
  source_url TEXT NOT NULL,
  verified_at_snapshot TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Immutable Dossier Export History (Dossier v1 -> v2 -> v3)
CREATE TABLE IF NOT EXISTS public.case_prep_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.case_prep_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  primary_language TEXT NOT NULL,
  secondary_language TEXT NOT NULL,
  export_format TEXT NOT NULL CHECK (export_format IN ('pdf_print', 'bilingual_dossier', 'offline_text')),
  dossier_snapshot_json JSONB NOT NULL,
  authority_snapshot_version INT NOT NULL DEFAULT 1,
  review_gate_confirmed BOOLEAN NOT NULL DEFAULT true,
  exported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, version_number)
);

-- Enable Row Level Security (Strict Owner-Only Access: auth.uid() = user_id)
ALTER TABLE public.case_prep_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_resource_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_prep_exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner only access on case_prep_workspaces"
  ON public.case_prep_workspaces FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner only access on case_prep_timeline_events"
  ON public.case_prep_timeline_events FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner only access on case_prep_participants"
  ON public.case_prep_participants FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner only access on case_prep_checklist_items"
  ON public.case_prep_checklist_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner only access on case_prep_attachments"
  ON public.case_prep_attachments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner only access on case_prep_resource_snapshots"
  ON public.case_prep_resource_snapshots FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner only access on case_prep_exports"
  ON public.case_prep_exports FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
