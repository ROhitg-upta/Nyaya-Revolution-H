/**
 * Deterministic Context Assembly & Token Budgeting Engine.
 *
 * Constructs grounded context blocks combining:
 * 1. Normalized User Question & Intent
 * 2. Top-Ranked Verified Platform Content (with strict source references)
 * 3. Currently active lesson / situation (if applicable)
 * 4. User Learning State (XP, streak, level)
 *
 * Formats verifiable citation anchors ([SOURCE-1], [SOURCE-2]) to ensure
 * absolute traceability of all generated explanations.
 */

import type { AISourceReference, RetrievedKnowledgeItem, UserContext } from "@/types";
import type { NormalizedQuery } from "./query-normalizer";

export interface AssembledAIContext {
  systemGroundingContext: string;
  assembledSources: AISourceReference[];
  tokenEstimate: number;
}

export class ContextBuilder {
  private readonly MAX_CONTEXT_CHARS = 12000; // ~3000 tokens

  /**
   * Assembles the complete grounded context for LLM prompt orchestration.
   */
  buildContext(
    normalized: NormalizedQuery,
    retrievedItems: RetrievedKnowledgeItem[],
    currentEntity?: { type: "situation" | "lesson" | "article"; slug: string; title: string; content?: string },
    userContext?: UserContext
  ): AssembledAIContext {
    const assembledSources: AISourceReference[] = [];
    const contextSections: string[] = [];

    // Section 1: User Learning Profile (if provided)
    if (userContext?.name || userContext?.interests?.length) {
      contextSections.push(
        `### USER LEARNING PROFILE\n` +
        `- Learner Name: ${userContext.name ?? "Citizen Learner"}\n` +
        `- Interests: ${userContext.interests?.join(", ") ?? "General Legal Rights"}\n`
      );
    }

    // Section 2: Current Focused Resource (if user is browsing a specific article/lesson)
    if (currentEntity) {
      contextSections.push(
        `### CURRENTLY ACTIVE LESSON / STATUTE\n` +
        `- Type: ${currentEntity.type.toUpperCase()}\n` +
        `- Title: ${currentEntity.title}\n` +
        `- Details: ${currentEntity.content ? currentEntity.content.slice(0, 1500) : "No full text provided"}\n`
      );
    }

    // Section 3: Verified Platform Knowledge Base
    contextSections.push(`### VERIFIED NYAYA REVOLUTION STATUTORY REPOSITORY (GROUNDING SOURCE)`);

    let currentLength = contextSections.join("\n\n").length;
    let sourceIndex = 1;

    for (const item of retrievedItems) {
      const sourceRef: AISourceReference = {
        id: item.id,
        type: item.type,
        title: item.title,
        citationOrSection: item.citation,
        publisher: item.publisher,
        url: item.url,
        verificationStatus: item.verificationStatus,
        relevanceScore: item.score,
      };

      const sourceBlock =
        `[SOURCE-${sourceIndex}]: ${item.title}\n` +
        `- Entity Type: ${item.type.toUpperCase()}\n` +
        `- Statutory Citation: ${item.citation ?? "Official Gazette / Government of India"}\n` +
        `- Publisher / Authority: ${item.publisher ?? "Ministry of Law & Justice / Supreme Court of India"}\n` +
        `- Summary & Rights: ${item.snippet}\n` +
        (item.fullText ? `- Legal Detail: ${item.fullText.slice(0, 1200)}\n` : "");

      if (currentLength + sourceBlock.length > this.MAX_CONTEXT_CHARS) {
        break; // Respect token budget
      }

      contextSections.push(sourceBlock);
      assembledSources.push(sourceRef);
      currentLength += sourceBlock.length;
      sourceIndex += 1;
    }

    // Section 4: Intent Classification & Missing Context Guidance
    if (normalized.classification.categoryIds.length > 0) {
      contextSections.push(
        `### SITUATION CLASSIFICATION & RELEVANT TOPICS\n` +
        `- Identified Legal Area(s): ${normalized.classification.categoryIds.join(", ")}\n` +
        `- Key Concepts: ${normalized.classification.conceptIds.join(", ")}\n` +
        (normalized.classification.missingContext && normalized.classification.missingContext.length > 0
          ? `- Recommended Clarifying Context: ${normalized.classification.missingContext.join("; ")}\n`
          : "")
      );
    }

    const fullContextString = contextSections.join("\n\n");
    const tokenEstimate = Math.ceil(fullContextString.length / 4);

    return {
      systemGroundingContext: fullContextString,
      assembledSources,
      tokenEstimate,
    };
  }
}

export const contextBuilder = new ContextBuilder();
