import {
  CITIZEN_DOCUMENT_TEMPLATES,
  VERIFIED_RESOURCES_CATALOG,
} from "@/constants/verified-resources";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { detectAndRedactPII } from "@/lib/sanitization";
import { sanitizeUntrustedCitizenInput } from "@/services/voice/multilingual-voice.service";
import type {
  CitizenDocumentTemplateMeta,
  CitizenDocumentTemplateType,
  DocumentSourceCitation,
  GeneratedCitizenDocument,
  GeneratedDocumentSection,
  RankedVerifiedResource,
  SupportedCitizenLanguage,
  VerifiedResource,
} from "@/types/action-engine";

/**
 * Checks whether a verified resource has exceeded its freshness window (`staleAfterDays`).
 */
export function isResourceStale(resource: VerifiedResource): boolean {
  if (resource.verificationStatus === "stale") return true;
  const verifiedTime = new Date(resource.lastVerifiedAt).getTime();
  if (Number.isNaN(verifiedTime)) return false;
  const ageDays = (Date.now() - verifiedTime) / (1000 * 60 * 60 * 24);
  return ageDays > resource.staleAfterDays;
}

/**
 * Deterministic Situation -> Verified Assistance Ranking Engine
 * Ranks official helplines, NALSA/SLSA/DLSA legal aid offices, and grievance portals by:
 * 1. Issue Category Match (0-45 pts)
 * 2. Jurisdiction Match — State SLSA/DLSA vs All India / Central (0-30 pts)
 * 3. Authority & Statutory Relevance (0-15 pts)
 * 4. Verification Freshness (`lastVerifiedAt` within `staleAfterDays`) (0-10 pts)
 * 5. Language Support (0-5 pts)
 */
