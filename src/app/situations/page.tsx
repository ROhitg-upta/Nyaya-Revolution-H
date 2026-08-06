import type { Metadata } from "next";

import { SituationEngine } from "@/components/situations";

export const metadata: Metadata = {
  title: "Situations",
  description:
    "Start from a real-life situation and learn your legal rights and next steps.",
};

export default function SituationsPage() {
  return <SituationEngine />;
}
