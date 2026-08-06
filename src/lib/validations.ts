/**
 * Shared zod schemas + inferred types for form validation.
 * Used by react-hook-form resolvers across the auth screens.
 */
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[a-zA-Z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email."),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
