import type {
  CitizenDocumentTemplateMeta,
  SupportedCitizenLanguage,
  VerifiedResource,
} from "@/types/action-engine";

export const SUPPORTED_CITIZEN_LANGUAGES: Array<{
  code: SupportedCitizenLanguage;
  label: string;
  nativeLabel: string;
  script: string;
}> = [
  {
    code: "hinglish",
    label: "Hinglish (Hindi + English)",
    nativeLabel: "Hinglish (Mera Haq)",
    script: "Latin",
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    script: "Devanagari",
  },
  {
    code: "en",
    label: "English",
    nativeLabel: "English (India)",
    script: "Latin",
  },
  {
    code: "mr",
    label: "Marathi",
    nativeLabel: "मराठी",
    script: "Devanagari",
  },
  {
    code: "ta",
    label: "Tamil",
    nativeLabel: "தமிழ்",
    script: "Tamil",
  },
  {
    code: "te",
    label: "Telugu",
    nativeLabel: "తెలుగు",
    script: "Telugu",
  },
  {
    code: "bn",
    label: "Bengali",
    nativeLabel: "বাংলা",
    script: "Bengali",
  },
  {
    code: "kn",
    label: "Kannada",
    nativeLabel: "ಕನ್ನಡ",
    script: "Kannada",
  },
  {
    code: "gu",
    label: "Gujarati",
    nativeLabel: "ગુજરાતી",
    script: "Gujarati",
  },
  {
    code: "ml",
    label: "Malayalam",
    nativeLabel: "മലയാളം",
    script: "Malayalam",
  },
  {
    code: "pa",
    label: "Punjabi",
    nativeLabel: "ਪੰਜਾਬੀ",
    script: "Gurmukhi",
  },
];

