import { AppHeader } from "@/components/common";
import { BookmarksView } from "@/components/ai";

export default function BookmarksPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <BookmarksView />
      </main>
    </>
  );
}
