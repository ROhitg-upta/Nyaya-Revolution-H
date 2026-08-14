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
  adjacentLessons,
  getJourney,
  getLesson,
  getQuiz,
  learnRoutes,
  lessonCount,
} from "@/constants";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Lightbulb,
  ListChecks,
  NotebookPen,
  Sparkles,
  Target,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

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

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-5 pt-28 pb-24 sm:px-8 lg:pt-32">
        {/* Sidebar */}
        <LessonSidebar
          journeySlug={journeySlug}
          modules={journey.modules}
          currentLessonSlug={lessonSlug}
          completedCount={completedCount}
        />

        {/* Main content */}
        <article className="flex min-w-0 flex-1 flex-col gap-10">
          {/* Back link */}
          <Link
            href={learnRoutes.journey(journeySlug)}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" />
            {journey.title}
          </Link>

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
      </div>
    </>
  );
}
