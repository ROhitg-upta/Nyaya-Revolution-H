"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StructuredResponse } from "@/types";
import { responseSections } from "@/constants/ai";
import { ChevronDown, BookOpen, Scale, ExternalLink } from "@/lib/icons";
import Link from "next/link";

interface StructuredResponseViewProps {
  data: StructuredResponse;
}

export function StructuredResponseView({ data }: StructuredResponseViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3 space-y-2"
    >
      {/* Situation Summary */}
      <ResponseSection sectionKey="situationSummary" defaultOpen>
        <p className="text-foreground/90 text-sm leading-relaxed">
          {data.situationSummary}
        </p>
      </ResponseSection>

      {/* Rights */}
      {data.rights.length > 0 && (
        <ResponseSection sectionKey="rights" defaultOpen>
          <ul className="space-y-1.5">
            {data.rights.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-success mt-0.5 text-xs">✓</span>
                <span className="text-foreground/90">{r}</span>
              </li>
            ))}
          </ul>
        </ResponseSection>
      )}

      {/* Laws */}
      {data.laws.length > 0 && (
        <ResponseSection sectionKey="laws">
          <div className="space-y-2.5">
            {data.laws.map((law, i) => (
              <div
                key={i}
                className="glass border-border/30 rounded-lg border p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-foreground text-sm font-medium">
                    {law.name}
                  </p>
                  <span className="bg-brand/10 text-brand shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                    {law.section}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {law.description}
                </p>
              </div>
            ))}
          </div>
        </ResponseSection>
      )}

      {/* Immediate Actions */}
      {data.immediateActions.length > 0 && (
        <ResponseSection sectionKey="immediateActions" defaultOpen>
          <ol className="space-y-2">
            {data.immediateActions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="bg-warning/10 text-warning flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{action}</span>
              </li>
            ))}
          </ol>
        </ResponseSection>
      )}

      {/* Documents Required */}
      {data.documentsRequired.length > 0 && (
        <ResponseSection sectionKey="documentsRequired">
          <ul className="space-y-1.5">
            {data.documentsRequired.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5 text-xs">📄</span>
                <span className="text-foreground/90">{doc}</span>
              </li>
            ))}
          </ul>
        </ResponseSection>
      )}

      {/* Authorities */}
      {data.authorities.length > 0 && (
        <ResponseSection sectionKey="authorities">
          <div className="space-y-2">
            {data.authorities.map((auth, i) => (
              <div
                key={i}
                className="glass border-border/30 rounded-lg border p-3"
              >
                <p className="text-foreground text-sm font-medium">
                  {auth.name}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {auth.description}
                </p>
                {auth.contact && (
                  <p className="text-brand mt-1 text-xs font-medium">
                    {auth.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ResponseSection>
      )}

      {/* Common Mistakes */}
      {data.commonMistakes.length > 0 && (
        <ResponseSection sectionKey="commonMistakes">
          <ul className="space-y-1.5">
            {data.commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-destructive mt-0.5 text-xs">✕</span>
                <span className="text-foreground/90">{m}</span>
              </li>
            ))}
          </ul>
        </ResponseSection>
      )}

      {/* Learning Journey */}
      {data.learningJourney && (
        <ResponseSection sectionKey="learningJourney">
          <Link
            href={`/learn/${data.learningJourney.slug}`}
            className="glass border-brand/20 group hover:border-brand/40 flex items-center gap-3 rounded-lg border p-3 transition-colors"
          >
            <div className="bg-brand/10 flex size-10 items-center justify-center rounded-lg">
              <BookOpen className="text-brand size-5" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                {data.learningJourney.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {data.learningJourney.lessons} lessons
              </p>
            </div>
            <ExternalLink className="text-muted-foreground group-hover:text-brand size-4 transition-colors" />
          </Link>
        </ResponseSection>
      )}

      {/* Quiz */}
      {data.quiz && (
        <ResponseSection sectionKey="quiz">
          <div className="glass border-success/20 flex items-center gap-3 rounded-lg border p-3">
            <div className="bg-success/10 flex size-10 items-center justify-center rounded-lg">
              <Scale className="text-success size-5" />
            </div>
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">
                {data.quiz.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {data.quiz.questions} questions
              </p>
            </div>
          </div>
        </ResponseSection>
      )}

      {/* Professional Help */}
      {data.professionalHelp && (
        <ResponseSection sectionKey="professionalHelp">
          <p className="text-foreground/90 text-sm leading-relaxed">
            {data.professionalHelp}
          </p>
        </ResponseSection>
      )}
    </motion.div>
  );
}

interface ResponseSectionProps {
  sectionKey: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function ResponseSection({
  sectionKey,
  defaultOpen = false,
  children,
}: ResponseSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const meta = responseSections.find((s) => s.key === sectionKey);

  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <div className="glass-strong border-border/30 overflow-hidden rounded-xl border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-muted/30 flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors"
      >
        <Icon className={cn("size-4 shrink-0", meta.color)} />
        <span className="text-foreground flex-1 text-sm font-medium">
          {meta.title}
        </span>
        <ChevronDown
          className={cn(
            "text-muted-foreground size-4 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="border-border/20 border-t px-4 py-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
