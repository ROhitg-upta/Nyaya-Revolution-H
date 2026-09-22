import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { LawLibrary } from "@/components/laws";

export const metadata: Metadata = {
  title: "Law Library — Understand the Constitution & Acts",
  description:
    "Explore verified Indian Constitutional Articles, statutory provisions, and landmark Supreme Court precedents explained in plain language.",
};

export default function LawsPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <LawLibrary />
      </main>
    </>
  );
}
