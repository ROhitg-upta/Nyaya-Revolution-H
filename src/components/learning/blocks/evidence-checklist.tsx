"use client";

import { motion } from "motion/react";
import { FileText, MapPin } from "@/lib/icons";
import type { EvidenceItem } from "@/types";

interface EvidenceChecklistProps {
  items: EvidenceItem[];
}

export function EvidenceChecklistBlock({ items }: EvidenceChecklistProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className="glass border-border/70 flex flex-col justify-between rounded-xl p-4"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <span className="bg-brand/12 text-brand flex size-7 shrink-0 items-center justify-center rounded-md">
                <FileText className="size-4" />
              </span>
              <h4 className="text-foreground text-sm font-semibold leading-snug">
                {item.document}
              </h4>
            </div>

            <p className="text-muted-foreground pl-9 text-xs leading-relaxed">
              <span className="text-foreground font-medium">Why needed: </span>
              {item.whyNeeded}
            </p>
          </div>

          <div className="border-border/40 text-muted-foreground mt-3 flex items-center gap-1.5 border-t pt-2.5 pl-9 text-xs">
            <MapPin className="text-brand size-3 shrink-0" />
            <span className="truncate">Obtain: {item.whereToObtain}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
