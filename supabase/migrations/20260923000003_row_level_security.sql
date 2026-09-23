-- =============================================================================
-- Migration: 20260923000003_row_level_security.sql
-- Description: Complete Row Level Security (RLS) policies for Nyaya Revolution
-- Security model: Public read for published legal knowledge, strict isolation for
-- user data, moderated community boundaries, and protected admin operations.
-- =============================================================================

-- Enable RLS across every public table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statutory_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.law_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.situation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.situation_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.situation_case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_step_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Helper Functions for Role Checking
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'legal_educator', 'advocate')
  );
$$;

-- -----------------------------------------------------------------------------
-- 1. Identity & Profiles
-- -----------------------------------------------------------------------------

-- Public can read basic profile info (needed for author display in community & comments)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Preferences: Private to the owner
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. Legal Knowledge Base (Public Content)
-- -----------------------------------------------------------------------------

-- Legal Areas and Sources are public reference data
CREATE POLICY "Legal areas viewable by everyone"
  ON public.legal_areas FOR SELECT USING (true);

CREATE POLICY "Legal sources viewable by everyone"
  ON public.legal_sources FOR SELECT USING (true);

-- Acts, Articles, Case Studies, Glossary: Published rows are readable by everyone
CREATE POLICY "Published acts are viewable by everyone"
  ON public.statutory_acts FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage statutory acts"
  ON public.statutory_acts FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Published law articles are viewable by everyone"
  ON public.law_articles FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage law articles"
  ON public.law_articles FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Published case studies are viewable by everyone"
  ON public.case_studies FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage case studies"
  ON public.case_studies FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Published glossary terms are viewable by everyone"
  ON public.glossary_terms FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage glossary terms"
  ON public.glossary_terms FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- -----------------------------------------------------------------------------
-- 3. Situations & Junctions
-- -----------------------------------------------------------------------------

CREATE POLICY "Situation categories are viewable by everyone"
  ON public.situation_categories FOR SELECT USING (true);

CREATE POLICY "Published situations are viewable by everyone"
  ON public.situations FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage situations"
  ON public.situations FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Situation articles viewable by everyone"
  ON public.situation_articles FOR SELECT USING (true);

CREATE POLICY "Situation case studies viewable by everyone"
  ON public.situation_case_studies FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 4. Learning Curriculum & Assessment
-- -----------------------------------------------------------------------------

CREATE POLICY "Published learning journeys viewable by everyone"
  ON public.learning_journeys FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage learning journeys"
  ON public.learning_journeys FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Learning modules viewable by everyone"
  ON public.learning_modules FOR SELECT USING (true);

CREATE POLICY "Lessons viewable by everyone"
  ON public.lessons FOR SELECT
  USING (verification_status = 'published' OR public.is_staff());

CREATE POLICY "Lesson blocks viewable by everyone"
  ON public.lesson_blocks FOR SELECT USING (true);

CREATE POLICY "Quizzes viewable by everyone"
  ON public.quizzes FOR SELECT USING (true);

CREATE POLICY "Quiz questions viewable by everyone"
  ON public.quiz_questions FOR SELECT USING (true);

CREATE POLICY "Scenario simulations viewable by everyone"
  ON public.scenario_simulations FOR SELECT USING (true);

CREATE POLICY "Scenario steps viewable by everyone"
  ON public.scenario_steps FOR SELECT USING (true);

CREATE POLICY "Scenario step options viewable by everyone"
  ON public.scenario_step_options FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 5. Learner Progress (Strict User Ownership)
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can view own journey progress"
  ON public.user_journey_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own journey progress"
  ON public.user_journey_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own lesson progress"
  ON public.user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson progress"
  ON public.user_lesson_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON public.user_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own activity logs"
  ON public.user_activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON public.user_activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 6. Community & Moderation
-- -----------------------------------------------------------------------------

-- Approved stories are viewable by everyone; Authors can also view their pending ones
CREATE POLICY "Stories viewable when approved or by author"
  ON public.citizen_stories FOR SELECT
  USING (moderation_status = 'approved' OR auth.uid() = author_id OR public.is_staff());

CREATE POLICY "Authenticated users can create stories"
  ON public.citizen_stories FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own stories"
  ON public.citizen_stories FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Staff can moderate stories"
  ON public.citizen_stories FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Comments
CREATE POLICY "Approved comments viewable by everyone"
  ON public.story_comments FOR SELECT
  USING (moderation_status = 'approved' OR auth.uid() = author_id OR public.is_staff());

CREATE POLICY "Authenticated users can create comments"
  ON public.story_comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
  ON public.story_comments FOR DELETE
  USING (auth.uid() = author_id);

-- Reactions & Bookmarks
CREATE POLICY "Users can view own reactions"
  ON public.story_reactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reactions"
  ON public.story_reactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks"
  ON public.bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reports: Authenticated users can report content; only staff can view & process
CREATE POLICY "Users can submit reports"
  ON public.content_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Staff can view and process reports"
  ON public.content_reports FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- -----------------------------------------------------------------------------
-- 7. AI Learning Sessions (Strict User Privacy)
-- -----------------------------------------------------------------------------

CREATE POLICY "Users own their AI conversations"
  ON public.ai_conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own their AI messages"
  ON public.ai_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- 8. Content Governance & Auditing
-- -----------------------------------------------------------------------------

CREATE POLICY "Only staff can view verification logs"
  ON public.content_verification_logs FOR SELECT
  USING (public.is_staff());

CREATE POLICY "Only staff can insert verification logs"
  ON public.content_verification_logs FOR INSERT
  WITH CHECK (public.is_staff());

CREATE POLICY "Only admins can view audit events"
  ON public.audit_events FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Audit events can be inserted by authenticated or service"
  ON public.audit_events FOR INSERT
  WITH CHECK (true);
