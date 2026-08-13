import { ProgressRing } from "@/components/learning/progress-ring";
import { Button } from "@/components/ui/button";
import { journeyLessons, learnRoutes } from "@/constants";
import { Play } from "@/lib/icons";
import type { Journey } from "@/types";

/** "Continue Learning" card — resumes an in-progress journey. */
export function ContinueCard({ journey }: { journey: Journey }) {
  const lessons = journeyLessons(journey);
  // Mock "next" lesson: pick roughly where progress sits.
  const nextIndex = Math.min(
    lessons.length - 1,
    Math.floor((journey.progress / 100) * lessons.length),
  );
  const nextLesson = lessons[nextIndex];

  return (
    <div className="glass flex w-[21rem] shrink-0 flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <ProgressRing value={journey.progress} size={60}>
          <span className="text-foreground text-xs font-bold">
            {journey.progress}%
          </span>
        </ProgressRing>
        <div className="flex flex-col">
          <span className="bg-brand/12 text-brand w-fit rounded-full px-2 py-0.5 text-[0.65rem] font-semibold">
            {journey.category}
          </span>
          <h3 className="text-foreground mt-1 text-base font-semibold">
            {journey.title}
          </h3>
        </div>
      </div>
      <div className="glass rounded-xl p-3">
        <span className="text-muted-foreground text-xs">Up next</span>
        <p className="text-foreground truncate text-sm font-medium">
          {nextLesson.title}
        </p>
      </div>
      <a
        href={learnRoutes.lesson(journey.slug, nextLesson.slug)}
        className="mt-auto"
      >
        <Button className="glow-hover w-full rounded-xl">
          <Play className="size-4" />
          Resume
        </Button>
      </a>
    </div>
  );
}
