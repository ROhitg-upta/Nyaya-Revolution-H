/**
 * Mock AI service for frontend development.
 *
 * Returns pre-built structured responses based on keyword matching. Simulates
 * streaming with chunked delivery and realistic latency. Swap one line in
 * `services/ai/index.ts` to replace with the real Gemini service.
 */
import type {
  AIStreamChunk,
  FollowUpSuggestion,
  PromptContext,
  StructuredResponse,
} from "@/types";
import type { AIService } from "./ai-service";

const SIMULATED_DELAY = 600;
const CHUNK_DELAY = 40;

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const MOCK_RESPONSES: Record<string, StructuredResponse> = {
  landlord: {
    situationSummary:
      "Your landlord is withholding your security deposit after you've vacated the premises. Under Indian law, tenants have clear rights regarding the return of security deposits, and there are established legal channels to recover your money.",
    rights: [
      "Right to receive your security deposit back within a reasonable period after vacating",
      "Right to receive an itemised list of deductions, if any",
      "Right to dispute unfair deductions through legal channels",
      "Right to file a complaint in the Rent Authority or civil court",
      "Right to claim interest on the withheld deposit amount in some states",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        section: "Section 13",
        description:
          "Mandates that the landlord shall refund the security deposit after adjusting any dues, within one month of the tenant vacating the premises.",
      },
      {
        name: "State Rent Control Acts",
        section: "Varies by state",
        description:
          "Each state has its own Rent Control Act that may provide additional protections regarding deposits. Check your state's specific legislation.",
      },
      {
        name: "Indian Contract Act, 1872",
        section: "Section 73 & 74",
        description:
          "Provisions related to compensation for breach of contract — applicable if the landlord violates the rental agreement terms.",
      },
    ],
    immediateActions: [
      "Send a written notice (email + registered post) to your landlord requesting the deposit return within 15 days",
      "Keep a copy of your rent agreement, deposit receipts, and all communication",
      "Document the condition of the property when you left (photos, videos, move-out checklist)",
      "If no response, send a legal notice through a lawyer (costs ₹1,000–3,000 typically)",
      "File a complaint with the Rent Authority in your district",
      "As a last resort, file a civil suit in the appropriate court",
    ],
    documentsRequired: [
      "Original rent/lease agreement",
      "Deposit payment receipt or bank transfer proof",
      "Written communication (emails, messages) with landlord",
      "Photos/videos of property condition at move-out",
      "Move-out acknowledgement (if available)",
      "Utility bill clearance receipts",
    ],
    authorities: [
      {
        name: "District Rent Authority",
        description:
          "The first point of contact for tenant-landlord disputes. File a complaint for deposit recovery.",
      },
      {
        name: "District Consumer Forum",
        description:
          "If the landlord provides housing as a service, you may file under the Consumer Protection Act.",
      },
      {
        name: "Civil Court",
        description:
          "File a money recovery suit if other remedies fail. Consult a lawyer for this step.",
      },
    ],
    commonMistakes: [
      "Vacating without written notice or without documenting the property condition",
      "Not keeping copies of rent receipts or transfer proofs",
      "Agreeing to verbal promises about deposit return without written confirmation",
      "Waiting too long to take action — there are limitation periods",
      "Signing a 'no claims' document at move-out under pressure",
    ],
    learningJourney: {
      title: "Tenant Rights Mastery",
      slug: "tenant-rights",
      lessons: 8,
    },
    quiz: {
      title: "Test Your Tenant Rights Knowledge",
      questions: 5,
      slug: "tenant-rights-quiz",
    },
    professionalHelp:
      "If the deposit amount is significant (above ₹50,000) or the landlord is being aggressive, consult a property lawyer. Many offer free initial consultations. You can also reach out to local legal aid services if you cannot afford a lawyer.",
  },
  salary: {
    situationSummary:
      "Your employer has not paid your salary for an extended period. Indian labour laws provide strong protections for wage payment, and there are multiple channels — from internal grievance to government authorities — to recover your dues.",
    rights: [
      "Right to receive wages on time as per your employment contract",
      "Right to receive a payslip detailing salary components and deductions",
      "Right to file a complaint with the Labour Commissioner without fear of termination",
      "Right to claim compensation for delayed payment",
      "Right to resign and still claim unpaid wages",
    ],
    laws: [
      {
        name: "Payment of Wages Act, 1936",
        section: "Section 3 & 5",
        description:
          "Mandates that wages be paid before the 7th or 10th day of the following month depending on establishment size.",
      },
      {
        name: "Code on Wages, 2019",
        section: "Section 17",
        description:
          "Consolidates wage-related laws. Employers must pay wages within the stipulated time period. Violations attract penalties.",
      },
      {
        name: "Industrial Disputes Act, 1947",
        section: "Section 33C",
        description:
          "Allows workers to recover money due from an employer through the Labour Court.",
      },
    ],
    immediateActions: [
      "Send a formal written request (email) to HR and your manager documenting unpaid months",
      "Keep copies of your appointment letter, salary slips, and bank statements showing non-payment",
      "File a complaint with the Labour Commissioner of your district",
      "If no resolution, approach the Labour Court under the ID Act",
      "Consider filing under the Payment of Wages Act for quick recovery",
    ],
    documentsRequired: [
      "Appointment/offer letter with salary details",
      "Previous salary slips or pay stubs",
      "Bank statements showing salary credit history and gap",
      "Employment contract or agreement",
      "Written communication with employer about the salary delay",
      "ID proof and address proof for filing complaints",
    ],
    authorities: [
      {
        name: "Labour Commissioner",
        description:
          "File a complaint for unpaid wages. The office will summon the employer for conciliation.",
        contact: "District Labour Commissioner Office",
      },
      {
        name: "Labour Court",
        description:
          "For recovery of wages and compensation if conciliation fails.",
      },
      {
        name: "EPFO (if applicable)",
        description:
          "If PF contributions are also unpaid, file a complaint with the Employees' Provident Fund Organisation.",
        contact: "epfindia.gov.in",
      },
    ],
    commonMistakes: [
      "Not documenting the salary delay in writing (verbal complaints are hard to prove)",
      "Resigning impulsively without filing a complaint first",
      "Not checking if your company falls under the Shops & Establishments Act",
      "Ignoring PF and ESI non-payment alongside salary delays",
      "Accepting partial payment without written acknowledgement of remaining dues",
    ],
    learningJourney: {
      title: "Worker Rights Essentials",
      slug: "worker-rights",
      lessons: 10,
    },
    quiz: {
      title: "Know Your Workplace Rights",
      questions: 5,
      slug: "worker-rights-quiz",
    },
    professionalHelp:
      "For salary amounts exceeding ₹1 lakh or complex cases (wrongful termination alongside non-payment), consult a labour lawyer. Many states offer free legal aid for workers through the District Legal Services Authority (DLSA).",
  },
  scam: {
    situationSummary:
      "You've been targeted by an online scam — a fraudulent transaction, phishing link, or fake website. Cyber fraud is a criminal offence in India, and you have clear legal remedies to report, recover, and protect yourself.",
    rights: [
      "Right to file an FIR at any police station (Zero FIR — cannot be refused)",
      "Right to report cybercrime online through the National Cyber Crime Reporting Portal",
      "Right to request your bank to reverse fraudulent transactions within the RBI's timeframe",
      "Right to privacy and protection of your personal data",
      "Right to compensation under the IT Act for data breaches",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        section: "Section 66C & 66D",
        description:
          "Covers identity theft and cheating by personation using computer resources. Punishable with imprisonment up to 3 years and fine.",
      },
      {
        name: "Indian Penal Code (BNS 2023)",
        section: "Section 318 (formerly 420 IPC)",
        description:
          "Cheating and dishonestly inducing delivery of property. Applicable to most online fraud cases.",
      },
      {
        name: "RBI Circular on Unauthorised Electronic Transactions",
        section: "RBI/2017-18/15",
        description:
          "Limits customer liability for unauthorised bank transactions if reported within 3 working days.",
      },
    ],
    immediateActions: [
      "Immediately call your bank's helpline and block your card/freeze the account",
      "Report the incident on cybercrime.gov.in within 24 hours (Helpline: 1930)",
      "File an FIR at your nearest police station — carry screenshots and transaction details",
      "Do NOT click any more links, do NOT share OTPs, do NOT engage with the scammer",
      "Change passwords on all accounts that may be compromised",
      "Enable 2-factor authentication on email and banking apps",
    ],
    documentsRequired: [
      "Screenshots of the scam (messages, emails, fake website)",
      "Bank/UPI transaction records showing the fraudulent transfer",
      "Communication with the scammer (WhatsApp chats, emails)",
      "Your ID proof for filing the complaint",
      "Any receipts or order confirmations from the fake service",
    ],
    authorities: [
      {
        name: "Cyber Crime Portal",
        description:
          "File online at cybercrime.gov.in — India's official cybercrime reporting platform.",
        contact: "1930",
      },
      {
        name: "Local Police Station",
        description:
          "File a Zero FIR — they cannot refuse. Carry all evidence.",
      },
      {
        name: "Banking Ombudsman (RBI)",
        description:
          "If your bank doesn't cooperate with reversal, escalate to the RBI Ombudsman.",
        contact: "cms.rbi.org.in",
      },
    ],
    commonMistakes: [
      "Delaying the report — the first 24-48 hours are critical for fund recovery",
      "Deleting evidence (messages, emails) thinking it's over",
      "Engaging with the scammer further or trying to 'negotiate'",
      "Not informing your bank immediately about the unauthorised transaction",
      "Sharing the incident on social media before filing an FIR (can complicate the case)",
    ],
    learningJourney: {
      title: "Cyber Safety Essentials",
      slug: "cyber-safety",
      lessons: 6,
    },
    quiz: {
      title: "Can You Spot a Scam?",
      questions: 5,
      slug: "cyber-scam-quiz",
    },
    professionalHelp:
      "If you've lost a significant amount (above ₹25,000), consider hiring a cyber-crime lawyer. The National Legal Services Authority (NALSA) provides free legal aid. For bank dispute resolution, the RBI Ombudsman process is free.",
  },
};

