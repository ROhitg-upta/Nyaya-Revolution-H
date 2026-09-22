/**
 * Situation Engine content — categories, search placeholders, the learning
 * flow, and the comprehensive 50+ real-world situation dataset.
 *
 * CRITICAL LEGAL CONTENT INTEGRITY:
 * - All situations are grounded in verifiable Indian statutes (Constitution of India,
 *   Consumer Protection Act 2019, IT Act 2000, POSH Act 2013, Model Tenancy Act 2021,
 *   Motor Vehicles Act, Payment of Wages Act, RTI Act 2005, BNSS/CrPC).
 * - Every situation specifies verified rights, actionable immediate checklists,
 *   authorities with real jurisdictional competence, and official emergency helplines.
 */
import {
  type LucideIcon,
  Award,
  BookOpen,
  Building2,
  CarFront,
  ClipboardCheck,
  Flag,
  GraduationCap,
  HardHat,
  HeartHandshake,
  Landmark,
  Rocket,
  Shield,
  ShieldAlert,
  ShoppingBag,
  TrafficCone,
  UserRound,
  Users,
} from "@/lib/icons";
import type { Situation, SituationCategory } from "@/types";

export const situationDisclaimer =
  "Educational legal awareness content for Indian citizens — not formal legal representation. Always consult a certified advocate for specific court litigation.";

export const situationCategories: SituationCategory[] = [
  {
    id: "students",
    title: "Student & Education",
    description: "College fees, hostel deposits, ragging, withheld marksheets, and coaching refunds.",
    icon: GraduationCap,
    subcategories: [
      "College fee dispute",
      "Hostel/PG deposit issue",
      "Ragging",
      "Withheld documents",
      "Scholarship issue",
      "Fake internship",
      "Fake placement",
      "Education refund dispute",
    ],
  },
  {
    id: "tenants",
    title: "Tenant & Housing",
    description: "Security deposits, illegal evictions, rent agreements, and utility disruptions.",
    icon: Building2,
    subcategories: [
      "Security deposit dispute",
      "Eviction concern",
      "Rental agreement dispute",
      "Rent receipt issue",
      "Water/utility dispute",
      "Unhygienic accommodation",
      "Deposit deduction",
      "Accommodation dispute",
    ],
  },
  {
    id: "consumers",
    title: "Consumer Rights",
    description: "Defective goods, denied refunds, misleading ads, and unfair contract terms.",
    icon: ShoppingBag,
    subcategories: [
      "Product not delivered",
      "Defective product",
      "Refund denied",
      "Warranty issue",
      "Misleading advertisement",
      "Unauthorized charge",
      "Service complaint",
      "Food/service issue",
    ],
  },
  {
    id: "cyber",
    title: "Cyber & Online Scams",
    description: "UPI fraud, shopping scams, social media hacking, phishing, and fake portals.",
    icon: ShieldAlert,
    subcategories: [
      "UPI fraud",
      "Online shopping scam",
      "Account hacked",
      "Social-media impersonation",
      "Cyber harassment",
      "Phishing",
      "OTP scam",
      "Identity misuse",
      "Threatening messages",
      "Fake website",
    ],
  },
  {
    id: "women",
    title: "Women & Safety",
    description: "Workplace harassment (POSH), stalking, domestic violence, and public safety.",
    icon: HeartHandshake,
    subcategories: [
      "Public harassment",
      "Unwanted physical contact",
      "Threatening behaviour",
      "Online harassment",
      "Stalking concern",
      "Workplace harassment",
      "Domestic abuse awareness",
    ],
  },
  {
    id: "traffic",
    title: "Traffic & Road Law",
    description: "Police vehicle stops, e-challans, road accidents, and digital vehicle papers.",
    icon: TrafficCone,
    subcategories: [
      "Traffic stop",
      "Challan dispute",
      "Road accident",
      "Vehicle documents",
      "Hit-and-run awareness",
      "Insurance awareness",
    ],
  },
  {
    id: "workers",
    title: "Employment & Labour",
    description: "Unpaid salary, wrongful termination, unpaid internships, and contract breaches.",
    icon: HardHat,
    subcategories: [
      "Salary not paid",
      "Contract dispute",
      "Workplace harassment",
      "Termination concern",
      "Internship stipend",
      "Workplace discrimination",
    ],
  },
  {
    id: "citizen",
    title: "Citizen & Governance",
    description: "RTI applications, delayed public services, Zero FIR, and ID record corrections.",
    icon: Landmark,
    subcategories: [
      "Government service grievance",
      "RTI awareness",
      "Police complaint/FIR awareness",
      "Document correction",
      "Public-service grievance",
    ],
  },
  {
    id: "privacy",
    title: "Digital Privacy",
    description: "Personal data breaches, unauthorized leaks, doxxing, and app tracking.",
    icon: Shield,
    subcategories: [
      "Data misuse",
      "Unauthorized sharing",
      "Account privacy",
      "Online impersonation",
    ],
  },
  {
    id: "family",
    title: "Family Law",
    description: "Maintenance rights, mutual separation, and family dispute resolution.",
    icon: Users,
    subcategories: ["Domestic disputes", "Maintenance"],
  },
  {
    id: "senior",
    title: "Senior Citizens",
    description: "Maintenance tribunal, property safety, and protection against neglect.",
    icon: UserRound,
    subcategories: ["Support & safety", "Elder rights"],
  },
];

export const searchPlaceholders = [
  "My landlord is refusing to return my security deposit",
  "College is withholding my original degree marksheets",
  "Transferred money to a fraudulent UPI QR code",
  "Traffic police confiscated my car keys during a stop",
  "Company terminated me without paying 2 months salary",
  "Online shopping app delivered a brick instead of a phone",
  "Someone created a fake Instagram profile with my photos",
  "Filed an RTI application 45 days ago but got no response",
];

