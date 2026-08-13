import { Button } from "@/components/ui/button";
import { learnRoutes } from "@/constants";
import { ArrowRight, Target, Zap } from "@/lib/icons";
import type { DailyChallenge } from "@/types";

/** Highlighted daily challenge with an XP reward. */
export function DailyChallengeCard({
  challenge,
}: {
  challenge: DailyChallenge;
}) {
  return (
    <div className="glass-strong relative flex flex-col gap-4 overflow-hidden rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
      <div
        aria-hidden="true"
        className="bg-brand/20 absolute -top-16 -right-10 size-52 rounded-full blur-3xl"
      />
      <div className="relative flex items-center gap-4">
        <span className="bg-gradient-brand text-primary-foreground glow-brand flex size-12 items-center justify-center rounded-2xl">
          <Target className="size-6" />
        </span>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-brand text-xs font-semibold tracking-wide uppercase">
              Daily challenge
            </span>
            <span className="text-warning flex items-center gap-0.5 text-xs font-semibold">
              <Zap className="size-3" />+{challenge.xp} XP
            </span>
          </div>
          <h3 className="text-foreground text-lg font-bold">
            {challenge.title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {challenge.description}
          </p>
        </div>
      </div>
      <a
        href={learnRoutes.quiz(challenge.journeySlug)}
        className="relative shrink-0"
      >
        <Button size="lg" className="glow-hover w-full rounded-xl sm:w-auto">
          Start
          <ArrowRight />
        </Button>
      </a>
    </div>
  );
}
