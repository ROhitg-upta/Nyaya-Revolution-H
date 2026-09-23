"use client";

import { useCallback, useRef, useState } from "react";
import type {
  AIStreamChunk,
  ChatMessage,
  FollowUpSuggestion,
  PromptContext,
  ResponseModeId,
  StructuredResponse,
  UserContext,
} from "@/types";
import { MockAIService } from "@/services/ai/mock-ai-service";

const fallbackAiService = new MockAIService();

interface UseChatOptions {
  conversationId?: string;
  responseMode: ResponseModeId;
  messages: ChatMessage[];
  onAddMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => ChatMessage;
  onUpdateAssistant: (update: Partial<ChatMessage>) => void;
}

async function* fetchChatStream(
  message: string,
  responseMode: ResponseModeId,
  history: ChatMessage[],
  signal: AbortSignal
): AsyncIterable<AIStreamChunk> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, responseMode, conversationHistory: history }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error(`Chat API error: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const dataStr = trimmed.slice(6);
        if (dataStr === "[DONE]") return;
        try {
          const chunk: AIStreamChunk = JSON.parse(dataStr);
          yield chunk;
        } catch {
          // Ignore partial JSON
        }
      }
    }
  }
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      abortControllerRef.current = new AbortController();
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
        let streamReceived = false;

        try {
          const sseStream = fetchChatStream(
            content.trim(),
            responseMode,
            messages,
            abortControllerRef.current.signal
          );

          for await (const chunk of sseStream) {
            streamReceived = true;
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
                fullContent += `\n\n*Notice:* ${chunk.error}`;
                setStreamedContent(fullContent);
                break;
            }
          }
        } catch (apiErr) {
          // If server SSE fails or is aborted early, fall back to offline mock service
          if (!streamReceived) {
            console.warn("API route stream unavailable, using grounded fallback service:", apiErr);
            const fallbackStream = fallbackAiService.streamMessage(ctx);
            for await (const chunk of fallbackStream) {
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
              }
            }
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
            fullContent || "Unable to complete request. Please review verified statutes or try again.",
        });
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, responseMode, onAddMessage, onUpdateAssistant]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
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
