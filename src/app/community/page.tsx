import type { Metadata } from "next";

import { AppHeader } from "@/components/common";
import { CommunityHub } from "@/components/community/community-hub";
import { communityService } from "@/services/db/community.service";

export const metadata: Metadata = {
  title: "Community Voice & Citizen Stories | Nyaya Revolution",
  description:
    "Explore real-world Indian legal situations shared by citizens, complete with redacted evidence, voice notes, video walkthroughs, and verified statutory learning bridges.",
};

export default async function CommunityPage() {
  const stories = await communityService.getCommunityFeed({
    mode: "for_you",
    category: "all",
  });

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-10">
        <CommunityHub initialStories={stories} />
      </main>
    </div>
  );
}
