"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthCard } from "@/components/auth/auth-card";
import { PasswordField, TextField } from "@/components/auth/form-fields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { routes } from "@/constants";
import { AlertTriangle, Lock, Mail, User, UserPlus } from "@/lib/icons";
import { type SignUpValues, signUpSchema } from "@/lib/validations";
import { useAuth } from "@/providers/auth-provider";

export function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpValues) {
    setFormError(null);
    const result = await signUp(values);
    if (result.error) {
      setFormError(result.error.message);
      return;
    }
    toast.success("Account created — let's verify your email.");
    router.push(routes.verifyEmail);
  }

  return (
    <AuthCard
      icon={UserPlus}
      title="Create your account"
      description="Start understanding your rights in minutes."
      footer={
        <>
          Already have an account?{" "}
          <a
            href={routes.signIn}
            className="text-brand font-medium hover:underline"
          >
            Sign in
          </a>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {formError ? (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm"
          >
            <AlertTriangle className="size-4 shrink-0" />
            {formError}
          </div>
        ) : null}

        <TextField
          label="Full name"
          icon={User}
          placeholder="Your name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordField
          label="Password"
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="glow-hover mt-2 rounded-xl"
        >
          {isSubmitting ? (
            <Spinner size="sm" label="Creating account" />
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-muted-foreground/80 text-center text-xs leading-relaxed">
          By continuing you agree to our Terms and acknowledge our Privacy
          Policy. Educational content only — not legal advice.
        </p>
      </form>
    </AuthCard>
  );
}
