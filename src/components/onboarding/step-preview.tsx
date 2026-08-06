"use client";

import { StepHeader } from "@/components/onboarding/step-header";
import { Badge } from "@/components/ui/badge";
import { interests as interestOptions } from "@/constants/onboarding";
import { situations } from "@/constants/landing";
import {
  type LucideIcon,
  BookOpen,
  CalendarDays,
  Flame,
  MessagesSquare,
  Route,
  Target,
  TrendingUp,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "@/types";

function PreviewTile({
  icon: Icon,
  title,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("glass flex flex-col gap-3 rounded-2xl p-4", className)}>
      <div className="flex items-center gap-2">
        <span className="bg-brand/12 text-brand flex size-7 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </span>
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function StepPreview({ data }: { data: OnboardingData }) {
  const firstName = data.name.trim().split(" ")[0] || "there";
  const recommended = interestOptions
    .filter((option) => data.interests.includes(option.value))
    .slice(0, 3);
  const paths =
    recommended.length > 0 ? recommended : interestOptions.slice(0, 3);
  const suggested = situations.slice(0, 3);

  return (
    <div className="flex flex-col gap-7">
      <StepHeader
        title={`You're all set, ${firstName}!`}
        description="Here's a preview of the journey we've prepared for you."
      />

      <div className="glass-strong rounded-3xl p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Recommended learning paths */}
          <PreviewTile
            icon={Route}
            title="Recommended paths"
            className="sm:col-span-2"
          >
            <div className="flex flex-wrap gap-2">
              {paths.map((path) => (
                <Badge key={path.value} variant="brand">
                  {path.label}
                </Badge>
              ))}
            </div>
          </PreviewTile>

          {/* Suggested situations */}
          <PreviewTile
            icon={BookOpen}
            title="Suggested situations"
            className="sm:col-span-2"
          >
            <ul className="flex flex-col gap-2">
              {suggested.map((situation) => (
                <li
                  key={situation.title}
                  className="text-muted-foreground flex items-center gap-2 text-sm"
                >
                  <situation.icon className="text-brand size-4 shrink-0" />
                  <span className="truncate">{situation.title}</span>
                </li>
              ))}
            </ul>
          </PreviewTile>

          {/* Streak */}
          <PreviewTile icon={Flame} title="Daily streak">
            <p className="text-foreground text-2xl font-bold">
              0{" "}
              <span className="text-muted-foreground text-sm font-normal">
                days
              </span>
            </p>
            <p className="text-muted-foreground text-xs">
              Start today to begin your streak.
            </p>
          </PreviewTile>

          {/* Weekly goal */}
          <PreviewTile icon={Target} title="Weekly goal">
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div className="bg-gradient-brand h-full w-1/5 rounded-full" />
            </div>
            <p className="text-muted-foreground text-xs">
              1 of 5 lessons this week
            </p>
          </PreviewTile>

          {/* Progress */}
          <PreviewTile icon={TrendingUp} title="Progress">
            <p className="text-foreground text-2xl font-bold">
              0
              <span className="text-muted-foreground text-sm font-normal">
                %
              </span>
            </p>
            <p className="text-muted-foreground text-xs">
              Complete lessons to grow this.
            </p>
          </PreviewTile>

          {/* Community */}
          <PreviewTile icon={MessagesSquare} title="Community">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Join thousands learning their rights together — highlights appear
              here.
            </p>
          </PreviewTile>
        </div>

        <div className="text-muted-foreground/60 mt-4 flex items-center gap-1.5 text-xs">
          <CalendarDays className="size-3.5" />
          Preview only — your real dashboard unlocks after launch.
        </div>
      </div>
    </div>
  );
}
