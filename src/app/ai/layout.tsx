import type { ReactNode } from "react";
import type { Metadata } from "next";

import { LandingBackground } from "@/components/landing";
import { siteConfig } from "@/constants";

export const metadata: Metadata = {
  title: `AI Legal Tutor — ${siteConfig.name}`,
  description:
    "Your AI-powered legal education companion. Ask questions about Indian law and get structured, situation-based guidance.",
};

export default function AILayout({ children }: { children: ReactNode }) {
  return (
    <>
      <LandingBackground />
      {children}
    </>
  );
}
