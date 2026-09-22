import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { CaseStudiesList } from "@/components/laws";

export const metadata: Metadata = {
  title: "Landmark Case Studies | Nyaya Revolution",
  description:
    "Explore verified Supreme Court precedents, judicial guidelines, and citizen takeaways on fundamental rights, police arrest procedures, and digital privacy.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <CaseStudiesList />
      </main>
    </>
  );
}
