/**
 * Universal Search Engine for Nyaya Revolution (Sprint E19).
 *
 * Performs multi-entity, intent-aware, bilingual (English & Hinglish) search across:
 * - Situations (60+ real-world life scenarios & checklists)
 * - Constitutional Articles & Fundamental Rights
 * - Statutory Acts & Central Laws
 * - Learning Journeys & Modular Lessons
 * - Supreme Court Precedents & Case Studies
 * - Citizen Legal Glossary Definitions
 * - Published Community Voice Stories
 * - Verified Legal Services Authorities (DLSA / SLSA / NALSA) & Lok Adalat Engine
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
import { getGovernedPublishedAuthorities } from "@/services/governance/authority-governance.service";
import type {
  SearchEntityType,
  SearchIntent,
  SearchResultItem,
  UnifiedSearchResults,
} from "@/types";

// ============================================================================
// HINDI / HINGLISH & LEGAL SYNONYM DICTIONARY
// ============================================================================
const HINGLISH_SYNONYMS: Record<string, string[]> = {
  deposit: ["security", "refund", "landlord", "kiraya", "advance", "paisa wapas", "makaan malik"],
  landlord: ["makaan malik", "owner", "tenant", "kirayedaar", "eviction", "rent", "flat"],
  kiraya: ["rent", "deposit", "tenant", "landlord", "kirayedaar"],
  upi: ["cyber", "scam", "fraud", "1930", "bank", "freeze", "payment", "dhokha", "paise"],
  fraud: ["scam", "dhokha", "cheating", "phishing", "fake", "cyber", "420"],
  dhokha: ["fraud", "scam", "cheating", "cyber", "upi"],
  fir: ["police", "complaint", "bnss", "173", "thanedaar", "station", "zero fir", "report"],
  police: ["station", "fir", "thanedaar", "arrest", "search", "bnss", "detention"],
  thana: ["police", "fir", "complaint", "station"],
  salary: ["wages", "vetan", "tankha", "unpaid", "employer", "labour", "company", "boss"],
  vetan: ["salary", "wages", "unpaid", "employer", "labour"],
  tankha: ["salary", "wages", "unpaid", "employer"],
  college: ["fees", "hostel", "university", "ragging", "marksheet", "documents", "campus"],
  fee: ["refund", "college", "school", "coaching", "deposit", "excess fees"],
  refund: ["wapas", "return", "cancellation", "defective", "cpa", "consumer", "1915"],
  challan: ["traffic", "fine", "police", "vehicle", "dl", "licence", "rc", "signal"],
  traffic: ["challan", "fine", "accident", "vehicle", "helmet", "licence"],
  ragging: ["campus", "college", "anti-ragging", "ugc", "student", "harassment"],
  harassment: ["posh", "workplace", "women", "icc", "safety", "mahila"],
  mahila: ["women", "safety", "posh", "domestic", "protection", "icc"],
  consumer: ["defective", "product", "complaint", "cpa", "1915", "nch", "ecommerce", "warranty"],
  samaan: ["product", "goods", "defective", "consumer", "refund"],
  article: ["constitution", "fundamental rights", "article 21", "article 19", "article 14"],
  samvidhan: ["constitution", "fundamental rights", "article 21", "article 14", "article 19"],
  privacy: ["puttaswamy", "article 21", "data", "surveillance", "aadhar", "phone tapping"],
  nalsa: ["dlsa", "legal aid", "free lawyer", "lok adalat", "15100", "authority"],
  dlsa: ["nalsa", "legal aid", "free lawyer", "lok adalat", "15100", "district"],
  "lok adalat": ["adr", "settlement", "conciliation", "compromise", "samjhauta", "15100"],
  samjhauta: ["lok adalat", "settlement", "adr", "conciliation"],
};

/**
 * Normalizes user queries by trimming, removing excessive punctuation,
 * and identifying recognized legal/Hinglish synonyms.
 */
