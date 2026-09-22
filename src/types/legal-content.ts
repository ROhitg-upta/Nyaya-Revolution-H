/**
 * Legal content domain types — Content verification metadata, Constitutional
 * Articles, Statutory Acts, and Legal Areas.
 *
 * All legal entities across the platform inherit or embed `ContentVerificationMeta`
 * to guarantee that every article, provision, and case references verified official
 * sources (India Code, Constitution of India, Supreme Court of India) with audit trails.
 */
import type { LucideIcon } from "@/lib/icons";
import type { QuizQuestion } from "./learning";

export type VerificationStatus = "draft" | "needs_review" | "verified";

export interface ContentSource {
  title: string;
  publisher: string;
  url?: string;
  citation?: string;
}

export interface ContentVerificationMeta {
  source: ContentSource;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string; // ISO date format: YYYY-MM-DD
  reviewNotes?: string;
  version: number;
}

export type LegalArea =
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

export interface LegalAreaMeta {
  id: LegalArea;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * "Understand the Article / Provision" structured model.
 * Explains articles and provisions in plain citizen language without fabricating
 * statutory text or advice.
 */
export interface LawArticle extends ContentVerificationMeta {
  slug: string;
  title: string;
  articleOrSection: string;
  actOrConstitution: string;
  legalArea: LegalArea;
  /** High-level summary of what the article guarantees. */
  simpleExplanation: string;
  /** Deep-dive into scope, historical constitutional context, and judicial interpretation. */
  detailedExplanation: string;
  /** The constitutional or statutory rationale for this provision's existence. */
  whyItExists: string;
  /** Target beneficiaries and groups protected under this law. */
  whoItProtects: string;
  /** Practical real-world citizen scenario demonstrating this article in action. */
  realWorldExample: string;
  /** Common misunderstanding / Myth vs Reality for ordinary citizens. */
  commonMisunderstanding: {
    myth: string;
    reality: string;
  };
  /** Cross-references to situations in the Situation Engine. */
  relatedSituations: string[];
  /** Cross-references to verified landmark case studies. */
  relatedCaseStudies: string[];
  /** Learning journeys and lessons covering this provision. */
  relatedLessons: {
    journeySlug: string;
    lessonSlug: string;
    title: string;
  }[];
  /** Fundamental rights or statutory rights derived from this provision. */
  derivedRights: string[];
  /** Quick comprehension quiz questions. */
  quiz: QuizQuestion[];
}

export interface KeyProvision {
  section: string;
  title: string;
  summary: string;
  punishmentOrRemedy?: string;
  officialCitation?: string;
}

export interface StatutoryAct extends ContentVerificationMeta {
  slug: string;
  title: string;
  shortTitle: string;
  year: number;
  enactedBy: string;
  legalArea: LegalArea;
  overview: string;
  keyProvisions: KeyProvision[];
  authoritiesCreated: {
    name: string;
    role: string;
    level: string;
  }[];
  citizenRemedies: string[];
  relatedSituations: string[];
  relatedArticles: string[];
}
