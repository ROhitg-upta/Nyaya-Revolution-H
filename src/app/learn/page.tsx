import type { Metadata } from "next";

import { LearningHome } from "@/components/learning";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Your personalized legal learning home — journeys, streaks, and progress.",
};

export default function LearnPage() {
  return <LearningHome />;
}
