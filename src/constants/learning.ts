/**
 * Learning platform content — journeys, lessons, quizzes, and the learner
 * profile.
 *
 * IMPORTANT: All content is concise, illustrative PLACEHOLDER material for UI
 * development only — not legal advice and not verified. A CMS / reviewed-content
 * pipeline (and AI-personalised ordering) replaces it later.
 */
import {
  type LucideIcon,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Crown,
  Flame,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Lock,
  Medal,
  Rocket,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Siren,
  Sparkles,
  Target,
  TrafficCone,
  Trophy,
  Zap,
} from "@/lib/icons";
import type {
  Achievement,
  BadgeItem,
  Bookmark,
  CertificateItem,
  DailyChallenge,
  Difficulty,
  Journey,
  LearnerProfile,
  Lesson,
  QuizQuestion,
} from "@/types";

export const learningDisclaimer =
  "Educational placeholder content for a pre-launch product — not legal advice.";

/** Compact lesson builder to keep the dataset readable. */
function lesson(
  slug: string,
  title: string,
  readingMinutes: number,
  objectives: string[],
  concepts: [string, string][],
  terms: [string, string][],
  examples: [string, string][],
  extra?: Partial<Lesson>,
): Lesson {
  return {
    slug,
    title,
    readingMinutes,
    objectives,
    concepts: concepts.map(([t, body]) => ({ title: t, body })),
    terms: terms.map(([term, definition]) => ({ term, definition })),
    examples: examples.map(([t, body]) => ({ title: t, body })),
    ...extra,
  };
}

