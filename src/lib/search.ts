/**
 * Unified Search Engine for Nyaya Revolution.
 *
 * Performs multi-entity search across Situations, Constitutional Articles,
 * Statutory Acts, Learning Journeys, Lessons, Case Studies, and the Legal Glossary.
 */
import {
  caseStudies,
  glossaryTerms,
  journeys,
  lawArticles,
  scenarioSimulations,
  situations,
  statutoryActs,
} from "@/constants";
import { INITIAL_COMMUNITY_STORIES } from "@/constants/community";
import type {
  SearchEntityType,
  SearchResultItem,
  UnifiedSearchResults,
} from "@/types";

export function unifiedSearch(
  query: string,
  filterType: SearchEntityType | "all" = "all",
): UnifiedSearchResults {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {
      query: "",
      total: 0,
      items: [],
      byType: {
        situation: [],
        law: [],
        article: [],
        lesson: [],
        journey: [],
        case_study: [],
        glossary: [],
        story: [],
      },
    };
  }

  const results: SearchResultItem[] = [];

  // 1. Search Situations
  if (filterType === "all" || filterType === "situation") {
    situations.forEach((sit) => {
      const haystack = `${sit.title} ${sit.tagline} ${sit.summary} ${sit.category} ${sit.subcategory ?? ""} ${sit.rights.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `situation-${sit.slug}`,
          type: "situation",
          title: sit.title,
          subtitle: `Situation · ${sit.subcategory ?? sit.category}`,
          summary: sit.summary,
          href: `/situations/${sit.slug}`,
          category: sit.category,
          tags: [sit.category, ...(sit.subcategory ? [sit.subcategory] : [])],
          verificationStatus: sit.verificationStatus,
        });
      }
    });
  }

  // 2. Search Constitutional Articles
  if (filterType === "all" || filterType === "article") {
    lawArticles.forEach((art) => {
      const haystack = `${art.title} ${art.articleOrSection} ${art.simpleExplanation} ${art.whyItExists} ${art.whoItProtects} ${art.derivedRights.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `article-${art.slug}`,
          type: "article",
          title: art.title,
          subtitle: `${art.actOrConstitution} · ${art.legalArea}`,
          summary: art.simpleExplanation,
          href: `/laws/${art.slug}`,
          category: art.legalArea,
          tags: ["Constitution", art.articleOrSection],
          verificationStatus: art.verificationStatus,
        });
      }
    });
  }

  // 3. Search Statutory Acts
  if (filterType === "all" || filterType === "law") {
    statutoryActs.forEach((act) => {
      const provisionsText = act.keyProvisions
        .map((p) => `${p.section} ${p.title} ${p.summary}`)
        .join(" ");
      const haystack = `${act.title} ${act.shortTitle} ${act.overview} ${provisionsText}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `act-${act.slug}`,
          type: "law",
          title: act.title,
          subtitle: `Statutory Act (${act.year}) · ${act.legalArea}`,
          summary: act.overview,
          href: `/laws#${act.slug}`,
          category: act.legalArea,
          tags: [act.shortTitle, "Statute"],
          verificationStatus: act.verificationStatus,
        });
      }
    });
  }

  // 4. Search Case Studies
  if (filterType === "all" || filterType === "case_study") {
    caseStudies.forEach((cs) => {
      const haystack = `${cs.title} ${cs.citation} ${cs.problem} ${cs.relevantConcept} ${cs.whyItMatters} ${cs.citizenLearning.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `case-${cs.slug}`,
          type: "case_study",
          title: cs.title,
          subtitle: `${cs.citation} · ${cs.court}`,
          summary: cs.whyItMatters,
          href: `/case-studies/${cs.slug}`,
          category: cs.legalArea,
          tags: ["Supreme Court", `${cs.year}`],
          verificationStatus: cs.verificationStatus,
        });
      }
    });
  }

  // 5. Search Interactive Scenarios
  if (filterType === "all" || filterType === "situation") {
    scenarioSimulations.forEach((scen) => {
      const haystack =
        `${scen.title} ${scen.tagline} ${scen.context} ${scen.category}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `scenario-${scen.slug}`,
          type: "situation",
          title: scen.title,
          subtitle: `Interactive Scenario · ${scen.category}`,
          summary: scen.tagline,
          href: `/learn/scenarios/${scen.slug}`,
          category: scen.category,
          tags: ["Scenario", scen.difficulty],
          verificationStatus: scen.verificationStatus,
        });
      }
    });
  }

  // 5. Search Glossary Terms
  if (filterType === "all" || filterType === "glossary") {
    glossaryTerms.forEach((term) => {
      const haystack = `${term.term} ${term.simpleExplanation} ${term.detailedExplanation} ${term.example}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `glossary-${term.slug}`,
          type: "glossary",
          title: term.term,
          subtitle: `Legal Definition · ${term.category}`,
          summary: term.simpleExplanation,
          href: `/glossary#${term.slug}`,
          category: term.category,
          tags: ["Glossary", term.category],
          verificationStatus: term.verificationStatus,
        });
      }
    });
  }

  // 6. Search Journeys & Lessons
  if (filterType === "all" || filterType === "journey" || filterType === "lesson") {
    journeys.forEach((j) => {
      if (filterType === "all" || filterType === "journey") {
        const jHaystack = `${j.title} ${j.tagline} ${j.description} ${j.category}`.toLowerCase();
        if (jHaystack.includes(q)) {
          results.push({
            id: `journey-${j.slug}`,
            type: "journey",
            title: j.title,
            subtitle: `Learning Journey · ${j.difficulty}`,
            summary: j.description,
            href: `/learn/${j.slug}`,
            category: j.category,
            tags: ["Journey", j.difficulty],
          });
        }
      }

      if (filterType === "all" || filterType === "lesson") {
        j.modules.forEach((mod) => {
          mod.lessons.forEach((l) => {
            const concepts = l.concepts.map((c) => `${c.title} ${c.body}`).join(" ");
            const lHaystack = `${l.title} ${l.objectives.join(" ")} ${concepts}`.toLowerCase();
            if (lHaystack.includes(q)) {
              results.push({
                id: `lesson-${j.slug}-${l.slug}`,
                type: "lesson",
                title: l.title,
                subtitle: `Lesson in ${j.title}`,
                summary: l.concepts[0]?.body ?? l.objectives[0] ?? "",
                href: `/learn/${j.slug}/${l.slug}`,
                category: j.category,
                tags: ["Lesson", `${l.readingMinutes} min`],
              });
            }
          });
        });
      }
    });
  }

  // 7. Search Published Public Citizen Stories (Strictly excluding private/draft/rejected)
  if (filterType === "all" || filterType === "story") {
    INITIAL_COMMUNITY_STORIES.filter(
      (story) =>
        story.moderationStatus === "published" && story.visibility === "public"
    ).forEach((story) => {
      const haystack = `${story.title} ${story.whatHappened} ${story.actionTaken} ${story.citizenTakeaway} ${story.statutoryBacking} ${story.tags.join(" ")}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          id: `story-${story.id}`,
          type: "story",
          title: story.title,
          subtitle: `Community Voice · ${story.authorName} · ${story.categoryLabel}`,
          summary: story.aiSummary || story.citizenTakeaway,
          href: `/community/stories/${story.slug}`,
          category: story.categoryLabel,
          tags: ["Citizen Story", ...story.tags.slice(0, 2)],
        });
      }
    });
  }

  const byType: Record<SearchEntityType, SearchResultItem[]> = {
    situation: results.filter((r) => r.type === "situation"),
    law: results.filter((r) => r.type === "law"),
    article: results.filter((r) => r.type === "article"),
    lesson: results.filter((r) => r.type === "lesson"),
    journey: results.filter((r) => r.type === "journey"),
    case_study: results.filter((r) => r.type === "case_study"),
    glossary: results.filter((r) => r.type === "glossary"),
    story: results.filter((r) => r.type === "story"),
  };

  return {
    query,
    total: results.length,
    items: results,
    byType,
  };
}
