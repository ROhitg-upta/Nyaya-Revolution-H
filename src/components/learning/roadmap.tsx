"use client";

import { motion } from "motion/react";

import {
  type LucideIcon,
  Award,
  BookOpen,
  Check,
  ClipboardCheck,
  Flag,
  Lock,
  Play,
  Zap,
} from "@/lib/icons";
import { getJourney, journeyLessons, learnRoutes } from "@/constants";
import { cn } from "@/lib/utils";

type NodeStatus = "done" | "current" | "locked" | "available";

interface RoadmapNodeProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  status: NodeStatus;
  href?: string;
  last?: boolean;
  index: number;
}

function statusStyles(status: NodeStatus) {
  switch (status) {
    case "done":
      return "bg-gradient-brand text-primary-foreground glow-brand";
    case "current":
      return "bg-brand/15 text-brand ring-2 ring-brand";
    case "locked":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-brand/12 text-brand";
  }
}

function RoadmapNode({
  icon: Icon,
  title,
  subtitle,
  status,
  href,
  last,
  index,
}: RoadmapNodeProps) {
  const locked = status === "locked";
  const NodeIcon = status === "done" ? Check : locked ? Lock : Icon;

  const body = (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (index % 8) * 0.04 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl p-3 transition-all",
        href && !locked && "glass glow-hover hover:-translate-y-0.5",
      )}
    >
      <span
        className={cn(
          "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl",
          statusStyles(status),
        )}
      >
        <NodeIcon className="size-5" />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-foreground text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground text-xs">{subtitle}</span>
      </div>
      {href && !locked && status !== "done" ? (
        <Play className="text-brand size-4 opacity-0 transition-opacity group-hover:opacity-100" />
      ) : null}
    </motion.div>
  );

  return (
    <li className="relative pl-0">
      {!last ? (
        <span
          aria-hidden="true"
          className="bg-border absolute top-11 left-[2.4rem] h-[calc(100%-1.5rem)] w-px"
        />
      ) : null}
      {href && !locked ? (
        <a
          href={href}
          className="focus-visible:ring-ring block rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}

/** Interactive journey roadmap: lessons grouped by module, then quiz →
 * challenge → completion → certificate. Completion state derives from progress. */
export function Roadmap({ journeySlug }: { journeySlug: string }) {
  const journey = getJourney(journeySlug);
  if (!journey) return null;
  const lessons = journeyLessons(journey);
  const completed = Math.round((journey.progress / 100) * lessons.length);

  let running = 0;
  const nodes: RoadmapNodeProps[] = [];

  journey.modules.forEach((module, mi) => {
    module.lessons.forEach((lessonItem) => {
      const idx = running;
      const status: NodeStatus =
        idx < completed ? "done" : idx === completed ? "current" : "available";
      nodes.push({
        icon: BookOpen,
        title: lessonItem.title,
        subtitle: `${module.title} · ${lessonItem.readingMinutes} min read`,
        status,
        href: learnRoutes.lesson(journey.slug, lessonItem.slug),
        index: idx,
      });
      running += 1;
    });
    void mi;
  });

  const allDone = completed >= lessons.length;
  nodes.push({
    icon: ClipboardCheck,
    title: "Journey quiz",
    subtitle: "Test what you've learned",
    status: allDone ? "current" : "available",
    href: learnRoutes.quiz(journey.slug),
    index: running++,
  });
  nodes.push({
    icon: Zap,
    title: "Mini challenge",
    subtitle: "Apply it to a real scenario",
    status: "available",
    href: learnRoutes.quiz(journey.slug),
    index: running++,
  });
  nodes.push({
    icon: Flag,
    title: "Completion",
    subtitle: allDone ? "Journey complete!" : "Finish all steps to complete",
    status: allDone ? "done" : "locked",
    index: running++,
  });
  nodes.push({
    icon: Award,
    title: "Certificate",
    subtitle: "Earn your shareable certificate",
    status: allDone ? "available" : "locked",
    href: learnRoutes.certificate(journey.slug),
    index: running++,
  });

  return (
    <ol className="flex flex-col gap-2">
      {nodes.map((node, i) => (
        <RoadmapNode key={i} {...node} last={i === nodes.length - 1} />
      ))}
    </ol>
  );
}
