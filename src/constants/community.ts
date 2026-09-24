import type {
  CommunityCategorySlug,
  CommunityStory,
  StoryComment,
  StoryLearningBridgeData,
  StoryType,
} from "@/types/community";

export interface CommunityCategoryConfig {
  slug: CommunityCategorySlug;
  label: string;
  shortLabel: string;
  description: string;
  defaultSituationSlug: string;
  defaultJourneySlug: string;
}

export const COMMUNITY_CATEGORIES: CommunityCategoryConfig[] = [
  {
    slug: "consumer",
    label: "Consumer Rights & Refunds",
    shortLabel: "Consumer",
    description: "Defective goods, e-commerce dark patterns, unfair service denials, and CPA 2019 remedies.",
    defaultSituationSlug: "defective-product-refund-refused",
    defaultJourneySlug: "consumer-rights",
  },
  {
    slug: "cyber",
    label: "Cyber Safety & UPI Fraud",
    shortLabel: "Cyber & UPI",
    description: "Authorized/unauthorized UPI transfers, phishing links, 1930 golden hour reporting, and digital safety.",
    defaultSituationSlug: "online-scam-upi-fraud",
    defaultJourneySlug: "cyber-safety",
  },
  {
    slug: "workplace",
    label: "Workplace & Unpaid Wages",
    shortLabel: "Workplace",
    description: "Withheld salaries, relieving letter coercion, POSH awareness, and Labour Commissioner procedures.",
    defaultSituationSlug: "salary-not-paid-by-employer",
    defaultJourneySlug: "workplace-rights",
  },
  {
    slug: "tenancy",
    label: "Housing & Tenancy Deposits",
    shortLabel: "Tenancy",
    description: "Security deposit deductions, arbitrary eviction notices, and Model Tenancy Act protections.",
    defaultSituationSlug: "landlord-keeping-security-deposit",
    defaultJourneySlug: "everyday-contracts",
  },
  {
    slug: "police_rights",
    label: "Police Interaction & FIR Rights",
    shortLabel: "Police & FIR",
    description: "Zero FIR rights, e-FIR registration, arrest safeguards under BNSS 2023, and station procedure.",
    defaultSituationSlug: "police-refusing-to-file-fir",
    defaultJourneySlug: "fundamental-rights",
  },
  {
    slug: "family_safety",
    label: "Women & Family Safety",
    shortLabel: "Family Safety",
    description: "Domestic safety resources, emergency protection orders, One Stop Centres, and dignity protections.",
    defaultSituationSlug: "police-refusing-to-file-fir",
    defaultJourneySlug: "fundamental-rights",
  },
  {
    slug: "education",
    label: "Student & Campus Rights",
    shortLabel: "Education",
    description: "Original certificate withholding, fee refund rules, UGC guidelines, and anti-ragging redressal.",
    defaultSituationSlug: "defective-product-refund-refused",
    defaultJourneySlug: "consumer-rights",
  },
  {
    slug: "rti_civic",
    label: "RTI & Civic Accountability",
    shortLabel: "RTI & Civic",
    description: "Filing Right to Information applications, public service delays, and first appeal remedies.",
    defaultSituationSlug: "police-refusing-to-file-fir",
    defaultJourneySlug: "fundamental-rights",
  },
  {
    slug: "traffic_transport",
    label: "Traffic & Commuter Rights",
    shortLabel: "Traffic",
    description: "Virtual court e-challan disputes, DigiLocker/mParivahan validity, and wrongful vehicle towing.",
    defaultSituationSlug: "police-refusing-to-file-fir",
    defaultJourneySlug: "fundamental-rights",
  },
  {
    slug: "general_awareness",
    label: "General Legal Awareness",
    shortLabel: "General",
    description: "Everyday preventive checklists, contract literacy, and constitutional duties.",
    defaultSituationSlug: "defective-product-refund-refused",
    defaultJourneySlug: "fundamental-rights",
  },
];

export const STORY_TYPES: {
  id: StoryType;
  label: string;
  description: string;
  badgeText: string;
}[] = [
  {
    id: "experience",
    label: "Personal Experience",
    description: "Share a real situation you faced and how you navigated the steps.",
    badgeText: "Citizen Experience",
  },
  {
    id: "awareness",
    label: "Warning & Scam Alert",
    description: "Help others recognize red flags before they fall into a similar trap.",
    badgeText: "Warning & Awareness",
  },
  {
    id: "outcome",
    label: "Resolution & Outcome",
    description: "Document how a legal notice, portal filing, or grievance resolved an issue.",
    badgeText: "Resolution Story",
  },
  {
    id: "learning",
    label: "What I Learned",
    description: "Connect a real-world event to a legal right or constitutional principle.",
    badgeText: "Citizen Learning",
  },
  {
    id: "question",
    label: "Educational Question",
    description: "Ask the community how a statutory process works in general terms.",
    badgeText: "Process Inquiry",
  },
  {
    id: "resource",
    label: "Helpful Public Resource",
    description: "Share a verified government helpline, portal workflow, or checklist.",
    badgeText: "Civic Resource",
  },
];

