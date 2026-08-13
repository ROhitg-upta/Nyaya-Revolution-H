import { ProgressRing } from "@/components/learning/progress-ring";
import { StatTile } from "@/components/learning/stat-tile";
import { WeeklyActivity } from "@/components/learning/weekly-activity";
import { journeys, learnRoutes, learnerProfile } from "@/constants";
import { Award, Flame, Trophy, Zap } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function ProfileProgress() {
  const p = learnerProfile;
  const earnedBadges = p.badges.filter((b) => b.earned).length;
  const earnedCerts = p.certificates.filter((c) => c.earned).length;
  const levelPct = Math.round((p.xpIntoLevel / p.xpForLevel) * 100);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-12 sm:px-8">
      {/* header */}
      <div className="glass-strong flex flex-col items-center gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:gap-8">
        <ProgressRing value={levelPct} size={112} strokeWidth={8}>
          <div className="flex flex-col items-center">
            <span className="text-foreground text-2xl font-bold">
              {p.level}
            </span>
            <span className="text-muted-foreground text-[0.6rem] uppercase">
              Level
            </span>
          </div>
        </ProgressRing>
        <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <span className="text-brand text-xs font-semibold tracking-wide uppercase">
            {p.levelTitle}
          </span>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {p.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {p.xpIntoLevel} / {p.xpForLevel} XP to level {p.level + 1}
          </p>
          <div className="bg-muted mt-1 h-2 w-full max-w-xs overflow-hidden rounded-full">
            <div
              className="bg-gradient-brand h-full rounded-full"
              style={{ width: `${levelPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Zap}
          label="Total XP"
          value={p.xp.toLocaleString("en-IN")}
        />
        <StatTile icon={Flame} label="Day streak" value={p.streakDays} />
        <StatTile
          icon={Trophy}
          label="Badges"
          value={`${earnedBadges}/${p.badges.length}`}
        />
        <StatTile icon={Award} label="Certificates" value={earnedCerts} />
      </div>

      <WeeklyActivity data={p.weekly} />

      {/* badges */}
      <section className="flex flex-col gap-5">
        <h2 className="text-foreground text-xl font-bold">Badges</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {p.badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center",
                !badge.earned && "opacity-50 grayscale",
              )}
            >
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl",
                  badge.earned
                    ? "bg-gradient-brand text-primary-foreground glow-brand"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <badge.icon className="size-6" />
              </span>
              <span className="text-foreground text-xs font-semibold">
                {badge.title}
              </span>
              <span className="text-muted-foreground text-[0.65rem] leading-tight">
                {badge.description}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* achievements */}
      <section className="flex flex-col gap-5">
        <h2 className="text-foreground text-xl font-bold">Achievements</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {p.achievements.map((a) => {
            const pct = Math.round((a.current / a.target) * 100);
            return (
              <div
                key={a.title}
                className="glass flex flex-col gap-3 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-brand/12 text-brand flex size-10 items-center justify-center rounded-xl">
                    <a.icon className="size-5" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-foreground text-sm font-semibold">
                      {a.title}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {a.description}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">
                    {a.current}/{a.target}
                  </span>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="bg-gradient-brand h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* journey progress */}
      <section className="flex flex-col gap-5">
        <h2 className="text-foreground text-xl font-bold">Journey progress</h2>
        <div className="glass flex flex-col divide-y divide-[color:var(--border)] rounded-2xl">
          {journeys.map((j) => (
            <a
              key={j.slug}
              href={learnRoutes.journey(j.slug)}
              className="hover:bg-muted/40 flex items-center gap-4 p-4 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <span className="bg-brand/12 text-brand flex size-9 shrink-0 items-center justify-center rounded-xl">
                <j.icon className="size-4.5" />
              </span>
              <span className="text-foreground flex-1 text-sm font-medium">
                {j.title}
              </span>
              <div className="bg-muted hidden h-1.5 w-32 overflow-hidden rounded-full sm:block">
                <div
                  className="bg-gradient-brand h-full rounded-full"
                  style={{ width: `${j.progress}%` }}
                />
              </div>
              <span className="text-muted-foreground w-9 text-right text-xs font-semibold">
                {j.progress}%
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
