"use client";

import {
  Brain,
  Clock,
  Compass,
  FileText,
  MessagesSquare,
  Scale,
  User,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import type { ModerationEntityType, ModerationQueueItem } from "@/types";

interface ModerationItemCardProps {
  item: ModerationQueueItem;
  onSelect: (item: ModerationQueueItem) => void;
}

export function ModerationItemCard({ item, onSelect }: ModerationItemCardProps) {
  const getEntityBadge = (type: ModerationEntityType) => {
    switch (type) {
      case "situation":
        return {
          icon: Compass,
          label: "Citizen Situation",
          className: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "quiz":
        return {
          icon: Brain,
          label: "AI Draft Quiz",
          className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "story":
        return {
          icon: MessagesSquare,
          label: "Citizen Story",
          className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "report":
        return {
          icon: FileText,
          label: "Citation Report",
          className: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        };
    }
  };

  const getRiskBadge = (risk?: string) => {
    switch (risk) {
      case "urgent":
        return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-muted text-muted-foreground border-border/50";
    }
  };

  const entity = getEntityBadge(item.entityType);
  const Icon = entity.icon;

  const formattedDate = new Date(item.submittedAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="glass hover:border-brand/40 flex flex-col justify-between gap-4 rounded-2xl p-5 transition-all">
      <div className="flex flex-col gap-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${entity.className}`}
            >
              <Icon className="size-3.5" />
              {entity.label}
            </span>
            <span className="bg-muted/60 text-muted-foreground rounded px-2 py-0.5 text-[11px] font-medium">
              {item.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {item.riskRating && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRiskBadge(
                  item.riskRating
                )}`}
              >
                {item.riskRating}
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                item.status === "verified" || item.status === "published"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : item.status === "rejected"
                    ? "bg-red-500/15 text-red-600"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}
            >
              {item.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Title & Summary */}
        <h3 className="text-foreground text-base font-bold leading-snug">{item.title}</h3>
        <p className="text-muted-foreground line-clamp-2 text-xs sm:text-sm leading-relaxed">
          {item.summary}
        </p>

        {/* Statutory Citation Preview */}
        {item.statutoryReference && (
          <div className="border-border/50 bg-muted/20 text-foreground/90 flex items-center gap-2 rounded-xl border px-3 py-2 text-xs">
            <Scale className="text-brand size-3.5 shrink-0" />
            <span className="font-mono font-medium truncate">{item.statutoryReference}</span>
          </div>
        )}
      </div>

      {/* Submitter Info & Action */}
      <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="bg-muted flex size-6 items-center justify-center rounded-full">
            <User className="size-3.5" />
          </div>
          <span>
            {item.authorName} · <span className="text-[11px]">{item.authorRole}</span>
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="size-3" />
            {formattedDate}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelect(item)}
          className="glass rounded-xl text-xs font-semibold hover:border-brand"
        >
          Review & Verify
        </Button>
      </div>
    </div>
  );
}
