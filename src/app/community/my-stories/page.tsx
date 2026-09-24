import type { Metadata } from "next";

import { AppHeader } from "@/components/common";
import { MyStoriesView } from "@/components/community/my-stories-view";
import { INITIAL_COMMUNITY_STORIES } from "@/constants/community";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { communityService } from "@/services/db/community.service";

export const metadata: Metadata = {
  title: "My Citizen Stories & Drafts | Nyaya Community Voice",
  description:
    "Manage your published stories, private drafts, media attachments, and moderation status.",
};

export default async function MyStoriesPage() {
  let userId: string | undefined;
  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id;
    }
  } catch {
    userId = undefined;
  }

  const userStories = await communityService.getUserOwnStories(userId);
  const displayStories =
    userStories.length > 0 ? userStories : INITIAL_COMMUNITY_STORIES.slice(0, 2);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-10">
        <MyStoriesView initialStories={displayStories} />
      </main>
    </div>
  );
}