const DEFAULT_RESPONSE: StructuredResponse = {
  situationSummary:
    "Based on your question, here's a general overview of the legal landscape in India that applies to your situation. Understanding your rights is the first step toward resolving any issue.",
  rights: [
    "Right to access justice through courts and tribunals",
    "Right to legal aid if you cannot afford a lawyer (Article 39A)",
    "Right to information about your case and applicable laws",
    "Right to fair treatment and due process under Article 21",
  ],
  laws: [
    {
      name: "Constitution of India",
      section: "Article 14, 19, 21",
      description:
        "Fundamental rights to equality, freedom, and life & personal liberty — the foundation of all other legal protections.",
    },
    {
      name: "Legal Services Authorities Act, 1987",
      section: "Section 12",
      description:
        "Provides free legal aid to eligible persons including women, children, SC/ST members, and persons with disabilities.",
    },
  ],
  immediateActions: [
    "Document your situation in writing with dates, names, and specifics",
    "Gather all relevant documents, receipts, and communication records",
    "Consult with a legal professional or visit your nearest Legal Aid Centre",
    "File a formal complaint with the appropriate authority",
  ],
  documentsRequired: [
    "Identity proof (Aadhaar, PAN, or Voter ID)",
    "Address proof",
    "All relevant documents specific to your situation",
    "Written chronology of events",
  ],
  authorities: [
    {
      name: "District Legal Services Authority (DLSA)",
      description:
        "Provides free legal aid and advice. Visit your nearest DLSA office.",
    },
    {
      name: "National Consumer Helpline",
      description: "For consumer-related grievances.",
      contact: "1800-11-4000",
    },
  ],
  commonMistakes: [
    "Not documenting events and communications in writing",
    "Ignoring legal timelines and limitation periods",
    "Not seeking professional legal advice early enough",
    "Relying solely on verbal agreements or promises",
  ],
  learningJourney: {
    title: "Know Your Fundamental Rights",
    slug: "fundamental-rights",
    lessons: 5,
  },
  quiz: {
    title: "Fundamental Rights Quiz",
    questions: 5,
    slug: "fundamental-rights-quiz",
  },
  professionalHelp:
    "You can access free legal aid through the District Legal Services Authority (DLSA) in your district. Alternatively, many lawyers offer free initial consultations. For online assistance, visit nalsa.gov.in.",
};

