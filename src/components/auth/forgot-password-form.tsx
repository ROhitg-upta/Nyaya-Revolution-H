"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthCard } from "@/components/auth/auth-card";
import { TextField } from "@/components/auth/form-fields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { routes } from "@/constants";
import { ArrowLeft, KeyRound, Mail, MailCheck } from "@/lib/icons";
import { authService } from "@/services/auth";
import {
  type ForgotPasswordValues,
  forgotPasswordSchema,
} from "@/lib/validations";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordValues) {
    await authService.requestPasswordReset(values.email);
    setSentTo(values.email);
  }

  if (sentTo) {
    return (
      <AuthCard
        icon={MailCheck}
        title="Check your inbox"
        description={
          <>
            If an account exists for <strong>{sentTo}</strong>, we&apos;ve sent
            a link to reset your password.
          </>
        }
      >
        <a href={routes.signIn}>
          <Button
            variant="outline"
            size="lg"
            className="glass w-full rounded-xl"
          >
            <ArrowLeft />
            Back to sign in
          </Button>
        </a>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={KeyRound}
      title="Reset your password"
      description="Enter your email and we'll send you a reset link."
      footer={
        <a
          href={routes.signIn}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </a>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <TextField
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="glow-hover mt-2 rounded-xl"
        >
          {isSubmitting ? (
            <Spinner size="sm" label="Sending link" />
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
