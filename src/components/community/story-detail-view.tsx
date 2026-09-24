"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Check,
  CheckCircle2,
  Flag,
  MessageSquare,
  Send,
  Share2,
  ShieldAlert,
  Sparkles,
  ThumbsUp,
  UserCheck,
  X,
} from "lucide-react";

import {
  createStoryCommentAction,
  reportCommunityContentAction,
  toggleStoryBookmarkAction,
  toggleStoryHelpfulAction,
} from "@/actions/community.actions";
import { StoryMediaGallery } from "@/components/community/media-player";
import { StoryLearningBridge } from "@/components/community/story-learning-bridge";
import { YourNextStepsCard } from "@/components/action/your-next-steps-card";
import { Container } from "@/components/layout";
import { STORY_REPORT_REASONS, STORY_TYPES } from "@/constants/community";
import { VERIFIED_RESOURCES_CATALOG } from "@/constants/verified-resources";
import { routes } from "@/constants/routes";
import { detectAndRedactPII } from "@/lib/sanitization";
import type {
  CommunityStory,
  StoryComment,
  StoryIdentityMode,
} from "@/types/community";

interface StoryDetailViewProps {
  story: CommunityStory;
  initialComments: StoryComment[];
}

export function StoryDetailView({
  story,
  initialComments,
}: StoryDetailViewProps) {
  const [helpfulCount, setHelpfulCount] = useState(story.helpfulCount);
  const [isHelpful, setIsHelpful] = useState(Boolean(story.isHelpfulByUser));
  const [isSaved, setIsSaved] = useState(Boolean(story.isSavedByUser));
  const [copied, setCopied] = useState(false);

  // Comments state
  const [comments, setComments] = useState<StoryComment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentIdentity, setCommentIdentity] =
    useState<StoryIdentityMode>("pseudonym");
  const [commentDisplayName, setCommentDisplayName] = useState("Riya S.");
  const [commentError, setCommentError] = useState<string | null>(null);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>(
    STORY_REPORT_REASONS[0].id
  );
  const [reportDetails, setReportDetails] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const [isPending, startTransition] = useTransition();

  const storyTypeMeta =
    STORY_TYPES.find((t) => t.id === story.storyType) || STORY_TYPES[0];

  const commentPII = detectAndRedactPII(commentText);

  const handleHelpful = () => {
    startTransition(async () => {
      const next = !isHelpful;
      setIsHelpful(next);
      setHelpfulCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      const res = await toggleStoryHelpfulAction(story.id);
      if (res.success && typeof res.data.helpfulCount === "number") {
        setIsHelpful(res.data.helpful);
        setHelpfulCount(res.data.helpfulCount);
      }
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      setIsSaved((prev) => !prev);
      const res = await toggleStoryBookmarkAction(story.id, story.slug);
      if (res.success) {
        setIsSaved(res.data.saved);
      }
    });
  };

  const handleCopyShare = async () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePostComment = () => {
    setCommentError(null);
    if (commentText.trim().length < 3) {
      setCommentError("Please enter at least 3 characters.");
      return;
    }

    startTransition(async () => {
      const res = await createStoryCommentAction({
        storyId: story.id,
        content: commentPII.hasPII ? commentPII.redactedPreview : commentText,
        identityMode: commentIdentity,
        authorDisplayName: commentDisplayName,
      });

      if (!res.success) {
        setCommentError(res.error.message);
        return;
      }

      setComments((prev) => [...prev, res.data.comment]);
      setCommentText("");
    });
  };

  const handleSendReport = () => {
    startTransition(async () => {
      await reportCommunityContentAction({
        contentType: "story",
        contentId: story.id,
        reason: reportReason as
          | "false_legal_claim"
          | "personal_data_exposure"
          | "defamation_targeted_accusation"
          | "harassment_hate"
          | "spam_scam"
          | "unsafe_media"
          | "graphic_distressing"
          | "impersonation"
          | "copyright"
          | "other",
        details: reportDetails,
      });
      setReportSent(true);
      setTimeout(() => {
        setIsReportOpen(false);
        setReportSent(false);
        setReportDetails("");
      }, 1600);
    });
  };

  return (
    <Container size="default" gutter="page">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={routes.community}
            className="glass text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition"
          >
            <ArrowLeft className="size-3.5" />
            Back to Community Voice Hub
          </Link>

          <div className="flex items-center gap-2">
            <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
              <UserCheck className="size-3.5" />
              USER-SHARED CITIZEN EXPERIENCE
            </span>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {story.resolutionStatus}
            </span>
          </div>
        </div>

        {/* Main Story Article Card */}
        <article className="glass-strong border-border/70 rounded-3xl border p-6 sm:p-10">
          {/* Category & Story Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand/15 text-brand rounded-full px-3 py-1 text-xs font-bold">
              {story.categoryLabel}
            </span>
            <span className="border-border/70 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium">
              {storyTypeMeta.badgeText}
            </span>
            {story.locationState && (
              <span className="text-muted-foreground text-xs">
                • {story.locationState}
              </span>
            )}
          </div>

          <h1 className="text-foreground mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
            {story.title}
          </h1>

          {/* Author & Engagement Bar */}
          <div className="border-border/60 mt-6 flex flex-wrap items-center justify-between gap-4 border-y py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-brand text-primary-foreground flex size-11 items-center justify-center rounded-full text-sm font-bold">
                {story.authorInitials}
              </div>
              <div>
                <p className="text-foreground text-sm font-bold">
                  {story.authorName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {story.authorRole} • Identity Mode:{" "}
                  <span className="capitalize">{story.identityMode}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={handleHelpful}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition ${
                  isHelpful
                    ? "bg-brand text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsUp className="size-3.5" />
                Helpful ({helpfulCount})
              </button>

              <button
                type="button"
                onClick={handleSave}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                  isSaved
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className="size-3.5" />
                {isSaved ? "Saved" : "Save"}
              </button>

              <button
                type="button"
                onClick={handleCopyShare}
                className="glass text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="size-3.5" />
                    Share
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-medium"
                title="Report story"
              >
                <Flag className="size-3.5" />
                Report
              </button>
            </div>
          </div>

          {/* Structured Story Sections */}
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
                1. What Happened (Citizen Account)
              </h2>
              <p className="text-foreground/90 mt-2 text-base leading-relaxed whitespace-pre-line">
                {story.whatHappened}
              </p>
            </section>

            {story.warningSigns && (
              <section className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-amber-800 uppercase dark:text-amber-300">
                  <ShieldAlert className="size-4" />
                  Early Warning Signs & Red Flags to Recognize
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-amber-900 dark:text-amber-100">
                  {story.warningSigns}
                </p>
              </section>
            )}

            <section className="border-brand/30 bg-brand/5 rounded-2xl border p-5">
              <h2 className="text-brand text-xs font-bold tracking-wider uppercase">
                2. Action Taken & Procedural Steps Used
              </h2>
              <p className="text-foreground mt-2 text-sm leading-relaxed whitespace-pre-line">
                {story.actionTaken}
              </p>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <section className="border-border/70 bg-background/70 rounded-2xl border p-5">
                <h2 className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                  3. Outcome & Resolution
                </h2>
                <p className="text-foreground mt-2 text-sm leading-relaxed">
                  {story.legalOutcome}
                </p>
              </section>

              <section className="border-border/70 bg-background/70 rounded-2xl border p-5">
                <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
                  4. Key Takeaway for Other Citizens
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  &ldquo;{story.citizenTakeaway}&rdquo;
                </p>
              </section>
            </div>

            {/* Multi-Media Gallery (Images, Voice Notes, Video Walkthroughs) */}
            {story.media.length > 0 && (
              <div className="pt-2">
                <StoryMediaGallery media={story.media} />
              </div>
            )}

            {/* Explicitly Labeled AI Educational Summary */}
            {(story.aiSummary || story.aiEducationalNote) && (
              <section className="border-border/80 bg-background/85 rounded-2xl border p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-brand/15 text-brand inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
                    <Sparkles className="size-3.5" />
                    AI-GENERATED EDUCATIONAL SUMMARY (NOT LEGAL ADVICE)
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Separated from citizen testimony & verified statutes
                  </span>
                </div>
                {story.aiSummary && (
                  <p className="text-foreground mt-3 text-sm leading-relaxed">
                    {story.aiSummary}
                  </p>
                )}
                {story.aiEducationalNote && (
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    {story.aiEducationalNote}
                  </p>
                )}
              </section>
            )}

            {/* Tags */}
            {story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-border/70 bg-background/60 text-muted-foreground rounded-full border px-3 py-1 text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* CORE LOOP: STORY -> SITUATION -> LEARNING BRIDGE */}
        <StoryLearningBridge
          bridge={story.learningBridge}
          storyTitle={story.title}
        />

        {/* SPRINT E11: STORY -> VERIFIED LEGAL AID & CITIZEN ACTION DRAFT */}
        <YourNextStepsCard
          primaryCategory={
            story.category === "cyber"
              ? "Cyber Safety"
              : story.category === "consumer"
                ? "Consumer Rights"
                : story.category === "tenancy"
                  ? "Tenancy & Housing"
                  : story.category === "workplace"
                    ? "Labour & Employment"
                    : story.category === "rti_civic"
                      ? "RTI & Governance"
                      : "Fundamental Rights"
          }
          plainLanguageExplanation={
            story.aiEducationalNote ||
            story.citizenTakeaway ||
            "Indian citizens facing a similar situation can contact verified statutory legal aid authorities (NALSA 15100, Cyber 1930, Consumer 1915) and prepare a chronological draft before approaching the authority."
          }
          recommendedResources={VERIFIED_RESOURCES_CATALOG.slice(0, 4).map(
            (r) => ({
              ...r,
              matchScore: 95,
              matchReasons: ["Verified Official Statutory Channel"],
            })
          )}
        />

        {/* Constructive Citizen Comments & Reflections */}
        <section
          id="comments"
          className="glass-strong border-border/70 rounded-3xl border p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-foreground flex items-center gap-2 text-lg font-bold">
              <MessageSquare className="text-brand size-5" />
              Constructive Community Discussion ({comments.length})
            </h2>
            <span className="text-muted-foreground text-xs">
              PII-shielded & moderated for civic safety
            </span>
          </div>

          {/* Add Comment Box */}
          <div className="border-border/70 bg-background/60 mt-5 rounded-2xl border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-foreground block text-[11px] font-bold">
                  Comment Identity Mode
                </label>
                <select
                  value={commentIdentity}
                  onChange={(e) =>
                    setCommentIdentity(e.target.value as StoryIdentityMode)
                  }
                  className="border-border bg-background text-foreground mt-1 w-full rounded-xl border px-3 py-2 text-xs outline-none"
                >
                  <option value="pseudonym">Pseudonym (Recommended)</option>
                  <option value="anonymous">Anonymous</option>
                  <option value="real_name">Display Name</option>
                </select>
              </div>

              {commentIdentity !== "anonymous" && (
                <div>
                  <label className="text-foreground block text-[11px] font-bold">
                    Your Display Name / Alias
                  </label>
                  <input
                    type="text"
                    value={commentDisplayName}
                    onChange={(e) => setCommentDisplayName(e.target.value)}
                    className="border-border bg-background text-foreground mt-1 w-full rounded-xl border px-3 py-2 text-xs outline-none"
                  />
                </div>
              )}
            </div>

            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share a constructive procedural tip, question, or takeaway (no personal phone numbers or private accusations)..."
              className="border-border bg-background text-foreground mt-3 w-full rounded-xl border p-3 text-xs outline-none sm:text-sm"
            />

            {commentPII.hasPII && (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Note: Sensitive numbers detected in your comment will be
                automatically redacted upon posting.
              </p>
            )}

            {commentError && (
              <p className="text-destructive mt-2 text-xs font-semibold">
                {commentError}
              </p>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={handlePostComment}
                className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs"
              >
                <Send className="size-3.5" />
                {isPending ? "Posting..." : "Post Constructive Comment"}
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="mt-6 space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-border/60 bg-background/50 rounded-2xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-foreground text-xs font-bold">
                      {comment.authorName}
                    </span>{" "}
                    <span className="text-muted-foreground text-[11px]">
                      • {comment.authorRole}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-[11px]">
                    {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-foreground/90 mt-2 text-xs leading-relaxed sm:text-sm">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
          <div className="bg-background border-border w-full max-w-lg rounded-3xl border p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-lg font-bold">
                Report Story to Trust & Safety
              </h3>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            {reportSent ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
                <p className="text-foreground mt-3 text-sm font-bold">
                  Safety Report Logged
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <label className="text-foreground block text-xs font-bold">
                    Policy Category
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border px-3 py-2.5 text-xs outline-none"
                  >
                    {STORY_REPORT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-foreground block text-xs font-bold">
                    Details
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="border-border bg-background text-foreground mt-1.5 w-full rounded-xl border p-3 text-xs outline-none"
                  />
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReportOpen(false)}
                    className="glass rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleSendReport}
                    className="bg-destructive text-destructive-foreground rounded-xl px-4 py-2 text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
