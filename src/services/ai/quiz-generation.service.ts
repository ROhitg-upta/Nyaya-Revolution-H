/**
 * AI Quiz & Practice Scenario Generation Engine with Governance.
 *
 * Generates interactive scenario practices and quiz questions grounded in
 * verified platform concepts.
 *
 * CRITICAL CONTENT GOVERNANCE:
 * - All AI-generated questions enter with status 'draft' or 'needs_review'.
 * - Never auto-published into official verified curriculum without review.
 * - Sourced strictly from verified statutory text.
 */

import { publicEnv } from "@/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PracticeScenario } from "@/types";
import { contextBuilder } from "./context-builder";
import { geminiClient } from "./gemini-client";
import { buildPracticeScenarioPrompt } from "./prompts";
import { queryNormalizer } from "./query-normalizer";
import { knowledgeRetrievalService } from "./retrieval.service";

export interface GeneratedScenarioResult {
  scenario: PracticeScenario;
  governanceStatus: "draft" | "needs_review";
  generatedByAI: true;
  sourceReferences: string[];
}

export class QuizGenerationService {
  /**
   * Generates a grounded educational practice scenario for a verified concept.
   */
  async generateScenario(conceptName: string): Promise<GeneratedScenarioResult> {
    // 1. Retrieve verified knowledge for this concept
    const normalized = queryNormalizer.normalize(conceptName);
    const retrieved = await knowledgeRetrievalService.retrieveRelevantKnowledge(
      normalized.canonicalSearchQuery,
      { limit: 3 }
    );

    const { systemGroundingContext, assembledSources } = contextBuilder.buildContext(
      normalized,
      retrieved
    );

    // 2. Build prompt and invoke Gemini if available
    if (geminiClient.isConfigured()) {
      const prompt = buildPracticeScenarioPrompt(conceptName, systemGroundingContext);
      const res = await geminiClient.generateContent(prompt, { jsonMode: true, temperature: 0.3 });

      if (res?.rawText) {
        try {
          const parsed = JSON.parse(res.rawText);
          const practice = parsed.practiceQuestion;
          if (practice && Array.isArray(practice.options) && practice.options.length >= 2) {
            const scenario: PracticeScenario = {
              id: `ai-scenario-${Date.now()}`,
              title: `Daily Life Scenario: ${conceptName}`,
              concept: conceptName,
              statutoryBacking: assembledSources[0]?.citationOrSection,
              situationText: practice.question,
              options: practice.options.map((opt: string, idx: number) => ({
                id: `opt-${idx}`,
                text: opt,
                isRecommended: idx === (practice.correctIndex ?? 0),
                rationale: idx === (practice.correctIndex ?? 0)
                  ? practice.explanation ?? "Aligns with procedural law"
                  : "Risky or legally inadvisable action",
              })),
              learningTakeaway: practice.explanation ?? "Always verify statutory remedies under law.",
              governanceStatus: "draft",
            };

            await this.logDraftToGovernance(scenario, "gemini-2.0-flash");

            return {
              scenario,
              governanceStatus: "draft",
              generatedByAI: true,
              sourceReferences: assembledSources.map((s) => s.title),
            };
          }
        } catch (err) {
          console.warn("Failed to parse Gemini scenario, returning verified draft fallback:", err);
        }
      }
    }

    // 3. Deterministic Grounded Fallback Scenario
    const fallbackScenario: PracticeScenario = {
      id: `fallback-scenario-${Date.now()}`,
      title: `Practical Check: ${conceptName}`,
      concept: conceptName,
      statutoryBacking: assembledSources[0]?.citationOrSection ?? "Article 21, Constitution of India",
      situationText: `You encounter an unexpected dispute involving ${conceptName}. The other party insists that you have no rights and demands immediate compliance without written notice.`,
      options: [
        {
          id: "opt-0",
          text: "Demand written notice citing the relevant statutory provision and preserve all communication evidence.",
          isRecommended: true,
          rationale: "Indian administrative and statutory law requires lawful procedure and written reasons.",
        },
        {
          id: "opt-1",
          text: "Verbally agree to all terms on the spot to avoid confrontation.",
          isRecommended: false,
          rationale: "Surrendering rights verbally without legal inspection forfeits evidentiary protections.",
        },
        {
          id: "opt-2",
          text: "Sign an undated blank form or surrender original identity documents.",
          isRecommended: false,
          rationale: "Surrendering original documents or signing blank forms is strictly discouraged and can lead to fraud.",
        },
        {
          id: "opt-3",
          text: "Pay an unreceipted cash penalty to immediately close the matter.",
          isRecommended: false,
          rationale: "Cash payments without an official statutory challan or receipt are unlawful.",
        },
      ],
      learningTakeaway: "Citizens have the right to fair, written procedure and official statutory receipts under law.",
      governanceStatus: "draft",
    };

    return {
      scenario: fallbackScenario,
      governanceStatus: "draft",
      generatedByAI: true,
      sourceReferences: assembledSources.map((s) => s.title),
    };
  }

  /** Logs AI generated draft to governance audit tables if Supabase is connected */
  private async logDraftToGovernance(scenario: PracticeScenario, model: string): Promise<void> {
    if (!publicEnv.isSupabaseConfigured) return;
    try {
      const client = await createSupabaseServerClient();
      if (client) {
        await client.from("content_verification_logs").insert({
          entity_type: "ai_practice_scenario",
          entity_id: scenario.id,
          previous_status: null,
          new_status: "draft",
          reviewed_by: "system_ai_generator",
          review_notes: `Generated by model ${model} for concept ${scenario.concept}. Awaiting advocate review.`,
        });
      }
    } catch (err) {
      console.warn("Could not log scenario to verification log:", err);
    }
  }
}

export const quizGenerationService = new QuizGenerationService();
