"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bookmark,
  Bot,
  Clock,
  MessageCircle,
  Pin,
  Plus,
  Sparkles,
} from "@/lib/icons";
import {
  suggestedQuestions,
  quickTopics,
  welcomeMessage,
} from "@/constants/ai";
import { useConversationStore } from "@/hooks/use-conversation-store";
import { Reveal } from "@/components/common/reveal";
import { Container } from "@/components/layout";

export function AIHome() {
  const router = useRouter();
  const store = useConversationStore();

  const handleNewChat = () => {
    const c = store.createConversation();
    router.push(`/ai/chat/${c.id}`);
  };

  const handleQuestionSelect = (question: string) => {
    const c = store.createConversation(question);
    store.addMessage(c.id, { role: "user", content: question });
    router.push(`/ai/chat/${c.id}`);
  };

  return (
    <Container size="default" gutter="page">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="bg-gradient-brand glow-brand mx-auto flex size-20 items-center justify-center rounded-3xl shadow-lg">
          <Bot className="text-primary-foreground size-10" />
        </div>
        <h1 className="text-foreground mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          {welcomeMessage.greeting}
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-base leading-relaxed">
          {welcomeMessage.subtitle}
        </p>

        {/* New chat CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={handleNewChat}
          className="bg-gradient-brand text-primary-foreground glow-hover mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-md transition-all"
        >
          <Plus className="size-4" />
          Start new conversation
        </motion.button>
      </motion.div>

      {/* Quick topics */}
      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {quickTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.label}
                onClick={() => handleQuestionSelect(topic.label)}
                className="glass border-border/40 hover:border-brand/30 flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all hover:shadow-sm"
              >
                <Icon className="text-brand size-4" />
                <span className="text-foreground">{topic.label}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Suggested questions */}
      <Reveal delay={0.15}>
        <section className="mt-12">
          <h2 className="text-foreground mb-4 text-lg font-semibold">
            <Sparkles className="text-brand mr-2 inline-block size-5" />
            Recommended situations
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedQuestions.map((sq, i) => {
              const Icon = sq.icon;
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handleQuestionSelect(sq.question)}
                  className="glass border-border/40 group hover:border-brand/30 flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:shadow-md"
                >
                  <div className="bg-brand/10 flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="text-brand size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
                      {sq.question}
                    </p>
                    <p className="text-brand/70 mt-1.5 text-xs font-medium">
                      {sq.category}
                    </p>
                  </div>
                  <ArrowRight className="text-muted-foreground mt-1 size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </motion.button>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* Recent conversations */}
      {store.recentConversations.length > 0 && (
        <Reveal delay={0.2}>
          <section className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-foreground text-lg font-semibold">
                <Clock className="text-muted-foreground mr-2 inline-block size-5" />
                Recent conversations
              </h2>
              <Link
                href="/ai/chat"
                className="text-brand flex items-center gap-1 text-xs font-medium hover:underline"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {store.recentConversations.slice(0, 5).map((c) => (
                <Link
                  key={c.id}
                  href={`/ai/chat/${c.id}`}
                  className="glass border-border/40 group hover:border-brand/30 flex items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:shadow-sm"
                >
                  <MessageCircle className="text-muted-foreground size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {c.title}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {c.messages.length} messages ·{" "}
                      {new Date(c.updatedAt ?? 0).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  {c.isPinned && (
                    <Pin className="text-brand size-3.5 shrink-0" />
                  )}
                  <ArrowRight className="text-muted-foreground size-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Pinned conversations */}
      {store.pinnedConversations.length > 0 && (
        <Reveal delay={0.25}>
          <section className="mt-10">
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              <Pin className="text-brand mr-2 inline-block size-5" />
              Pinned chats
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {store.pinnedConversations.map((c) => (
                <Link
                  key={c.id}
                  href={`/ai/chat/${c.id}`}
                  className="glass border-brand/20 group hover:border-brand/30 flex items-center gap-3 rounded-xl border p-4 transition-all hover:shadow-md"
                >
                  <div className="bg-brand/10 flex size-9 items-center justify-center rounded-lg">
                    <MessageCircle className="text-brand size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {c.title}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {c.messages.length} messages
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Bookmarks link */}
      <Reveal delay={0.3}>
        <section className="mt-10">
          <Link
            href="/ai/bookmarks"
            className="glass border-border/40 group hover:border-brand/30 flex items-center gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
          >
            <div className="bg-warning/10 flex size-10 items-center justify-center rounded-xl">
              <Bookmark className="text-warning size-5" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                Bookmarked responses
              </p>
              <p className="text-muted-foreground text-xs">
                Access your saved legal guidance anytime
              </p>
            </div>
            <ArrowRight className="text-muted-foreground size-4 transition-all group-hover:translate-x-0.5" />
          </Link>
        </section>
      </Reveal>

      {/* Disclaimer */}
      <p className="text-muted-foreground/50 mt-12 text-center text-xs">
        {welcomeMessage.disclaimer}
      </p>
    </Container>
  );
}
