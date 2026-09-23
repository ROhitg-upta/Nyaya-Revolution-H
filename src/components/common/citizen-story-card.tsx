"use client";

import { useState } from "react";
import { toggleStoryHelpfulAction } from "@/actions/community.actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bookmark, CheckCircle2, HeartHandshake } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface CitizenStory {
  id: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  category: string;
  title: string;
  whatHappened: string;
  actionTaken: string;
  outcome: string;
  resolutionStatus: "resolved" | "ongoing" | "mediated";
  statutoryBacking?: string;
  helpfulCount: number;
  timeAgo: string;
}


export interface CitizenStoryCardProps {
  story: CitizenStory;
  className?: string;
}

export function CitizenStoryCard({ story, className }: CitizenStoryCardProps) {
  const [helpful, setHelpful] = useState(false);
  const [count, setCount] = useState(story.helpfulCount);
  const [saved, setSaved] = useState(false);

  const toggleHelpful = () => {
    if (helpful) {
      setCount((c) => Math.max(0, c - 1));
      setHelpful(false);
    } else {
      setCount((c) => c + 1);
      setHelpful(true);
      void toggleStoryHelpfulAction(story.id);
    }
  };

  return (
    <article
      data-slot="citizen-story-card"
      className={cn(
        "glass glow-hover relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all",
        className,
      )}
    >
      {/* Header: Author + Verification Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="ring-brand/20 size-10 ring-1">
            <AvatarFallback className="bg-brand/15 text-brand text-xs font-bold">
              {story.authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-sm font-semibold">
                {story.authorName}
              </span>
              <span title="Verified Citizen Experience">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              </span>
            </div>
            <span className="text-muted-foreground text-xs">{story.authorRole}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[11px] font-medium">
            {story.category}
          </Badge>
          <Badge
            variant={story.resolutionStatus === "resolved" ? "success" : "outline"}
            className="text-[11px] font-semibold"
          >
            {story.resolutionStatus === "resolved" ? "Resolved" : "Ongoing"}
          </Badge>
        </div>
      </div>

      {/* Story Narrative */}
      <div className="my-4 flex flex-col gap-2.5">
        <h3 className="text-foreground text-base font-bold leading-snug">
          {story.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          {story.whatHappened}
        </p>

        {/* Action Taken & Outcome */}
        <div className="bg-muted/40 border-border/50 mt-1 flex flex-col gap-2 rounded-xl border p-3.5 text-xs">
          <div>
            <span className="text-foreground font-semibold">Action Taken: </span>
            <span className="text-muted-foreground">{story.actionTaken}</span>
          </div>
          <div>
            <span className="text-foreground font-semibold">Legal Outcome: </span>
            <span className="text-brand font-medium">{story.outcome}</span>
          </div>
          {story.statutoryBacking ? (
            <div className="text-muted-foreground/80 text-[11px]">
              Law invoked: <span className="font-medium text-foreground">{story.statutoryBacking}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer: Engagement Controls */}
      <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>{story.timeAgo}</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleHelpful}
            aria-label="Mark experience as helpful"
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer text-xs font-medium",
              helpful
                ? "bg-brand/15 text-brand"
                : "hover:bg-muted hover:text-foreground",
            )}
          >
            <HeartHandshake className="size-3.5" />
            <span>{count} Helpful</span>
          </button>

          <button
            type="button"
            onClick={() => setSaved(!saved)}
            aria-label="Bookmark story"
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
              saved
                ? "bg-brand/15 text-brand"
                : "hover:bg-muted hover:text-foreground",
            )}
          >
            <Bookmark className={cn("size-3.5", saved && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  );
}
