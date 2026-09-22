/**
 * Case study domain types.
 *
 * Models landmark, verified Indian judgments (Supreme Court & High Courts).
 * Never fabricates case outcomes, bench names, or precedents.
 */
import type { ContentVerificationMeta, LegalArea } from "./legal-content";

export interface CaseStudy extends ContentVerificationMeta {
  slug: string;
  /** Formal case title, e.g. "Justice K.S. Puttaswamy (Retd.) v. Union of India". */
  title: string;
  /** Official law reporter citation, e.g. "(2017) 10 SCC 1". */
  citation: string;
  /** Court name, e.g. "Supreme Court of India". */
  court: string;
  year: number;
  bench?: string;
  legalArea: LegalArea;
  /** Factual background and social context leading to the petition. */
  context: string;
  /** The core dispute or violation of rights. */
  problem: string;
  /** The constitutional or statutory question the Court answered. */
  legalQuestion: string;
  /** Core legal doctrine or concept established or clarified. */
  relevantConcept: string;
  /** Binding decision, directions, or ratio decidendi of the judgment. */
  verifiedOutcome: string;
  /** Significance for Indian jurisprudence and democratic accountability. */
  whyItMatters: string;
  /** Actionable takeaways and rights understanding for the common citizen. */
  citizenLearning: string[];
  /** Associated real-world situation slugs. */
  relatedSituations: string[];
  /** Associated constitutional articles or statutory sections. */
  relatedArticles: string[];
  /** Associated learning journey lessons. */
  relatedLessons?: {
    journeySlug: string;
    lessonSlug: string;
  }[];
}