export const VERIFIED_RESOURCES_CATALOG: VerifiedResource[] = [
  {
    id: "vr-nalsa-15100",
    slug: "nalsa-national-legal-aid-15100",
    authorityName:
      "National Legal Services Authority (NALSA) & State/District Legal Aid",
    shortName: "NALSA 15100",
    resourceType: "legal_aid_authority",
    jurisdictionScope: "national",
    state: "All India",
    issueCategories: [
      "Fundamental Rights",
      "Tenancy & Housing",
      "Labour & Employment",
      "Consumer Rights",
      "Cyber Safety",
    ],
    description:
      "Statutory body under the Legal Services Authorities Act, 1987 providing free legal aid, panel lawyers, and Lok Adalat pre-litigation conciliation across every District Court (DLSA) in India.",
    whoCanUse:
      "Women, children, SC/ST citizens, industrial workmen, persons with disabilities, victims of disaster/violence, and citizens within state income ceilings under Section 12.",
    eligibilityNotes:
      "Section 12 of the Legal Services Authorities Act, 1987 grants 100% free legal representation to eligible categories.",
    feeNotes: "100% Free Statutory Service (Zero Court or Advocate Fee)",
    helplineNumber: "15100",
    officialUrl: "https://nalsa.gov.in/",
    languagesSupported: [
      "en",
      "hi",
      "hinglish",
      "ta",
      "te",
      "bn",
      "mr",
      "gu",
      "kn",
      "ml",
      "pa",
    ],
    operatingHours: "24x7 Toll-Free Helpline (15100) • DLSA Front Offices: 10 AM – 5 PM",
    howToUseSteps: [
      "Dial 15100 from your phone or visit the Legal Aid Front Office at your District Court complex.",
      "Share your one-page chronological summary and Section 12 eligibility proof (or self-declaration income affidavit).",
      "Request assignment of a Panel Advocate or pre-litigation Lok Adalat mediation notice.",
    ],
    documentsRequired: [
      "Identity & Address Proof (Aadhaar / Voter ID)",
      "Section 12 Eligibility Document or Income Affidavit",
      "Copies of relevant notices, receipts, or agreements",
    ],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-20",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-cyber-1930",
    slug: "cybercrime-helpline-1930",
    authorityName:
      "National Cyber Crime Reporting Portal & 1930 Financial Fraud Freeze Helpline (I4C, MHA)",
    shortName: "Cyber 1930 (I4C)",
    resourceType: "national_helpline",
    jurisdictionScope: "national",
    state: "All India",
    issueCategories: ["Cyber Safety", "Consumer Rights"],
    description:
      "Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) operated by Ministry of Home Affairs (I4C) to immediately freeze fraudulent UPI, bank, and OTP debits across all banks and wallets.",
    whoCanUse:
      "Any citizen in India who experienced an unauthorised UPI, card, net-banking, or online financial scam.",
    eligibilityNotes:
      "Report within the Golden Hour (first 1–24 hours) with the 12-digit UTR number so banks can place an immediate lien freeze.",
    feeNotes: "Free Official Emergency Helpline & Portal",
    helplineNumber: "1930",
    officialUrl: "https://cybercrime.gov.in/",
    languagesSupported: [
      "en",
      "hi",
      "hinglish",
      "ta",
      "te",
      "bn",
      "mr",
      "gu",
      "kn",
      "ml",
      "pa",
    ],
    operatingHours: "24x7 Emergency Financial Fraud Freeze",
    howToUseSteps: [
      "Dial 1930 immediately from the phone number linked to your bank/UPI account.",
      "Provide the 12-digit UPI UTR / Transaction Reference Number and timestamp of the debit.",
      "Log in to cybercrime.gov.in within 24 hours to upload screenshots and download your 15-digit NCRP Acknowledgement Receipt.",
    ],
    documentsRequired: [
      "12-digit UTR / RRN Reference Number",
      "Bank SMS debit alert & Mini Statement PDF",
      "Screenshots of fraudulent UPI ID, link, or caller number",
    ],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-22",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-nch-1915",
    slug: "national-consumer-helpline-1915",
    authorityName:
      "National Consumer Helpline (NCH 1915) & INGRAM Pre-Litigation Portal",
    shortName: "NCH 1915",
    resourceType: "grievance_portal",
    jurisdictionScope: "national",
    state: "All India",
    issueCategories: ["Consumer Rights", "Cyber Safety"],
    description:
      "Department of Consumer Affairs integrated grievance platform connecting consumers directly with e-commerce platforms, airlines, banks, and brands prior to e-Daakhil Consumer Commission litigation.",
    whoCanUse:
      "Any consumer who bought goods or availed services for personal use under the Consumer Protection Act, 2019.",
    eligibilityNotes:
      "Pre-litigation docket resolution; unresolved cases can be escalated to the District Consumer Commission on edaakhil.nic.in.",
    feeNotes: "Free Pre-Litigation Docket Registration",
    helplineNumber: "1915",
    officialUrl: "https://consumerhelpline.gov.in/",
    languagesSupported: [
      "en",
      "hi",
      "hinglish",
      "ta",
      "te",
      "bn",
      "mr",
      "gu",
      "kn",
      "ml",
      "pa",
    ],
    operatingHours: "8:00 AM – 8:00 PM (All 7 Days) • Portal 24x7",
    howToUseSteps: [
      "Call 1915 or register your grievance on consumerhelpline.gov.in / UMANG App.",
      "Upload your tax invoice, order ID, and written grievance notice sent to the seller's Nodal Officer.",
      "Track your NCH Docket Number for company response within 15–30 days.",
    ],
    documentsRequired: [
      "Tax Invoice / Payment Receipt",
      "Photos or unboxing video of defective product",
      "Copy of email/chat with seller customer care",
    ],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-21",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-rti-central",
    slug: "rti-online-central-portal",
    authorityName:
      "RTI Online Portal — Department of Personnel & Training (DoPT), Govt. of India",
    shortName: "RTI Online (Central)",
    resourceType: "rti_portal",
    jurisdictionScope: "central",
    state: "All India",
    issueCategories: ["RTI & Governance", "Fundamental Rights"],
    description:
      "Official online portal for filing Section 6 Right to Information (RTI) applications and Section 19 First Appeals to Central Government Ministries, Departments, Public Sector Banks, Railways, and EPFO.",
    whoCanUse:
      "Any Citizen of India under Section 3 of the Right to Information Act, 2005.",
    eligibilityNotes:
      "Statutory 30-day response window (48 hours where information concerns life or personal liberty under Section 7(1) proviso).",
    feeNotes: "₹10 Statutory Fee (₹0 for valid BPL Cardholders under Section 7(5))",
    officialUrl: "https://rtionline.gov.in/",
    languagesSupported: ["en", "hi", "hinglish"],
    operatingHours: "24x7 Online Filing Portal",
    jurisdictionWarning:
      "CENTRAL VS STATE RTI WARNING: rtionline.gov.in is ONLY for Central Government Public Authorities (e.g., Railways, Passport, EPFO, Nationalized Banks). For State Municipalities, State Police, Tehsildar, or State Boards, use your respective State RTI Portal (e.g., rtiodisha.gov.in, aaplesarkar.mahaonline.gov.in) or send a signed Section 6 application by Speed Post.",
    howToUseSteps: [
      "Confirm whether the public authority belongs to the Central Government or a State Government.",
      "Select the exact Ministry/Department and Public Authority on rtionline.gov.in.",
      "Paste your point-wise Section 6 questions requesting certified records and pay ₹10 online (or attach BPL proof).",
    ],
    documentsRequired: [
      "Point-wise list of specific records/files sought",
      "Application reference number or date of pending representation",
      "BPL Card PDF (only if claiming fee exemption)",
    ],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-19",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-samadhan-labour",
    slug: "samadhan-labour-portal",
    authorityName:
      "SAMADHAN Portal — Ministry of Labour and Employment (Wage & Industrial Disputes)",
    shortName: "SAMADHAN Labour",
    resourceType: "labour_commission",
    jurisdictionScope: "national",
    state: "All India",
    issueCategories: ["Labour & Employment"],
    description:
      "Software Application for Monitoring and Disposal, Handling of Industrial Disputes, unpaid wages, gratuity, maternity benefit, and wrongful termination conciliations.",
    whoCanUse:
      "Employees, workmen, and citizens facing unpaid wages, withheld full-and-final settlement, or statutory gratuity disputes.",
    eligibilityNotes:
      "Routes disputes to Central Chief Labour Commissioner (CLC) or respective State Labour Authorities based on industry jurisdiction.",
    feeNotes: "Free Online Conciliation Application",
    officialUrl: "https://samadhan.labour.gov.in/",
    languagesSupported: ["en", "hi", "hinglish"],
    operatingHours: "24x7 Online Portal",
    howToUseSteps: [
      "First send a dated written representation to your Employer / HR requesting full and final settlement.",
      "Log in to samadhan.labour.gov.in using your mobile number and file a claim/dispute application.",
      "Attach your appointment letter, salary slips, bank statement, and resignation/termination email.",
    ],
    documentsRequired: [
      "Offer / Appointment Letter & ID Card copy",
      "Last 3–6 months Salary Slips & Bank Statement",
      "Resignation acceptance email & written demand notice",
    ],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-18",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-rbi-cms-14448",
    slug: "rbi-cms-banking-ombudsman",
    authorityName:
      "Reserve Bank Integrated Ombudsman Scheme (RB-IOS) & CMS Portal (14448)",
    shortName: "RBI Ombudsman 14448",
    resourceType: "ombudsman",
    jurisdictionScope: "central",
    state: "All India",
    issueCategories: ["Cyber Safety", "Consumer Rights"],
    description:
      "Single-window Reserve Bank of India Complaint Management System (CMS) for unresolved banking, UPI, NBFC, digital lending harassment, and unauthorised debit disputes.",
    whoCanUse:
      "Any bank, UPI, or NBFC customer whose written complaint was rejected by the bank or remained unresolved for 30 days.",
    eligibilityNotes:
      "Must first submit a written complaint to the Regulated Entity (Bank/NBFC) and wait 30 days (or receive an unsatisfactory reply).",
    feeNotes: "100% Free Statutory Ombudsman Resolution",
    helplineNumber: "14448",
    officialUrl: "https://cms.rbi.org.in/",
    languagesSupported: ["en", "hi", "hinglish", "ta", "te", "bn", "mr", "gu", "kn", "ml"],
    operatingHours: "24x7 CMS Portal • Contact Centre 14448 (9:30 AM – 5:15 PM)",
    howToUseSteps: [
      "File a written dispute with your bank branch / nodal officer first and keep the complaint ticket number.",
      "If unresolved after 30 days (or rejected unfairly), visit cms.rbi.org.in or call 14448.",
      "Upload the bank complaint copy, transaction UTR statement, and 1930 acknowledgement (if cyber fraud).",
    ],
    documentsRequired: [
      "Copy of original complaint filed with the Bank/NBFC",
      "Bank's rejection reply (or proof that 30 days elapsed)",
      "Account statement showing disputed transaction",
    ],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-20",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-dslsa-delhi",
    slug: "delhi-state-legal-services-authority-dslsa",
    authorityName: "Delhi State Legal Services Authority (DSLSA) — 1516 / 15100",
    shortName: "DSLSA Delhi",
    resourceType: "legal_aid_authority",
    jurisdictionScope: "state",
    state: "Delhi",
    issueCategories: [
      "Tenancy & Housing",
      "Fundamental Rights",
      "Labour & Employment",
      "Consumer Rights",
    ],
    description:
      "Statutory State Legal Services Authority for NCT of Delhi operating 24x7 Legal Aid Helpline and District Front Offices across Tis Hazari, Saket, Patiala House, Dwarka, Rohini, and Karkardooma Courts.",
    whoCanUse: "Residents and litigants within NCT of Delhi eligible under Section 12.",
    eligibilityNotes: "Income ceiling for general category in Delhi is ₹3,00,000 per annum (no ceiling for women, children, SC/ST).",
    feeNotes: "100% Free Legal Aid & Mediation",
    helplineNumber: "1516",
    officialUrl: "https://dslsa.org/",
    languagesSupported: ["en", "hi", "hinglish", "pa"],
    operatingHours: "24x7 Helpline (1516 / 15100)",
    howToUseSteps: [
      "Call 1516 or 15100 or visit the DSLSA Front Office at your jurisdictional Delhi District Court.",
      "Submit your Legal Aid Application or pre-litigation mediation request.",
    ],
    documentsRequired: ["Aadhaar / Delhi Address Proof", "Case Chronology Summary"],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-18",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-mslsa-maharashtra",
    slug: "maharashtra-state-legal-services-authority-mslsa",
    authorityName: "Maharashtra State Legal Services Authority (MSLSA Mumbai & Districts)",
    shortName: "MSLSA Maharashtra",
    resourceType: "legal_aid_authority",
    jurisdictionScope: "state",
    state: "Maharashtra",
    issueCategories: [
      "Tenancy & Housing",
      "Labour & Employment",
      "Consumer Rights",
      "Fundamental Rights",
    ],
    description:
      "State Legal Services Authority at High Court Mumbai and all 36 District Legal Services Authorities (DLSAs) across Maharashtra for free legal counsel and Lok Adalat settlement.",
    whoCanUse: "Citizens across Maharashtra (Mumbai, Pune, Nagpur, Thane, Nashik, etc.) under Section 12.",
    eligibilityNotes: "Free for women, children, SC/ST, industrial workers, and citizens within state income limits.",
    feeNotes: "100% Free Statutory Legal Aid",
    helplineNumber: "15100",
    officialUrl: "https://legalservices.maharashtra.gov.in/",
    languagesSupported: ["mr", "hi", "en", "hinglish"],
    operatingHours: "10:00 AM – 5:30 PM (Helpline 15100 24x7)",
    howToUseSteps: [
      "Dial 15100 or approach the DLSA Front Office at your District & Sessions Court in Maharashtra.",
      "Carry your chronological summary and rental/employment/consumer documents.",
    ],
    documentsRequired: ["Identity Proof", "Chronological Case Summary"],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-17",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-kslsa-karnataka",
    slug: "karnataka-state-legal-services-authority-kslsa",
    authorityName: "Karnataka State Legal Services Authority (KSLSA Bengaluru)",
    shortName: "KSLSA Karnataka",
    resourceType: "legal_aid_authority",
    jurisdictionScope: "state",
    state: "Karnataka",
    issueCategories: [
      "Tenancy & Housing",
      "Labour & Employment",
      "Consumer Rights",
      "Cyber Safety",
    ],
    description:
      "Provides free legal assistance, Permanent Lok Adalat utility/tenancy conciliation, and panel advocates across Bengaluru and all Karnataka districts.",
    whoCanUse: "Citizens in Karnataka eligible under Section 12 of the Legal Services Authorities Act.",
    eligibilityNotes: "Includes rental deposit conciliation and workplace disputes via Lok Adalat.",
    feeNotes: "100% Free Statutory Service",
    helplineNumber: "15100",
    officialUrl: "https://kslsa.kar.nic.in/",
    languagesSupported: ["kn", "en", "hi", "hinglish"],
    operatingHours: "10:00 AM – 5:30 PM (Helpline 15100 24x7)",
    howToUseSteps: [
      "Call 15100 or 1800-425-90900 or visit Nyaya Degula (KSLSA) / District Court DLSA.",
    ],
    documentsRequired: ["Identity Proof", "Rental Agreement / Employment / Invoice copies"],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-16",
    staleAfterDays: 90,
    isPublished: true,
  },
  {
    id: "vr-tnslsa-tamilnadu",
    slug: "tamil-nadu-state-legal-services-authority-tnslsa",
    authorityName: "Tamil Nadu State Legal Services Authority (TNSLSA Chennai)",
    shortName: "TNSLSA Tamil Nadu",
    resourceType: "legal_aid_authority",
    jurisdictionScope: "state",
    state: "Tamil Nadu",
    issueCategories: [
      "Tenancy & Housing",
      "Consumer Rights",
      "Labour & Employment",
      "Fundamental Rights",
    ],
    description:
      "Statutory Legal Aid Authority at Madras High Court Campus (Sathyaupam) and District Courts across Tamil Nadu.",
    whoCanUse: "Eligible citizens across Tamil Nadu under Section 12.",
    eligibilityNotes: "Free legal advice, drafting, and court representation.",
    feeNotes: "100% Free Statutory Service",
    helplineNumber: "15100",
    officialUrl: "https://www.tnlegalservices.tn.gov.in/",
    languagesSupported: ["ta", "en", "hinglish"],
    operatingHours: "10:00 AM – 5:45 PM (Helpline 15100 24x7)",
    howToUseSteps: [
      "Dial 15100 or 044-25342441 or visit your District Court Legal Aid Centre.",
    ],
    documentsRequired: ["Identity Proof", "Chronological Fact Sheet"],
    verificationStatus: "verified",
    lastVerifiedAt: "2026-09-16",
    staleAfterDays: 90,
    isPublished: true,
  },
];

