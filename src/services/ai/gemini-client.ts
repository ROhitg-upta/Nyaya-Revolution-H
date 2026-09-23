/**
 * Nyaya Revolution — Resilient Gemini API Client.
 *
 * Server-side communication with Google Gemini 2.0 / 1.5.
 * Features:
 * - Strict server-side secret isolation
 * - 15-second timeout abort signals
 * - Exponential backoff retry on transient errors
 * - Native JSON generation config
 * - Streaming support via Server-Sent Events (SSE)
 * - Safe error masking (never leak API keys or internal stack in responses)
 */

import { serverEnv } from "@/config/env";

export interface GeminiGenerateOptions {
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
}

export interface GeminiResponse {
  rawText: string;
  finishReason?: string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

export class GeminiClient {
  private readonly baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  /**
   * Checks if Gemini API key is configured on the server.
   */
  isConfigured(): boolean {
    return Boolean(serverEnv.geminiApiKey && serverEnv.geminiApiKey.trim().length > 0);
  }

  /**
   * Generates text/structured content with retry and timeout protection.
   */
  async generateContent(
    prompt: string,
    options: GeminiGenerateOptions = {}
  ): Promise<GeminiResponse | null> {
    if (!this.isConfigured()) {
      return null;
    }

    const model = serverEnv.geminiModel || "gemini-2.0-flash";
    const endpoint = `${this.baseUrl}/models/${model}:generateContent?key=${serverEnv.geminiApiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
        responseMimeType: options.jsonMode ? "application/json" : "text/plain",
      },
    };

    const maxRetries = 2;
    let delayMs = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(18000), // 18s timeout
        });

        if (response.ok) {
          const json = await response.json();
          const candidate = json.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text ?? "";

          return {
            rawText: text,
            finishReason: candidate?.finishReason,
            usageMetadata: json.usageMetadata,
          };
        }

        // Retry on 429 (rate limit) or 503 (service unavailable)
        if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
          console.warn(`Gemini API returned ${response.status}. Retrying in ${delayMs}ms... (attempt ${attempt + 1})`);
          await new Promise((r) => setTimeout(r, delayMs));
          delayMs *= 2;
          continue;
        }

        const errorText = await response.text();
        console.error(`Gemini API error [${response.status}]:`, errorText.slice(0, 300));
        return null;
      } catch (err) {
        if (attempt < maxRetries) {
          console.warn(`Gemini fetch failed: ${err instanceof Error ? err.message : String(err)}. Retrying in ${delayMs}ms...`);
          await new Promise((r) => setTimeout(r, delayMs));
          delayMs *= 2;
          continue;
        }
        console.error("Gemini request exceeded maximum retries:", err);
        return null;
      }
    }

    return null;
  }

  /**
   * Streams content from Gemini via Server-Sent Events.
   */
  async *streamContent(
    prompt: string,
    options: GeminiGenerateOptions = {}
  ): AsyncIterable<string> {
    if (!this.isConfigured()) {
      return;
    }

    const model = serverEnv.geminiModel || "gemini-2.0-flash";
    const endpoint = `${this.baseUrl}/models/${model}:streamGenerateContent?alt=sse&key=${serverEnv.geminiApiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
        responseMimeType: options.jsonMode ? "application/json" : "text/plain",
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok || !response.body) {
      console.error(`Gemini stream error: HTTP ${response.status}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    try {
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
              const parsed = JSON.parse(dataStr);
              const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textChunk) {
                yield textChunk;
              }
            } catch {
              // Ignore partial JSON parsing during streaming
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

export const geminiClient = new GeminiClient();
