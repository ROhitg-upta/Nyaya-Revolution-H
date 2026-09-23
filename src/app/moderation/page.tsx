import type { Metadata } from "next";
import { AppHeader } from "@/components/common/app-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ModerationDashboard } from "@/components/moderation/moderation-dashboard";
import { moderationService } from "@/services/db/moderation.service";

export const metadata: Metadata = {
  title: "Moderator Verification Queue · Nyaya Revolution",
  description:
    "Advocate and educator review queue for citizen-submitted legal situations, draft AI quizzes, and content verification audit logs.",
};

export default async function ModerationPage() {
  const [items, stats] = await Promise.all([
    moderationService.getModerationQueue(),
    moderationService.getModerationStats(),
  ]);

  return (
    <>
      <AppHeader />
      <main className="min-h-screen py-10">
        <ModerationDashboard initialItems={items} initialStats={stats} />
      </main>
      <LandingFooter />
    </>
  );
}
