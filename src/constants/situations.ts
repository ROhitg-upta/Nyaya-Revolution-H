/**
 * Situation Engine content — categories, search placeholders, the learning
 * flow, and the situation dataset.
 *
 * IMPORTANT: All legal content below is simplified, illustrative PLACEHOLDER
 * material for UI development only. It is not legal advice and is not verified
 * against current statutes. A CMS / reviewed-content pipeline replaces it later.
 */
import {
  type LucideIcon,
  Award,
  BookOpen,
  Building2,
  ClipboardCheck,
  Flag,
  GraduationCap,
  HardHat,
  HeartHandshake,
  Rocket,
  ShieldAlert,
  ShoppingBag,
  TrafficCone,
  UserRound,
  Users,
} from "@/lib/icons";
import type { Situation, SituationCategory } from "@/types";

export const situationDisclaimer =
  "Educational placeholder content for a pre-launch product — not legal advice. Always consult a qualified professional for your specific case.";

export const situationCategories: SituationCategory[] = [
  {
    id: "students",
    title: "Students",
    description: "Ragging, fees, admissions, and campus rights.",
    icon: GraduationCap,
  },
  {
    id: "women",
    title: "Women",
    description: "Safety, harassment, and workplace protection.",
    icon: HeartHandshake,
  },
  {
    id: "workers",
    title: "Workers",
    description: "Wages, contracts, and wrongful termination.",
    icon: HardHat,
  },
  {
    id: "consumers",
    title: "Consumers",
    description: "Refunds, warranties, and unfair practices.",
    icon: ShoppingBag,
  },
  {
    id: "cyber",
    title: "Cyber Crime",
    description: "Fraud, data misuse, and online abuse.",
    icon: ShieldAlert,
  },
  {
    id: "traffic",
    title: "Traffic",
    description: "Challans, licences, and road incidents.",
    icon: TrafficCone,
  },
  {
    id: "tenants",
    title: "Tenants",
    description: "Deposits, evictions, and rent agreements.",
    icon: Building2,
  },
  {
    id: "family",
    title: "Family",
    description: "Domestic disputes and maintenance.",
    icon: Users,
  },
  {
    id: "senior",
    title: "Senior Citizens",
    description: "Support, safety, and elder rights.",
    icon: UserRound,
  },
];

/** Rotating placeholder prompts for the search bar. */
export const searchPlaceholders = [
  "My landlord is not returning my deposit",
  "My employer didn't pay my salary",
  "I got scammed online",
  "Someone harassed me",
  "My college is demanding illegal fees",
];

export interface LearningFlowStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** The universal Situation → … → Take Action journey. */
export const learningFlow: LearningFlowStep[] = [
  {
    id: "situation",
    title: "Situation",
    description: "Start from what actually happened to you.",
    icon: Flag,
  },
  {
    id: "understand",
    title: "Understand",
    description: "See your rights and the laws in plain language.",
    icon: BookOpen,
  },
  {
    id: "learn",
    title: "Learn",
    description: "Work through a short, focused learning path.",
    icon: GraduationCap,
  },
  {
    id: "quiz",
    title: "Quiz",
    description: "Check your understanding with a quick quiz.",
    icon: ClipboardCheck,
  },
  {
    id: "certificate",
    title: "Certificate",
    description: "Earn proof that you know your rights.",
    icon: Award,
  },
  {
    id: "action",
    title: "Take Action",
    description: "Act with confidence using your checklist.",
    icon: Rocket,
  },
];

