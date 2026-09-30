import { Suspense } from "react";
import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { SearchView } from "@/components/search";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Universal Search — Nyaya Revolution",
  description:
    "Universal search across situations, laws, constitutional articles, case studies, lessons, citizen stories, and verified legal aid authorities.",
};

function SearchPageSkeleton() {
  return (
    <Container size="default" gutter="page" className="py-12 text-center">
      <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-muted/60" />
      <div className="mx-auto mt-4 h-12 w-3/4 max-w-xl animate-pulse rounded-2xl bg-muted/40" />
    </Container>
  );
}

export default function SearchPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <Suspense fallback={<SearchPageSkeleton />}>
          <SearchView />
        </Suspense>
      </main>
    </>
  );
}
