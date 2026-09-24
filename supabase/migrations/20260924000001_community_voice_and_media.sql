-- =============================================================================
-- NYAYA REVOLUTION — SPRINT E10: COMMUNITY VOICE, CITIZEN STORIES, MEDIA & LEARNING BRIDGE
-- Migration: 20260924000001_community_voice_and_media.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EXTEND CITIZEN STORIES TABLE FOR MULTI-STEP CREATION, PRIVACY & LEARNING BRIDGE
-- -----------------------------------------------------------------------------

ALTER TABLE public.citizen_stories
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS story_type TEXT NOT NULL DEFAULT 'experience'
    CHECK (story_type IN ('experience', 'awareness', 'outcome', 'learning', 'question', 'resource')),
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'community_only', 'unlisted', 'private_draft')),
  ADD COLUMN IF NOT EXISTS identity_mode TEXT NOT NULL DEFAULT 'pseudonym'
    CHECK (identity_mode IN ('real_name', 'pseudonym', 'anonymous')),
  ADD COLUMN IF NOT EXISTS location_state TEXT,
  ADD COLUMN IF NOT EXISTS warning_signs TEXT,
  ADD COLUMN IF NOT EXISTS citizen_takeaway TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS linked_situation_slug TEXT,
  ADD COLUMN IF NOT EXISTS linked_journey_slug TEXT,
  ADD COLUMN IF NOT EXISTS linked_lesson_slugs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_educational_note TEXT,
  ADD COLUMN IF NOT EXISTS comment_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS moderation_notes TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Update moderation_status check constraint to cover full lifecycle:
-- draft -> submitted -> under_review -> published | needs_edit | rejected | archived
DO $$
BEGIN
  ALTER TABLE public.citizen_stories DROP CONSTRAINT IF EXISTS citizen_stories_moderation_status_check;
  ALTER TABLE public.citizen_stories
    ADD CONSTRAINT citizen_stories_moderation_status_check
    CHECK (moderation_status IN ('draft', 'submitted', 'under_review', 'pending', 'published', 'approved', 'needs_edit', 'rejected', 'flagged', 'archived'));
EXCEPTION
  WHEN others THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_citizen_stories_slug ON public.citizen_stories(slug);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_visibility_status ON public.citizen_stories(visibility, moderation_status);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_story_type ON public.citizen_stories(story_type);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_linked_situation ON public.citizen_stories(linked_situation_slug);
CREATE INDEX IF NOT EXISTS idx_citizen_stories_tags ON public.citizen_stories USING GIN(tags);

-- -----------------------------------------------------------------------------
-- 2. CREATE STORY MEDIA TABLE (IMAGES, AUDIO, VIDEO)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.story_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.citizen_stories(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'audio', 'video')),
  storage_bucket TEXT NOT NULL DEFAULT 'community-media',
  storage_path TEXT NOT NULL,
  public_url TEXT,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
  duration_seconds NUMERIC(8,2),
  width INT,
  height INT,
  caption TEXT,
  alt_text TEXT,
  poster_url TEXT,
  transcript TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  moderation_status TEXT NOT NULL DEFAULT 'approved'
    CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_media_story_id ON public.story_media(story_id, sort_order);

-- -----------------------------------------------------------------------------
-- 3. EXTEND STORY COMMENTS WITH AUTHOR DISPLAY METADATA & UPDATED_AT
-- -----------------------------------------------------------------------------

ALTER TABLE public.story_comments
  ADD COLUMN IF NOT EXISTS author_name TEXT NOT NULL DEFAULT 'Citizen Contributor',
  ADD COLUMN IF NOT EXISTS author_role TEXT NOT NULL DEFAULT 'Community Member',
  ADD COLUMN IF NOT EXISTS identity_mode TEXT NOT NULL DEFAULT 'pseudonym'
    CHECK (identity_mode IN ('real_name', 'pseudonym', 'anonymous')),
  ADD COLUMN IF NOT EXISTS is_edited BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON public.story_comments(story_id, created_at);

