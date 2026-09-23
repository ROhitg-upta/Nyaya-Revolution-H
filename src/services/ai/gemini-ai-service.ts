/**
 * Nyaya Revolution — Production Gemini-Backed AIService.
 *
 * Implements the full grounded retrieval-augmented generation (RAG) pipeline:
 * Intent Normalization -> Verified Retrieval -> Context Assembly -> Gemini LLM -> Structured Validation -> Source Attribution.
 * Gracefully falls back to MockAIService / deterministic verified responses when offline or unconfigured.
 */

import type {
  AIStreamChunk,
  FollowUpSuggestion,
  PromptContext,
  StructuredResponse,
} from "@/types";
import type { AIService } from "./ai-service";
import { contextBuilder } from "./context-builder";
import { geminiClient } from "./gemini-client";
import { MockAIService } from "./mock-ai-service";
import { buildSituationPrompt } from "./prompts";
import { queryNormalizer } from "./query-normalizer";
import { knowledgeRetrievalService } from "./retrieval.service";
import { structuredResponseValidator } from "./structured-validator";

export class GroundedGeminiAIService implements AIService {
  private readonly fallbackService = new MockAIService();

  isConfigured(): boolean {
    return geminiClient.isConfigured();
  }

  async sendMessage(ctx: PromptContext): Promise<{
    content: string;
    structured: StructuredResponse;
  }> {
    // 1. Normalize query & extract intent
    const normalized = queryNormalizer.normalize(ctx.currentQuestion);

    // 2. Retrieve verified platform knowledge
    const retrieved = await knowledgeRetrievalService.retrieveRelevantKnowledge(
      normalized.canonicalSearchQuery,
      { limit: 4 }
    );

    // 3. Assemble deterministic context with source anchors
    const { systemGroundingContext, assembledSources } = contextBuilder.buildContext(
      normalized,
      retrieved,
      undefined,
      ctx.userContext
    );

    // 4. If Gemini is not configured, return grounded fallback
    if (!this.isConfigured()) {
      const fallbackStructured = structuredResponseValidator.createFallbackResponse(
        assembledSources,
        ctx.currentQuestion
      );
      return {
        content: fallbackStructured.explanation ?? fallbackStructured.summary,
        structured: this.toLegacyStructured(fallbackStructured),
      };
    }

    // 5. Build prompt & invoke Gemini
    const prompt = buildSituationPrompt(ctx.currentQuestion, systemGroundingContext);
    const result = await geminiClient.generateContent(prompt, { jsonMode: true, temperature: 0.2 });

    // 6. Validate & repair response
    const validated = structuredResponseValidator.validateAndRepair(
      result?.rawText,
      assembledSources,
      ctx.currentQuestion
    );

    const legacyStructured = this.toLegacyStructured(validated);

    return {
      content: validated.explanation ?? validated.summary,
      structured: legacyStructured,
    };
  }

  async *streamMessage(ctx: PromptContext): AsyncIterable<AIStreamChunk> {
    // 1. Normalize & retrieve verified knowledge
    const normalized = queryNormalizer.normalize(ctx.currentQuestion);
    const retrieved = await knowledgeRetrievalService.retrieveRelevantKnowledge(
      normalized.canonicalSearchQuery,
      { limit: 4 }
    );

    const { systemGroundingContext, assembledSources } = contextBuilder.buildContext(
      normalized,
      retrieved,
      undefined,
      ctx.userContext
    );

    // If Gemini is unconfigured, stream the verified fallback cleanly
    if (!this.isConfigured()) {
      yield* this.fallbackService.streamMessage(ctx);
      return;
    }

    // 2. Stream explanation tokens from Gemini
    const prompt = buildSituationPrompt(ctx.currentQuestion, systemGroundingContext);
    let fullOutput = "";

    try {
      const stream = geminiClient.streamContent(prompt, { jsonMode: true, temperature: 0.2 });
      for await (const chunk of stream) {
        fullOutput += chunk;
        yield { type: "text", content: chunk };
      }

      // 3. Validate structured output
      const validated = structuredResponseValidator.validateAndRepair(
        fullOutput,
        assembledSources,
        ctx.currentQuestion
      );

      const legacyStructured = this.toLegacyStructured(validated);
      yield { type: "structured", structured: legacyStructured };

      // 4. Generate contextual follow-up recommendations
      const followUps = this.generateFollowUps(validated);
      yield { type: "follow-ups", followUps };

      yield { type: "done" };
    } catch (err) {
      console.warn("Gemini streaming failed, falling back to verified structured guidance:", err);
      const fallback = structuredResponseValidator.createFallbackResponse(assembledSources, ctx.currentQuestion);
      yield { type: "structured", structured: this.toLegacyStructured(fallback) };
      yield { type: "done" };
    }
  }

