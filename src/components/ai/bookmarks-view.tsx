"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Bookmark, BookmarkCheck, MessageCircle } from "@/lib/icons";
import { useConversationStore } from "@/hooks/use-conversation-store";
import { Reveal } from "@/components/common/reveal";
import { Container } from "@/components/layout";

export function BookmarksView() {
  const store = useConversationStore();
  const bookmarks = store.getBookmarkedMessages();

  return (
    <Container size="narrow" gutter="page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/ai"
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to AI Home
        </Link>

        <div className="flex items-center gap-3">
          <div className="bg-warning/10 flex size-12 items-center justify-center rounded-xl">
            <BookmarkCheck className="text-warning size-6" />
          </div>
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Bookmarked responses
            </h1>
            <p className="text-muted-foreground text-sm">
              {bookmarks.length} saved response
              {bookmarks.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Bookmarks list */}
      <div className="mt-8 space-y-3">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="text-muted-foreground/30 size-12" />
            <p className="text-muted-foreground mt-4 text-sm">
              No bookmarks yet
            </p>
            <p className="text-muted-foreground/60 mt-1 text-xs">
              Bookmark AI responses to save them here for quick reference
            </p>
            <Link
              href="/ai"
              className="bg-gradient-brand text-primary-foreground mt-4 rounded-full px-5 py-2 text-sm font-medium"
            >
              Start a conversation
            </Link>
          </div>
        ) : (
          bookmarks.map(({ conversation, message }, i) => (
            <Reveal key={message.id} delay={i * 0.04}>
              <Link
                href={`/ai/chat/${conversation.id}`}
                className="glass border-border/40 group hover:border-brand/30 block rounded-xl border p-4 transition-all hover:shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <MessageCircle className="text-muted-foreground size-3.5" />
                  <span className="text-muted-foreground truncate text-xs">
                    {conversation.title}
                  </span>
                  <span className="text-muted-foreground/50 text-[10px]">
                    {new Date(message.timestamp ?? 0).toLocaleDateString(
                      "en-IN",
                    )}
                  </span>
                </div>
                <p className="text-foreground/90 line-clamp-3 text-sm leading-relaxed">
                  {message.content.slice(0, 200)}
                  {message.content.length > 200 ? "…" : ""}
                </p>
              </Link>
            </Reveal>
          ))
        )}
      </div>
    </Container>
  );
}
