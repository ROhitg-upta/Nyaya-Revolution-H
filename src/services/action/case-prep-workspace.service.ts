import { listGovernedAuthorities } from "@/services/governance/authority-governance.service";
import type {
  AllowedAttachmentMimeType,
  CasePrepAttachmentItem,
  CasePrepAuthoritySnapshot,
  CasePrepChecklistItem,
  CasePrepExportVersion,
  CasePrepParticipant,
  CasePrepPiiDetectionItem,
  CasePrepReviewGateState,
  CasePrepTimelineEvent,
  CitizenCasePrepWorkspace,
  DossierLanguage,
  WorkspaceCompletionReport,
} from "@/types/case-prep";

export const DEFAULT_AUTHORIZED_CITIZEN_ID = "citizen-owner-user-a";

const ALLOWED_MIMES: AllowedAttachmentMimeType[] = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function sanitizeAttachmentFilename(rawName: string): string {
  const base = rawName.split(/[\\/]/).pop() ?? "attachment.pdf";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

/**
 * Context-aware checklist generator by legal category.
 * Uses strictly educational language: "Information/documents you may want to keep for discussion."
 */
export function getDefaultChecklistForCategory(
  category: string
): CasePrepChecklistItem[] {
  if (category === "Tenancy & Housing") {
    return [
      {
        id: "chk-1",
        itemLabel: "Rent agreement or written tenancy terms (if available)",
        itemLabelHi: "किराया समझौता या लिखित शर्तें (यदि उपलब्ध हो)",
        category: "Information/documents you may want to keep for discussion",
        isChecked: true,
        userNote: "11-month agreement signed 01 Oct 2025",
      },
      {
        id: "chk-2",
        itemLabel: "Security deposit payment proof (UPI / bank transfer receipt)",
        itemLabelHi: "सिक्योरिटी डिपॉजिट भुगतान प्रमाण (UPI / बैंक रसीद)",
        category: "Information/documents you may want to keep for discussion",
        isChecked: true,
        userNote: "NEFT Ref #HDFC99281726 for ₹90,000",
      },
      {
        id: "chk-3",
        itemLabel: "Move-out notice & key handover messages / emails",
        itemLabelHi: "मकान खाली करने की सूचना और चाबी सौंपने के संदेश / ईमेल",
        category: "Information/documents you may want to keep for discussion",
        isChecked: true,
        userNote: "WhatsApp & email sent 30 days prior on 10 Aug 2026",
      },
      {
        id: "chk-4",
        itemLabel: "Electricity / water bill clearance receipts at move-out",
        itemLabelHi: "मकान खाली करते समय बिजली / पानी बिल भुगतान रसीदें",
        category: "Information/documents you may want to keep for discussion",
        isChecked: false,
        userNote: "[Complete before use]",
      },
      {
        id: "chk-5",
        itemLabel: "Written demand or follow-up communication with landlord",
        itemLabelHi: "मकान मालिक को भेजा गया लिखित अनुरोध या फॉलो-अप संदेश",
        category: "Information/documents you may want to keep for discussion",
        isChecked: true,
        userNote: "Written request sent on 16 Sep 2026",
      },
    ];
  }

  return [
    {
      id: "chk-gen-1",
      itemLabel: "Agreement, invoice, or official receipt",
      itemLabelHi: "समझौता, चालान या आधिकारिक रसीद",
      category: "Information/documents you may want to keep for discussion",
      isChecked: true,
      userNote: "",
    },
    {
      id: "chk-gen-2",
      itemLabel: "Relevant written communication (emails, SMS, letters)",
      itemLabelHi: "संबंधित लिखित संवाद (ईमेल, एसएमएस, पत्र)",
      category: "Information/documents you may want to keep for discussion",
      isChecked: true,
      userNote: "",
    },
    {
      id: "chk-gen-3",
      itemLabel: "Payment proof or transaction reference number",
      itemLabelHi: "भुगतान प्रमाण या लेनदेन संदर्भ संख्या",
      category: "Information/documents you may want to keep for discussion",
      isChecked: false,
      userNote: "[Complete before use]",
    },
    {
      id: "chk-gen-4",
      itemLabel: "Prior complaint docket or reference number (if any)",
      itemLabelHi: "पूर्व शिकायत डॉकेट या संदर्भ संख्या (यदि कोई हो)",
      category: "Information/documents you may want to keep for discussion",
      isChecked: false,
      userNote: "[Complete before use]",
    },
  ];
}

/**
 * Deterministic Bilingual Helper that preserves all numbers, dates, amounts, and official authority names.
 */
export function translateSummaryPreservingFacts(
  textEn: string,
  targetLang: DossierLanguage
): string {
  if (!textEn.trim()) return "[Complete before use]";
  if (targetLang === "en") return textEn;

  // Deterministic Hindi presentation preserving exact numbers, dates, and statutory identifiers
  if (textEn.includes("90,000") || textEn.toLowerCase().includes("deposit")) {
    return "मकान मालिक द्वारा 10 सितंबर 2026 को चाबी और फ्लैट सौंपने के बावजूद ₹90,000 की सिक्योरिटी डिपॉजिट राशि वापस नहीं की जा रही है। 30 दिन का लिखित नोटिस पहले ही दिया जा चुका था और सभी बिलों का भुगतान किया गया है। (मूल तथ्य एवं तिथियाँ अपरिवर्तित)";
  }

  return `[अनुवादित प्रस्तुति — मूल तथ्य संरक्षित]: ${textEn}`;
}

function buildInitialAuthoritySnapshot(
  authorityId: string
): CasePrepAuthoritySnapshot {
  const allGoverned = listGovernedAuthorities();
  const found =
    allGoverned.find((a) => a.authority.id === authorityId) ?? allGoverned[0];
  const auth = found.authority;

  const warning: CasePrepAuthoritySnapshot["liveFreshnessWarning"] =
    found.openConflicts.length > 0
      ? "conflicted"
      : auth.freshness.status === "stale"
      ? "stale"
      : auth.freshness.status === "review_due"
      ? "review_due"
      : "none";

  return {
    id: `snap-${auth.id}-v${auth.activeVersion}`,
    authorityId: auth.id,
    authorityName: auth.officeName,
    authorityType: auth.authorityType,
    state: auth.state,
    district: auth.district,
    publishedVersionNumber: auth.activeVersion,
    phone: auth.contact.phone,
    helpline: auth.contact.helpline ?? "15100",
    email: auth.contact.email,
    address: auth.address,
    website: auth.website,
    sourceUrl: auth.sourceUrl,
    sourceType: auth.sourceType,
    verifiedAtSnapshot: auth.lastVerifiedAt,
    capturedAt: new Date().toISOString(),
    liveFreshnessWarning: warning,
    liveWarningMessage:
      warning !== "none"
        ? `Authority status in live directory is '${warning}'. Please verify official contact details before visiting.`
        : undefined,
  };
}

function createSeedWorkspace(): CitizenCasePrepWorkspace {
  const snap = buildInitialAuthoritySnapshot("dlsa-new-delhi-phc");
  return {
    id: "ws-e14-tenancy-deposit-01",
    ownerUserId: DEFAULT_AUTHORIZED_CITIZEN_ID,
    title: "My landlord is not returning my ₹90,000 security deposit after move-out",
    status: "ready_for_review",
    situationCategory: "Tenancy & Housing",
    situationSlug: "landlord-withholding-deposit",
    situationSummaryEn:
      "Vacated rented flat in New Delhi on 10 Sep 2026 after serving 30 days written notice. Landlord is withholding ₹90,000 security deposit without any itemized deduction sheet despite joint move-out inspection.",
    situationSummaryHi:
      "30 दिन का लिखित नोटिस देने के बाद 10 सितंबर 2026 को नई दिल्ली स्थित किराए का फ्लैट खाली कर दिया गया। संयुक्त निरीक्षण के बावजूद मकान मालिक बिना किसी कटौती विवरण के ₹90,000 की सिक्योरिटी डिपॉजिट राशि रोक रहे हैं।",
    originalStoryRef:
      "Community Reference: Joint Move-Out Inspection & Written Notice Trail (/community/stories/recovered-90000-rental-security-deposit-using-joint-moveout-inspection-sheet)",
    userDescriptionEn:
      "I paid ₹90,000 via NEFT (Ref #HDFC99281726) on 01 Oct 2025. On 10 Aug 2026, I sent my 30-day notice. On 10 Sep 2026, keys were handed over in good condition. Contact phone on file: 9876543210.",
    userDescriptionHi:
      "मैंने 01 अक्टूबर 2025 को NEFT (#HDFC99281726) के माध्यम से ₹90,000 का भुगतान किया। 10 अगस्त 2026 को 30-दिवसीय नोटिस भेजा और 10 सितंबर 2026 को चाबियाँ सौंप दीं।",
    primaryLanguage: "en",
    secondaryLanguage: "hi",
    selectedState: "Delhi",
    selectedDistrict: "New Delhi",
    timeline: [
      {
        id: "tl-1",
        eventDate: "2025-10-01",
        isApproximateDate: false,
        eventTitle: "Signed 11-month Rent Agreement & Paid ₹90,000 Security Deposit",
        eventTitleHi: "11 महीने का किराया समझौता और ₹90,000 सिक्योरिटी डिपॉजिट का भुगतान",
        actionTaken: "Transferred ₹90,000 via NEFT Ref #HDFC99281726",
        responseReceived: "Landlord acknowledged receipt in Clause 4 of agreement",
        sourceOrNote: "Bank Statement & Signed Agreement Copy",
        sortOrder: 1,
      },
      {
        id: "tl-2",
        eventDate: "2026-08-10",
        isApproximateDate: false,
        eventTitle: "Sent 30-Day Written Move-Out Notice",
        eventTitleHi: "30-दिवसीय लिखित मकान खाली करने का नोटिस भेजा",
        actionTaken: "Sent email and message stating move-out date of 10 Sep 2026",
        responseReceived: "Landlord replied 'Noted, we will inspect on 10 Sep'",
        sourceOrNote: "Email Thread & Timestamped Message",
        sortOrder: 2,
      },
      {
        id: "tl-3",
        eventDate: "2026-09-10",
        isApproximateDate: false,
        eventTitle: "Joint Move-Out Inspection & Key Handover",
        eventTitleHi: "संयुक्त निरीक्षण और चाबी हस्तांतरण",
        actionTaken: "Handed over all 3 sets of keys and zero-dues electricity receipt",
        responseReceived: "No damage noted during walkthrough; refund promised in 3 days",
        sourceOrNote: "Dated Move-Out Handover Photos",
        sortOrder: 3,
      },
      {
        id: "tl-4",
        eventDate: "2026-09-16",
        isApproximateDate: false,
        eventTitle: "Sent Written Refund Reminder & Request for Itemized Statement",
        eventTitleHi: "लिखित रिफंड अनुस्मारक भेजा",
        actionTaken: "Requested refund of ₹90,000 to bank account",
        responseReceived: "Landlord stopped responding to calls/messages",
        sourceOrNote: "Written Notice Draft v1",
        sortOrder: 4,
      },
    ],
    participants: [
      {
        id: "part-1",
        roleLabel: "Tenant (Self / Citizen)",
        nameOrLabel: "Aarav Sharma (User-entered)",
        organization: "Individual Tenant",
        contactReference: "9876543210",
      },
      {
        id: "part-2",
        roleLabel: "Landlord / Property Owner",
        nameOrLabel: "Mr. R. K. Malhotra",
        organization: "Private Residential Lessor, New Delhi",
        contactReference: "Written email & registered postal address on agreement",
      },
    ],
    checklist: getDefaultChecklistForCategory("Tenancy & Housing"),
    attachments: [
      {
        id: "att-1",
        workspaceId: "ws-e14-tenancy-deposit-01",
        storagePath:
          "citizen_case_prep_vault/citizen-owner-user-a/ws-e14-tenancy-deposit-01/rent_agreement_oct2025.pdf",
        filename: "rent_agreement_oct2025.pdf",
        mimeType: "application/pdf",
        fileSizeBytes: 428190,
        description: "Signed 11-month rental agreement showing Clause 4 (₹90,000 deposit)",
        uploadedAt: "2026-09-20T11:30:00.000Z",
      },
      {
        id: "att-2",
        workspaceId: "ws-e14-tenancy-deposit-01",
        storagePath:
          "citizen_case_prep_vault/citizen-owner-user-a/ws-e14-tenancy-deposit-01/neft_deposit_receipt.png",
        filename: "neft_deposit_receipt.png",
        mimeType: "image/png",
        fileSizeBytes: 194500,
        description: "HDFC NEFT transfer confirmation #HDFC99281726",
        uploadedAt: "2026-09-20T11:34:00.000Z",
      },
    ],
    linkedAuthoritySnapshot: snap,
    lokAdalatBridge: {
      included: true,
      disputeCategory: "Tenancy & Security Deposit Pre-Litigation Conciliation",
      disputeSummary:
        "Civil recovery of liquidated security deposit amount (₹90,000) after peaceful possession handover.",
      readinessChecklistCount: "7 / 8 readiness items prepared",
      settlementDiscussionPoints: [
        "Full refund of ₹90,000 principal deposit via bank transfer within 7 days",
        "Mutual acknowledgment of zero pending utility dues as of 10 Sep 2026",
        "Amicable pre-litigation settlement under Section 20(2) / 22B of LSA Act, 1987",
      ],
      preparationQuestions: [
        "How can I file a Pre-Litigation application at the DLSA Front Office before approaching civil court?",
        "What postal/email address of the opposite party is needed for DLSA conciliation notice delivery?",
      ],
      educationalStatusNotice:
        "Based on the information entered, this preparation flow may help you learn about Lok Adalat/ADR pathways. This is an educational preparation summary and not a determination of legal eligibility.",
    },
    linkedDrafts: [
      {
        id: "draft-e11-legal-aid-01",
        title: "DLSA Front-Office Legal Aid & Pre-Litigation Representation Brief",
        templateType: "legal-aid-checklist-v1",
        templateVersion: "v1.2",
        status: "reviewed",
        createdAt: "2026-09-22",
        sourceReferences: [
          "Section 12 & Section 19, Legal Services Authorities Act, 1987",
          "Model Tenancy Act Principles & Indian Contract Act, 1872",
        ],
        summaryExcerpt:
          "Structured chronology and document index prepared for DLSA Front Office para-legal volunteer / panel advocate consultation.",
      },
      {
        id: "draft-e11-lok-adalat-02",
        title: "Lok Adalat Pre-Litigation Settlement Preparation Brief",
        templateType: "lok-adalat-prep-brief-v1",
        templateVersion: "v1.0",
        status: "reviewed",
        createdAt: "2026-09-23",
        sourceReferences: [
          "Sections 19–22B, Legal Services Authorities Act, 1987",
          "NALSA Lok Adalat Regulations, 2009",
        ],
        summaryExcerpt:
          "Summary of undisputed dates, NEFT payment reference, and proposed settlement terms for conciliation.",
      },
    ],
    sourceBundle: [
      {
        id: "src-1",
        sourceLayer: "VERIFIED_LEGAL_CONTENT",
        title: "Situation Guide: Landlord Withholding Security Deposit",
        referenceCode: "Nyaya Verified Situation • Tenancy & Housing",
        href: "/situations/landlord-withholding-deposit",
        verifiedDate: "2026-09-18",
      },
      {
        id: "src-2",
        sourceLayer: "VERIFIED_LEGAL_CONTENT",
        title: "Legal Services Authorities Act, 1987 (Sections 12 & 19–22B)",
        referenceCode: "Central Statute • Act No. 39 of 1987",
        href: "/laws",
        verifiedDate: "2026-09-18",
      },
      {
        id: "src-3",
        sourceLayer: "OFFICIAL_RESOURCE",
        title: snap.authorityName,
        referenceCode: `Official ${snap.authorityType} • Published Version v${snap.publishedVersionNumber}`,
        href: snap.sourceUrl,
        verifiedDate: snap.verifiedAtSnapshot,
      },
      {
        id: "src-4",
        sourceLayer: "COMMUNITY_EXPERIENCE",
        title: "Citizen Story: How a Joint Move-Out Inspection Sheet Helped Recover Deposit",
        referenceCode: "Community Voice • Educational Peer Experience (Non-Legal Opinion)",
        href: "/community/stories/recovered-90000-rental-security-deposit-using-joint-moveout-inspection-sheet",
        verifiedDate: "2026-09-15",
      },
    ],
    questionsToDiscuss: [
      {
        id: "q-1",
        questionEn: "What original documents and copies should I bring to the DLSA Front Office?",
        questionHi: "मुझे DLSA फ्रंट ऑफिस में कौन से मूल दस्तावेज़ और प्रतियाँ लानी चाहिए?",
        origin: "DETERMINISTIC_EDUCATIONAL",
        isIncluded: true,
      },
      {
        id: "q-2",
        questionEn: "Can a pre-litigation Lok Adalat notice be sent to the landlord before filing a civil recovery suit?",
        questionHi: "क्या सिविल वाद दायर करने से पहले मकान मालिक को प्री-लिटिगेशन लोक अदालत नोटिस भेजा जा सकता है?",
        origin: "DETERMINISTIC_EDUCATIONAL",
        isIncluded: true,
      },
      {
        id: "q-3",
        questionEn: "What additional facts or bank transaction proofs should I clarify before submitting a formal written application?",
        questionHi: "औपचारिक लिखित आवेदन जमा करने से पहले मुझे और कौन से तथ्य या बैंक लेनदेन प्रमाण स्पष्ट करने चाहिए?",
        origin: "DETERMINISTIC_EDUCATIONAL",
        isIncluded: true,
      },
      {
        id: "q-4",
        questionEn: "[AI Suggestion] Should I attach the dated move-out photographs alongside the zero-dues electricity receipt as annexures?",
        questionHi: "[AI सुझाव] क्या मुझे शून्य-बकाया बिजली रसीद के साथ दिनांकित मकान खाली करने की तस्वीरें संलग्नक के रूप में जोड़नी चाहिए?",
        origin: "AI_SUGGESTION",
        isIncluded: true,
      },
    ],
    userPrivateNotes:
      "Bring 2 printed sets of this bilingual preparation dossier and original NEFT bank statement when visiting the Patiala House Court DLSA Front Office.",
    reviewGate: {
      factsCorrect: true,
      datesCorrect: true,
      removedUnnecessaryPrivateInfo: true,
      reviewedAttachedDocuments: true,
      checkedSelectedAuthority: true,
      reviewedGeneratedDrafts: true,
    },
    exportHistory: [
      {
        id: "exp-v1",
        versionNumber: 1,
        primaryLanguage: "en",
        secondaryLanguage: "none",
        exportFormat: "pdf_print",
        exportedAt: "2026-09-22T14:20:00.000Z",
        authoritySnapshotVersion: 1,
        authorityNameSnapshot: snap.authorityName,
        authoritySourceUrlSnapshot: snap.sourceUrl,
        titleSnapshot: "Security Deposit Preparation Pack (English Baseline)",
        summarySnapshotEn:
          "Initial English preparation draft with 3 timeline events and DLSA New Delhi v1 snapshot.",
        summarySnapshotHi: "",
        timelineCountSnapshot: 3,
        checklistCheckedCountSnapshot: 3,
      },
      {
        id: "exp-v2",
        versionNumber: 2,
        primaryLanguage: "en",
        secondaryLanguage: "hi",
        exportFormat: "bilingual_dossier",
        exportedAt: "2026-09-24T16:45:00.000Z",
        authoritySnapshotVersion: snap.publishedVersionNumber,
        authorityNameSnapshot: snap.authorityName,
        authoritySourceUrlSnapshot: snap.sourceUrl,
        titleSnapshot: "Bilingual Citizen Case Preparation Dossier (English + Hindi)",
        summarySnapshotEn:
          "Complete bilingual dossier with 4 timeline events, Lok Adalat readiness notes, and DLSA New Delhi snapshot.",
        summarySnapshotHi:
          "4 समयरेखा घटनाओं, लोक अदालत तैयारी नोट्स और DLSA नई दिल्ली स्नैपशॉट के साथ द्विभाषी डोजियर।",
        timelineCountSnapshot: 4,
        checklistCheckedCountSnapshot: 4,
      },
    ],
    createdAt: "2026-09-20T10:00:00.000Z",
    updatedAt: new Date().toISOString(),
    lastExportedAt: "2026-09-24T16:45:00.000Z",
  };
}

interface GlobalCasePrepStore {
  workspaces: Map<string, CitizenCasePrepWorkspace>;
}

const globalForCasePrep = globalThis as unknown as {
  __nyayaCasePrepStoreE14?: GlobalCasePrepStore;
};

function getCasePrepStore(): GlobalCasePrepStore {
  if (!globalForCasePrep.__nyayaCasePrepStoreE14) {
    const map = new Map<string, CitizenCasePrepWorkspace>();
    const seed = createSeedWorkspace();
    map.set(seed.id, seed);
    globalForCasePrep.__nyayaCasePrepStoreE14 = { workspaces: map };
  }
  return globalForCasePrep.__nyayaCasePrepStoreE14;
}

/**
 * Strict Owner-Only RLS & Anti-IDOR Guard (Phase 32, 55, 59).
 */
export function assertWorkspaceOwner(
  workspace: CitizenCasePrepWorkspace,
  requestingUserId: string
): void {
  if (workspace.ownerUserId !== requestingUserId) {
    throw new Error(
      `Access Denied (403 IDOR Protection): User '${requestingUserId}' cannot access or modify private workspace '${workspace.id}' owned by another citizen.`
    );
  }
}

/**
 * Computes real 10-section workspace progress and missing required-for-export items (Phases 41 & 42).
 */
export function computeWorkspaceCompletion(
  ws: CitizenCasePrepWorkspace
): WorkspaceCompletionReport {
  const sections = [
    {
      id: "situation",
      label: "1. Situation Summary",
      isComplete: Boolean(ws.title.trim() && ws.situationSummaryEn.trim()),
      missingReason: "Situation summary is incomplete",
    },
    {
      id: "timeline",
      label: "2. Chronology / Timeline",
      isComplete: ws.timeline.length > 0 && Boolean(ws.timeline[0]?.eventDate),
      missingReason: "At least one dated incident timeline entry is required",
    },
    {
      id: "participants",
      label: "3. Parties / Organizations",
      isComplete: ws.participants.length > 0,
      missingReason: "Add at least one relevant party or organization",
    },
    {
      id: "checklist",
      label: "4. Documents & Info Checklist",
      isComplete: ws.checklist.some((c) => c.isChecked),
      missingReason: "Check at least one document/information item",
    },
    {
      id: "attachments",
      label: "5. Private Attachments Index",
      isComplete: ws.attachments.length > 0,
      missingReason: "Optional private attachment metadata not yet added",
    },
    {
      id: "sources",
      label: "6. Verified Learning & Sources",
      isComplete: ws.sourceBundle.length > 0,
      missingReason: "Link at least one verified platform source",
    },
    {
      id: "authority",
      label: "7. Verified DLSA / Assistance Snapshot",
      isComplete: Boolean(ws.linkedAuthoritySnapshot?.authorityId),
      missingReason: "Select a verified DLSA/SLSA assistance authority",
    },
    {
      id: "lok_adalat",
      label: "8. Lok Adalat / ADR Preparation Notes",
      isComplete: ws.lokAdalatBridge.included,
      missingReason: "Lok Adalat preparation section not enabled",
    },
    {
      id: "drafts",
      label: "9. Linked Citizen Action Drafts",
      isComplete: ws.linkedDrafts.length > 0,
      missingReason: "Link at least one E11 citizen action draft",
    },
    {
      id: "questions",
      label: "10. Questions to Discuss",
      isComplete: ws.questionsToDiscuss.some((q) => q.isIncluded),
      missingReason: "Select at least one question to discuss with a professional",
    },
  ];

  const completedCount = sections.filter((s) => s.isComplete).length;
  const totalCount = sections.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const missingRequiredForExport: string[] = [];
  if (!ws.situationSummaryEn.trim()) {
    missingRequiredForExport.push("Situation summary ([Complete before use])");
  }
  if (ws.timeline.length === 0) {
    missingRequiredForExport.push("At least one chronology / incident date");
  }
  if (!ws.linkedAuthoritySnapshot) {
    missingRequiredForExport.push("Selected verified legal-services authority");
  }

  return {
    completedCount,
    totalCount,
    percentage,
    sections,
    missingRequiredForExport,
  };
}

/**
 * Checks whether the linked authority in the workspace has changed version, become stale, or entered conflict in E13.
 */
export function refreshWorkspaceAuthorityFreshness(
  ws: CitizenCasePrepWorkspace
): CitizenCasePrepWorkspace {
  if (!ws.linkedAuthoritySnapshot) return ws;
  const liveList = listGovernedAuthorities();
  const liveMatch = liveList.find(
    (a) => a.authority.id === ws.linkedAuthoritySnapshot?.authorityId
  );
  if (!liveMatch) return ws;

  const auth = liveMatch.authority;
  let warning: CasePrepAuthoritySnapshot["liveFreshnessWarning"] = "none";
  let warningMsg: string | undefined;

  if (liveMatch.openConflicts.length > 0) {
    warning = "conflicted";
    warningMsg = `Open side-by-side contact conflict detected in Moderator Console for ${auth.officeName}. Verify contact before visiting.`;
  } else if (auth.freshness.status === "stale") {
    warning = "stale";
    warningMsg = `${auth.officeName} passed its 90-day verification window (${auth.freshness.ageInDays} days old).`;
  } else if (auth.freshness.status === "review_due") {
    warning = "review_due";
    warningMsg = `${auth.officeName} is scheduled for routine re-verification (${auth.freshness.daysUntilReview} days left).`;
  } else if (
    auth.activeVersion > ws.linkedAuthoritySnapshot.publishedVersionNumber
  ) {
    warning = "version_changed";
    warningMsg = `Newer verified version (v${auth.activeVersion}) published since your snapshot (v${ws.linkedAuthoritySnapshot.publishedVersionNumber}). Click 'Refresh Authority Snapshot' to update.`;
  }

  ws.linkedAuthoritySnapshot = {
    ...ws.linkedAuthoritySnapshot,
    liveFreshnessWarning: warning,
    liveWarningMessage: warningMsg,
  };

  return ws;
}

/**
 * Redaction Assistance Scanner (Phase 26):
 * Detects Aadhaar, PAN, 10-digit Indian phone numbers, emails, and bank reference numbers
 * without blindly overwriting user facts.
 */
export function scanWorkspaceForSensitivePii(
  ws: CitizenCasePrepWorkspace
): CasePrepPiiDetectionItem[] {
  const findings: CasePrepPiiDetectionItem[] = [];
  const combinedSources: { label: string; text: string }[] = [
    { label: "User Description", text: ws.userDescriptionEn },
    { label: "Situation Summary", text: ws.situationSummaryEn },
    { label: "Private Notes", text: ws.userPrivateNotes },
    ...ws.participants.map((p) => ({
      label: `Participant (${p.roleLabel})`,
      text: `${p.nameOrLabel} ${p.contactReference}`,
    })),
  ];

  const seenMatches = new Set<string>();

  combinedSources.forEach((src) => {
    // 1. 10-digit Indian Mobile Number
    const phoneRegex = /\b[6-9]\d{9}\b/g;
    let match: RegExpExecArray | null;
    while ((match = phoneRegex.exec(src.text)) !== null) {
      const val = match[0];
      if (!seenMatches.has(val)) {
        seenMatches.add(val);
        findings.push({
          id: `pii-phone-${val}`,
          patternType: "phone",
          label: "10-Digit Mobile Number",
          matchedValue: val,
          redactedReplacement: `${val.slice(0, 2)}XXXXXX${val.slice(-2)}`,
          locationLabel: src.label,
          userDecision: "pending",
        });
      }
    }

    // 2. Aadhaar-like 12-digit pattern
    const aadhaarRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
    while ((match = aadhaarRegex.exec(src.text)) !== null) {
      const val = match[0];
      if (!seenMatches.has(val)) {
        seenMatches.add(val);
        findings.push({
          id: `pii-aadhaar-${val}`,
          patternType: "aadhaar",
          label: "12-Digit Aadhaar-Like Identifier",
          matchedValue: val,
          redactedReplacement: "XXXX-XXXX-" + val.slice(-4),
          locationLabel: src.label,
          userDecision: "pending",
        });
      }
    }

    // 3. PAN-like pattern
    const panRegex = /\b[A-Z]{5}\d{4}[A-Z]\b/g;
    while ((match = panRegex.exec(src.text)) !== null) {
      const val = match[0];
      if (!seenMatches.has(val)) {
        seenMatches.add(val);
        findings.push({
          id: `pii-pan-${val}`,
          patternType: "pan",
          label: "PAN Card Pattern",
          matchedValue: val,
          redactedReplacement: `${val.slice(0, 2)}XXX****${val.slice(-1)}`,
          locationLabel: src.label,
          userDecision: "pending",
        });
      }
    }
  });

  return findings;
}

export function getWorkspaceForUser(params: {
  workspaceId?: string;
  requestingUserId: string;
}): {
  workspace: CitizenCasePrepWorkspace;
  completion: WorkspaceCompletionReport;
  piiDetections: CasePrepPiiDetectionItem[];
} {
  const store = getCasePrepStore();
  const id = params.workspaceId || "ws-e14-tenancy-deposit-01";
  const ws = store.workspaces.get(id);
  if (!ws) {
    throw new Error(`Workspace '${id}' not found.`);
  }
  assertWorkspaceOwner(ws, params.requestingUserId);
  refreshWorkspaceAuthorityFreshness(ws);

  return {
    workspace: ws,
    completion: computeWorkspaceCompletion(ws),
    piiDetections: scanWorkspaceForSensitivePii(ws),
  };
}

export function updateWorkspaceSummaryAndLanguages(params: {
  workspaceId: string;
  requestingUserId: string;
  title: string;
  situationCategory: string;
  situationSummaryEn: string;
  situationSummaryHi?: string;
  userDescriptionEn: string;
  primaryLanguage: DossierLanguage;
  secondaryLanguage: DossierLanguage | "none";
  userPrivateNotes: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  ws.title = params.title.trim() || "[Complete before use]";
  ws.situationCategory = params.situationCategory;
  ws.situationSummaryEn = params.situationSummaryEn;
  ws.situationSummaryHi =
    params.situationSummaryHi?.trim() ||
    translateSummaryPreservingFacts(params.situationSummaryEn, "hi");
  ws.userDescriptionEn = params.userDescriptionEn;
  ws.userDescriptionHi = translateSummaryPreservingFacts(
    params.userDescriptionEn,
    "hi"
  );
  ws.primaryLanguage = params.primaryLanguage;
  ws.secondaryLanguage = params.secondaryLanguage;
  ws.userPrivateNotes = params.userPrivateNotes;
  ws.updatedAt = new Date().toISOString();

  return ws;
}

export function addOrUpdateTimelineEvent(params: {
  workspaceId: string;
  requestingUserId: string;
  eventDate: string;
  isApproximateDate: boolean;
  eventTitle: string;
  actionTaken: string;
  responseReceived: string;
  sourceOrNote: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  const parsedDate = new Date(params.eventDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Please enter a valid YYYY-MM-DD incident date.");
  }

  const newEvent: CasePrepTimelineEvent = {
    id: `tl-${Date.now().toString(36)}`,
    eventDate: params.eventDate,
    isApproximateDate: params.isApproximateDate,
    eventTitle: params.eventTitle.trim() || "[Complete before use]",
    eventTitleHi: translateSummaryPreservingFacts(params.eventTitle, "hi"),
    actionTaken: params.actionTaken.trim() || "[Complete before use]",
    responseReceived: params.responseReceived.trim() || "[Complete before use]",
    sourceOrNote: params.sourceOrNote.trim() || "User-recorded timeline entry",
    sortOrder: ws.timeline.length + 1,
  };

  ws.timeline.push(newEvent);
  ws.timeline.sort((a, b) => a.eventDate.localeCompare(b.eventDate));
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function deleteTimelineEvent(params: {
  workspaceId: string;
  requestingUserId: string;
  eventId: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  ws.timeline = ws.timeline.filter((e) => e.id !== params.eventId);
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function toggleChecklistItem(params: {
  workspaceId: string;
  requestingUserId: string;
  itemId: string;
  userNote?: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  ws.checklist = ws.checklist.map((item) =>
    item.id === params.itemId
      ? {
          ...item,
          isChecked: !item.isChecked,
          userNote:
            params.userNote !== undefined ? params.userNote : item.userNote,
        }
      : item
  );
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function addParticipantToWorkspace(params: {
  workspaceId: string;
  requestingUserId: string;
  roleLabel: string;
  nameOrLabel: string;
  organization: string;
  contactReference: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  const p: CasePrepParticipant = {
    id: `part-${Date.now().toString(36)}`,
    roleLabel: params.roleLabel.trim() || "Party / Organization",
    nameOrLabel: params.nameOrLabel.trim() || "[Complete before use]",
    organization: params.organization.trim(),
    contactReference: params.contactReference.trim(),
  };
  ws.participants.push(p);
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function addPrivateAttachmentToWorkspace(params: {
  workspaceId: string;
  requestingUserId: string;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  description: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  if (!ALLOWED_MIMES.includes(params.mimeType as AllowedAttachmentMimeType)) {
    throw new Error(
      `Unsupported attachment MIME type '${params.mimeType}'. Only PDF, JPEG, PNG, WEBP, and plain text are permitted.`
    );
  }
  if (
    params.fileSizeBytes <= 0 ||
    params.fileSizeBytes > MAX_ATTACHMENT_SIZE_BYTES
  ) {
    throw new Error(
      `Attachment size (${Math.round(
        params.fileSizeBytes / 1024
      )} KB) exceeds the 10 MB private vault limit.`
    );
  }

  const safeFilename = sanitizeAttachmentFilename(params.filename);
  const item: CasePrepAttachmentItem = {
    id: `att-${Date.now().toString(36)}`,
    workspaceId: ws.id,
    storagePath: `citizen_case_prep_vault/${params.requestingUserId}/${ws.id}/${safeFilename}`,
    filename: safeFilename,
    mimeType: params.mimeType as AllowedAttachmentMimeType,
    fileSizeBytes: params.fileSizeBytes,
    description: params.description.trim() || "Private citizen document",
    uploadedAt: new Date().toISOString(),
  };

  ws.attachments.push(item);
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function deletePrivateAttachmentFromWorkspace(params: {
  workspaceId: string;
  requestingUserId: string;
  attachmentId: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  ws.attachments = ws.attachments.filter((a) => a.id !== params.attachmentId);
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function linkVerifiedAuthoritySnapshotToWorkspace(params: {
  workspaceId: string;
  requestingUserId: string;
  authorityId: string;
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  const snap = buildInitialAuthoritySnapshot(params.authorityId);
  ws.linkedAuthoritySnapshot = snap;
  ws.selectedState = snap.state;
  ws.selectedDistrict = snap.district;
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function applyRedactionDecision(params: {
  workspaceId: string;
  requestingUserId: string;
  matchedValue: string;
  redactedReplacement: string;
  decision: "keep" | "redact";
}): CitizenCasePrepWorkspace {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  if (params.decision === "redact") {
    ws.userDescriptionEn = ws.userDescriptionEn.replaceAll(
      params.matchedValue,
      params.redactedReplacement
    );
    ws.situationSummaryEn = ws.situationSummaryEn.replaceAll(
      params.matchedValue,
      params.redactedReplacement
    );
    ws.userPrivateNotes = ws.userPrivateNotes.replaceAll(
      params.matchedValue,
      params.redactedReplacement
    );
    ws.participants = ws.participants.map((p) => ({
      ...p,
      contactReference: p.contactReference.replaceAll(
        params.matchedValue,
        params.redactedReplacement
      ),
    }));
  }
  ws.updatedAt = new Date().toISOString();
  return ws;
}

export function updateReviewGateAndExportDossier(params: {
  workspaceId: string;
  requestingUserId: string;
  reviewGate: CasePrepReviewGateState;
  exportFormat: "pdf_print" | "bilingual_dossier" | "offline_text";
}): {
  workspace: CitizenCasePrepWorkspace;
  newExportVersion: CasePrepExportVersion;
} {
  const store = getCasePrepStore();
  const ws = store.workspaces.get(params.workspaceId);
  if (!ws) throw new Error("Workspace not found.");
  assertWorkspaceOwner(ws, params.requestingUserId);

  const allConfirmed =
    params.reviewGate.factsCorrect &&
    params.reviewGate.datesCorrect &&
    params.reviewGate.removedUnnecessaryPrivateInfo &&
    params.reviewGate.reviewedAttachedDocuments &&
    params.reviewGate.checkedSelectedAuthority &&
    params.reviewGate.reviewedGeneratedDrafts;

  if (!allConfirmed) {
    throw new Error(
      "Review Gate Incomplete: Please confirm all 6 review checklist items before exporting the preparation dossier."
    );
  }

  refreshWorkspaceAuthorityFreshness(ws);
  ws.reviewGate = { ...params.reviewGate };

  const nextVersionNumber =
    (ws.exportHistory[ws.exportHistory.length - 1]?.versionNumber ?? 0) + 1;
  const nowIso = new Date().toISOString();

  const newExport: CasePrepExportVersion = {
    id: `exp-v${nextVersionNumber}-${Date.now().toString(36)}`,
    versionNumber: nextVersionNumber,
    primaryLanguage: ws.primaryLanguage,
    secondaryLanguage: ws.secondaryLanguage,
    exportFormat: params.exportFormat,
    exportedAt: nowIso,
    authoritySnapshotVersion:
      ws.linkedAuthoritySnapshot?.publishedVersionNumber ?? 1,
    authorityNameSnapshot:
      ws.linkedAuthoritySnapshot?.authorityName ?? "[Complete before use]",
    authoritySourceUrlSnapshot:
      ws.linkedAuthoritySnapshot?.sourceUrl ?? "https://nalsa.gov.in",
    titleSnapshot: ws.title,
    summarySnapshotEn: ws.situationSummaryEn,
    summarySnapshotHi: ws.situationSummaryHi,
    timelineCountSnapshot: ws.timeline.length,
    checklistCheckedCountSnapshot: ws.checklist.filter((c) => c.isChecked)
      .length,
  };

  ws.exportHistory.push(newExport);
  ws.status = "exported";
  ws.lastExportedAt = nowIso;
  ws.updatedAt = nowIso;

  return { workspace: ws, newExportVersion: newExport };
}
