"use client";

import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "@/lib/icons";
import type { MythVsFactItem } from "@/types";

interface MythVsFactProps {
  items: MythVsFactItem[];
}

export function MythVsFactBlock({ items }: MythVsFactProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="glass border-border/60 overflow-hidden rounded-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Myth Column */}
            <div className="border-border/40 bg-destructive/5 flex flex-col gap-2 p-5 md:border-r">
              <div className="flex items-center gap-2">
                <span className="bg-destructive/15 text-destructive flex size-6 items-center justify-center rounded-full">
                  <XCircle className="size-4" />
                </span>
                <span className="text-destructive text-xs font-bold uppercase tracking-wider">
                  Common Myth
                </span>
              </div>
              <p className="text-foreground text-sm font-semibold leading-snug">
                &ldquo;{item.myth}&rdquo;
              </p>
            </div>

            {/* Fact Column */}
            <div className="bg-success/5 flex flex-col gap-2 p-5">
              <div className="flex items-center gap-2">
                <span className="bg-success/15 text-success flex size-6 items-center justify-center rounded-full">
                  <CheckCircle2 className="size-4" />
                </span>
                <span className="text-success text-xs font-bold uppercase tracking-wider">
                  Legal Reality
                </span>
              </div>
              <p className="text-foreground text-sm font-semibold leading-snug">
                {item.fact}
              </p>
            </div>
          </div>

          {/* Explanation Footer */}
          {item.explanation ? (
            <div className="border-border/30 bg-muted/40 border-t px-5 py-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Why this matters: </span>
              {item.explanation}
            </div>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
}