export const VERIFIED_ASSISTANCE_RESOURCES = VERIFIED_RESOURCES_CATALOG;

export const CONTROLLED_LEGAL_TERMINOLOGY_BRIDGE: Array<{
  triggers: string[];
  normalizedEnglishTerm: string;
  legalDomain: string;
  relatedProvision?: string;
}> = [
  {
    triggers: [
      "deposit wapas nahi",
      "security deposit",
      "makan malik",
      "landlord",
      "kiraya",
      "flat vacate",
      "advance money",
    ],
    normalizedEnglishTerm: "Unlawful Withholding of Tenancy Security Deposit",
    legalDomain: "Tenancy & Housing",
    relatedProvision: "Indian Contract Act, 1872 (Section 73/74) & Model Tenancy Principles",
  },
  {
    triggers: [
      "paisa kat gaya",
      "upi fraud",
      "otp share",
      "cyber scam",
      "online dhoka",
      "fake call",
      "account freeze",
      "1930",
    ],
    normalizedEnglishTerm: "Unauthorised Electronic Banking / UPI Cyber Fraud",
    legalDomain: "Cyber Safety",
    relatedProvision: "RBI Zero-Liability Circular (DBR.No.Leg.BC.78) & IT Act Section 66D",
  },
  {
    triggers: [
      "refund nahi",
      "fake saman",
      "kharab saman",
      "defective product",
      "dukandar",
      "warranty",
      "overcharging",
    ],
    normalizedEnglishTerm: "Defective Goods / Deficiency in Consumer Service",
    legalDomain: "Consumer Rights",
    relatedProvision: "Consumer Protection Act, 2019 — Section 2(9), 2(10) & 2(11)",
  },
  {
    triggers: [
      "salary nahi",
      "pagar nahi",
      "tankhwah",
      "relieving letter",
      "full and final",
      "pf nahi",
      "company ne nikal",
    ],
    normalizedEnglishTerm: "Withheld Earned Wages & Employment Settlement Dues",
    legalDomain: "Labour & Employment",
    relatedProvision: "Payment of Wages Act, 1936 & SAMADHAN Conciliation Mechanism",
  },
  {
    triggers: [
      "fir nahi likh",
      "thana",
      "zero fir",
      "police station",
      "complaint refuse",
    ],
    normalizedEnglishTerm: "Mandatory Registration of Cognizable Offence (Zero FIR)",
    legalDomain: "Fundamental Rights",
    relatedProvision: "Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 — Section 173",
  },
  {
    triggers: [
      "rti",
      "suchna ka adhikar",
      "sarkari file",
      "public authority",
      "application stuck",
      "pension delay",
      "ration card",
    ],
    normalizedEnglishTerm: "Statutory Right to Information Request (Certified Public Records)",
    legalDomain: "RTI & Governance",
    relatedProvision: "Right to Information Act, 2005 — Section 6(1) & Section 7(1)",
  },
];

