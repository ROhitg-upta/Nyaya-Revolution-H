import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { GlossaryView } from "@/components/glossary";

export const metadata: Metadata = {
  title: "Citizen Legal Glossary — Indian Law Terms Explained Simply",
  description:
    "Plain-English legal glossary explaining terms like Zero FIR, Cognizable Offence, Injunction, Bail, and Lok Adalat with real examples.",
};

export default function GlossaryPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <GlossaryView />
      </main>
    </>
  );
}
