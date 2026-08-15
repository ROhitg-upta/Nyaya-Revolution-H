import { AppHeader } from "@/components/common";
import { AIHome } from "@/components/ai";

export default function AIPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <AIHome />
      </main>
    </>
  );
}
