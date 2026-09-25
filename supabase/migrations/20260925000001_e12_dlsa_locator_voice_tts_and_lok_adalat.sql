-- ============================================================================
-- SPRINT E12: LIVE MULTILINGUAL VOICE, VERIFIED DLSA GEO-LOCATOR & LOK ADALAT
-- Extends E11 schema safely without modifying or resetting existing tables.
-- ============================================================================

-- 1. Source-Driven Legal Service Authorities Directory (NALSA / SLSA / DLSA / TLSC)
CREATE TABLE IF NOT EXISTS public.legal_service_authorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  authority_type TEXT NOT NULL CHECK (authority_type IN ('NALSA', 'SLSA', 'DLSA', 'TLSC', 'SCLSC', 'HCLSC')),
  state TEXT NOT NULL,
  district TEXT,
  taluk_or_local_office TEXT,
  office_name TEXT NOT NULL,
  contact_phone TEXT,
  helpline_number TEXT,
  contact_email TEXT,
  address TEXT,
  website TEXT,
  jurisdiction_scope TEXT NOT NULL DEFAULT 'district' CHECK (jurisdiction_scope IN ('national', 'state', 'district', 'taluk')),
  services_offered TEXT[] NOT NULL DEFAULT ARRAY['Free Legal Aid (Section 12)', 'Legal Awareness', 'Lok Adalat & ADR Information'],
  languages_supported TEXT[] NOT NULL DEFAULT ARRAY['en', 'hi'],
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'official_slsa_directory' CHECK (source_type IN ('nalsa_portal', 'official_slsa_directory', 'ecourts_district_portal', 'gazette_notification')),
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('new', 'needs_review', 'verified', 'published', 'review_due', 'stale', 'conflicted', 'archived')),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  stale_after_days INTEGER NOT NULL DEFAULT 90,
  conflict_status TEXT NOT NULL DEFAULT 'none' CHECK (conflict_status IN ('none', 'conflicted', 'resolved')),
  conflict_source_a JSONB,
  conflict_source_b JSONB,
  review_required BOOLEAN NOT NULL DEFAULT FALSE,
  reviewer_notes TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legal_service_authorities_state_district
  ON public.legal_service_authorities (state, district)
  WHERE is_published = TRUE;

CREATE INDEX IF NOT EXISTS idx_legal_service_authorities_verification
  ON public.legal_service_authorities (verification_status, review_required);

-- 2. Authority Verification Audit Trail
CREATE TABLE IF NOT EXISTS public.authority_verification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  authority_id UUID NOT NULL REFERENCES public.legal_service_authorities(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  previous_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  source_url_checked TEXT NOT NULL,
  verification_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PIN Code to Jurisdiction Mapping (Supports Ambiguous Multi-District PINs)
CREATE TABLE IF NOT EXISTS public.pincode_jurisdiction_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pincode_prefix TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  primary_district TEXT NOT NULL,
  candidate_districts TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_ambiguous BOOLEAN NOT NULL DEFAULT FALSE,
  source_note TEXT NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pincode_jurisdiction_prefix
  ON public.pincode_jurisdiction_map (pincode_prefix);

-- 4. Safe Voice & TTS Observability Events (NO audio, NO transcripts, NO user coordinates)
CREATE TABLE IF NOT EXISTS public.voice_provider_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('bhashini_ulca', 'gemini_audio', 'browser_web_speech', 'text_fallback')),
  operation TEXT NOT NULL CHECK (operation IN ('stt', 'tts', 'language_detect')),
  language TEXT NOT NULL,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
  error_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Optional Citizen Lok Adalat Readiness Sessions (Private per user)
CREATE TABLE IF NOT EXISTS public.lok_adalat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dispute_category TEXT NOT NULL,
  court_stage TEXT NOT NULL,
  settlement_capability TEXT NOT NULL,
  willingness_to_settle TEXT NOT NULL,
  pathway_outcome TEXT NOT NULL,
  checklist_progress JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.legal_service_authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authority_verification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pincode_jurisdiction_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_provider_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lok_adalat_sessions ENABLE ROW LEVEL SECURITY;

-- Public read only for published & verified authorities
CREATE POLICY "Public citizens can view published verified authorities"
  ON public.legal_service_authorities
  FOR SELECT
  USING (is_published = TRUE AND verification_status IN ('verified', 'published', 'review_due', 'stale'));

-- Public read for PIN code jurisdiction mapping
CREATE POLICY "Public citizens can read pincode jurisdiction mappings"
  ON public.pincode_jurisdiction_map
  FOR SELECT
  USING (TRUE);

-- Users can strictly manage only their own Lok Adalat preparation checklists
CREATE POLICY "Citizens can view own lok_adalat_sessions"
  ON public.lok_adalat_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Citizens can insert own lok_adalat_sessions"
  ON public.lok_adalat_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Citizens can update own lok_adalat_sessions"
  ON public.lok_adalat_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