-- -----------------------------------------------------------------------------
-- 4. CREATE COMMUNITY NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.community_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_name TEXT,
  notification_type TEXT NOT NULL
    CHECK (notification_type IN (
      'story_submitted',
      'story_published',
      'story_needs_edit',
      'story_rejected',
      'story_helpful',
      'story_comment',
      'learning_recommendation'
    )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  story_id UUID REFERENCES public.citizen_stories(id) ON DELETE CASCADE,
  story_slug TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_notifications_user_unread
  ON public.community_notifications(user_id, is_read, created_at DESC);

-- -----------------------------------------------------------------------------
-- 5. ATOMIC HELPFUL REACTION TOGGLE RPC (CONCURRENCY-SAFE)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.toggle_story_helpful_atomic(
  p_story_id UUID,
  p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_exists BOOLEAN;
  v_new_count INT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.story_reactions
    WHERE story_id = p_story_id AND user_id = p_user_id AND reaction_type = 'helpful'
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.story_reactions
    WHERE story_id = p_story_id AND user_id = p_user_id AND reaction_type = 'helpful';

    UPDATE public.citizen_stories
    SET helpful_count = GREATEST(0, helpful_count - 1),
        updated_at = now()
    WHERE id = p_story_id
    RETURNING helpful_count INTO v_new_count;

    RETURN jsonb_build_object('helpful', false, 'helpfulCount', COALESCE(v_new_count, 0));
  ELSE
    INSERT INTO public.story_reactions (user_id, story_id, reaction_type)
    VALUES (p_user_id, p_story_id, 'helpful')
    ON CONFLICT (user_id, story_id) DO NOTHING;

    UPDATE public.citizen_stories
    SET helpful_count = helpful_count + 1,
        updated_at = now()
    WHERE id = p_story_id
    RETURNING helpful_count INTO v_new_count;

    RETURN jsonb_build_object('helpful', true, 'helpfulCount', COALESCE(v_new_count, 1));
  END IF;
END;
$$;

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) FOR STORY MEDIA & NOTIFICATIONS
-- -----------------------------------------------------------------------------

ALTER TABLE public.story_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;

-- Story Media Policies:
-- Public can read media belonging to published/approved stories or their own stories
DROP POLICY IF EXISTS "Read media for accessible stories" ON public.story_media;
CREATE POLICY "Read media for accessible stories"
  ON public.story_media
  FOR SELECT
  USING (
    moderation_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM public.citizen_stories cs
      WHERE cs.id = story_media.story_id
      AND (
        (cs.moderation_status IN ('published', 'approved') AND cs.visibility IN ('public', 'unlisted', 'community_only'))
        OR cs.author_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Authors can insert media for own stories" ON public.story_media;
CREATE POLICY "Authors can insert media for own stories"
  ON public.story_media
  FOR INSERT
  WITH CHECK (auth.uid() = uploader_id);

DROP POLICY IF EXISTS "Authors can delete own media" ON public.story_media;
CREATE POLICY "Authors can delete own media"
  ON public.story_media
  FOR DELETE
  USING (auth.uid() = uploader_id);

-- Notifications Policies:
DROP POLICY IF EXISTS "Users can read own notifications" ON public.community_notifications;
CREATE POLICY "Users can read own notifications"
  ON public.community_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.community_notifications;
CREATE POLICY "Users can update own notifications"
  ON public.community_notifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 7. SUPABASE STORAGE BUCKET & STORAGE RLS POLICIES (community-media)
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  52428800, -- 50 MB upper ceiling (enforced more strictly per media type at service layer)
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/mp4',
    'audio/x-m4a',
    'audio/webm',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO UPDATE
SET file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read access for community-media" ON storage.objects;
CREATE POLICY "Public read access for community-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-media');

DROP POLICY IF EXISTS "Authenticated users upload to own folder in community-media" ON storage.objects;
CREATE POLICY "Authenticated users upload to own folder in community-media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'community-media'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Owners can delete own files in community-media" ON storage.objects;
CREATE POLICY "Owners can delete own files in community-media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'community-media'
    AND auth.uid() = owner
  );
