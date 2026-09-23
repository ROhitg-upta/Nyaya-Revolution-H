/**
 * Streaming Server-Sent Events (SSE) Route for AI Chat.
 *
 * Streams verified, grounded responses in real time to the frontend chat UI.
 * Handles rate limits, timeouts, and error events gracefully.
 */

import { NextResponse } from "next/server";
import { groundedGeminiAIService } from "@/services/ai";
import type { ChatMessage, PromptContext, ResponseModeId } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message || message.length > 2000) {
      return NextResponse.json(
        { error: "Invalid message payload. Must be non-empty and under 2000 characters." },
        { status: 400 }
      );
    }

    const responseMode = (body.responseMode as ResponseModeId) || "eli15";
    const history = (Array.isArray(body.conversationHistory) ? body.conversationHistory : []) as ChatMessage[];

    const ctx: PromptContext = {
      systemPrompt: "",
      userContext: {},
      responseMode,
      conversationHistory: history,
      currentQuestion: message,
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groundedGeminiAIService.streamMessage(ctx)) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", error: errorMsg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("AI chat API route error:", err);
    return NextResponse.json(
      { error: "Internal server error during AI chat request." },
      { status: 500 }
    );
  }
}
