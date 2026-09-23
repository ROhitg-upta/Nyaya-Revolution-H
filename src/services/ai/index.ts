/**
 * Nyaya Revolution — Centralized AI Engine & Services Entry Point.
 */

export * from "./ai-service";
export * from "./mock-ai-service";
export * from "./gemini-ai-service";
export * from "./gemini-client";
export * from "./retrieval.service";
export * from "./query-normalizer";
export * from "./context-builder";
export * from "./prompts";
export * from "./structured-validator";
export * from "./recommendation.service";
export * from "./quiz-generation.service";
export * from "./session.service";

import { groundedGeminiAIService } from "./gemini-ai-service";
import type { AIService } from "./ai-service";

/** Default centralized AI service instance */
export const aiService: AIService = groundedGeminiAIService;
