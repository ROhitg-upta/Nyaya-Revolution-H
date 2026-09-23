"use client";

import { useCallback, useRef, useState } from "react";
import type {
  ChatMessage,
  FollowUpSuggestion,
  PromptContext,
  ResponseModeId,
  StructuredResponse,
  UserContext,
} from "@/types";
import { MockAIService } from "@/services/ai/mock-ai-service";

const aiService = new MockAIService();

interface UseChatOptions {
  conversationId?: string;
  responseMode: ResponseModeId;
  messages: ChatMessage[];
  onAddMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => ChatMessage;
  onUpdateAssistant: (update: Partial<ChatMessage>) => void;
}

export function useChat({
  responseMode,
  messages,
  onAddMessage,
  onUpdateAssistant,
}: UseChatOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [structured, setStructured] = useState<StructuredResponse | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpSuggestion[]>([]);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      abortRef.current = false;
      setIsStreaming(true);
      setStreamedContent("");
      setStructured(null);
      setFollowUps([]);

      onAddMessage({ role: "user", content: content.trim() });

      onAddMessage({
        role: "assistant",
        content: "",
      });

      const userContext: UserContext = {};

      const ctx: PromptContext = {
        systemPrompt: "",
        userContext,
        responseMode,
        conversationHistory: messages,
        currentQuestion: content.trim(),
      };

      let fullContent = "";
      let latestStructured: StructuredResponse | null = null;
      let latestFollowUps: FollowUpSuggestion[] = [];

      try {
        const stream = aiService.streamMessage(ctx);

        for await (const chunk of stream) {
          if (abortRef.current) break;

          switch (chunk.type) {
            case "text":
              fullContent += chunk.content ?? "";
              setStreamedContent(fullContent);
              break;
            case "structured":
              latestStructured = chunk.structured ?? null;
              setStructured(latestStructured);
              break;
            case "follow-ups":
              latestFollowUps = chunk.followUps ?? [];
              setFollowUps(latestFollowUps);
              break;
            case "done":
              break;
            case "error":
              fullContent += `\n\n**Error:** ${chunk.error}`;
              setStreamedContent(fullContent);
              break;
          }
        }

        onUpdateAssistant({
          content: fullContent,
          structured: latestStructured ?? undefined,
          followUps: latestFollowUps.length > 0 ? latestFollowUps : undefined,
        });
      } catch {
        onUpdateAssistant({
          content:
            fullContent || "I'm sorry, something went wrong. Please try again.",
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages, responseMode, onAddMessage, onUpdateAssistant],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
  }, []);

  return {
    isStreaming,
    streamedContent,
    structured,
    followUps,
    sendMessage,
    stopStreaming,
  };
}
