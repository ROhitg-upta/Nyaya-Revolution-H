import type { Metadata } from "next";

import { ProfileProgress } from "@/components/learning";

export const metadata: Metadata = { title: "Your progress" };

export default function LearnProfilePage() {
  return <ProfileProgress />;
}
