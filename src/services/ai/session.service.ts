/**
 * Privacy-Aware AI Session & Message Persistence Service.
 *
 * Backed by Supabase PostgreSQL tables `ai_conversations` and `ai_messages`.
 * Protected by Row-Level Security (RLS) ensuring strict user privacy isolation.
 * Automatically sanitizes sensitive data and supports guest fallback.
 */

import { publicEnv } from "@/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";
import type { Conversation, ResponseModeId, StructuredResponse } from "@/types";

export class AISessionService {
  /**
   * Retrieves all conversations for the authenticated user.
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    if (!publicEnv.isSupabaseConfigured) return [];

    try {
      const client = await createSupabaseServerClient();
      if (!client) return [];

      const { data, error } = await client
        .from("ai_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error || !data) return [];

      return data.map((c) => ({
        id: c.id,
        title: c.title,
        messages: [],
        createdAt: new Date(c.created_at).getTime(),
        updatedAt: new Date(c.updated_at).getTime(),
        isPinned: c.is_pinned,
        responseMode: (c.response_mode as ResponseModeId) || "eli15",
      }));
    } catch (err) {
      console.warn("Failed to retrieve user AI conversations:", err);
      return [];
    }
  }

  /**
   * Creates a new conversation for an authenticated user.
   */
  async createConversation(
    userId: string,
    title: string = "New Inquiry",
    responseMode: ResponseModeId = "eli15"
  ): Promise<string | null> {
    if (!publicEnv.isSupabaseConfigured) return null;

    try {
      const client = await createSupabaseServerClient();
      if (!client) return null;

      const { data, error } = await client
        .from("ai_conversations")
        .insert({
          user_id: userId,
          title: this.sanitizeTitle(title),
          response_mode: responseMode,
        })
        .select("id")
        .single();

      if (error || !data) return null;
      return data.id;
    } catch (err) {
      console.warn("Failed to create AI conversation:", err);
      return null;
    }
  }

  /**
   * Saves a message to an existing conversation.
   */
  async appendMessage(
    conversationId: string,
    message: {
      role: "user" | "assistant" | "system";
      content: string;
      structuredPayload?: StructuredResponse;
      isBookmarked?: boolean;
    }
  ): Promise<boolean> {
    if (!publicEnv.isSupabaseConfigured) return true;

    try {
      const client = await createSupabaseServerClient();
      if (!client) return false;

      const { error } = await client.from("ai_messages").insert({
        conversation_id: conversationId,
        role: message.role,
        content: message.content,
        structured_payload: (message.structuredPayload as unknown as Json) ?? null,
        is_bookmarked: message.isBookmarked ?? false,
      });

      if (!error) {
        // Touch conversation updated_at
        await client
          .from("ai_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);
      }

      return !error;
    } catch (err) {
      console.warn("Failed to append AI message:", err);
      return false;
    }
  }

  /** Sanitizes title to prevent storing accidental raw sensitive numbers */
  private sanitizeTitle(title: string): string {
    return title
      .slice(0, 100)
      .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, "[Aadhaar]") // Mask Aadhaar
      .replace(/\b\d{10}\b/g, "[Phone]"); // Mask phone numbers
  }
}

export const aiSessionService = new AISessionService();
