"use client";

import { motion } from "motion/react";
import { Ban, CheckCircle2 } from "@/lib/icons";
import type { DosAndDontsPayload } from "@/types";

interface DosAndDontsProps {
  data: DosAndDontsPayload;
}

export function DosAndDontsBlock({ data }: DosAndDontsProps) {
  if (!data || (!data.dos?.length && !data.donts?.length)) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* What To Do */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="glass border-success/30 bg-success/5 flex flex-col gap-3 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2">
          <span className="bg-success/20 text-success flex size-7 items-center justify-center rounded-lg">
            <CheckCircle2 className="size-4.5" />
          </span>
          <h3 className="text-foreground text-base font-bold">What To Do</h3>
        </div>
        <ul className="flex flex-col gap-2.5 pt-1">
          {data.dos.map((item, idx) => (
            <li key={`do-${idx}`} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
              <span className="bg-success text-success-foreground mt-1 flex size-1.5 shrink-0 rounded-full" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* What NOT To Do */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="glass border-destructive/30 bg-destructive/5 flex flex-col gap-3 rounded-2xl p-5"
      >
        <div className="flex items-center gap-2">
          <span className="bg-destructive/20 text-destructive flex size-7 items-center justify-center rounded-lg">
            <Ban className="size-4.5" />
          </span>
          <h3 className="text-foreground text-base font-bold">What NOT To Do</h3>
        </div>
        <ul className="flex flex-col gap-2.5 pt-1">
          {data.donts.map((item, idx) => (
            <li key={`dont-${idx}`} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
              <span className="bg-destructive text-destructive-foreground mt-1 flex size-1.5 shrink-0 rounded-full" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
