"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Filter,
  Flame,
  FolderKanban,
  Mic,
  PlusCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

import { reportCommunityContentAction } from "@/actions/community.actions";
import { CommunityStoryCard } from "@/components/community/community-story-card";
import { Container } from "@/components/layout";
import {
  COMMUNITY_CATEGORIES,
  CONTROLLED_COMMUNITY_TAGS,
  STORY_REPORT_REASONS,
  STORY_TYPES,
} from "@/constants/community";
import { routes } from "@/constants/routes";
import type {
  CommunityCategorySlug,
  CommunityFeedMode,
  CommunityStory,
  StoryType,
} from "@/types/community";

interface CommunityHubProps {
  initialStories: CommunityStory[];
}

export function CommunityHub({ initialStories }: CommunityHubProps) {
  const [feedMode, setFeedMode] = useState<CommunityFeedMode>("for_you");
  const [selectedCategory, setSelectedCategory] = useState<
    CommunityCategorySlug | "all"
  >("all");
  const [selectedStoryType, setSelectedStoryType] = useState<
    StoryType | "all"
  >("all");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [mediaOnly, setMediaOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Report modal state
  const [reportingStory, setReportingStory] = useState<CommunityStory | null>(
    null
  );
  const [reportReason, setReportReason] = useState<string>(
    STORY_REPORT_REASONS[0].id
  );
  const [reportDetails, setReportDetails] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredStories = useMemo(() => {
    let list = [...initialStories];

    if (selectedCategory !== "all") {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (selectedStoryType !== "all") {
      list = list.filter((s) => s.storyType === selectedStoryType);
    }

    if (selectedTag) {
      list = list.filter((s) =>
        s.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    if (mediaOnly) {
      list = list.filter((s) => s.media.length > 0);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.whatHappened.toLowerCase().includes(q) ||
          s.actionTaken.toLowerCase().includes(q) ||
          s.citizenTakeaway.toLowerCase().includes(q) ||
          s.statutoryBacking.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (feedMode === "latest") {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (feedMode === "most_helpful") {
      list.sort((a, b) => b.helpfulCount - a.helpfulCount);
    } else {
      list.sort((a, b) => {
        const scoreA = a.helpfulCount + (a.media.length > 0 ? 25 : 0);
        const scoreB = b.helpfulCount + (b.media.length > 0 ? 25 : 0);
        return scoreB - scoreA;
      });
    }

    return list;
  }, [
    initialStories,
    selectedCategory,
    selectedStoryType,
    selectedTag,
    mediaOnly,
    searchQuery,
    feedMode,
  ]);

  const handleSubmitReport = () => {
    if (!reportingStory) return;
    startTransition(async () => {
      await reportCommunityContentAction({
        contentType: "story",
        contentId: reportingStory.id,
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
      setReportSuccess(true);
      setTimeout(() => {
        setReportingStory(null);
        setReportSuccess(false);
        setReportDetails("");
      }, 1800);
    });
  };

  return (
    <Container size="default" gutter="page">
      {/* Hero Banner */}
      <div className="glass-strong border-border/70 relative overflow-hidden rounded-3xl border p-6 sm:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-brand/15 text-brand inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold">
                <Users className="size-3.5" />
                Community Voice & Story-to-Learning Network
              </span>
              <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
                <ShieldCheck className="size-3.5" />
                PII-Redacted & Linked to Verified Law
              </span>
            </div>

            <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A Citizen Shares What Happened. Another Citizen Learns What Rights
              Protect Them.
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
              Explore real-world Indian legal situations—complete with redacted
              documents, voice notes, and video walkthroughs—bridged directly to
              verified statutes, helplines, and interactive practice modules.
            </p>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              href={routes.communityShare}
              className="bg-gradient-brand text-primary-foreground inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-md transition hover:opacity-95"
            >
              <PlusCircle className="size-4" />
              Share Your Situation Story
            </Link>
            <Link
              href={routes.communityMyStories}
              className="glass text-foreground hover:border-brand/50 inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-xs font-bold transition"
            >
              <FolderKanban className="text-brand size-4" />
              Manage My Stories & Drafts
            </Link>
          </div>
        </div>

        {/* Non-Negotiable Authority Separation Legend */}
        <div className="border-border/60 bg-background/60 mt-6 grid gap-3 rounded-2xl border p-4 sm:grid-cols-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 size-2.5 shrink-0 rounded-full bg-amber-500" />
            <div>
              <p className="text-foreground text-xs font-bold">
                1. Community Story (Peer Experience)
              </p>
              <p className="text-muted-foreground text-[11px]">
                Personal account shared by a citizen (Real Name, Pseudonym, or
                Anonymous). Not official legal advice.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="bg-brand mt-0.5 size-2.5 shrink-0 rounded-full" />
            <div>
              <p className="text-foreground text-xs font-bold">
                2. AI Educational Summary
              </p>
              <p className="text-muted-foreground text-[11px]">
                Explicitly labeled synthesis highlighting key takeaways and
                privacy-safe context.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 size-2.5 shrink-0 rounded-full bg-emerald-500" />
            <div>
              <p className="text-foreground text-xs font-bold">
                3. Verified Legal Learning Bridge
              </p>
              <p className="text-muted-foreground text-[11px]">
                Connects every story to verified Indian Acts, BNSS/CPA sections,
                lessons, and practice scenarios.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Controls: Modes, Search, and Media Toggle */}
      <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* Feed Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              {
                id: "for_you",
                label: "Recommended For You",
                icon: Sparkles,
              },
              {
                id: "most_helpful",
                label: "Most Helpful",
                icon: Flame,
              },
              {
                id: "latest",
                label: "Latest Stories",
                icon: BookOpen,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = feedMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFeedMode(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  active
                    ? "bg-gradient-brand text-primary-foreground shadow-xs"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setMediaOnly((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
              mediaOnly
                ? "bg-brand/20 text-brand border-brand/40 border"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="size-3.5" />
            <Mic className="size-3.5" />
            With Media Only
          </button>
        </div>

        {/* Search Input */}
        <div className="glass-strong flex w-full items-center gap-2.5 rounded-2xl px-4 py-2 md:w-80">
          <Search className="text-brand size-4 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 1930, deposit, Zero FIR, refund..."
            className="text-foreground w-full bg-transparent text-xs outline-none sm:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X className="text-muted-foreground size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
            selectedCategory === "all"
              ? "bg-foreground text-background"
              : "glass text-muted-foreground hover:text-foreground"
          }`}
        >
          All Legal Areas ({initialStories.length})
        </button>
        {COMMUNITY_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedCategory === cat.slug
                ? "bg-brand text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.shortLabel}
          </button>
        ))}
      </div>

      {/* Story Type & Controlled Tag Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px] font-semibold">
          <Filter className="size-3" /> Story Type:
        </span>
        <button
          type="button"
          onClick={() => setSelectedStoryType("all")}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            selectedStoryType === "all"
              ? "bg-brand/15 text-brand font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {STORY_TYPES.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => setSelectedStoryType(st.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              selectedStoryType === st.id
                ? "bg-brand/15 text-brand font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {st.badgeText}
          </button>
        ))}

        {selectedTag && (
          <button
            type="button"
            onClick={() => setSelectedTag("")}
            className="bg-brand/15 text-brand inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          >
            Tag: #{selectedTag}
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Popular Tags Strip */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {CONTROLLED_COMMUNITY_TAGS.slice(0, 8).map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() =>
              setSelectedTag((prev) => (prev === tag ? "" : tag))
            }
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition ${
              selectedTag === tag
                ? "border-brand bg-brand/15 text-brand font-bold"
                : "border-border/60 bg-background/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Main Feed Grid */}
      {filteredStories.length === 0 ? (
        <div className="glass mt-10 rounded-3xl p-12 text-center">
          <p className="text-foreground text-base font-bold">
            No matching citizen stories found for the active filters.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Try clearing your filter or be the first citizen to share a story in
            this category.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedStoryType("all");
                setSelectedTag("");
                setMediaOnly(false);
                setSearchQuery("");
              }}
              className="glass rounded-full px-4 py-2 text-xs font-bold"
            >
              Reset All Filters
            </button>
            <Link
              href={routes.communityShare}
              className="bg-gradient-brand text-primary-foreground rounded-full px-4 py-2 text-xs font-bold"
            >
              Share a Story
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredStories.map((story) => (
            <CommunityStoryCard
              key={story.id}
              story={story}
              onReportRequest={(target) => setReportingStory(target)}
            />
          ))}
        </div>
      )}

      {/* Trust & Safety Report Modal */}
      {reportingStory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="bg-background border-border w-full max-w-lg rounded-3xl border p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-lg font-bold">
                Report Community Story for Trust & Safety Review
              </h3>
              <button
                type="button"
                onClick={() => setReportingStory(null)}
                className="text-muted-foreground hover:text-foreground rounded-full p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
                <p className="text-foreground mt-3 text-sm font-bold">
                  Report Logged with Trust & Safety Queue
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Our moderators review flagged stories for PII exposure,
                  defamation, and misleading legal claims.
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mt-2 text-xs">
                  Reporting:{" "}
                  <strong className="text-foreground">
                    {reportingStory.title}
                  </strong>
                </p>

                <div className="mt-4 space-y-2">
                  <label className="text-foreground block text-xs font-bold">
                    Select Policy Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="border-border bg-background text-foreground w-full rounded-xl border px-3 py-2.5 text-xs outline-none"
                  >
                    {STORY_REPORT_REASONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} — {r.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-foreground block text-xs font-bold">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Specify if personal phone numbers, Aadhaar, or misleading advice are present..."
                    className="border-border bg-background text-foreground w-full rounded-xl border p-3 text-xs outline-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportingStory(null)}
                    className="glass rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleSubmitReport}
                    className="bg-destructive text-destructive-foreground rounded-xl px-4 py-2 text-xs font-bold"
                  >
                    {isPending ? "Submitting..." : "Submit Safety Report"}
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
