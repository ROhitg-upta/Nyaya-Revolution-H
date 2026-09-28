/**
 * ============================================================================
 * SPRINT E17 — CLOSED-LOOP AUTHORITY SELF-HEALING, PROCEDURAL ESCALATION
 *              WINDOWS & CITIZEN FOLLOW-UP ENGINE TYPES
 * ============================================================================
 */

export type AuthorityFreshnessAlertStatus =
  | 'open'
  | 'in_review'
  | 'resolved_updated'
  | 'dismissed_verified';

export interface AuthorityFreshnessAlertRecord {
  id: string;
  authorityId: string;
  authorityName: string;
  authorityType: string;
  stateCode: string;
  triggerReason: string;
  unreachedReportCount: number;
  totalWindowReports: number;
  windowDays: number;
  priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL' | 'SCHEDULED_STALENESS_CHECK';
  status: AuthorityFreshnessAlertStatus;
  currentVersionNumber: number;
  resolvedByVersion: number | null;
  verifiedFallbackChannel: string;
  verifiedFallbackUrl: string;
  citizenNoticeMessage: string;
  moderatorResolutionNote: string | null;
  officialSourceUrl: string;
  createdAt: string;
  resolvedAt: string | null;
}

export type ProceduralPathwayKey =
  | 'rti_act_s7'
  | 'cyber_fraud_1930'
  | 'consumer_helpline_1915'
  | 'labour_samadhan_wages'
  | 'dlsa_prelitigation_clinic';

export type FollowupProgressStatus =
  | 'awaiting_within_window'
  | 'window_elapsed_escalation_ready'
  | 'acknowledgment_received'
  | 'followup_submitted'
  | 'resolved_closed';

export interface StatutoryProceduralWindowSpec {
  pathwayKey: ProceduralPathwayKey;
  pathwayTitle: string;
  pathwayTitleHi: string;
  statutoryOrRuleCitation: string;
  standardWindowDays: number;
  urgentNote?: string;
  initialFilingChannel: string;
  escalationAuthorityTitle: string;
  escalationAuthorityTitleHi: string;
  escalationProcedureSummary: string;
  requiredFollowupDocuments: string[];
  educationalSafetyNotice: string;
}