  async generateTitle(firstMessage: string): Promise<string> {
    const clean = firstMessage.trim().replace(/^["']|["']$/g, "");
    if (clean.length <= 40) return clean;
    return `${clean.slice(0, 37)}...`;
  }

  parseStructuredResponse(raw: string): StructuredResponse {
    const validated = structuredResponseValidator.validateAndRepair(raw);
    return this.toLegacyStructured(validated);
  }

  /**
   * Bridges modern AILearningResponse to legacy UI StructuredResponse schema
   * for 100% backward compatibility with E7.6 components.
   */
  private toLegacyStructured(
    val: ReturnType<typeof structuredResponseValidator.validateAndRepair>
  ): StructuredResponse {
    return {
      situationSummary: val.summary,
      relevantConcept: val.relevantConcepts?.[0] ?? "Statutory Procedural Protection",
      whatYouShouldUnderstand: val.keyPoints,
      rights: val.keyPoints?.map((k) => `Right: ${k}`) ?? ["Right to fair procedure under law"],
      laws: val.sources.map((s) => ({
        name: s.title,
        section: s.citationOrSection ?? "Official Statute",
        description: s.publisher ?? "Ministry of Law & Justice, Govt of India",
      })),
      immediateActions: val.possibleNextSteps ?? ["Preserve documentary evidence", "Consult official portal"],
      documentsRequired: ["Receipt or invoice", "Identity proof", "Written communications"],
      authorities: [
        {
          name: "National Consumer / Citizen Portal",
          description: "Official Government of India redressal channel",
          contact: "1915 / 112",
        },
      ],
      commonMistakes: val.thingsToKeepInMind ?? ["Do not sign blank agreements"],
      practiceQuestion: val.practiceQuestion,
      learningJourney: val.suggestedLessons?.[0]
        ? {
            title: val.suggestedLessons[0].title,
            slug: val.suggestedLessons[0].journeySlug,
            lessons: 3,
          }
        : {
            title: "Campus & Fundamental Rights",
            slug: "student-rights",
            lessons: 3,
          },
      quiz: {
        title: "Test Your Rights",
        questions: 5,
        slug: "student-rights",
      },
      source: {
        title: val.sources[0]?.title ?? "Constitution of India",
        publisher: val.sources[0]?.publisher ?? "Government of India",
        citation: val.sources[0]?.citationOrSection,
        url: val.sources[0]?.url,
      },
      professionalHelp: val.professionalHelpRecommended
        ? "Given the sensitive nature of this matter, consulting an authorized advocate or District Legal Services Authority (DLSA) is strongly encouraged."
        : undefined,
      isGroundingVerified: true,
      groundedArticles: val.sources
        .filter((s) => s.type === "article")
        .map((s) => ({
          slug: s.id.replace(/^article-/, ""),
          title: s.title,
          articleOrSection: s.citationOrSection ?? "Article",
        })),
      groundedLaws: val.sources
        .filter((s) => s.type === "act")
        .map((s) => ({
          slug: s.id.replace(/^act-/, ""),
          title: s.title,
          shortTitle: s.title,
        })),
      groundedCases: val.sources
        .filter((s) => s.type === "case_study")
        .map((s) => ({
          slug: s.id.replace(/^case-/, ""),
          title: s.title,
          citation: s.citationOrSection ?? "Supreme Court of India",
        })),
    };
  }

  private generateFollowUps(
    val: ReturnType<typeof structuredResponseValidator.validateAndRepair>
  ): FollowUpSuggestion[] {
    const list: FollowUpSuggestion[] = [];

    if (val.suggestedLessons?.[0]) {
      list.push({
        type: "course",
        label: `Learn: ${val.suggestedLessons[0].title}`,
        description: "Interactive structured journey",
        href: `/learn/${val.suggestedLessons[0].journeySlug}`,
      });
    }

    if (val.practiceQuestion) {
      list.push({
        type: "quiz",
        label: "Practice Rights Quiz",
        description: "Earn 25 XP testing this concept",
        href: `/learn/${val.suggestedLessons?.[0]?.journeySlug ?? "student-rights"}/quiz`,
      });
    }

    list.push({
      type: "situation",
      label: "Browse Verified Situations",
      description: "Explore 500+ real citizen scenarios",
      href: "/situations",
    });

    return list;
  }
}

export const groundedGeminiAIService = new GroundedGeminiAIService();