function matchResponse(question: string): StructuredResponse {
  const q = question.toLowerCase();

  if (
    q.includes("landlord") ||
    q.includes("deposit") ||
    q.includes("rent") ||
    q.includes("tenant")
  )
    return MOCK_RESPONSES.landlord;
  if (
    q.includes("salary") ||
    q.includes("employer") ||
    q.includes("wage") ||
    q.includes("pay")
  )
    return MOCK_RESPONSES.salary;
  if (
    q.includes("scam") ||
    q.includes("fraud") ||
    q.includes("fake") ||
    q.includes("phishing") ||
    q.includes("cyber") ||
    q.includes("online")
  )
    return MOCK_RESPONSES.scam;

  return DEFAULT_RESPONSE;
}

function generateFollowUps(
  structured: StructuredResponse,
): FollowUpSuggestion[] {
  const followUps: FollowUpSuggestion[] = [];

  if (structured.learningJourney) {
    followUps.push({
      type: "course",
      label: structured.learningJourney.title,
      description: `${structured.learningJourney.lessons} lessons to master this topic.`,
      href: `/learn/${structured.learningJourney.slug}`,
    });
  }

  if (structured.quiz) {
    followUps.push({
      type: "quiz",
      label: structured.quiz.title,
      description: `${structured.quiz.questions} questions to test your understanding.`,
    });
  }

  followUps.push({
    type: "situation",
    label: "Explore similar situations",
    description: "Browse related real-life scenarios.",
    href: "/situations",
  });

  return followUps;
}

