import { ContinueCard } from "@/components/learning/continue-card";
import { DailyChallengeCard } from "@/components/learning/daily-challenge-card";
import { JourneyCard } from "@/components/learning/journey-card";
import { ProgressRing } from "@/components/learning/progress-ring";
import { SectionRow } from "@/components/learning/section-row";
import { StreakCard } from "@/components/learning/streak-card";
import { WeeklyActivity } from "@/components/learning/weekly-activity";
import { Button } from "@/components/ui/button";
import {
  dailyChallenge,
  inProgressJourneys,
  journeys,
  journeysByTag,
  learnRoutes,
  learnerProfile,
  learningDisclaimer,
  routes,
} from "@/constants";
import {
  Award,
  Bookmark,
  Compass,
  Flame,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "@/lib/icons";
import { bookmarks } from "@/constants/learning";

export function LearningHome() {
  const p = learnerProfile;
  const levelPct = Math.round((p.xpIntoLevel / p.xpForLevel) * 100);
  const continueJourneys = inProgressJourneys();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-12 sm:px-8">
      {/* greeting */}
      <div className="glass-strong flex flex-col items-center gap-6 rounded-3xl p-6 sm:flex-row sm:justify-between sm:p-8">
        <div className="flex items-center gap-5">
          <ProgressRing value={levelPct} size={72} strokeWidth={7}>
            <span className="text-foreground text-sm font-bold">
              L{p.level}
            </span>
          </ProgressRing>
          <div className="flex flex-col gap-0.5">
            <span className="text-brand text-xs font-semibold tracking-wide uppercase">
              {p.levelTitle}
            </span>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Welcome back, {p.name}
            </h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Zap className="text-brand size-4" />
                {p.xp.toLocaleString("en-IN")} XP
              </span>
              <span className="flex items-center gap-1">
                <Flame className="text-warning size-4" />
                {p.streakDays}-day streak
              </span>
            </div>
          </div>
        </div>
        <a href={routes.learnProfile}>
          <Button variant="outline" className="glass rounded-xl">
            View profile
          </Button>
        </a>
      </div>

      {/* daily challenge */}
      <DailyChallengeCard challenge={dailyChallenge} />

      {/* continue learning */}
      {continueJourneys.length > 0 ? (
        <SectionRow
          icon={Play}
          title="Continue learning"
          description="Pick up where you left off."
        >
          {continueJourneys.map((j) => (
            <ContinueCard key={j.slug} journey={j} />
          ))}
        </SectionRow>
      ) : null}

      {/* streak + weekly */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StreakCard streakDays={p.streakDays} weekly={p.weekly} />
        <WeeklyActivity data={p.weekly} />
      </div>

      {/* recommended */}
      <SectionRow
        icon={Sparkles}
        title="Recommended journeys"
        description="Curated starting points for you."
        seeAllHref={routes.learn}
      >
        {journeysByTag("recommended").map((j) => (
          <JourneyCard key={j.slug} journey={j} fixedWidth />
        ))}
      </SectionRow>

      {/* trending */}
      <SectionRow
        icon={TrendingUp}
        title="Trending journeys"
        description="What learners are exploring now."
      >
        {journeysByTag("trending").map((j) => (
          <JourneyCard key={j.slug} journey={j} fixedWidth />
        ))}
      </SectionRow>

      {/* recently added */}
      <SectionRow
        icon={Star}
        title="Recently added"
        description="Fresh journeys on the platform."
      >
        {journeysByTag("recent").map((j) => (
          <JourneyCard key={j.slug} journey={j} fixedWidth />
        ))}
      </SectionRow>

      {/* based on profile */}
      <SectionRow
        icon={Compass}
        title="Based on your profile"
        description="Matched to your onboarding choices."
      >
        {journeysByTag("profile").map((j) => (
          <JourneyCard key={j.slug} journey={j} fixedWidth />
        ))}
      </SectionRow>

      {/* certificates */}
      <section className="flex flex-col gap-4">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Award className="text-brand size-5" />
          Certificates
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {p.certificates.map((c) => (
            <a
              key={c.journeySlug}
              href={
                c.earned
                  ? learnRoutes.certificate(c.journeySlug)
                  : learnRoutes.journey(c.journeySlug)
              }
              className="glass glow-hover flex items-center gap-3 rounded-2xl p-4 hover:-translate-y-0.5"
            >
              <span
                className={
                  c.earned
                    ? "bg-gradient-brand text-primary-foreground glow-brand flex size-11 items-center justify-center rounded-xl"
                    : "bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-xl"
                }
              >
                <Award className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-semibold">
                  {c.title}
                </span>
                <span className="text-muted-foreground text-xs">
                  {c.earned ? `Earned · ${c.date}` : "In progress"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* bookmarks */}
      <section className="flex flex-col gap-4">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Bookmark className="text-brand size-5" />
          Bookmarks
        </h2>
        <div className="flex flex-col gap-2.5">
          {bookmarks.map((b) => (
            <a
              key={b.lessonSlug}
              href={learnRoutes.lesson(b.journeySlug, b.lessonSlug)}
              className="glass hover:ring-brand/40 flex items-center gap-3 rounded-xl p-4 transition-all hover:ring-1"
            >
              <Bookmark className="text-brand size-4 shrink-0" />
              <div className="flex flex-1 flex-col">
                <span className="text-foreground text-sm font-medium">
                  {b.title}
                </span>
                <span className="text-muted-foreground text-xs">
                  {b.journeyTitle}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* all journeys */}
      <section className="flex flex-col gap-4">
        <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Compass className="text-brand size-5" />
          All journeys
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((j) => (
            <JourneyCard key={j.slug} journey={j} />
          ))}
        </div>
      </section>

      <p className="text-muted-foreground/60 text-center text-xs">
        {learningDisclaimer}
      </p>
    </div>
  );
}
