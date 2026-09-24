"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Eye,
  FileCheck2,
  PlusCircle,
  Trash2,
} from "lucide-react";

import { deleteCommunityStoryAction } from "@/actions/community.actions";
import { StoryCreationWizard } from "@/components/community/story-creation-wizard";
import { Container } from "@/components/layout";
import { communityStoryRoute, routes } from "@/constants/routes";
import { deleteStoryMediaFiles } from "@/services/storage/media-storage.service";
import type {
  CommunityStory,
  StoryModerationStatus,
} from "@/types/community";

interface MyStoriesViewProps {
  initialStories: CommunityStory[];
}

export function MyStoriesView({ initialStories }: MyStoriesViewProps) {
  const [stories, setStories] = useState<CommunityStory[]>(initialStories);
  const [statusFilter, setStatusFilter] = useState<
    StoryModerationStatus | "all"
  >("all");
  const [editingStory, setEditingStory] = useState<CommunityStory | null>(null);
  const [isPending, startTransition] = useTransition();

  if (editingStory) {
    return (
      <div>
        <Container size="default" gutter="page">
          <button
            type="button"
            onClick={() => setEditingStory(null)}
            className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold"
          >
            <ArrowLeft className="size-3.5" />
            Cancel Editing & Return to My Stories
          </button>
        </Container>
        <StoryCreationWizard initialStory={editingStory} />
      </div>
    );
  }

  const filtered =
    statusFilter === "all"
      ? stories
      : stories.filter((s) => s.moderationStatus === statusFilter);

  const handleDelete = (story: CommunityStory) => {
    startTransition(async () => {
      const res = await deleteCommunityStoryAction(story.id);
      if (res.success) {
        if (res.data.mediaPaths.length > 0) {
          await deleteStoryMediaFiles(res.data.mediaPaths);
        }
        setStories((prev) => prev.filter((s) => s.id !== story.id));
      }
    });
  };

  return (
    <Container size="default" gutter="page">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href={routes.community}
              className="text-brand inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Back to Community Hub
            </Link>
            <h1 className="text-foreground mt-2 text-2xl font-bold sm:text-3xl">
              My Citizen Stories, Drafts & Moderation Status
            </h1>
            <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
              Manage your published experiences, private drafts, media
              attachments, and privacy settings.
            </p>
          </div>

          <Link
            href={routes.communityShare}
            className="bg-gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold shadow-sm"
          >
            <PlusCircle className="size-4" />
            Create New Story
          </Link>
        </div>

        {/* Lifecycle Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "All Stories" },
              { id: "published", label: "Published" },
              { id: "draft", label: "Private Drafts" },
              { id: "under_review", label: "Under Review" },
              { id: "needs_edit", label: "Needs Edit" },
              { id: "rejected", label: "Rejected" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                statusFilter === tab.id
                  ? "bg-brand text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stories List */}
        {filtered.length === 0 ? (
          <div className="glass mt-8 rounded-3xl p-12 text-center">
            <FileCheck2 className="text-brand mx-auto size-10 opacity-60" />
            <p className="text-foreground mt-3 text-sm font-bold">
              No stories in this status view yet.
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Share a situation you navigated or save a private draft to build
              your personal record.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((story) => (
              <div
                key={story.id}
                className="glass-strong border-border/70 flex flex-col justify-between gap-4 rounded-3xl border p-6 sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-brand/15 text-brand rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase">
                      {story.moderationStatus}
                    </span>
                    <span className="border-border/70 text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase">
                      Visibility: {story.visibility}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      • {story.categoryLabel} • {story.media.length} media
                      attachment(s)
                    </span>
                  </div>

                  <h3 className="text-foreground text-base font-bold sm:text-lg">
                    {story.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {story.whatHappened}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={communityStoryRoute(story.slug)}
                    className="glass inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold"
                  >
                    <Eye className="size-3.5" />
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEditingStory(story)}
                    className="glass inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold"
                  >
                    <Edit3 className="text-brand size-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(story)}
                    className="text-destructive hover:bg-destructive/10 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
