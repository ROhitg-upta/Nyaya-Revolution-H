/**
 * Situation Engine domain types.
 *
 * All content shaped here is educational placeholder data — structured so a CMS
 * or (future) AI-assisted authoring pipeline can populate it later without any
 * UI changes.
 */
import type { LucideIcon } from "@/lib/icons";

export type SituationCategoryId =
  | "students"
  | "women"
  | "workers"
  | "consumers"
  | "cyber"
  | "traffic"
  | "tenants"
  | "family"
  | "senior";

export interface SituationCategory {
  id: SituationCategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ApplicableLaw {
  name: string;
  /** Act / section reference, e.g. "Section 6, Consumer Protection Act 2019". */
  reference: string;
  description: string;
}

export interface Authority {
  name: string;
  description: string;
}

export interface EmergencyContact {
  label: string;
  number: string;
  description?: string;
}

export interface RelatedLearningPath {
  title: string;
  lessons: number;
  duration: string;
}

export interface RelatedQuiz {
  title: string;
  questions: number;
  minutes: number;
}

export interface Situation {
  slug: string;
  /** First-person framing — "what happened with you". */
  title: string;
  category: SituationCategoryId;
  icon: LucideIcon;
  /** Short one-liner used on cards. */
  tagline: string;
  summary: string;
  rights: string[];
  laws: ApplicableLaw[];
  immediateActions: string[];
  dontDo: string[];
  documents: string[];
  authorities: Authority[];
  emergency: EmergencyContact[];
  learningPath: RelatedLearningPath;
  quiz: RelatedQuiz;
}
