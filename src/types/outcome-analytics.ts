/**
 * ============================================================================
 * SPRINT E16 — VERIFIED OUTCOMES FEEDBACK LOOP & INSTITUTIONAL IMPACT ANALYTICS
 * ============================================================================
 * Strict privacy-preserving, denominator-transparent domain types for citizen
 * self-reported outcomes, longitudinal follow-up timelines, funnel metrics,
 * small-cell cohort suppression, and internal vs. public impact views.
 */

export type OutcomeStatusType =
  | 'not_started'
  | 'contacted'
  | 'awaiting_response'
  | 'received_response'
  | 'partially_addressed'
  | 'resolved'
  | 'still_ongoing'
  | 'could_not_proceed'
  | 'not_sure'
  | 'prefer_not_to_say';

export type ContactMethodType =
  | 'phone'
  | 'online_portal'
  | 'email'
  | 'in_person'
  | 'written_complaint'
  | 'legal_aid_office'
  | 'other'
  | 'prefer_not_to_say';

export type ResourceExperienceType =
  | 'found_resource'
  | 'could_not_reach'
  | 'received_response'
  | 'still_waiting'
  | 'do_not_know_yet';

export type ClaritySignalType =
  | 'much_clearer'
  | 'a_little_clearer'
  | 'about_the_same'
  | 'less_clear'
  | 'not_sure';

export type PreparationValueType =
  | 'very_helpful'
  | 'somewhat_helpful'
  | 'not_helpful'
  | 'not_used'
  | 'not_sure';

export type OutcomeEvidenceType = 'SELF_REPORTED' | 'PLATFORM_EVENT';

export type AnalyticsTimeWindow = '7d' | '30d' | '90d' | '6m' | '12m' | 'all';

export interface OutcomeTimelineEvent {
  id: string;
  feedbackId: string;
  previousStatus: OutcomeStatusType | null;
  newStatus: OutcomeStatusType;
  contactMethod: ContactMethodType;
  resourceExperience: ResourceExperienceType;
  recordedAt: string;
  noteSummary: string;
}

export interface CitizenOutcomeFeedbackRecord {
  id: string;
  caseId: string | null;
  userId: string | null;
  isAnonymous: boolean;
  issueCategory: string;
  stateCode: string;
  districtName: string | null;
  languageCode: string;
  outcomeStatus: OutcomeStatusType;
  contactMethod: ContactMethodType;
  resourceExperience: ResourceExperienceType;
  claritySignal: ClaritySignalType;
  preparationValue: PreparationValueType;
  verifiedResourceId: string | null;
  verifiedResourceType: string | null;
  optionalFeedbackText: string;
  containsPotentialPiiFlag: boolean;
  evidenceType: 'SELF_REPORTED';
  isDuplicateOrContradictoryFlag: boolean;
  consentAcknowledged: boolean;
  createdAt: string;
  updatedAt: string;
  timeline: OutcomeTimelineEvent[];
}

export interface SubmitCitizenOutcomeInput {
  existingFeedbackId?: string | null;
  caseId?: string | null;
  isAnonymous: boolean;
  issueCategory: string;
  stateCode: string;
  districtName?: string | null;
  languageCode: string;
  outcomeStatus: OutcomeStatusType;
  contactMethod: ContactMethodType;
  resourceExperience: ResourceExperienceType;
  claritySignal: ClaritySignalType;
  preparationValue: PreparationValueType;
  verifiedResourceId?: string | null;
  verifiedResourceType?: string | null;
  optionalFeedbackText?: string;
  consentAcknowledged: boolean;
}

/**
 * Every percentage metric must declare its numerator, denominator,
 * population definition, time window, and evidence source.
 */
export interface FunnelStageMetric {
  stageKey:
    | 'situation_started'
    | 'lesson_completed'
    | 'resource_viewed'
    | 'preparation_created'
    | 'case_prep_exported'
    | 'resource_contacted'
    | 'outcome_feedback_submitted';
  label: string;
  description: string;
  numerator: number;
  denominator: number;
  percentage: number;
  populationLabel: string;
  period: AnalyticsTimeWindow;
  evidenceSource: OutcomeEvidenceType;
  honestInterpretation: string;
}

export interface OutcomeStatusDistributionItem {
  status: OutcomeStatusType;
  label: string;
  count: number;
  denominator: number;
  percentage: number;
  isSuppressedByCohortThreshold: boolean;
}

export interface CategoryOutcomeBreakdown {
  categoryKey: string;
  categoryLabel: string;
  totalSessionsStarted: number;
  totalCasePrepsCreated: number;
  totalRespondents: number;
  isSuppressedByCohortThreshold: boolean;
  suppressionReason?: string;
  reportedClearerCount: number;
  reportedClearerPct: number | null;
  reportedContactedCount: number;
  reportedContactedPct: number | null;
  reportedAddressedOrResolvedCount: number;
  reportedAddressedOrResolvedPct: number | null;
  topContactMethod: string | null;
}

export interface ResourceAccessibilitySummary {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  stateName: string;
  totalFeedbackCount: number;
  isSuppressedByCohortThreshold: boolean;
  foundResourceCount: number;
  receivedResponseCount: number;
  couldNotReachCount: number;
  stillWaitingCount: number;
  descriptiveAccessibilityNote: string;
  governanceReviewSuggested: boolean;
}

export interface QualitativeThemeCluster {
  themeId: string;
  themeTitle: string;
  categoryScope: string;
  mentionCount: number;
  groundingNote: string;
  neutralSummary: string;
  suggestedPlatformImprovement: string;
}

export interface InstitutionalImpactDashboardSnapshot {
  generatedAt: string;
  period: AnalyticsTimeWindow;
  periodLabel: string;
  minCohortThreshold: number;
  methodologyBanner: string;
  totalAnonymousCheckIns: number;
  totalAuthenticatedCheckIns: number;
  totalValidRespondents: number;
  flaggedAnomalyCount: number;
  clarityHeadline: {
    numerator: number;
    denominator: number;
    percentage: number;
    honestStatement: string;
  };
  preparationHelpfulnessHeadline: {
    numerator: number;
    denominator: number;
    percentage: number;
    honestStatement: string;
  };
  nextStepActionHeadline: {
    numerator: number;
    denominator: number;
    percentage: number;
    honestStatement: string;
  };
  funnelStages: FunnelStageMetric[];
  outcomeDistribution: OutcomeStatusDistributionItem[];
  categoryBreakdowns: CategoryOutcomeBreakdown[];
  resourceAccessibilitySignals: ResourceAccessibilitySummary[];
  qualitativeThemes: QualitativeThemeCluster[];
  languageDistribution: Array<{
    languageCode: string;
    languageLabel: string;
    respondentCount: number;
    percentage: number;
    isSuppressed: boolean;
  }>;
}

export interface PublicImpactSummary {
  generatedAt: string;
  period: AnalyticsTimeWindow;
  periodLabel: string;
  minPublicCohortThreshold: number;
  methodologyDisclaimer: string;
  aggregateMetrics: Array<{
    id: string;
    title: string;
    valueDisplay: string;
    numerator: number;
    denominator: number;
    populationDescription: string;
    evidenceType: OutcomeEvidenceType;
    isSuppressed: boolean;
  }>;
  safeCategorySummaries: Array<{
    categoryLabel: string;
    totalRespondents: number;
    isSuppressed: boolean;
    summaryStatement: string;
  }>;
}
