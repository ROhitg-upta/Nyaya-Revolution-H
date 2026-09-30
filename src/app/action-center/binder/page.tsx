import type { Metadata } from "next";
import { AppHeader } from "@/components/common/app-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { CaseBinderDashboard } from "@/components/action/case-binder-dashboard";
import {
  getAvailableWorkspacesAction,
  getBinderMasterTimelineAction,
  getBinderStatusMatrixAction,
  getOrCreateDefaultBinderAction,
} from "@/actions/case-binder.actions";

export const metadata: Metadata = {
  title: "Citizen Case Binder & Linked Grievances · Nyaya Revolution",
  description:
    "Organize multiple related preparation workspaces, multi-docket reference numbers, master chronological timelines, and bilingual procedural document packs.",
};

export default async function CaseBinderPage() {
  const defaultBinder = await getOrCreateDefaultBinderAction();
  const timeline = await getBinderMasterTimelineAction(defaultBinder.id);
  const statusMatrix = await getBinderStatusMatrixAction(defaultBinder.id);
  const availableWorkspaces = await getAvailableWorkspacesAction();

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
        <div className="mx-auto max-w-7xl">
          <CaseBinderDashboard
            initialBinder={defaultBinder}
            initialTimeline={timeline}
            initialStatusMatrix={statusMatrix}
            availableWorkspaces={availableWorkspaces}
          />
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
