import type {
  LokAdalatReadinessItem,
  LokAdalatSimulatorInput,
  LokAdalatSimulatorOutput,
} from "@/types/action-engine";

export const LOK_ADALAT_MANDATORY_DISCLAIMER =
  "This simulator is educational and does not determine legal eligibility or guarantee referral/settlement. Whether a dispute can be taken up or settled in a Lok Adalat depends on statutory compoundability under the Legal Services Authorities Act, 1987, the specific facts, and the voluntary consent of the parties.";

/**
 * Structured 8-Area Readiness Checklist (Phase 26)
 * Does not require unnecessary sensitive personal data.
 */
export const LOK_ADALAT_READINESS_CHECKLIST: LokAdalatReadinessItem[] = [
  {
    id: "la-check-basic-facts",
    category: "Basic facts",
    title: "One-paragraph plain summary of what happened",
    description:
      "Note the core issue (e.g., disputed electricity bill, unpaid security deposit, bank loan OTS, or motor accident claim) in 4–5 factual sentences.",
    requiredForBrief: true,
  },
  {
    id: "la-check-parties",
    category: "Parties involved",
    title: "Full name and address of the opposite party / department",
    description:
      "Needed so the District Legal Services Authority (DLSA) or Permanent Lok Adalat knows whom to send the pre-litigation conciliation notice to.",
    requiredForBrief: true,
  },
  {
    id: "la-check-documents",
    category: "Relevant documents",
    title: "Self-attested copies of bills, agreements, or sanction letters",
    description:
      "Keep photocopies (never hand over your sole original document without a receipt) of invoices, rent agreements, loan statements, or challans.",
    requiredForBrief: true,
  },
  {
    id: "la-check-existing-case",
    category: "Existing case information",
    title: "Court name, Case/CNR number & next hearing date (if already in court)",
    description:
      "If a case is already pending in a court, note the CNR number so you can ask the court or DLSA about Section 20 referral.",
    requiredForBrief: false,
  },
  {
    id: "la-check-contact",
    category: "Contact details",
    title: "Reachable phone number, email, or postal address for notices",
    description:
      "Ensures both you and the opposite party can receive official Lok Adalat sitting dates or video-conferencing links.",
    requiredForBrief: false,
  },
  {
    id: "la-check-dates",
    category: "Important dates",
    title: "Key dates of transaction, notice, or cause of action",
    description:
      "Important for checking statutory limitation timelines if conciliation does not result in a settlement.",
    requiredForBrief: true,
  },
  {
    id: "la-check-communications",
    category: "Previous communications",
    title: "Summary of prior complaint tickets, emails, or demand letters",
    description:
      "Shows the conciliator / panel member what efforts were already made to resolve the dispute.",
    requiredForBrief: false,
  },
  {
    id: "la-check-desired-resolution",
    category: "Desired resolution",
    title: "Practical settlement range you are willing to accept",
    description:
      "Write down your realistic resolution goal (e.g., principal refund, penalty waiver, installment plan, or document return).",
    requiredForBrief: true,
  },
];

/**
 * Deterministic Educational Pathway Evaluator for Lok Adalat / ADR Readiness.
 * Strictly educational — NEVER decides legal eligibility with certainty.
 */
