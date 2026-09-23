-- =============================================================================
-- Migration: 20260923000004_functions_and_triggers.sql
-- Description: Stored procedures, automated triggers, and atomic RPC functions
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Automated updated_at Trigger Function
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Apply to tables with updated_at
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_statutory_acts_updated_at
  BEFORE UPDATE ON public.statutory_acts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_law_articles_updated_at
  BEFORE UPDATE ON public.law_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_situations_updated_at
  BEFORE UPDATE ON public.situations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_learning_journeys_updated_at
  BEFORE UPDATE ON public.learning_journeys
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_user_journey_progress_updated_at
  BEFORE UPDATE ON public.user_journey_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_citizen_stories_updated_at
  BEFORE UPDATE ON public.citizen_stories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER tr_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 2. New User Signup Trigger
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  v_full_name := coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

  -- Create default profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, xp_points, level)
  VALUES (NEW.id, NEW.email, v_full_name, v_avatar_url, 'citizen', 0, 1)
  ON CONFLICT (id) DO NOTHING;

  -- Create default user preferences
  INSERT INTO public.user_preferences (user_id, preferred_language, theme, email_notifications, daily_goal_minutes)
  VALUES (NEW.id, 'en', 'dark', true, 10)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create initial streak record
  INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_active_date)
  VALUES (NEW.id, 1, 1, CURRENT_DATE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger firing on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 3. Atomic RPC: Helpful Counter for Citizen Stories
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.increment_story_helpful(
  story_id UUID,
  delta INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  UPDATE public.citizen_stories
  SET helpful_count = greatest(0, helpful_count + delta)
  WHERE id = story_id
  RETURNING helpful_count INTO v_new_count;

  RETURN v_new_count;
END;
$$;

-- -----------------------------------------------------------------------------
-- 4. Atomic RPC: Record Quiz Attempt with XP Award
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.record_quiz_attempt(
  p_quiz_id UUID,
  p_score INTEGER,
  p_max_score INTEGER,
  p_passed BOOLEAN,
  p_xp INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_attempt_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit quiz attempt';
  END IF;

  -- Insert quiz attempt
  INSERT INTO public.quiz_attempts (user_id, quiz_id, score, max_score, passed, xp_awarded)
  VALUES (v_user_id, p_quiz_id, p_score, p_max_score, p_passed, p_xp)
  RETURNING id INTO v_attempt_id;

  -- Award XP points and calculate level in profile
  IF p_xp > 0 THEN
    UPDATE public.profiles
    SET
      xp_points = xp_points + p_xp,
      level = 1 + floor((xp_points + p_xp) / 250)
    WHERE id = v_user_id;

    -- Log activity
    INSERT INTO public.user_activity_logs (user_id, activity_type, xp_earned, metadata)
    VALUES (
      v_user_id,
      'quiz_completed',
      p_xp,
      jsonb_build_object('quiz_id', p_quiz_id, 'score', p_score, 'passed', p_passed)
    );
  END IF;

  RETURN v_attempt_id;
END;
$$;
