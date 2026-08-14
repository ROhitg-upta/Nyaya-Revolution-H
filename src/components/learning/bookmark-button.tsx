"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { Bookmark, BookmarkCheck } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  initial?: boolean;
  onToggle?: (bookmarked: boolean) => void;
  className?: string;
  size?: "sm" | "md";
}

export function BookmarkButton({
  initial = false,
  onToggle,
  className,
  size = "md",
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initial);

  const toggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    onToggle?.(next);
  };

  const Icon = bookmarked ? BookmarkCheck : Bookmark;
  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={toggle}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "flex items-center justify-center rounded-lg p-1.5 transition-colors",
        bookmarked
          ? "text-brand bg-brand/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
        className,
      )}
    >
      <Icon className={iconSize} />
    </motion.button>
  );
}
