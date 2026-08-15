"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { ChatMessage, Conversation, ResponseModeId } from "@/types";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const STORAGE_KEY = "nyaya-conversations";
const BOOKMARKS_KEY = "nyaya-bookmarks";

type Listener = () => void;

let conversations: Conversation[] = [];
let listeners: Set<Listener> = new Set();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {}
}

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) conversations = JSON.parse(raw);
  } catch {}
}

if (typeof window !== "undefined") {
  hydrate();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return conversations;
}

const EMPTY: Conversation[] = [];
function getServerSnapshot() {
  return EMPTY;
}

export function useConversationStore() {
  const convos = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const createConversation = useCallback(
    (firstMessage?: string, mode: ResponseModeId = "eli15"): Conversation => {
      const now = Date.now();
      const c: Conversation = {
        id: generateId(),
        title: firstMessage
          ? firstMessage.split(" ").slice(0, 6).join(" ") +
            (firstMessage.split(" ").length > 6 ? "…" : "")
          : "New conversation",
        messages: [],
        createdAt: now,
        updatedAt: now,
        isPinned: false,
        responseMode: mode,
      };
      conversations = [c, ...conversations];
      persist();
      emit();
      return c;
    },
    [],
  );

  const addMessage = useCallback(
    (
      conversationId: string,
      message: Omit<ChatMessage, "id" | "timestamp">,
    ) => {
      const msg: ChatMessage = {
        ...message,
        id: generateId(),
        timestamp: Date.now(),
      };
      conversations = conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              updatedAt: Date.now(),
            }
          : c,
      );
      persist();
      emit();
      return msg;
    },
    [],
  );

  const updateLastAssistantMessage = useCallback(
    (conversationId: string, update: Partial<ChatMessage>) => {
      conversations = conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const msgs = [...c.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === "assistant") {
            msgs[i] = { ...msgs[i], ...update };
            break;
          }
        }
        return { ...c, messages: msgs, updatedAt: Date.now() };
      });
      persist();
      emit();
    },
    [],
  );

  const updateTitle = useCallback((id: string, title: string) => {
    conversations = conversations.map((c) =>
      c.id === id ? { ...c, title } : c,
    );
    persist();
    emit();
  }, []);

  const togglePin = useCallback((id: string) => {
    conversations = conversations.map((c) =>
      c.id === id ? { ...c, isPinned: !c.isPinned } : c,
    );
    persist();
    emit();
  }, []);

  const deleteConversation = useCallback((id: string) => {
    conversations = conversations.filter((c) => c.id !== id);
    persist();
    emit();
  }, []);

  const toggleBookmark = useCallback(
    (conversationId: string, messageId: string) => {
      conversations = conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId ? { ...m, isBookmarked: !m.isBookmarked } : m,
          ),
        };
      });
      persist();
      emit();
    },
    [],
  );

  const getConversation = useCallback(
    (id: string) => convos.find((c) => c.id === id) ?? null,
    [convos],
  );

  const getBookmarkedMessages = useCallback(() => {
    const results: { conversation: Conversation; message: ChatMessage }[] = [];
    convos.forEach((c) => {
      c.messages.forEach((m) => {
        if (m.isBookmarked) results.push({ conversation: c, message: m });
      });
    });
    return results;
  }, [convos]);

  const pinnedConversations = convos.filter((c) => c.isPinned);
  const recentConversations = [...convos]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 20);

  return {
    conversations: convos,
    pinnedConversations,
    recentConversations,
    createConversation,
    addMessage,
    updateLastAssistantMessage,
    updateTitle,
    togglePin,
    deleteConversation,
    toggleBookmark,
    getConversation,
    getBookmarkedMessages,
  };
}
