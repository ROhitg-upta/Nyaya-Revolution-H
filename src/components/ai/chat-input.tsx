"use client";

import { motion } from "motion/react";
import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Send, Square, Sparkles } from "@/lib/icons";
import { ResponseModeSelector } from "./response-mode-selector";
import type { ResponseModeId } from "@/types";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  responseMode: ResponseModeId;
  onResponseModeChange: (mode: ResponseModeId) => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  responseMode,
  onResponseModeChange,
  placeholder = "Ask about your legal rights…",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (isStreaming) {
      onStop?.();
      return;
    }
    if (!value.trim()) return;
    onSend(value);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, onSend, onStop]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="border-border/50 bg-background/80 border-t backdrop-blur-xl"
    >
      <div className="mx-auto max-w-3xl px-4 py-3">
        {/* Mode selector */}
        <div className="mb-2 flex items-center gap-2">
          <ResponseModeSelector
            value={responseMode}
            onChange={onResponseModeChange}
          />
          <div className="text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3" />
            <span className="text-[10px]">AI-powered legal education</span>
          </div>
        </div>

        {/* Input area */}
        <div className="glass border-border/50 focus-within:border-brand/40 flex items-end gap-2 rounded-2xl border p-2 transition-all focus-within:shadow-[0_0_0_1px_oklch(0.55_0.16_256/0.15)]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={placeholder}
            rows={1}
            disabled={isStreaming}
            className="text-foreground placeholder:text-muted-foreground/60 max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!isStreaming && !value.trim()}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all",
              isStreaming
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : value.trim()
                  ? "bg-gradient-brand text-primary-foreground glow-hover shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
            aria-label={isStreaming ? "Stop generating" : "Send message"}
          >
            {isStreaming ? (
              <Square className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>

        <p className="text-muted-foreground/50 mt-2 text-center text-[10px]">
          Educational guidance only — not legal advice. Always consult a
          qualified professional.
        </p>
      </div>
    </motion.div>
  );
}