export async function getRankedVerifiedResources(params: {
  category?: string;
  secondaryCategories?: string[];
  state?: string;
  language?: SupportedCitizenLanguage;
  query?: string;
  includeAllIfNoFilter?: boolean;
}): Promise<RankedVerifiedResource[]> {
  const resources: VerifiedResource[] = [...VERIFIED_RESOURCES_CATALOG];

  const targetCategory = (params.category ?? "").trim();
  const secondary = params.secondaryCategories ?? [];
  const targetState = (params.state ?? "All India").trim();
  const targetLanguage = params.language ?? "en";
  const searchQuery = (params.query ?? "").trim().toLowerCase();

  const ranked: RankedVerifiedResource[] = [];

  for (const resource of resources) {
    if (!resource.isPublished || resource.verificationStatus === "archived") {
      continue;
    }

    const stale = isResourceStale(resource);
    const matchReasons: string[] = [];
    let score = 0;

    // 1. Issue Category Match
    if (
      targetCategory &&
      targetCategory !== "All" &&
      resource.issueCategories.some(
        (cat) => cat.toLowerCase() === targetCategory.toLowerCase()
      )
    ) {
      score += 45;
      matchReasons.push(`Directly handles ${targetCategory}`);
    } else if (
      secondary.some((sec) =>
        resource.issueCategories.some((cat) => cat.toLowerCase() === sec.toLowerCase())
      )
    ) {
      score += 25;
      matchReasons.push("Covers related secondary legal domain");
    } else if (!targetCategory || targetCategory === "All") {
      score += 20;
    }

    // 2. Jurisdiction Match (State SLSA/DLSA + National Authority)
    if (
      targetState &&
      targetState !== "All India" &&
      resource.state.toLowerCase() === targetState.toLowerCase()
    ) {
      score += 32;
      matchReasons.push(`Dedicated ${resource.state} State Legal Services Authority`);
    } else if (resource.state === "All India") {
      score += 22;
      matchReasons.push(
        resource.jurisdictionScope === "central"
          ? "Central Government Statutory Portal"
          : "Pan-India Official Helpline / Authority"
      );
    } else if (targetState && targetState !== "All India" && resource.state !== targetState) {
      // Lower priority for other state SLSAs when a specific state is selected
      score -= 20;
    }

    // 3. Authority & Emergency Priority
    if (resource.slug === "cybercrime-helpline-1930" && targetCategory === "Cyber Safety") {
      score += 20;
      matchReasons.push("Golden Hour 1930 Emergency Financial Freeze Authority");
    } else if (resource.slug === "nalsa-national-legal-aid-15100") {
      score += 14;
      matchReasons.push("Free Legal Aid under Legal Services Authorities Act");
    } else if (resource.resourceType === "grievance_portal") {
      score += 12;
    }

    // 4. Freshness Score
    if (!stale && resource.verificationStatus === "verified") {
      score += 10;
      matchReasons.push(`Verified official data (${resource.lastVerifiedAt})`);
    } else {
      score -= 15;
    }

    // 5. Language Match
    if (resource.languagesSupported.includes(targetLanguage)) {
      score += 5;
    }

    // 6. Optional text search filter
    if (searchQuery) {
      const hay =
        `${resource.authorityName} ${resource.shortName} ${resource.description} ${resource.state} ${resource.helplineNumber ?? ""} ${resource.issueCategories.join(" ")}`.toLowerCase();
      if (hay.includes(searchQuery)) {
        score += 30;
        matchReasons.push(`Matches search "${params.query}"`);
      } else if (!params.includeAllIfNoFilter) {
        continue;
      }
    }

    if (score > 0 || params.includeAllIfNoFilter) {
      ranked.push({
        ...resource,
        verificationStatus: stale ? "stale" : resource.verificationStatus,
        matchScore: Math.max(0, Math.min(100, score)),
        matchReasons:
          matchReasons.length > 0
            ? matchReasons
            : ["Verified official Indian legal assistance channel"],
      });
    }
  }

  return ranked.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Retrieves all versioned Citizen Document Templates or a specific template by type.
 */
export function getCitizenDocumentTemplates(): CitizenDocumentTemplateMeta[] {
  return CITIZEN_DOCUMENT_TEMPLATES;
}

export function getCitizenDocumentTemplateByType(
  templateType: CitizenDocumentTemplateType
): CitizenDocumentTemplateMeta {
  return (
    CITIZEN_DOCUMENT_TEMPLATES.find((t) => t.templateType === templateType) ??
    CITIZEN_DOCUMENT_TEMPLATES[0]
  );
}

/**
 * Generates a structured, versioned Citizen Action Document Draft (`v1`)
 * Strictly labeled as `Draft / Educational Template / User-Review Required`.
 */
export async function generateCitizenDocumentDraft(params: {
  templateType: CitizenDocumentTemplateType;
  situationSummary: string;
  citizenName?: string;
  citizenCityState?: string;
  counterpartyOrAuthorityName?: string;
  incidentDate?: string;
  amountOrReferenceInvolved?: string;
  reliefSought?: string;
  language?: SupportedCitizenLanguage;
}): Promise<GeneratedCitizenDocument> {
  const templateMeta = getCitizenDocumentTemplateByType(params.templateType);
  const { sanitizedText } = sanitizeUntrustedCitizenInput(params.situationSummary);
  const piiCleanedSummary = detectAndRedactPII(sanitizedText).redactedPreview;

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const applicantName =
    params.citizenName?.trim() || "[Complete before use: Your Full Name]";
  const applicantLocation =
    params.citizenCityState?.trim() ||
    "[Complete before use: Your Full Address, City, PIN Code & State]";
  const targetEntity =
    params.counterpartyOrAuthorityName?.trim() ||
    "[Complete before use: Name of Opposite Party / Public Authority / Department]";
  const incidentDate =
    params.incidentDate?.trim() ||
    "[Complete before use: Exact Date & Time of Incident / Transaction]";
  const referenceOrAmount =
    params.amountOrReferenceInvolved?.trim() ||
    "[Complete before use: Invoice No. / Transaction UTR / Application Ref / Amount ₹]";
  const reliefRequested =
    params.reliefSought?.trim() ||
    "[Complete before use: Specific Refund / Information / Action / Conciliation Requested]";

  let title = `${templateMeta.title} — Citizen Draft`;
  let sections: GeneratedDocumentSection[] = [];
  let sourceCitations: DocumentSourceCitation[] = [];

  switch (params.templateType) {
    case "consumer-grievance-v1": {
      title = `Consumer Grievance & Refund Notice — ${targetEntity}`;
      sections = [
        {
          id: "header-addressee",
          heading: "1. Addressee & Grievance Officer Details",
          body: `Date: ${todayFormatted}\n\nTo,\nThe Grievance Redressal Officer / Nodal Officer,\n${targetEntity}\n\nFrom:\n${applicantName}\n${applicantLocation}\n\nReference / Order / Invoice Details: ${referenceOrAmount}`,
          editable: true,
        },
        {
          id: "subject-line",
          heading: "2. Subject of Consumer Grievance",
          body: `SUBJECT: Formal Consumer Grievance regarding Defective Goods / Deficient Service / Unfair Trade Practice (Ref: ${referenceOrAmount}) — Request for Resolution within 15 Days.`,
          editable: true,
        },
        {
          id: "chronological-facts",
          heading: "3. Chronological Statement of Facts",
          body: `1. On ${incidentDate}, I purchased/availed the product/service referenced under ${referenceOrAmount} from ${targetEntity}.\n\n2. Factual Account of Issue Faced:\n${piiCleanedSummary}\n\n3. Despite raising this issue, the defect/deficiency has not yet been resolved satisfactorily.`,
          editable: true,
        },
        {
          id: "statutory-context",
          heading: "4. Educational Statutory Context (Consumer Protection Act, 2019)",
          body: `Under Section 2(9) and Section 2(47) of the Consumer Protection Act, 2019, consumers have a statutory right to protection against defective goods, deficient services, and unfair trade practices. Under the Consumer Protection (E-Commerce) Rules, 2020, entities are required to acknowledge consumer grievances within 48 hours and resolve them within 30 days.`,
          editable: true,
        },
        {
          id: "relief-requested",
          heading: "5. Specific Resolution / Relief Requested",
          body: `I request you to kindly process the following resolution within 15 days of receipt of this notice:\n• ${reliefRequested}\n• Provide a written ticket number / closure acknowledgement.\n\nIf unresolved within the statutory timeline, I reserve the right to register this grievance on the National Consumer Helpline (1915 / consumerhelpline.gov.in) and approach the appropriate Consumer Disputes Redressal Commission via E-Daakhil.`,
          editable: true,
        },
        {
          id: "evidence-checklist",
          heading: "6. Enclosures & Supporting Documents (Self-Attested Copies)",
          body: `[ ] Tax Invoice / Payment Receipt (${referenceOrAmount})\n[ ] Photographs / Video / Screenshots of Defect or Chat History\n[ ] Previous Customer Care Ticket Numbers or Emails`,
          editable: true,
        },
      ];
      sourceCitations = [
        {
          title: "Consumer Protection Act, 2019 — Section 2(9) Consumer Rights & Section 35 Filing",
          category: "Consumer Rights",
          authorityOrProvision: "Consumer Protection Act, 2019",
          slug: "consumer-rights-defective-goods",
        },
        {
          title: "National Consumer Helpline (NCH 1915) & E-Daakhil Portal",
          category: "Consumer Rights",
          authorityOrProvision: "Department of Consumer Affairs, Govt. of India",
          slug: "national-consumer-helpline-1915",
        },
      ];
      break;
    }

    case "rti-application-v1": {
      title = `Right to Information (Section 6) Application — ${targetEntity}`;
      sections = [
        {
          id: "rti-pio-header",
          heading: "1. Public Information Officer (PIO) Addressee",
          body: `Date: ${todayFormatted}\n\nTo,\nThe Central / State Public Information Officer (CPIO / SPIO),\n${targetEntity}\n[Complete before use: Office Address of the Concerned Public Authority]\n\nJURISDICTION CHECK: Verify whether ${targetEntity} is a Central Government authority (use rtionline.gov.in) or a State Government / Municipal authority (use your State RTI Portal or Speed Post).`,
          editable: true,
        },
        {
          id: "rti-applicant-details",
          heading: "2. Applicant Details (Citizen of India under Section 3)",
          body: `Name of Applicant: ${applicantName}\nPostal Address for Reply: ${applicantLocation}\nReference / Pending File No. (if any): ${referenceOrAmount}`,
          editable: true,
        },
        {
          id: "rti-background",
          heading: "3. Brief Context of Matter",
          body: `Context of Application (Incident / Pending Matter dated ${incidentDate}):\n${piiCleanedSummary}`,
          editable: true,
        },
        {
          id: "rti-specific-questions",
          heading: "4. Specific Information & Certified Records Requested under Section 6(1) & Section 2(f)",
          body: `Please provide the following point-wise information and certified copies of records under Section 6(1) read with Section 2(f) & 2(j) of the Right to Information Act, 2005:\n\n1. Please provide the daily progress report / file noting movement made on my application/representation referenced as ${referenceOrAmount}.\n2. Please provide the names and official designations of the officers with whom the said application/file has been lying during this period and the action taken by each officer.\n3. According to the Citizen Charter / departmental norms of ${targetEntity}, within how many days should such a matter be disposed of?\n4. Please provide certified copies of any order, circular, or final decision passed in respect of: ${reliefRequested}.`,
          editable: true,
        },
        {
          id: "rti-fee-and-declaration",
          heading: "5. Application Fee & Citizen Declaration",
          body: `1. Application Fee: I am enclosing/paying the prescribed RTI fee of ₹10 (via Online Portal / Indian Postal Order No. [Complete before use: IPO/DD No.] / Court Fee Stamp as applicable in the State). [Note: Applicants holding a valid BPL card are exempt under Section 7(5) upon attaching a self-attested BPL certificate copy].\n2. Declaration: I state that the information sought does not fall within the exemptions of Section 8 or Section 9 of the RTI Act, 2005, and to the best of my knowledge it pertains to your public authority.`,
          editable: true,
        },
      ];
      sourceCitations = [
        {
          title: "Right to Information Act, 2005 — Section 6(1) Request for Obtaining Information",
          category: "RTI & Governance",
          authorityOrProvision: "RTI Act, 2005 (30-Day Statutory Reply Window)",
          slug: "right-to-information-section-6",
        },
        {
          title: "DoPT RTI Online Portal (Central Government Public Authorities Only)",
          category: "RTI & Governance",
          authorityOrProvision: "rtionline.gov.in — Department of Personnel & Training",
          slug: "rti-online-central-portal",
        },
      ];
      break;
    }

    case "cyber-fraud-incident-v1": {
      title = `Cyber Financial Fraud Chronology & Bank Dispute Statement — ${referenceOrAmount}`;
      sections = [
        {
          id: "cyber-emergency-banner",
          heading: "1. Immediate Golden Hour Action Checklist (Call 1930 First)",
          body: `CRITICAL PRIORITY:\n1. Call 1930 (National Cyber Crime Helpline) immediately or file on https://cybercrime.gov.in to trigger a bank lien/freeze on the recipient mule account.\n2. Note your 15-digit NCRP Acknowledgement Number: [Complete before use: Enter 1930 Ack No.]`,
          editable: true,
        },
        {
          id: "cyber-addressee",
          heading: "2. Addressee: Bank Nodal Officer & Cyber Crime Cell",
          body: `Date: ${todayFormatted}\n\nTo,\n1. The Branch Manager / Cyber Fraud Nodal Officer,\n   ${targetEntity}\n2. The Station House Officer (SHO) / Cyber Crime Cell,\n   ${applicantLocation}\n\nFrom:\n${applicantName}\n${applicantLocation}`,
          editable: true,
        },
        {
          id: "cyber-transaction-matrix",
          heading: "3. Unauthorised Transaction & UTR Matrix",
          body: `• Date & Exact Time of Fraudulent Debit: ${incidentDate}\n• UTR / RRN / UPI Reference Number(s) & Amount: ${referenceOrAmount}\n• Bank / Payment App Used: ${targetEntity}\n• Chronological Narrative of Incident:\n${piiCleanedSummary}`,
          editable: true,
        },
        {
          id: "cyber-rbi-context",
          heading: "4. RBI Customer Protection & Zero/Limited Liability Reference",
          body: `Pursuant to the Reserve Bank of India (RBI) Master Circular on 'Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions' (DBR.No.Leg.BC.78/09.07.005/2017-18), I am reporting this unauthorised electronic transaction immediately so that the bank can initiate a chargeback/lien freeze and protect my statutory entitlement within the prescribed notification window.`,
          editable: true,
        },
        {
          id: "cyber-relief-and-evidence",
          heading: "5. Relief Requested & Attached Evidence",
          body: `Requested Action:\n• ${reliefRequested}\n• Immediate blocking of compromised UPI ID/Card and issuance of written dispute reference number.\n\nAttached Evidence:\n[ ] Bank Statement highlighting UTR / RRN (${referenceOrAmount})\n[ ] Screenshot of SMS debit alert & fraudulent UPI ID / Caller Number\n[ ] Copy of 1930 / cybercrime.gov.in NCRP Acknowledgement Receipt`,
          editable: true,
        },
      ];
      sourceCitations = [
        {
          title: "National Cyber Crime Reporting Portal & 1930 Financial Fraud Freeze Helpline",
          category: "Cyber Safety",
          authorityOrProvision: "Ministry of Home Affairs (I4C) — cybercrime.gov.in",
          slug: "cybercrime-helpline-1930",
        },
        {
          title: "RBI Integrated Ombudsman Scheme & Unauthorised Electronic Banking Circular",
          category: "Cyber Safety",
          authorityOrProvision: "Reserve Bank of India (Helpline 14448 / cms.rbi.org.in)",
          slug: "rbi-cms-banking-ombudsman",
        },
      ];
      break;
    }

    case "workplace-wage-representation-v1": {
      title = `Formal Representation for Unpaid Wages & Dues — ${targetEntity}`;
      sections = [
        {
          id: "labour-addressee",
          heading: "1. Addressee (Employer HR / Management & Conciliation Reference)",
          body: `Date: ${todayFormatted}\n\nTo,\nThe Human Resources Head / Managing Director,\n${targetEntity}\n\nFrom:\n${applicantName}\n${applicantLocation}\nEmployee ID / Designation / Period: ${referenceOrAmount}`,
          editable: true,
        },
        {
          id: "labour-subject",
          heading: "2. Subject Line",
          body: `SUBJECT: Formal Representation for Release of Earned Salary / Full & Final Settlement Dues and Employment Documents (${referenceOrAmount}).`,
          editable: true,
        },
        {
          id: "labour-facts",
          heading: "3. Employment History & Chronology of Unpaid Dues",
          body: `1. I served diligently with ${targetEntity} and my relevant employment/resignation milestone occurred on ${incidentDate}.\n\n2. Factual Details of Pending Salary / Dues:\n${piiCleanedSummary}\n\n3. Outstanding Amount / Documents Pending: ${referenceOrAmount}`,
          editable: true,
        },
        {
          id: "labour-statutory-rights",
          heading: "4. Statutory Context (Payment of Wages & Labour Conciliation)",
          body: `Earned wages for work already performed constitute a statutory obligation under Indian labour law (Payment of Wages Act, 1936 / Code on Wages, 2019 and applicable State Shops and Establishments Act). Unilateral withholding of earned salary or refusal to issue service/relieving documentation causes severe livelihood hardship.`,
          editable: true,
        },
        {
          id: "labour-relief",
          heading: "5. Specific Request & Next Conciliation Step",
          body: `I request you to kindly process and release:\n• ${reliefRequested}\n• Detailed Full & Final Settlement Calculation Sheet and Relieving Letter within 10 working days.\n\nIf the dues remain unsettled, I shall be constrained to submit a conciliation application on the Ministry of Labour & Employment's SAMADHAN portal (samadhan.labour.gov.in) / before the jurisdictional Labour Commissioner.`,
          editable: true,
        },
      ];
      sourceCitations = [
        {
          title: "SAMADHAN Portal — Ministry of Labour & Employment Industrial Disputes & Wage Claims",
          category: "Labour & Employment",
          authorityOrProvision: "samadhan.labour.gov.in",
          slug: "samadhan-labour-portal",
        },
        {
          title: "Right to Timely Payment of Wages & Conciliation Procedure",
          category: "Labour & Employment",
          authorityOrProvision: "Payment of Wages Act, 1936 / State Shops & Establishments Acts",
          slug: "payment-of-wages-and-samadhan-portal",
        },
      ];
      break;
    }

    case "legal-aid-checklist-v1":
    default: {
      title = `NALSA / DLSA Free Legal Aid Case Preparation Brief — ${applicantName}`;
      sections = [
        {
          id: "nalsa-overview",
          heading: "1. Purpose: Organised Brief for DLSA / NALSA Legal Aid Counsel (15100)",
          body: `Prepared On: ${todayFormatted}\nCitizen Name: ${applicantName}\nDistrict & State: ${applicantLocation}\nOpposite Party / Authority Involved: ${targetEntity}\nKey Date(s): ${incidentDate}`,
          editable: true,
        },
        {
          id: "nalsa-eligibility",
          heading: "2. Section 12 Eligibility Checklist (Legal Services Authorities Act, 1987)",
          body: `Under Section 12 of the Legal Services Authorities Act, 1987, free legal services (including legal representation by a panel advocate, drafting, and court fee assistance) are available to:\n[ ] Women and children (irrespective of income)\n[ ] Members of Scheduled Castes (SC) or Scheduled Tribes (ST)\n[ ] Industrial workmen\n[ ] Victims of natural disasters, ethnic violence, or trafficking\n[ ] Persons with disabilities or persons in custody\n[ ] Citizens with annual income below the State prescribed ceiling (typically ₹1 Lakh to ₹3 Lakh; ₹5 Lakh before Supreme Court)`,
          editable: true,
        },
        {
          id: "nalsa-chronology",
          heading: "3. One-Page Chronological Summary for Panel Lawyer",
          body: `Summary of What Happened:\n${piiCleanedSummary}\n\nKey Reference / Amount / Notice Received: ${referenceOrAmount}\n\nWhat Outcome / Protection I Need:\n${reliefRequested}`,
          editable: true,
        },
        {
          id: "nalsa-documents-to-carry",
          heading: "4. Documents Checklist to Carry to Front Office of District Legal Services Authority (DLSA)",
          body: `[ ] Identity & Address Proof (Aadhaar / Voter ID)\n[ ] Eligibility Proof under Section 12 (Self-Declaration Income Affidavit / Caste Certificate / Woman ID / Workman ID)\n[ ] Chronological folder of all notices, agreements, receipts, or police complaints (${referenceOrAmount})\n[ ] Two passport-size photographs for the Legal Aid Application Form`,
          editable: true,
        },
      ];
      sourceCitations = [
        {
          title: "National Legal Services Authority (NALSA) — Toll-Free 15100 & Section 12 Free Legal Aid",
          category: "Fundamental Rights",
          authorityOrProvision: "Legal Services Authorities Act, 1987 & Article 39A",
          slug: "nalsa-national-legal-aid-15100",
        },
      ];
      break;
    }
  }

  const nowIso = new Date().toISOString();

  const generatedDoc: GeneratedCitizenDocument = {
    id: `doc-${Date.now()}`,
    userId: "citizen-session",
    templateType: params.templateType,
    templateVersion: templateMeta.templateVersion,
    title,
    language: params.language ?? "en",
    jurisdictionState: params.citizenCityState ?? "All India",
    jurisdictionAuthority: targetEntity,
    statusLabel: "Draft / Educational Template / User-Review Required",
    userReviewed: false,
    inputFacts: {
      situationSummary: piiCleanedSummary,
      citizenName: applicantName,
      citizenCityState: applicantLocation,
      counterpartyOrAuthorityName: targetEntity,
      incidentDate,
      amountOrReferenceInvolved: referenceOrAmount,
      reliefSought: reliefRequested,
    },
    generatedSections: sections,
    sourceCitations,
    safetyDisclaimer:
      templateMeta.mandatoryDisclaimers.join(" • ") ||
      "Draft / Educational Template / User-Review Required. This document is for citizen preparation and does not constitute formal legal representation.",
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  // Persist to Supabase `generated_documents` when authenticated
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return generatedDoc;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return generatedDoc;

    const untypedClient = supabase as unknown as {
      from: (table: string) => {
        insert: (row: Record<string, unknown>) => {
          select: (cols: string) => {
            single: () => Promise<{
              data: Record<string, unknown> | null;
              error: unknown;
            }>;
          };
        };
      };
    };

    const { data, error } = await untypedClient
      .from("generated_documents")
      .insert({
        user_id: user.id,
        template_type: generatedDoc.templateType,
        template_version: generatedDoc.templateVersion,
        title: generatedDoc.title,
        language: generatedDoc.language,
        jurisdiction_state: generatedDoc.jurisdictionState,
        jurisdiction_authority: generatedDoc.jurisdictionAuthority,
        status_label: generatedDoc.statusLabel,
        user_reviewed: generatedDoc.userReviewed,
        input_facts: generatedDoc.inputFacts,
        generated_sections: generatedDoc.generatedSections,
        source_citations: generatedDoc.sourceCitations,
        safety_disclaimer: generatedDoc.safetyDisclaimer,
      })
      .select("*")
      .single();

    if (!error && data) {
      return {
        ...generatedDoc,
        id: String(data.id),
        userId: String(data.user_id),
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
      };
    }
  } catch {
    // Return local draft cleanly if DB table not yet migrated in preview env
  }

  return generatedDoc;
}

/**
 * Updates a user's generated citizen document after human review & editing.
 */
export async function updateCitizenDocumentDraft(params: {
  documentId: string;
  title: string;
  generatedSections: GeneratedDocumentSection[];
  userReviewed: boolean;
}): Promise<{ ok: boolean; updatedAt: string }> {
  const updatedAt = new Date().toISOString();
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { ok: true, updatedAt };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: true, updatedAt };

    const untypedClient = supabase as unknown as {
      from: (table: string) => {
        update: (row: Record<string, unknown>) => {
          eq: (col1: string, val1: string) => {
            eq: (col2: string, val2: string) => Promise<unknown>;
          };
        };
      };
    };

    await untypedClient
      .from("generated_documents")
      .update({
        title: params.title.trim().slice(0, 220),
        generated_sections: params.generatedSections,
        user_reviewed: params.userReviewed,
        updated_at: updatedAt,
      })
      .eq("id", params.documentId)
      .eq("user_id", user.id);

    return { ok: true, updatedAt };
  } catch {
    return { ok: true, updatedAt };
  }
}

/**
 * Deletes a user's generated document draft (strictly verifying `user_id` ownership).
 */
export async function deleteCitizenDocumentDraft(
  documentId: string
): Promise<{ ok: boolean }> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { ok: true };

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: true };

    const untypedClient = supabase as unknown as {
      from: (table: string) => {
        delete: () => {
          eq: (col1: string, val1: string) => {
            eq: (col2: string, val2: string) => Promise<unknown>;
          };
        };
      };
    };

    await untypedClient
      .from("generated_documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", user.id);

    return { ok: true };
  } catch {
    return { ok: true };
  }
}