export interface LearningFlowStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

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
  // ==========================================
  // 1. STUDENT / EDUCATION
  // ==========================================
  {
    slug: "college-demanding-illegal-fees",
    title: "My college is demanding illegal extra fees",
    category: "students",
    subcategory: "College fee dispute",
    icon: GraduationCap,
    tagline: "Unapproved development, capitation, or hidden exam charges.",
    summary:
      "Your private university or college is demanding sudden capitation fees or unapproved charges not mentioned in the official prospectus under threat of withholding exams.",
    rights: [
      "Pay only government-sanctioned and prospectus-notified fee structures.",
      "Protection under Supreme Court directives against capitation and arbitrary extortion fees (P.A. Inamdar & TMA Pai).",
      "Full fee itemization with receipts for every rupee charged.",
    ],
    laws: [
      {
        name: "UGC (Grievance Redressal) Regulations",
        reference: "Regulation 2019 / 2023",
        description: "Forbids charging fees not explicitly notified in the approved prospectus.",
      },
      {
        name: "State Fee Regulatory Committee Act",
        reference: "State Specific Legislation",
        description: "Determines and caps the maximum annual fee payable across private colleges.",
      },
    ],
    immediateActions: [
      "Demand written justification and government approval reference for the fee.",
      "Submit a formal complaint to the College Student Grievance Redressal Committee (SGRC).",
      "Escalate to the UGC e-Samadhan portal (samadhan.ugc.ac.in).",
    ],
    dontDo: [
      "Do not pay in cash without an official signed receipt.",
      "Do not boycott examinations without lodging a formal written record first.",
    ],
    documents: [
      "College prospectus and fee structure brochure",
      "All prior fee payment receipts and bank transaction records",
      "Written fee demand notices or circulars issued by administration",
    ],
    authorities: [
      { name: "State Fee Regulatory Committee", description: "State government body regulating college fees." },
      { name: "UGC Ombudsman / e-Samadhan", description: "Central university education dispute portal." },
    ],
    emergency: [{ label: "UGC National Helpline", number: "1800-180-5522" }],
    learningPath: { title: "Student Rights in India", lessons: 4, duration: "25 min", journeySlug: "student-rights" },
    quiz: { title: "College Fee & Campus Rights Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-14-equality-before-law"],
    relatedActs: ["consumer-protection-act-2019"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "college-withheld-documents",
    title: "College is withholding my original marksheet and certificates",
    category: "students",
    subcategory: "Withheld documents",
    icon: GraduationCap,
    tagline: "University refusing to return 10th/12th/degree certificates.",
    summary:
      "A college or institute is retaining your original academic marksheets or migration certificates to force future fee payment or prevent you from transferring.",
    rights: [
      "UGC strictly prohibits institutions from retaining original student academic documents.",
      "Colleges may only verify originals and return them immediately, keeping attested copies.",
      "Institutions face cancellation of recognition and funding cuts for withholding certificates.",
    ],
    laws: [
      {
        name: "UGC Public Notice on Document Retention",
        reference: "UGC Notification No. F. 1-3/2007 (CPP-II)",
        description: "Makes retention of original educational certificates illegal under any circumstance.",
      },
    ],
    immediateActions: [
      "Send a formal letter citing the UGC document retention notification.",
      "File a complaint on UGC e-Samadhan portal.",
      "File an application with the District Collector or Higher Education Directorate.",
    ],
    dontDo: [
      "Do not sign an agreement waiving your right to original certificates.",
      "Do not pay illegal 'document release processing charges'.",
    ],
    documents: ["Admission letter", "Document handover receipt/slip", "Written proof of document demand"],
    authorities: [
      { name: "UGC Ombudsman", description: "Enforces non-retention of educational credentials." },
      { name: "State Directorate of Higher Education", description: "Supervises colleges across the state." },
    ],
    emergency: [{ label: "National Student Helpline", number: "1800-111-654" }],
    learningPath: { title: "Student Rights in India", lessons: 4, duration: "25 min", journeySlug: "student-rights" },
    quiz: { title: "Student Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "campus-ragging-harassment",
    title: "I am facing ragging on campus or in the college hostel",
    category: "students",
    subcategory: "Ragging",
    icon: ShieldAlert,
    tagline: "Physical, verbal, psychological abuse, or harassment by seniors.",
    summary:
      "You or someone you know is being intimidated, coerced into humiliating acts, physically assaulted, or harassed by senior students in college or hostel premises.",
    rights: [
      "Zero tolerance: Ragging is a criminal offence with mandatory FIR registration.",
      "Right to total anonymity when reporting to the National Anti-Ragging Helpline.",
      "Mandatory suspension and criminal prosecution of perpetrators within 24 hours.",
    ],
    laws: [
      {
        name: "UGC Regulations on Curbing Ragging in Higher Educational Institutions",
        reference: "Regulations 2009 pursuant to Supreme Court directive",
        description: "Mandates institutional Anti-Ragging Squads and immediate police reporting.",
      },
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Sections covering wrongful restraint, assault, and criminal intimidation",
        description: "Criminal provisions for arrest and trial of perpetrators.",
      },
    ],
    immediateActions: [
      "Call the 24x7 Anti-Ragging Toll-Free Helpline (1800-180-5522).",
      "Submit an anonymous report at antiragging.in.",
      "Notify the College Anti-Ragging Committee and the Hostel Warden in writing.",
    ],
    dontDo: [
      "Do not suffer in silence or attempt to confront hostile senior groups alone.",
      "Do not delete abusive text messages, WhatsApp chats, or recordings.",
    ],
    documents: ["Medical report of any injury", "Screenshots of threatening chats or audio", "Hostel room details"],
    authorities: [
      { name: "National Anti-Ragging Helpline", description: "24/7 central monitoring agency." },
      { name: "Local Police Station", description: "Required to file FIR if physical threat exists." },
    ],
    emergency: [
      { label: "Anti-Ragging Helpline (24x7)", number: "1800-180-5522" },
      { label: "Police Emergency", number: "112" },
    ],
    learningPath: { title: "Student Rights in India", lessons: 4, duration: "25 min", journeySlug: "student-rights" },
    quiz: { title: "Anti-Ragging Law Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "hostel-pg-deposit-dispute",
    title: "PG / Hostel owner is not returning my security deposit",
    category: "students",
    subcategory: "Hostel/PG deposit issue",
    icon: Building2,
    tagline: "Deductions for painting, maintenance, or refusal to refund upon vacating.",
    summary:
      "You vacated your student paying-guest (PG) or private hostel with proper notice, but the owner refuses to refund your ₹10,000–₹30,000 security deposit.",
    rights: [
      "Full deposit refund within agreed notice timeline minus legitimate evidenced damages only.",
      "Right to receive an itemized receipt for any repair deductions.",
      "Consumer remedy against unfair trade practices by commercial PG operators.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "Section 2(11) & 2(47)",
        description: "Commercial PG accommodations are service providers liable for deficiency in service.",
      },
    ],
    immediateActions: [
      "Send a written notice over WhatsApp and registered post with your bank IFSC details.",
      "Share photos of the clean, vacant room taken on your move-out date.",
      "Lodge an online grievance on the National Consumer Helpline (consumerhelpline.gov.in).",
    ],
    dontDo: ["Do not leave without taking date-stamped move-out photos.", "Do not surrender the keys without a written acknowledgement."],
    documents: ["PG admission receipt/agreement", "Deposit transfer bank screenshot", "Move-out room photos"],
    authorities: [{ name: "National Consumer Helpline (NCH)", description: "Government portal for pre-litigation consumer resolution." }],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy & Deposit Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "coaching-fee-refund-dispute",
    title: "Coaching institute refusing refund after I dropped out",
    category: "students",
    subcategory: "Education refund dispute",
    icon: ShoppingBag,
    tagline: "Coaching centres refusing proportional fee refunds upon early withdrawal.",
    summary:
      "You enrolled in an entrance coaching program (JEE/NEET/UPSC) and paid full annual fees upfront. You dropped out within weeks, but the coaching refuses any proportional refund.",
    rights: [
      "CCPA Guidelines for Prevention of Misleading Ads and Fair Coaching Practices (2024).",
      "Coaching centres cannot retain 100% of advance fees if a student leaves mid-way.",
      "Pro-rata refund of tuition fees within 10 days of exit application.",
    ],
    laws: [
      {
        name: "CCPA Guidelines for Coaching Sector (2024)",
        reference: "Ministry of Consumer Affairs Gazette 2024",
        description: "Forbids non-refundable clauses and unfair upfront lock-in contracts.",
      },
    ],
    immediateActions: [
      "Submit an exit request in writing citing CCPA Coaching Guidelines.",
      "Lodge a consumer grievance on consumerhelpline.gov.in (NCH 1915).",
      "File an e-Daakhil consumer complaint if refund is denied beyond 14 days.",
    ],
    dontDo: ["Do not sign a voluntary forfeiture form.", "Do not discard your enrollment terms booklet."],
    documents: ["Admission receipt showing fee breakdown", "Exit application with timestamp", "Coaching terms brochure"],
    authorities: [{ name: "Central Consumer Protection Authority (CCPA)", description: "Regulates coaching unfair practices." }],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "fake-internship-scam",
    title: "I was scammed by a fake online internship or unpaid bond",
    category: "students",
    subcategory: "Fake internship",
    icon: HardHat,
    tagline: "Companies charging registration fees for internships or forcing unpaid bonds.",
    summary:
      "A company promised an internship with stipend but demanded ₹2,000–₹5,000 for 'training materials' or certificate verification, and then disappeared.",
    rights: [
      "Legitimate internships pay stipends or are free; charging money for recruitment is fraud.",
      "Right to report fake corporate entities on the MCA portal and Cyber Crime reporting portal.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66D",
        description: "Cheating by personation using computer resources.",
      },
    ],
    immediateActions: [
      "Lodge an immediate fraud complaint at cybercrime.gov.in.",
      "Notify your college placement cell to blacklist the recruiter.",
      "Preserve offer letters, payment receipts, and recruitment chat transcripts.",
    ],
    dontDo: ["Do not pay additional 'clearance fees' to retrieve earlier money.", "Do not provide your Aadhaar/PAN without checking MCA registration."],
    documents: ["Offer letter", "UPI/Bank transaction ID", "WhatsApp/LinkedIn chat log"],
    authorities: [{ name: "National Cyber Crime Reporting Portal", description: "Official fraud registry." }],
    emergency: [{ label: "Cyber Fraud Helpline", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "fake-placement-fraud",
    title: "College placement cell brought fake company for campus recruitment",
    category: "students",
    subcategory: "Fake placement",
    icon: GraduationCap,
    tagline: "Colleges exaggerating placement records or facilitating bogus job offers.",
    summary:
      "You were selected in campus placements, received an offer letter, but the company revoked all offers or proved to be a shell company with no operational office.",
    rights: [
      "Right to transparent and verifiable campus placement records under AICTE/UGC guidelines.",
      "Consumer right against college for misleading claims made during admission marketing.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "Section 2(28) Misleading Advertisement",
        description: "Colleges are accountable for false placement guarantees used to attract admissions.",
      },
    ],
    immediateActions: [
      "Collate batch-wide complaints through the student union/representatives.",
      "File a joint petition to the Vice-Chancellor and AICTE Grievance Portal.",
      "File a consumer case for refund of training and placement fees.",
    ],
    dontDo: ["Do not surrender original offer letters.", "Do not accept verbal delays without official written commitments."],
    documents: ["Campus placement circular", "Offer letter", "College prospectus promising placements"],
    authorities: [{ name: "AICTE Grievance Redressal Cell", description: "Oversees technical institutes." }],
    emergency: [{ label: "National Student Helpline", number: "1800-111-654" }],
    learningPath: { title: "Student Rights in India", lessons: 4, duration: "25 min", journeySlug: "student-rights" },
    quiz: { title: "Student Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "scholarship-disbursement-issue",
    title: "Government / College scholarship delayed or wrongfully withheld",
    category: "students",
    subcategory: "Scholarship issue",
    icon: GraduationCap,
    tagline: "NSP or state welfare scholarship approved but funds not released.",
    summary:
      "Your National Scholarship Portal (NSP) or state post-matric scholarship was approved, but the college or welfare department has not disbursed the funds.",
    rights: [
      "Direct Benefit Transfer (DBT) mandates funds must reach the student's Aadhaar-seeded bank account.",
      "Colleges cannot bar students from classes or exams due to delays in government scholarship disbursement.",
    ],
    laws: [
      {
        name: "Direct Benefit Transfer (DBT) Welfare Guidelines",
        reference: "Ministry of Social Justice & Empowerment",
        description: "Prohibits institutional penalties on students pending DBT transfers.",
      },
      {
        name: "Right to Information Act, 2005",
        reference: "Section 6",
        description: "Enables students to track exact sanction files and disbursement status.",
      },
    ],
    immediateActions: [
      "Check PFMS DBT status using your application ID.",
      "Submit a written letter to the college registrar requesting an exam hall ticket waiver.",
      "File an RTI with the State Welfare Department seeking disbursement timelines.",
    ],
    dontDo: ["Do not borrow from informal loan sharks to pay fees while scholarship is sanctioned."],
    documents: ["NSP application receipt", "Sanction letter", "Bank passbook statement"],
    authorities: [{ name: "District Welfare Office", description: "Coordinates state scholarship disbursements." }],
    emergency: [{ label: "NSP Helpdesk", number: "0120-6619540" }],
    learningPath: { title: "Student Rights in India", lessons: 4, duration: "25 min", journeySlug: "student-rights" },
    quiz: { title: "Student Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 2. TENANT / HOUSING
  // ==========================================
  {
    slug: "landlord-withholding-deposit",
    title: "My landlord is not returning my deposit",
    category: "tenants",
    subcategory: "Security deposit dispute",
    icon: Building2,
    tagline: "Security deposit not refunded after moving out.",
    summary:
      "You vacated a rented home with proper notice, but the landlord refuses to return your security deposit or makes unjustified deductions for wear and tear.",
    rights: [
      "Full deposit refund within agreed timeline (capped at 30 days under Model Tenancy Act).",
      "Itemized deduction invoice with actual invoices and evidence of damages.",
      "Recovery through the Rent Authority or Small Causes Civil Court.",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        reference: "Section 13",
        description: "Caps residential deposits at 2 months' rent and sets a strict 1-month refund timeline.",
      },
      {
        name: "State Tenancy / Rent Control Act",
        reference: "Applicable State Legislation",
        description: "Provides summary dispute settlement before the Rent Controller.",
      },
    ],
    immediateActions: [
      "Send a written demand notice with your bank IFSC details and move-out photos.",
      "Submit a grievance to the local Rent Authority / Rent Controller.",
      "If ignored, issue a formal advocate's legal notice.",
    ],
    dontDo: [
      "Do not rely on verbal telephone promises.",
      "Do not damage fixtures or premises in anger.",
    ],
    documents: ["Registered / notarized Rent Agreement", "Deposit payment proof / UPI receipt", "Move-out inspection photos"],
    authorities: [
      { name: "Rent Authority / Rent Controller", description: "Handles tenancy disputes." },
      { name: "Civil Court (Small Causes)", description: "For monetary recovery suits." },
    ],
    emergency: [{ label: "Citizen Emergency", number: "112" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenant Rights Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "tenants-eviction-concern",
    title: "Landlord threatening immediate eviction without notice",
    category: "tenants",
    subcategory: "Eviction concern",
    icon: Building2,
    tagline: "Landlord cutting power, throwing luggage, or giving 24-hour notice to vacate.",
    summary:
      "Your landlord is threatening to forcibly throw out your belongings or cut off water and electricity without serving statutory written eviction notice.",
    rights: [
      "Protection from arbitrary eviction: Law forbids forceable physical eviction without a court order.",
      "Essential utilities (water, electricity) CANNOT be disconnected under any circumstance.",
      "Right to statutory notice period (typically 30 days as specified in agreement).",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        reference: "Section 20 & 21",
        description: "Explicitly bars landlords from withholding essential supplies or dispossessing without Rent Court order.",
      },
    ],
    immediateActions: [
      "Call Police (112) immediately if landlord attempts physical trespassing or baggage removal.",
      "File an application before the Rent Authority for restoration of utilities.",
      "Obtain an interim injunction from the civil court.",
    ],
    dontDo: ["Do not vacate under unrecorded verbal threats without written notice.", "Do not engage in physical altercations."],
    documents: ["Active rent agreement", "Utility bill payment receipts", "Video/Audio of threats if safely captured"],
    authorities: [{ name: "Rent Controller", description: "Can order immediate penalty on landlord." }],
    emergency: [{ label: "Police Emergency", number: "112" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "tenant-water-utility-disconnection",
    title: "Landlord disconnected water or electricity to force me out",
    category: "tenants",
    subcategory: "Water/utility dispute",
    icon: Building2,
    tagline: "Cutting power, water, or elevator access to harass tenants.",
    summary:
      "To force you to vacate or accept higher rent, your landlord has intentionally turned off the water valve, disconnected power, or instructed society security to block your entry.",
    rights: [
      "Access to essential utilities is an integral part of the right to shelter under Article 21.",
      "Landlords commit an actionable civil wrong and penal offence by severing essential services.",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        reference: "Section 20",
        description: "Heavy monetary penalties on landlords who sever essential services.",
      },
    ],
    immediateActions: [
      "File a police complaint (112) for criminal nuisance and wrongful restraint.",
      "Submit an emergency petition before the Rent Authority for interim utility reconnection.",
    ],
    dontDo: ["Do not tamper with main municipal meters without authorized technicians."],
    documents: ["Rent agreement", "Photos/video showing disconnected power/water line", "Rent payment proofs"],
    authorities: [{ name: "Local Police Station / Rent Authority", description: "Enforces immediate basic utility restoration." }],
    emergency: [{ label: "Police", number: "112" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "rental-agreement-dispute",
    title: "Landlord refuses to register agreement or changes clauses",
    category: "tenants",
    subcategory: "Rental agreement dispute",
    icon: Building2,
    tagline: "Unregistered agreements, sudden arbitrary rent hikes, and unwritten terms.",
    summary:
      "Landlord insists on an oral tenancy, refuses to provide a copy of the agreement, or unilaterally increases rent beyond the agreed percentage.",
    rights: [
      "Right to a written, registered tenancy agreement with a signed duplicate copy for the tenant.",
      "Rent increase must strictly follow notice periods and agreed formula.",
    ],
    laws: [
      {
        name: "Registration Act, 1908",
        reference: "Section 17",
        description: "Leases of immovable property exceeding 11 months must be registered.",
      },
    ],
    immediateActions: [
      "Demand a signed copy of the draft agreement before moving belongings.",
      "Pay rent only through traceable digital banking channels (NEFT/UPI) with remarks.",
    ],
    dontDo: ["Never pay large security deposits without an executed draft agreement."],
    documents: ["Draft agreement", "Rent payment bank statements"],
    authorities: [{ name: "Sub-Registrar of Assurances", description: "Registers tenancy deeds." }],
    emergency: [{ label: "Emergency", number: "112" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "landlord-refusing-rent-receipt",
    title: "Landlord refuses to give rent receipts for HRA tax deduction",
    category: "tenants",
    subcategory: "Rent receipt issue",
    icon: Building2,
    tagline: "Landlords demanding cash to avoid income tax reporting.",
    summary:
      "You pay monthly rent on time, but the landlord refuses to issue signed receipts or share their PAN card, preventing you from claiming HRA tax exemption.",
    rights: [
      "Statutory right of the tenant to receive a signed rent receipt upon payment.",
      "Right to report cash rent evasion to Income Tax department if harassed.",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        reference: "Section 6",
        description: "Mandates landlord to provide a written receipt on payment of rent.",
      },
    ],
    immediateActions: [
      "Shift all rent payments to online bank transfer mentioning 'Rent for [Month]' in payment remarks.",
      "Send monthly emails acknowledging bank transfer as self-generated rent record.",
    ],
    dontDo: ["Do not pay cash without a physical signature on a revenue-stamped receipt."],
    documents: ["Bank transfer statements", "Lease agreement", "HRA claim form"],
    authorities: [{ name: "Income Tax Department", description: "Accepts bank proofs for legitimate HRA claims." }],
    emergency: [{ label: "Tax Helpline", number: "1800-180-1961" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "excessive-deposit-deductions",
    title: "Landlord deducting entire deposit for regular whitewashing and painting",
    category: "tenants",
    subcategory: "Deposit deduction",
    icon: Building2,
    tagline: "Charging full interior painting costs to tenant upon vacating.",
    summary:
      "Landlord deducted ₹25,000 from your deposit for painting, claiming normal wear and tear over a 2-year stay constitutes damage.",
    rights: [
      "Normal wear and tear is the landlord's responsibility and CANNOT be deducted from deposit.",
      "Landlord must provide actual painter bills and prove willful damage.",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        reference: "Schedule II (Maintenance Roles)",
        description: "Distinguishes between routine structural whitewash (landlord duty) vs tenant damage.",
      },
    ],
    immediateActions: [
      "Dispute deductions in writing citing move-in vs move-out comparison photos.",
      "File a complaint before the Rent Authority for unlawful withholding.",
    ],
    dontDo: ["Do not accept vague verbal deductions without verified contractor bills."],
    documents: ["Move-in condition report", "Move-out dated video walkthrough", "Rent agreement"],
    authorities: [{ name: "Rent Controller", description: "Adjudicates deposit deductions." }],
    emergency: [{ label: "Citizen Helpline", number: "112" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "unhygienic-accommodation-dispute",
    title: "Rented flat has severe structural leakage, seepage, or mold",
    category: "tenants",
    subcategory: "Unhygienic accommodation",
    icon: Building2,
    tagline: "Landlord refusing to repair dangerous seepage or unlivable premises.",
    summary:
      "Your rented flat developed heavy water seepage, ceiling peeling, or mold making it uninhabitable, but the landlord refuses structural repairs or rent reduction.",
    rights: [
      "Landlord is legally bound to maintain premises in a tenantable and safe condition.",
      "Right to carry out repairs after notice and deduct costs from rent under Tenancy Acts.",
    ],
    laws: [
      {
        name: "Model Tenancy Act, 2021",
        reference: "Section 15 (Repairs)",
        description: "If landlord fails to repair within 15 days of notice, tenant can repair and adjust from rent.",
      },
    ],
    immediateActions: [
      "Issue 15-day written notice to landlord demanding structural repair.",
      "If ignored, get repair estimate and notify landlord of planned deduction.",
    ],
    dontDo: ["Do not withhold rent entirely without serving prior written notice."],
    documents: ["Photos/Videos of seepage damage", "Written repair notice", "Repair contractor invoice"],
    authorities: [{ name: "Rent Authority", description: "Inspects tenantable habitability." }],
    emergency: [{ label: "Citizen Emergency", number: "112" }],
    learningPath: { title: "Tenant & Housing Rights", lessons: 4, duration: "25 min", journeySlug: "tenant-rights" },
    quiz: { title: "Tenancy Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "pg-room-sharing-dispute",
    title: "PG operator cramped 4 people into a double sharing room",
    category: "tenants",
    subcategory: "Accommodation dispute",
    icon: Building2,
    tagline: "Overcrowding and changing room terms without consent.",
    summary:
      "You paid for a double-sharing PG room, but the owner forcefully placed two extra cots and occupants into the room without consent or fee reduction.",
    rights: [
      "Consumer right to receive the exact contracted service quality and room configuration.",
      "Municipal health laws prohibit unsafe fire-hazard overcrowding in commercial guest houses.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "Deficiency in Service",
        description: "Breach of agreed accommodation specifications constitutes service failure.",
      },
    ],
    immediateActions: [
      "Demand immediate refund or rent reduction in writing.",
      "Report municipal fire and licensing violation to the local municipal ward office.",
    ],
    dontDo: ["Do not pay cash for extra beds."],
    documents: ["Original booking receipt specifying 2-sharing", "Photos of overcrowded room"],
    authorities: [{ name: "District Consumer Forum", description: "Compensates for substandard service." }],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 3. CONSUMER RIGHTS
  // ==========================================
  {
    slug: "defective-product",
    title: "I bought a defective product and the seller refuses replacement",
    category: "consumers",
    subcategory: "Defective product",
    icon: ShoppingBag,
    tagline: "Electronics, appliances, or goods that stopped working within days.",
    summary:
      "You purchased a smartphone or appliance online or from a showroom, but it broke down immediately and the brand service center refuses warranty repair or replacement.",
    rights: [
      "Product Liability under CPA 2019 holds manufacturer and seller liable for defects.",
      "Right to free repair, full replacement, or complete refund with compensation.",
      "Right to file an e-complaint on e-Daakhil from your home district.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "Section 84 & 85",
        description: "Statutory product liability for manufacturing defects and design flaws.",
      },
    ],
    immediateActions: [
      "Lodge a grievance with National Consumer Helpline (consumerhelpline.gov.in / 1915).",
      "Get a formal written job sheet / rejection note from the authorized service centre.",
      "Send a legal notice via email to the company's nodal officer.",
    ],
    dontDo: ["Do not open the device at an uncertified local third-party shop.", "Do not lose original purchase tax invoices."],
    documents: ["Tax invoice / cash memo", "Warranty card", "Service centre job sheet"],
    authorities: [{ name: "District Consumer Disputes Redressal Commission", description: "Adjudicates claims up to ₹50 Lakhs." }],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    relatedActs: ["consumer-protection-act-2019"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "product-not-delivered",
    title: "E-commerce platform took money but product never arrived",
    category: "consumers",
    subcategory: "Product not delivered",
    icon: ShoppingBag,
    tagline: "Undelivered orders marked 'Delivered' or delayed indefinitely without refund.",
    summary:
      "You ordered an item online, payment was debited, but the delivery never arrived. Customer support marks it as delivered or gives automated excuses.",
    rights: [
      "Right to receive goods within promised estimated delivery window.",
      "Immediate full refund if order is cancelled or delivery fails.",
      "Consumer e-commerce rules mandate grievance officer resolution within 15 days.",
    ],
    laws: [
      {
        name: "Consumer Protection (E-Commerce) Rules, 2020",
        reference: "Rule 5 & 6",
        description: "Platforms must maintain a clear grievance mechanism and refund failed deliveries.",
      },
    ],
    immediateActions: [
      "Register an official complaint on National Consumer Helpline (Call 1915 or WhatsApp 8800001915).",
      "Demand delivery agent GPS and signature proof from the courier partner.",
    ],
    dontDo: ["Do not accept store credit / voucher coupons if you asked for a bank refund."],
    documents: ["Order confirmation email", "Bank debit statement", "Chat transcript with support"],
    authorities: [{ name: "National Consumer Helpline (NCH)", description: "Handles e-commerce delivery complaints." }],
    emergency: [{ label: "NCH Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "refund-denied",
    title: "Company refuses refund citing 'No Return / No Refund' policy",
    category: "consumers",
    subcategory: "Refund denied",
    icon: ShoppingBag,
    tagline: "Illegal blanket 'no refund' stamps printed on invoices.",
    summary:
      "You received a damaged or wrong product, but the store refuses a refund claiming their bill says 'Goods once sold will not be taken back'.",
    rights: [
      "Unfair contract terms under CPA 2019: 'No return, no refund' blanket clauses are legally void if goods are defective.",
      "Consumer has absolute right to return non-conforming or broken items.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "Section 2(46) Unfair Contract",
        description: "Prohibits one-sided contracts imposing unreasonable liability on consumers.",
      },
    ],
    immediateActions: [
      "Quote Section 2(46) of CPA 2019 in written reply to store manager.",
      "File a grievance on consumerhelpline.gov.in.",
    ],
    dontDo: ["Do not accept store vouchers when legally entitled to cash/bank return."],
    documents: ["Invoice with defective product photo", "Store return denial email"],
    authorities: [{ name: "District Consumer Commission", description: "Strikes down unfair contract terms." }],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "warranty-claim-denied",
    title: "Service center denied warranty claiming 'customer physical damage'",
    category: "consumers",
    subcategory: "Warranty issue",
    icon: ShoppingBag,
    tagline: "False customer-induced damage claims to evade warranty repairs.",
    summary:
      "A laptop or phone developed display flickering during the 1-year warranty, but the brand claims minor scratches void the entire motherboard warranty.",
    rights: [
      "Burden of proof is on the manufacturer to prove that minor scratch caused internal failure.",
      "Right to warranty service as promised during purchase.",
    ],
    laws: [
      {
        name: "Consumer Protection Act, 2019",
        reference: "Deficiency in Service & Product Liability",
        description: "Failing to honour warranty commitments constitutes actionable deficiency.",
      },
    ],
    immediateActions: [
      "Demand detailed technical diagnosis report explaining how cosmetic mark caused internal fault.",
      "File a complaint with the brand's Grievance Officer and NCH 1915.",
    ],
    dontDo: ["Do not leave the product indefinitely without a signed service job sheet."],
    documents: ["Warranty card", "Original bill", "Rejection job sheet"],
    authorities: [{ name: "District Consumer Commission", description: "Orders free warranty fulfillment." }],
    emergency: [{ label: "NCH Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "misleading-advertisement",
    title: "Brand made false claims in advertisement about product efficacy",
    category: "consumers",
    subcategory: "Misleading advertisement",
    icon: ShoppingBag,
    tagline: "Fake guarantees, 100% cure claims, or exaggerated performance metrics.",
    summary:
      "You bought a health supplement, course, or device based on an advertisement claiming '100% verified result', which proved completely fraudulent.",
    rights: [
      "Protection from misleading advertisements under CCPA regulations.",
      "Penalty up to ₹10 Lakhs on advertisers and endorsers for unsubstantiated claims.",
    ],
    laws: [
      {
        name: "Guidelines for Prevention of Misleading Advertisements, 2022",
        reference: "CCPA Gazette Notification",
        description: "Bars bait advertising, surrogate ads, and false performance claims.",
      },
    ],
    immediateActions: [
      "Report misleading ad to CCPA via consumerhelpline.gov.in.",
      "Submit ad screenshot to Advertising Standards Council of India (ASCI).",
    ],
    dontDo: ["Do not discard packaging showing false claims."],
    documents: ["Screenshot/recording of advertisement", "Purchase bill", "Product packaging"],
    authorities: [{ name: "Central Consumer Protection Authority (CCPA)", description: "Issues recall orders." }],
    emergency: [{ label: "Consumer Helpline", number: "1915" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "unauthorized-card-charge",
    title: "Unauthorized subscription or merchant charge on my credit/debit card",
    category: "consumers",
    subcategory: "Unauthorized charge",
    icon: ShoppingBag,
    tagline: "Hidden recurring charges debited without 2-factor authentication.",
    summary:
      "An online platform charged your card without OTP verification or continues auto-debiting after you cancelled the subscription.",
    rights: [
      "RBI Zero Liability Circular: Zero customer liability if reported within 3 days of unauthorized debit.",
      "E-mandate regulations require pre-debit notifications 24 hours prior.",
    ],
    laws: [
      {
        name: "RBI Circular on Customer Protection — Limiting Liability",
        reference: "RBI/2017-18/15 DBR.No.Leg.BC.78/09.07.005/2017-18",
        description: "Limits citizen liability for unauthorized electronic transactions.",
      },
    ],
    immediateActions: [
      "Block your card immediately via banking app.",
      "File written chargeback dispute with bank within 3 working days.",
    ],
    dontDo: ["Do not delay reporting beyond 72 hours."],
    documents: ["Bank SMS/statement showing charge", "Proof of subscription cancellation"],
    authorities: [{ name: "Banking Ombudsman (RBI)", description: "Investigates chargeback denials." }],
    emergency: [{ label: "RBI Ombudsman", number: "14448" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "deficient-service-complaint",
    title: "Flight cancelled without notice and airline refuses hotel / refund",
    category: "consumers",
    subcategory: "Service complaint",
    icon: ShoppingBag,
    tagline: "Aviation, telecom, or courier service failure causing financial damage.",
    summary:
      "Your flight was delayed by 8 hours and subsequently cancelled without refreshment, hotel, or prompt alternate ticket arrangements.",
    rights: [
      "DGCA Passenger Charter mandates free meals, hotel accommodation, and compensation up to ₹10,000 for arbitrary cancellations.",
    ],
    laws: [
      {
        name: "DGCA Civil Aviation Requirements (CAR)",
        reference: "Section 3, Series M, Part IV",
        description: "Mandatory passenger facilities and cancellation compensations.",
      },
    ],
    immediateActions: [
      "Lodge complaint on AirSewa portal (airsewa.gov.in).",
      "File claim on National Consumer Helpline.",
    ],
    dontDo: ["Do not discard boarding pass or baggage tags."],
    documents: ["Flight ticket", "Cancellation SMS/Email", "Airport food/hotel expense bills"],
    authorities: [{ name: "AirSewa Nodal Officer / Consumer Court", description: "Aviation grievance redressal." }],
    emergency: [{ label: "AirSewa Helpline", number: "1800-11-2001" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "adulterated-food-delivery",
    title: "Found foreign contamination or insect in restaurant/delivery food",
    category: "consumers",
    subcategory: "Food/service issue",
    icon: ShoppingBag,
    tagline: "Unhygienic, contaminated, or expired food causing food poisoning.",
    summary:
      "You ordered food through an app and discovered dead insects, plastic shards, or suffered acute food poisoning requiring medical hospitalization.",
    rights: [
      "FSSAI standards guarantee safe, unadulterated, hygienically prepared food.",
      "Product liability claim for hospital bills and mental trauma against restaurant and delivery partner.",
    ],
    laws: [
      {
        name: "Food Safety and Standards Act, 2006",
        reference: "Section 59",
        description: "Penalizes selling unsafe food with heavy fines and imprisonment.",
      },
    ],
    immediateActions: [
      "Photograph and video record contaminated food immediately.",
      "File a complaint on FSSAI Food Safety Connect portal (foscos.fssai.gov.in).",
      "Preserve food sample and medical prescription.",
    ],
    dontDo: ["Do not discard the food before taking clear photos with order receipt."],
    documents: ["Food delivery invoice", "Medical prescription and pharmacy bill", "Photos of contaminated food"],
    authorities: [{ name: "Food Safety Officer / FSSAI", description: "Conducts surprise kitchen inspections." }],
    emergency: [{ label: "FSSAI Helpline", number: "1800-112-100" }],
    learningPath: { title: "Consumer Protection", lessons: 4, duration: "25 min", journeySlug: "consumer-protection" },
    quiz: { title: "Consumer Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 4. CYBER CRIME
  // ==========================================
  {
    slug: "scammed-online",
    title: "I got scammed online and lost money",
    category: "cyber",
    subcategory: "Online shopping scam",
    icon: ShieldAlert,
    tagline: "Phishing links, fake customer care, or unauthorized bank debits.",
    summary:
      "You were tricked by a fraudulent customer care number, clicked a fake link, or bought from a rogue website, resulting in money debited from your bank account.",
    rights: [
      "Right to immediately report to cyber helpline 1930 to trigger the citizen financial fraud freeze mechanism.",
      "RBI Zero Liability protection if fraud is reported without customer negligence within 72 hours.",
      "Right to mandatory police FIR registration for financial cyber crimes.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66D",
        description: "Cheating by personation using computer resource (up to 3 years imprisonment).",
      },
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 318(4) BNS / Sec 420 IPC",
        description: "Cheating and dishonestly inducing delivery of property.",
      },
    ],
    immediateActions: [
      "Call Cyber Crime Helpline 1930 within the first 'Golden Hour' to freeze funds.",
      "Lodge a detailed complaint at cybercrime.gov.in with transaction IDs.",
      "Block your netbanking, debit card, and UPI ID immediately via your bank app.",
    ],
    dontDo: [
      "Do not delete call logs, SMS, or WhatsApp chats with the scammer.",
      "Do not click further links sent to 'reverse' or 'refund' the payment.",
    ],
    documents: ["Bank account statement showing transaction", "Screenshots of chats, SMS, or phishing links", "Fraudulent UPI ID / Phone number"],
    authorities: [
      { name: "National Cyber Crime Reporting Portal", description: "Central portal coordinating with banks." },
      { name: "Cyber Crime Police Station", description: "District-level cyber cell for FIR investigation." },
    ],
    emergency: [
      { label: "Cyber Crime Helpline", number: "1930" },
      { label: "Police Emergency", number: "112" },
    ],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    relatedActs: ["information-technology-act-2000"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "upi-fraud",
    title: "Someone sent a fake QR code or payment request to steal my money",
    category: "cyber",
    subcategory: "UPI fraud",
    icon: ShieldAlert,
    tagline: "Entering UPI PIN on 'receive' requests or OLX buyer scams.",
    summary:
      "A buyer on an online marketplace claimed to send an advance payment via QR code, but scanning it and entering your PIN debited money from your account instead.",
    rights: [
      "Entering UPI PIN ALWAYS debits money; you never need a PIN to receive funds.",
      "Right to freeze inter-bank beneficiary wallets via 1930 Helpline.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66D",
        description: "Punishes UPI impersonation and financial deceit.",
      },
    ],
    immediateActions: [
      "Call 1930 within 2 hours to freeze the recipient bank account.",
      "File complaint on cybercrime.gov.in.",
      "Report the transaction in your UPI app (GPay/PhonePe/Paytm) as fraud.",
    ],
    dontDo: ["Never enter your UPI PIN to 'verify' or 'claim' incoming money."],
    documents: ["UPI Transaction Reference Number (UTR)", "Bank debit message", "Buyer chat transcript"],
    authorities: [{ name: "Cyber Cell & NPCI", description: "Tracks UPI transaction hops." }],
    emergency: [{ label: "Cyber Helpline", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "social-account-hacked",
    title: "My Instagram / WhatsApp account was hacked and asks friends for money",
    category: "cyber",
    subcategory: "Account hacked",
    icon: ShieldAlert,
    tagline: "Unauthorized login, 2FA bypass, and impersonation of account owner.",
    summary:
      "A hacker took over your social media account, changed recovery emails, and is sending emergency money requests to all your friends and family.",
    rights: [
      "Intermediaries must provide rapid identity verification to restore hacked accounts.",
      "Criminal action against unauthorized access under Section 43/66 of IT Act.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 43 & 66",
        description: "Hacking and unauthorized access to computer systems.",
      },
    ],
    immediateActions: [
      "Use platform's hacked recovery workflow (instagram.com/hacked).",
      "Post warnings on alternate channels (LinkedIn/WhatsApp) warning contacts.",
      "File an identity theft report at cybercrime.gov.in.",
    ],
    dontDo: ["Do not pay ransom to hacker via cryptocurrency or gift cards."],
    documents: ["Screenshots of account takeover email", "Evidence of scam messages sent to friends"],
    authorities: [{ name: "Cyber Crime Cell", description: "Submits preservation requests to meta/social platforms." }],
    emergency: [{ label: "Cyber Crime Helpline", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "social-media-impersonation",
    title: "Someone created a fake profile with my photos and name",
    category: "cyber",
    subcategory: "Social-media impersonation",
    icon: ShieldAlert,
    tagline: "Cloned profiles, fake identity misuse, and character defamation.",
    summary:
      "An unknown user created a duplicate Instagram, Facebook, or dating profile using your photos, full name, and phone number to solicit money or defame you.",
    rights: [
      "Right to have impersonating accounts taken down by intermediaries within 24 hours under IT Rules 2021.",
      "Criminal complaint for identity theft under Section 66C of IT Act.",
    ],
    laws: [
      {
        name: "Information Technology (Intermediary Guidelines) Rules, 2021",
        reference: "Rule 3(2)(b)",
        description: "Mandates social media platforms to remove impersonating content within 24 hours.",
      },
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66C",
        description: "Identity theft using unique identification features.",
      },
    ],
    immediateActions: [
      "Report the profile directly to the social media platform with photo ID verification.",
      "Lodge a complaint on cybercrime.gov.in under 'Women / Cyber crime reporting'.",
    ],
    dontDo: ["Do not delete screenshots of the fake profile URL before reporting."],
    documents: ["Exact URL of fake profile", "Screenshots showing stolen photos", "Your valid government ID"],
    authorities: [{ name: "Grievance Officer of Platform / Cyber Police", description: "Enforces 24-hour statutory takedowns." }],
    emergency: [{ label: "Cyber Helpline", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "cyber-harassment",
    title: "I am facing cyber stalking, abuse, and threatening messages online",
    category: "cyber",
    subcategory: "Cyber harassment",
    icon: ShieldAlert,
    tagline: "Persistent abusive DMs, trolling, rape threats, and online harassment.",
    summary:
      "An individual or group is persistently sending abusive, sexually explicit, or threatening messages across Instagram, email, or WhatsApp, ignoring your blocks.",
    rights: [
      "Right against online stalking and criminal intimidation under Bharatiya Nyaya Sanhita.",
      "Immediate protection orders and identity disclosure subpoenas served on platforms.",
    ],
    laws: [
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 78 BNS / Section 354D IPC (Stalking)",
        description: "Criminal stalking includes electronic monitoring and persistent online contact.",
      },
      {
        name: "Information Technology Act, 2000",
        reference: "Section 67",
        description: "Transmitting obscene material in electronic form.",
      },
    ],
    immediateActions: [
      "Take full screenshots including usernames, profile URLs, and timestamps.",
      "File a complaint at cybercrime.gov.in under the 'Report Women / Child Related Crime' tab.",
      "Visit the nearest police station to lodge an FIR for cyber stalking.",
    ],
    dontDo: ["Do not engage in counter-abuse or erase message threads."],
    documents: ["Exported chat logs", "Screenshots showing timestamp and phone numbers"],
    authorities: [{ name: "Cyber Crime Cell & Women Safety Desk", description: "Investigates digital stalking." }],
    emergency: [
      { label: "Women Helpline", number: "1091" },
      { label: "Cyber Crime", number: "1930" },
    ],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "phishing-otp-scam",
    title: "Bank KYC update or electricity bill disconnection SMS scam",
    category: "cyber",
    subcategory: "Phishing",
    icon: ShieldAlert,
    tagline: "SMS links threatening electricity disconnection or PAN-bank suspension.",
    summary:
      "You received an urgent SMS claiming 'Your electricity power will be cut tonight at 9:30 PM. Call this officer immediately', prompting you to download a screen-sharing app.",
    rights: [
      "Discoms and banks NEVER ask customers to install APKs or screen sharing tools (AnyDesk/TeamViewer).",
      "Right to report phishing numbers on DoT Chakshu portal (sancharsaathi.gov.in).",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66D",
        description: "Cheating by personation and telecommunication fraud.",
      },
    ],
    immediateActions: [
      "Never install any remote access APKs (.apk files) sent via WhatsApp or SMS.",
      "Report suspect SMS on Chakshu portal (sancharsaathi.gov.in).",
      "If money was debited, call 1930 immediately.",
    ],
    dontDo: ["Never install TeamViewer, AnyDesk, or QuickSupport on instructions from callers."],
    documents: ["Screenshot of phishing SMS with sender ID", "Call recording if available"],
    authorities: [{ name: "Department of Telecommunications (DoT) Chakshu", description: "Blocks fraudulent SIMs and handsets." }],
    emergency: [{ label: "Cyber Helpline", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "identity-theft-loan-misuse",
    title: "Loan apps issued loans in my name using stolen PAN / Aadhaar",
    category: "cyber",
    subcategory: "Identity misuse",
    icon: ShieldAlert,
    tagline: "Discovering fake personal loans on CIBIL report taken by fraudsters.",
    summary:
      "You checked your credit report (CIBIL/Experian) and discovered unauthorized loan accounts or instant credit lines opened using your PAN without your knowledge.",
    rights: [
      "RBI Fair Practices Code: NBFCs must verify identity via live video KYC before disbursal.",
      "Right to have fraudulent loan entries removed from credit bureaus with zero liability.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66C (Identity Theft)",
        description: "Misuse of electronic identity and PAN/Aadhaar data.",
      },
    ],
    immediateActions: [
      "File identity theft complaint on cybercrime.gov.in.",
      "Send written dispute with copy of FIR to CIBIL and the lending NBFC.",
      "Lock your Aadhaar biometrics on the UIDAI portal/mAadhaar app.",
    ],
    dontDo: ["Do not pay loan settlement amounts for loans you never received."],
    documents: ["CIBIL credit report", "Aadhaar / PAN card copies", "Cyber crime acknowledgement slip"],
    authorities: [{ name: "RBI Ombudsman / Cyber Cell", description: "Enforces CIBIL score correction." }],
    emergency: [{ label: "Cyber Helpline", number: "1930" }],
    learningPath: { title: "Digital Privacy", lessons: 4, duration: "25 min", journeySlug: "digital-privacy" },
    quiz: { title: "Digital Privacy Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "threatening-online-messages",
    title: "Receiving extortion or blackmail messages via WhatsApp or Telegram",
    category: "cyber",
    subcategory: "Threatening messages",
    icon: ShieldAlert,
    tagline: "Video call blackmail (sextortion) or loan app harassment.",
    summary:
      "Fraudsters recorded a morphed video from an unexpected video call or accessed your contact list, threatening to circulate compromising material unless you pay ransom.",
    rights: [
      "Do NOT pay: Paying does not stop extortion; it leads to escalating financial demands.",
      "Immediate legal protection: Cyber cells have specialized workflows to neutralize morphed extortion rings.",
    ],
    laws: [
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 308 BNS (Extortion) / Section 384 IPC",
        description: "Extortion and criminal intimidation.",
      },
    ],
    immediateActions: [
      "Do NOT pay any money under fear.",
      "Deactivate/Private your social media accounts temporarily.",
      "File complaint at cybercrime.gov.in under 'Cyber Extortion' or call 1930.",
    ],
    dontDo: ["Never transfer money in response to blackmail demands."],
    documents: ["Screenshots of extortion demands and bank/UPI IDs shared by blackmailer"],
    authorities: [{ name: "State Cyber Crime Police Station", description: "Specialized extortion investigation units." }],
    emergency: [
      { label: "Cyber Helpline", number: "1930" },
      { label: "Emergency", number: "112" },
    ],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "fake-government-job-portal",
    title: "Paid fees on a fake government recruitment website",
    category: "cyber",
    subcategory: "Fake website",
    icon: ShieldAlert,
    tagline: "Spoofed government portals (.com / .org instead of .gov.in) stealing fees.",
    summary:
      "You applied for a government exam (Railways/SSC/Police) on a lookalike portal mimicking official logos, paid ₹1,000 application fee, and discovered the website was rogue.",
    rights: [
      "All legitimate central and state government portals strictly end in '.gov.in' or '.nic.in'.",
      "Right to have fraudulent domain registrars suspended via CERT-In.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66D",
        description: "Cheating by electronic impersonation of official statutory bodies.",
      },
    ],
    immediateActions: [
      "Lodge complaint on cybercrime.gov.in and alert CERT-In (incident@cert-in.org.in).",
      "Dispute transaction with your bank immediately.",
    ],
    dontDo: ["Never enter credentials or OTPs on non-gov.in sites claiming official recruitment."],
    documents: ["URL of fake website", "Payment gateway receipt", "Fake admit card/receipt PDF"],
    authorities: [{ name: "CERT-In & Cyber Police", description: "Takedowns of rogue phishing domains." }],
    emergency: [{ label: "Cyber Crime", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "online-shopping-scam",
    title: "Bought goods from Instagram ad store that disappeared after payment",
    category: "cyber",
    subcategory: "Online shopping scam",
    icon: ShoppingBag,
    tagline: "Rogue social media stores advertising 80% discount products.",
    summary:
      "You bought clothes or gadgets through a sponsored Instagram ad, transferred money via UPI, but received no tracking details and the page blocked your profile.",
    rights: [
      "Right to trace recipient beneficiary through bank UTR under RBI digital fraud mechanisms.",
      "Consumer and cyber protection against deceptive digital storefronts.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66D",
        description: "Criminal fraud through online shops.",
      },
    ],
    immediateActions: [
      "Report fraud to 1930 within 2 hours.",
      "File complaint at cybercrime.gov.in.",
      "Report Instagram page to Meta for fraud and scam.",
    ],
    dontDo: ["Do not pay further 'courier customs clearance' demands."],
    documents: ["Instagram page screenshot", "Payment UTR number", "Order confirmation chat"],
    authorities: [{ name: "Cyber Crime Portal", description: "Coordinates account freezing." }],
    emergency: [{ label: "Cyber Helpline", number: "1930" }],
    learningPath: { title: "Cyber Safety in India", lessons: 4, duration: "25 min", journeySlug: "cyber-safety" },
    quiz: { title: "Cyber Safety Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 5. WOMEN & PERSONAL SAFETY
  // ==========================================
  {
    slug: "facing-harassment",
    title: "I am facing harassment or stalking in public or workplace",
    category: "women",
    subcategory: "Public harassment",
    icon: HeartHandshake,
    tagline: "Street harassment, persistent following, or workplace misconduct.",
    summary:
      "You are facing unwelcome physical contact, suggestive remarks, stalking on your commute, or inappropriate sexual advances from colleagues or strangers.",
    rights: [
      "Strict legal protection: Zero tolerance for harassment, stalking, and outraging modesty.",
      "Right to lodge a Zero FIR at ANY police station without jurisdictional delays.",
      "Workplace protection under the POSH Act 2013 via the Internal Complaints Committee (ICC).",
      "Right to female police officers during reporting and recording of statements.",
    ],
    laws: [
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 74, 75, 78 BNS / Sec 354, 354A, 354D IPC",
        description: "Covers assault, sexual harassment, and stalking.",
      },
      {
        name: "POSH Act, 2013",
        reference: "Section 4 & 9",
        description: "Internal Complaints Committee complaint mechanisms in workplaces.",
      },
    ],
    immediateActions: [
      "If in immediate physical danger, call Police Emergency (112) or Women Helpline (1091).",
      "Record audio/video or note exact times, dates, and vehicle numbers if safe.",
      "Submit a written complaint to your workplace ICC or local police station.",
    ],
    dontDo: [
      "Do not delete threatening messages, voicemails, or CCTV reference points.",
      "Do not let police refuse your complaint on jurisdictional grounds.",
    ],
    documents: ["Chronological log of incidents", "Screenshots / Call recordings", "Witness names if available"],
    authorities: [
      { name: "National Commission for Women (NCW)", description: "Apex statutory body for women's rights." },
      { name: "Internal Complaints Committee (ICC)", description: "Mandatory in every workplace with 10+ employees." },
    ],
    emergency: [
      { label: "Women in Distress Helpline", number: "1091" },
      { label: "National Emergency", number: "112" },
      { label: "NCW 24/7 Helpline", number: "7827170170" },
    ],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty", "article-14-equality-before-law"],
    relatedActs: ["posh-act-2013"],
    relatedCaseStudies: ["vishaka-v-state-of-rajasthan-1997"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "workplace-harassment",
    title: "Senior colleague or manager demanding sexual favours or making lewd remarks",
    category: "women",
    subcategory: "Workplace harassment",
    icon: HeartHandshake,
    tagline: "Hostile work environment, quid pro quo harassment, or inappropriate conduct.",
    summary:
      "A supervisor or colleague is subjecting you to sexually colored remarks, intrusive personal questions, or implying career retaliation if you reject their advances.",
    rights: [
      "POSH Act 2013: Absolute right to an inquiry by the Internal Committee (IC) with 50% women members.",
      "Right to interim relief (transfer to another department, 3 months paid leave during inquiry).",
      "Strict confidentiality: Law prohibits disclosing complainant's identity (Section 16).",
    ],
    laws: [
      {
        name: "POSH Act, 2013",
        reference: "Section 3 & 4",
        description: "Prevention of sexual harassment at workplace.",
      },
    ],
    immediateActions: [
      "Submit a written complaint to the Internal Complaints Committee (ICC) within 3 months.",
      "If workplace has fewer than 10 employees, file with the District Local Committee (LCC).",
    ],
    dontDo: ["Do not rely on verbal complaints to HR without an official written record."],
    documents: ["Written complaint", "Emails, Teams/Slack messages, WhatsApp chats", "List of witnesses"],
    authorities: [{ name: "Internal Committee (IC) / Local Complaints Committee", description: "Holds civil court inquiry powers." }],
    emergency: [
      { label: "NCW Helpline", number: "7827170170" },
      { label: "Women Helpline", number: "1091" },
    ],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "domestic-abuse-awareness",
    title: "Facing domestic violence, physical assault, or emotional cruelty at home",
    category: "women",
    subcategory: "Domestic abuse awareness",
    icon: HeartHandshake,
    tagline: "Protection against physical, verbal, emotional, and economic abuse.",
    summary:
      "A woman is experiencing physical violence, verbal cruelty, threats, or economic deprivation from a spouse or in-laws in a shared domestic household.",
    rights: [
      "Protection of Women from Domestic Violence Act, 2005 (PWDVA): Right to reside in shared household.",
      "Right to emergency Protection Orders, Residence Orders, and Monetary Relief.",
      "Free legal aid through District Legal Services Authority (DLSA).",
    ],
    laws: [
      {
        name: "Protection of Women from Domestic Violence Act, 2005",
        reference: "PWDVA Sections 12, 18, 19, 20",
        description: "Civil remedies, protection orders, and maintenance.",
      },
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 85, 86 BNS / Section 498A IPC",
        description: "Criminal punishment for matrimonial cruelty.",
      },
    ],
    immediateActions: [
      "Call Women Helpline 181 or Police Emergency 112 immediately during danger.",
      "Approach the Protection Officer (appointed in every district) or Magistrate under Section 12 PWDVA.",
      "Get a medical examination (MLC) at a government hospital to record injuries.",
    ],
    dontDo: ["Do not stay in isolation without informing trusted relatives or legal aid."],
    documents: ["Medical examination report", "Proof of marriage / shared residence", "Photographs of injuries"],
    authorities: [
      { name: "District Protection Officer", description: "Facilitates court protection orders." },
      { name: "DLSA (Legal Services Authority)", description: "Provides free advocates." },
    ],
    emergency: [
      { label: "National Domestic Violence Helpline", number: "181" },
      { label: "Police Emergency", number: "112" },
    ],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "stalking-concern",
    title: "Someone is following me physically on my daily commute",
    category: "women",
    subcategory: "Stalking concern",
    icon: HeartHandshake,
    tagline: "Repeatedly followed, watched, or cornered by an individual.",
    summary:
      "A person is persistently waiting outside your college/office, following you home, or monitoring your movements despite clear disinterest.",
    rights: [
      "Physical stalking is a non-bailable criminal offence upon second conviction.",
      "Right to police patrol assistance and immediate restraining orders.",
    ],
    laws: [
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 78 BNS / Sec 354D IPC",
        description: "Defines and punishes physical and electronic stalking.",
      },
    ],
    immediateActions: [
      "Call Police (112) or approach nearest PCR van.",
      "Walk into a crowded public place, metro station, or commercial shop immediately.",
      "Lodge an FIR at the police station with exact locations and vehicle numbers.",
    ],
    dontDo: ["Do not confront the stalker in isolated or dark spots alone."],
    documents: ["Log of dates, times, and locations", "Vehicle registration number", "CCTV camera locations along commute"],
    authorities: [{ name: "Local Police Station (Women Helpdesk)", description: "Mandatory FIR registration." }],
    emergency: [
      { label: "Women Helpline", number: "1091" },
      { label: "Emergency", number: "112" },
    ],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "unwanted-physical-contact",
    title: "Unwanted physical touching or groping on public transport",
    category: "women",
    subcategory: "Unwanted physical contact",
    icon: HeartHandshake,
    tagline: "Groping, assault, or inappropriate contact on buses, metros, or trains.",
    summary:
      "You experienced deliberate physical touch, groping, or molestation in a crowded bus, train, or market.",
    rights: [
      "Offence of assault with intent to outrage modesty (BNS Sec 74 / IPC 354).",
      "Police must register FIR immediately and arrest accused.",
    ],
    laws: [
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 74 BNS / Section 354 IPC",
        description: "Criminal assault against women.",
      },
    ],
    immediateActions: [
      "Raise immediate public alarm; alert bus conductor or metro security.",
      "Hand over accused to transport police/security at the next stop.",
      "Insist on filing an immediate Zero FIR.",
    ],
    dontDo: ["Do not allow transport authorities to settle the matter informally without police record."],
    documents: ["Bus/Metro ticket showing time and route", "Witness statements"],
    authorities: [{ name: "Government Railway Police (GRP) / Metro Police", description: "Transit safety enforcement." }],
    emergency: [
      { label: "Railway Police (RPF)", number: "139" },
      { label: "Police Emergency", number: "112" },
    ],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "online-women-harassment",
    title: "Non-consensual intimate imagery or morphed photo threats",
    category: "women",
    subcategory: "Online harassment",
    icon: ShieldAlert,
    tagline: "Revenge porn, deepfakes, or morphed photo circulation threats.",
    summary:
      "A former partner or unknown online actor is threatening to leak private photos or create AI deepfakes unless money or sexual demands are met.",
    rights: [
      "Mandatory 24-hour statutory takedown under IT Rules 2021.",
      "Strict criminal punishment under Section 66E (privacy violation) and 67A of IT Act.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 66E, 67 & 67A",
        description: "Publishing sexually explicit or private images without consent.",
      },
    ],
    immediateActions: [
      "Report to StopNCII.org to generate cryptographic hash preventing platform uploads.",
      "File immediate complaint on cybercrime.gov.in under 'Women / Child Crime'.",
    ],
    dontDo: ["Never pay money or send additional images in panic."],
    documents: ["Screenshots of threats and blackmailer handles"],
    authorities: [{ name: "National Cyber Crime Reporting Portal", description: "Emergency image takedown coordination." }],
    emergency: [
      { label: "Women Cyber Helpline", number: "1930" },
      { label: "NCW Helpline", number: "7827170170" },
    ],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "stalking-threatening-behaviour",
    title: "Received threatening phone calls demanding I withdraw a complaint",
    category: "women",
    subcategory: "Threatening behaviour",
    icon: HeartHandshake,
    tagline: "Witness intimidation or coerced compromise threats.",
    summary:
      "After lodging a dispute or complaint, you are receiving anonymous phone calls threatening your family if you do not withdraw the case.",
    rights: [
      "Supreme Court Witness Protection Scheme, 2018 guarantees police security and anonymity.",
      "Criminal intimidation is a cognizable offence under BNS Section 351 / IPC Section 506.",
    ],
    laws: [
      {
        name: "Bharatiya Nyaya Sanhita, 2023 / IPC",
        reference: "Section 351 BNS / Section 506 IPC",
        description: "Criminal intimidation.",
      },
    ],
    immediateActions: [
      "Inform the investigating officer and Magistrate in writing immediately.",
      "Apply for police protection under Witness Protection Scheme.",
    ],
    dontDo: ["Do not delete call logs or voicemails."],
    documents: ["Call logs with timestamps", "Audio recordings of threat"],
    authorities: [{ name: "District Witness Protection Committee", description: "Headed by District & Sessions Judge." }],
    emergency: [{ label: "Police Emergency", number: "112" }],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 6. TRAFFIC & ROAD LAW
  // ==========================================
  {
    slug: "traffic-stop-challan",
    title: "Traffic police stopped me and confiscated my car keys or license",
    category: "traffic",
    subcategory: "Traffic stop",
    icon: TrafficCone,
    tagline: "Vehicle checks, spot challans, and police document verification.",
    summary:
      "A traffic officer stopped your vehicle, pulled out the ignition keys, demanded physical documents instead of DigiLocker, or threatened vehicle impounding.",
    rights: [
      "Traffic police CANNOT pull out your vehicle keys or deflate tires.",
      "Digital documents on DigiLocker / mParivahan have equal statutory validity to physical cards.",
      "Only an officer of Sub-Inspector (SI) rank or above can issue spot challans above specified values.",
      "Right to receive a printed or electronic challan receipt immediately on the spot.",
    ],
    laws: [
      {
        name: "Motor Vehicles Act, 1988 (as amended 2019)",
        reference: "Section 130 & 206",
        description: "Rules for document inspection, DigiLocker validity, and impounding procedure.",
      },
      {
        name: "Ministry of Road Transport & Highways Notification",
        reference: "MoRTH Notification RT-11036/64/2017-MVL",
        description: "Mandates acceptance of digital RC and DL on DigiLocker and mParivahan.",
      },
    ],
    immediateActions: [
      "Remain calm, stay inside the vehicle, and produce documents on DigiLocker/mParivahan.",
      "Note the officer's name and belt badge number.",
      "Insist on an official e-challan; never pay spot fines without an official government receipt.",
    ],
    dontDo: [
      "Do not pay cash fines without an instant printed e-challan receipt.",
      "Do not get into verbal abuse or physical obstruction with on-duty officers.",
    ],
    documents: ["Driving Licence (DigiLocker / physical)", "Registration Certificate (RC)", "Valid PUC certificate & Motor Insurance"],
    authorities: [
      { name: "Traffic Police Commissionerate", description: "Supervises traffic enforcement." },
      { name: "Virtual Court (parivahan.gov.in)", description: "Online portal to contest or pay e-challans." },
    ],
    emergency: [{ label: "Traffic Police Helpline", number: "1095" }, { label: "Emergency", number: "112" }],
    learningPath: { title: "Traffic Rules & Road Law", lessons: 4, duration: "25 min", journeySlug: "traffic-rules" },
    quiz: { title: "Traffic Law Quiz", questions: 5, minutes: 5 },
    relatedActs: ["motor-vehicles-act-1988"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "traffic-challan-dispute",
    title: "Received a wrongful e-challan with incorrect photo or speed reading",
    category: "traffic",
    subcategory: "Challan dispute",
    icon: TrafficCone,
    tagline: "Camera error, cloned vehicle plates, or mismatched location challan.",
    summary:
      "You received an SMS challan for jumping a signal or speeding, but the photo shows another vehicle, wrong plate numbers, or you were not at that location.",
    rights: [
      "Right to dispute automated camera e-challans in Virtual Court (vcourts.gov.in) before payment.",
      "Right to examine camera calibration certificate and photographic evidence.",
    ],
    laws: [
      {
        name: "Motor Vehicles Act, 1988",
        reference: "Section 136A",
        description: "Electronic monitoring and enforcement standards.",
      },
    ],
    immediateActions: [
      "Visit echallan.parivahan.gov.in and enter challan number to download photo evidence.",
      "Submit an online grievance on the state traffic police portal.",
      "Select 'Contest Challan' on Virtual Court portal to send the case to regular Lok Adalat.",
    ],
    dontDo: ["Do not pay the fine online if you plan to dispute identity or vehicle cloning."],
    documents: ["Challan copy", "Proof of your vehicle's location at the time (GPS log, toll receipt)"],
    authorities: [{ name: "Virtual Court / Lok Adalat", description: "Adjudicates contested e-challans." }],
    emergency: [{ label: "Traffic Helpline", number: "1095" }],
    learningPath: { title: "Traffic Rules & Road Law", lessons: 4, duration: "25 min", journeySlug: "traffic-rules" },
    quiz: { title: "Traffic Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "road-accident-rights",
    title: "Involved in a road accident — rights and medical care procedure",
    category: "traffic",
    subcategory: "Road accident",
    icon: CarFront,
    tagline: "Emergency medical treatment, Good Samaritan laws, and insurance claims.",
    summary:
      "A collision occurred involving your car or two-wheeler. There are injured persons needing immediate hospital attention.",
    rights: [
      "Hospitals (both government and private) MUST provide emergency first-aid without demanding advance cash.",
      "Good Samaritans helping accident victims are protected from police harassment (Sec 134A MVA).",
      "Right to claim compensation under Motor Accident Claims Tribunal (MACT).",
    ],
    laws: [
      {
        name: "Motor Vehicles Act, 1988 (as amended 2019)",
        reference: "Section 134A & 166",
        description: "Good Samaritan protection and MACT claim procedure.",
      },
    ],
    immediateActions: [
      "Call Ambulance (108) and Police (112) immediately.",
      "Do not flee: stop, assist injured persons, and inform police within 24 hours.",
      "Take photos of vehicle positions, skid marks, and number plates.",
    ],
    dontDo: ["Do not flee the spot (Hit-and-Run carries severe criminal penalties under new laws)."],
    documents: ["Vehicle insurance policy", "Driving licence", "Hospital medical records"],
    authorities: [{ name: "Motor Accident Claims Tribunal (MACT)", description: "Awards accident compensation." }],
    emergency: [
      { label: "Ambulance", number: "108" },
      { label: "Police Emergency", number: "112" },
    ],
    learningPath: { title: "Traffic Rules & Road Law", lessons: 4, duration: "25 min", journeySlug: "traffic-rules" },
    quiz: { title: "Traffic Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "vehicle-documents-check",
    title: "Police demanding physical RC and driving licence instead of DigiLocker",
    category: "traffic",
    subcategory: "Vehicle documents",
    icon: TrafficCone,
    tagline: "Refusal to accept digital documents on official government apps.",
    summary:
      "Traffic police officer insists that digital driving licence on DigiLocker is invalid and demands ₹2,000 spot fine for 'not carrying physical documents'.",
    rights: [
      "DigiLocker and mParivahan are statutory equals to physical papers under Rule 139 of CMVR.",
      "Officers who refuse to accept official digital documents violate Central Government notifications.",
    ],
    laws: [
      {
        name: "Central Motor Vehicles Rules, 1989",
        reference: "Rule 139 (Amended)",
        description: "Production of digital documents in electronic form through DigiLocker.",
      },
    ],
    immediateActions: [
      "Show the verified QR code inside the DigiLocker / mParivahan app.",
      "Reference MoRTH Notification No. RT-11036/64/2017-MVL to the officer.",
    ],
    dontDo: ["Do not show simple WhatsApp photo gallery images (only DigiLocker/mParivahan apps are recognized)."],
    documents: ["DigiLocker App installed on phone", "Active mParivahan account"],
    authorities: [{ name: "Superintendent of Traffic Police", description: "Hears complaints against non-compliance." }],
    emergency: [{ label: "Traffic Helpline", number: "1095" }],
    learningPath: { title: "Traffic Rules & Road Law", lessons: 4, duration: "25 min", journeySlug: "traffic-rules" },
    quiz: { title: "Traffic Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "hit-and-run-awareness",
    title: "Hit-and-run compensation scheme for victims and families",
    category: "traffic",
    subcategory: "Hit-and-run awareness",
    icon: CarFront,
    tagline: "Government compensation when the offending vehicle cannot be traced.",
    summary:
      "A pedestrian or driver was struck by an unknown vehicle that fled the scene without being identified.",
    rights: [
      "Compensation to Victims of Hit and Run Motor Accidents Scheme, 2022.",
      "Mandatory statutory compensation of ₹2,00,000 for death and ₹50,000 for grievous hurt.",
    ],
    laws: [
      {
        name: "Motor Vehicles Act, 1988",
        reference: "Section 161",
        description: "Special provisions for hit and run accident compensation fund.",
      },
    ],
    immediateActions: [
      "File an immediate FIR at local police station noting hit-and-run facts.",
      "Submit compensation claim to the Sub-Divisional Magistrate / Claims Enquiry Officer.",
    ],
    dontDo: ["Do not delay FIR registration beyond 24 hours."],
    documents: ["FIR copy", "Hospital post-mortem or medical discharge summary", "Identity proof of claimants"],
    authorities: [{ name: "Sub-Divisional Magistrate (Claims Settlement Commissioner)", description: "Releases compensation." }],
    emergency: [{ label: "Ambulance", number: "108" }],
    learningPath: { title: "Traffic Rules & Road Law", lessons: 4, duration: "25 min", journeySlug: "traffic-rules" },
    quiz: { title: "Traffic Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "third-party-insurance-claim",
    title: "Claiming damages from the other driver's third-party insurance",
    category: "traffic",
    subcategory: "Insurance awareness",
    icon: CarFront,
    tagline: "Vehicle damaged due to another driver's rash and negligent driving.",
    summary:
      "Your car or bike was severely damaged when a truck or rash driver rammed into you from behind.",
    rights: [
      "Every vehicle in India must have mandatory Third-Party Insurance.",
      "Right to recover full property damage and medical expenses from the offending vehicle's insurer.",
    ],
    laws: [
      {
        name: "Motor Vehicles Act, 1988",
        reference: "Chapter XI (Insurance of Motor Vehicles)",
        description: "Third-party liability provisions.",
      },
    ],
    immediateActions: [
      "Note the offending vehicle's registration number and insurance company details.",
      "File an FIR / Detailed Accident Report (DAR) with traffic police.",
      "Notify your own insurance company within 48 hours.",
    ],
    dontDo: ["Do not repair the vehicle before insurance surveyor inspection."],
    documents: ["FIR copy", "Offending vehicle RC & Insurance details", "Repair estimate bills"],
    authorities: [{ name: "Motor Accident Claims Tribunal (MACT)", description: "Adjudicates third-party claims." }],
    emergency: [{ label: "Emergency", number: "112" }],
    learningPath: { title: "Traffic Rules & Road Law", lessons: 4, duration: "25 min", journeySlug: "traffic-rules" },
    quiz: { title: "Traffic Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 7. EMPLOYMENT & LABOUR
  // ==========================================
  {
    slug: "employer-not-paying-salary",
    title: "My employer hasn't paid my salary for months",
    category: "workers",
    subcategory: "Salary not paid",
    icon: HardHat,
    tagline: "Unpaid wages, delayed salaries, or illegal bonus deductions.",
    summary:
      "You worked for an enterprise, startup, or contractor, but the employer has delayed or stopped paying your salary for two or more months with evasive excuses.",
    rights: [
      "Right to receive full salary by the 7th or 10th of every month under the Payment of Wages Act.",
      "Recovery through the Labour Commissioner with up to 10x compensation penalty on employer.",
      "Employer cannot arbitrarily withhold wages as punishment without formal inquiry.",
    ],
    laws: [
      {
        name: "Payment of Wages Act, 1936",
        reference: "Section 5 & 15",
        description: "Sets mandatory wage payment timelines and claims before the Payment Authority.",
      },
      {
        name: "Industrial Disputes Act, 1947",
        reference: "Section 33C(2)",
        description: "Recovery of money due from an employer via Labour Court certificate.",
      },
    ],
    immediateActions: [
      "Send a written demand notice via work and personal email detailing unpaid months.",
      "Preserve attendance records, punch-in logs, and approved timesheets.",
      "File a complaint with the District Labour Commissioner (samadhan.labour.gov.in).",
    ],
    dontDo: [
      "Do not stop attending work abruptly without serving written record of non-payment.",
      "Do not delete company email threads, offer letters, or payslips.",
    ],
    documents: ["Appointment letter / employment contract", "Bank statements showing salary history", "Timesheets / Attendance records"],
    authorities: [
      { name: "Labour Commissioner / Labour Court", description: "Enforces wage recovery." },
      { name: "National Company Law Tribunal (NCLT)", description: "If company is defaulting under insolvency." },
    ],
    emergency: [{ label: "Shram Suvidha Portal", number: "1800-425-4200" }],
    learningPath: { title: "Employment & Labour Rights", lessons: 4, duration: "25 min", journeySlug: "employment-rights" },
    quiz: { title: "Labour Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "illegal-termination-concern",
    title: "Terminated suddenly without notice pay or severance",
    category: "workers",
    subcategory: "Termination concern",
    icon: HardHat,
    tagline: "Sudden termination, forced resignations, and denied severance.",
    summary:
      "Your company fired you on the spot without notice period, denied severance pay, or forced you to write a 'voluntary resignation' under duress.",
    rights: [
      "Right to written notice or salary in lieu of notice period as stated in appointment contract.",
      "Forced resignation under duress has the legal status of illegal retrenchment.",
      "Payment of gratuity if served for 5 years or more under Gratuity Act.",
    ],
    laws: [
      {
        name: "Industrial Disputes Act, 1947",
        reference: "Section 25F",
        description: "Conditions precedent to retrenchment of workmen.",
      },
    ],
    immediateActions: [
      "Never sign a pre-written 'voluntary resignation' letter under pressure.",
      "Reply in writing refusing resignation and stating you were terminated without due process.",
      "File an industrial dispute before the Conciliation Officer (Labour Commissioner).",
    ],
    dontDo: ["Do not sign full and final settlement (FnF) until all disputed dues are clarified."],
    documents: ["Offer letter stating notice period", "Termination email", "Last 3 months payslips"],
    authorities: [{ name: "Labour Court / Conciliation Officer", description: "Adjudicates wrongful termination." }],
    emergency: [{ label: "Labour Helpline", number: "1800-425-4200" }],
    learningPath: { title: "Employment & Labour Rights", lessons: 4, duration: "25 min", journeySlug: "employment-rights" },
    quiz: { title: "Labour Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "workplace-contract-dispute",
    title: "Company enforcing illegal non-compete bond or training penalty",
    category: "workers",
    subcategory: "Contract dispute",
    icon: HardHat,
    tagline: "Contracts barring employees from joining competitors or demanding bond money.",
    summary:
      "You resigned to join another firm, but your former company threatens legal action citing a '2-year non-compete clause' or demands ₹2 Lakhs for 'employment training bond'.",
    rights: [
      "Section 27 of the Indian Contract Act: Any agreement restraining a person from exercising a lawful profession or trade is VOID.",
      "Indian courts do NOT enforce post-employment non-compete clauses.",
      "Training bonds are enforceable only to the extent of actual evidenced expenses incurred.",
    ],
    laws: [
      {
        name: "Indian Contract Act, 1872",
        reference: "Section 27",
        description: "Agreements in restraint of trade are void as against public policy.",
      },
    ],
    immediateActions: [
      "Submit your resignation strictly following the contractual notice period.",
      "Seek advice on replying to legal notices citing Section 27 Contract Act precedents.",
    ],
    dontDo: ["Do not pay exorbitant bond penalty amounts without proof of actual training expenses."],
    documents: ["Employment contract", "Resignation email and acceptance copy", "Training records"],
    authorities: [{ name: "High Court / Civil Court", description: "Strikes down post-employment non-competes." }],
    emergency: [{ label: "Citizen Emergency", number: "112" }],
    learningPath: { title: "Employment & Labour Rights", lessons: 4, duration: "25 min", journeySlug: "employment-rights" },
    quiz: { title: "Labour Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "unpaid-internship-stipend",
    title: "Worked full 3-month internship but company ghosted on stipend",
    category: "workers",
    subcategory: "Internship stipend",
    icon: HardHat,
    tagline: "Companies using students for full-time work under unpaid 'intern' labels.",
    summary:
      "You completed a full-time internship with written commitment of a monthly stipend, but upon completion, the founders stopped answering calls and withheld your certificate.",
    rights: [
      "Written internship contracts are legally binding contracts.",
      "Protection from deceptive hiring practices under Consumer Protection and Contract law.",
    ],
    laws: [
      {
        name: "Indian Contract Act, 1872",
        reference: "Section 73",
        description: "Compensation for loss or damage caused by breach of contract.",
      },
    ],
    immediateActions: [
      "Send a formal written demand notice over email and LinkedIn to the executive founders.",
      "Notify your college training & placement cell to blacklist the firm.",
      "File a small causes money recovery suit or summary consumer complaint.",
    ],
    dontDo: ["Do not delete emails detailing tasks assigned and work delivered."],
    documents: ["Internship offer letter with stipend clause", "Submitted deliverables and code commits", "WhatsApp/Slack work assignment proofs"],
    authorities: [{ name: "Labour Commissioner & Consumer Forum", description: "Enforces recovery of promised compensation." }],
    emergency: [{ label: "Student Legal Helpline", number: "1800-111-654" }],
    learningPath: { title: "Employment & Labour Rights", lessons: 4, duration: "25 min", journeySlug: "employment-rights" },
    quiz: { title: "Labour Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "workplace-gender-discrimination",
    title: "Denied promotion or fired due to pregnancy or maternity leave",
    category: "workers",
    subcategory: "Workplace discrimination",
    icon: HardHat,
    tagline: "Discrimination against pregnant employees or denial of maternity benefits.",
    summary:
      "An employee informed HR of pregnancy, and the company suddenly gave poor ratings, reduced duties, or terminated her employment to avoid paying maternity benefits.",
    rights: [
      "Maternity Benefit Act, 1961: 26 weeks paid maternity leave is mandatory for firms with 10+ employees.",
      "Strict prohibition: Unlawful to dismiss or discharge a woman during her maternity absence.",
    ],
    laws: [
      {
        name: "Maternity Benefit Act, 1961",
        reference: "Section 12",
        description: "Dismissal during absence of pregnancy is unlawful and punishable with imprisonment.",
      },
    ],
    immediateActions: [
      "Issue a formal written notice citing Section 12 of the Maternity Benefit Act.",
      "File a complaint with the Chief Inspector of Factories / Labour Commissioner.",
    ],
    dontDo: ["Do not sign resignation letters during or immediately preceding maternity leave."],
    documents: ["Medical pregnancy certificate", "Maternity leave intimation email", "Termination notice"],
    authorities: [{ name: "Labour Commissioner / Maternity Inspector", description: "Enforces statutory maternity payments." }],
    emergency: [{ label: "NCW Helpline", number: "7827170170" }],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Women's Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "workplace-discrimination",
    title: "Facing caste, religious, or disability discrimination at workplace",
    category: "workers",
    subcategory: "Workplace harassment",
    icon: HardHat,
    tagline: "Systematic exclusion, derogatory slurs, or harassment at work.",
    summary:
      "You are subjected to offensive remarks regarding your social background, caste, or physical disability by team members or senior management.",
    rights: [
      "Equal Opportunity Policy: Rights of Persons with Disabilities Act, 2016.",
      "Strict penal protection against caste slurs under the SC/ST (Prevention of Atrocities) Act.",
    ],
    laws: [
      {
        name: "SC/ST (Prevention of Atrocities) Act, 1989",
        reference: "Section 3(1)(r)",
        description: "Humiliating members of SC/ST in any place within public view.",
      },
    ],
    immediateActions: [
      "Submit internal grievance to HR Grievance Committee.",
      "If unaddressed, file complaint before District Magistrate / SC-ST Commission / Police.",
    ],
    dontDo: ["Do not suffer derogatory slurs without documenting exact words and witnesses."],
    documents: ["Internal grievance copy", "Screenshots/recordings of discriminatory communications"],
    authorities: [{ name: "National Commission for Scheduled Castes / Disability Commissioner", description: "Monitors equal opportunity." }],
    emergency: [{ label: "Police Emergency", number: "112" }],
    learningPath: { title: "Employment & Labour Rights", lessons: 4, duration: "25 min", journeySlug: "employment-rights" },
    quiz: { title: "Labour Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 8. CITIZEN & GOVERNMENT
  // ==========================================
  {
    slug: "police-complaint-fir",
    title: "Police refusing to file my FIR for a cognizable crime",
    category: "citizen",
    subcategory: "Police complaint/FIR awareness",
    icon: Landmark,
    tagline: "Police station turning away victims or refusing to register formal FIR.",
    summary:
      "You visited the local police station to report a robbery, cyber fraud, or assault, but the duty officer refuses to write an FIR and tells you to settle informally.",
    rights: [
      "Supreme Court Lalita Kumari mandate: Police MUST register FIR if complaint discloses a cognizable offence.",
      "Right to receive a free certified copy of the registered FIR immediately.",
      "Right to send complaint by registered post to Superintendent of Police (SP) under Section 154(3) CrPC / Section 173(4) BNSS.",
      "Right to approach the Judicial Magistrate under Section 156(3) CrPC / Section 175(3) BNSS.",
    ],
    laws: [
      {
        name: "Bharatiya Nagarik Suraksha Sanhita, 2023 / CrPC",
        reference: "Section 173 BNSS / Section 154 CrPC",
        description: "Mandatory FIR registration for cognizable crimes.",
      },
      {
        name: "Supreme Court Landmark Directive (Lalita Kumari)",
        reference: "(2014) 2 SCC 1",
        description: "Directs disciplinary action against police officers who refuse FIR registration.",
      },
    ],
    immediateActions: [
      "Remind the officer politely of the Supreme Court's Lalita Kumari ruling.",
      "Send a copy of your complaint by registered speed post / email to the Superintendent of Police (SP/DCP).",
      "If SP fails to act, engage an advocate to file an application before the Judicial Magistrate.",
    ],
    dontDo: ["Do not leave the police station without getting your complaint copy stamped with diary number."],
    documents: ["Written complaint signed with date", "Postal proof of sending to SP", "Medical/Damage proof"],
    authorities: [
      { name: "Superintendent of Police (SP / DCP)", description: "Supervisory authority." },
      { name: "Judicial Magistrate", description: "Directs police to register FIR and investigate." },
    ],
    emergency: [{ label: "Police Control Room", number: "112" }],
    learningPath: { title: "Police & FIR Procedure", lessons: 4, duration: "25 min", journeySlug: "police-fir-process" },
    quiz: { title: "Police & FIR Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty", "article-22-protection-against-arrest-and-detention"],
    relatedCaseStudies: ["dk-basu-v-state-of-wb-1997"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "rti-awareness-delay",
    title: "Government department ignored my RTI application beyond 30 days",
    category: "citizen",
    subcategory: "RTI awareness",
    icon: Landmark,
    tagline: "Public Information Officer (PIO) failing to provide requested public records.",
    summary:
      "You submitted a valid RTI application requesting road tender details, exam answer sheets, or pension delays, but 30 days have passed with zero response from the PIO.",
    rights: [
      "Mandatory statutory deadline: PIO must provide information within 30 days (or 48 hours for life/liberty).",
      "Right to file First Appeal within 30 days to the First Appellate Authority (FAA).",
      "Information Commission imposes ₹250/day penalty up to ₹25,000 on defaulting PIOs.",
    ],
    laws: [
      {
        name: "Right to Information Act, 2005",
        reference: "Section 7 & 19",
        description: "Disposal of request, appeals process, and penalties.",
      },
    ],
    immediateActions: [
      "File First Appeal before the designated First Appellate Authority of the department.",
      "If First Appeal is ignored within 45 days, file a Second Appeal with the Information Commission.",
    ],
    dontDo: ["Do not pay additional fees once the initial 30-day window has expired (info must be free)."],
    documents: ["Original RTI application copy", "Postal receipt / rtionline.gov.in acknowledgement", "Bank fee payment proof"],
    authorities: [{ name: "Central / State Information Commission (CIC/SIC)", description: "Autonomous appellate body." }],
    emergency: [{ label: "RTI Helpline", number: "011-26767500" }],
    learningPath: { title: "Constitutional Rights", lessons: 4, duration: "25 min", journeySlug: "constitution-basics" },
    quiz: { title: "RTI & Transparency Quiz", questions: 5, minutes: 5 },
    relatedActs: ["right-to-information-act-2005"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "government-service-grievance",
    title: "Government office delaying passport, driving license, or pension arbitrarily",
    category: "citizen",
    subcategory: "Government service grievance",
    icon: Landmark,
    tagline: "Citizens' Charter violations, bureaucratic delays, and refusal to process files.",
    summary:
      "You applied for a government service with all required documents, but the office has kept your file pending for months without giving reasons, expecting informal facilitation.",
    rights: [
      "Right to Public Services Legislation: Timely delivery of notified public services is a statutory right.",
      "Right to file escalation on Central Public Grievance Portal (CPGRAMS).",
    ],
    laws: [
      {
        name: "State Right to Public Services Acts",
        reference: "Public Service Guarantee Acts",
        description: "Fines defaulting government officers for unexcused service delivery delays.",
      },
    ],
    immediateActions: [
      "Lodge a grievance on CPGRAMS portal (pgportal.gov.in).",
      "File an RTI seeking exact file movement trail and reasons for delay.",
    ],
    dontDo: ["Do not pay touts or middlemen outside government administrative complexes."],
    documents: ["Application acknowledgement number", "Document submission checklist", "Fee receipt"],
    authorities: [{ name: "CPGRAMS / Public Grievance Directorate", description: "Direct PMO / Ministry monitoring." }],
    emergency: [{ label: "CPGRAMS Helpdesk", number: "1800-11-2024" }],
    learningPath: { title: "Constitutional Rights", lessons: 4, duration: "25 min", journeySlug: "constitution-basics" },
    quiz: { title: "Citizen Governance Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "aadhaar-pan-document-correction",
    title: "Authority refusing document name/DoB correction citing circulars",
    category: "citizen",
    subcategory: "Document correction",
    icon: Landmark,
    tagline: "Correcting mismatched names across Aadhaar, PAN, and 10th marksheet.",
    summary:
      "Your official documents have minor spelling mismatches, and government counters repeatedly reject corrections despite gazette notifications or valid affidavits.",
    rights: [
      "Right to legal identity rectification via UIDAI standard document exception rules.",
      "Executive circulars cannot override statutory birth certificates or judicial affidavits.",
    ],
    laws: [
      {
        name: "Aadhaar (Targeted Delivery of Financial Subsidies) Act, 2016",
        reference: "Regulation on Demographic Updates",
        description: "Procedures for updating and correcting demographic entries.",
      },
    ],
    immediateActions: [
      "Get a standard Notarized Identity Affidavit and publish name change in Official State Gazette.",
      "Visit an official regional UIDAI / NSDL center with the Gazette notification.",
    ],
    dontDo: ["Do not use unauthorized third-party photocopy cyber cafes claiming 'shortcut updates'."],
    documents: ["Birth certificate / 10th certificate", "Notarized affidavit", "Gazette notification copy"],
    authorities: [{ name: "UIDAI Regional Office / NSDL", description: "Identity database administration." }],
    emergency: [{ label: "UIDAI Helpline", number: "1947" }],
    learningPath: { title: "Constitutional Rights", lessons: 4, duration: "25 min", journeySlug: "constitution-basics" },
    quiz: { title: "Citizen Governance Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "municipal-drainage-grievance",
    title: "Open sewage overflow or municipal water contamination in residential area",
    category: "citizen",
    subcategory: "Public-service grievance",
    icon: Landmark,
    tagline: "Civic negligence causing severe disease and public health hazards.",
    summary:
      "A municipal drain broke in front of your home, flooding sewage into the street and contaminating tap water, but the ward engineer ignores repeated complaints.",
    rights: [
      "Right to a clean and wholesome environment as part of Article 21 (Subhash Kumar v. State of Bihar).",
      "Municipal corporation has a mandatory statutory duty under Municipal Acts to maintain public sanitation.",
    ],
    laws: [
      {
        name: "State Municipal Corporation Act",
        reference: "Public Health & Sanitation Duties",
        description: "Statutory obligation of municipal commissioners to clear public health hazards.",
      },
    ],
    immediateActions: [
      "File online grievance on municipal 311 app with geolocated photos.",
      "Send joint community petition to the Municipal Commissioner and Ward Councillor.",
      "If unheeded within 7 days, file complaint before the National Green Tribunal (NGT) / Lokayukta.",
    ],
    dontDo: ["Do not tamper with municipal sewer lines privately without municipal permission."],
    documents: ["Photographs with GPS timestamps", "Copy of ward grievance ticket", "Signatures of neighborhood residents"],
    authorities: [{ name: "Municipal Commissioner / Lokayukta", description: "Supervises municipal civic duties." }],
    emergency: [{ label: "Municipal Swachhata Helpline", number: "1969" }],
    learningPath: { title: "Constitutional Rights", lessons: 4, duration: "25 min", journeySlug: "constitution-basics" },
    quiz: { title: "Citizen Governance Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 9. DIGITAL PRIVACY
  // ==========================================
  {
    slug: "data-misuse-privacy",
    title: "Company leaked my personal phone number and financial records",
    category: "privacy",
    subcategory: "Data misuse",
    icon: Shield,
    tagline: "Data breaches, unauthorized marketing, and personal data profiling.",
    summary:
      "An edtech, fintech, or shopping app leaked your full KYC data, phone number, and purchase history, resulting in endless spam calls and targeted loan harassment.",
    rights: [
      "Fundamental Right to Privacy under Article 21 (Puttaswamy landmark judgment).",
      "Digital Personal Data Protection Act, 2023: Right to data erasure and monetary penalties up to ₹250 Cr on fiduciaries.",
      "Right to withdraw marketing consent and receive a summary of processed personal data.",
    ],
    laws: [
      {
        name: "Digital Personal Data Protection Act, 2023",
        reference: "Section 6, 8 & 12",
        description: "Obligations of Data Fiduciaries and rights of Data Principals.",
      },
      {
        name: "Information Technology Act, 2000",
        reference: "Section 43A",
        description: "Compensation for failure to protect sensitive personal data.",
      },
    ],
    immediateActions: [
      "Send a written notice to the company's Data Protection Officer (DPO) demanding data erasure.",
      "File a complaint with the Data Protection Board of India.",
      "Activate DND (Do Not Disturb) via TRAI 1909.",
    ],
    dontDo: ["Do not consent to broad 'share with third party partners' checkboxes when signing up."],
    documents: ["Proof of data breach / screenshot of spam referencing the platform", "Original privacy policy of the service"],
    authorities: [{ name: "Data Protection Board of India / CERT-In", description: "Enforces data privacy penalties." }],
    emergency: [{ label: "TRAI DND Helpline", number: "1909" }],
    learningPath: { title: "Digital Privacy in India", lessons: 4, duration: "25 min", journeySlug: "digital-privacy" },
    quiz: { title: "Digital Privacy Quiz", questions: 5, minutes: 5 },
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    relatedActs: ["digital-personal-data-protection-act-2023"],
    relatedCaseStudies: ["puttaswamy-v-union-of-india-2017"],
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "unauthorized-sharing-data",
    title: "Bank or telecom agent sold my contact details to telemarketers",
    category: "privacy",
    subcategory: "Unauthorized sharing",
    icon: Shield,
    tagline: "Receiving 10 loan calls daily immediately after opening a bank account.",
    summary:
      "You shared your number solely for an official bank account, and within 48 hours, private real estate and loan brokers began calling you by your full name.",
    rights: [
      "Strict prohibition on repurposing personal data without explicit separate consent.",
      "Right to file a complaint against the financial institution with the Banking Ombudsman.",
    ],
    laws: [
      {
        name: "Digital Personal Data Protection Act, 2023",
        reference: "Section 6(1)",
        description: "Purpose limitation: personal data cannot be shared beyond specified purpose.",
      },
    ],
    immediateActions: [
      "File an official complaint with the bank's Principal Nodal Officer.",
      "Lodge a TRAI UCC (Unsolicited Commercial Communication) complaint by sending SMS to 1909.",
    ],
    dontDo: ["Do not accept verbal apologies without a written confirmation of data purging."],
    documents: ["Call logs of telemarketing agents", "Account opening form copy"],
    authorities: [{ name: "Banking Ombudsman & TRAI", description: "Regulates telemarketing and financial privacy." }],
    emergency: [{ label: "TRAI UCC", number: "1909" }],
    learningPath: { title: "Digital Privacy in India", lessons: 4, duration: "25 min", journeySlug: "digital-privacy" },
    quiz: { title: "Digital Privacy Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "account-privacy-concern",
    title: "Mobile application secretly accessing microphone, contacts, and photos",
    category: "privacy",
    subcategory: "Account privacy",
    icon: Shield,
    tagline: "Excessive app permissions tracking users beyond required functionality.",
    summary:
      "A simple flashlight or calculator app insists on accessing your entire contact address book, precise GPS location, and camera before opening.",
    rights: [
      "Principle of Data Minimization under DPDP Act: Apps can only collect data strictly necessary for service.",
      "Right to revoke device permissions at any time without forfeiture of basic service.",
    ],
    laws: [
      {
        name: "Digital Personal Data Protection Act, 2023",
        reference: "Section 6",
        description: "Unbundling of consent: consent cannot be made a condition for unrelated utility.",
      },
    ],
    immediateActions: [
      "Revoke background permissions inside your Android/iOS settings.",
      "Report the app to Google Play Store / Apple App Store for permission violations.",
    ],
    dontDo: ["Never grant 'Always Allow' location and contact permissions to utility apps."],
    documents: ["App permissions screen capture"],
    authorities: [{ name: "Data Protection Board", description: "Enforces data minimization." }],
    emergency: [{ label: "Cyber Helpline", number: "1930" }],
    learningPath: { title: "Digital Privacy in India", lessons: 4, duration: "25 min", journeySlug: "digital-privacy" },
    quiz: { title: "Digital Privacy Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "doxxing-personal-data-leak",
    title: "Someone published my private phone number, address, and Aadhaar online",
    category: "privacy",
    subcategory: "Online impersonation",
    icon: Shield,
    tagline: "Malicious publication of personal contact info to incite targeted harassment.",
    summary:
      "A malicious individual posted your personal contact number, home address, and workplace details on a public social forum, calling upon people to harass you.",
    rights: [
      "Doxxing is an actionable criminal offence under privacy violation and intentional insult laws.",
      "Right to immediate emergency takedown by intermediaries under IT Rules.",
    ],
    laws: [
      {
        name: "Information Technology Act, 2000",
        reference: "Section 72A",
        description: "Punishment for disclosure of information in breach of lawful contract.",
      },
    ],
    immediateActions: [
      "Take screenshots of the doxxing post with timestamps and URLs.",
      "File an immediate emergency complaint on cybercrime.gov.in.",
      "Contact the platform's Resident Grievance Officer for emergency removal.",
    ],
    dontDo: ["Do not delete the evidence of the offending post URL."],
    documents: ["Screenshots of post", "URL of thread", "Evidence of harassment received"],
    authorities: [{ name: "Cyber Police & Platform Grievance Officer", description: "Coordinates rapid link suppression." }],
    emergency: [
      { label: "Cyber Helpline", number: "1930" },
      { label: "Emergency", number: "112" },
    ],
    learningPath: { title: "Digital Privacy in India", lessons: 4, duration: "25 min", journeySlug: "digital-privacy" },
    quiz: { title: "Digital Privacy Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },

  // ==========================================
  // 10. FAMILY & SENIOR CITIZENS
  // ==========================================
  {
    slug: "family-domestic-dispute",
    title: "Matrimonial separation, child custody, and maintenance support",
    category: "family",
    subcategory: "Domestic disputes",
    icon: Users,
    tagline: "Separation rights, mutual divorce procedure, and maintenance claims.",
    summary:
      "You are undergoing a marital breakdown and need to understand your legal rights regarding maintenance, stridhan recovery, and child custody.",
    rights: [
      "Right to maintenance under Section 125 CrPC / Section 144 BNSS regardless of personal law.",
      "Stridhan is the woman's absolute exclusive property; husband and in-laws must return it upon demand.",
      "Welfare of the child is the paramount consideration in custody disputes.",
    ],
    laws: [
      {
        name: "Bharatiya Nagarik Suraksha Sanhita, 2023 / CrPC",
        reference: "Section 144 BNSS / Section 125 CrPC",
        description: "Order for maintenance of wives, children, and parents.",
      },
      {
        name: "Hindu Marriage Act, 1955 / Special Marriage Act, 1954",
        reference: "Section 13B / Section 28",
        description: "Divorce by mutual consent and maintenance.",
      },
    ],
    immediateActions: [
      "Prepare a complete list of Stridhan items, jewelry, and gifts with bills.",
      "Approach the Family Court or District Legal Services Authority (DLSA) for confidential mediation.",
    ],
    dontDo: ["Do not sign blank settlement papers or financial waivers under coercion."],
    documents: ["Marriage certificate / photographs", "Income tax returns / bank statements of both spouses", "Stridhan inventory"],
    authorities: [{ name: "Family Court & Mediation Centre", description: "Facilitates amicable settlements." }],
    emergency: [{ label: "Women Helpline", number: "181" }, { label: "Emergency", number: "112" }],
    learningPath: { title: "Women's Legal Rights & Safety", lessons: 4, duration: "25 min", journeySlug: "womens-rights" },
    quiz: { title: "Family Law Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
  {
    slug: "senior-citizen-neglect",
    title: "Elderly parents facing neglect, abandonment, or property coercion",
    category: "senior",
    subcategory: "Support & safety",
    icon: UserRound,
    tagline: "Right to monthly maintenance and revocation of property gifted to ungrateful children.",
    summary:
      "Elderly parents transferred their ancestral or self-acquired home to their children on condition of care, but the children now abuse, neglect, or starve them.",
    rights: [
      "Maintenance and Welfare of Parents and Senior Citizens Act, 2007: Mandatory monthly maintenance up to ₹10,000.",
      "Section 23: Power to CANCEL property transfer deeds if children fail to provide basic amenities.",
      "Fast-track summary procedure before the Sub-Divisional Magistrate (SDM) Tribunal.",
    ],
    laws: [
      {
        name: "Maintenance and Welfare of Parents and Senior Citizens Act, 2007",
        reference: "Section 4, 5 & 23",
        description: "Maintenance tribunal and voiding of conditional property transfers.",
      },
    ],
    immediateActions: [
      "File an application before the Maintenance Tribunal headed by the Sub-Divisional Magistrate (SDM).",
      "Call the National Senior Citizen Helpline (14567) for counselling and rescue support.",
    ],
    dontDo: ["Do not execute absolute gift deeds without a specific caregiving clause."],
    documents: ["Property gift/transfer deed copy", "Medical bills showing neglect", "Age proof (Aadhaar/Senior Citizen Card)"],
    authorities: [{ name: "Maintenance Tribunal (SDM Office)", description: "Passes eviction and maintenance orders within 90 days." }],
    emergency: [{ label: "National Senior Citizen Helpline (Elderline)", number: "14567" }, { label: "Police", number: "112" }],
    learningPath: { title: "Constitutional Rights", lessons: 4, duration: "25 min", journeySlug: "constitution-basics" },
    quiz: { title: "Senior Citizen Rights Quiz", questions: 5, minutes: 5 },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
  },
];

export function getSituation(slug: string): Situation | undefined {
  return situations.find((s) => s.slug === slug);
}

export function getCategory(
  id: string,
): SituationCategory | undefined {
  return situationCategories.find((c) => c.id === id);
}

export function getSituationsByCategory(
  categoryId: string,
): Situation[] {
  return situations.filter((s) => s.category === categoryId);
}
