/**
 * ============================================================================
 * SPRINT E17 — CLOSED-LOOP AUTHORITY SELF-HEALING, PROCEDURAL ESCALATION
 *              WINDOWS & CITIZEN FOLLOW-UP SERVICE
 * ============================================================================
 * Connects E16 Citizen Outcome Signals (`could_not_reach`) to E13 Moderator
 * Freshness Governance (`vN -> vN+1`) and provides non-advisory statutory
 * waiting-window tracking, bilingual follow-up addendums, and `.ics` exports.
 */

import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  AuthorityFreshnessAlertRecord,
  CitizenProceduralFollowupRecord,
  ProceduralPathwayKey,
  ResolveAuthorityFreshnessAlertInput,
  SaveCitizenFollowupInput,
  StatutoryProceduralWindowSpec,
} from '@/types/closed-loop-followup';

export const FRESHNESS_SIGNAL_THRESHOLD = 3;

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

/**
 * In-memory deterministic store for Closed-Loop Authority Freshness Alerts,
 * pre-populated with realistic threshold-triggered tickets (`unreached_report_count >= 3`)
 * derived from Sprint E16 citizen check-in clusters.
 */
const memoryFreshnessAlerts = new Map<string, AuthorityFreshnessAlertRecord>([
  [
    'alert_labour_mh_01',
    {
      id: 'alert_labour_mh_01',
      authorityId: 'res_state_labour_desk',
      authorityName: 'Regional Labour Commissioner Helpline Entry (Mumbai / Pune Desk)',
      authorityType: 'Departmental Grievance Desk',
      stateCode: 'MH',
      triggerReason:
        '9 non-contradictory citizen check-ins in the last 30 days reported `could_not_reach` on landline after 17:00 IST (Threshold >= 3).',
      unreachedReportCount: 9,
      totalWindowReports: 22,
      windowDays: 30,
      priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL',
      status: 'open',
      currentVersionNumber: 2,
      resolvedByVersion: null,
      verifiedFallbackChannel:
        'SAMADHAN Official Portal (samadhan.labour.gov.in) & NALSA Toll-Free 15100',
      verifiedFallbackUrl: 'https://samadhan.labour.gov.in',
      citizenNoticeMessage:
        'Recent citizen check-ins noted difficulty reaching this landline after 17:00 IST. Moderator verification is in progress. Verified 24x7 online filing channel: samadhan.labour.gov.in or Toll-Free 15100.',
      moderatorResolutionNote: null,
      officialSourceUrl: 'https://samadhan.labour.gov.in',
      createdAt: '2026-09-25T10:15:00.000Z',
      resolvedAt: null,
    },
  ],
  [
    'alert_dlsa_up_02',
    {
      id: 'alert_dlsa_up_02',
      authorityId: 'res_dlsa_lucknow_front',
      authorityName: 'District Legal Services Authority (DLSA) Front Office Landline',
      authorityType: 'Statutory Legal Services Authority',
      stateCode: 'UP',
      triggerReason:
        '4 citizen check-ins noted second-Saturday court holiday closure when visiting in person without prior schedule notice (Threshold >= 3).',
      unreachedReportCount: 4,
      totalWindowReports: 16,
      windowDays: 30,
      priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL',
      status: 'in_review',
      currentVersionNumber: 3,
      resolvedByVersion: null,
      verifiedFallbackChannel:
        'NALSA National Legal Aid Helpline 15100 & UPSLSA Official Portal',
      verifiedFallbackUrl: 'https://nalsa.gov.in',
      citizenNoticeMessage:
        'Note: District Court front offices remain closed on Second Saturdays and gazetted judicial holidays. For immediate phone assistance, dial NALSA Verified Helpline 15100.',
      moderatorResolutionNote:
        'Reviewing updated court calendar hours for v4 snapshot publication.',
      officialSourceUrl: 'https://nalsa.gov.in',
      createdAt: '2026-09-26T14:20:00.000Z',
      resolvedAt: null,
    },
  ],
  [
    'alert_ncrp_bank_nodal_03',
    {
      id: 'alert_ncrp_bank_nodal_03',
      authorityId: 'res_ncrp_1930',
      authorityName: 'National Cyber Crime Reporting Portal & 1930 Helpline',
      authorityType: 'Statutory Helpline & Portal',
      stateCode: 'ALL',
      triggerReason:
        '7 citizen check-ins requested clearer UTR & 15-digit NCRP acknowledgement checklist before visiting local cyber cell.',
      unreachedReportCount: 7,
      totalWindowReports: 54,
      windowDays: 30,
      priorityBadge: 'HIGH_PRIORITY_CITIZEN_SIGNAL',
      status: 'resolved_updated',
      currentVersionNumber: 4,
      resolvedByVersion: 5,
      verifiedFallbackChannel:
        'cybercrime.gov.in Online Complaint Tracker + 1930 Toll-Free',
      verifiedFallbackUrl: 'https://cybercrime.gov.in',
      citizenNoticeMessage:
        'Verified Authority Snapshot Updated (v4 → v5): Added direct NCRP 15-digit Acknowledgement status check guidance and Bank Nodal Officer UTR checklist.',
      moderatorResolutionNote:
        'Published immutable snapshot v5 with updated I4C citizen checklist instructions.',
      officialSourceUrl: 'https://cybercrime.gov.in',
      createdAt: '2026-09-22T09:00:00.000Z',
      resolvedAt: '2026-09-27T16:45:00.000Z',
    },
  ],
]);

