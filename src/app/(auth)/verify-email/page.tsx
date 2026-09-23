import type { Metadata } from "next";

import { VerifyEmailView } from "@/components/auth";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Verify email" };

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <VerifyEmailView />
    </AuthShell>
  );
}
