/**
 * Legal Glossary domain types.
 *
 * Defines plain-language legal definitions, practical examples, and cross-references
 * for Indian legal terms (e.g. Zero FIR, Cognizable Offence, Anticipatory Bail, Lok Adalat).
 */
import type { ContentVerificationMeta, LegalArea } from "./legal-content";

export interface GlossaryTerm extends ContentVerificationMeta {
  slug: string;
  term: string;
  pronunciation?: string;
  category: LegalArea;
  /** Short, plain-language definition understandable by any citizen. */
  simpleExplanation: string;
  /** Formal legal explanation with statutory reference or procedural context. */
  detailedExplanation: string;
  /** Relatable, everyday citizen scenario illustrating the term. */
  example: string;
  /** Related legal principles or synonyms. */
  relatedConcepts: string[];
  /** Statutes or sections where this term originates or is codified. */
  relatedLaws: string[];
  /** Associated real-life situation slugs. */
  relatedSituations: string[];
}
