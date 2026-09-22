/**
 * Learning platform domain types.
 *
 * Supports major learning journeys (designed for 20–30+ lessons per journey),
 * modules, rich multi-type lesson structures, interactive pedagogical blocks,
 * and gamification (XP, streaks, levels, badges, certificates).
 */
import type { LucideIcon } from "@/lib/icons";
import type { ContentSource, VerificationStatus } from "./legal-content";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LessonType =
  | "concept"
  | "law_explained"
  | "article_explained"
  | "provision_explained"
  | "real_life_scenario"
  | "case_study"
  | "myth_vs_fact"
  | "dos_and_donts"
  | "documents_and_evidence"
  | "authority_guide"
  | "process_walkthrough"
  | "interactive_scenario"
  | "quick_revision"
  | "flashcards"
  | "glossary_lesson"
  | "practice_quiz"
  | "challenge_scenario";

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

export interface MythVsFactItem {
  myth: string;
  fact: string;
  explanation: string;
}

export interface DosAndDontsPayload {
  dos: string[];
  donts: string[];
}

export interface ProcessStep {
  stepNumber: number;
  title: string;
  description: string;
  expectedTimeline?: string;
  authority?: string;
}

export interface EvidenceItem {
  document: string;
  whyNeeded: string;
  whereToObtain: string;
}

export interface ScenarioOption {
  id: string;
  label: string;
  feedback: string;
  isOptimal: boolean;
  legalConsequence: string;
}

export interface InteractiveScenarioPayload {
  prompt: string;
  context: string;
  options: ScenarioOption[];
}

export interface FlashcardItem {
  front: string;
  back: string;
  context?: string;
}

export interface Lesson {
  slug: string;
  title: string;
  readingMinutes: number;
  lessonType?: LessonType;
  objectives: string[];
  concepts: LessonConcept[];
  terms: LessonTerm[];
  examples: LessonExample[];

  // Rich pedagogical blocks (rendered when provided)
  mythVsFacts?: MythVsFactItem[];
  dosAndDonts?: DosAndDontsPayload;
  processSteps?: ProcessStep[];
  evidenceChecklist?: EvidenceItem[];
  interactiveScenario?: InteractiveScenarioPayload;
  flashcards?: FlashcardItem[];
  caseStudyRef?: string;
  articleRef?: string;

  // Verification
  source?: ContentSource;
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: string;
}

export interface Module {
  title: string;
  summary: string;
  lessons: Lesson[];
}

export type JourneyTag =
  | "continue"
  | "recommended"
  | "trending"
  | "recent"
  | "profile";

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
  source?: ContentSource;
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: string;
}

export type LearningModeId =
  | "learn"
  | "quick"
  | "deep"
  | "scenario"
  | "revision"
  | "test";

export type QuizQuestionType =
  | "mcq"
  | "true_false"
  | "scenario"
  | "next_action"
  | "match_concept"
  | "case_based";

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
  type?: QuizQuestionType;
  difficulty?: Difficulty;
  context?: string;
  relatedLessonSlug?: string;
  relatedConcept?: string;
  source?: ContentSource;
  caseRef?: string;
  articleRef?: string;
}

export type ScenarioEvaluation =
  | "optimal"
  | "acceptable"
  | "risky"
  | "dangerous";

export interface ScenarioStepOption {
  id: string;
  label: string;
  evaluation: ScenarioEvaluation;
  feedback: string;
  legalConcept: string;
  statutorySection?: string;
  points: number;
  nextStepId?: string | null;
}

export interface ScenarioStep {
  id: string;
  situationUpdate?: string;
  prompt: string;
  options: ScenarioStepOption[];
}

export interface ScenarioSimulation {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  context: string;
  initialStepId: string;
  steps: Record<string, ScenarioStep>;
  learningOutcomes: string[];
  relatedLessonSlugs: string[];
  relatedLawSlugs: string[];
  relatedSituationSlugs: string[];
  source?: ContentSource;
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: string;
}

export interface CategoryMastery {
  category: string;
  categoryTitle: string;
  progressPct: number;
  quizzesTaken: number;
  accuracyPct: number;
  status: "strong" | "developing" | "weak";
}

export interface RevisionRecommendation {
  slug: string;
  title: string;
  category: string;
  reason: string;
  type: "lesson" | "quiz" | "scenario" | "flashcard";
  href: string;
}

export interface LegalKnowledgeProgress {
  overallMastery: number;
  streakDays: number;
  lessonsCompleted: number;
  quizzesTaken: number;
  overallAccuracy: number;
  categories: CategoryMastery[];
  weakTopics: string[];
  strongTopics: string[];
  revisionRecommendations: RevisionRecommendation[];
  recentlyLearned: {
    slug: string;
    title: string;
    journeySlug: string;
    completedAt: string;
  }[];
  recommendedNextLesson: {
    slug: string;
    title: string;
    journeySlug: string;
    journeyTitle: string;
    reason: string;
  };
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
