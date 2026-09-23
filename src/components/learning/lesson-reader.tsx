"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { BookmarkButton } from "@/components/learning/bookmark-button";
import { LessonSidebar } from "@/components/learning/lesson-sidebar";
import { MiniChallenge } from "@/components/learning/mini-challenge";
import { XpToast } from "@/components/learning/xp-toast";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  adjacentLessons,
  getJourney,
  getLesson,
  getQuiz,
  learnRoutes,
  lessonCount,
} from "@/constants";
import {
  DosAndDontsBlock,
  EvidenceChecklistBlock,
  FlashcardsBlock,
  InteractiveScenarioBlock,
  MythVsFactBlock,
  ProcessWalkthroughBlock,
} from "@/components/learning/blocks";
import { ModeSelector } from "@/components/learning/mode-selector";
import { ContentDiscovery } from "@/components/common/content-discovery";
import { Container } from "@/components/layout";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Lightbulb,
  ListChecks,
  NotebookPen,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { LearningModeId } from "@/types";

interface LessonReaderProps {
  journeySlug: string;
  lessonSlug: string;
}

function Block({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex items-center gap-2.5">
        <span className="bg-brand/12 flex size-8 items-center justify-center rounded-lg">
          <Icon className="text-brand size-4" />
        </span>
        <h2 className="text-foreground text-lg font-bold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

export function LessonReader({ journeySlug, lessonSlug }: LessonReaderProps) {
  const journey = getJourney(journeySlug);
  const result = getLesson(journeySlug, lessonSlug);
  const quizQuestions = getQuiz(journeySlug);

  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [mode, setMode] = useState<LearningModeId>("learn");

  const handleScroll = useCallback(() => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    setProgress(Math.min(100, Math.round(scrolled * 100)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!journey || !result) return null;

  const lesson = result.lesson;
  const { prev, next } = adjacentLessons(journey, lessonSlug);
  const totalLessons = lessonCount(journey);
  const lessonIndex =
    journey.modules
      .flatMap((m) => m.lessons)
      .findIndex((l) => l.slug === lessonSlug) + 1;
  const completedCount = Math.round((journey.progress / 100) * totalLessons);
  const challengeQuestion = quizQuestions[0];

  const markComplete = () => {
    if (completed) return;
    setCompleted(true);
    setShowXp(true);
  };

  return (
    <>
      <XpToast xp={20} show={showXp} onDone={() => setShowXp(false)} />

      {/* Reading progress bar */}
      <div className="bg-muted/50 fixed top-16 right-0 left-0 z-40 h-1">
        <motion.div
          className="bg-gradient-brand h-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <Container size="wide" gutter="page" className="flex gap-6">
        {/* Sidebar */}
        <LessonSidebar
          journeySlug={journeySlug}
          modules={journey.modules}
          currentLessonSlug={lessonSlug}
          completedCount={completedCount}
        />

        {/* Main content */}
        <article className="flex min-w-0 flex-1 flex-col gap-10">
          {/* Back link & Mobile TOC drawer */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href={learnRoutes.journey(journeySlug)}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="size-4" />
              {journey.title}
            </Link>

            {/* Mobile/Tablet Table of Contents Drawer (xl:hidden) */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="xl:hidden glass rounded-xl gap-1.5 text-xs font-semibold"
                  />
                }
              >
                <BookOpen className="size-3.5 text-brand" />
                <span>Contents ({completedCount}/{totalLessons})</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-5 overflow-y-auto">
                <SheetHeader className="p-0 text-left mb-4">
                  <SheetTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="text-brand size-4" />
                    <span>Course Contents</span>
                  </SheetTitle>
                </SheetHeader>
                <LessonSidebar
                  journeySlug={journeySlug}
                  modules={journey.modules}
                  currentLessonSlug={lessonSlug}
                  completedCount={completedCount}
                  className="flex w-full p-0 shadow-none border-0 bg-transparent"
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong flex flex-col gap-4 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-brand text-xs font-semibold tracking-wider uppercase">
                  Lesson {lessonIndex} of {totalLessons}
                </span>
                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  {lesson.title}
                </h1>
              </div>
              <BookmarkButton />
            </div>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {lesson.readingMinutes} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="text-brand size-4" />
                +20 XP
              </span>
            </div>
          </motion.div>

          {/* Learning Mode Switcher */}
          <ModeSelector
            currentMode={mode}
            onModeChange={setMode}
            hasScenario={Boolean(lesson.interactiveScenario)}
            hasFlashcards={Boolean(lesson.flashcards && lesson.flashcards.length > 0)}
          />

          {/* Mode 1: QUICK LEARN */}
          {mode === "quick" && (
            <div className="flex flex-col gap-6">
              <div className="glass-strong border-brand/40 flex flex-col gap-3 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                  <Clock className="size-4" />
                  Quick Learn Executive Summary (3 Min)
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  What You Need to Know: {lesson.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {lesson.concepts[0]?.body ||
                    "Understand the core statutory rights, immediate remedies, and protections guaranteed under Indian law."}
                </p>
              </div>

              <Block icon={Target} title="Core Rights in 60 Seconds">
                <div className="flex flex-col gap-2.5">
                  {lesson.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="glass flex items-center gap-3 rounded-xl p-3.5 text-sm"
                    >
                      <span className="bg-brand/15 text-brand flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-foreground font-medium">{obj}</span>
                    </div>
                  ))}
                </div>
              </Block>

              {lesson.dosAndDonts ? (
                <Block icon={ShieldCheck} title="Immediate Dos & Don'ts">
                  <DosAndDontsBlock data={lesson.dosAndDonts} />
                </Block>
              ) : null}

              <div className="glass flex flex-col items-center gap-3 rounded-2xl p-6 text-center">
                <h3 className="text-base font-bold text-foreground">
                  Ready to test your quick comprehension?
                </h3>
                <p className="max-w-md text-xs text-muted-foreground">
                  Take the instant check below or switch to Deep Study for statutory references.
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <Button onClick={() => setMode("test")} className="rounded-xl">
                    Check Knowledge Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMode("deep")}
                    className="glass rounded-xl"
                  >
                    Deep Study &rarr;
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: DEEP STUDY */}
          {mode === "deep" && (
            <div className="flex flex-col gap-6">
              <div className="glass-strong border-primary/30 flex flex-col gap-3 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <Scale className="size-4" />
                  Deep Statutory & Jurisprudential Study
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Statutory Foundations: {lesson.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Examine the exact constitutional articles, statutory acts, procedural safeguards, and Supreme Court interpretations backing these citizen rights.
                </p>
              </div>

              <Block icon={BookMarked} title="Constitutional & Statutory Roots">
                <div className="flex flex-col gap-3">
                  <Link
                    href="/laws/article-21-protection-of-life-and-personal-liberty"
                    className="glass group flex flex-col gap-1.5 rounded-xl p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        Article 21: Protection of Life & Personal Liberty
                      </span>
                      <span className="text-xs text-primary font-medium">Read Full Provision &rarr;</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Guarantees fair procedure, privacy, and protection against arbitrary state action without due process.
                    </p>
                  </Link>
                  <Link
                    href="/laws/article-14-equality-before-law"
                    className="glass group flex flex-col gap-1.5 rounded-xl p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        Article 14: Equality Before Law & Non-Arbitrariness
                      </span>
                      <span className="text-xs text-primary font-medium">Read Full Provision &rarr;</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Prohibits arbitrary administrative, university, or corporate policies without rational nexus.
                    </p>
                  </Link>
                </div>
              </Block>

              <Block icon={Scale} title="Statutory Provisions & Regulations">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="glass rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-foreground">Consumer Protection Act, 2019</span>
                    <span className="text-xs text-muted-foreground">Section 2(47) & Section 35: Redressal against Unfair Contracts and Deficiency in Service.</span>
                  </div>
                  <div className="glass rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-xs font-bold text-foreground">Regulatory Authority Directives</span>
                    <span className="text-xs text-muted-foreground">Statutory directives prohibiting retention of original citizen documents and mandatory dispute timelines.</span>
                  </div>
                </div>
              </Block>

              <Block icon={BookOpen} title="Official Legislative Source">
                <div className="glass flex items-center justify-between rounded-xl p-4 text-xs text-muted-foreground">
                  <span>Verified via Legislative Department, Ministry of Law & Justice</span>
                  <a
                    href="https://www.indiacode.nic.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand font-semibold hover:underline"
                  >
                    India Code Portal &rarr;
                  </a>
                </div>
              </Block>
            </div>
          )}

          {/* Mode 3: SCENARIO CHALLENGE */}
          {mode === "scenario" && (
            <div className="flex flex-col gap-6">
              {lesson.interactiveScenario ? (
                <InteractiveScenarioBlock scenario={lesson.interactiveScenario} />
              ) : (
                <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
                  <Brain className="mx-auto size-8 text-brand opacity-60" />
                  <h3 className="mt-3 text-base font-bold text-foreground">
                    Interactive Decision Simulator
                  </h3>
                  <p className="mt-1 text-xs">
                    Test your tactical choices and risk ratings in our full multi-step scenario simulator.
                  </p>
                  <Link href="/learn/scenarios/pg-deposit-refusal" className="mt-4 inline-block">
                    <Button className="rounded-xl">Launch Branching Scenario</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mode 4: REVISION */}
          {mode === "revision" && (
            <div className="flex flex-col gap-6">
              {lesson.flashcards && lesson.flashcards.length > 0 ? (
                <Block icon={RotateCcw} title="Rapid Concept Flashcards">
                  <FlashcardsBlock cards={lesson.flashcards} />
                </Block>
              ) : null}

              <Block icon={ListChecks} title="Glossary & Legal Terminology Drill">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {lesson.terms.map((t) => (
                    <div key={t.term} className="glass flex flex-col gap-1 rounded-xl p-4">
                      <span className="text-sm font-semibold text-foreground">{t.term}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{t.definition}</span>
                    </div>
                  ))}
                </div>
              </Block>
            </div>
          )}

          {/* Mode 5: TEST */}
          {mode === "test" && (
            <div className="flex flex-col gap-6">
              {challengeQuestion ? (
                <Block icon={Target} title="Comprehension Assessment">
                  <MiniChallenge
                    question={challengeQuestion.question}
                    options={challengeQuestion.options}
                    correctIndex={challengeQuestion.correctIndex}
                    explanation={challengeQuestion.explanation}
                    xp={challengeQuestion.xp}
                  />
                </Block>
              ) : null}

              <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
                <Sparkles className="size-8 text-brand" />
                <h3 className="text-lg font-bold text-foreground">
                  Ready for Full Journey Assessment?
                </h3>
                <p className="max-w-md text-xs text-muted-foreground">
                  Complete the comprehensive journey quiz to earn your verified Certificate of Legal Awareness.
                </p>
                <Link href={learnRoutes.quiz(journeySlug)}>
                  <Button className="rounded-xl mt-2">
                    Start Full Journey Quiz
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Mode 0: LEARN (Default comprehensive view) */}
          {mode === "learn" && (
            <>
              {/* Learning objectives */}
              <Block icon={Target} title="Learning objectives">
                <div className="flex flex-col gap-2">
                  {lesson.objectives.map((obj) => (
                    <div key={obj} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      <span className="text-foreground">{obj}</span>
                    </div>
                  ))}
                </div>
              </Block>

          {/* Key concepts */}
          <Block icon={Lightbulb} title="Key concepts">
            <div className="flex flex-col gap-4">
              {lesson.concepts.map((c) => (
                <div
                  key={c.title}
                  className="glass flex flex-col gap-2 rounded-xl p-4"
                >
                  <h3 className="text-foreground text-sm font-semibold">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          {/* Important terms */}
          <Block icon={BookOpen} title="Important terms">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lesson.terms.map((t) => (
                <div
                  key={t.term}
                  className="glass flex flex-col gap-1.5 rounded-xl p-4"
                >
                  <span className="text-brand text-sm font-bold">{t.term}</span>
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {t.definition}
                  </span>
                </div>
              ))}
            </div>
          </Block>

          {/* Real-life examples */}
          <Block icon={ListChecks} title="Real-life examples">
            <div className="flex flex-col gap-3">
              {lesson.examples.map((ex) => (
                <div
                  key={ex.title}
                  className="border-brand/30 rounded-xl border-l-2 py-3 pr-4 pl-5"
                >
                  <h4 className="text-foreground text-sm font-semibold">
                    {ex.title}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {ex.body}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          {/* Myth vs Fact (when available) */}
          {lesson.mythVsFacts && lesson.mythVsFacts.length > 0 && (
            <Block icon={ShieldAlert} title="Myth vs Legal Reality">
              <MythVsFactBlock items={lesson.mythVsFacts} />
            </Block>
          )}

          {/* What to do & What NOT to do (when available) */}
          {lesson.dosAndDonts && (
            <Block icon={ShieldCheck} title="Dos & Don'ts">
              <DosAndDontsBlock data={lesson.dosAndDonts} />
            </Block>
          )}

          {/* Step-by-step statutory process (when available) */}
          {lesson.processSteps && lesson.processSteps.length > 0 && (
            <Block icon={ListChecks} title="Statutory procedure walkthrough">
              <ProcessWalkthroughBlock steps={lesson.processSteps} />
            </Block>
          )}

          {/* Evidence Checklist (when available) */}
          {lesson.evidenceChecklist && lesson.evidenceChecklist.length > 0 && (
            <Block icon={BookOpen} title="Required evidence checklist">
              <EvidenceChecklistBlock items={lesson.evidenceChecklist} />
            </Block>
          )}

          {/* Interactive Decision Scenario (when available) */}
          {lesson.interactiveScenario && (
            <Block icon={Target} title="Decision Challenge">
              <InteractiveScenarioBlock scenario={lesson.interactiveScenario} />
            </Block>
          )}

          {/* Flashcards (when available) */}
          {lesson.flashcards && lesson.flashcards.length > 0 && (
            <Block icon={Sparkles} title="Quick revision flashcards">
              <FlashcardsBlock cards={lesson.flashcards} />
            </Block>
          )}

          {/* Mini challenge (from quiz questions) */}
          {challengeQuestion && (
            <Block icon={Sparkles} title="Quick check">
              <MiniChallenge
                question={challengeQuestion.question}
                options={challengeQuestion.options}
                correctIndex={challengeQuestion.correctIndex}
                explanation={challengeQuestion.explanation}
                xp={challengeQuestion.xp}
              />
            </Block>
          )}

          {/* Notes */}
          <Block icon={NotebookPen} title="Your notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              rows={4}
              className="glass text-foreground placeholder:text-muted-foreground/50 focus:ring-brand/40 w-full resize-none rounded-xl p-4 text-sm leading-relaxed focus:ring-2 focus:outline-none"
            />
          </Block>

          {/* Mark complete */}
          <AnimatePresence>
            {!completed ? (
              <motion.div exit={{ opacity: 0, scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={markComplete}
                  className="w-full rounded-xl sm:w-auto"
                >
                  <CheckCircle className="mr-1.5 size-4" />
                  Mark as complete
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-emerald-400"
              >
                <CheckCircle className="size-5" />
                <span className="text-sm font-semibold">
                  Lesson completed · +20 XP
                </span>
              </motion.div>
            )}
          </AnimatePresence>
            </>
          )}

          {/* Connected Legal Pathways */}
          <ContentDiscovery
            title="Connected Legal Knowledge"
            subtitle="Deepen your awareness across connected statutes, scenarios, and landmark judgments."
            understandHref={learnRoutes.journey(journeySlug)}
            understandLabel={`${journey.title} Journey`}
            deeperHref="/laws/article-21-protection-of-life-and-personal-liberty"
            deeperLabel="Article 21 & Due Process"
            practiceHref="/learn/scenarios/pg-deposit-refusal"
            practiceLabel="Deposit Recovery Simulation"
            precedentHref="/case-studies/puttaswamy-v-union-of-india-2017"
            precedentLabel="Puttaswamy (2017) Judgment"
          />

          {/* Navigation */}
          <div className="border-border flex items-center justify-between border-t pt-6">
            {prev ? (
              <Link href={learnRoutes.lesson(journeySlug, prev.slug)}>
                <Button variant="outline" className="glass rounded-xl">
                  <ArrowLeft className="mr-1.5 size-4" />
                  {prev.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={learnRoutes.lesson(journeySlug, next.slug)}>
                <Button variant="outline" className="glass rounded-xl">
                  {next.title}
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </Link>
            ) : (
              <Link href={learnRoutes.quiz(journeySlug)}>
                <Button className="rounded-xl">
                  Take the quiz
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </Link>
            )}
          </div>
        </article>
      </Container>
    </>
  );
}
