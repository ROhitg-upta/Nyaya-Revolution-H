-- ============================================================================
-- SPRINT E13: MODERATOR AUTHORITY INGESTION CONSOLE & SOURCE FRESHNESS ENGINE
-- Extends E12 legal_service_authorities with versioned snapshots, import batches,
-- side-by-side conflict tracking, source health checks, and moderator notifications.
-- ============================================================================

-- 1. Immutable Authority Version Snapshots (v1 -> v2 -> v3)
CREATE TABLE IF NOT EXISTS public.authority_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authority_id UUID NOT NULL REFERENCES public.legal_service_authorities(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot_json JSONB NOT NULL,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  verified_by TEXT NOT NULL,
  change_reason TEXT NOT NULL,
  import_batch_id TEXT,
  is_active_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (authority_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_authority_versions_active
  ON public.authority_versions (authority_id, is_active_published);

-- 2. Authority Import Batches (CSV / JSON with Rollback Snapshot Support)
CREATE TABLE IF NOT EXISTS public.authority_import_batches (
  id TEXT PRIMARY KEY,
  source_label TEXT NOT NULL,
  file_format TEXT NOT NULL CHECK (file_format IN ('csv', 'json')),
  uploaded_by TEXT NOT NULL,
  uploaded_role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('uploaded', 'validating', 'ready_for_review', 'published', 'rolled_back', 'failed', 'cancelled')),
  source_fingerprint TEXT NOT NULL,
  total_rows INTEGER NOT NULL DEFAULT 0,
  valid_rows INTEGER NOT NULL DEFAULT 0,
  invalid_rows INTEGER NOT NULL DEFAULT 0,
  new_records INTEGER NOT NULL DEFAULT 0,
  changed_records INTEGER NOT NULL DEFAULT 0,
  conflicted_records INTEGER NOT NULL DEFAULT 0,
  duplicate_records INTEGER NOT NULL DEFAULT 0,
  unchanged_records INTEGER NOT NULL DEFAULT 0,
  pre_batch_snapshots JSONB NOT NULL DEFAULT '[]'::JSONB,
  published_authority_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  rollback_reason TEXT,
  rolled_back_by TEXT,
  rolled_back_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 3. Import Row Validation & Diff Records
CREATE TABLE IF NOT EXISTS public.authority_import_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id TEXT NOT NULL REFERENCES public.authority_import_batches(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('NEW', 'CHANGED', 'UNCHANGED', 'CONFLICTED', 'INVALID', 'DUPLICATE')),
  raw_payload JSONB NOT NULL,
  normalized_payload JSONB,
  validation_errors TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  field_diffs JSONB NOT NULL DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Side-by-Side Authority Source Conflicts
CREATE TABLE IF NOT EXISTS public.authority_conflicts (
  id TEXT PRIMARY KEY,
  authority_id TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  batch_id TEXT,
  conflict_types TEXT[] NOT NULL DEFAULT ARRAY['contact_conflict'],
  source_a JSONB NOT NULL,
  source_b JSONB NOT NULL,
  current_published_record JSONB NOT NULL,
  imported_candidate_record JSONB NOT NULL,
  field_diffs JSONB NOT NULL DEFAULT '[]'::JSONB,
  resolution_status TEXT NOT NULL DEFAULT 'open' CHECK (resolution_status IN ('open', 'accept_import', 'keep_existing', 'manual_edit', 'reject_import', 'request_reverification', 'archive_record')),
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Source URL Health & Fingerprint Checks
CREATE TABLE IF NOT EXISTS public.source_health_checks (
  id TEXT PRIMARY KEY,
  authority_id TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  http_status INTEGER,
  reachable BOOLEAN NOT NULL DEFAULT TRUE,
  redirect_url TEXT,
  last_observed_fingerprint TEXT NOT NULL,
  fingerprint_changed BOOLEAN NOT NULL DEFAULT FALSE,
  requires_human_review BOOLEAN NOT NULL DEFAULT FALSE,
  status_note TEXT NOT NULL,
  last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_successful_check_at TIMESTAMPTZ
);

-- 6. Moderator Governance Notifications
CREATE TABLE IF NOT EXISTS public.moderator_notifications (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('conflict_detected', 'record_stale', 'review_due', 'source_unreachable', 'import_ready', 'batch_rolled_back')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_authority_id TEXT,
  related_batch_id TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.authority_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authority_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authority_import_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authority_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderator_notifications ENABLE ROW LEVEL SECURITY;

-- Public citizens can NEVER read internal conflicts, import batches, or reviewer notes.
-- Only authenticated moderators/admins can access governance tables.
CREATE POLICY "Moderators and admins can read authority_versions"
  ON public.authority_versions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators and admins can read authority_import_batches"
  ON public.authority_import_batches
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators and admins can read authority_conflicts"
  ON public.authority_conflicts
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators and admins can read source_health_checks"
  ON public.source_health_checks
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Moderators and admins can read moderator_notifications"
  ON public.moderator_notifications
  FOR SELECT
  USING (auth.role() = 'authenticated');