export const CITIZEN_DOCUMENT_TEMPLATES: CitizenDocumentTemplateMeta[] = [
  {
    templateType: "consumer-grievance-v1",
    templateVersion: "v1.0 (Human-Verified)",
    title: "Consumer Grievance & Refund Demand Notice",
    subtitle:
      "Structured written representation to E-Commerce Nodal Officer / Seller prior to NCH 1915 & e-Daakhil filing.",
    category: "Consumer Rights",
    jurisdictionNote:
      "Send to the company's Grievance Officer first, then attach to your National Consumer Helpline (1915 / consumerhelpline.gov.in) docket.",
    mandatoryDisclaimers: [
      "Draft / Educational Template / User-Review Required",
      "Verify invoice numbers, dates, and exact refund amounts before sending.",
    ],
  },
  {
    templateType: "rti-application-v1",
    templateVersion: "v1.0 (Human-Verified)",
    title: "Right to Information (Section 6) Application Draft",
    subtitle:
      "Point-wise record request addressed to the Central or State Public Information Officer (PIO).",
    category: "RTI & Governance",
    jurisdictionNote:
      "Use rtionline.gov.in ONLY for Central Government Public Authorities. For State Government departments or Municipalities, use your State RTI Portal or Registered Post.",
    mandatoryDisclaimers: [
      "Draft / Educational Template / User-Review Required",
      "Verify whether the Public Authority is under Central Government or State Government jurisdiction.",
    ],
  },
  {
    templateType: "cyber-fraud-incident-v1",
    templateVersion: "v1.0 (Human-Verified)",
    title: "Cyber Financial Fraud Chronology & Bank Dispute Notice",
    subtitle:
      "UTR transaction matrix and RBI Zero-Liability notification for your Bank Nodal Officer & Cyber Cell.",
    category: "Cyber Safety",
    jurisdictionNote:
      "Always call 1930 and report on cybercrime.gov.in FIRST to freeze the transaction trail, then submit this written statement to your home bank branch within 3 working days.",
    mandatoryDisclaimers: [
      "Draft / Educational Template / User-Review Required",
      "Never include your ATM PIN, UPI PIN, or NetBanking password in any written complaint.",
    ],
  },
  {
    templateType: "workplace-wage-representation-v1",
    templateVersion: "v1.0 (Human-Verified)",
    title: "Formal Representation for Unpaid Wages & Relieving Dues",
    subtitle:
      "Non-adversarial written representation to Employer HR / Management prior to SAMADHAN portal conciliation.",
    category: "Labour & Employment",
    jurisdictionNote:
      "Send via email/Registered Post to establish a dated demand record before filing on samadhan.labour.gov.in.",
    mandatoryDisclaimers: [
      "Draft / Educational Template / User-Review Required",
      "Verify exact employment dates, notice period clauses, and pending salary calculation.",
    ],
  },
  {
    templateType: "legal-aid-checklist-v1",
    templateVersion: "v1.0 (Human-Verified)",
    title: "NALSA / DLSA Free Legal Aid Case Preparation Brief",
    subtitle:
      "One-page chronological brief and Section 12 eligibility checklist to carry to your District Legal Services Authority (15100).",
    category: "Fundamental Rights",
    jurisdictionNote:
      "Carry this printed brief along with self-attested document copies to the DLSA Front Office at your nearest District Court or dial 15100.",
    mandatoryDisclaimers: [
      "Draft / Educational Template / User-Review Required",
      "Prepared for citizen readiness when consulting a NALSA / DLSA Panel Advocate.",
    ],
  },
];
