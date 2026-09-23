"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { Bot, Bookmark, BookmarkCheck, User } from "@/lib/icons";

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  streamedContent?: string;
  onToggleBookmark?: () => void;
}

function formatTime(ts: number): string {
  try {
    return new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function ChatBubble({
  message,
  isStreaming,
  streamedContent,
  onToggleBookmark,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const content = isStreaming ? (streamedContent ?? "") : message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn("group flex gap-3", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-brand/20 text-brand"
            : "bg-gradient-brand text-primary-foreground",
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-brand/10 border-brand/20 text-foreground border"
            : "glass border-border/50 text-foreground border",
        )}
      >
        {/* Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <MessageContent content={content} />
          {isStreaming && (
            <span className="bg-brand ml-1 inline-block size-2 animate-pulse rounded-full" />
          )}
        </div>

        {/* Footer */}
        <div
          className={cn(
            "mt-2 flex items-center gap-2 text-[11px]",
            isUser ? "justify-end" : "justify-between",
          )}
        >
          <span className="text-muted-foreground/60">
            {message.timestamp && formatTime(message.timestamp)}
          </span>

          {!isUser && onToggleBookmark && !isStreaming && (
            <button
              onClick={onToggleBookmark}
              className="text-muted-foreground hover:text-brand opacity-0 transition-all group-hover:opacity-100"
              aria-label={message.isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {message.isBookmarked ? (
                <BookmarkCheck className="text-brand size-3.5" />
              ) : (
                <Bookmark className="size-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MessageContent({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = "";

  lines.forEach((line, i) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            data-language={codeLang || undefined}
            className="bg-muted/50 border-border/50 my-2 overflow-x-auto rounded-lg border p-3"
          >
            <code className="text-xs">{codeLines.join("\n")}</code>
          </pre>,
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h3
          key={i}
          className="text-foreground mt-4 mb-2 text-sm font-semibold first:mt-0"
        >
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="text-foreground mt-2 text-sm font-medium">
          {line.slice(2, -2)}
        </p>,
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="text-foreground/90 ml-4 list-disc text-sm">
          <InlineFormat text={line.slice(2)} />
        </li>,
      );
    } else if (/^\d+\.\s/.test(line)) {
      const text = line.replace(/^\d+\.\s/, "");
      elements.push(
        <li key={i} className="text-foreground/90 ml-4 list-decimal text-sm">
          <InlineFormat text={text} />
        </li>,
      );
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="border-border/30 my-3" />);
    } else if (line.startsWith("*") && line.endsWith("*")) {
      elements.push(
        <p key={i} className="text-muted-foreground mt-1 text-xs italic">
          {line.slice(1, -1)}
        </p>,
      );
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="text-foreground/90 mt-1 text-sm leading-relaxed">
          <InlineFormat text={line} />
        </p>,
      );
    }
  });

  return <>{elements}</>;
}

function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-foreground font-medium">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
