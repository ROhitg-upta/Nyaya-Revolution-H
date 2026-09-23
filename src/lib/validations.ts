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
export type ProfileValues = z.infer<typeof profileSchema>;

export const quizSubmissionSchema = z.object({
  journeySlug: z.string().min(1, "Journey slug is required"),
  lessonSlug: z.string().min(1, "Lesson slug is required"),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
  xpEarned: z.number().int().min(0),
  answers: z
    .array(
      z.object({
        questionIndex: z.number().int().min(0),
        selectedOption: z.number().int().min(0),
        isCorrect: z.boolean(),
      })
    )
    .optional()
    .default([]),
});

export const citizenStorySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title is too long"),
  category: z.string().min(2, "Category is required"),
  whatHappened: z.string().min(20, "Please provide more details on what happened (min 20 chars)").max(3000),
  actionTaken: z.string().min(10, "Please describe the action taken (min 10 chars)").max(2000),
  legalOutcome: z.string().min(10, "Please describe the legal outcome (min 10 chars)").max(2000),
  resolutionStatus: z.enum(["resolved", "ongoing", "mediated"]).default("resolved"),
  statutoryBacking: z.string().max(255).optional(),
});

export const progressUpdateSchema = z.object({
  journeySlug: z.string().min(1, "Journey slug is required"),
  lessonSlug: z.string().min(1, "Lesson slug is required"),
  completed: z.boolean(),
  timeSpentSeconds: z.number().int().min(0).default(0),
  quizScore: z.number().int().min(0).max(100).optional(),
});

export const bookmarkSchema = z.object({
  targetType: z.enum(["situation", "article", "case_study", "act", "glossary"]),
  targetSlug: z.string().min(1, "Target slug is required"),
  collectionId: z.string().uuid().optional(),
});

export const contentFeedbackSchema = z.object({
  contentType: z.enum(["situation", "article", "case_study", "lesson", "glossary"]),
  contentSlug: z.string().min(1, "Content slug is required"),
  feedbackType: z.enum(["helpful", "unclear", "outdated", "typo", "incorrect"]),
  comment: z.string().max(1000).optional(),
});

export type QuizSubmissionValues = z.infer<typeof quizSubmissionSchema>;
export type CitizenStoryValues = z.infer<typeof citizenStorySchema>;
export type ProgressUpdateValues = z.infer<typeof progressUpdateSchema>;
export type BookmarkValues = z.infer<typeof bookmarkSchema>;
export type ContentFeedbackValues = z.infer<typeof contentFeedbackSchema>;
