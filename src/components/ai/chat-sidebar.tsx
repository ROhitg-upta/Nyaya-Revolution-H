"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";
import {
  Bot,
  Bookmark,
  Clock,
  MessageCircle,
  Pin,
  Plus,
  Scale,
  Search,
  Trash2,
  X,
} from "@/lib/icons";
import { siteConfig } from "@/constants";

interface ChatSidebarProps {
  conversations: Conversation[];
  pinnedConversations: Conversation[];
  activeId?: string;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  pinnedConversations,
  activeId,
  isOpen,
  onClose,
  onNewChat,
  onDelete,
  onTogglePin,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase()),
      )
    : conversations;

  const unpinned = filtered.filter((c) => !c.isPinned);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "border-border/50 bg-background/95 fixed top-0 left-0 z-50 flex h-dvh w-72 flex-col border-r backdrop-blur-xl lg:relative lg:z-auto",
          !isOpen && "max-lg:-translate-x-full",
        )}
        animate={{
          x: isOpen
            ? 0
            : typeof window !== "undefined" && window.innerWidth < 1024
              ? -288
              : 0,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="border-border/30 flex items-center justify-between border-b px-4 py-3">
          <Link href="/ai" className="flex items-center gap-2">
            <div className="bg-gradient-brand flex size-7 items-center justify-center rounded-lg">
              <Scale className="text-primary-foreground size-3.5" />
            </div>
            <span className="text-foreground text-sm font-semibold">
              {siteConfig.shortName} AI
            </span>
          </Link>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* New chat button */}
        <div className="px-3 pt-3">
          <button
            onClick={onNewChat}
            className="bg-gradient-brand text-primary-foreground glow-hover flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all"
          >
            <Plus className="size-4" />
            New conversation
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pt-3">
          <div className="glass border-border/40 flex items-center gap-2 rounded-lg border px-3 py-2">
            <Search className="text-muted-foreground size-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations…"
              className="text-foreground placeholder:text-muted-foreground/50 w-full bg-transparent text-xs outline-none"
            />
          </div>
        </div>

        {/* Conversation list */}
        <nav className="flex-1 overflow-y-auto px-3 pt-3 pb-4">
          {/* Pinned */}
          {pinnedConversations.length > 0 && (
            <div className="mb-3">
              <p className="text-muted-foreground mb-1.5 flex items-center gap-1 px-2 text-[10px] font-medium tracking-wider uppercase">
                <Pin className="size-3" />
                Pinned
              </p>
              <ul className="space-y-0.5">
                {pinnedConversations.map((c) => (
                  <ConversationItem
                    key={c.id}
                    conversation={c}
                    isActive={c.id === activeId}
                    onDelete={() => onDelete(c.id)}
                    onTogglePin={() => onTogglePin(c.id)}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Recent */}
          {unpinned.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1.5 flex items-center gap-1 px-2 text-[10px] font-medium tracking-wider uppercase">
                <Clock className="size-3" />
                Recent
              </p>
              <ul className="space-y-0.5">
                {unpinned.map((c) => (
                  <ConversationItem
                    key={c.id}
                    conversation={c}
                    isActive={c.id === activeId}
                    onDelete={() => onDelete(c.id)}
                    onTogglePin={() => onTogglePin(c.id)}
                  />
                ))}
              </ul>
            </div>
          )}

          {conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="text-muted-foreground/30 size-10" />
              <p className="text-muted-foreground mt-3 text-xs">
                No conversations yet
              </p>
              <p className="text-muted-foreground/60 mt-1 text-[11px]">
                Start by asking a legal question
              </p>
            </div>
          )}
        </nav>

        {/* Footer links */}
        <div className="border-border/30 flex items-center justify-between border-t px-4 py-3">
          <Link
            href="/ai/bookmarks"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-[11px] transition-colors"
          >
            <Bookmark className="size-3" />
            Bookmarks
          </Link>
          <Link
            href="/learn"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-[11px] transition-colors"
          >
            <MessageCircle className="size-3" />
            Learn
          </Link>
        </div>
      </motion.aside>
    </>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onDelete,
  onTogglePin,
}: {
  conversation: Conversation;
  isActive: boolean;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  return (
    <li>
      <Link
        href={`/ai/chat/${conversation.id}`}
        className={cn(
          "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-all",
          isActive
            ? "bg-brand/10 text-brand"
            : "text-foreground/80 hover:bg-muted/50",
        )}
      >
        <MessageCircle
          className={cn(
            "size-3.5 shrink-0",
            isActive ? "text-brand" : "text-muted-foreground",
          )}
        />
        <span className="flex-1 truncate text-xs">{conversation.title}</span>
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              onTogglePin();
            }}
            className="text-muted-foreground hover:text-foreground rounded p-0.5"
            aria-label={conversation.isPinned ? "Unpin" : "Pin"}
          >
            <Pin
              className={cn("size-3", conversation.isPinned && "text-brand")}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="text-muted-foreground hover:text-destructive rounded p-0.5"
            aria-label="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </Link>
    </li>
  );
}
