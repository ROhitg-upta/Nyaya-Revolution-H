-- =============================================================================
-- Migration: 20260923000005_gamification_moderation_analytics.sql
-- Description: Atomic XP & streak increments, moderation queue logging, and Realtime publications
-- Domains: Gamification, Content Governance, Realtime Analytics
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Ensure content_verification_logs allows nullable or system reviewer
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  ALTER TABLE public.content_verification_logs
    ALTER COLUMN reviewed_by DROP NOT NULL;
EXCEPTION WHEN others THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 2. Atomic Practice Scenario Completion RPC with Streak Calculation
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_practice_completion(
  p_scenario_id TEXT,
  p_score INTEGER,
  p_max_score INTEGER,
  p_passed BOOLEAN,
  p_xp INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_old_xp INTEGER := 0;
  v_new_xp INTEGER := 0;
  v_old_level INTEGER := 1;
  v_new_level INTEGER := 1;
  v_curr_streak INTEGER := 1;
  v_longest_streak INTEGER := 1;
  v_last_active DATE;
  v_streak_increased BOOLEAN := false;
  v_leveled_up BOOLEAN := false;
  v_today DATE := CURRENT_DATE;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit practice completion';
  END IF;

  -- 1. Fetch current profile XP and Level
  SELECT xp_points, level INTO v_old_xp, v_old_level
  FROM public.profiles
  WHERE id = v_user_id;

  v_new_xp := coalesce(v_old_xp, 0) + greatest(0, p_xp);
  v_new_level := 1 + floor(v_new_xp / 250);
  IF v_new_level > coalesce(v_old_level, 1) THEN
    v_leveled_up := true;
  END IF;

  -- Update profile
  UPDATE public.profiles
  SET
    xp_points = v_new_xp,
    level = v_new_level,
    updated_at = timezone('utc'::text, now())
  WHERE id = v_user_id;

  -- 2. Fetch and update streaks atomically
  SELECT current_streak, longest_streak, last_active_date
  INTO v_curr_streak, v_longest_streak, v_last_active
  FROM public.user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    -- First activity creates initial streak record
    v_curr_streak := 1;
    v_longest_streak := 1;
    v_streak_increased := true;
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_active_date)
    VALUES (v_user_id, 1, 1, v_today);
  ELSE
    IF v_last_active = v_today THEN
      -- Already active today: maintain streak
      v_streak_increased := false;
    ELSIF v_last_active = (v_today - 1) THEN
      -- Consecutive active day: increment streak
      v_curr_streak := v_curr_streak + 1;
      IF v_curr_streak > v_longest_streak THEN
        v_longest_streak := v_curr_streak;
      END IF;
      v_streak_increased := true;
      UPDATE public.user_streaks
      SET
        current_streak = v_curr_streak,
        longest_streak = v_longest_streak,
        last_active_date = v_today,
        updated_at = timezone('utc'::text, now())
      WHERE user_id = v_user_id;
    ELSE
      -- Streak broken (missed more than 1 day): reset to 1
      v_curr_streak := 1;
      v_streak_increased := true;
      UPDATE public.user_streaks
      SET
        current_streak = 1,
        last_active_date = v_today,
        updated_at = timezone('utc'::text, now())
      WHERE user_id = v_user_id;
    END IF;
  END IF;

  -- 3. Log user activity for audit and Realtime event broadcast
  INSERT INTO public.user_activity_logs (user_id, activity_type, xp_earned, metadata)
  VALUES (
    v_user_id,
    'ai_practice_completed',
    p_xp,
    jsonb_build_object(
      'scenario_id', p_scenario_id,
      'score', p_score,
      'max_score', p_max_score,
      'passed', p_passed,
      'streak', v_curr_streak,
      'leveled_up', v_leveled_up,
      'timestamp', timezone('utc'::text, now())
    )
  );

  -- Return comprehensive result
  RETURN jsonb_build_object(
    'success', true,
    'xp_awarded', p_xp,
    'total_xp', v_new_xp,
    'current_level', v_new_level,
    'leveled_up', v_leveled_up,
    'current_streak', v_curr_streak,
    'longest_streak', v_longest_streak,
    'streak_increased', v_streak_increased
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. Supabase Realtime Publication configuration
-- -----------------------------------------------------------------------------
-- Enable Realtime replication on user_activity_logs, quiz_attempts, and content_verification_logs
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity_logs;
  END IF;
EXCEPTION WHEN duplicate_object THEN null;
          WHEN others THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 4. High-Performance Moderation & Analytics Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_situations_verification_status
  ON public.situations (verification_status);

CREATE INDEX IF NOT EXISTS idx_citizen_stories_moderation_status
  ON public.citizen_stories (moderation_status);

CREATE INDEX IF NOT EXISTS idx_content_verification_logs_entity
  ON public.content_verification_logs (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at
  ON public.user_activity_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_type
  ON public.user_activity_logs (activity_type, created_at DESC);
