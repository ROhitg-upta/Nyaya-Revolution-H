import { DifficultyBadge } from "@/components/learning/difficulty-badge";
import { learnRoutes, lessonCount } from "@/constants";
import { Award, BookOpen, Clock, Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Journey } from "@/types";

interface JourneyCardProps {
  journey: Journey;
  /** Fixed width for horizontal carousels. */
  fixedWidth?: boolean;
}

/** Premium journey card showing difficulty, time, lessons, XP, and progress. */
export function JourneyCard({ journey, fixedWidth = false }: JourneyCardProps) {
  const lessons = lessonCount(journey);
  const started = journey.progress > 0;

  return (
    <a
      href={learnRoutes.journey(journey.slug)}
      className={cn(
        "focus-visible:ring-ring group/card block h-full rounded-2xl focus-visible:ring-2 focus-visible:outline-none",
        fixedWidth && "w-[19rem] shrink-0",
      )}
    >
      <div className="glass glow-hover relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-5 hover:-translate-y-1">
        <div className="bg-brand/20 pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100" />

        <div className="relative flex items-start justify-between gap-3">
          <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover/card:scale-105">
            <journey.icon className="size-6" />
          </span>
          <DifficultyBadge difficulty={journey.difficulty} />
        </div>

        <div className="relative flex flex-col gap-1.5">
          <h3 className="text-foreground text-base leading-snug font-semibold">
            {journey.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {journey.tagline}
          </p>
        </div>

        {/* meta row */}
        <div className="text-muted-foreground relative flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {journey.estimatedMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3.5" />
            {lessons} lessons
          </span>
          <span className="text-brand flex items-center gap-1 font-medium">
            <Zap className="size-3.5" />
            {journey.xpReward} XP
          </span>
          <span className="flex items-center gap-1">
            <Award className="size-3.5" />
            Certificate
          </span>
        </div>

        {/* progress */}
        <div className="relative mt-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {started ? "In progress" : "Not started"}
            </span>
            <span className="text-foreground font-semibold">
              {journey.progress}%
            </span>
          </div>
          <div className="bg-muted h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-gradient-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${journey.progress}%` }}
            />
          </div>
        </div>
      </div>
    </a>
  );
}
