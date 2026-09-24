"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Check,
  Flag,
  Image as ImageIcon,
  MessageSquare,
  Scale,
  Share2,
  ShieldAlert,
  Sparkles,
  ThumbsUp,
  UserCheck,
  Video,
  Volume2,
} from "lucide-react";

import {
  toggleStoryBookmarkAction,
  toggleStoryHelpfulAction,
} from "@/actions/community.actions";
import { STORY_TYPES } from "@/constants/community";
import { communityStoryRoute, situationRoute } from "@/constants/routes";
import type { CommunityStory } from "@/types/community";

interface CommunityStoryCardProps {
  story: CommunityStory;
  onReportRequest?: (story: CommunityStory) => void;
}

export function CommunityStoryCard({
  story,
  onReportRequest,
}: CommunityStoryCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(story.helpfulCount);
  const [isHelpful, setIsHelpful] = useState(Boolean(story.isHelpfulByUser));
  const [isSaved, setIsSaved] = useState(Boolean(story.isSavedByUser));
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPending, startTransition] = useTransition();

  const storyTypeMeta =
    STORY_TYPES.find((t) => t.id === story.storyType) || STORY_TYPES[0];

  const imageCount = story.media.filter((m) => m.mediaType === "image").length;
  const audioCount = story.media.filter((m) => m.mediaType === "audio").length;
  const videoCount = story.media.filter((m) => m.mediaType === "video").length;
  const coverImage = story.media.find((m) => m.mediaType === "image");

  const handleToggleHelpful = () => {
    startTransition(async () => {
      const nextState = !isHelpful;
      setIsHelpful(nextState);
      setHelpfulCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

      const res = await toggleStoryHelpfulAction(story.id);
      if (res.success && typeof res.data.helpfulCount === "number") {
        setIsHelpful(res.data.helpful);
        setHelpfulCount(res.data.helpfulCount);
      }
    });
  };

  const handleToggleSave = () => {
    startTransition(async () => {
      setIsSaved((prev) => !prev);
      const res = await toggleStoryBookmarkAction(story.id, story.slug);
      if (res.success) {
        setIsSaved(res.data.saved);
      }
    });
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${communityStoryRoute(story.slug)}`
        : communityStoryRoute(story.slug);

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <article className="glass-strong border-border/70 hover:border-brand/40 flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition-all">
      <div>
        {/* Top Authority & Category Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              <UserCheck className="size-3" />
              Community Story ({storyTypeMeta.badgeText})
            </span>
            <span className="bg-brand/10 text-brand rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
              {story.categoryLabel}
            </span>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {story.resolutionStatus}
          </span>
        </div>

        {/* Author Identity Header */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-brand text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm">
              {story.authorInitials}
            </div>
            <div>
              <p className="text-foreground text-sm font-bold">
                {story.authorName}
              </p>
              <p className="text-muted-foreground text-xs">
                {story.authorRole}
              </p>
            </div>
          </div>

          {/* Media Indicators */}
          {story.media.length > 0 && (
            <div className="flex items-center gap-1.5">
              {imageCount > 0 && (
                <span
                  title={`${imageCount} Image attachment(s)`}
                  className="border-border/70 bg-background/80 text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                >
                  <ImageIcon className="text-brand size-3" />
                  {imageCount}
                </span>
              )}
              {audioCount > 0 && (
                <span
                  title={`${audioCount} Voice note(s)`}
                  className="border-border/70 bg-background/80 text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                >
                  <Volume2 className="text-brand size-3" />
                  Voice
                </span>
              )}
              {videoCount > 0 && (
                <span
                  title={`${videoCount} Video walkthrough(s)`}
                  className="border-border/70 bg-background/80 text-muted-foreground inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                >
                  <Video className="text-brand size-3" />
                  Video
                </span>
              )}
            </div>
          )}
        </div>

        {/* Story Title */}
        <Link
          href={communityStoryRoute(story.slug)}
          className="group mt-4 block"
        >
          <h3 className="text-foreground group-hover:text-brand text-lg font-bold tracking-tight transition-colors sm:text-xl">
            {story.title}
          </h3>
        </Link>

        {/* Optional Cover Image Preview */}
        {coverImage && (
          <Link
            href={communityStoryRoute(story.slug)}
            className="border-border/60 mt-3 block aspect-[16/7] w-full overflow-hidden rounded-2xl border bg-black/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage.url}
              alt={coverImage.altText || story.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>
        )}

        {/* Structured Narrative Preview */}
        <div className="mt-4 space-y-2.5 text-xs leading-relaxed">
          <div>
            <span className="text-foreground font-bold uppercase tracking-wider text-[10px]">
              What Happened:{" "}
            </span>
            <span className="text-muted-foreground line-clamp-2">
              {story.whatHappened}
            </span>
          </div>
          <div>
            <span className="text-brand font-bold uppercase tracking-wider text-[10px]">
              Action Taken:{" "}
            </span>
            <span className="text-muted-foreground line-clamp-2">
              {story.actionTaken}
            </span>
          </div>
          {story.warningSigns && (
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-200">
              <strong className="inline-flex items-center gap-1 font-bold">
                <ShieldAlert className="size-3.5" /> Red Flag to Watch:
              </strong>{" "}
              <span className="line-clamp-1">{story.warningSigns}</span>
            </div>
          )}
        </div>

        {/* Labeled AI Summary Pill (If Available) */}
        {story.aiSummary && (
          <div className="border-border/70 bg-background/60 mt-3.5 rounded-2xl border p-3">
            <span className="text-brand inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase">
              <Sparkles className="size-3" />
              AI Educational Summary (Not Legal Advice)
            </span>
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
              {story.aiSummary}
            </p>
          </div>
        )}

        {/* Tags */}
        {story.tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="border-border/60 bg-background/50 text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Story-to-Learning Bridge Strip + Engagement Footer */}
      <div className="border-border/70 mt-5 border-t pt-4">
        {/* Learn From This Situation Strip */}
        <div className="bg-brand/5 border-brand/20 mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-3.5 py-2.5">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="text-brand size-4 shrink-0" />
            <span className="text-foreground font-semibold">
              Learn from this situation:
            </span>
            <span className="text-muted-foreground line-clamp-1">
              {story.learningBridge.legalAreaTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={situationRoute(story.learningBridge.situationSlug)}
              className="text-brand inline-flex items-center gap-1 text-xs font-bold hover:underline"
            >
              Verified Guide
              <ArrowRight className="size-3" />
            </Link>
            <Link
              href={communityStoryRoute(story.slug)}
              className="text-foreground hover:text-brand inline-flex items-center gap-1 text-xs font-bold"
            >
              Full Story & Media
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={handleToggleHelpful}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                isHelpful
                  ? "bg-brand text-primary-foreground shadow-xs"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Mark story as helpful"
            >
              <ThumbsUp className="size-3.5" />
              Helpful ({helpfulCount})
            </button>

            <Link
              href={`${communityStoryRoute(story.slug)}#comments`}
              className="glass text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition"
            >
              <MessageSquare className="size-3.5" />
              {story.commentCount}
            </Link>

            <button
              type="button"
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                isSaved
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Save story to bookmarks"
            >
              <Bookmark className="size-3.5" />
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="glass text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition"
              aria-label="Copy story link"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  Share
                </>
              )}
            </button>

            {onReportRequest && (
              <button
                type="button"
                onClick={() => onReportRequest(story)}
                className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs transition"
                title="Report safety or legal accuracy concern"
                aria-label="Report story"
              >
                <Flag className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
