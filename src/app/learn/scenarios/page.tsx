import type { Metadata } from "next";
import { AppHeader } from "@/components/common";
import { ScenariosList } from "@/components/scenarios";

export const metadata: Metadata = {
  title: "Interactive Scenario Simulator | Nyaya Revolution",
  description:
    "Test your legal decisions in realistic Indian citizen scenarios with immediate feedback, risk ratings, and statutory explanations.",
};

export default function ScenariosPage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-dvh">
        <ScenariosList />
      </main>
    </>
  );
}