export interface CitizenProceduralFollowupRecord {
  id: string;
  caseId: string;
  userId: string | null;
  pathwayKey: ProceduralPathwayKey;
  pathwayTitle: string;
  docketOrDiaryRef: string;
  authorityContactedName: string;
  contactChannelUsed: string;
  contactedAt: string;
  targetWindowDays: number;
  elapsedDays: number;
  remainingDays: number;
  isWindowElapsed: boolean;
  reminderIntervalDays: 7 | 15 | 30;
  followupStatus: FollowupProgressStatus;
  summaryOfResponse: string;
  addendumTextEn: string;
  addendumTextHi: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveCitizenFollowupInput {
  existingFollowupId?: string | null;
  caseId: string;
  pathwayKey: ProceduralPathwayKey;
  docketOrDiaryRef: string;
  authorityContactedName: string;
  contactChannelUsed: string;
  contactedAt: string;
  reminderIntervalDays: 7 | 15 | 30;
  followupStatus: FollowupProgressStatus;
  summaryOfResponse?: string;
}

export interface ResolveAuthorityFreshnessAlertInput {
  alertId: string;
  resolutionAction: 'publish_updated_version' | 'mark_verified_dismiss';
  updatedContactSummary: string;
  officialSourceUrl: string;
}

export const STATUTORY_PROCEDURAL_WINDOWS_CATALOG: Record<
  ProceduralPathwayKey,
  StatutoryProceduralWindowSpec
> = {
  rti_act_s7: {
    pathwayKey: 'rti_act_s7',
    pathwayTitle: 'Right to Information (RTI) Application — Section 7(1) Window',
    pathwayTitleHi: 'सूचना का अधिकार (RTI) आवेदन — धारा 7(1) समय-सीमा',
    statutoryOrRuleCitation:
      'Section 7(1) & Section 19(1), Right to Information Act, 2005',
    standardWindowDays: 30,
    urgentNote:
      'Proviso to Section 7(1): 48 hours where information sought concerns the life or liberty of a person.',
    initialFilingChannel: 'Public Information Officer (PIO) / rtionline.gov.in',
    escalationAuthorityTitle:
      'First Appellate Authority (FAA) under Section 19(1)',
    escalationAuthorityTitleHi: 'प्रथम अपीलीय प्राधिकारी (धारा 19(1) के अंतर्गत)',
    escalationProcedureSummary:
      'If no reply is received within 30 days (deemed refusal under Section 7(2)) or if aggrieved by the decision, a First Appeal may be filed with the senior officer designated as First Appellate Authority within 30 days after the expiry of the initial 30-day period.',
    requiredFollowupDocuments: [
      'Copy of original RTI application as submitted',
      'Postal receipt / UPI fee receipt / rtionline.gov.in Registration Number',
      'Chronological Follow-Up Addendum noting expiry of 30 days without response',
    ],
    educationalSafetyNotice:
      'Procedural windows shown are general statutory reference timelines for educational organization. Exact limitation periods depend on postal transit and specific facts; consult a DLSA clinic or advocate.',
  },
  cyber_fraud_1930: {
    pathwayKey: 'cyber_fraud_1930',
    pathwayTitle: 'Cyber Financial Fraud (1930 / NCRP) — Nodal & FIR Follow-Up Window',
    pathwayTitleHi: 'साइबर वित्तीय धोखाधड़ी (1930 / NCRP) — नोडल एवं FIR फॉलो-अप विंडो',
    statutoryOrRuleCitation:
      'I4C National Cyber Crime Reporting Portal SOP & Section 173 BNSS, 2023',
    standardWindowDays: 14,
    urgentNote:
      'Golden Hour: Call 1930 immediately on discovery of unauthorized debit to trigger automated bank lien/hold.',
    initialFilingChannel: '1930 National Cyber Helpline & cybercrime.gov.in',
    escalationAuthorityTitle:
      'Jurisdictional Cyber Crime Police Station / Bank Nodal Grievance Officer',
    escalationAuthorityTitleHi:
      'क्षेत्रीय साइबर क्राइम पुलिस स्टेशन / बैंक नोडल शिकायत अधिकारी',
    escalationProcedureSummary:
      'After obtaining the 1930 NCRP 15-digit Acknowledgement Number, follow up with the assigned police station / cyber cell to convert the complaint into a formal FIR (or e-FIR) and provide the bank nodal officer with the Acknowledgement + UTR table to preserve or release held funds.',
    requiredFollowupDocuments: [
      '15-digit NCRP / 1930 Complaint Acknowledgement Number',
      'Bank account statement showing debit timestamp and 12-digit UTR number',
      'Copy of written intimation submitted to customer bank branch / nodal desk',
    ],
    educationalSafetyNotice:
      'Procedural windows shown are general administrative reference timelines. Bank freeze/lien release orders often require a formal police requisition or Magistrate order under BNSS.',
  },
  consumer_helpline_1915: {
    pathwayKey: 'consumer_helpline_1915',
    pathwayTitle: 'National Consumer Helpline (1915 / INGRAM) — Docket Resolution Window',
    pathwayTitleHi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन (1915 / INGRAM) — डॉकेट निवारण विंडो',
    statutoryOrRuleCitation:
      'NCH INGRAM Pre-Litigation Convergence Framework & Section 35, Consumer Protection Act, 2019',
    standardWindowDays: 30,
    initialFilingChannel: 'National Consumer Helpline (1915 / consumerhelpline.gov.in)',
    escalationAuthorityTitle:
      'e-Daakhil Portal (edaakhil.nic.in) / District Consumer Disputes Redressal Commission',
    escalationAuthorityTitleHi:
      'ई-दाखिल पोर्टल (edaakhil.nic.in) / जिला उपभोक्ता विवाद प्रतितोष आयोग',
    escalationProcedureSummary:
      'If the convergence partner company does not resolve the grievance within the 15-to-30 day NCH docket window, citizens can prepare a formal written notice and file a consumer complaint online via e-Daakhil with the District Commission.',
    requiredFollowupDocuments: [
      'NCH 1915 Grievance Docket Number & Company Response Log',
      'Tax Invoice / Payment Receipt / Warranty Card',
      'Chronological defect photos and prior email/chat correspondence',
    ],
    educationalSafetyNotice:
      'Procedural windows shown are general administrative reference timelines. Statutory limitation for filing a Consumer Commission complaint under Section 69 is generally 2 years from the cause of action.',
  },
  labour_samadhan_wages: {
    pathwayKey: 'labour_samadhan_wages',
    pathwayTitle: 'Unpaid Wages & Labour SAMADHAN — Conciliation Notice Window',
    pathwayTitleHi: 'बकाया वेतन एवं श्रम समाधान (SAMADHAN) — सुलह नोटिस विंडो',
    statutoryOrRuleCitation:
      'Payment of Wages Act, 1936 / Industrial Disputes Conciliation Procedure (samadhan.labour.gov.in)',
    standardWindowDays: 21,
    initialFilingChannel:
      'SAMADHAN Portal (samadhan.labour.gov.in) / Regional Labour Commissioner',
    escalationAuthorityTitle:
      'Authority under Payment of Wages Act / DLSA Labour Legal-Aid Clinic',
    escalationAuthorityTitleHi:
      'वेतन भुगतान अधिनियम प्राधिकारी / DLSA श्रम विधिक सहायता क्लिनिक',
    escalationProcedureSummary:
      'If the employer does not respond to the initial written demand or conciliation notice within 21 days, the citizen may visit the District Legal Services Authority (DLSA) front office or Labour Authority with the prepared wage computation table.',
    requiredFollowupDocuments: [
      'SAMADHAN Application ID or Speed Post Delivery Proof of Wage Demand Notice',
      'Month-by-month unpaid salary/wage calculation sheet',
      'Offer letter, ID card, bank salary credits, or attendance proof',
    ],
    educationalSafetyNotice:
      'Procedural windows shown are general administrative reference timelines for organizing follow-up visits with a Labour Officer or DLSA para-legal volunteer.',
  },
  dlsa_prelitigation_clinic: {
    pathwayKey: 'dlsa_prelitigation_clinic',
    pathwayTitle: 'DLSA Front Office / Pre-Litigation Lok Adalat Application Window',
    pathwayTitleHi: 'DLSA फ्रंट ऑफिस / प्री-लिटिगेशन लोक अदालत आवेदन विंडो',
    statutoryOrRuleCitation:
      'Sections 12 & 19, Legal Services Authorities Act, 1987 & NALSA Front-Office Guidelines',
    standardWindowDays: 15,
    initialFilingChannel:
      'District Legal Services Authority (DLSA) Front Office / Nyaya Bandhu',
    escalationAuthorityTitle:
      'Secretary, District Legal Services Authority (DLSA) / State LSA Helpline (15100)',
    escalationAuthorityTitleHi:
      'सचिव, जिला विधिक सेवा प्राधिकरण (DLSA) / राज्य विधिक सेवा हेल्पलाइन (15100)',
    escalationProcedureSummary:
      'After submitting a legal-aid or pre-litigation Lok Adalat application at the DLSA Front Office, citizens receive a Diary/Inward Number. If panel advocate assignment or pre-litigation notice status is not communicated within 15 days, present the Diary Number at the Front Office or call NALSA Toll-Free 15100.',
    requiredFollowupDocuments: [
      'DLSA Front-Office Diary / Inward Receipt Number',
      'Bilingual Citizen Case Preparation Dossier (v1)',
      'Self-declaration / eligibility proof under Section 12 LSA Act (if seeking panel lawyer)',
    ],
    educationalSafetyNotice:
      'Procedural windows shown are general administrative reference timelines for DLSA front-office follow-up.',
  },
};

export function computeElapsedWindowMetrics(
  contactedAtIsoDate: string,
  targetWindowDays: number,
  referenceNowIsoDate = '2026-09-28'
): {
  elapsedDays: number;
  remainingDays: number;
  isWindowElapsed: boolean;
} {
  const contactedMs = Date.parse(contactedAtIsoDate);
  const nowMs = Date.parse(referenceNowIsoDate);
  if (Number.isNaN(contactedMs) || Number.isNaN(nowMs)) {
    return {
      elapsedDays: 0,
      remainingDays: targetWindowDays,
      isWindowElapsed: false,
    };
  }
  const diffDays = Math.max(
    0,
    Math.floor((nowMs - contactedMs) / (1000 * 60 * 60 * 24))
  );
  const remainingDays = Math.max(0, targetWindowDays - diffDays);
  return {
    elapsedDays: diffDays,
    remainingDays,
    isWindowElapsed: diffDays >= targetWindowDays,
  };
}

