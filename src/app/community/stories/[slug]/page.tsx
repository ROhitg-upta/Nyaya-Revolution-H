import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/common";
import { StoryDetailView } from "@/components/community/story-detail-view";
import { INITIAL_COMMUNITY_STORIES } from "@/constants/community";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { communityService } from "@/services/db/community.service";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_COMMUNITY_STORIES.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await communityService.getStoryBySlugOrId(slug);

  if (!story) {
    return {
      title: "Citizen Story Not Found | Nyaya Revolution",
    };
  }

  return {
    title: `${story.title} | Nyaya Community Voice`,
    description: story.aiSummary || story.citizenTakeaway,
  };
}

export default async function CommunityStoryDetailPage({
  params,
}: StoryPageProps) {
  const { slug } = await params;

  let viewerId: string | undefined;
  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      viewerId = user?.id;
    }
  } catch {
    viewerId = undefined;
  }

  const story = await communityService.getStoryBySlugOrId(slug, viewerId);
  if (!story) {
    notFound();
  }

  const comments = await communityService.getStoryComments(story.id);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-10">
        <StoryDetailView story={story} initialComments={comments} />
      </main>
    </div>
  );
}
