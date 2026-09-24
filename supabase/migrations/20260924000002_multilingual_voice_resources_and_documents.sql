-- =============================================================================
-- NYAYA REVOLUTION — SPRINT E11: MULTILINGUAL VOICE, VERIFIED LEGAL AID & CITIZEN ACTION ENGINE
-- Migration: 20260924000002_multilingual_voice_resources_and_documents.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. VERIFIED ASSISTANCE & LEGAL AID DIRECTORY TABLE (ADMIN-CONTROLLED, PUBLIC READ)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.verified_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  resource_type TEXT NOT NULL
    CHECK (resource_type IN (
      'legal_aid',
      'consumer_grievance',
      'cybercrime_reporting',
      'rti_portal',
      'government_grievance',
      'police_complaint_info',
      'women_child_safety',
      'labour_grievance',
      'financial_ombudsman'
    )),
  authority_name TEXT NOT NULL,
  description TEXT NOT NULL,
  jurisdiction_type TEXT NOT NULL DEFAULT 'all_india'
    CHECK (jurisdiction_type IN ('all_india', 'central_government_only', 'state_specific', 'district_specific')),
  state TEXT NOT NULL DEFAULT 'All India',
  district TEXT,
  phone TEXT,
  toll_free_numbers TEXT[] DEFAULT '{}',
  email TEXT,
  official_url TEXT NOT NULL,
  address TEXT,
  operating_hours TEXT,
  who_can_use TEXT NOT NULL,
  geographic_scope TEXT NOT NULL,
  subject_scope TEXT NOT NULL,
  eligibility_notes TEXT NOT NULL,
  jurisdiction_warning TEXT,
  supported_languages TEXT[] DEFAULT ARRAY['English', 'Hindi'],
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'official_portal'
    CHECK (source_type IN ('statutory_body', 'ministry_portal', 'state_authority', 'supreme_court_committee', 'official_portal')),
  verification_status TEXT NOT NULL DEFAULT 'verified'
    CHECK (verification_status IN ('draft', 'needs_review', 'verified', 'published', 'stale', 'archived')),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stale_after_days INT NOT NULL DEFAULT 90,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verified_resources_type_state
  ON public.verified_resources(resource_type, state, verification_status);

CREATE INDEX IF NOT EXISTS idx_verified_resources_jurisdiction
  ON public.verified_resources(jurisdiction_type, verification_status);

-- -----------------------------------------------------------------------------
-- 2. VOICE TRANSCRIPTS TABLE (STRICTLY PRIVATE TO OWNER)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.voice_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_language TEXT NOT NULL DEFAULT 'en',
  detected_language TEXT NOT NULL DEFAULT 'en',
  detection_confidence NUMERIC(4,3) NOT NULL DEFAULT 0.900,
  provider_used TEXT NOT NULL DEFAULT 'browser_web_speech',
  raw_transcript TEXT NOT NULL,
  user_edited_transcript TEXT NOT NULL,
  normalized_retrieval_text TEXT NOT NULL,
  audio_retention_mode TEXT NOT NULL DEFAULT 'transcript_only'
    CHECK (audio_retention_mode IN ('transcript_only', 'story_attachment')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_voice_transcripts_user
  ON public.voice_transcripts(user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- 3. GENERATED CITIZEN ACTION DOCUMENTS TABLE (STRICTLY PRIVATE TO OWNER, VERSIONED)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL
    CHECK (document_type IN (
      'consumer_grievance',
      'rti_application',
      'cyber_fraud_summary',
      'workplace_wage_representation',
      'legal_aid_checklist'
    )),
  template_version TEXT NOT NULL,
  title TEXT NOT NULL,
  situation_slug TEXT,
  jurisdiction_scope TEXT NOT NULL,
  authority_addressed TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  structured_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
  draft_content TEXT NOT NULL,
  source_references JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_reviewed BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'reviewed', 'exported', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  exported_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_generated_documents_user
  ON public.generated_documents(user_id, updated_at DESC);

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) — RESOURCE INTEGRITY & PRIVATE DOCUMENT ISOLATION
-- -----------------------------------------------------------------------------

ALTER TABLE public.verified_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Verified Resources: Public can only SELECT verified/published records.
-- Normal users CANNOT modify phone numbers, URLs, or verification states.
DROP POLICY IF EXISTS "Public can read verified resources" ON public.verified_resources;
CREATE POLICY "Public can read verified resources"
  ON public.verified_resources
  FOR SELECT
  USING (verification_status IN ('verified', 'published', 'stale'));

-- Voice Transcripts: Strictly private to the authenticated user who recorded them
DROP POLICY IF EXISTS "Users manage own voice transcripts" ON public.voice_transcripts;
CREATE POLICY "Users manage own voice transcripts"
  ON public.voice_transcripts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Generated Documents: Strictly private to the document owner (Zero public leakage)
DROP POLICY IF EXISTS "Users manage own generated documents" ON public.generated_documents;
CREATE POLICY "Users manage own generated documents"
  ON public.generated_documents
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
