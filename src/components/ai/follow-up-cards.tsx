"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { FollowUpSuggestion } from "@/types";
import {
  Compass,
  BookOpen,
  GraduationCap,
  MessagesSquare,
  ArrowRight,
} from "@/lib/icons";
import type { LucideIcon } from "@/lib/icons";

const typeIcons: Record<string, LucideIcon> = {
  situation: Compass,
  course: BookOpen,
  quiz: GraduationCap,
  story: MessagesSquare,
};

const typeColors: Record<string, string> = {
  situation: "text-brand bg-brand/10",
  course: "text-success bg-success/10",
  quiz: "text-warning bg-warning/10",
  story: "text-muted-foreground bg-muted/50",
};

interface FollowUpCardsProps {
  suggestions: FollowUpSuggestion[];
  onSelect?: (suggestion: FollowUpSuggestion) => void;
}

export function FollowUpCards({ suggestions, onSelect }: FollowUpCardsProps) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1 }}
      className="mt-4"
    >
      <p className="text-muted-foreground mb-2.5 text-xs font-medium tracking-wider uppercase">
        Continue exploring
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => {
          const Icon = typeIcons[s.type] ?? Compass;
          const colors = typeColors[s.type] ?? typeColors.story;

          const content = (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="glass border-border/40 group hover:border-brand/30 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all hover:shadow-sm"
              onClick={() => onSelect?.(s)}
            >
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colors.split(" ").slice(1).join(" ")}`}
              >
                <Icon className={`size-4 ${colors.split(" ")[0]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {s.label}
                </p>
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                  {s.description}
                </p>
              </div>
              <ArrowRight className="text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </motion.div>
          );

          if (s.href) {
            return (
              <Link key={i} href={s.href} className="block">
                {content}
              </Link>
            );
          }

          return <div key={i}>{content}</div>;
        })}
      </div>
    </motion.div>
  );
}
