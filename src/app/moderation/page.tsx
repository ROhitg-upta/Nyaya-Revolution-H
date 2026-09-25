import type { Metadata } from "next";
import { AppHeader } from "@/components/common/app-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AuthorityGovernanceConsole } from "@/components/moderation/authority-governance-console";
import { ModerationDashboard } from "@/components/moderation/moderation-dashboard";
import { moderationService } from "@/services/db/moderation.service";
import {
  getVerificationHealthStats,
  listGovernedAuthorities,
  listImportBatches,
  listModeratorNotifications,
  listOpenAuthorityConflicts,
  listSourceHealthChecks,
} from "@/services/governance/authority-governance.service";

export const metadata: Metadata = {
  title: "Moderator Authority Ingestion & Verification Console · Nyaya Revolution",
  description:
    "Internal governance console for NALSA/SLSA/DLSA authority ingestion, side-by-side conflict resolution, immutable version history, source freshness monitoring, and citizen content verification.",
};

export default async function ModerationPage() {
  const [items, stats] = await Promise.all([
    moderationService.getModerationQueue(),
    moderationService.getModerationStats(),
  ]);

  const governanceStats = getVerificationHealthStats();
  const governedAuthorities = listGovernedAuthorities();
  const openConflicts = listOpenAuthorityConflicts();
  const importBatches = listImportBatches();
  const healthChecks = listSourceHealthChecks();
  const notifications = listModeratorNotifications();

  return (
    <>
      <AppHeader />
      <main className="min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <AuthorityGovernanceConsole
            initialStats={governanceStats}
            initialAuthorities={governedAuthorities}
            initialConflicts={openConflicts}
            initialBatches={importBatches}
            initialHealthChecks={healthChecks}
            initialNotifications={notifications}
          />
          <ModerationDashboard initialItems={items} initialStats={stats} />
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
