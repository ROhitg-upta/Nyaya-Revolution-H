"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { adjacentLessons, getLesson, learnRoutes } from "@/constants";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  Lightbulb,
  NotebookPen,
  ScrollText,
  Target,
  Timer,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

function Block({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="bg-brand/12 text-brand flex size-9 items-center justify-center rounded-xl">
          <Icon className="size-5" />
        </span>
        <h2 className="text-foreground text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function LessonReader({
  journeySlug,
  lessonSlug,
}: {
  journeySlug: string;
  lessonSlug: string;
}) {
  const [progress, setProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(
        height > 0 ? Math.min(100, (el.scrollTop / height) * 100) : 0,
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const found = getLesson(journeySlug, lessonSlug);
  if (!found) return null;
  const { journey, lesson } = found;
  const { prev, next, index, total } = adjacentLessons(journey, lessonSlug);

  function markComplete() {
    setCompleted(true);
    toast.success("Lesson complete! +20 XP");
  }

  return (
    <>
      {/* reading progress */}
      <div className="bg-muted sticky top-16 z-40 h-1 w-full">
        <div
          className="bg-gradient-brand h-full transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <a
          href={learnRoutes.journey(journey.slug)}
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          {journey.title}
        </a>

        {/* header */}
        <div className="flex flex-col gap-4">
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span>
              Lesson {index + 1} of {total}
            </span>
            <span className="flex items-center gap-1">
              <Timer className="size-3.5" />
              {lesson.readingMinutes} min read
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {lesson.title}
            </h1>
            <button
              type="button"
              onClick={() => setBookmarked((b) => !b)}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              className="glass hover:ring-brand/40 flex size-10 shrink-0 items-center justify-center rounded-xl transition-all hover:ring-1"
            >
              {bookmarked ? (
                <BookmarkCheck className="text-brand size-5" />
              ) : (
                <Bookmark className="text-muted-foreground size-5" />
              )}
            </button>
          </div>
        </div>

        {/* decorative icon illustration */}
        <div className="glass-strong relative mt-8 flex h-32 items-center justify-center overflow-hidden rounded-3xl">
          <div className="bg-brand/25 absolute size-40 rounded-full blur-3xl" />
          <journey.icon className="text-brand relative size-14" />
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <Block icon={Target} title="Learning objectives">
            <ul className="flex flex-col gap-2.5">
              {lesson.objectives.map((o) => (
                <li key={o} className="flex items-start gap-3">
                  <span className="bg-success/15 text-success mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                    <Check className="size-3" />
                  </span>
                  <span className="text-muted-foreground text-sm leading-relaxed">
                    {o}
                  </span>
                </li>
              ))}
            </ul>
          </Block>

          <Block icon={ScrollText} title="Key concepts">
            <div className="flex flex-col gap-3">
              {lesson.concepts.map((c) => (
                <div key={c.title} className="glass rounded-xl p-4">
                  <h3 className="text-foreground text-sm font-semibold">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block icon={Lightbulb} title="Important terms">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lesson.terms.map((t) => (
                <div key={t.term} className="glass rounded-xl p-4">
                  <dt className="text-brand text-sm font-semibold">{t.term}</dt>
                  <dd className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {t.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </Block>

          <Block icon={Lightbulb} title="Real-life examples">
            <div className="flex flex-col gap-3">
              {lesson.examples.map((e) => (
                <div
                  key={e.title}
                  className="border-brand/30 bg-brand/5 rounded-xl border-l-2 p-4"
                >
                  <h3 className="text-foreground text-sm font-semibold">
                    {e.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {e.body}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block icon={NotebookPen} title="Your notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down anything you want to remember…"
              rows={4}
              className="glass text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50 w-full resize-y rounded-xl p-3.5 text-sm outline-none focus-visible:ring-2"
            />
            <p className="text-muted-foreground/60 mt-2 text-xs">
              Notes are local to this session (not saved yet).
            </p>
          </Block>
        </div>

        {/* completion + nav */}
        <div className="mt-8 flex flex-col gap-4">
          <Button
            size="lg"
            onClick={markComplete}
            disabled={completed}
            className={cn("glow-hover rounded-xl", completed && "opacity-80")}
          >
            {completed ? (
              <>
                <CheckCircle2 className="size-5" />
                Completed
              </>
            ) : (
              "Mark as complete"
            )}
          </Button>

          <div className="flex items-center justify-between gap-3">
            {prev ? (
              <a href={learnRoutes.lesson(journey.slug, prev.slug)}>
                <Button variant="outline" className="glass rounded-xl">
                  <ArrowLeft />
                  Previous
                </Button>
              </a>
            ) : (
              <span />
            )}
            {next ? (
              <a href={learnRoutes.lesson(journey.slug, next.slug)}>
                <Button variant="outline" className="glass rounded-xl">
                  Next
                  <ArrowRight />
                </Button>
              </a>
            ) : (
              <a href={learnRoutes.quiz(journey.slug)}>
                <Button className="glow-hover rounded-xl">
                  Take the quiz
                  <ArrowRight />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
