/**
 * Situation Engine domain types.
 *
 * Extensible data model supporting 50+ (and scalable to 500+) Indian legal
 * situations. Connects real-life situations to applicable statutes, rights,
 * authorities, emergency helplines, learning paths, and verified case studies.
 */
import type { LucideIcon } from "@/lib/icons";
import type { ContentSource, VerificationStatus } from "./legal-content";

export type SituationCategoryId =
  | "students"
  | "women"
  | "workers"
  | "consumers"
  | "cyber"
  | "traffic"
  | "tenants"
  | "family"
  | "senior"
  | "citizen"
  | "privacy";

export interface SituationCategory {
  id: SituationCategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
  subcategories?: string[];
}

export interface ApplicableLaw {
  name: string;
  /** Act / section reference, e.g. "Section 6, Consumer Protection Act 2019". */
  reference: string;
  description: string;
  officialSourceUrl?: string;
}

export interface Authority {
  name: string;
  description: string;
  contact?: string;
  portalUrl?: string;
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
  journeySlug?: string;
}

export interface RelatedQuiz {
  title: string;
  questions: number;
  minutes: number;
  quizSlug?: string;
}

export interface Situation {
  slug: string;
  /** First-person framing — "what happened with you". */
  title: string;
  category: SituationCategoryId;
  subcategory?: string;
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

  // Extensible Relationship Graph links
  relatedArticles?: string[];
  relatedActs?: string[];
  relatedCaseStudies?: string[];
  relatedGlossaryTerms?: string[];

  // Content Verification & Governance
  source?: ContentSource;
  verificationStatus?: VerificationStatus;
  lastVerifiedAt?: string;
  reviewNotes?: string;
  version?: number;
}
