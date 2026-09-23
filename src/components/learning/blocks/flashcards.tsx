"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { RotateCcw } from "@/lib/icons";
import type { FlashcardItem } from "@/types";

interface FlashcardsProps {
  cards: FlashcardItem[];
}

export function FlashcardsBlock({ cards }: FlashcardsProps) {
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({});

  if (!cards || cards.length === 0) return null;

  const toggleFlip = (index: number) => {
    setFlippedMap((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card, idx) => {
        const isFlipped = !!flippedMap[idx];
        return (
          <motion.div
            key={`${card.front}-${idx}`}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => toggleFlip(idx)}
            className="glass hover:border-brand/40 group relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl p-5 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wider">
                {isFlipped ? "Answer / Definition" : "Term / Question"}
              </span>
              <span className="text-brand flex items-center gap-1 group-hover:underline">
                <RotateCcw className="size-3" />
                Flip
              </span>
            </div>

            <div className="my-auto py-2">
              {isFlipped ? (
                <p className="text-foreground text-sm font-medium leading-relaxed">
                  {card.back}
                </p>
              ) : (
                <h4 className="text-foreground text-base font-bold tracking-tight">
                  {card.front}
                </h4>
              )}
            </div>

            {card.context ? (
              <p className="text-muted-foreground border-border/40 border-t pt-2 text-[11px]">
                {card.context}
              </p>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
