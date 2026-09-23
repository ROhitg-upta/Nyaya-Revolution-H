import type { Metadata } from "next";

import { WelcomeView } from "@/components/auth";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Welcome" };

export default function WelcomePage() {
  return (
    <AuthShell>
      <WelcomeView />
    </AuthShell>
  );
}
