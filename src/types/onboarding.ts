/**
 * Onboarding domain types. The wizard collects a partial `OnboardingData`
 * across steps; only the final object is persisted (locally for now).
 */

export type AgeGroup = "under-18" | "18-24" | "25-34" | "35-49" | "50-plus";

export type LanguagePreference = "en" | "hi" | "bilingual";

export type Occupation =
  | "student"
  | "working-professional"
  | "business-owner"
  | "freelancer"
  | "homemaker"
  | "senior-citizen"
  | "other";

export type InterestId =
  | "traffic"
  | "cyber-safety"
  | "consumer"
  | "women"
  | "employment"
  | "tenant"
  | "constitution"
  | "govt-services"
  | "digital-privacy"
  | "financial-fraud";

export type LearningGoal =
  | "know-rights"
  | "competitive-exams"
  | "practical-laws"
  | "protect-family"
  | "legally-aware";

export interface OnboardingData {
  name: string;
  ageGroup: AgeGroup | null;
  language: LanguagePreference | null;
  occupation: Occupation | null;
  interests: InterestId[];
  goal: LearningGoal | null;
}

export const emptyOnboardingData: OnboardingData = {
  name: "",
  ageGroup: null,
  language: null,
  occupation: null,
  interests: [],
  goal: null,
};
