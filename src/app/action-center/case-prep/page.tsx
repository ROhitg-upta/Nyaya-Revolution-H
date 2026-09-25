import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/common/app-header";
import { LandingFooter } from "@/components/landing/landing-footer";
import { CasePrepWorkspaceClient } from "@/components/action/case-prep-workspace-client";
import {
  DEFAULT_AUTHORIZED_CITIZEN_ID,
  getWorkspaceForUser,
} from "@/services/action/case-prep-workspace.service";
import { listWorkspaceHandoffs } from "@/services/action/case-prep-handoff.service";
import { getGovernedPublishedAuthorities } from "@/services/governance/authority-governance.service";

export const metadata: Metadata = {
  title:
    "Citizen Case Preparation Workspace, Assisted Clinic Handoff & Bilingual Dossier · Nyaya Revolution",
  description:
    "Private Citizen Case Preparation Workspace with Assisted Para-Legal Clinic Mode, expiring SHA-256 hashed read-only handoff tokens, offline IndexedDB drafting, and bilingual A4 preparation dossiers.",
};

export default async function CitizenCasePrepPage() {
  const { workspace, completion, piiDetections } = getWorkspaceForUser({
    requestingUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
  });
  const { sessions, events } = listWorkspaceHandoffs({
    workspaceId: workspace.id,
    requestingUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
  });
  const availableAuthorities = getGovernedPublishedAuthorities();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="print:hidden">
        <AppHeader />
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 print:max-w-none print:p-0">
        <div className="mb-4 print:hidden">
          <Link
            href="/action-center"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Multilingual Voice & Citizen Action Engine
          </Link>
        </div>

        <CasePrepWorkspaceClient
          initialWorkspace={workspace}
          initialCompletion={completion}
          initialPiiDetections={piiDetections}
          availableAuthorities={availableAuthorities}
          initialHandoffSessions={sessions}
          initialHandoffEvents={events}
        />
      </main>

      <div className="print:hidden">
        <LandingFooter />
      </div>
    </div>
  );
}