export const CONTROLLED_COMMUNITY_TAGS: string[] = [
  "1930 Cyber Helpline",
  "National Consumer Helpline",
  "e-Daakhil Portal",
  "Zero FIR (BNSS Sec 173)",
  "Security Deposit",
  "Unpaid Salary",
  "SAMADHAN Portal",
  "Dark Patterns",
  "UPI Fraud",
  "RTI Act 2005",
  "UGC Fee Refund",
  "DigiLocker Valid",
  "Written Notice",
  "Bank Ombudsman",
];

export const MEDIA_UPLOAD_LIMITS = {
  image: {
    maxBytes: 8 * 1024 * 1024, // 8 MB
    maxSizeLabel: "8 MB",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
  audio: {
    maxBytes: 15 * 1024 * 1024, // 15 MB
    maxSizeLabel: "15 MB",
    allowedMimeTypes: [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/mp4",
      "audio/x-m4a",
      "audio/webm",
    ],
    allowedExtensions: [".mp3", ".wav", ".m4a", ".webm"],
  },
  video: {
    maxBytes: 40 * 1024 * 1024, // 40 MB
    maxSizeLabel: "40 MB",
    allowedMimeTypes: ["video/mp4", "video/webm"],
    allowedExtensions: [".mp4", ".webm"],
  },
  maxAttachmentsPerStory: 6,
} as const;

export const STORY_REPORT_REASONS = [
  {
    id: "false_legal_claim",
    label: "Misleading or False Legal Claim",
    description: "Presents an inaccurate legal rule or dangerous procedural advice as fact.",
  },
  {
    id: "personal_data_exposure",
    label: "Personal Data / Doxxing (PII Exposure)",
    description: "Contains phone numbers, Aadhaar, bank account numbers, or private addresses.",
  },
  {
    id: "defamation_targeted_accusation",
    label: "Targeted Personal Accusation / Defamation",
    description: "Names private individuals with unverified criminal accusations.",
  },
  {
    id: "harassment_hate",
    label: "Harassment, Abuse, or Hate Speech",
    description: "Attacks a person or community rather than discussing a civic/legal situation.",
  },
  {
    id: "spam_scam",
    label: "Spam, Promotion, or Recovery Scam",
    description: "Promotes paid legal touts, fake recovery agents, or commercial links.",
  },
  {
    id: "unsafe_media",
    label: "Unsafe or Unredacted Media Attachment",
    description: "Image, audio, or video exposes private identities or inappropriate content.",
  },
  {
    id: "graphic_distressing",
    label: "Graphic or Distressing Content",
    description: "Contains disturbing imagery or descriptions unsuitable for a learning platform.",
  },
  {
    id: "impersonation",
    label: "Impersonation of Official or Advocate",
    description: "Falsely claims to represent a court, police officer, or licensed lawyer.",
  },
  {
    id: "copyright",
    label: "Copyright / Unattributed Material",
    description: "Copies third-party copyrighted media without permission.",
  },
  {
    id: "other",
    label: "Other Safety or Policy Concern",
    description: "Requires moderator review for another trust and safety reason.",
  },
] as const;

export const DEFAULT_LEARNING_BRIDGES: Record<CommunityCategorySlug, StoryLearningBridgeData> = {
  consumer: {
    situationSlug: "defective-product-refund-refused",
    situationTitle: "Defective Product & E-Commerce Refund Refused",
    legalAreaTitle: "Consumer Protection Act, 2019",
    rightsSummary:
      "Platforms cannot wash their hands of defective deliveries by blaming third-party sellers alone. Statutory product liability and unfair trade practice provisions protect buyers.",
    journeySlug: "consumer-rights",
    journeyTitle: "Consumer Rights & E-Commerce Remedies",
    recommendedLessons: [
      {
        slug: "what-counts-as-defective",
        title: "What Counts as a Defect or Deficiency under CPA 2019",
        durationMinutes: 6,
      },
      {
        slug: "filing-on-edaakhil",
        title: "Filing a Grievance on NCH 1915 & e-Daakhil Step-by-Step",
        durationMinutes: 8,
      },
    ],
    relatedConcepts: [
      {
        title: "Deficiency in Service (Section 2(11), CPA 2019)",
        statutoryReference: "Consumer Protection Act, 2019 • Sec 2(11)",
        summary: "Any fault, imperfection, shortcoming, or inadequacy in quality, nature, or manner of performance.",
      },
      {
        title: "E-Commerce Marketplace Liability Rules, 2020",
        statutoryReference: "Consumer Protection (E-Commerce) Rules, 2020 • Rule 5",
        summary: "Requires appointing a nodal grievance officer who must acknowledge complaints within 48 hours.",
      },
    ],
    practiceScenarioPrompt:
      "Practice how to respond when an e-commerce platform closes your return ticket citing 'seller no-return policy' for a damaged electronics item.",
  },
  cyber: {
    situationSlug: "online-scam-upi-fraud",
    situationTitle: "Online Scam, Phishing Link & UPI Fraud",
    legalAreaTitle: "IT Act, 2000 & RBI Zero-Liability Circular",
    rightsSummary:
      "Reporting unauthorized electronic banking transactions within the Golden Hour on 1930 and cybercrime.gov.in enables lien-marking before funds exit the banking network.",
    journeySlug: "cyber-safety",
    journeyTitle: "Cyber Safety & Digital Financial Rights",
    recommendedLessons: [
      {
        slug: "golden-hour-1930",
        title: "The Golden Hour: How 1930 Lien-Marks Fraudulent Accounts",
        durationMinutes: 5,
      },
      {
        slug: "rbi-zero-liability-rules",
        title: "RBI Zero Liability vs Limited Liability Within 3 Working Days",
        durationMinutes: 7,
      },
    ],
    relatedConcepts: [
      {
        title: "RBI Circular on Limiting Customer Liability (DBR.No.Leg.BC.78)",
        statutoryReference: "RBI Master Direction • 2017/2021",
        summary: "Zero customer liability when unauthorized third-party breach is reported within 3 working days.",
      },
      {
        title: "Cheating by Personation Using Computer Resource",
        statutoryReference: "Information Technology Act, 2000 • Section 66D",
        summary: "Punishes phishing, spoofed KYC portals, and impersonation scams over digital channels.",
      },
    ],
    practiceScenarioPrompt:
      "Practice the exact sequence of actions in the first 30 minutes after discovering an unauthorized ₹24,000 UPI debit.",
  },
  workplace: {
    situationSlug: "salary-not-paid-by-employer",
    situationTitle: "Salary Withheld or Relieving Letter Delayed After Resignation",
    legalAreaTitle: "Payment of Wages / Industrial & Shops Establishments Law",
    rightsSummary:
      "Earned wages for completed workdays are a statutory and contractual right, not a discretionary bonus. Employers cannot hold earned salary hostage indefinitely.",
    journeySlug: "workplace-rights",
    journeyTitle: "Workplace Rights, Contracts & Wage Redressal",
    recommendedLessons: [
      {
        slug: "recovering-unpaid-dues",
        title: "Documenting Full & Final Settlement Delays and SAMADHAN Filing",
        durationMinutes: 7,
      },
    ],
    relatedConcepts: [
      {
        title: "Right to Timely Payment of Earned Wages",
        statutoryReference: "Code on Wages, 2019 / State Shops & Establishments Acts",
        summary: "Mandates settlement of earned wages within prescribed timelines following separation.",
      },
    ],
    practiceScenarioPrompt:
      "Draft a calm, legally grounded written demand notice when HR delays Full & Final settlement beyond 60 days.",
  },
  tenancy: {
    situationSlug: "landlord-keeping-security-deposit",
    situationTitle: "Landlord Unfairly Withholding Security Deposit on Vacating",
    legalAreaTitle: "Indian Contract Act, 1872 & Model Tenancy Principles",
    rightsSummary:
      "Normal wear and tear (such as routine repainting after multi-year occupancy) cannot be deducted arbitrarily without itemized bills and joint handover proof.",
    journeySlug: "everyday-contracts",
    journeyTitle: "Everyday Contracts & Tenancy Agreements",
    recommendedLessons: [
      {
        slug: "move-out-inspection-proof",
        title: "Move-Out Handover Checklists & Itemized Deduction Rules",
        durationMinutes: 6,
      },
    ],
    relatedConcepts: [
      {
        title: "Refund of Security Deposit & Normal Wear and Tear",
        statutoryReference: "Model Tenancy Act, 2021 • Section 11 & Indian Contract Act Sec 73",
        summary: "Security deposit must be refunded at handover after permissible, documented arrears only.",
      },
    ],
    practiceScenarioPrompt:
      "Practice negotiating an itemized deposit refund using timestamped handover photos and meter readings.",
  },
  police_rights: {
    situationSlug: "police-refusing-to-file-fir",
    situationTitle: "Police Station Refusing to Register FIR Saying 'Out of Jurisdiction'",
    legalAreaTitle: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023",
    rightsSummary:
      "Under Section 173 of BNSS 2023, any police station must register a Zero FIR for a cognizable offence regardless of where the incident occurred, and citizens can also submit an e-FIR.",
    journeySlug: "fundamental-rights",
    journeyTitle: "Fundamental Rights & Citizen-Police Safeguards",
    recommendedLessons: [
      {
        slug: "zero-fir-and-efir-bnss",
        title: "Zero FIR & e-FIR under Section 173 BNSS 2023",
        durationMinutes: 6,
      },
    ],
    relatedConcepts: [
      {
        title: "Mandatory Registration of Cognizable Information (Zero FIR)",
        statutoryReference: "BNSS, 2023 • Section 173(1)",
        summary: "Information relating to a cognizable offence may be given orally or by electronic communication irrespective of area.",
      },
    ],
    practiceScenarioPrompt:
      "Practice requesting a Zero FIR and escalating via registered post to the Superintendent of Police under BNSS Section 173(4).",
  },
  family_safety: {
    situationSlug: "police-refusing-to-file-fir",
    situationTitle: "Domestic Safety & Protection Order Remedies",
    legalAreaTitle: "Protection of Women from Domestic Violence Act, 2005",
    rightsSummary:
      "Every woman facing domestic abuse has the right to apply for a Protection Order, Residence Order, and free assistance via a Protection Officer or Sakhi One Stop Centre (181).",
    journeySlug: "fundamental-rights",
    journeyTitle: "Fundamental Rights & Dignity Safeguards",
    recommendedLessons: [
      {
        slug: "zero-fir-and-efir-bnss",
        title: "Accessing Protection Officers & Sakhi One Stop Centres (181)",
        durationMinutes: 6,
      },
    ],
    relatedConcepts: [
      {
        title: "Right to Reside in Shared Household",
        statutoryReference: "PWDVA, 2005 • Section 17",
        summary: "Protects against unlawful eviction from the shared household irrespective of title ownership.",
      },
    ],
    practiceScenarioPrompt:
      "Learn how a Domestic Incident Report (DIR) is recorded through a Protection Officer.",
  },
  education: {
    situationSlug: "defective-product-refund-refused",
    situationTitle: "College Withholding Original Marksheets or Fee Refund",
    legalAreaTitle: "UGC Fee Refund Notification & Consumer Law",
    rightsSummary:
      "Educational institutions are prohibited under UGC directives from retaining original certificates to force fee payment or prevent student withdrawal.",
    journeySlug: "consumer-rights",
    journeyTitle: "Student & Consumer Grievance Redressal",
    recommendedLessons: [
      {
        slug: "filing-on-edaakhil",
        title: "Using UGC e-Samadhan & Written Grievance Escalation",
        durationMinutes: 6,
      },
    ],
    relatedConcepts: [
      {
        title: "UGC Prohibition on Retention of Original Certificates",
        statutoryReference: "UGC Notification on Refund of Fees & Non-Retention of Originals",
        summary: "Institutions cannot impound original academic certificates of students at admission.",
      },
    ],
    practiceScenarioPrompt:
      "Practice drafting a formal request citing UGC guidelines to retrieve original Class 12 certificates.",
  },
  rti_civic: {
    situationSlug: "police-refusing-to-file-fir",
    situationTitle: "Filing an Online RTI for Pending Public Service Application",
    legalAreaTitle: "Right to Information Act, 2005",
    rightsSummary:
      "Under Section 6 of the RTI Act, any citizen can request certified status records and daily progress on pending public applications within 30 days for a ₹10 fee.",
    journeySlug: "fundamental-rights",
    journeyTitle: "Constitutional Rights & Civic Transparency",
    recommendedLessons: [
      {
        slug: "zero-fir-and-efir-bnss",
        title: "Drafting Precise Questions Under Section 6 of the RTI Act",
        durationMinutes: 6,
      },
    ],
    relatedConcepts: [
      {
        title: "Time Limit for Supply of Information (30 Days / 48 Hours for Life & Liberty)",
        statutoryReference: "Right to Information Act, 2005 • Section 7(1)",
        summary: "Public Information Officers must reply within 30 days or face penalty proceedings under Section 20.",
      },
    ],
    practiceScenarioPrompt:
      "Practice turning an emotional complaint into 4 objective record-seeking questions for rtionline.gov.in.",
  },
  traffic_transport: {
    situationSlug: "police-refusing-to-file-fir",
    situationTitle: "Contesting Wrongful Traffic E-Challan & Digital License Validity",
    legalAreaTitle: "Motor Vehicles Act, 1988 & IT Act Recognition",
    rightsSummary:
      "Driving licenses and registration certificates presented inside official DigiLocker or mParivahan apps are legally equivalent to physical originals across India.",
    journeySlug: "fundamental-rights",
    journeyTitle: "Everyday Citizen Rights & Procedural Fairness",
    recommendedLessons: [
      {
        slug: "zero-fir-and-efir-bnss",
        title: "Disputing WrongNumber-Plate E-Challans on Parivahan & Virtual Courts",
        durationMinutes: 5,
      },
    ],
    relatedConcepts: [
      {
        title: "Legal Recognition of Electronic Documents in DigiLocker",
        statutoryReference: "Central Motor Vehicles Rules • Rule 139 & IT Act Sec 4",
        summary: "Traffic enforcement must accept electronic certificates produced on DigiLocker or mParivahan.",
      },
    ],
    practiceScenarioPrompt:
      "Practice raising an online grievance when your scooter receives an e-challan meant for a misread license plate.",
  },
  general_awareness: {
    situationSlug: "defective-product-refund-refused",
    situationTitle: "Everyday Legal Readiness & Document Preservation",
    legalAreaTitle: "Constitutional & Statutory Citizen Awareness",
    rightsSummary:
      "Keeping contemporaneous written trails, invoice copies, and official docket numbers turns an informal dispute into a verifiable legal claim.",
    journeySlug: "fundamental-rights",
    journeyTitle: "Foundations of Indian Legal Literacy",
    recommendedLessons: [
      {
        slug: "what-counts-as-defective",
        title: "How Written Trails Protect Citizens in Everyday Disputes",
        durationMinutes: 5,
      },
    ],
    relatedConcepts: [
      {
        title: "Electronic Evidence Admissibility",
        statutoryReference: "Bharatiya Sakshya Adhiniyam (BSA), 2023 • Section 63",
        summary: "Preserves screenshots, emails, and transaction logs as admissible electronic records.",
      },
    ],
    practiceScenarioPrompt:
      "Learn how to organize a chronological evidence bundle before approaching any statutory grievance portal.",
  },
};

export const INITIAL_COMMUNITY_STORIES: CommunityStory[] = [
  {
    id: "story-e10-upi-golden-hour",
    slug: "recovered-38000-fake-parcel-upi-scam-using-1930-within-22-minutes",
    authorId: "demo-citizen-1",
    authorName: "Rohan V. (Pseudonym)",
    authorRole: "Software Engineer • Bengaluru, Karnataka",
    authorInitials: "RV",
    identityMode: "pseudonym",
    visibility: "public",
    storyType: "outcome",
    category: "cyber",
    categoryLabel: "Cyber Safety & UPI Fraud",
    locationState: "Karnataka",
    title: "How calling 1930 within 22 minutes froze ₹38,000 lost in a fake courier customs call",
    whatHappened:
      "Last month I received an automated IVR call claiming a parcel addressed to me had been detained at Mumbai Customs. The caller knew my pin code and coerced me into transferring ₹38,000 as a 'refundable RBI clearance deposit' via UPI. Seconds after the transfer completed, the caller demanded another ₹25,000 and hung up when I questioned the merchant name.",
    warningSigns:
      "1) Artificial urgency ('warrant will be issued in 15 minutes'). 2) Refusal to share an official government notice over email. 3) Asking to transfer money to a private merchant QR code for 'account verification'.",
    actionTaken:
      "Instead of searching Google for fake 'recovery helpline numbers', I immediately dialed 1930 (National Cyber Crime Helpline) within 22 minutes of the transaction. I kept my 12-digit UTR number and bank SMS ready. Simultaneously, I logged the complaint on cybercrime.gov.in and submitted a written dispute form at my home bank branch within 24 hours.",
    legalOutcome:
      "The 1930 Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) put a debit freeze (lien) on ₹38,000 at the Layer-2 beneficiary bank before the scammer could withdraw it at an ATM. After submitting the court release order with the nodal officer, the full ₹38,000 was credited back to my account.",
    citizenTakeaway:
      "Never panic or search social media for 'cyber recovery agents'—those are secondary scammers. Keep your 12-digit UPI UTR number handy and call 1930 in the first Golden Hour.",
    resolutionStatus: "Resolved (₹38,000 Frozen & Reversed)",
    statutoryBacking: "RBI Zero-Liability Circular & IT Act Section 66D (1930 CFCFRMS Protocol)",
    tags: ["1930 Cyber Helpline", "UPI Fraud", "Bank Ombudsman", "Written Notice"],
    media: [
      {
        id: "media-upi-1",
        storyId: "story-e10-upi-golden-hour",
        mediaType: "image",
        storageBucket: "community-media",
        storagePath: "samples/1930-timeline-infographic.svg",
        url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        fileName: "redacted-1930-acknowledgement-workflow.jpg",
        mimeType: "image/jpeg",
        fileSizeBytes: 248320,
        width: 1200,
        height: 675,
        caption: "Redacted timeline showing the 22-minute gap between the UPI debit SMS and the 1930 CFCFRMS lien confirmation.",
        altText: "Digital security screen illustrating cyber fraud reporting timeline and UTR tracking",
        sortOrder: 0,
      },
      {
        id: "media-upi-2",
        storyId: "story-e10-upi-golden-hour",
        mediaType: "audio",
        storageBucket: "community-media",
        storagePath: "samples/citizen-voice-note-1930.mp3",
        url: "https://actions.google.com/sounds/v1/ambiences/office_busy.ogg",
        fileName: "rohan-voice-walkthrough-90s.ogg",
        mimeType: "audio/webm",
        fileSizeBytes: 842100,
        durationSeconds: 48,
        caption: "Audio walkthrough: What details the 1930 operator asked me during the 3-minute call (UTR, timestamp, beneficiary VPA).",
        transcript:
          "When you call 1930, keep three things open on another phone or notepad: the exact 12-digit UTR number from your UPI app, the exact minute the transaction occurred, and the last 4 digits of the account debited. That lets the operator fire an automated lien alert to the receiving bank immediately.",
        sortOrder: 1,
      },
    ],
    aiSummary:
      "A citizen targeted by a 'fake customs parcel' impersonation scam transferred ₹38,000 via UPI but immediately reported the 12-digit UTR number to the National Cyber Helpline (1930) within 22 minutes, enabling an automated inter-bank lien freeze and full recovery.",
    aiEducationalNote:
      "Educational Context (Not Legal Advice): Under the Ministry of Home Affairs CFCFRMS network (1930) and RBI Customer Liability Guidelines, reporting unauthorized or coerced electronic transactions immediately allows banks to freeze funds in transit before cash withdrawal.",
    learningBridge: DEFAULT_LEARNING_BRIDGES.cyber,
    helpfulCount: 184,
    commentCount: 3,
    moderationStatus: "published",
    createdAt: "2026-09-18T11:20:00.000Z",
    updatedAt: "2026-09-18T11:20:00.000Z",
    publishedAt: "2026-09-18T12:00:00.000Z",
  },
  {
    id: "story-e10-consumer-laptop-refund",
    slug: "ecommerce-refused-cracked-display-laptop-refund-resolved-via-nch-1915",
    authorId: "demo-citizen-2",
    authorName: "Ananya M.",
    authorRole: "Postgraduate Student • Pune, Maharashtra",
    authorInitials: "AM",
    identityMode: "real_name",
    visibility: "public",
    storyType: "experience",
    category: "consumer",
    categoryLabel: "Consumer Rights & Refunds",
    locationState: "Maharashtra",
    title: "E-commerce app closed my return ticket 3 times for a cracked laptop screen—how NCH 1915 unlocked a full ₹64,500 refund",
    whatHappened:
      "I ordered a ₹64,500 study laptop during an online sale. Despite recording a continuous unboxing video showing the inner display panel had pressure cracks right out of the sealed box, the marketplace support bot closed my return request three times stating 'Open-Box Delivery OTP was shared, hence physical damage is excluded.'",
    warningSigns:
      "Delivery agents rushing you to share the Open-Box OTP before powering on the device screen to check for internal panel cracks that are invisible when powered off.",
    actionTaken:
      "I preserved the continuous 4-minute unboxing video, the tax invoice, and screenshots of all 3 rejected tickets. I filed a docket on the National Consumer Helpline (consumerhelpline.gov.in / 1915) citing Section 2(11) & Section 84 of the Consumer Protection Act, 2019, and emailed the platform's appointed Grievance Officer under Rule 5 of the E-Commerce Rules, 2020.",
    legalOutcome:
      "Once the NCH docket was routed to the marketplace's Nodal Officer, their legal escalation desk reopened the case within 72 hours, arranged reverse pickup, and refunded ₹64,500 to my original payment source in 6 working days.",
    citizenTakeaway:
      "An Open-Box Delivery OTP only confirms external box handover—it does not waive your statutory protection against latent or power-on defects under the Consumer Protection Act, 2019.",
    resolutionStatus: "Resolved (Full ₹64,500 Refunded)",
    statutoryBacking: "Consumer Protection Act, 2019 (Sec 2(11) & E-Commerce Rules 2020 Rule 5)",
    tags: ["National Consumer Helpline", "e-Daakhil Portal", "Dark Patterns", "Written Notice"],
    media: [
      {
        id: "media-consumer-1",
        storyId: "story-e10-consumer-laptop-refund",
        mediaType: "image",
        storageBucket: "community-media",
        storagePath: "samples/unboxing-evidence-checklist.jpg",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
        fileName: "unboxing-checklist-and-nch-docket.jpg",
        mimeType: "image/jpeg",
        fileSizeBytes: 312400,
        width: 1200,
        height: 800,
        caption: "How I organized the continuous unboxing video frames alongside the NCH 1915 docket submission.",
        altText: "Laptop screen inspection and consumer documentation setup",
        sortOrder: 0,
      },
      {
        id: "media-consumer-2",
        storyId: "story-e10-consumer-laptop-refund",
        mediaType: "video",
        storageBucket: "community-media",
        storagePath: "samples/unboxing-evidence-demo.mp4",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        posterUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
        fileName: "how-to-record-admissible-unboxing-proof.mp4",
        mimeType: "video/mp4",
        fileSizeBytes: 2450120,
        durationSeconds: 15,
        caption: "Short video demonstration: Recording all 6 sides of the shipping seal and powering on the display in a single uncut take.",
        altText: "Video guide demonstrating continuous uncut parcel unboxing for consumer protection",
        sortOrder: 1,
      },
    ],
    aiSummary:
      "After an e-commerce platform repeatedly rejected a return for a laptop with an internal display crack by citing 'Open-Box OTP shared', the buyer escalated with an uncut unboxing video to the National Consumer Helpline (1915) and the platform's Nodal Grievance Officer under the E-Commerce Rules 2020, securing a full ₹64,500 refund.",
    aiEducationalNote:
      "Educational Context (Not Legal Advice): Under the Consumer Protection (E-Commerce) Rules, 2020, every marketplace must publish a Grievance Officer contact who must acknowledge complaints within 48 hours. Sharing a delivery OTP does not extinguish statutory liability for defective goods.",
    learningBridge: DEFAULT_LEARNING_BRIDGES.consumer,
    helpfulCount: 142,
    commentCount: 2,
    moderationStatus: "published",
    createdAt: "2026-09-19T08:45:00.000Z",
    updatedAt: "2026-09-19T08:45:00.000Z",
    publishedAt: "2026-09-19T09:15:00.000Z",
  },
  {
    id: "story-e10-tenancy-security-deposit",
    slug: "recovered-90000-rental-security-deposit-using-joint-moveout-inspection-sheet",
    authorId: "demo-citizen-3",
    authorName: "Citizen Contributor (Anonymous)",
    authorRole: "Tenant • Gurugram, Haryana",
    authorInitials: "CC",
    identityMode: "anonymous",
    visibility: "public",
    storyType: "learning",
    category: "tenancy",
    categoryLabel: "Housing & Tenancy Deposits",
    locationState: "Haryana",
    title: "Landlord tried deducting ₹42,000 for 'luxury repainting & deep cleaning' from our ₹90,000 deposit—how our move-in/move-out log resolved it",
    whatHappened:
      "After vacating our 2BHK flat following a 22-month registered lease, our landlord sent a WhatsApp message stating he would deduct ₹42,000 from our ₹90,000 security deposit for repainting, acid tile wash, and modular kitchen hinge replacement—without sharing a single contractor invoice.",
    warningSigns:
      "Landlords refusing to conduct a joint walkthrough before key handover and insisting they will 'calculate deductions next month after you hand over the keys.'",
    actionTaken:
      "Before handing over the keys, we sent a polite email attaching: (1) our move-in dated photos from 22 months ago showing pre-existing wall patches, (2) cleared electricity/society maintenance receipts, and (3) a formal notice referencing the routine wear-and-tear clause in our lease and Section 11 of the Model Tenancy framework.",
    legalOutcome:
      "Faced with dated move-in vs move-out photo comparisons and a request for GST-compliant contractor bills, the landlord agreed during society mediation to deduct only ₹3,500 for an actual tap replacement and transferred ₹86,500 via NEFT the same evening.",
    citizenTakeaway:
      "Always email timestamped photos of every room on Day 1 of your lease so both parties have an immutable baseline when vacating.",
    resolutionStatus: "Mediated (₹86,500 of ₹90,000 Refunded)",
    statutoryBacking: "Indian Contract Act Sec 73 & Standard Wear-and-Tear Tenancy Principles",
    tags: ["Security Deposit", "Written Notice"],
    media: [
      {
        id: "media-tenancy-1",
        storyId: "story-e10-tenancy-security-deposit",
        mediaType: "image",
        storageBucket: "community-media",
        storagePath: "samples/tenancy-handover-comparison.jpg",
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        fileName: "move-in-move-out-inspection-sheet.jpg",
        mimeType: "image/jpeg",
        fileSizeBytes: 198400,
        width: 1200,
        height: 800,
        caption: "Structure of the 1-page Move-Out Handover & Meter Reading acknowledgement sheet we signed before returning keys.",
        altText: "Apartment keys and handover inspection checklist on a wooden table",
        sortOrder: 0,
      },
    ],
    aiSummary:
      "An anonymous tenant prevented an arbitrary ₹42,000 deduction from a ₹90,000 rental deposit by presenting Day-1 move-in photographs alongside cleared utility bills and requesting itemized bills for non-wear-and-tear repairs.",
    aiEducationalNote:
      "Educational Context (Not Legal Advice): Normal wear and tear resulting from ordinary residential use over time is distinct from tenant-caused structural damage. Dated Day-1 and Move-Out photographs serve as critical primary evidence.",
    learningBridge: DEFAULT_LEARNING_BRIDGES.tenancy,
    helpfulCount: 97,
    commentCount: 1,
    moderationStatus: "published",
    createdAt: "2026-09-20T14:10:00.000Z",
    updatedAt: "2026-09-20T14:10:00.000Z",
    publishedAt: "2026-09-20T15:00:00.000Z",
  },
  {
    id: "story-e10-zero-fir-highway",
    slug: "how-understanding-section-173-bnss-zero-fir-helped-after-highway-theft",
    authorId: "demo-citizen-4",
    authorName: "Karthik S. (Pseudonym)",
    authorRole: "Commuter • Chennai, Tamil Nadu",
    authorInitials: "KS",
    identityMode: "pseudonym",
    visibility: "public",
    storyType: "awareness",
    category: "police_rights",
    categoryLabel: "Police Interaction & FIR Rights",
    locationState: "Tamil Nadu",
    title: "Station duty officer initially sent us to another border outpost—how politely citing Section 173 BNSS got our Zero FIR registered",
    whatHappened:
      "During an overnight bus journey between two districts, my backpack containing my work laptop and ID cards was stolen at a highway halt. When I reached the nearest town police station at 6:30 AM, the desk staff told me the highway dhaba fell under the neighbouring rural police station 28 km away.",
    warningSigns:
      "Being verbally asked to travel between two border police stations to determine territorial jurisdiction before a complaint is even recorded.",
    actionTaken:
      "I stayed calm and respectful, handed over a neatly written 1-page complaint with my IMEI and laptop serial number, and politely requested registration of a Zero FIR under Section 173(1) of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, so it could be electronically transferred to the jurisdictional station while I blocked my SIM and insurance.",
    legalOutcome:
      "The Station House Officer reviewed my written complaint, immediately instructed the desk writer to register the Zero FIR, gave me a free signed copy under Section 173(2) BNSS within 35 minutes, and logged the IMEI on the CEIR blocking portal.",
    citizenTakeaway:
      "Polite, informed communication works wonders. When you carry a clear written application and respectfully reference Section 173 BNSS (Zero FIR), officers know you understand the procedure.",
    resolutionStatus: "Resolved (Zero FIR Registered & CEIR Blocked)",
    statutoryBacking: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — Section 173(1) & 173(2)",
    tags: ["Zero FIR (BNSS Sec 173)", "Written Notice"],
    media: [],
    aiSummary:
      "A traveller whose laptop bag was stolen on an inter-district highway avoided a 28 km jurisdictional runaround by submitting a written application requesting a Zero FIR under Section 173(1) of the BNSS 2023 and obtaining a free copy under Section 173(2).",
    aiEducationalNote:
      "Educational Context (Not Legal Advice): Section 173(1) of the BNSS, 2023 explicitly codifies Zero FIR across India—mandating that information relating to a cognizable offence must be recorded irrespective of the area where the offence was committed.",
    learningBridge: DEFAULT_LEARNING_BRIDGES.police_rights,
    helpfulCount: 129,
    commentCount: 1,
    moderationStatus: "published",
    createdAt: "2026-09-21T16:30:00.000Z",
    updatedAt: "2026-09-21T16:30:00.000Z",
    publishedAt: "2026-09-21T17:00:00.000Z",
  },
];

export const INITIAL_STORY_COMMENTS: StoryComment[] = [
  {
    id: "comment-e10-1",
    storyId: "story-e10-upi-golden-hour",
    authorName: "Meera K. (Pseudonym)",
    authorRole: "Bank Operations Officer",
    identityMode: "pseudonym",
    content:
      "Thank you for highlighting the 12-digit UTR number. Working at a bank branch, I see many citizens waste the first 3 hours searching Instagram or Telegram for 'cyber recovery experts' instead of immediately calling 1930 so the CFCFRMS lien can catch the funds at Layer-1 or Layer-2.",
    isEdited: false,
    createdAt: "2026-09-18T14:10:00.000Z",
    updatedAt: "2026-09-18T14:10:00.000Z",
  },
  {
    id: "comment-e10-2",
    storyId: "story-e10-upi-golden-hour",
    authorName: "Arjun D.",
    authorRole: "Law Student • Delhi",
    identityMode: "real_name",
    content:
      "The voice note explaining what 1930 asks in the first 3 minutes is super practical. Connecting this directly to the RBI Zero-Liability lesson helped me explain this to my parents.",
    isEdited: false,
    createdAt: "2026-09-19T09:30:00.000Z",
    updatedAt: "2026-09-19T09:30:00.000Z",
  },
  {
    id: "comment-e10-3",
    storyId: "story-e10-upi-golden-hour",
    authorName: "Citizen Contributor",
    authorRole: "Community Member",
    identityMode: "anonymous",
    content:
      "Also remember to save the SMS from your bank with the timestamp—it is required when submitting the written dispute form within 3 working days.",
    isEdited: false,
    createdAt: "2026-09-19T18:05:00.000Z",
    updatedAt: "2026-09-19T18:05:00.000Z",
  },
  {
    id: "comment-e10-4",
    storyId: "story-e10-consumer-laptop-refund",
    authorName: "Devansh P. (Pseudonym)",
    authorRole: "Consumer Literacy Volunteer",
    identityMode: "pseudonym",
    content:
      "Crucial point about Open-Box Delivery OTPs! An OTP acknowledges physical receipt of the box, not waiver of internal hardware defects that only show up when plugged in.",
    isEdited: false,
    createdAt: "2026-09-19T12:15:00.000Z",
    updatedAt: "2026-09-19T12:15:00.000Z",
  },
  {
    id: "comment-e10-5",
    storyId: "story-e10-consumer-laptop-refund",
    authorName: "Priya R.",
    authorRole: "Engineering Student",
    identityMode: "real_name",
    content:
      "Just watched your 15-second unboxing video checklist. Going to follow the '6-side seal check + power-on in one uncut take' rule for every electronics order.",
    isEdited: false,
    createdAt: "2026-09-20T07:45:00.000Z",
    updatedAt: "2026-09-20T07:45:00.000Z",
  },
  {
    id: "comment-e10-6",
    storyId: "story-e10-tenancy-security-deposit",
    authorName: "Sandeep N. (Pseudonym)",
    authorRole: "Tenant • Bengaluru",
    identityMode: "pseudonym",
    content:
      "Emailing Day-1 photos to the landlord on the day you move in creates an indisputable timestamped record. Saved us ₹35,000 in Whitefield last year.",
    isEdited: false,
    createdAt: "2026-09-20T19:20:00.000Z",
    updatedAt: "2026-09-20T19:20:00.000Z",
  },
  {
    id: "comment-e10-7",
    storyId: "story-e10-zero-fir-highway",
    authorName: "Adv. Kavita Sharma (Educator)",
    authorRole: "Legal Literacy Fellow",
    identityMode: "real_name",
    content:
      "Great example of constructive civic engagement. Citing Section 173(1) BNSS calmly with a written application helps both the citizen and the station writer process the Zero FIR accurately.",
    isEdited: false,
    createdAt: "2026-09-22T08:00:00.000Z",
    updatedAt: "2026-09-22T08:00:00.000Z",
  },
];