const memoryFollowupStore = new Map<string, CitizenProceduralFollowupRecord>();

/**
 * Computes elapsed days and remaining days in a statutory/procedural waiting window.
 */
export function computeElapsedWindowMetrics(
  contactedAtIsoDate: string,
  targetWindowDays: number
): {
  elapsedDays: number;
  remainingDays: number;
  isWindowElapsed: boolean;
} {
  const contactedMs = Date.parse(contactedAtIsoDate);
  const nowMs = Date.now();
  if (Number.isNaN(contactedMs)) {
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

/**
 * Generates the bilingual (English + Hindi) 1-page Follow-Up & Escalation Addendum
 * text so the citizen can attach it directly to their original Case Dossier (v1).
 */
export function buildBilingualFollowupAddendum(params: {
  pathwaySpec: StatutoryProceduralWindowSpec;
  docketOrDiaryRef: string;
  authorityContactedName: string;
  contactChannelUsed: string;
  contactedAt: string;
  elapsedDays: number;
  summaryOfResponse: string;
}): {
  addendumTextEn: string;
  addendumTextHi: string;
} {
  const refDisplay = params.docketOrDiaryRef.trim() || '[Pending Diary / Reference Number]';
  const summaryDisplay =
    params.summaryOfResponse.trim() ||
    'No final substantive resolution received as of date of this follow-up.';

  const addendumTextEn = [
    `=== NYAYA REVOLUTION • CITIZEN PROCEDURAL FOLLOW-UP ADDENDUM ===`,
    `1. Pathway Reference: ${params.pathwaySpec.pathwayTitle}`,
    `2. Statutory / Administrative Citation: ${params.pathwaySpec.statutoryOrRuleCitation}`,
    `3. Initial Authority Contacted: ${params.authorityContactedName} (${params.contactChannelUsed})`,
    `4. Date of Initial Submission: ${params.contactedAt} (${params.elapsedDays} days elapsed of standard ${params.pathwaySpec.standardWindowDays}-day reference window)`,
    `5. Official Docket / Diary / Registration No.: ${refDisplay}`,
    `6. Status / Summary of Response to Date: ${summaryDisplay}`,
    `7. Next Procedural Step / Escalation Channel: ${params.pathwaySpec.escalationAuthorityTitle}`,
    `Notice: Citizen-organized follow-up record prepared for verification with ${params.pathwaySpec.escalationAuthorityTitle} or a DLSA Legal-Aid Clinic.`,
  ].join('\n');

  const addendumTextHi = [
    `=== न्याय रिवोल्यूशन • नागरिक प्रक्रियात्मक फॉलो-अप अनुलग्नक (ADDENDUM) ===`,
    `1. प्रक्रिया मार्ग: ${params.pathwaySpec.pathwayTitleHi}`,
    `2. विधिक / प्रशासनिक संदर्भ: ${params.pathwaySpec.statutoryOrRuleCitation}`,
    `3. प्रारंभिक संपर्क कार्यालय: ${params.authorityContactedName} (${params.contactChannelUsed})`,
    `4. प्रारंभिक आवेदन तिथि: ${params.contactedAt} (मानक ${params.pathwaySpec.standardWindowDays}-दिवसीय संदर्भ अवधि में से ${params.elapsedDays} दिन पूर्ण)`,
    `5. डॉकेट / डायरी / पंजीकरण संख्या: ${refDisplay}`,
    `6. अब तक प्राप्त उत्तर / स्थिति का विवरण: ${summaryDisplay}`,
    `7. अगला प्रक्रियात्मक चरण / अपीलीय प्राधिकारी: ${params.pathwaySpec.escalationAuthorityTitleHi}`,
    `सूचना: यह नागरिक द्वारा तैयार किया गया संगठनात्मक फॉलो-अप विवरण है।`,
  ].join('\n');

  return { addendumTextEn, addendumTextHi };
}

/**
 * Returns all Closed-Loop Authority Freshness Alerts for the Moderator Console.
 */
export async function getAuthorityFreshnessAlerts(): Promise<
  AuthorityFreshnessAlertRecord[]
> {
  return Array.from(memoryFreshnessAlerts.values());
}

/**
 * Resolves an open `HIGH_PRIORITY_CITIZEN_SIGNAL` freshness ticket via human
 * moderator action (`publish_updated_version` -> increments `vN -> vN+1` or
 * `mark_verified_dismiss`), propagating the updated version to active workspaces.
 */
export async function resolveAuthorityFreshnessAlert(
  input: ResolveAuthorityFreshnessAlertInput
): Promise<{
  success: boolean;
  updatedAlert?: AuthorityFreshnessAlertRecord;
  error?: string;
}> {
  const existing = memoryFreshnessAlerts.get(input.alertId);
  if (!existing) {
    return {
      success: false,
      error: 'Freshness alert ticket not found.',
    };
  }

  const nowIso = new Date().toISOString();
  const nextVersion =
    input.resolutionAction === 'publish_updated_version'
      ? existing.currentVersionNumber + 1
      : existing.currentVersionNumber;

  const updatedAlert: AuthorityFreshnessAlertRecord = {
    ...existing,
    status:
      input.resolutionAction === 'publish_updated_version'
        ? 'resolved_updated'
        : 'dismissed_verified',
    resolvedByVersion: nextVersion,
    officialSourceUrl: input.officialSourceUrl || existing.officialSourceUrl,
    moderatorResolutionNote:
      input.updatedContactSummary.trim() ||
      `Verified against official source and published immutable version v${nextVersion}.`,
    citizenNoticeMessage:
      input.resolutionAction === 'publish_updated_version'
        ? `Verified Authority Snapshot Updated (v${existing.currentVersionNumber} → v${nextVersion}): ${input.updatedContactSummary.trim()}`
        : `Verified by Moderator (v${existing.currentVersionNumber}): Contact details confirmed active; backup channel remains ${existing.verifiedFallbackChannel}.`,
    resolvedAt: nowIso,
  };

  memoryFreshnessAlerts.set(existing.id, updatedAlert);

  try {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      await (supabase as unknown as {
        from: (table: string) => {
          upsert: (values: Record<string, unknown>) => Promise<unknown>;
        };
      })
        .from('authority_freshness_alerts')
        .upsert({
          id: updatedAlert.id,
          authority_id: updatedAlert.authorityId,
          authority_name: updatedAlert.authorityName,
          authority_type: updatedAlert.authorityType,
          state_code: updatedAlert.stateCode,
          trigger_reason: updatedAlert.triggerReason,
          unreached_report_count: updatedAlert.unreachedReportCount,
          total_window_reports: updatedAlert.totalWindowReports,
          window_days: updatedAlert.windowDays,
          priority_badge: updatedAlert.priorityBadge,
          status: updatedAlert.status,
          current_version_number: updatedAlert.currentVersionNumber,
          resolved_by_version: updatedAlert.resolvedByVersion,
          verified_fallback_channel: updatedAlert.verifiedFallbackChannel,
          verified_fallback_url: updatedAlert.verifiedFallbackUrl,
          moderator_resolution_note: updatedAlert.moderatorResolutionNote,
          official_source_url: updatedAlert.officialSourceUrl,
          resolved_at: updatedAlert.resolvedAt,
        });
    }
  } catch {
    // Fallback to memoryFreshnessAlerts
  }

  return {
    success: true,
    updatedAlert,
  };
}

/**
 * Retrieves or initializes a citizen's private Procedural Follow-Up Record for a Case Prep Workspace.
 */
export async function getCitizenProceduralFollowupForCase(
  caseId: string,
  defaultPathway: ProceduralPathwayKey = 'cyber_fraud_1930',
  defaultAuthorityName = 'National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)'
): Promise<CitizenProceduralFollowupRecord> {
  const existing = memoryFollowupStore.get(caseId);
  if (existing) {
    const metrics = computeElapsedWindowMetrics(
      existing.contactedAt,
      existing.targetWindowDays
    );
    return {
      ...existing,
      elapsedDays: metrics.elapsedDays,
      remainingDays: metrics.remainingDays,
      isWindowElapsed: metrics.isWindowElapsed,
    };
  }

  const spec = STATUTORY_PROCEDURAL_WINDOWS_CATALOG[defaultPathway];
  // Default initial submission date 9 days ago so citizen immediately sees realistic elapsed progress
  const defaultDate = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const metrics = computeElapsedWindowMetrics(
    defaultDate,
    spec.standardWindowDays
  );
  const addendum = buildBilingualFollowupAddendum({
    pathwaySpec: spec,
    docketOrDiaryRef: 'NCRP-ACK-2026-0918442',
    authorityContactedName: defaultAuthorityName,
    contactChannelUsed: spec.initialFilingChannel,
    contactedAt: defaultDate,
    elapsedDays: metrics.elapsedDays,
    summaryOfResponse:
      'Received automated SMS acknowledgment number; awaiting bank nodal lien confirmation and police station FIR diary reference.',
  });

  const seeded: CitizenProceduralFollowupRecord = {
    id: `fup_${caseId}`,
    caseId,
    userId: null,
    pathwayKey: defaultPathway,
    pathwayTitle: spec.pathwayTitle,
    docketOrDiaryRef: 'NCRP-ACK-2026-0918442',
    authorityContactedName: defaultAuthorityName,
    contactChannelUsed: spec.initialFilingChannel,
    contactedAt: defaultDate,
    targetWindowDays: spec.standardWindowDays,
    elapsedDays: metrics.elapsedDays,
    remainingDays: metrics.remainingDays,
    isWindowElapsed: metrics.isWindowElapsed,
    reminderIntervalDays: 15,
    followupStatus: metrics.isWindowElapsed
      ? 'window_elapsed_escalation_ready'
      : 'awaiting_within_window',
    summaryOfResponse:
      'Received automated SMS acknowledgment number; awaiting bank nodal lien confirmation and police station FIR diary reference.',
    addendumTextEn: addendum.addendumTextEn,
    addendumTextHi: addendum.addendumTextHi,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryFollowupStore.set(caseId, seeded);
  return seeded;
}

/**
 * Saves or updates a citizen's private Procedural Follow-Up & Docket Record,
 * recalculating elapsed days and regenerating the Bilingual Follow-Up Addendum.
 */
export async function saveOrUpdateCitizenProceduralFollowup(
  userId: string | null,
  input: SaveCitizenFollowupInput
): Promise<{
  success: boolean;
  record: CitizenProceduralFollowupRecord;
}> {
  const spec =
    STATUTORY_PROCEDURAL_WINDOWS_CATALOG[input.pathwayKey] ||
    STATUTORY_PROCEDURAL_WINDOWS_CATALOG.cyber_fraud_1930;

  const metrics = computeElapsedWindowMetrics(
    input.contactedAt,
    spec.standardWindowDays
  );

  const safeSummary = (input.summaryOfResponse || '').trim().slice(0, 400);

  const addendum = buildBilingualFollowupAddendum({
    pathwaySpec: spec,
    docketOrDiaryRef: input.docketOrDiaryRef,
    authorityContactedName: input.authorityContactedName,
    contactChannelUsed: input.contactChannelUsed,
    contactedAt: input.contactedAt,
    elapsedDays: metrics.elapsedDays,
    summaryOfResponse: safeSummary,
  });

  const nowIso = new Date().toISOString();
  const updated: CitizenProceduralFollowupRecord = {
    id: input.existingFollowupId || `fup_${input.caseId}`,
    caseId: input.caseId,
    userId,
    pathwayKey: input.pathwayKey,
    pathwayTitle: spec.pathwayTitle,
    docketOrDiaryRef: input.docketOrDiaryRef.trim(),
    authorityContactedName: input.authorityContactedName.trim(),
    contactChannelUsed: input.contactChannelUsed.trim(),
    contactedAt: input.contactedAt,
    targetWindowDays: spec.standardWindowDays,
    elapsedDays: metrics.elapsedDays,
    remainingDays: metrics.remainingDays,
    isWindowElapsed: metrics.isWindowElapsed,
    reminderIntervalDays: input.reminderIntervalDays,
    followupStatus: input.followupStatus,
    summaryOfResponse: safeSummary,
    addendumTextEn: addendum.addendumTextEn,
    addendumTextHi: addendum.addendumTextHi,
    createdAt: memoryFollowupStore.get(input.caseId)?.createdAt || nowIso,
    updatedAt: nowIso,
  };

  memoryFollowupStore.set(input.caseId, updated);

  try {
    const supabase = await createSupabaseServerClient();
    if (supabase && userId) {
      await (supabase as unknown as {
        from: (table: string) => {
          upsert: (values: Record<string, unknown>) => Promise<unknown>;
        };
      })
        .from('citizen_procedural_followups')
        .upsert({
          id: updated.id,
          case_id: updated.caseId,
          user_id: userId,
          pathway_key: updated.pathwayKey,
          pathway_title: updated.pathwayTitle,
          docket_or_diary_ref: updated.docketOrDiaryRef,
          authority_contacted_name: updated.authorityContactedName,
          contact_channel_used: updated.contactChannelUsed,
          contacted_at: updated.contactedAt,
          target_window_days: updated.targetWindowDays,
          reminder_interval_days: updated.reminderIntervalDays,
          followup_status: updated.followupStatus,
          summary_of_response: updated.summaryOfResponse,
          updated_at: nowIso,
        });
    }
  } catch {
    // Fallback to memoryFollowupStore
  }

  return {
    success: true,
    record: updated,
  };
}

/**
 * Generates a strict privacy-safe `.ics` calendar file for follow-up reminders.
 * Never embeds sensitive narratives, names, or identification numbers in the
 * calendar event summary or description.
 */
export function generatePrivacySafeIcsReminder(params: {
  intervalDays: 7 | 15 | 30;
  pathwayKey: ProceduralPathwayKey;
}): {
  filename: string;
  mimeType: string;
  icsContent: string;
} {
  const targetDate = new Date(
    Date.now() + params.intervalDays * 24 * 60 * 60 * 1000
  );
  const y = targetDate.getUTCFullYear();
  const m = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(targetDate.getUTCDate()).padStart(2, '0');
  const dtStart = `${y}${m}${d}T043000Z`; // 10:00 AM IST
  const dtEnd = `${y}${m}${d}T050000Z`;
  const dtStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nyaya Revolution//Privacy-Safe Procedural Follow-Up Reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:nyaya-followup-${params.pathwayKey}-${params.intervalDays}d@nyayarevolution.org`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'SUMMARY:Nyaya Case Prep: Review Procedural Follow-Up Window',
    'DESCRIPTION:Privacy-safe reminder to review your private Case Preparation Workspace and check whether a procedural follow-up or escalation step is ready. (No personal case details are stored in this calendar event.)',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return {
    filename: `nyaya-procedural-reminder-${params.intervalDays}d.ics`,
    mimeType: 'text/calendar;charset=utf-8',
    icsContent: icsLines.join('\r\n'),
  };
}
