/**
 * Nyaya Revolution — Complete Database Types
 *
 * Generated and typed against the production Supabase/PostgreSQL schema.
 * Covers all 8 core domains: Identity, Legal Knowledge, Situations,
 * Learning Curriculum, Assessment, Progress, Community, AI & Governance.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "citizen" | "advocate" | "legal_educator" | "admin";
export type VerificationStatus =
  | "draft"
  | "needs_review"
  | "verified"
  | "published"
  | "archived";
export type LegalAreaId =
  | "constitutional"
  | "criminal"
  | "consumer"
  | "cyber"
  | "labour"
  | "housing"
  | "traffic"
  | "civil"
  | "privacy"
  | "family"
  | "education";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type ModerationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "pending"
  | "published"
  | "approved"
  | "needs_edit"
  | "flagged"
  | "rejected"
  | "archived";
export type ResolutionStatus = "resolved" | "ongoing" | "mediated";
export type JourneyProgressStatus = "not_started" | "in_progress" | "completed";
export type SourceType =
  | "constitution"
  | "central_act"
  | "state_act"
  | "supreme_court"
  | "high_court"
  | "official_gazette"
  | "ministry_rule"
  | "institutional";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          jurisdiction_state: string | null;
          xp_points: number;
          level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          jurisdiction_state?: string | null;
          xp_points?: number;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          jurisdiction_state?: string | null;
          xp_points?: number;
          level?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          preferred_language: string;
          theme: string;
          email_notifications: boolean;
          daily_goal_minutes: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          preferred_language?: string;
          theme?: string;
          email_notifications?: boolean;
          daily_goal_minutes?: number;
          updated_at?: string;
        };
        Update: {
          preferred_language?: string;
          theme?: string;
          email_notifications?: boolean;
          daily_goal_minutes?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      legal_sources: {
        Row: {
          id: string;
          title: string;
          publisher: string;
          source_type: SourceType;
          url: string | null;
          citation: string | null;
          verified_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          publisher: string;
          source_type: SourceType;
          url?: string | null;
          citation?: string | null;
          verified_at?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          publisher?: string;
          source_type?: SourceType;
          url?: string | null;
          citation?: string | null;
          verified_at?: string;
        };
        Relationships: [];
      };
      legal_areas: {
        Row: {
          id: LegalAreaId;
          title: string;
          description: string;
          icon_name: string;
          display_order: number;
        };
        Insert: {
          id: LegalAreaId;
          title: string;
          description: string;
          icon_name: string;
          display_order?: number;
        };
        Update: {
          title?: string;
          description?: string;
          icon_name?: string;
          display_order?: number;
        };
        Relationships: [];
      };
      statutory_acts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_title: string;
          year: number;
          enacted_by: string;
          legal_area_id: LegalAreaId;
          overview: string;
          source_id: string | null;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_title: string;
          year: number;
          enacted_by: string;
          legal_area_id: LegalAreaId;
          overview: string;
          source_id?: string | null;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          short_title?: string;
          year?: number;
          enacted_by?: string;
          legal_area_id?: LegalAreaId;
          overview?: string;
          source_id?: string | null;
          verification_status?: VerificationStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      law_articles: {
        Row: {
          id: string;
          slug: string;
          article_or_section: string;
          act_id: string | null;
          legal_area_id: LegalAreaId;
          title: string;
          simple_explanation: string;
          detailed_explanation: string;
          why_it_exists: string;
          who_it_protects: string;
          real_world_example: string;
          myth: string | null;
          reality: string | null;
          derived_rights: string[];
          source_id: string | null;
          verification_status: VerificationStatus;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          article_or_section: string;
          act_id?: string | null;
          legal_area_id: LegalAreaId;
          title: string;
          simple_explanation: string;
          detailed_explanation: string;
          why_it_exists: string;
          who_it_protects: string;
          real_world_example: string;
          myth?: string | null;
          reality?: string | null;
          derived_rights?: string[];
          source_id?: string | null;
          verification_status?: VerificationStatus;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          article_or_section?: string;
          act_id?: string | null;
          legal_area_id?: LegalAreaId;
          title?: string;
          simple_explanation?: string;
          detailed_explanation?: string;
          why_it_exists?: string;
          who_it_protects?: string;
          real_world_example?: string;
          myth?: string | null;
          reality?: string | null;
          derived_rights?: string[];
          source_id?: string | null;
          verification_status?: VerificationStatus;
          version?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      case_studies: {
        Row: {
          id: string;
          slug: string;
          title: string;
          citation: string;
          court: string;
          year: number;
          bench: string | null;
          legal_area_id: LegalAreaId;
          context: string;
          problem: string;
          legal_question: string;
          relevant_concept: string;
          ratio_decidendi: string;
          verified_outcome: string;
          why_it_matters: string;
          citizen_learning: string[];
          source_id: string | null;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          citation: string;
          court: string;
          year: number;
          bench?: string | null;
          legal_area_id: LegalAreaId;
          context: string;
          problem: string;
          legal_question: string;
          relevant_concept: string;
          ratio_decidendi: string;
          verified_outcome: string;
          why_it_matters: string;
          citizen_learning?: string[];
          source_id?: string | null;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          citation?: string;
          court?: string;
          year?: number;
          bench?: string | null;
          legal_area_id?: LegalAreaId;
          context?: string;
          problem?: string;
          legal_question?: string;
          relevant_concept?: string;
          ratio_decidendi?: string;
          verified_outcome?: string;
          why_it_matters?: string;
          citizen_learning?: string[];
          source_id?: string | null;
          verification_status?: VerificationStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      glossary_terms: {
        Row: {
          id: string;
          slug: string;
          term: string;
          pronunciation: string | null;
          legal_area_id: LegalAreaId;
          simple_explanation: string;
          detailed_explanation: string;
          example: string;
          related_concepts: string[];
          related_laws: string[];
          source_id: string | null;
          verification_status: VerificationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          term: string;
          pronunciation?: string | null;
          legal_area_id: LegalAreaId;
          simple_explanation: string;
          detailed_explanation: string;
          example: string;
          related_concepts?: string[];
          related_laws?: string[];
          source_id?: string | null;
          verification_status?: VerificationStatus;
          created_at?: string;
        };
        Update: {
          term?: string;
          pronunciation?: string | null;
          legal_area_id?: LegalAreaId;
          simple_explanation?: string;
          detailed_explanation?: string;
          example?: string;
          related_concepts?: string[];
          related_laws?: string[];
          source_id?: string | null;
          verification_status?: VerificationStatus;
        };
        Relationships: [];
      };
      situation_categories: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon_name: string;
          display_order: number;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          icon_name: string;
          display_order?: number;
        };
        Update: {
          title?: string;
          description?: string;
          icon_name?: string;
          display_order?: number;
        };
        Relationships: [];
      };
      situations: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category_id: string;
          subcategory: string | null;
          tagline: string;
          summary: string;
          rights: string[];
          laws: Json;
          immediate_actions: string[];
          dont_do: string[];
          documents: string[];
          authorities: Json;
          emergency_contacts: Json;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category_id: string;
          subcategory?: string | null;
          tagline: string;
          summary: string;
          rights?: string[];
          laws?: Json;
          immediate_actions?: string[];
          dont_do?: string[];
          documents?: string[];
          authorities?: Json;
          emergency_contacts?: Json;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          category_id?: string;
          subcategory?: string | null;
          tagline?: string;
          summary?: string;
          rights?: string[];
          laws?: Json;
          immediate_actions?: string[];
          dont_do?: string[];
          documents?: string[];
          authorities?: Json;
          emergency_contacts?: Json;
          verification_status?: VerificationStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      situation_articles: {
        Row: {
          situation_id: string;
          article_id: string;
        };
        Insert: {
          situation_id: string;
          article_id: string;
        };
        Update: {
          situation_id?: string;
          article_id?: string;
        };
        Relationships: [];
      };
      situation_case_studies: {
        Row: {
          situation_id: string;
          case_study_id: string;
        };
        Insert: {
          situation_id: string;
          case_study_id: string;
        };
        Update: {
          situation_id?: string;
          case_study_id?: string;
        };
        Relationships: [];
      };
      learning_journeys: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string;
          description: string;
          category: string;
          difficulty: DifficultyLevel;
          estimated_minutes: number;
          xp_reward: number;
          icon_name: string;
          tags: string[];
          verification_status: VerificationStatus;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tagline: string;
          description: string;
          category: string;
          difficulty?: DifficultyLevel;
          estimated_minutes?: number;
          xp_reward?: number;
          icon_name?: string;
          tags?: string[];
          verification_status?: VerificationStatus;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          tagline?: string;
          description?: string;
          category?: string;
          difficulty?: DifficultyLevel;
          estimated_minutes?: number;
          xp_reward?: number;
          icon_name?: string;
          tags?: string[];
          verification_status?: VerificationStatus;
          order_index?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_modules: {
        Row: {
          id: string;
          journey_id: string;
          title: string;
          summary: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          journey_id: string;
          title: string;
          summary: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          journey_id?: string;
          title?: string;
          summary?: string;
          order_index?: number;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          slug: string;
          title: string;
          lesson_type: string;
          reading_minutes: number;
          objectives: string[];
          order_index: number;
          verification_status: VerificationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          slug: string;
          title: string;
          lesson_type?: string;
          reading_minutes?: number;
          objectives?: string[];
          order_index?: number;
          verification_status?: VerificationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          lesson_type?: string;
          reading_minutes?: number;
          objectives?: string[];
          order_index?: number;
          verification_status?: VerificationStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      lesson_blocks: {
        Row: {
          id: string;
          lesson_id: string;
          block_type: string;
          content: Json;
          order_index: number;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          block_type: string;
          content: Json;
          order_index?: number;
        };
        Update: {
          block_type?: string;
          content?: Json;
          order_index?: number;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          slug: string;
          journey_id: string | null;
          lesson_id: string | null;
          title: string;
          pass_percentage: number;
          xp_reward: number;
          time_limit_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          journey_id?: string | null;
          lesson_id?: string | null;
          title: string;
          pass_percentage?: number;
          xp_reward?: number;
          time_limit_minutes?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          pass_percentage?: number;
          xp_reward?: number;
          time_limit_minutes?: number;
        };
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          options: string[];
          correct_index: number;
          explanation: string;
          difficulty: DifficultyLevel;
          xp: number;
          order_index: number;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          options: string[];
          correct_index: number;
          explanation: string;
          difficulty?: DifficultyLevel;
          xp?: number;
          order_index?: number;
        };
        Update: {
          question?: string;
          options?: string[];
          correct_index?: number;
          explanation?: string;
          difficulty?: DifficultyLevel;
          xp?: number;
          order_index?: number;
        };
        Relationships: [];
      };
      scenario_simulations: {
        Row: {
          id: string;
          slug: string;
          title: string;
          context: string;
          initial_step_id: string;
          learning_outcomes: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          context: string;
          initial_step_id: string;
          learning_outcomes?: string[];
          created_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          context?: string;
          initial_step_id?: string;
          learning_outcomes?: string[];
        };
        Relationships: [];
      };
      scenario_steps: {
        Row: {
          id: string;
          simulation_id: string;
          prompt: string;
          situation_update: string | null;
        };
        Insert: {
          id: string;
          simulation_id: string;
          prompt: string;
          situation_update?: string | null;
        };
        Update: {
          prompt?: string;
          situation_update?: string | null;
        };
        Relationships: [];
      };
      scenario_step_options: {
        Row: {
          id: string;
          step_id: string;
          label: string;
          evaluation: string;
          feedback: string;
          legal_concept: string;
          points: number;
          next_step_id: string | null;
        };
        Insert: {
          id: string;
          step_id: string;
          label: string;
          evaluation: string;
          feedback: string;
          legal_concept: string;
          points?: number;
          next_step_id?: string | null;
        };
        Update: {
          label?: string;
          evaluation?: string;
          feedback?: string;
          legal_concept?: string;
          points?: number;
          next_step_id?: string | null;
        };
        Relationships: [];
      };
      user_journey_progress: {
        Row: {
          user_id: string;
          journey_id: string;
          status: JourneyProgressStatus;
          completion_percentage: number;
          xp_earned: number;
          started_at: string;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          journey_id: string;
          status?: JourneyProgressStatus;
          completion_percentage?: number;
          xp_earned?: number;
          started_at?: string;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          status?: JourneyProgressStatus;
          completion_percentage?: number;
          xp_earned?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_lesson_progress: {
        Row: {
          user_id: string;
          lesson_id: string;
          is_completed: boolean;
          last_accessed_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          is_completed?: boolean;
          last_accessed_at?: string;
          completed_at?: string | null;
        };
        Update: {
          is_completed?: boolean;
          last_accessed_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          max_score: number;
          passed: boolean;
          xp_awarded: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score: number;
          max_score: number;
          passed: boolean;
          xp_awarded?: number;
          completed_at?: string;
        };
        Update: {
          score?: number;
          max_score?: number;
          passed?: boolean;
          xp_awarded?: number;
        };
        Relationships: [];
      };
      user_streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_active_date: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string;
          updated_at?: string;
        };
        Update: {
          current_streak?: number;
          longest_streak?: number;
          last_active_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_activity_logs: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          xp_earned: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          xp_earned?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          activity_type?: string;
          xp_earned?: number;
          metadata?: Json;
        };
        Relationships: [];
      };
      citizen_stories: {
        Row: {
          id: string;
          author_id: string;
          author_name: string;
          author_role: string;
          author_initials: string;
          category: string;
          title: string;
          what_happened: string;
          action_taken: string;
          legal_outcome: string;
          resolution_status: ResolutionStatus;
          statutory_backing: string | null;
          helpful_count: number;
          moderation_status: ModerationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          author_name: string;
          author_role: string;
          author_initials: string;
          category: string;
          title: string;
          what_happened: string;
          action_taken: string;
          legal_outcome: string;
          resolution_status?: ResolutionStatus;
          statutory_backing?: string | null;
          helpful_count?: number;
          moderation_status?: ModerationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          what_happened?: string;
          action_taken?: string;
          legal_outcome?: string;
          resolution_status?: ResolutionStatus;
          statutory_backing?: string | null;
          helpful_count?: number;
          moderation_status?: ModerationStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      story_comments: {
        Row: {
          id: string;
          story_id: string;
          author_id: string;
          content: string;
          moderation_status: ModerationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          author_id: string;
          content: string;
          moderation_status?: ModerationStatus;
          created_at?: string;
        };
        Update: {
          content?: string;
          moderation_status?: ModerationStatus;
        };
        Relationships: [];
      };
      story_reactions: {
        Row: {
          user_id: string;
          story_id: string;
          reaction_type: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          story_id: string;
          reaction_type?: string;
          created_at?: string;
        };
        Update: {
          reaction_type?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          content_type: string;
          content_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_type: string;
          content_id: string;
          created_at?: string;
        };
        Update: {
          content_type?: string;
          content_id?: string;
        };
        Relationships: [];
      };
      content_reports: {
        Row: {
          id: string;
          reporter_id: string;
          content_type: string;
          content_id: string;
          reason: string;
          details: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          content_type: string;
          content_id: string;
          reason: string;
          details?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          status?: string;
          details?: string | null;
        };
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          response_mode: string;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          response_mode?: string;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          response_mode?: string;
          is_pinned?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          structured_payload: Json | null;
          is_bookmarked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          structured_payload?: Json | null;
          is_bookmarked?: boolean;
          created_at?: string;
        };
        Update: {
          content?: string;
          structured_payload?: Json | null;
          is_bookmarked?: boolean;
        };
        Relationships: [];
      };
      content_verification_logs: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          previous_status: VerificationStatus | null;
          new_status: VerificationStatus;
          reviewed_by: string;
          review_notes: string | null;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          previous_status?: VerificationStatus | null;
          new_status: VerificationStatus;
          reviewed_by: string;
          review_notes?: string | null;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          review_notes?: string | null;
        };
        Relationships: [];
      };
      audit_events: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string;
          metadata: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          resource_type: string;
          resource_id: string;
          metadata?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          metadata?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_story_helpful: {
        Args: { story_id: string; delta: number };
        Returns: number;
      };
      record_quiz_attempt: {
        Args: {
          p_quiz_id: string;
          p_score: number;
          p_max_score: number;
          p_passed: boolean;
          p_xp: number;
        };
        Returns: string;
      };
      record_practice_completion: {
        Args: {
          p_scenario_id: string;
          p_score: number;
          p_max_score: number;
          p_passed: boolean;
          p_xp: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      legal_area: LegalAreaId;
      difficulty_level: DifficultyLevel;
      moderation_status: ModerationStatus;
      resolution_status: ResolutionStatus;
      journey_progress_status: JourneyProgressStatus;
      source_type: SourceType;
    };
  };
}
