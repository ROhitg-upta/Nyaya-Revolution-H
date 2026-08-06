"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { routes } from "@/constants";
import { CheckCircle2, MailOpen } from "@/lib/icons";
import { authService } from "@/services/auth";
import { useAuth } from "@/providers/auth-provider";

export function VerifyEmailView() {
  const router = useRouter();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleContinue() {
    setVerifying(true);
    const result = await authService.verifyEmail("mock-token");
    setVerifying(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    setVerified(true);
    setTimeout(() => router.push(routes.onboarding), 1200);
  }

  async function handleResend() {
    if (!user?.email) return;
    setResending(true);
    await authService.resendVerification(user.email);
    setResending(false);
    toast.success("Verification email sent again.");
  }

  if (verified) {
    return (
      <AuthCard
        icon={CheckCircle2}
        title="Email verified!"
        description="Taking you to your personalized onboarding…"
      >
        <div className="flex justify-center">
          <Spinner size="md" className="text-brand" label="Redirecting" />
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={MailOpen}
      title="Verify your email"
      description={
        <>
          We&apos;ve sent a verification link to{" "}
          <strong>{user?.email ?? "your email"}</strong>. Open it to confirm
          your account.
        </>
      }
      footer={
        <>
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-brand font-medium hover:underline disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend email"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={verifying}
          className="glow-hover rounded-xl"
        >
          {verifying ? (
            <Spinner size="sm" label="Verifying" />
          ) : (
            "I've verified my email"
          )}
        </Button>
        <p className="text-muted-foreground/70 text-center text-xs">
          Demo mode: no real email is sent — continue to preview onboarding.
        </p>
      </div>
    </AuthCard>
  );
}
