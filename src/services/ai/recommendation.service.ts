/**
 * Deterministic + AI Learning Recommendation Engine.
 *
 * Recommends personalized next lessons, revision modules, practice quizzes,
 * and scenario simulations based on:
 * - Completed lessons in user progress
 * - Quiz error concepts
 * - Current situation or journey context
 * - Learner goals
 */

import { journeys } from "@/constants/learning";
import type { LearningRecommendation } from "@/types";

export interface RecommendationContext {
  userId?: string;
  completedLessonSlugs?: string[];
  recentQuizScores?: { quizId: string; score: number; passed: boolean }[];
  currentJourneySlug?: string;
  situationCategory?: string;
}

export class LearningRecommendationService {
  /**
   * Computes personalized learning recommendations.
   */
  getRecommendations(context: RecommendationContext = {}): LearningRecommendation[] {
    const completedSet = new Set(context.completedLessonSlugs ?? []);
    const recommendations: LearningRecommendation[] = [];

    // 1. Check for revision needed based on low quiz scores (< 70%)
    if (context.recentQuizScores && context.recentQuizScores.length > 0) {
      const failed = context.recentQuizScores.find((q) => !q.passed || q.score < 3);
      if (failed) {
        recommendations.push({
          type: "revision",
          title: "Strengthen Your Core Rights Knowledge",
          description: "Review fundamental principles before attempting the certification assessment again.",
          journeySlug: context.currentJourneySlug ?? "student-rights",
          rationale: "Recommended because your recent quiz score highlighted concepts that need reinforcement.",
          xpReward: 35,
        });
      }
    }

    // 2. Identify the next uncompleted lesson in the active journey
    const activeJourney = journeys.find((j) => j.slug === context.currentJourneySlug) ?? journeys[0];
    if (activeJourney) {
      let foundNext = false;
      for (const mod of activeJourney.modules) {
        for (const lesson of mod.lessons) {
          if (!completedSet.has(lesson.slug)) {
            recommendations.push({
              type: "next_lesson",
              title: lesson.title,
              description: lesson.objectives[0] ?? lesson.title,
              journeySlug: activeJourney.slug,
              lessonSlug: lesson.slug,
              rationale: `Next sequential milestone in '${activeJourney.title}'.`,
              xpReward: 50,
            });
            foundNext = true;
            break;
          }
        }
        if (foundNext) break;
      }
    }

    // 3. Situation-driven recommendation (e.g. user explored consumer defect or tenant issue)
    if (context.situationCategory) {
      const cat = context.situationCategory.toLowerCase();
      if (cat.includes("cyber") || cat.includes("online")) {
        recommendations.push({
          type: "scenario",
          title: "Unauthorized UPI Fraud Simulation",
          description: "Practice the exact 3 golden steps to freeze unauthorized transaction liability under RBI guidelines.",
          journeySlug: "cyber-safety",
          lessonSlug: "online-financial-fraud",
          rationale: "Tailored to your recent situational interest in cyber safety.",
          xpReward: 40,
        });
      } else if (cat.includes("housing") || cat.includes("rent") || cat.includes("student")) {
        recommendations.push({
          type: "practice_quiz",
          title: "Campus & Tenancy Rights Challenge",
          description: "Test your ability to spot illegal clauses in rent and hostel agreements.",
          journeySlug: "student-rights",
          quizSlug: "student-rights",
          rationale: "Practical application for tenant and campus situations.",
          xpReward: 30,
        });
      }
    }

    // 4. Default high-value fundamental recommendation if list is short
    if (recommendations.length === 0) {
      recommendations.push({
        type: "next_lesson",
        title: "Know Your Campus & Student Rights",
        description: "Essential fundamental guarantees under UGC rules and constitutional law.",
        journeySlug: "student-rights",
        lessonSlug: "know-your-campus-rights",
        rationale: "Foundational rights journey recommended for every citizen learner.",
        xpReward: 50,
      });
    }

    return recommendations.slice(0, 3);
  }
}

export const learningRecommendationService = new LearningRecommendationService();