export function normalizeSearchQuery(rawQuery: string): {
  normalized: string;
  expandedTerms: string[];
} {
  const clean = rawQuery
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const terms = clean.split(" ").filter((t) => t.length > 1);
  const expanded = new Set<string>(terms);

  for (const term of terms) {
    for (const [key, synonyms] of Object.entries(HINGLISH_SYNONYMS)) {
      if (term === key || key.includes(term) || term.includes(key)) {
        expanded.add(key);
        synonyms.forEach((s) => expanded.add(s));
      }
    }
  }

  return {
    normalized: clean,
    expandedTerms: Array.from(expanded),
  };
}

/**
 * Classifies search intent based on vocabulary cues.
 */
export function detectSearchIntent(query: string): SearchIntent {
  const q = query.toLowerCase();

  // 1. Situation-first markers
  if (
    /what happened|happened|scam|fraud|refused|deposit|stole|cheated|stolen|police|fir|landlord|flat|evict|salary|wage|broken|accident|fight|harass|ragging|challan|blocked|refund/i.test(
      q
    )
  ) {
    return "situation";
  }

  // 2. Constitutional / Statutory legal knowledge
  if (
    /article\s+\d+|section\s+\d+|act\s+\d{4}|statute|constitution|samvidhan|bns|bnss|ipc|crpc|cpa|it act|high court|supreme court|precedent|citation/i.test(
      q
    )
  ) {
    return "legal_knowledge";
  }

  // 3. Learning & Courses
  if (/lesson|journey|course|quiz|module|learn|practice|study|academy|certificate/i.test(q)) {
    return "learning";
  }

  // 4. Community Voice / Citizen experiences
  if (/story|stories|experience|recovered|anubhav|citizen voice|community|real story/i.test(q)) {
    return "community";
  }

  // 5. Legal Aid & Authorities Resources
  if (/dlsa|slsa|nalsa|lok adalat|helpline|1930|1915|15100|authority|legal aid|free lawyer/i.test(q)) {
    return "resource";
  }

  // 6. Case Studies
  if (/case study|judgment|vs union of india|state of|precedent|puttaswamy|dk basu|vishaka/i.test(q)) {
    return "case_study";
  }

  // 7. Glossary
  if (/definition|meaning of|what is|glossary|shabdakosh|term/i.test(q)) {
    return "glossary";
  }

  return "mixed";
}

/**
 * Universal Search Core Function.
 * Returns ranked, scored, and categorized results across all system entities.
 */
