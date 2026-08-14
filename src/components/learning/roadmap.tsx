"use client";

import { motion } from "motion/react";
import Link from "next/link";

import { getJourney, learnRoutes, lessonCount } from "@/constants";
import {
  Award,
  BookOpen,
  CheckCircle,
  Circle,
  Lightbulb,
  Lock,
  Play,
  Target,
  Trophy,
  Zap,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

type NodeStatus = "done" | "current" | "locked" | "available";

interface RoadmapNode {
  label: string;
  status: NodeStatus;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  xp?: number;
  module?: string;
}

const statusStyles: Record<
  NodeStatus,
  { ring: string; bg: string; text: string; line: string }
> = {
  done: {
    ring: "ring-emerald-500/50",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    line: "bg-emerald-500/40",
  },
  current: {
    ring: "ring-brand",
    bg: "bg-brand/12",
    text: "text-brand",
    line: "bg-brand/30",
  },
  available: {
    ring: "ring-muted-foreground/20",
    bg: "bg-muted",
    text: "text-muted-foreground",
    line: "bg-muted",
  },
  locked: {
    ring: "ring-transparent",
    bg: "bg-muted/50",
    text: "text-muted-foreground/40",
    line: "bg-muted/30",
  },
};

function RoadmapNodeRow({
  node,
  index,
  isLast,
}: {
  node: RoadmapNode;
  index: number;
  isLast: boolean;
}) {
  const s = statusStyles[node.status];
  const Icon = node.icon;
  const isClickable = node.status !== "locked";

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={cn(
        "group relative flex items-center gap-4",
        isClickable && "cursor-pointer",
      )}
    >
      {/* Vertical connector */}
      {!isLast && (
        <div
          className={cn(
            "absolute top-10 left-5 h-[calc(100%+0.5rem)] w-0.5 -translate-x-1/2",
            s.line,
          )}
        />
      )}

      {/* Icon node */}
      <div
        className={cn(
          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl ring-2 transition-all",
          s.ring,
          s.bg,
          isClickable &&
            node.status !== "done" &&
            "group-hover:ring-brand group-hover:scale-105",
        )}
      >
        {node.status === "done" ? (
          <CheckCircle className="size-5 text-emerald-400" />
        ) : node.status === "locked" ? (
          <Lock className="text-muted-foreground/40 size-4" />
        ) : (
          <Icon className={cn("size-5", s.text)} />
        )}

        {node.status === "current" && (
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-brand/30 absolute inset-0 rounded-xl"
          />
        )}
      </div>

      {/* Label */}
      <div className="flex flex-1 flex-col gap-0.5 py-3">
        {node.module && (
          <span className="text-muted-foreground/60 text-[10px] font-semibold tracking-wider uppercase">
            {node.module}
          </span>
        )}
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            node.status === "locked"
              ? "text-muted-foreground/40"
              : "text-foreground",
            isClickable && "group-hover:text-brand",
          )}
        >
          {node.label}
        </span>
      </div>

      {/* XP badge */}
      {node.xp && node.status !== "locked" && (
        <span className="text-brand flex items-center gap-1 text-xs font-semibold">
          <Zap className="size-3" />
          {node.xp}
        </span>
      )}

      {/* Status indicator */}
      {node.status === "current" && (
        <span className="bg-brand/12 text-brand rounded-full px-2.5 py-0.5 text-xs font-semibold">
          Current
        </span>
      )}
    </motion.div>
  );

  if (isClickable) {
    return <Link href={node.href}>{content}</Link>;
  }
  return content;
}

interface RoadmapProps {
  journeySlug: string;
}

export function Roadmap({ journeySlug }: RoadmapProps) {
  const journey = getJourney(journeySlug);
  if (!journey) return null;

  const total = lessonCount(journey);
  const doneCount = Math.round((journey.progress / 100) * total);

  const nodes: RoadmapNode[] = [];
  let globalIdx = 0;

  for (const mod of journey.modules) {
    for (const lesson of mod.lessons) {
      const status: NodeStatus =
        globalIdx < doneCount
          ? "done"
          : globalIdx === doneCount
            ? "current"
            : "available";

      nodes.push({
        label: lesson.title,
        status,
        href: learnRoutes.lesson(journeySlug, lesson.slug),
        icon: BookOpen,
        xp: 20,
        module: lesson === mod.lessons[0] ? mod.title : undefined,
      });
      globalIdx++;
    }
  }

  const quizStatus: NodeStatus =
    journey.progress === 100
      ? "done"
      : doneCount >= total
        ? "current"
        : "locked";
  const certStatus: NodeStatus = journey.progress === 100 ? "done" : "locked";

  nodes.push({
    label: "Journey quiz",
    status: quizStatus,
    href: learnRoutes.quiz(journeySlug),
    icon: Target,
    xp: 50,
  });
  nodes.push({
    label: "Mini challenge",
    status: certStatus,
    href: learnRoutes.quiz(journeySlug),
    icon: Lightbulb,
    xp: 30,
  });
  nodes.push({
    label: "Completion",
    status: certStatus,
    href: learnRoutes.certificate(journeySlug),
    icon: Trophy,
  });
  nodes.push({
    label: "Earn certificate",
    status: certStatus,
    href: learnRoutes.certificate(journeySlug),
    icon: Award,
  });

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground flex items-center gap-2 text-lg font-bold">
          <Play className="text-brand size-5" />
          Learning roadmap
        </h2>
        <span className="text-muted-foreground text-sm">
          {doneCount}/{total + 4} steps
        </span>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex flex-col gap-1">
          {nodes.map((node, i) => (
            <RoadmapNodeRow
              key={`${node.label}-${i}`}
              node={node}
              index={i}
              isLast={i === nodes.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
