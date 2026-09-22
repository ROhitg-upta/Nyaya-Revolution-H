import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { KnowledgeDashboard } from "@/components/learning/knowledge-dashboard";

export const metadata: Metadata = {
  title: "My Legal Knowledge | Nyaya Revolution",
  description:
    "Track your educational legal knowledge progress, domain mastery, quiz accuracy, and targeted revision recommendations.",
};

export default function KnowledgePage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <KnowledgeDashboard />
      </main>
    </>
  );
}
