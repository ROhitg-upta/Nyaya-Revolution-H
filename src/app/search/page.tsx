import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { SearchView } from "@/components/search";

export const metadata: Metadata = {
  title: "Unified Search — Nyaya Revolution",
  description:
    "Search across situations, laws, constitutional articles, case studies, lessons, and the legal glossary.",
};

export default function SearchPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <SearchView />
      </main>
    </>
  );
}