export function unifiedSearch(
  query: string,
  filterType: SearchEntityType | "all" = "all",
  options?: { limit?: number }
): UnifiedSearchResults {
  const qRaw = query.trim();
  if (!qRaw) {
    return {
      query: "",
      normalizedQuery: "",
      intent: "mixed",
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
        resource: [],
      },
    };
  }

  const { normalized, expandedTerms } = normalizeSearchQuery(qRaw);
  const intent = detectSearchIntent(normalized);
  const resultsWithScore: { item: SearchResultItem; score: number }[] = [];

  // Helper to score an item against query & expanded terms
  const calculateScore = (
    title: string,
    subtitle: string,
    summary: string,
    tags: string[] = [],
    entityType: SearchEntityType
  ): number => {
    let score = 0;
    const lowerTitle = title.toLowerCase();
    const lowerSubtitle = subtitle.toLowerCase();
    const lowerSummary = summary.toLowerCase();
    const lowerTags = tags.map((t) => t.toLowerCase());

    // Exact title match gets highest score
    if (lowerTitle === normalized) score += 150;
    else if (lowerTitle.includes(normalized)) score += 90;
    else if (lowerSubtitle.includes(normalized)) score += 50;

    // Intent bonus
    if (
      (intent === "situation" && entityType === "situation") ||
      (intent === "legal_knowledge" && (entityType === "article" || entityType === "law")) ||
      (intent === "learning" && (entityType === "lesson" || entityType === "journey")) ||
      (intent === "community" && entityType === "story") ||
      (intent === "resource" && entityType === "resource")
    ) {
      score += 35;
    }

    // Word tokens & expanded synonym matches
    for (const term of expandedTerms) {
      if (lowerTitle.includes(term)) score += 20;
      if (lowerTags.some((t) => t.includes(term))) score += 15;
      if (lowerSubtitle.includes(term)) score += 10;
      if (lowerSummary.includes(term)) score += 5;
    }

    return score;
  };

  // 1. Situations (Curated real-life scenarios & immediate action checklists)
  if (filterType === "all" || filterType === "situation") {
    situations.forEach((sit) => {
      const score = calculateScore(
        sit.title,
        sit.subcategory ?? sit.category,
        sit.summary + " " + sit.tagline,
        [sit.category, ...(sit.subcategory ? [sit.subcategory] : []), ...sit.rights],
        "situation"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `situation-${sit.slug}`,
            type: "situation",
            title: sit.title,
            subtitle: `Situation · ${sit.subcategory ?? sit.category}`,
            summary: sit.summary,
            href: `/situations/${sit.slug}`,
            category: sit.category,
            tags: [sit.category, ...(sit.subcategory ? [sit.subcategory] : [])],
            verificationStatus: sit.verificationStatus,
            priority: 1,
          },
        });
      }
    });

    // Interactive Scenarios
    scenarioSimulations.forEach((scen) => {
      const score = calculateScore(
        scen.title,
        scen.category,
        scen.tagline + " " + scen.context,
        ["Scenario", scen.category, scen.difficulty],
        "situation"
      );
      if (score > 10) {
        resultsWithScore.push({
          score: score + 5,
          item: {
            id: `scenario-${scen.slug}`,
            type: "situation",
            title: scen.title,
            subtitle: `Interactive Scenario · ${scen.category}`,
            summary: scen.tagline,
            href: `/learn/scenarios/${scen.slug}`,
            category: scen.category,
            tags: ["Interactive", scen.difficulty],
            verificationStatus: scen.verificationStatus,
            priority: 2,
          },
        });
      }
    });
  }

  // 2. Constitutional Articles
  if (filterType === "all" || filterType === "article") {
    lawArticles.forEach((art) => {
      const score = calculateScore(
        art.title,
        art.articleOrSection + " · " + art.actOrConstitution,
        art.simpleExplanation + " " + art.whyItExists,
        ["Constitution", art.articleOrSection, art.legalArea, ...art.derivedRights],
        "article"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `article-${art.slug}`,
            type: "article",
            title: art.title,
            subtitle: `${art.actOrConstitution} (${art.articleOrSection}) · ${art.legalArea}`,
            summary: art.simpleExplanation,
            href: `/laws/${art.slug}`,
            category: art.legalArea,
            tags: ["Constitution", art.articleOrSection],
            verificationStatus: art.verificationStatus,
            priority: 3,
          },
        });
      }
    });
  }

  // 3. Statutory Acts
  if (filterType === "all" || filterType === "law") {
    statutoryActs.forEach((act) => {
      const provisionsText = act.keyProvisions.map((p) => `${p.section} ${p.title} ${p.summary}`).join(" ");
      const score = calculateScore(
        act.title,
        `${act.shortTitle} (${act.year})`,
        act.overview + " " + provisionsText,
        [act.shortTitle, "Statute", act.legalArea],
        "law"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `act-${act.slug}`,
            type: "law",
            title: act.title,
            subtitle: `Statutory Act (${act.year}) · ${act.legalArea}`,
            summary: act.overview,
            href: `/laws#${act.slug}`,
            category: act.legalArea,
            tags: [act.shortTitle, "Statute"],
            verificationStatus: act.verificationStatus,
            priority: 4,
          },
        });
      }
    });
  }

  // 4. Case Studies
  if (filterType === "all" || filterType === "case_study") {
    caseStudies.forEach((cs) => {
      const score = calculateScore(
        cs.title,
        `${cs.citation} · ${cs.court}`,
        cs.whyItMatters + " " + cs.problem + " " + cs.relevantConcept,
        ["Supreme Court", `${cs.year}`, cs.legalArea],
        "case_study"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `case-${cs.slug}`,
            type: "case_study",
            title: cs.title,
            subtitle: `${cs.citation} · ${cs.court}`,
            summary: cs.whyItMatters,
            href: `/case-studies/${cs.slug}`,
            category: cs.legalArea,
            tags: ["Supreme Court", `${cs.year}`],
            verificationStatus: cs.verificationStatus,
            priority: 5,
          },
        });
      }
    });
  }

  // 5. Journeys & Lessons
  if (filterType === "all" || filterType === "journey") {
    journeys.forEach((j) => {
      const score = calculateScore(
        j.title,
        `Learning Journey · ${j.difficulty}`,
        j.description + " " + j.tagline,
        ["Journey", j.difficulty, j.category],
        "journey"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `journey-${j.slug}`,
            type: "journey",
            title: j.title,
            subtitle: `Learning Journey · ${j.difficulty}`,
            summary: j.description,
            href: `/learn/${j.slug}`,
            category: j.category,
            tags: ["Journey", j.difficulty],
            priority: 2,
          },
        });
      }
    });
  }

  if (filterType === "all" || filterType === "lesson") {
    journeys.forEach((j) => {
      j.modules.forEach((mod) => {
        mod.lessons.forEach((l) => {
          const concepts = l.concepts.map((c) => `${c.title} ${c.body}`).join(" ");
          const score = calculateScore(
            l.title,
            `Lesson in ${j.title}`,
            concepts + " " + l.objectives.join(" "),
            ["Lesson", `${l.readingMinutes} min`, j.category],
            "lesson"
          );
          if (score > 10) {
            resultsWithScore.push({
              score,
              item: {
                id: `lesson-${j.slug}-${l.slug}`,
                type: "lesson",
                title: l.title,
                subtitle: `Lesson in ${j.title}`,
                summary: l.concepts[0]?.body ?? l.objectives[0] ?? "",
                href: `/learn/${j.slug}/${l.slug}`,
                category: j.category,
                tags: ["Lesson", `${l.readingMinutes} min`],
                priority: 3,
              },
            });
          }
        });
      });
    });
  }

  // 6. Glossary Terms
  if (filterType === "all" || filterType === "glossary") {
    glossaryTerms.forEach((term) => {
      const score = calculateScore(
        term.term,
        `Legal Definition · ${term.category}`,
        term.simpleExplanation + " " + term.detailedExplanation,
        ["Glossary", term.category],
        "glossary"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `glossary-${term.slug}`,
            type: "glossary",
            title: term.term,
            subtitle: `Legal Definition · ${term.category}`,
            summary: term.simpleExplanation,
            href: `/glossary#${term.slug}`,
            category: term.category,
            tags: ["Glossary", term.category],
            verificationStatus: term.verificationStatus,
            priority: 6,
          },
        });
      }
    });
  }

  // 7. Community Stories (Strict Privacy: ONLY published and public visibility)
  if (filterType === "all" || filterType === "story") {
    INITIAL_COMMUNITY_STORIES.filter(
      (story) => story.moderationStatus === "published" && story.visibility === "public"
    ).forEach((story) => {
      const score = calculateScore(
        story.title,
        `Community Voice · ${story.authorName}`,
        story.whatHappened + " " + story.actionTaken + " " + (story.aiSummary || story.citizenTakeaway),
        ["Citizen Story", story.categoryLabel, ...story.tags],
        "story"
      );
      if (score > 10) {
        resultsWithScore.push({
          score,
          item: {
            id: `story-${story.id}`,
            type: "story",
            title: story.title,
            subtitle: `Community Voice · ${story.authorName} · ${story.categoryLabel}`,
            summary: story.aiSummary || story.citizenTakeaway,
            href: `/community/stories/${story.slug}`,
            category: story.categoryLabel,
            tags: ["Citizen Story", ...story.tags.slice(0, 2)],
            priority: 4,
          },
        });
      }
    });
  }

  // 8. Verified Legal Services Authorities & Lok Adalat (Sprint E12 & E13)
  if (filterType === "all" || filterType === "resource" || filterType === "situation") {
    getGovernedPublishedAuthorities().forEach((auth) => {
      const score = calculateScore(
        auth.officeName,
        `Verified ${auth.authorityType} · ${auth.district ? `${auth.district}, ${auth.state}` : auth.state}`,
        `${auth.jurisdiction}. Services: ${auth.services.join(", ")}. Helpline: ${auth.contact.helpline ?? "15100"}.`,
        [auth.authorityType, auth.state, "Verified Help"],
        "resource"
      );
      if (score > 10) {
        resultsWithScore.push({
          score: score + 15, // boost verified authorities
          item: {
            id: `authority-${auth.id}`,
            type: "resource",
            title: auth.officeName,
            subtitle: `Verified ${auth.authorityType} · ${auth.district ? `${auth.district}, ${auth.state}` : auth.state}`,
            summary: `${auth.jurisdiction} — Services: ${auth.services.join(", ")}. Helpline: ${auth.contact.helpline ?? "15100"}.`,
            href: `/action-center?q=${encodeURIComponent(auth.district || auth.state)}`,
            category: "Verified Help",
            tags: [auth.authorityType, auth.state, "Verified Source"],
            verificationStatus: auth.verificationStatus === "verified" ? "verified" : "needs_review",
            priority: 1,
          },
        });
      }
    });

    // Lok Adalat & ADR Conciliation Tool
    const lokAdalatScore = calculateScore(
      "Lok Adalat & ADR Readiness Engine",
      "Action Center · Conciliation & Settlement Briefs",
      "Interactive 4-step educational simulator and readiness checklist under Sections 19–22B of Legal Services Authorities Act, 1987.",
      ["Lok Adalat", "ADR", "Conciliation", "Helpline 15100"],
      "resource"
    );
    if (lokAdalatScore > 10) {
      resultsWithScore.push({
        score: lokAdalatScore + 20,
        item: {
          id: "lok-adalat-readiness-engine",
          type: "resource",
          title: "Lok Adalat & ADR Readiness Engine (Pre-Litigation Settlement)",
          subtitle: "Action Center · Sections 19–22B Legal Services Authorities Act",
          summary:
            "Educational readiness checklist and conciliation statement preparer for resolving utility, bank, consumer, and tenancy disputes peacefully.",
          href: "/action-center?template=lok-adalat-prep-brief-v1",
          category: "Verified Help",
          tags: ["Lok Adalat", "ADR", "Free Settlement"],
          verificationStatus: "verified",
          priority: 1,
        },
      });
    }
  }

  // Sort by calculated score descending
  resultsWithScore.sort((a, b) => b.score - a.score);

  // Deduplicate by ID
  const seenIds = new Set<string>();
  const deduplicatedItems: SearchResultItem[] = [];

  for (const entry of resultsWithScore) {
    if (!seenIds.has(entry.item.id)) {
      seenIds.add(entry.item.id);
      deduplicatedItems.push(entry.item);
    }
  }

  const finalItems = options?.limit
    ? deduplicatedItems.slice(0, options.limit)
    : deduplicatedItems;

  const byType: Record<SearchEntityType, SearchResultItem[]> = {
    situation: finalItems.filter((r) => r.type === "situation"),
    law: finalItems.filter((r) => r.type === "law"),
    article: finalItems.filter((r) => r.type === "article"),
    lesson: finalItems.filter((r) => r.type === "lesson"),
    journey: finalItems.filter((r) => r.type === "journey"),
    case_study: finalItems.filter((r) => r.type === "case_study"),
    glossary: finalItems.filter((r) => r.type === "glossary"),
    story: finalItems.filter((r) => r.type === "story"),
    resource: finalItems.filter((r) => r.type === "resource"),
  };

  return {
    query: qRaw,
    normalizedQuery: normalized,
    intent,
    total: deduplicatedItems.length,
    items: finalItems,
    byType,
  };
}

/**
 * Curated suggestions for the search bar before or during typing.
 */
export const POPULAR_SEARCH_SUGGESTIONS = [
  "My landlord won't return my deposit",
  "UPI fraud happened 1930 freeze",
  "Police refusing to file FIR (BNSS 173)",
  "College demanding illegal fees & refund",
  "Defective laptop refund denied (CPA 2019)",
  "Understand Article 21 and Privacy Rights",
  "Lok Adalat settlement procedure",
  "Unpaid salary and Labour Commissioner notice",
] as const;

export function getSearchSuggestions(query?: string): string[] {
  if (!query || !query.trim()) {
    return [...POPULAR_SEARCH_SUGGESTIONS];
  }
  const q = query.toLowerCase();
  return POPULAR_SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q));
}
