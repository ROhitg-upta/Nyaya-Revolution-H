/**
 * Learning Velocity & Realtime Analytics Domain Types.
 *
 * Models real-time citizen progress, domain mastery, and velocity across
 * the 7 Indian legal domains.
 */

export type AnalyticsTimeframe = "today" | "week" | "month" | "all";

export interface IndianLegalDomainVelocity {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "constitutional" | "criminal" | "cyber" | "consumer" | "housing" | "labour" | "traffic";
  activeLearners: number;
  completedScenarios: number;
  velocityScore: number; // percentage growth e.g. +38%
  passRate: number; // 0 to 100
  trend: "rising" | "stable" | "hotspot";
  hotspotConcept: string;
}

export type LearningEventType =
  | "practice_completed"
  | "quiz_passed"
  | "streak_milestone"
  | "situation_verified";

export interface RealtimeLearningEvent {
  id: string;
  userName: string;
  state: string;
  eventType: LearningEventType;
  title: string;
  xpEarned: number;
  timestamp: string;
}

export interface PlatformVelocitySummary {
  activeLearnersNow: number;
  scenariosCompletedToday: number;
  xpVelocityPerHour: number;
  groundingAccuracyRate: number;
  topDomain: string;
  lastUpdated: string;
}
