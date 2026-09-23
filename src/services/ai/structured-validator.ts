/**
 * Structured Output Validation & Safe Repair Engine.
 *
 * Validates raw Gemini responses against `aiLearningResponseSchema`.
 * Provides resilient repair logic for markdown-wrapped or truncated JSON,
 * and generates deterministic safe fallbacks from verified platform knowledge.
 */

import { aiLearningResponseSchema } from "@/lib/validations";
import type { AILearningResponse, AISourceReference } from "@/types";

export class StructuredResponseValidator {
  /**
   * Parses, validates, and safely repairs raw model text into AILearningResponse.
   */
  validateAndRepair(
    rawText: string | null | undefined,
    retrievedSources: AISourceReference[] = [],
    queryTitle?: string
  ): AILearningResponse {
    if (!rawText || rawText.trim().length === 0) {
      return this.createFallbackResponse(retrievedSources, queryTitle);
    }

    try {
      // 1. Strip markdown code fences if model returned ```json ... ```
      let cleaned = rawText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }

      // 2. Parse JSON
      let parsed: unknown;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // Attempt regex extraction of first JSON object { ... }
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON structure found in output");
        }
      }

      // 3. Validate shape using Zod schema
      const result = aiLearningResponseSchema.safeParse(parsed);
      if (result.success) {
        const validated = result.data;

        // Ensure sources array contains the authoritative retrieved sources
        if (!validated.sources || validated.sources.length === 0) {
          validated.sources = retrievedSources;
        }

        return validated as AILearningResponse;
      }

      console.warn("AI output failed strict schema validation:", result.error.format());
      return this.repairPartial(parsed, retrievedSources, queryTitle);
    } catch (err) {
      console.warn("Failed to parse AI output, building safe grounded fallback:", err);
      return this.createFallbackResponse(retrievedSources, queryTitle);
    }
  }

  /**
   * Recovers partial JSON into a fully valid AILearningResponse.
   */
  private repairPartial(
    partial: unknown,
    sources: AISourceReference[],
    queryTitle?: string
  ): AILearningResponse {
    const obj = (partial && typeof partial === "object" ? partial : {}) as Record<string, unknown>;

    return {
      summary: typeof obj.summary === "string" && obj.summary.length >= 5
        ? obj.summary
        : `Verified statutory guidance regarding ${queryTitle ?? "your legal inquiry"}.`,
      explanation: typeof obj.explanation === "string" ? obj.explanation : undefined,
      keyPoints: Array.isArray(obj.keyPoints)
        ? obj.keyPoints.filter((k): k is string => typeof k === "string")
        : sources.map((s) => `${s.title}: ${s.citationOrSection ?? "Statutory guarantee"}`),
      relevantConcepts: Array.isArray(obj.relevantConcepts)
        ? obj.relevantConcepts.filter((c): c is string => typeof c === "string")
        : sources.map((s) => s.title),
      suggestedLessons: Array.isArray(obj.suggestedLessons)
        ? (obj.suggestedLessons as AILearningResponse["suggestedLessons"])
        : [],
      possibleNextSteps: Array.isArray(obj.possibleNextSteps)
        ? obj.possibleNextSteps.filter((s): s is string => typeof s === "string")
        : ["Collect and preserve all relevant documentation and communication records", "Consult relevant statutory portal or legal aid committee if needed"],
      thingsToKeepInMind: Array.isArray(obj.thingsToKeepInMind)
        ? obj.thingsToKeepInMind.filter((m): m is string => typeof m === "string")
        : ["Do not sign blank documents or accept verbal assurances contrary to written agreements"],
      practiceQuestion: typeof obj.practiceQuestion === "object" && obj.practiceQuestion !== null
        ? (obj.practiceQuestion as AILearningResponse["practiceQuestion"])
        : undefined,
      sources,
      educationalNotice: "Legal awareness and educational guidance only; not formal legal representation.",
      isSensitive: Boolean(obj.isSensitive),
      professionalHelpRecommended: Boolean(obj.professionalHelpRecommended),
    };
  }

  /**
   * Deterministic safe fallback created directly from retrieved verified platform knowledge.
   */
  createFallbackResponse(
    sources: AISourceReference[],
    queryTitle?: string
  ): AILearningResponse {
    const primarySource = sources[0];

    return {
      summary: primarySource
        ? `Under verified Indian law, your inquiry regarding ${queryTitle ?? "this situation"} is governed primarily by ${primarySource.title} (${primarySource.citationOrSection ?? "official statute"}).`
        : `Here is the relevant educational guidance from Nyaya Revolution's verified statutory repository.`,
      explanation:
        "Every citizen is protected by procedural safeguards and statutory remedies. Review the verified legal provisions and recommended lessons below to understand your rights and next steps.",
      keyPoints: sources.length > 0
        ? sources.map((s) => `Governed by ${s.title}${s.citationOrSection ? ` (${s.citationOrSection})` : ""}`)
        : ["Citizens have the right to fair, just, and non-arbitrary legal procedure under Article 21", "Statutory consumer and civil remedies exist for deficiency in service and breach of contract"],
      relevantConcepts: sources.map((s) => s.title),
      suggestedLessons: [
        {
          title: "Fundamental Rights in Daily Life",
          journeySlug: "student-rights",
          lessonSlug: "know-your-campus-rights",
        },
      ],
      possibleNextSteps: [
        "Preserve written evidence (receipts, agreements, emails, notices)",
        "Review the statutory remedies cited in the verified sources below",
        "Reach out to an authorized helpline or District Legal Services Authority (DLSA) if needed",
      ],
      thingsToKeepInMind: [
        "Always demand a written receipt or acknowledgment when submitting complaints to authorities",
        "Be mindful of limitation periods under statutory law",
      ],
      sources,
      educationalNotice: "Legal awareness and educational guidance only; not formal legal representation.",
      isSensitive: false,
      professionalHelpRecommended: false,
    };
  }
}

export const structuredResponseValidator = new StructuredResponseValidator();
