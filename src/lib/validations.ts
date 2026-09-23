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

export const aiQuerySchema = z.object({
  query: z.string().min(2, "Query must be at least 2 characters").max(1500, "Query cannot exceed 1500 characters"),
  responseMode: z.enum(["eli15", "detailed", "legal", "summary", "step-by-step"]).default("eli15"),
  situationSlug: z.string().optional(),
  journeySlug: z.string().optional(),
  lessonSlug: z.string().optional(),
});

export const aiSourceReferenceSchema = z.object({
  id: z.string(),
  type: z.enum(["article", "situation", "case_study", "act", "lesson", "glossary"]),
  title: z.string(),
  citationOrSection: z.string().optional(),
  publisher: z.string().optional(),
  url: z.string().optional(),
  verificationStatus: z.enum(["verified", "published"]).default("verified"),
  relevanceScore: z.number().optional(),
});

export const aiLearningResponseSchema = z.object({
  summary: z.string().min(5),
  explanation: z.string().optional(),
  keyPoints: z.array(z.string()).optional().default([]),
  relevantConcepts: z.array(z.string()).optional().default([]),
  suggestedLessons: z
    .array(
      z.object({
        title: z.string(),
        journeySlug: z.string(),
        lessonSlug: z.string(),
      })
    )
    .optional()
    .default([]),
  possibleNextSteps: z.array(z.string()).optional().default([]),
  thingsToKeepInMind: z.array(z.string()).optional().default([]),
  practiceQuestion: z
    .object({
      question: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number().int().min(0),
      explanation: z.string(),
      xp: z.number().int().optional().default(25),
    })
    .optional(),
  sources: z.array(aiSourceReferenceSchema).default([]),
  educationalNotice: z.string().optional(),
  isSensitive: z.boolean().optional().default(false),
  professionalHelpRecommended: z.boolean().optional().default(false),
});

export const explainConceptSchema = z.object({
  conceptOrSlug: z.string().min(2),
  detailLevel: z.enum(["beginner", "intermediate", "deep_dive"]).default("beginner"),
});

export const simplifyLessonSchema = z.object({
  journeySlug: z.string().min(1),
  lessonSlug: z.string().min(1),
  targetLevel: z.enum(["citizen_basic", "student", "practical"]).default("citizen_basic"),
});

export const generateScenarioSchema = z.object({
  conceptSlug: z.string().min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
});

export const practiceCompletionSchema = z.object({
  scenarioId: z.string().min(1, "Scenario ID is required"),
  conceptName: z.string().min(1, "Concept name is required"),
  score: z.number().int().min(0),
  maxScore: z.number().int().min(1),
  isCorrect: z.boolean(),
  xpEarned: z.number().int().min(0).default(25),
});

export const situationSubmissionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters"),
  categoryId: z.string().min(1, "Legal category is required"),
  summary: z
    .string()
    .min(20, "Summary must be at least 20 characters")
    .max(500, "Summary cannot exceed 500 characters"),
  whatHappened: z
    .string()
    .min(20, "Please describe what happened in at least 20 characters")
    .max(3000, "Description cannot exceed 3000 characters"),
  immediateActions: z
    .array(z.string().min(2))
    .min(1, "Provide at least one recommended immediate action"),
  dontDo: z
    .array(z.string().min(2))
    .min(1, "Provide at least one mistake or caution to avoid"),
  statutoryReference: z.string().max(200).optional(),
});

export const moderationActionSchema = z.object({
  entityType: z.enum(["situation", "quiz", "story", "report"]),
  entityId: z.string().min(1, "Entity ID is required"),
  decision: z.enum(["approve", "reject", "revise"]),
  reviewNotes: z.string().max(1000).optional(),
  revisedData: z.record(z.string(), z.unknown()).optional(),
});

export type AIQueryValues = z.infer<typeof aiQuerySchema>;
export type AILearningResponseValues = z.infer<typeof aiLearningResponseSchema>;
export type ExplainConceptValues = z.infer<typeof explainConceptSchema>;
export type SimplifyLessonValues = z.infer<typeof simplifyLessonSchema>;
export type GenerateScenarioValues = z.infer<typeof generateScenarioSchema>;
export type PracticeCompletionValues = z.infer<typeof practiceCompletionSchema>;
export type SituationSubmissionValues = z.infer<typeof situationSubmissionSchema>;
export type ModerationActionValues = z.infer<typeof moderationActionSchema>;

