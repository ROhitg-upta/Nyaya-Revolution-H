"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthCard } from "@/components/auth/auth-card";
import { PasswordField, TextField } from "@/components/auth/form-fields";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants";
import { AlertTriangle, Lock, LogIn, Mail } from "@/lib/icons";
import { useAuth } from "@/providers/auth-provider";
import { type SignInValues, signInSchema } from "@/lib/validations";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInValues) {
    setFormError(null);
    const result = await signIn(values);
    if (result.error) {
      setFormError(result.error.message);
      return;
    }
    toast.success("Welcome back!");
    router.push(routes.home);
  }

  return (
    <AuthCard
      icon={LogIn}
      title="Welcome back"
      description="Sign in to continue your legal journey."
      footer={
        <>
          New to Nyaya Revolution?{" "}
          <a
            href={routes.signUp}
            className="text-brand font-medium hover:underline"
          >
            Create an account
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
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="flex flex-col gap-1.5">
          <PasswordField
            label="Password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <a
            href={routes.forgotPassword}
            className="text-muted-foreground hover:text-foreground self-end text-xs"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="glow-hover mt-2 rounded-xl"
        >
          {isSubmitting ? <Spinner size="sm" label="Signing in" /> : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
