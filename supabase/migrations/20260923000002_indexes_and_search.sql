-- =============================================================================
-- Migration: 20260923000002_indexes_and_search.sql
-- Description: Composite performance indexes, foreign key lookup indexes,
-- and full-text search (tsvector + GIN) capabilities for Nyaya Revolution
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Foreign Key & Slug Performance Indexes
-- -----------------------------------------------------------------------------

-- Identity
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_xp_level ON public.profiles(xp_points DESC, level DESC);

-- Legal Knowledge
CREATE INDEX IF NOT EXISTS idx_statutory_acts_slug ON public.statutory_acts(slug);
CREATE INDEX IF NOT EXISTS idx_statutory_acts_legal_area ON public.statutory_acts(legal_area_id);
CREATE INDEX IF NOT EXISTS idx_statutory_acts_status ON public.statutory_acts(verification_status);

CREATE INDEX IF NOT EXISTS idx_law_articles_slug ON public.law_articles(slug);
CREATE INDEX IF NOT EXISTS idx_law_articles_act_id ON public.law_articles(act_id);
CREATE INDEX IF NOT EXISTS idx_law_articles_legal_area ON public.law_articles(legal_area_id);
CREATE INDEX IF NOT EXISTS idx_law_articles_status ON public.law_articles(verification_status);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_legal_area ON public.case_studies(legal_area_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_year ON public.case_studies(year DESC);

CREATE INDEX IF NOT EXISTS idx_glossary_terms_slug ON public.glossary_terms(slug);
CREATE INDEX IF NOT EXISTS idx_glossary_terms_legal_area ON public.glossary_terms(legal_area_id);

-- Situations
CREATE INDEX IF NOT EXISTS idx_situations_slug ON public.situations(slug);
CREATE INDEX IF NOT EXISTS idx_situations_category ON public.situations(category_id);
CREATE INDEX IF NOT EXISTS idx_situations_status ON public.situations(verification_status);

CREATE INDEX IF NOT EXISTS idx_situation_articles_article ON public.situation_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_situation_case_studies_case ON public.situation_case_studies(case_study_id);

-- Learning Curriculum
CREATE INDEX IF NOT EXISTS idx_learning_journeys_slug ON public.learning_journeys(slug);
CREATE INDEX IF NOT EXISTS idx_learning_journeys_status ON public.learning_journeys(verification_status);
CREATE INDEX IF NOT EXISTS idx_learning_journeys_order ON public.learning_journeys(order_index ASC);

CREATE INDEX IF NOT EXISTS idx_learning_modules_journey ON public.learning_modules(journey_id, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id, order_index ASC);
CREATE INDEX IF NOT EXISTS idx_lessons_slug ON public.lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lesson_blocks_lesson ON public.lesson_blocks(lesson_id, order_index ASC);

-- Assessment
CREATE INDEX IF NOT EXISTS idx_quizzes_journey ON public.quizzes(journey_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id, order_index ASC);

-- Learner Progress
CREATE INDEX IF NOT EXISTS idx_user_journey_progress_user ON public.user_journey_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON public.user_lesson_progress(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_date ON public.user_activity_logs(user_id, created_at DESC);

-- Community
CREATE INDEX IF NOT EXISTS idx_citizen_stories_author ON public.citizen_stories(author_id);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_status ON public.citizen_stories(moderation_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_category ON public.citizen_stories(category);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_helpful ON public.citizen_stories(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_story_comments_story ON public.story_comments(story_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id, content_type);

-- AI
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON public.ai_messages(conversation_id, created_at ASC);

-- Governance & Auditing
CREATE INDEX IF NOT EXISTS idx_verification_logs_entity ON public.content_verification_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON public.audit_events(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON public.audit_events(resource_type, resource_id);

-- -----------------------------------------------------------------------------
-- 2. Full-Text Search Architecture (tsvector + GIN)
-- -----------------------------------------------------------------------------

-- Search index on Situations
ALTER TABLE public.situations ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(rights, ' ')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_situations_fts ON public.situations USING GIN (search_vector);

-- Search index on Law Articles
ALTER TABLE public.law_articles ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(article_or_section, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(simple_explanation, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(why_it_exists, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_law_articles_fts ON public.law_articles USING GIN (search_vector);

-- Search index on Statutory Acts
ALTER TABLE public.statutory_acts ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(short_title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(overview, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_statutory_acts_fts ON public.statutory_acts USING GIN (search_vector);

-- Search index on Glossary Terms
ALTER TABLE public.glossary_terms ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(term, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(simple_explanation, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(example, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_glossary_terms_fts ON public.glossary_terms USING GIN (search_vector);

-- Search index on Case Studies
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(citation, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(relevant_concept, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(why_it_matters, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_case_studies_fts ON public.case_studies USING GIN (search_vector);

-- Search index on Learning Journeys
ALTER TABLE public.learning_journeys ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_learning_journeys_fts ON public.learning_journeys USING GIN (search_vector);