export function evaluateLokAdalatEducationalPathway(
  input: LokAdalatSimulatorInput
): LokAdalatSimulatorOutput {
  const isNonCompoundableOrUrgent =
    input.disputeCategory === "non_compoundable_criminal_offence" ||
    input.disputeCategory === "urgent_safety_or_cyber_freeze" ||
    input.settlementCapability === "requires_criminal_prosecution_or_injunction";

  const isNoWillingness = input.willingness === "no_willingness_to_settle";

  if (isNonCompoundableOrUrgent) {
    return {
      headline:
        "This situation generally requires statutory police/regulatory action or regular court proceedings rather than Lok Adalat compromise.",
      relevanceSignal: "not_typical_for_lok_adalat",
      whatLokAdalatMeans:
        "Under the Proviso to Section 19(5) of the Legal Services Authorities Act, 1987, a Lok Adalat has no jurisdiction over offences that are non-compoundable under any law, nor does it issue emergency police freezes or ex-parte injunctions.",
      whatSettlementMeans:
        "Lok Adalat is designed for voluntary, mutual compromise in civil, compoundable, utility, or monetary disputes. Urgent financial fraud (Golden Hour 1930) or serious criminal offences require immediate statutory reporting.",
      statutoryBasis: [
        {
          provision: "Proviso to Section 19(5), Legal Services Authorities Act, 1987",
          summary:
            "Explicitly excludes non-compoundable criminal offences from Lok Adalat jurisdiction.",
          sourceUrl: "https://nalsa.gov.in/acts-rules",
        },
        {
          provision: "Section 12, Legal Services Authorities Act, 1987",
          summary:
            "Even where Lok Adalat settlement is not applicable, eligible citizens can still request a free Legal Aid Panel Advocate through their DLSA (15100) for regular court representation.",
          sourceUrl: "https://nalsa.gov.in/",
        },
      ],
      whyThisPathwayAppears: [
        input.disputeCategory === "urgent_safety_or_cyber_freeze"
          ? "Active cyber fraud or personal safety emergencies require immediate action via 1930 (Cyber Helpline) or 112/Police FIR rather than mediation."
          : "Matters involving non-compoundable offences or urgent coercive court orders are handled by regular courts and statutory authorities.",
        "You can still approach your District Legal Services Authority (DLSA / 15100) for free legal advice and representation by a Panel Lawyer.",
      ],
      whenNotAppropriate: [
        "Non-compoundable criminal offences under BNS / special statutes",
        "Emergency bank account lien freeze (use 1930 / cybercrime.gov.in immediately)",
        "Situations requiring an urgent stay order or police protection",
      ],
      questionsToAskDlsaOrLawyer: [
        "Am I eligible for a free Panel Advocate under Section 12 of the Legal Services Authorities Act, 1987 to represent me before the regular court or authority?",
        "What immediate statutory complaint or FIR should be filed to protect my rights within the limitation window?",
      ],
      readinessChecklist: LOK_ADALAT_READINESS_CHECKLIST,
      mandatoryEducationalDisclaimer: LOK_ADALAT_MANDATORY_DISCLAIMER,
    };
  }

  if (isNoWillingness) {
    return {
      headline:
        "Lok Adalat relies on voluntary mutual compromise — if neither side wishes to settle, regular statutory forums may be more relevant to explore.",
      relevanceSignal: "depends_on_compoundability_and_consent",
      whatLokAdalatMeans:
        "A Lok Adalat ('People's Court') organized by NALSA/SLSA/DLSA under Section 19 of the Legal Services Authorities Act, 1987 facilitates amicable settlement without court fees.",
      whatSettlementMeans:
        "Under Section 20(5) of the LSA Act, if no compromise or settlement is arrived at between the parties, the record is returned to the court or the applicant is advised to seek remedy in the appropriate court/commission.",
      statutoryBasis: [
        {
          provision: "Section 20(4) & 20(5), Legal Services Authorities Act, 1987",
          summary:
            "Lok Adalat is guided by principles of justice, equity, and fair play to help parties reach a voluntary compromise; if no settlement is reached, parties retain their full right to contest in court.",
          sourceUrl: "https://nalsa.gov.in/lok-adalat",
        },
        {
          provision: "Section 22B, Legal Services Authorities Act, 1987 (Permanent Lok Adalat)",
          summary:
            "Note: For Public Utility Services (Electricity, Water, Telecom, Transport, Insurance, Hospital/Postal), a Permanent Lok Adalat can first attempt conciliation and, if needed, decide the dispute on merits up to the notified pecuniary limit.",
          sourceUrl: "https://nalsa.gov.in/lok-adalat",
        },
      ],
      whyThisPathwayAppears: [
        "The category of dispute you selected is often capable of conciliation, but you indicated there is currently no willingness to explore compromise.",
        input.disputeCategory === "public_utility_electricity_water_telecom"
          ? "Because this involves a Public Utility Service, you may ask your DLSA specifically about Permanent Lok Adalat (Section 22B) vs Consumer Commission."
          : "You may still request a Pre-Litigation Conciliation Notice through your DLSA Front Office to test whether the opposite party responds when summoned officially.",
      ],
      whenNotAppropriate: [
        "When you require a contested trial on disputed evidence rather than a mutually agreed settlement",
        "When the opposite party refuses all conciliation and the matter is not a Section 22B Public Utility Service",
      ],
      questionsToAskDlsaOrLawyer: [
        "Would sending an official Pre-Litigation Conciliation Notice from the DLSA Front Office encourage the opposite party to negotiate?",
        "If the opposite party does not appear or refuses settlement, which Consumer Commission, Labour Authority, or Civil Court has jurisdiction?",
      ],
      readinessChecklist: LOK_ADALAT_READINESS_CHECKLIST,
      mandatoryEducationalDisclaimer: LOK_ADALAT_MANDATORY_DISCLAIMER,
    };
  }

  // General Lok Adalat / Pre-Litigation Conciliation Educational Pathway
  const stageExplanation =
    input.courtStage === "pre_litigation_no_case_filed"
      ? "Because your matter is not yet in court, you can learn about Pre-Litigation Lok Adalat / Conciliation under Section 19(5)(ii) (or Permanent Lok Adalat under Section 22B for Public Utility Services) by submitting a simple application at your District Legal Services Authority (DLSA) Front Office."
      : input.courtStage === "pending_in_court"
        ? "Because your matter is already pending before a court, Section 20(1) of the Legal Services Authorities Act, 1987 allows either party (or both parties jointly) to request the court to refer the case to the upcoming National or District Lok Adalat."
        : "Whether your dispute is at the pre-litigation stage (no case filed yet) or already pending in court, the Legal Services Authorities Act, 1987 provides a zero-fee Lok Adalat conciliation pathway.";

  return {
    headline:
      "Your situation may be worth learning about Lok Adalat / ADR pathways.",
    relevanceSignal: "commonly_explored_in_lok_adalat",
    whatLokAdalatMeans:
      "Lok Adalat is a statutory Alternative Dispute Resolution (ADR) forum organized by NALSA, State Legal Services Authorities (SLSAs), and District Legal Services Authorities (DLSAs) under the Legal Services Authorities Act, 1987. There is NO court fee to apply, and if a pending court case settles in Lok Adalat, the court fee originally paid is refundable under Section 21(1).",
    whatSettlementMeans:
      "In a Lok Adalat, neutral conciliators (typically a serving or retired judicial officer and a social/legal panel member) assist both sides in reaching a fair, voluntary compromise. Under Section 21 of the LSA Act, an award signed by both parties is deemed to be a decree of a Civil Court and is final and binding—Wait to sign only if you fully agree with the written settlement terms.",
    statutoryBasis: [
      {
        provision: "Section 19(5)(ii) & Section 20, Legal Services Authorities Act, 1987",
        summary:
          "Empowers Lok Adalats to take up both pending court cases and pre-litigation disputes falling within the jurisdiction of local courts.",
        sourceUrl: "https://nalsa.gov.in/lok-adalat",
      },
      {
        provision: "Section 21, Legal Services Authorities Act, 1987",
        summary:
          "Every award of the Lok Adalat is deemed to be a decree of a civil court, with refund of court fees under the Court-Fees Act, 1870 upon settlement.",
        sourceUrl: "https://nalsa.gov.in/acts-rules",
      },
      {
        provision: "Section 22B, Legal Services Authorities Act, 1987",
        summary:
          "Permanent Lok Adalats handle Public Utility Services (Electricity, Water, Telecom, Transport, Insurance, Postal/Sanitation) at the pre-litigation stage.",
        sourceUrl: "https://nalsa.gov.in/lok-adalat",
      },
    ],
    whyThisPathwayAppears: [
      stageExplanation,
      "Disputes involving utility bills, motor accident claims (MACT), banking/loan recovery, consumer refunds, tenancy deposits, and compoundable family/workplace claims are among the most common matters resolved in National and District Lok Adalats.",
      "No party can be forced to sign a settlement in Lok Adalat—if a mutually acceptable figure is not reached, your right to approach the regular court or commission remains intact.",
    ],
    whenNotAppropriate: [
      "Non-compoundable criminal offences (excluded by Proviso to Section 19(5))",
      "If you are pressured to accept a settlement amount you do not voluntarily agree with",
      "If urgent interim relief / immediate account freeze (e.g. 1930 cybercrime) is needed today",
    ],
    questionsToAskDlsaOrLawyer: [
      "Can I file a Pre-Litigation Application at the DLSA Front Office so a conciliation notice is sent to the opposite party?",
      "Does my dispute fall under the Permanent Lok Adalat (Public Utility Services) under Section 22B or the periodic National/District Lok Adalat?",
      "What documents and calculation sheet should I bring on the date of the Lok Adalat sitting?",
      "If the opposite party does not attend or no settlement is reached, how soon will the non-settlement certificate be issued so I can file in the regular forum?",
    ],
    readinessChecklist: LOK_ADALAT_READINESS_CHECKLIST,
    mandatoryEducationalDisclaimer: LOK_ADALAT_MANDATORY_DISCLAIMER,
  };
}