function structuredToText(s: StructuredResponse): string {
  const lines: string[] = [];

  lines.push("## Situation Summary\n");
  lines.push(s.situationSummary + "\n");

  if (s.rights.length) {
    lines.push("## Your Rights\n");
    s.rights.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }

  if (s.laws.length) {
    lines.push("## Relevant Laws\n");
    s.laws.forEach((l) =>
      lines.push(`**${l.name}** (${l.section}): ${l.description}`),
    );
    lines.push("");
  }

  if (s.immediateActions.length) {
    lines.push("## Immediate Action Steps\n");
    s.immediateActions.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
    lines.push("");
  }

  if (s.documentsRequired.length) {
    lines.push("## Documents Required\n");
    s.documentsRequired.forEach((d) => lines.push(`- ${d}`));
    lines.push("");
  }

  if (s.authorities.length) {
    lines.push("## Authorities to Contact\n");
    s.authorities.forEach((a) => {
      lines.push(
        `**${a.name}**: ${a.description}${a.contact ? ` (${a.contact})` : ""}`,
      );
    });
    lines.push("");
  }

  if (s.commonMistakes.length) {
    lines.push("## Common Mistakes to Avoid\n");
    s.commonMistakes.forEach((m) => lines.push(`- ${m}`));
    lines.push("");
  }

  if (s.professionalHelp) {
    lines.push("## Need Professional Help?\n");
    lines.push(s.professionalHelp + "\n");
  }

  lines.push(
    "---\n*This is educational guidance, not legal advice. Always consult a qualified professional for your specific case.*",
  );

  return lines.join("\n");
}

export class MockAIService implements AIService {
  isConfigured(): boolean {
    return true;
  }

  async sendMessage(ctx: PromptContext) {
    await delay(SIMULATED_DELAY);
    const structured = matchResponse(ctx.currentQuestion);
    return { content: structuredToText(structured), structured };
  }

  async *streamMessage(ctx: PromptContext): AsyncIterable<AIStreamChunk> {
    await delay(SIMULATED_DELAY);

    const structured = matchResponse(ctx.currentQuestion);
    const content = structuredToText(structured);

    const words = content.split(" ");
    let buffer = "";

    for (let i = 0; i < words.length; i++) {
      buffer += (i > 0 ? " " : "") + words[i];

      if (i % 4 === 3 || i === words.length - 1) {
        yield { type: "text", content: buffer };
        buffer = "";
        await delay(CHUNK_DELAY);
      }
    }

    yield { type: "structured", structured };
    yield { type: "follow-ups", followUps: generateFollowUps(structured) };
    yield { type: "done" };
  }

  async generateTitle(firstMessage: string): Promise<string> {
    await delay(300);
    const words = firstMessage.split(" ").slice(0, 6);
    return words.join(" ") + (firstMessage.split(" ").length > 6 ? "…" : "");
  }

  parseStructuredResponse(raw: string): StructuredResponse {
    return matchResponse(raw);
  }
}
