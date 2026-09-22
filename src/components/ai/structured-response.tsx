"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StructuredResponse } from "@/types";
import { responseSections } from "@/constants/ai";
import {
  ChevronDown,
  BookOpen,
  Scale,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "@/lib/icons";
import Link from "next/link";

interface StructuredResponseViewProps {
  data: StructuredResponse;
}

export function StructuredResponseView({ data }: StructuredResponseViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3 space-y-2.5"
    >
      {/* Grounding in Verified Law Banner */}
      {data.isGroundingVerified && (
        <div className="glass border-emerald-500/30 bg-emerald-500/5 flex flex-col gap-1.5 rounded-xl p-3 text-xs mb-2">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <ShieldCheck className="size-4 shrink-0" />
            <span>Grounded in Verified Indian Law</span>
          </div>
          <div className="border-emerald-500/15 flex flex-wrap items-center gap-2 border-t pt-1.5">
            {data.groundedArticles?.map((art) => (
              <Link
                key={art.slug}
                href={`/laws/${art.slug}`}
                className="text-primary hover:underline font-medium"
              >
                {art.articleOrSection}: {art.title} &rarr;
              </Link>
            ))}
            {data.groundedLaws?.map((law) => (
              <span key={law.slug} className="text-muted-foreground">
                • {law.title}
              </span>
            ))}
            {data.groundedCases?.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="text-brand hover:underline font-medium"
              >
                • Precedent: {cs.title} &rarr;
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Situation Summary */}
      <ResponseSection sectionKey="situationSummary" defaultOpen>
        <p className="text-foreground/90 text-sm leading-relaxed">
          {data.situationSummary}
        </p>
      </ResponseSection>

      {/* Relevant Concept */}
      {data.relevantConcept && (
        <div className="glass border-primary/20 rounded-xl p-3.5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Relevant Legal Concept
          </span>
          <span className="text-sm font-semibold text-foreground">
            {data.relevantConcept}
          </span>
        </div>
      )}

      {/* What You Should Understand */}
      {data.whatYouShouldUnderstand && data.whatYouShouldUnderstand.length > 0 && (
        <div className="glass border-border/40 rounded-xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            What You Should Understand
          </span>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {data.whatYouShouldUnderstand.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand font-bold mt-0.5">•</span>
                <span className="text-foreground/90 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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

      {/* Possible General Next Steps */}
      {data.possibleGeneralNextSteps && data.possibleGeneralNextSteps.length > 0 && (
        <div className="glass border-border/40 rounded-xl p-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Possible General Next Steps
          </span>
          <ol className="space-y-1.5 text-sm text-muted-foreground">
            {data.possibleGeneralNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-brand font-bold">{idx + 1}.</span>
                <span className="text-foreground/90 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
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

      {/* Interactive Practice Question */}
      {data.practiceQuestion && (
        <div className="glass-strong border-brand/30 flex flex-col gap-3 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-brand flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Practice Concept Check
            </span>
            <span className="text-muted-foreground text-[11px] font-bold">
              +{data.practiceQuestion.xp || 25} XP
            </span>
          </div>
          <p className="text-foreground text-sm font-semibold">
            {data.practiceQuestion.question}
          </p>
          <div className="flex flex-col gap-2">
            {data.practiceQuestion.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === data.practiceQuestion?.correctIndex;
              let btnStyle = "glass hover:bg-muted/40 text-foreground border-border/50";
              if (selectedAnswer !== null) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-medium";
                } else if (isSelected) {
                  btnStyle = "bg-red-500/20 border-red-500/40 text-red-300";
                }
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => setSelectedAnswer(i)}
                  className={`rounded-lg px-3 py-2 text-left text-xs transition-all border ${btnStyle}`}
                >
                  <span className="mr-1.5 font-bold">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {selectedAnswer !== null && (
            <div className="border-border/30 text-muted-foreground border-t pt-2 text-xs leading-relaxed">
              <strong className="text-foreground">Explanation: </strong>
              {data.practiceQuestion.explanation}
            </div>
          )}
        </div>
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

      {/* Separation notice */}
      <div className="pt-2 text-center text-[10px] text-muted-foreground/60">
        Educational Information · Not Professional Legal Advice · No Legal Outcomes Promised
      </div>
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
