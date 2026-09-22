/**
 * Legal Knowledge Relationship Graph Engine.
 *
 * Provides dynamic relational traversals across the Nyaya Revolution knowledge base:
 * Situation ↕ Legal Area ↕ Right ↕ Law/Article ↕ Journey ↕ Lesson ↕ Case Study ↕ Glossary Term.
 *
 * Pages and components call these query helpers rather than hardcoding cross-links.
 */
import {
  caseStudies,
  getJourney,
  getLawArticle,
  getSituation,
  getStatutoryAct,
  glossaryTerms,
  lawArticles,
  situations,
  statutoryActs,
} from "@/constants";
import type {
  CaseStudy,
  GlossaryTerm,
  Journey,
  LawArticle,
  LegalArea,
  Situation,
  StatutoryAct,
} from "@/types";

/** Fetches all Constitutional Articles and Acts associated with a situation. */
export function getRelatedLawsForSituation(situationSlug: string): {
  articles: LawArticle[];
  acts: StatutoryAct[];
} {
  const situation = getSituation(situationSlug);
  if (!situation) return { articles: [], acts: [] };

  const articles = lawArticles.filter(
    (art) =>
      situation.relatedArticles?.includes(art.slug) ||
      art.relatedSituations.includes(situationSlug),
  );

  const acts = statutoryActs.filter(
    (act) =>
      situation.relatedActs?.includes(act.slug) ||
      act.relatedSituations.includes(situationSlug),
  );

  return { articles, acts };
}

/** Fetches all situations that demonstrate or invoke a specific Constitutional Article. */
export function getRelatedSituationsForArticle(articleSlug: string): Situation[] {
  const article = getLawArticle(articleSlug);
  if (!article) return [];

  return situations.filter(
    (sit) =>
      article.relatedSituations.includes(sit.slug) ||
      sit.relatedArticles?.includes(articleSlug),
  );
}

/** Fetches all situations governed by a statutory act. */
export function getRelatedSituationsForAct(actSlug: string): Situation[] {
  const act = getStatutoryAct(actSlug);
  if (!act) return [];

  return situations.filter(
    (sit) =>
      act.relatedSituations.includes(sit.slug) ||
      sit.relatedActs?.includes(actSlug),
  );
}

/** Fetches landmark Supreme Court case studies relevant to a situation. */
export function getRelatedCaseStudiesForSituation(
  situationSlug: string,
): CaseStudy[] {
  const situation = getSituation(situationSlug);
  if (!situation) return [];

  return caseStudies.filter(
    (cs) =>
      situation.relatedCaseStudies?.includes(cs.slug) ||
      cs.relatedSituations.includes(situationSlug),
  );
}

/** Fetches landmark case studies explaining an Article. */
export function getRelatedCaseStudiesForArticle(
  articleSlug: string,
): CaseStudy[] {
  const article = getLawArticle(articleSlug);
  if (!article) return [];

  return caseStudies.filter(
    (cs) =>
      article.relatedCaseStudies.includes(cs.slug) ||
      cs.relatedArticles.includes(articleSlug),
  );
}

/** Fetches glossary terms applicable to a situation. */
export function getRelatedGlossaryForSituation(
  situationSlug: string,
): GlossaryTerm[] {
  const situation = getSituation(situationSlug);
  if (!situation) return [];

  return glossaryTerms.filter(
    (term) =>
      situation.relatedGlossaryTerms?.includes(term.slug) ||
      term.relatedSituations.includes(situationSlug),
  );
}

/** Fetches all knowledge entities belonging to a specific Legal Area. */
export function getEntitiesForLegalArea(legalArea: LegalArea) {
  const matchingSituations = situations.filter((s) => {
    // Map situation categories to legal areas
    const map: Record<string, LegalArea> = {
      students: "education",
      tenants: "housing",
      consumers: "consumer",
      cyber: "cyber",
      women: "civil",
      traffic: "traffic",
      workers: "labour",
      citizen: "constitutional",
      privacy: "privacy",
      family: "family",
      senior: "family",
    };
    return map[s.category] === legalArea;
  });

  const matchingArticles = lawArticles.filter(
    (art) => art.legalArea === legalArea,
  );
  const matchingActs = statutoryActs.filter((act) => act.legalArea === legalArea);
  const matchingCases = caseStudies.filter((cs) => cs.legalArea === legalArea);
  const matchingGlossary = glossaryTerms.filter(
    (term) => term.category === legalArea,
  );

  return {
    situations: matchingSituations,
    articles: matchingArticles,
    acts: matchingActs,
    caseStudies: matchingCases,
    glossary: matchingGlossary,
  };
}

/** Fetches learning journeys related to a legal area or situation. */
export function getRelatedJourneysForSituation(
  situationSlug: string,
): Journey[] {
  const situation = getSituation(situationSlug);
  if (!situation) return [];

  const targetSlug = situation.learningPath?.journeySlug;
  if (!targetSlug) return [];

  const j = getJourney(targetSlug);
  return j ? [j] : [];
}
