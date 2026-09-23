-- =============================================================================
-- Migration: 20260923000001_initial_schema.sql
-- Description: Core schema for Nyaya Revolution legal learning platform
-- Domains: Identity, Legal Knowledge, Situations, Curriculum, Assessment, Progress, Community, AI & Governance
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- 1. Custom Enum Types
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('citizen', 'advocate', 'legal_educator', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('draft', 'needs_review', 'verified', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE legal_area AS ENUM (
    'constitutional', 'criminal', 'consumer', 'cyber', 'labour',
    'housing', 'traffic', 'civil', 'privacy', 'family', 'education'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'flagged', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE resolution_status AS ENUM ('resolved', 'ongoing', 'mediated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE journey_progress_status AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE source_type AS ENUM (
    'constitution', 'central_act', 'state_act', 'supreme_court',
    'high_court', 'official_gazette', 'ministry_rule', 'institutional'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 2. Identity & Access Management (IAM)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'citizen',
  jurisdiction_state TEXT,
  xp_points INTEGER NOT NULL DEFAULT 0 CHECK (xp_points >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'dark',
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  daily_goal_minutes INTEGER NOT NULL DEFAULT 10 CHECK (daily_goal_minutes > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 3. Traceable Legal Knowledge Base
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.legal_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  source_type source_type NOT NULL,
  url TEXT,
  citation TEXT,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.legal_areas (
  id legal_area PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.statutory_acts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1850 AND year <= 2100),
  enacted_by TEXT NOT NULL,
  legal_area_id legal_area NOT NULL REFERENCES public.legal_areas(id),
  overview TEXT NOT NULL,
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE SET NULL,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.law_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  article_or_section TEXT NOT NULL,
  act_id UUID REFERENCES public.statutory_acts(id) ON DELETE SET NULL,
  legal_area_id legal_area NOT NULL REFERENCES public.legal_areas(id),
  title TEXT NOT NULL,
  simple_explanation TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL,
  why_it_exists TEXT NOT NULL,
  who_it_protects TEXT NOT NULL,
  real_world_example TEXT NOT NULL,
  myth TEXT,
  reality TEXT,
  derived_rights TEXT[] NOT NULL DEFAULT '{}',
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE SET NULL,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  citation TEXT NOT NULL,
  court TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1947 AND year <= 2100),
  bench TEXT,
  legal_area_id legal_area NOT NULL REFERENCES public.legal_areas(id),
  context TEXT NOT NULL,
  problem TEXT NOT NULL,
  legal_question TEXT NOT NULL,
  relevant_concept TEXT NOT NULL,
  ratio_decidendi TEXT NOT NULL,
  verified_outcome TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  citizen_learning TEXT[] NOT NULL DEFAULT '{}',
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE SET NULL,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  term TEXT NOT NULL,
  pronunciation TEXT,
  legal_area_id legal_area NOT NULL REFERENCES public.legal_areas(id),
  simple_explanation TEXT NOT NULL,
  detailed_explanation TEXT NOT NULL,
  example TEXT NOT NULL,
  related_concepts TEXT[] NOT NULL DEFAULT '{}',
  related_laws TEXT[] NOT NULL DEFAULT '{}',
  source_id UUID REFERENCES public.legal_sources(id) ON DELETE SET NULL,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 4. Situations & Citizen Problem Engine
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.situation_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.situations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.situation_categories(id),
  subcategory TEXT,
  tagline TEXT NOT NULL,
  summary TEXT NOT NULL,
  rights TEXT[] NOT NULL DEFAULT '{}',
  laws JSONB NOT NULL DEFAULT '[]'::jsonb,
  immediate_actions TEXT[] NOT NULL DEFAULT '{}',
  dont_do TEXT[] NOT NULL DEFAULT '{}',
  documents TEXT[] NOT NULL DEFAULT '{}',
  authorities JSONB NOT NULL DEFAULT '[]'::jsonb,
  emergency_contacts JSONB NOT NULL DEFAULT '[]'::jsonb,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.situation_articles (
  situation_id UUID NOT NULL REFERENCES public.situations(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.law_articles(id) ON DELETE CASCADE,
  PRIMARY KEY (situation_id, article_id)
);

CREATE TABLE IF NOT EXISTS public.situation_case_studies (
  situation_id UUID NOT NULL REFERENCES public.situations(id) ON DELETE CASCADE,
  case_study_id UUID NOT NULL REFERENCES public.case_studies(id) ON DELETE CASCADE,
  PRIMARY KEY (situation_id, case_study_id)
);

-- -----------------------------------------------------------------------------
-- 5. Learning Curriculum & Lessons
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.learning_journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  estimated_minutes INTEGER NOT NULL DEFAULT 30 CHECK (estimated_minutes > 0),
  xp_reward INTEGER NOT NULL DEFAULT 100 CHECK (xp_reward >= 0),
  icon_name TEXT NOT NULL DEFAULT 'BookOpen',
  tags TEXT[] NOT NULL DEFAULT '{}',
  verification_status verification_status NOT NULL DEFAULT 'draft',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.learning_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID NOT NULL REFERENCES public.learning_journeys(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  lesson_type TEXT NOT NULL DEFAULT 'concept',
  reading_minutes INTEGER NOT NULL DEFAULT 5 CHECK (reading_minutes > 0),
  objectives TEXT[] NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.lesson_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 6. Assessment & Interactive Scenarios
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  journey_id UUID REFERENCES public.learning_journeys(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  pass_percentage INTEGER NOT NULL DEFAULT 70 CHECK (pass_percentage BETWEEN 0 AND 100),
  xp_reward INTEGER NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
  time_limit_minutes INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL CHECK (array_length(options, 1) >= 2),
  correct_index INTEGER NOT NULL CHECK (correct_index >= 0),
  explanation TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  xp INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.scenario_simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  context TEXT NOT NULL,
  initial_step_id TEXT NOT NULL,
  learning_outcomes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.scenario_steps (
  id TEXT PRIMARY KEY,
  simulation_id UUID NOT NULL REFERENCES public.scenario_simulations(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  situation_update TEXT
);

CREATE TABLE IF NOT EXISTS public.scenario_step_options (
  id TEXT PRIMARY KEY,
  step_id TEXT NOT NULL REFERENCES public.scenario_steps(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  evaluation TEXT NOT NULL CHECK (evaluation IN ('optimal', 'acceptable', 'risky', 'dangerous')),
  feedback TEXT NOT NULL,
  legal_concept TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  next_step_id TEXT
);

-- -----------------------------------------------------------------------------
-- 7. Persistent Progress & Mastery
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_journey_progress (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  journey_id UUID NOT NULL REFERENCES public.learning_journeys(id) ON DELETE CASCADE,
  status journey_progress_status NOT NULL DEFAULT 'not_started',
  completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.0 CHECK (completion_percentage BETWEEN 0.0 AND 100.0),
  xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, journey_id)
);

CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL CHECK (max_score >= score),
  passed BOOLEAN NOT NULL DEFAULT false,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 8. Moderated Community & Citizen Stories
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.citizen_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_initials TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  what_happened TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  legal_outcome TEXT NOT NULL,
  resolution_status resolution_status NOT NULL DEFAULT 'ongoing',
  statutory_backing TEXT,
  helpful_count INTEGER NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
  moderation_status moderation_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.story_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES public.citizen_stories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  moderation_status moderation_status NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.story_reactions (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES public.citizen_stories(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'helpful',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, story_id)
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('situation', 'lesson', 'article', 'case_study', 'story')),
  content_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 9. AI Conversations & Grounding Sessions
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  response_mode TEXT NOT NULL DEFAULT 'eli15',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  structured_payload JSONB,
  is_bookmarked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 10. Content Governance, Legal Auditing & Security Logs
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.content_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  previous_status verification_status,
  new_status verification_status NOT NULL,
  reviewed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  review_notes TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
