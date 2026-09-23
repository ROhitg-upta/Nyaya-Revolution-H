"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { ResponseModeId } from "@/types";
import { useConversationStore } from "@/hooks/use-conversation-store";
import { useChat } from "@/hooks/use-chat";
import { ChatBubble } from "./chat-bubble";
import { ChatInput } from "./chat-input";
import { ChatWelcome } from "./chat-welcome";
import { ChatSidebar } from "./chat-sidebar";
import { StructuredResponseView } from "./structured-response";
import { FollowUpCards } from "./follow-up-cards";
import { Menu, ArrowDown } from "@/lib/icons";

interface ChatInterfaceProps {
  conversationId?: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [responseMode, setResponseMode] = useState<ResponseModeId>("eli15");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const store = useConversationStore();

  const conversation = conversationId
    ? store.getConversation(conversationId)
    : null;

  const messages = conversation?.messages ?? [];

  const onAddMessage = useCallback(
    (msg: Parameters<typeof store.addMessage>[1]) => {
      if (!conversationId) {
        const c = store.createConversation(
          msg.role === "user" ? msg.content : undefined,
          responseMode,
        );
        const added = store.addMessage(c.id, msg);
        router.push(`/ai/chat/${c.id}`);
        return added;
      }
      return store.addMessage(conversationId, msg);
    },
    [conversationId, store, responseMode, router],
  );

  const onUpdateAssistant = useCallback(
    (update: Parameters<typeof store.updateLastAssistantMessage>[1]) => {
      if (conversationId) {
        store.updateLastAssistantMessage(conversationId, update);
      }
    },
    [conversationId, store],
  );

  const {
    isStreaming,
    streamedContent,
    structured,
    followUps,
    sendMessage,
    stopStreaming,
  } = useChat({
    conversationId: conversationId ?? "",
    responseMode,
    messages,
    onAddMessage,
    onUpdateAssistant,
  });

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (isStreaming) scrollToBottom();
  }, [streamedContent, isStreaming, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 100);
  };

  const handleNewChat = () => {
    router.push("/ai");
    setSidebarOpen(false);
  };

  const handleSelectQuestion = (question: string) => {
    sendMessage(question);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        conversations={store.recentConversations}
        pinnedConversations={store.pinnedConversations}
        activeId={conversationId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onDelete={store.deleteConversation}
        onTogglePin={store.togglePin}
      />

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="border-border/50 bg-background/60 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-muted-foreground hover:text-foreground hidden transition-colors lg:block"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-sm font-medium">
              {conversation?.title ?? "New conversation"}
            </p>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          {!hasMessages ? (
            <ChatWelcome onSelectQuestion={handleSelectQuestion} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {messages.map((msg, i) => {
                const isLast =
                  i === messages.length - 1 && msg.role === "assistant";
                const showStreaming = isLast && isStreaming;

                return (
                  <div key={msg.id}>
                    <ChatBubble
                      message={msg}
                      isStreaming={showStreaming}
                      streamedContent={
                        showStreaming ? streamedContent : undefined
                      }
                      onToggleBookmark={
                        msg.role === "assistant" && conversationId
                          ? () => store.toggleBookmark(conversationId, msg.id)
                          : undefined
                      }
                    />
                    {/* Structured response after assistant message finishes */}
                    {msg.role === "assistant" &&
                      !showStreaming &&
                      msg.structured && (
                        <div className="mt-2 ml-0 sm:ml-11">
                          <StructuredResponseView data={msg.structured} />
                        </div>
                      )}
                    {/* Live structured response while/after streaming */}
                    {showStreaming && structured && (
                      <div className="mt-2 ml-0 sm:ml-11">
                        <StructuredResponseView data={structured} />
                      </div>
                    )}
                    {/* Follow-ups */}
                    {msg.role === "assistant" &&
                      !showStreaming &&
                      msg.followUps &&
                      msg.followUps.length > 0 && (
                        <div className="ml-0 sm:ml-11">
                          <FollowUpCards
                            suggestions={msg.followUps}
                            onSelect={(s) =>
                              s.href
                                ? router.push(s.href)
                                : sendMessage(s.label)
                            }
                          />
                        </div>
                      )}
                    {/* Live follow-ups */}
                    {isLast &&
                      !isStreaming &&
                      followUps.length > 0 &&
                      !msg.followUps?.length && (
                        <div className="ml-0 sm:ml-11">
                          <FollowUpCards
                            suggestions={followUps}
                            onSelect={(s) =>
                              s.href
                                ? router.push(s.href)
                                : sendMessage(s.label)
                            }
                          />
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="bg-background/80 border-border/50 hover:bg-muted absolute right-6 bottom-32 z-10 flex size-9 items-center justify-center rounded-full border shadow-md backdrop-blur-lg transition-colors"
          >
            <ArrowDown className="text-foreground size-4" />
          </motion.button>
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          responseMode={responseMode}
          onResponseModeChange={setResponseMode}
        />
      </div>
    </div>
  );
}
