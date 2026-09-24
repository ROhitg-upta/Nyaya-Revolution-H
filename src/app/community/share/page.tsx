import type { Metadata } from "next";

import { AppHeader } from "@/components/common";
import { StoryCreationWizard } from "@/components/community/story-creation-wizard";

export const metadata: Metadata = {
  title: "Share Your Situation Story | Nyaya Community Voice",
  description:
    "Share a real-world Indian legal experience, warning sign, or resolution with redacted media and connect it to verified legal education.",
};

export default function CommunitySharePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 py-10">
        <StoryCreationWizard />
      </main>
    </div>
  );
}