export const journeys: Journey[] = [
  {
    slug: "student-rights",
    title: "Student Rights",
    tagline: "Ragging, fees, and campus protections.",
    description:
      "A complete guide to your rights on campus — from fee disputes and anti-ragging protections to disciplinary hearings and transcript access.",
    icon: GraduationCap,
    category: "Campus & Education",
    difficulty: "beginner",
    estimatedMinutes: 45,
    xpReward: 300,
    progress: 40,
    tags: ["continue", "recommended"],
    modules: [
      {
        title: "Foundations",
        summary: "The core protections every student should know.",
        lessons: [
          lesson(
            "know-your-campus-rights",
            "Know your campus rights",
            6,
            [
              "Identify the core rights students hold on campus.",
              "Know where to raise a grievance.",
              "Distinguish legal reality from administrative intimidation.",
            ],
            [
              [
                "You have a right to a safe campus",
                "Institutions must prevent ragging and ensure an environment free from psychological harassment.",
              ],
              [
                "Grievance mechanisms are statutory",
                "Every affiliated institution must maintain a Student Grievance Redressal Committee (SGRC) under UGC regulations.",
              ],
            ],
            [
              [
                "SGRC",
                "Student Grievance Redressal Committee — statutory campus body for student complaints.",
              ],
              [
                "UGC e-Samadhan",
                "The centralized online dispute resolution portal for higher education disputes.",
              ],
            ],
            [
              [
                "Withholding examination admit cards",
                "A college withholding hall tickets over disputed non-academic fee dues violates UGC circulars and can be challenged.",
              ],
            ],
            {
              lessonType: "myth_vs_fact",
              mythVsFacts: [
                {
                  myth: "A college can keep your original 10th and 12th certificates until you finish the 4-year degree.",
                  fact: "UGC guidelines strictly prohibit institutions from retaining original academic certificates.",
                  explanation: "Colleges may only physically inspect original certificates at admission and must immediately return them to the student.",
                },
                {
                  myth: "Colleges can expel a student without any hearing if management decides.",
                  fact: "Principles of Natural Justice (Audi Alteram Partem) mandate a fair inquiry and written explanation before any expulsion.",
                  explanation: "Arbitrary rustication without hearing can be stayed by the High Court under Article 226.",
                },
              ],
              dosAndDonts: {
                dos: [
                  "Always get written receipts with seal for every rupee paid to administration.",
                  "Submit all formal grievances via email to create a permanent timestamped record.",
                  "Quote UGC (Grievance Redressal) Regulations in official communications.",
                ],
                donts: [
                  "Do not surrender original certificates without a written handover receipt.",
                  "Do not pay cash under vague heads like 'development fund' without approval.",
                  "Do not sign pre-typed confession letters under pressure from disciplinary panels.",
                ],
              },
              processSteps: [
                {
                  stepNumber: 1,
                  title: "Submit Written Complaint to SGRC",
                  description: "File a formal letter to the College Student Grievance Redressal Committee.",
                  expectedTimeline: "15 Days",
                  authority: "College SGRC",
                },
                {
                  stepNumber: 2,
                  title: "Escalate to University Ombudsman",
                  description: "If unaddressed within 15 days, appeal to the University Ombudsman.",
                  expectedTimeline: "30 Days",
                  authority: "University Ombudsman",
                },
                {
                  stepNumber: 3,
                  title: "Lodge on UGC e-Samadhan Portal",
                  description: "File an online grievance on samadhan.ugc.ac.in for central regulatory intervention.",
                  expectedTimeline: "Direct Monitoring",
                  authority: "UGC e-Samadhan",
                },
              ],
              interactiveScenario: {
                context: "You applied to withdraw from college 10 days after admission started, before classes began. The college accounts office refuses to refund your ₹80,000 tuition fee, pointing to a sign saying 'Fees once paid will not be refunded'.",
                prompt: "What is your best immediate legal action?",
                options: [
                  {
                    id: "a",
                    label: "Accept the loss since you signed the admission form with that clause.",
                    feedback: "Incorrect. Under UGC norms and Consumer Protection law, unilateral forfeiture clauses are illegal.",
                    isOptimal: false,
                    legalConsequence: "You lose your money unnecessarily.",
                  },
                  {
                    id: "b",
                    label: "Send a written demand quoting the UGC Fee Refund Policy and file a grievance on e-Samadhan & NCH.",
                    feedback: "Correct! UGC mandates a full refund (minus max ₹1,000 processing fee) if withdrawal is made prior to the formal cutoff.",
                    isOptimal: true,
                    legalConsequence: "Statutory backing compels colleges to process the refund or risk affiliation penalty.",
                  },
                  {
                    id: "c",
                    label: "Block the college gate with friends in protest.",
                    feedback: "Incorrect. Unlawful physical agitation can lead to campus disciplinary suspension or criminal nuisance action.",
                    isOptimal: false,
                    legalConsequence: "Risks disciplinary rustication without solving the financial refund.",
                  },
                ],
              },
              flashcards: [
                {
                  front: "What is the fee deduction limit for admission withdrawals under UGC norms?",
                  back: "Maximum ₹1,000 as processing fee if withdrawn within notified schedules.",
                  context: "UGC Fee Refund Policy Notification",
                },
                {
                  front: "Can a college withhold original marksheets for pending dues?",
                  back: "No. Retaining original student credentials is strictly illegal.",
                  context: "UGC Document Retention Circular",
                },
              ],
              source: {
                title: "UGC (Redressal of Grievances of Students) Regulations, 2023",
                publisher: "University Grants Commission, New Delhi",
                url: "https://www.ugc.gov.in",
              },
              verificationStatus: "verified",
              lastVerifiedAt: "2025-01-15",
            },
          ),
          lesson(
            "fees-and-refunds",
            "Fees and refunds",
            5,
            [
              "Understand approved vs. arbitrary fees.",
              "Know your refund rights on withdrawal.",
            ],
            [
              [
                "Only approved fees are payable",
                "Fees must match the structure approved by the regulator.",
              ],
              [
                "Refund timelines apply",
                "Withdrawal refunds follow published norms, not arbitrary rules.",
              ],
            ],
            [
              [
                "Fee structure",
                "The official, approved list of charges for a course.",
              ],
              [
                "Prospectus",
                "The document disclosing course terms and fees at admission.",
              ],
            ],
            [
              [
                "Blocked certificates",
                "A college can't indefinitely hold your documents over a disputed amount.",
              ],
            ],
          ),
        ],
      },
      {
        title: "In Practice",
        summary: "Applying your rights to real situations.",
        lessons: [
          lesson(
            "reporting-ragging",
            "Reporting ragging safely",
            5,
            ["Recognise ragging.", "Report it through the right channel."],
            [
              [
                "Ragging is prohibited",
                "It is a punishable offence, not a harmless tradition.",
              ],
              [
                "Anti-ragging helpline",
                "A national helpline exists for confidential complaints.",
              ],
            ],
            [
              [
                "Anti-ragging committee",
                "The mandatory body that investigates ragging complaints.",
              ],
            ],
            [
              [
                "Peer pressure",
                "Being coerced into 'initiation' tasks is ragging and can be reported.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "traffic-rules",
    title: "Traffic Rules",
    tagline: "Challans, documents, and your rights at a stop.",
    description:
      "Learn the rules of the road, what to carry, and how to handle a traffic stop confidently.",
    icon: TrafficCone,
    category: "Traffic",
    difficulty: "beginner",
    estimatedMinutes: 40,
    xpReward: 280,
    progress: 65,
    tags: ["continue", "trending"],
    modules: [
      {
        title: "On the Road",
        summary: "Documents and everyday rules.",
        lessons: [
          lesson(
            "documents-to-carry",
            "Documents to carry",
            5,
            [
              "List the documents required while driving.",
              "Know digital alternatives.",
            ],
            [
              [
                "Carry the essentials",
                "Licence, RC, insurance, and PUC should be available.",
              ],
              [
                "Digital copies count",
                "Documents in the official app are generally valid.",
              ],
            ],
            [
              ["RC", "Registration Certificate proving vehicle ownership."],
              ["PUC", "Pollution Under Control certificate."],
            ],
            [
              [
                "App check",
                "Showing your licence via the official app can satisfy a document check.",
              ],
            ],
          ),
          lesson(
            "understanding-challans",
            "Understanding challans",
            6,
            ["Understand how challans work.", "Know how to contest one."],
            [
              [
                "Challans are official",
                "A valid challan records the offence and penalty.",
              ],
              [
                "You can contest",
                "Wrong challans can be disputed via the portal or court.",
              ],
            ],
            [["e-Challan", "A digitally issued traffic penalty notice."]],
            [
              [
                "Wrong plate",
                "A challan issued to the wrong vehicle can be contested with evidence.",
              ],
            ],
          ),
        ],
      },
      {
        title: "At a Stop",
        summary: "Your rights during a traffic stop.",
        lessons: [
          lesson(
            "rights-at-a-stop",
            "Your rights at a stop",
            5,
            ["Know your rights when stopped.", "Avoid unofficial payments."],
            [
              [
                "Ask for the reason",
                "You may ask why you were stopped and for the officer's identity.",
              ],
              [
                "Pay only official fines",
                "Insist on an official receipt or e-challan.",
              ],
            ],
            [
              [
                "Lok Adalat",
                "A forum where minor challans can be settled quickly.",
              ],
            ],
            [
              [
                "Cash request",
                "You are not required to pay a cash 'settlement' on the spot.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "cyber-safety",
    title: "Cyber Safety",
    tagline: "Scams, fraud, and reporting online crime.",
    description:
      "Protect yourself online and know exactly what to do if you're scammed.",
    icon: ShieldAlert,
    category: "Cyber",
    difficulty: "beginner",
    estimatedMinutes: 50,
    xpReward: 320,
    progress: 0,
    tags: ["recommended", "trending"],
    modules: [
      {
        title: "Staying Safe",
        summary: "Spotting and avoiding online fraud.",
        lessons: [
          lesson(
            "spotting-scams",
            "Spotting scams",
            6,
            [
              "Recognise common scam patterns.",
              "Protect your OTPs and passwords.",
            ],
            [
              [
                "Never share OTPs",
                "No genuine official will ask for your OTP or password.",
              ],
              [
                "Urgency is a red flag",
                "Scammers create panic to make you act fast.",
              ],
            ],
            [
              ["OTP", "A one-time password used to authorise a transaction."],
              [
                "Phishing",
                "Fake messages that trick you into revealing details.",
              ],
            ],
            [
              [
                "Fake refund",
                "A 'refund' that first asks you to pay a fee is a scam.",
              ],
            ],
          ),
          lesson(
            "reporting-fraud",
            "Reporting fraud fast",
            5,
            ["Know the fastest reporting route.", "Preserve evidence."],
            [
              [
                "Call 1930 quickly",
                "Fast reporting improves the chance of recovery.",
              ],
              [
                "Keep evidence",
                "Save chats, screenshots, and transaction IDs.",
              ],
            ],
            [
              [
                "Cyber Crime Portal",
                "cybercrime.gov.in, for filing online-fraud complaints.",
              ],
            ],
            [
              [
                "Frozen funds",
                "Reporting within the golden hour can help freeze a fraudulent transfer.",
              ],
            ],
          ),
        ],
      },
      {
        title: "Digital Hygiene",
        summary: "Habits that keep you protected.",
        lessons: [
          lesson(
            "account-security",
            "Account security basics",
            5,
            [
              "Adopt strong-password habits.",
              "Enable two-factor authentication.",
            ],
            [
              [
                "Use unique passwords",
                "Reusing passwords lets one breach unlock many accounts.",
              ],
              ["Turn on 2FA", "A second factor blocks most account takeovers."],
            ],
            [["2FA", "Two-factor authentication — a second login check."]],
            [
              [
                "Reused password",
                "One leaked site password can expose your email and bank logins.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "consumer-protection",
    title: "Consumer Protection",
    tagline: "Refunds, warranties, and complaints.",
    description:
      "Know your rights as a buyer and how to get a fair resolution.",
    icon: ShoppingBag,
    category: "Consumers",
    difficulty: "beginner",
    estimatedMinutes: 42,
    xpReward: 300,
    progress: 0,
    tags: ["recommended", "profile"],
    modules: [
      {
        title: "Your Rights",
        summary: "The protections every buyer has.",
        lessons: [
          lesson(
            "consumer-rights-basics",
            "Consumer rights basics",
            6,
            [
              "Identify your core consumer rights.",
              "Recognise unfair trade practices.",
            ],
            [
              [
                "Right to redress",
                "You can seek a refund, replacement, or repair.",
              ],
              [
                "Protection from unfair practices",
                "Misleading claims are prohibited.",
              ],
            ],
            [
              ["Deficiency", "A shortfall in the quality of a service."],
              [
                "Unfair trade practice",
                "A deceptive method used to promote a sale.",
              ],
            ],
            [
              [
                "False discount",
                "An inflated 'original' price to fake a discount is unfair.",
              ],
            ],
          ),
          lesson(
            "filing-a-complaint",
            "Filing a complaint",
            5,
            ["Know where to complain.", "Understand the escalation ladder."],
            [
              ["Start with the seller", "A written request creates a record."],
              [
                "Escalate to the commission",
                "The District Commission adjudicates disputes.",
              ],
            ],
            [
              [
                "National Consumer Helpline",
                "1915, for logging consumer grievances.",
              ],
            ],
            [
              [
                "Denied warranty",
                "A refused valid warranty claim can go to the consumer commission.",
              ],
            ],
          ),
        ],
      },
      {
        title: "In Practice",
        summary: "Handling real disputes.",
        lessons: [
          lesson(
            "online-shopping-rights",
            "Online shopping rights",
            5,
            ["Understand return and refund rules.", "Keep the right proof."],
            [
              [
                "Returns have rules",
                "Platforms must honour stated return policies.",
              ],
              [
                "Keep your invoice",
                "Proof of purchase is essential for any claim.",
              ],
            ],
            [["Invoice", "The official record of a purchase and its terms."]],
            [
              [
                "Wrong item",
                "A different item delivered entitles you to a return or refund.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "womens-rights",
    title: "Women's Rights",
    tagline: "Safety, harassment, and workplace protection.",
    description:
      "Understand key protections and how to act when they're violated.",
    icon: HeartHandshake,
    category: "Women",
    difficulty: "intermediate",
    estimatedMinutes: 55,
    xpReward: 360,
    progress: 0,
    tags: ["recommended"],
    modules: [
      {
        title: "Core Protections",
        summary: "Rights everyone should know.",
        lessons: [
          lesson(
            "workplace-protection",
            "Workplace protection",
            6,
            ["Understand the PoSH framework.", "Know the complaint process."],
            [
              [
                "Every workplace needs an ICC",
                "An Internal Committee must handle harassment complaints.",
              ],
              [
                "Time-bound process",
                "Complaints follow a defined, confidential timeline.",
              ],
            ],
            [["ICC", "Internal Committee under the PoSH Act."]],
            [
              [
                "Hostile remarks",
                "Repeated unwelcome comments at work can be raised with the ICC.",
              ],
            ],
          ),
          lesson(
            "safety-and-reporting",
            "Safety and reporting",
            5,
            ["Know emergency options.", "Understand confidentiality."],
            [
              ["Helplines exist", "1091 is a dedicated women's helpline."],
              [
                "You can request privacy",
                "Complaint processes protect confidentiality.",
              ],
            ],
            [
              [
                "Zero FIR",
                "An FIR that any police station must register regardless of jurisdiction.",
              ],
            ],
            [
              [
                "Unsafe commute",
                "A safety incident can be reported via 112 or 1091.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "employment-rights",
    title: "Employment Rights",
    tagline: "Wages, contracts, and fair treatment.",
    description: "Know your rights as an employee and how to enforce them.",
    icon: Briefcase,
    category: "Workers",
    difficulty: "intermediate",
    estimatedMinutes: 48,
    xpReward: 340,
    progress: 0,
    tags: ["profile"],
    modules: [
      {
        title: "Your Rights",
        summary: "The basics of fair employment.",
        lessons: [
          lesson(
            "wages-and-payment",
            "Wages and payment",
            6,
            [
              "Understand timely-payment rules.",
              "Know about lawful deductions.",
            ],
            [
              [
                "Wages must be timely",
                "Payment within the statutory period is your right.",
              ],
              [
                "Deductions are limited",
                "Only lawful, disclosed deductions are allowed.",
              ],
            ],
            [
              [
                "Full and final settlement",
                "The final dues cleared when you leave a job.",
              ],
            ],
            [
              [
                "Withheld salary",
                "Unpaid earned wages can be raised with the Labour Commissioner.",
              ],
            ],
          ),
          lesson(
            "contracts-and-notice",
            "Contracts and notice",
            5,
            ["Read key contract terms.", "Understand notice periods."],
            [
              [
                "Contracts bind both sides",
                "Terms should be clear and mutually honoured.",
              ],
              [
                "Notice cuts both ways",
                "Notice-period rules apply to employer and employee.",
              ],
            ],
            [
              [
                "Appointment letter",
                "The document setting out your employment terms.",
              ],
            ],
            [
              [
                "Sudden termination",
                "Termination without due process can be challenged.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "tenant-rights",
    title: "Tenant Rights",
    tagline: "Deposits, evictions, and agreements.",
    description: "Rent with confidence — deposits, notice, and dispute basics.",
    icon: Building2,
    category: "Tenants",
    difficulty: "beginner",
    estimatedMinutes: 38,
    xpReward: 260,
    progress: 0,
    tags: ["profile"],
    modules: [
      {
        title: "Renting Basics",
        summary: "What to agree and record.",
        lessons: [
          lesson(
            "rent-agreements",
            "Rent agreements",
            5,
            [
              "Know what a good agreement includes.",
              "Understand deposit norms.",
            ],
            [
              [
                "Put it in writing",
                "A clear agreement prevents most disputes.",
              ],
              [
                "Deposits have limits",
                "The Model Tenancy Act caps deposits where adopted.",
              ],
            ],
            [
              [
                "Model Tenancy Act",
                "A 2021 framework modernising landlord–tenant rules.",
              ],
            ],
            [["Verbal terms", "Only written terms are reliably enforceable."]],
          ),
          lesson(
            "deposit-disputes",
            "Deposit disputes",
            5,
            ["Know your refund rights.", "Learn how to escalate."],
            [
              [
                "Refunds are time-bound",
                "Deposits should be returned per the agreement.",
              ],
              [
                "Deductions need proof",
                "Landlords must justify any deductions.",
              ],
            ],
            [
              [
                "Rent Authority",
                "The body that resolves tenancy disputes under the MTA.",
              ],
            ],
            [
              [
                "Unjustified deduction",
                "Vague 'wear and tear' claims can be disputed.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "constitution-basics",
    title: "Constitution Basics",
    tagline: "Fundamental rights and duties.",
    description:
      "The foundations every citizen should know — rights, duties, and remedies.",
    icon: Landmark,
    category: "Constitution",
    difficulty: "intermediate",
    estimatedMinutes: 60,
    xpReward: 400,
    progress: 0,
    tags: ["recent"],
    modules: [
      {
        title: "Rights & Duties",
        summary: "The core constitutional guarantees.",
        lessons: [
          lesson(
            "fundamental-rights",
            "Fundamental rights",
            7,
            ["Name the key fundamental rights.", "Understand why they matter."],
            [
              [
                "Rights are enforceable",
                "You can approach courts to protect them.",
              ],
              ["Equality before law", "The State must treat citizens equally."],
            ],
            [
              ["Article 14", "Guarantees equality before the law."],
              ["Writ", "A court order used to enforce rights."],
            ],
            [
              [
                "Denied service",
                "Discrimination by a public body can violate equality rights.",
              ],
            ],
          ),
          lesson(
            "fundamental-duties",
            "Fundamental duties",
            5,
            [
              "Recognise citizens' duties.",
              "See how rights and duties balance.",
            ],
            [
              [
                "Duties guide conduct",
                "They express what citizens owe the nation.",
              ],
              [
                "Rights come with responsibility",
                "Civic duties complement fundamental rights.",
              ],
            ],
            [
              [
                "Preamble",
                "The introductory statement of the Constitution's ideals.",
              ],
            ],
            [
              [
                "Public property",
                "Protecting public property is a fundamental duty.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "digital-privacy",
    title: "Digital Privacy",
    tagline: "Your data and how it's protected.",
    description: "Understand data rights and how to control your information.",
    icon: Lock,
    category: "Digital Privacy",
    difficulty: "intermediate",
    estimatedMinutes: 46,
    xpReward: 330,
    progress: 0,
    tags: ["recent"],
    modules: [
      {
        title: "Data Rights",
        summary: "What you control about your data.",
        lessons: [
          lesson(
            "your-data-rights",
            "Your data rights",
            6,
            ["Understand consent.", "Know your rights over your data."],
            [
              [
                "Consent matters",
                "Your data should be used with informed consent.",
              ],
              [
                "You can seek correction",
                "You may ask to correct or erase certain data.",
              ],
            ],
            [
              [
                "Data principal",
                "The individual whose personal data is processed.",
              ],
            ],
            [
              [
                "Unwanted tracking",
                "Apps should not collect data beyond what they disclose.",
              ],
            ],
          ),
          lesson(
            "protecting-your-privacy",
            "Protecting your privacy",
            5,
            ["Adopt privacy-first habits.", "Review app permissions."],
            [
              [
                "Limit permissions",
                "Grant only the access an app truly needs.",
              ],
              ["Review regularly", "Audit permissions and connected accounts."],
            ],
            [
              [
                "Permission",
                "Access an app requests, e.g. camera or location.",
              ],
            ],
            [
              [
                "Over-permissioned app",
                "A torch app requesting contacts is a red flag.",
              ],
            ],
          ),
        ],
      },
    ],
  },
  {
    slug: "police-fir-process",
    title: "Police & FIR Process",
    tagline: "Filing an FIR and knowing your rights.",
    description:
      "Understand how to file an FIR and what to expect from the process.",
    icon: Siren,
    category: "Cyber",
    difficulty: "advanced",
    estimatedMinutes: 52,
    xpReward: 380,
    progress: 0,
    tags: ["trending", "recent"],
    modules: [
      {
        title: "The Process",
        summary: "How complaints become FIRs.",
        lessons: [
          lesson(
            "what-is-an-fir",
            "What is an FIR?",
            6,
            ["Define an FIR.", "Know when it must be registered."],
            [
              [
                "An FIR starts the process",
                "It's the first record of a cognizable offence.",
              ],
              [
                "Registration is a right",
                "Police must register FIRs for cognizable offences.",
              ],
            ],
            [
              ["FIR", "First Information Report of a cognizable offence."],
              [
                "Cognizable offence",
                "A serious offence where police can act without prior approval.",
              ],
            ],
            [
              [
                "Refused FIR",
                "If refused, you can approach a senior officer or magistrate.",
              ],
            ],
          ),
          lesson(
            "your-rights-with-police",
            "Your rights with police",
            5,
            [
              "Know your rights during questioning.",
              "Understand arrest safeguards.",
            ],
            [
              [
                "You have safeguards",
                "Arrest procedures include clear rights.",
              ],
              [
                "Right to inform",
                "You can inform a relative or friend on arrest.",
              ],
            ],
            [
              [
                "Zero FIR",
                "An FIR registrable at any station regardless of jurisdiction.",
              ],
            ],
            [
              [
                "Late-night call",
                "You cannot be compelled to attend at unreasonable hours in most cases.",
              ],
            ],
          ),
        ],
      },
    ],
  },
];

/** Quiz questions keyed by journey slug. */
export const quizzes: Record<string, QuizQuestion[]> = {
  "student-rights": [
    {
      question: "Who can you approach first about an unfair fee demand?",
      options: [
        "No one",
        "The grievance cell",
        "A random professor",
        "The police",
      ],
      correctIndex: 1,
      explanation:
        "Institutions have a grievance cell to receive and resolve student complaints.",
      xp: 20,
    },
    {
      question: "Ragging is best described as:",
      options: [
        "A harmless tradition",
        "A punishable offence",
        "Optional fun",
        "Required initiation",
      ],
      correctIndex: 1,
      explanation:
        "Ragging is a punishable offence and can be reported confidentially.",
      xp: 20,
    },
    {
      question: "Which fees are payable?",
      options: [
        "Any amount asked",
        "Only approved fees",
        "Cash-only fees",
        "Fees with no receipt",
      ],
      correctIndex: 1,
      explanation: "Only fees matching the approved structure are payable.",
      xp: 20,
    },
  ],
  "traffic-rules": [
    {
      question: "Which is a valid way to show your licence at a stop?",
      options: [
        "Verbally",
        "Via the official app",
        "A photo you drew",
        "Not at all",
      ],
      correctIndex: 1,
      explanation:
        "Documents shown via the official government app are generally valid.",
      xp: 20,
    },
    {
      question: "If a challan is wrong, you can:",
      options: ["Do nothing", "Contest it", "Ignore it forever", "Pay double"],
      correctIndex: 1,
      explanation:
        "Incorrect challans can be contested via the portal or traffic court.",
      xp: 20,
    },
    {
      question: "On-the-spot cash 'settlements' are:",
      options: ["Required", "Not required", "Always official", "Mandatory"],
      correctIndex: 1,
      explanation:
        "You should pay only official fines with a receipt or e-challan.",
      xp: 20,
    },
  ],
  "cyber-safety": [
    {
      question: "You should share your OTP with:",
      options: [
        "Bank 'officials' who call",
        "No one",
        "Anyone urgent",
        "Support chats",
      ],
      correctIndex: 1,
      explanation: "No genuine official will ever ask for your OTP.",
      xp: 20,
    },
    {
      question: "The fastest fraud-reporting helpline is:",
      options: ["1930", "100", "1091", "1800"],
      correctIndex: 0,
      explanation: "Call 1930 quickly to improve the chance of recovery.",
      xp: 20,
    },
  ],
  "consumer-protection": [
    {
      question: "For a defective product you can seek:",
      options: [
        "Nothing",
        "Refund, replacement, or repair",
        "Only an apology",
        "A new account",
      ],
      correctIndex: 1,
      explanation:
        "The right to redress covers refund, replacement, or repair.",
      xp: 20,
    },
    {
      question: "The National Consumer Helpline number is:",
      options: ["1915", "1930", "112", "1091"],
      correctIndex: 0,
      explanation: "1915 is the National Consumer Helpline.",
      xp: 20,
    },
  ],
  "womens-rights": [
    {
      question: "Every workplace must have:",
      options: ["A gym", "An Internal Committee (ICC)", "A canteen", "Nothing"],
      correctIndex: 1,
      explanation:
        "The PoSH Act requires an ICC to handle harassment complaints.",
      xp: 20,
    },
  ],
  "employment-rights": [
    {
      question: "Wages should be paid:",
      options: [
        "Whenever",
        "Within the statutory period",
        "Only yearly",
        "Never",
      ],
      correctIndex: 1,
      explanation: "Timely payment within the statutory period is your right.",
      xp: 20,
    },
  ],
  "tenant-rights": [
    {
      question: "A rent agreement should be:",
      options: ["Verbal only", "In writing", "A handshake", "Assumed"],
      correctIndex: 1,
      explanation:
        "Written terms are reliably enforceable and prevent disputes.",
      xp: 20,
    },
  ],
  "constitution-basics": [
    {
      question: "Article 14 guarantees:",
      options: ["Free food", "Equality before the law", "Free travel", "A job"],
      correctIndex: 1,
      explanation: "Article 14 guarantees equality before the law.",
      xp: 20,
    },
  ],
  "digital-privacy": [
    {
      question: "Personal data should be used with:",
      options: [
        "No consent",
        "Informed consent",
        "Secret consent",
        "Assumed consent",
      ],
      correctIndex: 1,
      explanation: "Your data should be processed only with informed consent.",
      xp: 20,
    },
  ],
  "police-fir-process": [
    {
      question: "An FIR is registrable for:",
      options: [
        "Any complaint",
        "A cognizable offence",
        "Only VIPs",
        "Nothing",
      ],
      correctIndex: 1,
      explanation: "Police must register an FIR for a cognizable offence.",
      xp: 20,
    },
  ],
};

export const dailyChallenge: DailyChallenge = {
  title: "Spot the scam",
  description: "A 3-question challenge on recognising online fraud.",
  xp: 50,
  journeySlug: "cyber-safety",
};

export const bookmarks: Bookmark[] = [
  {
    journeySlug: "traffic-rules",
    lessonSlug: "rights-at-a-stop",
    title: "Your rights at a stop",
    journeyTitle: "Traffic Rules",
  },
  {
    journeySlug: "consumer-protection",
    lessonSlug: "filing-a-complaint",
    title: "Filing a complaint",
    journeyTitle: "Consumer Protection",
  },
];

const badges: BadgeItem[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Completed your first lesson.",
    icon: Sparkles,
    earned: true,
  },
  {
    id: "streak-3",
    title: "On a Roll",
    description: "3-day learning streak.",
    icon: Flame,
    earned: true,
  },
  {
    id: "quiz-ace",
    title: "Quiz Ace",
    description: "Scored full marks on a quiz.",
    icon: Brain,
    earned: true,
  },
  {
    id: "journey-1",
    title: "Pathfinder",
    description: "Finished a full journey.",
    icon: Trophy,
    earned: false,
  },
  {
    id: "streak-7",
    title: "Dedicated",
    description: "7-day learning streak.",
    icon: Medal,
    earned: false,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Reached Level 5.",
    icon: Crown,
    earned: false,
  },
];

const achievements: Achievement[] = [
  {
    title: "Lesson Explorer",
    description: "Complete 10 lessons.",
    icon: BookOpen,
    current: 6,
    target: 10,
  },
  {
    title: "Quiz Master",
    description: "Pass 5 quizzes.",
    icon: Target,
    current: 3,
    target: 5,
  },
  {
    title: "Certified",
    description: "Earn 3 certificates.",
    icon: Award,
    current: 1,
    target: 3,
  },
  {
    title: "Consistent",
    description: "Reach a 7-day streak.",
    icon: Flame,
    current: 3,
    target: 7,
  },
];

const certificates: CertificateItem[] = [
  {
    journeySlug: "tenant-rights",
    title: "Tenant Rights",
    earned: true,
    date: "2026-07-28",
  },
  { journeySlug: "student-rights", title: "Student Rights", earned: false },
  { journeySlug: "traffic-rules", title: "Traffic Rules", earned: false },
];

export const learnerProfile: LearnerProfile = {
  name: "Rohit",
  xp: 1240,
  level: 4,
  levelTitle: "Rights Explorer",
  xpIntoLevel: 240,
  xpForLevel: 400,
  streakDays: 3,
  weekly: [
    { day: "M", minutes: 15 },
    { day: "T", minutes: 22 },
    { day: "W", minutes: 0 },
    { day: "T", minutes: 30 },
    { day: "F", minutes: 12 },
    { day: "S", minutes: 40 },
    { day: "S", minutes: 18 },
  ],
  badges,
  achievements,
  certificates,
};

/* ------------------------------ helpers ------------------------------ */

export function getJourney(slug: string): Journey | undefined {
  return journeys.find((j) => j.slug === slug);
}

export function journeyLessons(journey: Journey): Lesson[] {
  return journey.modules.flatMap((m) => m.lessons);
}

export function lessonCount(journey: Journey): number {
  return journeyLessons(journey).length;
}

export function getLesson(
  journeySlug: string,
  lessonSlug: string,
): { journey: Journey; lesson: Lesson } | undefined {
  const journey = getJourney(journeySlug);
  if (!journey) return undefined;
  const lessonItem = journeyLessons(journey).find((l) => l.slug === lessonSlug);
  if (!lessonItem) return undefined;
  return { journey, lesson: lessonItem };
}

export function adjacentLessons(
  journey: Journey,
  lessonSlug: string,
): { prev?: Lesson; next?: Lesson; index: number; total: number } {
  const all = journeyLessons(journey);
  const index = all.findIndex((l) => l.slug === lessonSlug);
  return {
    prev: index > 0 ? all[index - 1] : undefined,
    next: index < all.length - 1 ? all[index + 1] : undefined,
    index,
    total: all.length,
  };
}

export function getQuiz(slug: string): QuizQuestion[] {
  return quizzes[slug] ?? [];
}

export function journeysByTag(tag: Journey["tags"][number]): Journey[] {
  return journeys.filter((j) => j.tags.includes(tag));
}

export const difficultyMeta: Record<
  Difficulty,
  { label: string; icon: LucideIcon }
> = {
  beginner: { label: "Beginner", icon: ShieldCheck },
  intermediate: { label: "Intermediate", icon: Zap },
  advanced: { label: "Advanced", icon: Rocket },
};

/** All journeys that are in progress (for "Continue Learning"). */
export function inProgressJourneys(): Journey[] {
  return journeys.filter((j) => j.progress > 0 && j.progress < 100);
}
