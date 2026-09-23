/**
 * Legal Knowledge Database Service.
 *
 * Implements the dual-mode adapter pattern: queries live Supabase tables
 * with Row Level Security when configured, and falls back to verified static
 * repository fixtures in offline/static environments.
 */

import { publicEnv } from "@/config";
import { caseStudies } from "@/constants/case-studies";
import { glossaryTerms } from "@/constants/glossary";
import { lawArticles } from "@/constants/laws";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CaseStudy, GlossaryTerm, LawArticle } from "@/types";

export class LegalKnowledgeService {
  /** Retrieves all verified and published statutory articles */
  async getPublishedArticles(): Promise<LawArticle[]> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          const { data, error } = await client
            .from("law_articles")
            .select("*")
            .eq("verification_status", "published");

          if (!error && data && data.length > 0) {
            return data.map((d) => ({
              slug: d.slug,
              title: d.title,
              articleOrSection: d.article_or_section,
              actOrConstitution: "Constitution of India",
              legalArea: d.legal_area_id,
              simpleExplanation: d.simple_explanation,
              detailedExplanation: d.detailed_explanation,
              whyItExists: d.why_it_exists,
              whoItProtects: d.who_it_protects,
              realWorldExample: d.real_world_example,
              commonMisunderstanding: {
                myth: d.myth ?? "",
                reality: d.reality ?? "",
              },
              relatedSituations: [],
              relatedCaseStudies: [],
              relatedLessons: [],
              derivedRights: d.derived_rights,
              quiz: [],
              source: {
                title: "Constitution of India",
                publisher: "Ministry of Law and Justice",
              },
              verificationStatus: d.verification_status,
              lastVerifiedAt: d.updated_at,
              version: d.version,
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to static fixtures:", err);
      }
    }

    return lawArticles;
  }

  /** Retrieves a single article by slug */
  async getArticleBySlug(slug: string): Promise<LawArticle | null> {
    const all = await this.getPublishedArticles();
    return all.find((a) => a.slug === slug) ?? null;
  }

  /** Retrieves all verified and published landmark case studies */
  async getPublishedCaseStudies(): Promise<CaseStudy[]> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          const { data, error } = await client
            .from("case_studies")
            .select("*")
            .eq("verification_status", "published")
            .order("year", { ascending: false });

          if (!error && data && data.length > 0) {
            return data.map((d) => ({
              slug: d.slug,
              title: d.title,
              citation: d.citation,
              court: d.court,
              year: d.year,
              bench: d.bench ?? undefined,
              legalArea: d.legal_area_id,
              context: d.context,
              problem: d.problem,
              legalQuestion: d.legal_question,
              relevantConcept: d.relevant_concept,
              ratioDecidendi: d.ratio_decidendi,
              verifiedOutcome: d.verified_outcome,
              whyItMatters: d.why_it_matters,
              citizenLearning: d.citizen_learning,
              relatedSituations: [],
              relatedArticles: [],
              source: {
                title: d.citation,
                publisher: d.court,
              },
              verificationStatus: d.verification_status,
              lastVerifiedAt: d.updated_at,
              version: 1,
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to static fixtures:", err);
      }
    }

    return caseStudies;
  }

  /** Retrieves a single case study by slug */
  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
    const all = await this.getPublishedCaseStudies();
    return all.find((c) => c.slug === slug) ?? null;
  }

  /** Retrieves all legal glossary terms */
  async getGlossaryTerms(): Promise<GlossaryTerm[]> {
    if (publicEnv.isSupabaseConfigured) {
      try {
        const client = await createSupabaseServerClient();
        if (client) {
          const { data, error } = await client
            .from("glossary_terms")
            .select("*")
            .eq("verification_status", "published")
            .order("term", { ascending: true });

          if (!error && data && data.length > 0) {
            return data.map((d) => ({
              slug: d.slug,
              term: d.term,
              pronunciation: d.pronunciation ?? undefined,
              category: d.legal_area_id,
              simpleExplanation: d.simple_explanation,
              detailedExplanation: d.detailed_explanation,
              example: d.example,
              relatedConcepts: d.related_concepts,
              relatedLaws: d.related_laws,
              relatedSituations: [],
              source: {
                title: "Legal Terms of India",
                publisher: "Nyaya Educational Council",
              },
              verificationStatus: d.verification_status,
              lastVerifiedAt: d.created_at,
              version: 1,
            }));
          }
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to static fixtures:", err);
      }
    }

    return glossaryTerms;
  }
}

export const legalKnowledgeService = new LegalKnowledgeService();
