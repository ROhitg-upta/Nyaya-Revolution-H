/**
 * Learning platform domain types.
 *
 * Structured so the current static content can be swapped for CMS / API data
 * (and AI-personalised ordering) with no UI changes.
 */
import type { LucideIcon } from "@/lib/icons";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface LessonConcept {
  title: string;
  body: string;
}

export interface LessonTerm {
  term: string;
  definition: string;
}

export interface LessonExample {
  title: string;
  body: string;
}

export interface Lesson {
  slug: string;
  title: string;
  readingMinutes: number;
  objectives: string[];
  concepts: LessonConcept[];
  terms: LessonTerm[];
  examples: LessonExample[];
}

export interface Module {
  title: string;
  summary: string;
  lessons: Lesson[];
}

export type JourneyTag =
  "continue" | "recommended" | "trending" | "recent" | "profile";

export interface Journey {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  /** Completion percentage 0–100 (mock progress). */
  progress: number;
  modules: Module[];
  tags: JourneyTag[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  icon: LucideIcon;
  current: number;
  target: number;
}

export interface WeeklyActivity {
  day: string;
  minutes: number;
}

export interface CertificateItem {
  journeySlug: string;
  title: string;
  earned: boolean;
  date?: string;
}

export interface LearnerProfile {
  name: string;
  xp: number;
  level: number;
  levelTitle: string;
  xpIntoLevel: number;
  xpForLevel: number;
  streakDays: number;
  weekly: WeeklyActivity[];
  badges: BadgeItem[];
  achievements: Achievement[];
  certificates: CertificateItem[];
}

export interface DailyChallenge {
  title: string;
  description: string;
  xp: number;
  journeySlug: string;
}

export interface Bookmark {
  journeySlug: string;
  lessonSlug: string;
  title: string;
  journeyTitle: string;
}
