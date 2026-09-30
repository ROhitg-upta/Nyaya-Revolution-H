-- ============================================================================
-- SPRINT E18 — MULTI-WORKSPACE CITIZEN CASE BINDER, LINKED GRIEVANCES
--              & PROCEDURAL DOCUMENT PACK
-- ============================================================================
-- Defines:
-- 1. `public.citizen_case_binders`:
--    High-level organizational container linking multiple related preparation workspaces
--    without merging their distinct facts, notes, attachments, or ownership boundaries.
-- 2. `public.binder_workspaces`:
--    Join table linking workspaces to binders with explicit relationship types
--    ('primary', 'related', 'followup', 'group_member', 'supporting').
-- 3. `public.binder_docket_references`:
--    Multi-docket tracking for official reference numbers across linked actions.
-- 4. `public.binder_participants`:
--    Data-minimized participant references for group or family issues.
-- 5. `public.binder_document_packs`:
--    Multi-annexure procedural export records with review gate confirmations.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.citizen_case_binders (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'ready_for_review', 'archived')),
  primary_category TEXT NOT NULL DEFAULT 'General Legal Grievance',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_citizen_case_binders_owner
  ON public.citizen_case_binders(owner_user_id, status);

ALTER TABLE public.citizen_case_binders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "citizen_case_binders_owner_all" ON public.citizen_case_binders;
CREATE POLICY "citizen_case_binders_owner_all"
  ON public.citizen_case_binders
  FOR ALL
  USING (
    owner_user_id = auth.uid()::text
    OR auth.jwt() ->> 'role' IN ('admin', 'moderator')
  );

-- ============================================================================
-- 2. Binder Workspaces Join Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.binder_workspaces (
  id TEXT PRIMARY KEY,
  binder_id TEXT NOT NULL REFERENCES public.citizen_case_binders(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'related'
    CHECK (relationship_type IN ('primary', 'related', 'followup', 'group_member', 'supporting')),
  display_order INTEGER NOT NULL DEFAULT 1,
  notes TEXT NOT NULL DEFAULT '',
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_binder_workspace UNIQUE (binder_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_binder_workspaces_lookup
  ON public.binder_workspaces(binder_id, display_order);

ALTER TABLE public.binder_workspaces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "binder_workspaces_owner_all" ON public.binder_workspaces;
CREATE POLICY "binder_workspaces_owner_all"
  ON public.binder_workspaces
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.citizen_case_binders b
      WHERE b.id = binder_workspaces.binder_id
        AND (b.owner_user_id = auth.uid()::text OR auth.jwt() ->> 'role' IN ('admin', 'moderator'))
    )
  );

-- ============================================================================
-- 3. Multi-Docket & Reference Tracking Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.binder_docket_references (
  id TEXT PRIMARY KEY,
  binder_id TEXT NOT NULL REFERENCES public.citizen_case_binders(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  reference_type TEXT NOT NULL DEFAULT 'docket'
    CHECK (reference_type IN ('docket', 'diary', 'acknowledgment', 'complaint', 'application', 'reference')),
  reference_number TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  submitted_at DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'acknowledged', 'under_investigation', 'hearing_scheduled', 'resolved', 'closed')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_binder_dockets_lookup
  ON public.binder_docket_references(binder_id, submitted_at);

ALTER TABLE public.binder_docket_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "binder_dockets_owner_all" ON public.binder_docket_references;
CREATE POLICY "binder_dockets_owner_all"
  ON public.binder_docket_references
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.citizen_case_binders b
      WHERE b.id = binder_docket_references.binder_id
        AND (b.owner_user_id = auth.uid()::text OR auth.jwt() ->> 'role' IN ('admin', 'moderator'))
    )
  );

-- ============================================================================
-- 4. Binder Participants (Data-minimized references)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.binder_participants (
  id TEXT PRIMARY KEY,
  binder_id TEXT NOT NULL REFERENCES public.citizen_case_binders(id) ON DELETE CASCADE,
  role_label TEXT NOT NULL DEFAULT 'Citizen',
  name_or_label TEXT NOT NULL,
  organization TEXT NOT NULL DEFAULT '',
  contact_reference TEXT NOT NULL DEFAULT '',
  data_minimized BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_binder_participants_lookup
  ON public.binder_participants(binder_id);

ALTER TABLE public.binder_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "binder_participants_owner_all" ON public.binder_participants;
CREATE POLICY "binder_participants_owner_all"
  ON public.binder_participants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.citizen_case_binders b
      WHERE b.id = binder_participants.binder_id
        AND (b.owner_user_id = auth.uid()::text OR auth.jwt() ->> 'role' IN ('admin', 'moderator'))
    )
  );

-- ============================================================================
-- 5. Binder Document Packs & Multi-Annexure Exports
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.binder_document_packs (
  id TEXT PRIMARY KEY,
  binder_id TEXT NOT NULL REFERENCES public.citizen_case_binders(id) ON DELETE CASCADE,
  pack_version INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  primary_language TEXT NOT NULL DEFAULT 'en' CHECK (primary_language IN ('en', 'hi')),
  secondary_language TEXT NOT NULL DEFAULT 'none' CHECK (secondary_language IN ('en', 'hi', 'none')),
  template_type TEXT NOT NULL DEFAULT 'first-appeal-generic-v1',
  selected_workspace_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_document_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  selected_attachment_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  review_gate_completed BOOLEAN NOT NULL DEFAULT FALSE,
  authority_snapshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  exported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_binder_doc_packs_lookup
  ON public.binder_document_packs(binder_id, pack_version);

ALTER TABLE public.binder_document_packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "binder_document_packs_owner_all" ON public.binder_document_packs;
CREATE POLICY "binder_document_packs_owner_all"
  ON public.binder_document_packs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.citizen_case_binders b
      WHERE b.id = binder_document_packs.binder_id
        AND (b.owner_user_id = auth.uid()::text OR auth.jwt() ->> 'role' IN ('admin', 'moderator'))
    )
  );
