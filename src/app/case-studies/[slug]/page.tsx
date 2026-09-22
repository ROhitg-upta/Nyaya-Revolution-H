import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/common";
import { CaseStudyReader } from "@/components/laws";
import { caseStudies, getCaseStudy } from "@/constants";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Case Study Not Found | Nyaya Revolution" };

  return {
    title: `${cs.title} (${cs.year}) — Precedents | Nyaya Revolution`,
    description: cs.verifiedOutcome,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyPageProps) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <CaseStudyReader caseStudy={cs} />
      </main>
    </>
  );
}
