"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  aiQuerySchema,
  type AIQueryValues,
  explainConceptSchema,
  type ExplainConceptValues,
  generateScenarioSchema,
  type GenerateScenarioValues,
  simplifyLessonSchema,
  type SimplifyLessonValues,
} from "@/lib/validations";
import {
  aiSessionService,
  contextBuilder,
  geminiClient,
  knowledgeRetrievalService,
  learningRecommendationService,
  queryNormalizer,
  quizGenerationService,
  type GeneratedScenarioResult,
  structuredResponseValidator,
} from "@/services/ai";
import {
  buildExplainConceptPrompt,
  buildSimplifyLessonPrompt,
  buildSituationPrompt,
} from "@/services/ai/prompts";
import { learningService } from "@/services/db/learning.service";
import type { AILearningResponse, LearningRecommendation } from "@/types";
import type { ActionResult } from "./types";

/**
 * Primary server action for querying the Grounded AI Learning Engine.
 */
export async function askAILearningEngineAction(
  rawInput: AIQueryValues
): Promise<ActionResult<AILearningResponse>> {
  try {
    const validated = aiQuerySchema.parse(rawInput);

    // 1. Normalize query & classify intent
    const normalized = queryNormalizer.normalize(validated.query);

    // 2. Retrieve verified platform knowledge
    const retrieved = await knowledgeRetrievalService.retrieveRelevantKnowledge(
      normalized.canonicalSearchQuery,
      { limit: 4 }
    );

    // 3. Assemble deterministic context with source anchors
    const { systemGroundingContext, assembledSources } = contextBuilder.buildContext(
      normalized,
      retrieved
    );

    let learningResponse: AILearningResponse;

    // 4. Generate with Gemini or fallback
    if (geminiClient.isConfigured()) {
      const prompt = buildSituationPrompt(validated.query, systemGroundingContext);
      const res = await geminiClient.generateContent(prompt, { jsonMode: true, temperature: 0.2 });
      learningResponse = structuredResponseValidator.validateAndRepair(
        res?.rawText,
        assembledSources,
        validated.query
      );
    } else {
      learningResponse = structuredResponseValidator.createFallbackResponse(
        assembledSources,
        validated.query
      );
    }

    // 5. Persist to user session if authenticated
    const client = await createSupabaseServerClient();
    if (client) {
      const { data: { user } } = await client.auth.getUser();
      if (user) {
        const convId = await aiSessionService.createConversation(
          user.id,
          validated.query.slice(0, 40),
          validated.responseMode
        );
        if (convId) {
          await aiSessionService.appendMessage(convId, {
            role: "user",
            content: validated.query,
          });
          await aiSessionService.appendMessage(convId, {
            role: "assistant",
            content: learningResponse.summary,
            structuredPayload: learningResponse as unknown as import("@/types").StructuredResponse,
          });
        }
      }
    }

    return { success: true, data: learningResponse };
  } catch (err) {
    console.error("askAILearningEngineAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to process AI learning inquiry",
    };
  }
}

/**
 * Server action to explain a specific legal concept or constitutional article.
 */
export async function explainConceptAction(
  rawInput: ExplainConceptValues
): Promise<ActionResult<AILearningResponse>> {
  try {
    const validated = explainConceptSchema.parse(rawInput);
    const normalized = queryNormalizer.normalize(validated.conceptOrSlug);

    const retrieved = await knowledgeRetrievalService.retrieveRelevantKnowledge(
      validated.conceptOrSlug,
      { limit: 3 }
    );

    const { systemGroundingContext, assembledSources } = contextBuilder.buildContext(
      normalized,
      retrieved
    );

    let response: AILearningResponse;

    if (geminiClient.isConfigured()) {
      const prompt = buildExplainConceptPrompt(
        validated.conceptOrSlug,
        systemGroundingContext,
        validated.detailLevel
      );
      const res = await geminiClient.generateContent(prompt, { jsonMode: true, temperature: 0.2 });
      response = structuredResponseValidator.validateAndRepair(
        res?.rawText,
        assembledSources,
        validated.conceptOrSlug
      );
    } else {
      response = structuredResponseValidator.createFallbackResponse(
        assembledSources,
        validated.conceptOrSlug
      );
    }

    return { success: true, data: response };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Concept explanation failed",
    };
  }
}

/**
 * Server action to simplify a dense lesson into citizen-friendly takeaways.
 */
export async function simplifyLessonAction(
  rawInput: SimplifyLessonValues
): Promise<ActionResult<AILearningResponse>> {
  try {
    const validated = simplifyLessonSchema.parse(rawInput);
    const lesson = await learningService.getLesson(validated.journeySlug, validated.lessonSlug);

    if (!lesson) {
      return { success: false, error: "Lesson not found" };
    }

    const lessonText = `${lesson.title}\n\nObjectives: ${lesson.objectives.join("; ")}\n\nConcepts: ${lesson.concepts.map((c) => `${c.title}: ${c.body}`).join("; ")}`;
    const normalized = queryNormalizer.normalize(lesson.title);
    const retrieved = await knowledgeRetrievalService.retrieveRelevantKnowledge(lesson.title, { limit: 2 });

    const { systemGroundingContext, assembledSources } = contextBuilder.buildContext(
      normalized,
      retrieved,
      { type: "lesson", slug: lesson.slug, title: lesson.title, content: lessonText }
    );

    let response: AILearningResponse;

    if (geminiClient.isConfigured()) {
      const prompt = buildSimplifyLessonPrompt(lesson.title, lessonText, systemGroundingContext);
      const res = await geminiClient.generateContent(prompt, { jsonMode: true, temperature: 0.2 });
      response = structuredResponseValidator.validateAndRepair(res?.rawText, assembledSources, lesson.title);
    } else {
      response = structuredResponseValidator.createFallbackResponse(assembledSources, lesson.title);
    }

    return { success: true, data: response };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Lesson simplification failed",
    };
  }
}

/**
 * Server action to fetch personalized learning recommendations.
 */
export async function getRecommendationsAction(context?: {
  journeySlug?: string;
  situationCategory?: string;
}): Promise<ActionResult<LearningRecommendation[]>> {
  try {
    const recs = learningRecommendationService.getRecommendations({
      currentJourneySlug: context?.journeySlug,
      situationCategory: context?.situationCategory,
    });
    return { success: true, data: recs };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not compute recommendations",
    };
  }
}

/**
 * Server action to generate an interactive practice scenario from a verified concept.
 */
export async function generatePracticeScenarioAction(
  rawInput: GenerateScenarioValues
): Promise<ActionResult<GeneratedScenarioResult>> {
  try {
    const validated = generateScenarioSchema.parse(rawInput);
    const result = await quizGenerationService.generateScenario(validated.conceptSlug);
    return { success: true, data: result };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Scenario generation failed",
    };
  }
}
