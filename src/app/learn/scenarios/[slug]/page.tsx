import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/common";
import { ScenarioSimulator } from "@/components/scenarios";
import { getScenario, scenarioSimulations } from "@/constants";

interface ScenarioPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return scenarioSimulations.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({
  params,
}: ScenarioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) return { title: "Scenario Not Found | Nyaya Revolution" };

  return {
    title: `${scenario.title} — Scenario Simulator | Nyaya Revolution`,
    description: scenario.tagline,
  };
}

export default async function ScenarioDetailPage({
  params,
}: ScenarioPageProps) {
  const { slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) notFound();

  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <ScenarioSimulator scenario={scenario} />
      </main>
    </>
  );
}
