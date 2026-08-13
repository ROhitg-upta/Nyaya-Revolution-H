/**
 * AI service contract.
 *
 * The entire AI module depends on this interface — never on a concrete provider.
 * Today it's fulfilled by `MockAIService`; swapping in Gemini requires zero
 * changes to UI or provider code — just replace the export in `index.ts`.
 */
import type {
  AIStreamChunk,
  Conversation,
  PromptContext,
  StructuredResponse,
} from "@/types";

export interface AIServiceConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIService {
  /** Send a message and get a full response (non-streaming). */
  sendMessage(ctx: PromptContext): Promise<{
    content: string;
    structured: StructuredResponse;
  }>;

  /** Send a message and receive streamed chunks (streaming-ready). */
  streamMessage(ctx: PromptContext): AsyncIterable<AIStreamChunk>;

  /** Generate a title for a conversation based on the first message. */
  generateTitle(firstMessage: string): Promise<string>;

  /** Parse raw AI text into the structured response format. */
  parseStructuredResponse(raw: string): StructuredResponse;

  /** Check whether the service is configured and ready. */
  isConfigured(): boolean;
}

export interface ConversationStore {
  getAll(): Conversation[];
  getById(id: string): Conversation | null;
  save(conversation: Conversation): void;
  delete(id: string): void;
  pin(id: string, pinned: boolean): void;
  bookmarkMessage(conversationId: string, messageId: string, bookmarked: boolean): void;
  getBookmarkedMessages(): { conversation: Conversation; message: import("@/types").ChatMessage }[];
}