export const situations: Situation[] = [
  {
    slug: "landlord-withholding-deposit",
    title: "My landlord is not returning my deposit",
    category: "tenants",
    icon: Building2,
    tagline: "Security deposit not refunded after moving out.",
    summary:
      "You vacated a rented home but the landlord is refusing to return your security deposit or is making unjustified deductions.",
    rights: [
      "Get your deposit back within the timeline in your agreement, minus lawful deductions only.",
      "Receive an itemised account of any deductions with evidence.",
      "Dispute unfair deductions through the Rent Authority or civil court.",
    ],
    laws: [
      {
        name: "State Rent Control / Tenancy Act",
        reference: "Applicable state tenancy law",
        description:
          "Governs deposits, notice, and dispute resolution between landlord and tenant.",
      },
      {
        name: "Model Tenancy Act, 2021",
        reference: "MTA 2021 (where adopted)",
        description:
          "Caps deposits and sets return timelines and a Rent Authority mechanism.",
      },
    ],
    immediateActions: [
      "Send a written request for the refund with your bank details.",
      "Share dated move-out photos and the inventory as evidence.",
      "Follow up in writing (email/message) to create a record.",
      "If ignored, send a formal legal notice.",
    ],
    dontDo: [
      "Don't rely on verbal promises — keep everything in writing.",
      "Don't damage the property or withhold rent in retaliation.",
      "Don't lose your original agreement or payment receipts.",
    ],
    documents: [
      "Rent agreement",
      "Deposit payment receipt / bank record",
      "Move-in and move-out condition photos",
      "Communication history with the landlord",
    ],
    authorities: [
      {
        name: "Rent Authority / Rent Controller",
        description:
          "Handles deposit and tenancy disputes where the Model Tenancy Act applies.",
      },
      {
        name: "Civil Court (small causes)",
        description: "For recovery of the deposit amount as a money claim.",
      },
    ],
    emergency: [{ label: "Police (emergency)", number: "112" }],
    learningPath: {
      title: "Tenant Rights Essentials",
      lessons: 5,
      duration: "25 min",
    },
    quiz: { title: "Deposit & Eviction Basics", questions: 8, minutes: 6 },
  },
  {
    slug: "employer-not-paying-salary",
    title: "My employer didn't pay my salary",
    category: "workers",
    icon: HardHat,
    tagline: "Wages delayed, withheld, or unpaid.",
    summary:
      "Your employer has delayed or refused to pay earned wages, final settlement, or overtime you are owed.",
    rights: [
      "Be paid your earned wages within the statutory pay period.",
      "Receive full and final settlement after resignation or termination.",
      "File a claim without fear of retaliation.",
    ],
    laws: [
      {
        name: "Payment of Wages Act, 1936",
        reference: "Payment of Wages Act",
        description:
          "Regulates timely payment of wages and permissible deductions.",
      },
      {
        name: "Code on Wages, 2019",
        reference: "Code on Wages 2019",
        description: "Consolidates wage laws and timelines for payment.",
      },
    ],
    immediateActions: [
      "Compute the exact amount owed with dates.",
      "Send a written demand to HR / the employer.",
      "Gather your appointment letter, payslips, and attendance proof.",
      "Approach the Labour Commissioner if unresolved.",
    ],
    dontDo: [
      "Don't quit without written record of dues owed.",
      "Don't accept a partial amount as 'full settlement' unknowingly.",
      "Don't delay — claims can have time limits.",
    ],
    documents: [
      "Appointment / offer letter",
      "Payslips and bank statements",
      "Attendance / timesheet records",
      "Resignation and settlement emails",
    ],
    authorities: [
      {
        name: "Labour Commissioner",
        description: "Receives and adjudicates wage-related complaints.",
      },
      {
        name: "Labour Court / Industrial Tribunal",
        description: "For disputes escalated beyond conciliation.",
      },
    ],
    emergency: [
      {
        label: "Labour Helpline",
        number: "155214",
        description: "Central labour grievance helpline.",
      },
    ],
    learningPath: {
      title: "Know Your Workplace Rights",
      lessons: 6,
      duration: "30 min",
    },
    quiz: { title: "Wages & Termination", questions: 10, minutes: 8 },
  },
  {
    slug: "scammed-online",
    title: "I got scammed online",
    category: "cyber",
    icon: ShieldAlert,
    tagline: "Money lost to an online fraud or fake seller.",
    summary:
      "You were tricked into paying for a fake product, service, or investment, or your account/card was used fraudulently.",
    rights: [
      "Report the fraud and request a freeze on the fraudulent transaction.",
      "Get help recovering funds through the cybercrime portal and your bank.",
      "File an FIR for online financial fraud.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "IT Act — Sec 66C/66D",
        description:
          "Covers identity theft and cheating by personation using computers.",
      },
      {
        name: "Bharatiya Nyaya Sanhita (cheating)",
        reference: "BNS provisions on cheating",
        description: "General criminal provisions for cheating and fraud.",
      },
    ],
    immediateActions: [
      "Call 1930 immediately — the sooner you report, the better the recovery odds.",
      "Report on cybercrime.gov.in with all transaction details.",
      "Inform your bank to flag/stop the transaction.",
      "Preserve screenshots, messages, and payment references.",
    ],
    dontDo: [
      "Don't share OTPs or passwords with anyone 'helping' you recover money.",
      "Don't make further payments to 'unlock' your funds.",
      "Don't delete the fraudulent messages or emails.",
    ],
    documents: [
      "Transaction IDs and bank statements",
      "Chats, emails, and call records",
      "Screenshots of the fake site/profile",
      "Any receipts or invoices received",
    ],
    authorities: [
      {
        name: "National Cyber Crime Portal",
        description:
          "cybercrime.gov.in — file and track online fraud complaints.",
      },
      {
        name: "Your Bank's Fraud Cell",
        description:
          "To flag, dispute, and attempt reversal of the transaction.",
      },
    ],
    emergency: [
      { label: "Cyber Crime Helpline", number: "1930" },
      { label: "Police (emergency)", number: "112" },
    ],
    learningPath: {
      title: "Cyber Safety & Fraud Response",
      lessons: 5,
      duration: "22 min",
    },
    quiz: { title: "Spotting & Reporting Fraud", questions: 8, minutes: 6 },
  },
  {
    slug: "facing-harassment",
    title: "Someone harassed me",
    category: "women",
    icon: HeartHandshake,
    tagline: "Harassment at work, in public, or online.",
    summary:
      "You experienced harassment — verbal, physical, online, or at the workplace — and want to know your protections and options.",
    rights: [
      "Feel safe and be protected from harassment and retaliation.",
      "File a complaint with the Internal Committee (workplace) or the police.",
      "Request confidentiality during the complaint process.",
    ],
    laws: [
      {
        name: "Sexual Harassment of Women at Workplace Act, 2013",
        reference: "PoSH Act 2013",
        description:
          "Requires an Internal Committee and a time-bound complaint process at workplaces.",
      },
      {
        name: "Bharatiya Nyaya Sanhita (relevant sections)",
        reference: "BNS provisions",
        description:
          "Criminal provisions covering assault, stalking, and outraging modesty.",
      },
    ],
    immediateActions: [
      "Move to a safe place and tell someone you trust.",
      "Note dates, times, witnesses, and what happened.",
      "File a complaint with the Internal Committee or the police.",
      "Preserve any messages, emails, or recordings.",
    ],
    dontDo: [
      "Don't confront the harasser alone if you feel unsafe.",
      "Don't delete evidence such as messages or call logs.",
      "Don't feel pressured to withdraw a genuine complaint.",
    ],
    documents: [
      "Written account of the incident(s)",
      "Screenshots / messages / recordings",
      "Witness names and contact details",
      "Any prior complaints filed",
    ],
    authorities: [
      {
        name: "Internal Committee (ICC)",
        description: "Mandatory workplace body to handle PoSH complaints.",
      },
      {
        name: "Local Police / Women's Cell",
        description: "For criminal complaints and immediate protection.",
      },
    ],
    emergency: [
      { label: "Women Helpline", number: "1091" },
      { label: "Police (emergency)", number: "112" },
    ],
    learningPath: {
      title: "Safety & Your Rights",
      lessons: 6,
      duration: "28 min",
    },
    quiz: { title: "Harassment: Know Your Options", questions: 9, minutes: 7 },
  },
  {
    slug: "college-demanding-illegal-fees",
    title: "My college is demanding illegal fees",
    category: "students",
    icon: GraduationCap,
    tagline: "Arbitrary or undisclosed fees and certificate withholding.",
    summary:
      "Your institution is demanding fees not disclosed at admission, or withholding documents until you pay disputed amounts.",
    rights: [
      "Pay only fees disclosed and approved by the fee-regulating authority.",
      "Receive your certificates and records that you are entitled to.",
      "Complain to the university, regulator, or consumer forum.",
    ],
    laws: [
      {
        name: "State Fee Regulation Acts",
        reference: "State fee-regulation law",
        description:
          "Caps and governs fees charged by educational institutions.",
      },
      {
        name: "Consumer Protection Act, 2019",
        reference: "CPA 2019",
        description:
          "Educational services deficiencies can be raised as consumer complaints in many cases.",
      },
    ],
    immediateActions: [
      "Ask for the fee demand and structure in writing.",
      "Compare against the approved fee notification.",
      "Submit a written grievance to the institution.",
      "Escalate to the affiliating university or regulator.",
    ],
    dontDo: [
      "Don't pay disputed amounts in cash without a receipt.",
      "Don't sign undated or blank documents.",
      "Don't ignore official grievance timelines.",
    ],
    documents: [
      "Admission letter and fee receipts",
      "Official approved fee structure",
      "Written fee demand from the college",
      "Grievance submission acknowledgements",
    ],
    authorities: [
      {
        name: "University Grievance Cell",
        description: "First point of escalation for affiliated colleges.",
      },
      {
        name: "State Fee Regulatory Authority",
        description: "Regulates and adjudicates fee-related complaints.",
      },
    ],
    emergency: [{ label: "Anti-Ragging Helpline", number: "1800-180-5522" }],
    learningPath: {
      title: "Student Rights on Campus",
      lessons: 4,
      duration: "18 min",
    },
    quiz: { title: "Fees, Records & Ragging", questions: 7, minutes: 5 },
  },
  {
    slug: "defective-product",
    title: "A product I bought is defective",
    category: "consumers",
    icon: ShoppingBag,
    tagline: "Faulty goods, refused refund, or warranty denial.",
    summary:
      "You purchased a product that is defective or misrepresented, and the seller is refusing a refund, replacement, or warranty service.",
    rights: [
      "Seek a refund, replacement, or repair for defective goods.",
      "Be protected against unfair trade practices and false claims.",
      "File a complaint with the consumer commission.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "CPA 2019",
        description:
          "Rights against defective goods, deficient services, and unfair practices.",
      },
      {
        name: "Legal Metrology / Sale of Goods",
        reference: "Related consumer statutes",
        description: "Cover mis-declaration, weights, and conditions of sale.",
      },
    ],
    immediateActions: [
      "Stop using the product and keep it in its condition.",
      "Contact the seller in writing seeking a remedy.",
      "Use the National Consumer Helpline to log a complaint.",
      "File with the District Consumer Commission if unresolved.",
    ],
    dontDo: [
      "Don't discard the packaging, invoice, or warranty card.",
      "Don't accept vague verbal assurances — get it in writing.",
      "Don't miss the warranty/return window.",
    ],
    documents: [
      "Invoice / order confirmation",
      "Warranty card and product manual",
      "Photos or video of the defect",
      "Communication with the seller",
    ],
    authorities: [
      {
        name: "National Consumer Helpline",
        description: "Log and track consumer grievances (1915).",
      },
      {
        name: "District Consumer Commission",
        description: "Adjudicates consumer disputes and awards remedies.",
      },
    ],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: {
      title: "Consumer Rights in Action",
      lessons: 5,
      duration: "24 min",
    },
    quiz: { title: "Refunds, Warranty & Complaints", questions: 8, minutes: 6 },
  },
  {
    slug: "traffic-stop-challan",
    title: "I was stopped and fined by traffic police",
    category: "traffic",
    icon: TrafficCone,
    tagline: "Challan disputes and your rights at a stop.",
    summary:
      "You were stopped by traffic police and issued a challan you believe is incorrect, or you're unsure of your rights during the stop.",
    rights: [
      "Ask for the officer's identity and the reason for the stop.",
      "Receive a proper challan and contest it if it's wrong.",
      "Not be forced to pay a cash 'settlement' on the spot.",
    ],
    laws: [
      {
        name: "Motor Vehicles Act, 1988 (amended 2019)",
        reference: "MV Act",
        description: "Governs offences, penalties, and the challan process.",
      },
    ],
    immediateActions: [
      "Stay calm and ask for the challan details in writing.",
      "Note the officer's name and vehicle/booth number.",
      "Pay official fines only through the e-challan portal.",
      "Contest an incorrect challan in the traffic court / Lok Adalat.",
    ],
    dontDo: [
      "Don't hand over documents you're not required to surrender.",
      "Don't pay cash without an official receipt.",
      "Don't argue aggressively — record details instead.",
    ],
    documents: [
      "Driving licence and registration certificate",
      "Insurance and PUC certificate",
      "The challan issued",
      "Any dashcam / photo evidence",
    ],
    authorities: [
      {
        name: "Traffic Police e-Challan Portal",
        description: "To verify, pay, or dispute a challan.",
      },
      {
        name: "Traffic Court / Lok Adalat",
        description: "To formally contest a wrongful challan.",
      },
    ],
    emergency: [{ label: "Police (emergency)", number: "112" }],
    learningPath: {
      title: "Roads, Rules & Rights",
      lessons: 4,
      duration: "16 min",
    },
    quiz: { title: "Challans & Documents", questions: 6, minutes: 5 },
  },
  {
    slug: "family-domestic-dispute",
    title: "I'm facing a domestic or family dispute",
    category: "family",
    icon: Users,
    tagline: "Maintenance, safety, and family conflict.",
    summary:
      "You're dealing with a family conflict involving safety, maintenance, or property, and want to understand your protections and options.",
    rights: [
      "Live free from domestic violence and abuse.",
      "Seek maintenance and protection orders where applicable.",
      "Access mediation and legal aid.",
    ],
    laws: [
      {
        name: "Protection of Women from Domestic Violence Act, 2005",
        reference: "PWDVA 2005",
        description: "Provides protection, residence, and maintenance orders.",
      },
      {
        name: "Maintenance provisions",
        reference: "Applicable personal / criminal law",
        description: "Covers maintenance for spouses, children, and parents.",
      },
    ],
    immediateActions: [
      "Get to safety first; contact a helpline if in danger.",
      "Document incidents with dates and any evidence.",
      "Approach a Protection Officer or legal aid clinic.",
      "Consider mediation for non-violent disputes.",
    ],
    dontDo: [
      "Don't stay in an unsafe situation to 'keep the peace'.",
      "Don't sign property or settlement papers under pressure.",
      "Don't destroy evidence of abuse or threats.",
    ],
    documents: [
      "Identity and relationship proof",
      "Records of incidents / medical reports",
      "Financial and property documents",
      "Any prior complaints or orders",
    ],
    authorities: [
      {
        name: "Protection Officer (DV Act)",
        description: "Assists with protection and maintenance applications.",
      },
      {
        name: "District Legal Services Authority",
        description: "Free legal aid and mediation services.",
      },
    ],
    emergency: [
      { label: "Women Helpline", number: "1091" },
      { label: "Police (emergency)", number: "112" },
    ],
    learningPath: {
      title: "Family Rights & Protection",
      lessons: 5,
      duration: "26 min",
    },
    quiz: { title: "Protection & Maintenance", questions: 8, minutes: 7 },
  },
  {
    slug: "senior-citizen-neglect",
    title: "My family isn't supporting me as a senior citizen",
    category: "senior",
    icon: UserRound,
    tagline: "Maintenance and protection for elders.",
    summary:
      "As a senior citizen, you are not receiving support you're entitled to, or you're facing neglect or pressure over property.",
    rights: [
      "Claim maintenance from children or heirs who are able to provide it.",
      "Be protected from neglect, abandonment, and coercion.",
      "Revoke a property transfer made on a false promise of care.",
    ],
    laws: [
      {
        name: "Maintenance & Welfare of Parents and Senior Citizens Act, 2007",
        reference: "MWPSC Act 2007",
        description:
          "Provides a fast maintenance tribunal and protection for senior citizens.",
      },
    ],
    immediateActions: [
      "Apply to the Maintenance Tribunal for a support order.",
      "Keep records of expenses and any transfers made.",
      "Contact the senior citizen helpline for guidance.",
      "Seek help from a legal aid clinic if needed.",
    ],
    dontDo: [
      "Don't transfer property without a written care condition.",
      "Don't sign documents you don't fully understand.",
      "Don't stay silent about neglect or abuse.",
    ],
    documents: [
      "Identity and age proof",
      "Property and transfer documents",
      "Records of expenses and income",
      "Any correspondence with family",
    ],
    authorities: [
      {
        name: "Maintenance Tribunal (SDM office)",
        description: "Fast-track maintenance orders under the 2007 Act.",
      },
      {
        name: "District Legal Services Authority",
        description: "Free legal aid for senior citizens.",
      },
    ],
    emergency: [
      { label: "Senior Citizen Helpline", number: "14567" },
      { label: "Police (emergency)", number: "112" },
    ],
    learningPath: {
      title: "Elder Rights & Welfare",
      lessons: 4,
      duration: "20 min",
    },
    quiz: { title: "Maintenance & Protection", questions: 7, minutes: 6 },
  },
];

/** O(1)-ish lookup helpers used by the routes. */
export function getSituation(slug: string): Situation | undefined {
  return situations.find((s) => s.slug === slug);
}

export function getCategory(id: string): SituationCategory | undefined {
  return situationCategories.find((c) => c.id === id);
}
