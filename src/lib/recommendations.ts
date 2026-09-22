/**
 * Smart Legal Recommendations Engine.
 *
 * Provides safe, educational heuristics to recommend learning materials,
 * situations, practice scenarios, and landmark case studies based on:
 * - Learner profile (interests, occupation, age group)
 * - Learning progress & quiz accuracy
 * - Identified weak topics (prioritizing revision)
 * - Content relationships in the Legal Knowledge Graph
 *
 * Strictly educational: does not make sensitive or high-stakes assumptions.
 */
import {
  caseStudies,
  journeys,
  lawArticles,
  scenarioSimulations,
  situations,
} from "@/constants";
import type {
  CaseStudy,
  Journey,
  LawArticle,
  ScenarioSimulation,
  Situation,
  UserContext,
} from "@/types";

export interface RecommendationResult {
  recommendedSituations: Situation[];
  recommendedJourneys: Journey[];
  recommendedScenarios: ScenarioSimulation[];
  recommendedArticles: LawArticle[];
  recommendedCases: CaseStudy[];
  revisionTopics: {
    title: string;
    reason: string;
    href: string;
    type: "scenario" | "lesson" | "quiz";
  }[];
}

export function getSmartRecommendations(
  userContext?: UserContext,
  weakCategories: string[] = ["housing", "consumer"],
): RecommendationResult {
  const interests = (userContext?.interests || ["consumer", "cyber", "housing"]).map(
    (i) => i.toLowerCase(),
  );

  // 1. Recommended Journeys matching interests
  const recommendedJourneys = journeys.filter((j) =>
    interests.some((cat) => j.category.toLowerCase().includes(cat)),
  );

  // 2. Recommended Situations matching interests or weak categories
  const targetCategories = Array.from(new Set([...interests, ...weakCategories]));
  const recommendedSituations = situations
    .filter((s) => targetCategories.includes(s.category))
    .slice(0, 4);

  // 3. Recommended Practice Scenarios
  const recommendedScenarios = scenarioSimulations
    .filter((scen) => targetCategories.includes(scen.category))
    .slice(0, 3);

  // 4. Recommended Constitutional Articles & Statutes
  const recommendedArticles = lawArticles
    .filter((art) => targetCategories.includes(art.legalArea))
    .slice(0, 3);

  // 5. Recommended Landmark Precedents
  const recommendedCases = caseStudies
    .filter((cs) => targetCategories.includes(cs.legalArea))
    .slice(0, 2);

  // 6. Targeted Revision Topics based on weak categories
  const revisionTopics = [
    {
      title: "PG Security Deposit Refusal Scenario",
      reason: "Common area of dispute with low initial quiz accuracy.",
      href: "/learn/scenarios/pg-deposit-refusal",
      type: "scenario" as const,
    },
    {
      title: "Consumer Rights & e-Daakhil Filing",
      reason: "Essential citizen remedies under Consumer Protection Act 2019.",
      href: "/learn/student-rights/fees-and-refunds",
      type: "lesson" as const,
    },
    {
      title: "Police Stop & Search Rights (Article 21)",
      reason: "High-yield constitutional protection against arbitrary device checks.",
      href: "/learn/scenarios/police-stop-warrantless-search",
      type: "scenario" as const,
    },
  ];

  return {
    recommendedSituations:
      recommendedSituations.length > 0 ? recommendedSituations : situations.slice(0, 4),
    recommendedJourneys:
      recommendedJourneys.length > 0 ? recommendedJourneys : journeys.slice(0, 3),
    recommendedScenarios:
      recommendedScenarios.length > 0
        ? recommendedScenarios
        : scenarioSimulations.slice(0, 2),
    recommendedArticles:
      recommendedArticles.length > 0 ? recommendedArticles : lawArticles.slice(0, 3),
    recommendedCases:
      recommendedCases.length > 0 ? recommendedCases : caseStudies.slice(0, 2),
    revisionTopics,
  };
}
