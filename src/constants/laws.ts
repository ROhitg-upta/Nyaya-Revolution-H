/**
 * Verified Indian Laws, Constitutional Articles, and Statutory Acts dataset.
 *
 * CRITICAL CONTENT INTEGRITY:
 * - All articles, acts, sections, and statutory remedies reflect verified Indian statutes.
 * - Sourced strictly from official Government of India portals (India Code, Legislative Dept).
 * - No fabricated citations, non-existent sections, or speculative punishments.
 */
import {
  Building2,
  CarFront,
  GraduationCap,
  HardHat,
  HeartHandshake,
  Landmark,
  Scale,
  Shield,
  ShieldAlert,
  ShoppingBag,
} from "@/lib/icons";
import type { LawArticle, LegalAreaMeta, StatutoryAct } from "@/types";

export const legalAreas: LegalAreaMeta[] = [
  {
    id: "constitutional",
    title: "Constitutional Law",
    description: "Fundamental rights, state obligations, and constitutional remedies.",
    icon: Landmark,
  },
  {
    id: "consumer",
    title: "Consumer Protection",
    description: "Rights against defective goods, unfair trade practices, and deficiencies in service.",
    icon: ShoppingBag,
  },
  {
    id: "cyber",
    title: "Cyber & Information Technology",
    description: "Digital fraud, online harassment, data privacy, and computer source offences.",
    icon: ShieldAlert,
  },
  {
    id: "housing",
    title: "Tenancy & Housing",
    description: "Security deposits, rent agreements, lawful evictions, and rent authorities.",
    icon: Building2,
  },
  {
    id: "labour",
    title: "Employment & Labour",
    description: "Wage guarantees, wrongful termination, workplace safety, and contracts.",
    icon: HardHat,
  },
  {
    id: "traffic",
    title: "Traffic & Road Safety",
    description: "Challans, vehicle inspections, driving licences, and road accident procedure.",
    icon: CarFront,
  },
  {
    id: "criminal",
    title: "Criminal Procedure & Police",
    description: "Arrest rights, FIR registration, bail, and non-custodial safeguards.",
    icon: Scale,
  },
  {
    id: "privacy",
    title: "Digital Privacy",
    description: "Personal data rights, consent, digital fiduciary obligations, and grievance redressal.",
    icon: Shield,
  },
  {
    id: "education",
    title: "Student & Campus Rights",
    description: "Anti-ragging regulations, fee transparency, admission rights, and document retention.",
    icon: GraduationCap,
  },
  {
    id: "family",
    title: "Family & Personal Safety",
    description: "Domestic protection, maintenance rights, and senior citizen welfare.",
    icon: HeartHandshake,
  },
];

export const lawArticles: LawArticle[] = [
  {
    slug: "article-21-protection-of-life-and-personal-liberty",
    title: "Article 21: Protection of Life and Personal Liberty",
    articleOrSection: "Article 21",
    actOrConstitution: "Constitution of India",
    legalArea: "constitutional",
    simpleExplanation:
      "No person can be deprived of their life or personal liberty except according to fair, just, and reasonable procedure established by law. The Supreme Court has interpreted this to mean a life with human dignity, privacy, and personal autonomy.",
    detailedExplanation:
      "Article 21 is the foundational bedrock of Indian constitutional jurisprudence. Through landmark rulings such as Maneka Gandhi v. Union of India (1978) and Justice K.S. Puttaswamy v. Union of India (2017), the Supreme Court established that procedure depriving someone of liberty must not be arbitrary, fanciful, or oppressive. It encompasses numerous unenumerated fundamental rights, including the right to privacy, right to livelihood, right to medical care, right to a speedy trial, and freedom from custodial violence.",
    whyItExists:
      "The framers of the Constitution intended to protect individuals against tyrannical executive action and arbitrary legislative deprivation of fundamental human freedoms.",
    whoItProtects:
      "Every person present within the territory of India — citizens and non-citizens alike.",
    realWorldExample:
      "If police detain an individual without following lawful arrest guidelines or tap phone calls without authorized warrant, Article 21 is directly violated, allowing immediate constitutional writ recourse.",
    commonMisunderstanding: {
      myth: "Article 21 only protects someone from being physically killed by the government.",
      reality:
        "Article 21 guarantees life with human dignity. It includes clean drinking water, freedom from arbitrary police harassment, digital privacy, and legal aid if you cannot afford a lawyer.",
    },
    relatedSituations: [
      "facing-harassment",
      "police-complaint-fir",
      "traffic-stop-challan",
      "data-misuse-privacy",
    ],
    relatedCaseStudies: [
      "puttaswamy-v-union-of-india-2017",
      "dk-basu-v-state-of-wb-1997",
    ],
    relatedLessons: [
      {
        journeySlug: "constitution-basics",
        lessonSlug: "fundamental-rights-overview",
        title: "Fundamental Rights in Daily Life",
      },
      {
        journeySlug: "digital-privacy",
        lessonSlug: "constitutional-right-to-privacy",
        title: "The Constitutional Right to Privacy",
      },
    ],
    derivedRights: [
      "Right to personal dignity and bodily integrity",
      "Right to informational privacy and protection of personal data",
      "Right against illegal detention and custodial abuse",
      "Right to speedy trial and legal representation",
    ],
    quiz: [
      {
        question: "Does Article 21 apply only to Indian citizens or to all individuals in India?",
        options: [
          "Only Indian citizens with valid voter ID",
          "All persons, including citizens and foreign nationals",
          "Only individuals above the age of 18",
          "Only individuals with government employment",
        ],
        correctIndex: 1,
        explanation:
          "Article 21 states that 'No person shall be deprived...', meaning it extends to all individuals within Indian territory, regardless of citizenship.",
        xp: 25,
      },
      {
        question: "Which landmark 2017 Supreme Court judgment affirmed that the Right to Privacy is protected under Article 21?",
        options: [
          "Kesavananda Bharati v. State of Kerala",
          "Justice K.S. Puttaswamy (Retd.) v. Union of India",
          "Shreya Singhal v. Union of India",
          "Vishaka v. State of Rajasthan",
        ],
        correctIndex: 1,
        explanation:
          "A unanimous 9-judge bench in Justice K.S. Puttaswamy (2017) declared privacy an intrinsic part of Article 21.",
        xp: 25,
      },
    ],
    source: {
      title: "Constitution of India — Article 21",
      publisher: "Legislative Department, Ministry of Law and Justice, Government of India",
      url: "https://legislative.gov.in/constitution-of-india",
      citation: "Part III, Fundamental Rights, Article 21",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "article-19-protection-of-certain-rights-regarding-freedom-of-speech",
    title: "Article 19: Freedom of Speech, Assembly, and Trade",
    articleOrSection: "Article 19(1)",
    actOrConstitution: "Constitution of India",
    legalArea: "constitutional",
    simpleExplanation:
      "Guarantees six basic civil freedoms: speech and expression, peaceful assembly without arms, forming associations or unions, moving freely throughout India, residing in any part of India, and practicing any profession or trade.",
    detailedExplanation:
      "Article 19(1)(a) protects freedom of speech and expression, which includes press freedom, commercial speech, and the right to express views through print, art, or online media. These freedoms are not absolute; they are subject to 'reasonable restrictions' under Article 19(2) based on sovereignty and integrity of India, security of the state, public order, decency, morality, contempt of court, or defamation.",
    whyItExists:
      "To preserve a vibrant democratic society where citizens can participate, protest peacefully, publish opinions, and earn a livelihood across any state without regional discrimination.",
    whoItProtects:
      "All Indian citizens.",
    realWorldExample:
      "A citizen sharing a consumer review or reporting public corruption online is exercising Article 19(1)(a). The state cannot censor lawful criticism unless it directly incites violence or breaches public order.",
    commonMisunderstanding: {
      myth: "Freedom of speech means you can say or post anything online without legal consequence.",
      reality:
        "Speech is protected against arbitrary state censorship, but reasonable restrictions apply to defamation, hate speech inciting riots, obscenity, or contempt of court.",
    },
    relatedSituations: [
      "college-demanding-illegal-fees",
      "workplace-contract-dispute",
      "rti-awareness-delay",
    ],
    relatedCaseStudies: ["shreya-singhal-v-union-of-india-2015"],
    relatedLessons: [
      {
        journeySlug: "constitution-basics",
        lessonSlug: "freedoms-under-article-19",
        title: "The Six Democratic Freedoms",
      },
    ],
    derivedRights: [
      "Freedom to receive and disseminate information (basis of RTI)",
      "Freedom of peaceful, unarmed public protest",
      "Freedom to practice any legitimate business, gig work, or trade",
    ],
    quiz: [
      {
        question: "Can the government impose arbitrary bans on internet speech under Article 19?",
        options: [
          "Yes, the government has unrestricted power over the internet",
          "No, restrictions must be reasonable and satisfy the specific grounds in Article 19(2)",
          "Yes, if an online comment is embarrassing to an official",
          "No, freedom of speech has zero restrictions under any circumstance",
        ],
        correctIndex: 1,
        explanation:
          "Any restriction on speech must pass the test of reasonableness under Article 19(2) and cannot be arbitrary.",
        xp: 25,
      },
    ],
    source: {
      title: "Constitution of India — Article 19",
      publisher: "Legislative Department, Ministry of Law and Justice, Government of India",
      url: "https://legislative.gov.in/constitution-of-india",
      citation: "Part III, Fundamental Rights, Article 19",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "article-14-equality-before-law",
    title: "Article 14: Equality Before Law and Equal Protection",
    articleOrSection: "Article 14",
    actOrConstitution: "Constitution of India",
    legalArea: "constitutional",
    simpleExplanation:
      "The State cannot deny any person equality before the law or equal protection of the laws within India. Laws must treat equals equally, and administrative actions must never be arbitrary.",
    detailedExplanation:
      "Article 14 strikes at arbitrariness in state action (E.P. Royappa v. State of Tamil Nadu). It contains two concepts: 'equality before the law' (negative concept: absence of special privilege) and 'equal protection of the laws' (positive concept: equal treatment under equal circumstances). Reasonable classification is permitted provided there is an intelligible differentia with a rational nexus to the objective sought.",
    whyItExists:
      "To eliminate feudal privileges, discriminatory state bias, and bureaucratic nepotism.",
    whoItProtects:
      "All persons within India (citizens, foreign residents, and legal entities).",
    realWorldExample:
      "If a state university or municipal authority awards public tenders or hostel quotas without clear rules or arbitrarily disqualifies applicants, Article 14 enables affected citizens to challenge the decision in High Court.",
    commonMisunderstanding: {
      myth: "Article 14 forbids the government from creating special schemes for vulnerable groups.",
      reality:
        "Article 14 permits reasonable classification and affirmative action (along with Articles 15 & 16) to uplift underprivileged groups.",
    },
    relatedSituations: [
      "college-demanding-illegal-fees",
      "workplace-discrimination",
      "government-service-grievance",
    ],
    relatedCaseStudies: [],
    relatedLessons: [
      {
        journeySlug: "constitution-basics",
        lessonSlug: "equality-under-article-14",
        title: "Equality Before Law & Fair Treatment",
      },
    ],
    derivedRights: [
      "Protection from arbitrary executive actions",
      "Right to fair hearing and non-discriminatory treatment in public service",
    ],
    quiz: [
      {
        question: "What does the doctrine of non-arbitrariness under Article 14 establish?",
        options: [
          "Government officials can make decisions based on personal whims",
          "Every state action must be based on reason, fairness, and transparent rules",
          "Courts cannot review government administrative orders",
          "Only criminal laws need to treat people equally",
        ],
        correctIndex: 1,
        explanation:
          "Arbitrariness is the antithesis of equality; any state action lacking fairness or reasonable basis violates Article 14.",
        xp: 25,
      },
    ],
    source: {
      title: "Constitution of India — Article 14",
      publisher: "Legislative Department, Ministry of Law and Justice, Government of India",
      url: "https://legislative.gov.in/constitution-of-india",
      citation: "Part III, Fundamental Rights, Article 14",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "article-22-protection-against-arrest-and-detention",
    title: "Article 22: Safeguards Against Arrest and Detention",
    articleOrSection: "Article 22",
    actOrConstitution: "Constitution of India",
    legalArea: "criminal",
    simpleExplanation:
      "Protects individuals arrested by police: you have the right to be informed of the grounds of arrest, the right to consult and be defended by a legal practitioner of your choice, and the mandatory requirement to be produced before a Magistrate within 24 hours.",
    detailedExplanation:
      "Clauses (1) and (2) of Article 22 provide fundamental procedural shields during punitive arrest. The police cannot keep an arrested person in custody beyond 24 hours (excluding journey time) without express judicial authorization from a Magistrate. This is bolstered by Section 50 of the Code of Criminal Procedure / Section 47 of BNSS 2023.",
    whyItExists:
      "To prevent indefinite, secret, or unlawful police detentions without judicial scrutiny.",
    whoItProtects:
      "Anyone arrested under general criminal law in India (exceptions exist for preventive detention laws and enemy aliens).",
    realWorldExample:
      "If someone is detained at a police station on suspicion of a dispute, the police must log the arrest, inform a nominated friend or family member, and present them before a magistrate within 24 hours.",
    commonMisunderstanding: {
      myth: "Police can keep a suspect in the station for 3 to 4 days for questioning without magistrate permission.",
      reality:
        "Under Article 22(2), custody beyond 24 hours without a judicial Magistrate's order is unconstitutional and illegal.",
    },
    relatedSituations: [
      "police-complaint-fir",
      "traffic-stop-challan",
      "domestic-abuse-awareness",
    ],
    relatedCaseStudies: ["dk-basu-v-state-of-wb-1997"],
    relatedLessons: [
      {
        journeySlug: "police-fir-process",
        lessonSlug: "rights-during-arrest",
        title: "Your Fundamental Rights During Arrest",
      },
    ],
    derivedRights: [
      "Right to know grounds of arrest immediately",
      "Right to legal representation",
      "Mandatory magistrate production within 24 hours",
    ],
    quiz: [
      {
        question: "What is the maximum period an arrested person can be held without production before a Magistrate?",
        options: ["12 hours", "24 hours (excluding travel time)", "48 hours", "7 days"],
        correctIndex: 1,
        explanation:
          "Article 22(2) mandates production before the nearest Magistrate within twenty-four hours.",
        xp: 25,
      },
    ],
    source: {
      title: "Constitution of India — Article 22",
      publisher: "Legislative Department, Ministry of Law and Justice, Government of India",
      url: "https://legislative.gov.in/constitution-of-india",
      citation: "Part III, Fundamental Rights, Article 22",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "article-32-right-to-constitutional-remedies",
    title: "Article 32: Right to Constitutional Remedies",
    articleOrSection: "Article 32",
    actOrConstitution: "Constitution of India",
    legalArea: "constitutional",
    simpleExplanation:
      "Described by Dr. B.R. Ambedkar as the 'heart and soul of the Constitution'. It guarantees the right to move the Supreme Court directly by appropriate proceedings for the enforcement of any Fundamental Right.",
    detailedExplanation:
      "Article 32 empowers the Supreme Court to issue writs including Habeas Corpus (against illegal detention), Mandamus (ordering an authority to perform its duty), Prohibition, Quo Warranto, and Certiorari. Because Article 32 itself is a Fundamental Right, the Supreme Court cannot refuse to hear a petition demonstrating infringement of Part III rights.",
    whyItExists:
      "A declaration of fundamental rights is meaningless without an enforceable, unblockable legal remedy.",
    whoItProtects:
      "Any individual whose fundamental rights are infringed by the State.",
    realWorldExample:
      "If a family member is secretly detained by police without disclosure of their whereabouts, an advocate can file a Habeas Corpus petition under Article 32 in the Supreme Court or Article 226 in the High Court for their immediate production.",
    commonMisunderstanding: {
      myth: "You must always exhaust district courts and high courts before approaching the Supreme Court for fundamental right violations.",
      reality:
        "Article 32 is a direct fundamental right to approach the Supreme Court, although the Court often asks petitioners to first approach High Courts under Article 226 if adequate local relief exists.",
    },
    relatedSituations: [
      "police-complaint-fir",
      "facing-harassment",
      "data-misuse-privacy",
    ],
    relatedCaseStudies: ["puttaswamy-v-union-of-india-2017", "dk-basu-v-state-of-wb-1997"],
    relatedLessons: [
      {
        journeySlug: "constitution-basics",
        lessonSlug: "writ-remedies-article-32",
        title: "Writ Remedies: How the Supreme Court Protects You",
      },
    ],
    derivedRights: [
      "Direct judicial access to the apex court",
      "Five constitutional writs (Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo Warranto)",
    ],
    quiz: [
      {
        question: "Which writ is filed to secure the immediate release of a person unlawfully detained by the police?",
        options: ["Mandamus", "Habeas Corpus", "Quo Warranto", "Certiorari"],
        correctIndex: 1,
        explanation:
          "Habeas Corpus literally translates to 'produce the body' and commands the authority to present the detained person before court.",
        xp: 25,
      },
    ],
    source: {
      title: "Constitution of India — Article 32",
      publisher: "Legislative Department, Ministry of Law and Justice, Government of India",
      url: "https://legislative.gov.in/constitution-of-india",
      citation: "Part III, Fundamental Rights, Article 32",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
];

export const statutoryActs: StatutoryAct[] = [
  {
    slug: "consumer-protection-act-2019",
    title: "Consumer Protection Act, 2019",
    shortTitle: "CPA 2019",
    year: 2019,
    enactedBy: "Parliament of India",
    legalArea: "consumer",
    overview:
      "Replaced the 1986 Act to modernize consumer law for the e-commerce era. Introduces product liability, an e-filing portal (e-Daakhil), mediation cells, and strict penalties for misleading advertisements.",
    keyProvisions: [
      {
        section: "Section 2(7)",
        title: "Definition of Consumer",
        summary: "Includes both offline buyers and persons buying goods/services through online platforms, teleshopping, or multi-level marketing.",
        officialCitation: "Act No. 35 of 2019, Sec 2(7)",
      },
      {
        section: "Section 35",
        title: "Filing Consumer Complaints",
        summary: "Empowers consumers to file complaints electronically via e-Daakhil and from their place of residence, rather than the seller's location.",
        officialCitation: "Act No. 35 of 2019, Sec 35",
      },
      {
        section: "Section 84 & 85",
        title: "Product Liability",
        summary: "Holds manufacturers, service providers, and product sellers liable to compensate consumers for harm caused by defective products or deficiency of service.",
        officialCitation: "Act No. 35 of 2019, Sec 84-85",
      },
    ],
    authoritiesCreated: [
      {
        name: "Central Consumer Protection Authority (CCPA)",
        role: "Investigates consumer rights violations, orders product recalls, and regulates misleading ads.",
        level: "National",
      },
      {
        name: "District Consumer Disputes Redressal Commission (DCDRC)",
        role: "Adjudicates consumer claims up to ₹50 Lakhs (revised limit).",
        level: "District",
      },
    ],
    citizenRemedies: [
      "Refund of purchase price with interest",
      "Free replacement or repair of defective good",
      "Compensation for mental agony, loss, or personal injury",
      "Withdrawal of hazardous goods from sale",
    ],
    relatedSituations: [
      "defective-product",
      "refund-denied",
      "product-not-delivered",
      "warranty-issue",
      "misleading-advertisement",
    ],
    relatedArticles: [],
    source: {
      title: "Consumer Protection Act, 2019 (Act No. 35 of 2019)",
      publisher: "India Code, Ministry of Law and Justice",
      url: "https://www.indiacode.nic.in/handle/123456789/15256",
      citation: "Act No. 35 of 2019",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "information-technology-act-2000",
    title: "Information Technology Act, 2000",
    shortTitle: "IT Act, 2000",
    year: 2000,
    enactedBy: "Parliament of India",
    legalArea: "cyber",
    overview:
      "The primary legislation governing electronic commerce, cybercrime, electronic records, identity theft, and intermediary duties in India.",
    keyProvisions: [
      {
        section: "Section 66C",
        title: "Identity Theft",
        summary: "Punishes fraudulent or dishonest use of electronic signatures, passwords, or any other unique identification feature with imprisonment up to 3 years.",
        officialCitation: "Act No. 21 of 2000, Sec 66C",
      },
      {
        section: "Section 66D",
        title: "Cheating by Personation using Computer Resource",
        summary: "Prohibits using computer resources or telecommunication devices to impersonate or scam individuals (e.g. fake bank calls, phishing, OTP fraud).",
        officialCitation: "Act No. 21 of 2000, Sec 66D",
      },
      {
        section: "Section 67 & 67A",
        title: "Publishing Obscene Material",
        summary: "Strict prohibition on publishing or transmitting sexually explicit content or non-consensual intimate imagery electronically.",
        officialCitation: "Act No. 21 of 2000, Sec 67",
      },
    ],
    authoritiesCreated: [
      {
        name: "Indian Computer Emergency Response Team (CERT-In)",
        role: "National agency for incident response and cyber security coordination.",
        level: "National",
      },
      {
        name: "Cyber Crime Police Stations & National Portal (1930)",
        role: "Receives complaints and freezes fraudulent financial transaction chains.",
        level: "State & District",
      },
    ],
    citizenRemedies: [
      "Immediate reporting to helpline 1930 to freeze funds in transit",
      "Mandatory takedown of non-consensual imagery by intermediaries within 24 hours under IT Rules 2021",
      "Filing online complaint at cybercrime.gov.in",
    ],
    relatedSituations: [
      "scammed-online",
      "upi-fraud",
      "online-shopping-scam",
      "social-media-impersonation",
      "phishing-otp-scam",
    ],
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    source: {
      title: "Information Technology Act, 2000 (Act No. 21 of 2000)",
      publisher: "India Code, Ministry of Law and Justice",
      url: "https://www.indiacode.nic.in/handle/123456789/1999",
      citation: "Act No. 21 of 2000",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "posh-act-2013",
    title: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
    shortTitle: "POSH Act, 2013",
    year: 2013,
    enactedBy: "Parliament of India",
    legalArea: "labour",
    overview:
      "Codified the Supreme Court's Vishaka guidelines to ensure safe, harassment-free workplace environments for women across formal, informal, public, and private sectors.",
    keyProvisions: [
      {
        section: "Section 3",
        title: "Prevention of Sexual Harassment",
        summary: "Prohibits sexual harassment, including implied or explicit promises of preferential treatment, threats of detrimental treatment, or creating an intimidating environment.",
        officialCitation: "Act No. 14 of 2013, Sec 3",
      },
      {
        section: "Section 4",
        title: "Internal Complaints Committee (ICC)",
        summary: "Mandates every employer with 10 or more employees to constitute an ICC headed by a senior woman employee and an external independent member.",
        officialCitation: "Act No. 14 of 2013, Sec 4",
      },
      {
        section: "Section 9",
        title: "Complaint of Sexual Harassment",
        summary: "Aggrieved women may submit a written complaint to the ICC within 3 months (extendable by another 3 months upon justifiable delay).",
        officialCitation: "Act No. 14 of 2013, Sec 9",
      },
    ],
    authoritiesCreated: [
      {
        name: "Internal Committee (IC / ICC)",
        role: "Conducts confidential inquiry with civil court powers.",
        level: "Workplace / Enterprise",
      },
      {
        name: "Local Complaints Committee (LCC)",
        role: "Handles complaints from establishments with fewer than 10 employees or against employers directly.",
        level: "District",
      },
    ],
    citizenRemedies: [
      "Interim relief during inquiry (transfer, paid leave up to 3 months)",
      "Strict confidentiality of complainant identity (Section 16)",
      "Disciplinary action and wage deduction for compensation",
    ],
    relatedSituations: [
      "facing-harassment",
      "workplace-harassment",
      "workplace-contract-dispute",
    ],
    relatedArticles: ["article-14-equality-before-law", "article-21-protection-of-life-and-personal-liberty"],
    source: {
      title: "Sexual Harassment of Women at Workplace Act, 2013 (Act No. 14 of 2013)",
      publisher: "Ministry of Women and Child Development, India Code",
      url: "https://www.indiacode.nic.in/handle/123456789/2104",
      citation: "Act No. 14 of 2013",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "motor-vehicles-act-1988",
    title: "Motor Vehicles Act, 1988 (as amended in 2019)",
    shortTitle: "MVA 1988 / 2019",
    year: 1988,
    enactedBy: "Parliament of India",
    legalArea: "traffic",
    overview:
      "Governs road safety, driver licensing, vehicle registration, electronic monitoring, and citizen rights during traffic police stops.",
    keyProvisions: [
      {
        section: "Section 130",
        title: "Production of Licence and Certificate of Registration",
        summary: "Drivers must produce documents on demand, but digital documents via DigiLocker and mParivahan are lawfully recognized on par with physical cards.",
        officialCitation: "Act No. 59 of 1988, Sec 130",
      },
      {
        section: "Section 134A",
        title: "Protection of Good Samaritans",
        summary: "Protects citizens helping road accident victims from civil or criminal liability, police harassment, or forced hospital payment.",
        officialCitation: "Inserted by Act 32 of 2019, Sec 134A",
      },
      {
        section: "Section 206(4)",
        title: "Power to Impound Documents",
        summary: "Only authorized officers can seize licenses under specified grounds, with mandatory receipt provided on the spot.",
        officialCitation: "Act No. 59 of 1988, Sec 206",
      },
    ],
    authoritiesCreated: [
      {
        name: "Regional Transport Office (RTO)",
        role: "Vehicle fitness, registration, and driver licencing.",
        level: "District / Regional",
      },
      {
        name: "Traffic Police / Virtual Court",
        role: "Electronic challan adjudication and spot verification.",
        level: "City / Metropolitan",
      },
    ],
    citizenRemedies: [
      "Virtual Court dispute of wrongful e-challans",
      "Good Samaritan protection against mandatory police questioning",
      "Presentation of Digilocker/mParivahan verified digital certificates",
    ],
    relatedSituations: [
      "traffic-stop-challan",
      "traffic-challan-dispute",
      "road-accident-rights",
      "vehicle-documents-check",
    ],
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    source: {
      title: "Motor Vehicles Act, 1988 (Act No. 59 of 1988)",
      publisher: "Ministry of Road Transport and Highways, India Code",
      url: "https://www.indiacode.nic.in/handle/123456789/1798",
      citation: "Act No. 59 of 1988 as amended by Act No. 32 of 2019",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "right-to-information-act-2005",
    title: "Right to Information Act, 2005",
    shortTitle: "RTI Act, 2005",
    year: 2005,
    enactedBy: "Parliament of India",
    legalArea: "civil",
    overview:
      "A landmark transparency statute operationalizing citizen access to information under control of public authorities, promoting government accountability and curbing corruption.",
    keyProvisions: [
      {
        section: "Section 6",
        title: "Request for Obtaining Information",
        summary: "Any Indian citizen can submit a written or electronic request to a Public Information Officer (PIO) with a nominal fee of ₹10, without stating personal motives.",
        officialCitation: "Act No. 22 of 2005, Sec 6",
      },
      {
        section: "Section 7",
        title: "Disposal of Request & Timelines",
        summary: "Mandates supply of information within 30 days of application (or within 48 hours if it concerns the life or liberty of a person).",
        officialCitation: "Act No. 22 of 2005, Sec 7",
      },
      {
        section: "Section 19",
        title: "Appeals Mechanism",
        summary: "Provides two tiers of appeal: First Appellate Authority within the department, and Second Appeal before the independent Information Commission.",
        officialCitation: "Act No. 22 of 2005, Sec 19",
      },
    ],
    authoritiesCreated: [
      {
        name: "Central Information Commission (CIC) / State Information Commissions",
        role: "Autonomous statutory bodies hearing second appeals and penalizing non-compliant PIOs.",
        level: "National & State",
      },
    ],
    citizenRemedies: [
      "Access to inspect public files, certified records, and samples of materials",
      "Statutory penalty of ₹250/day up to ₹25,000 on defaulting PIOs",
      "Compensation for loss caused by delayed or denied information",
    ],
    relatedSituations: [
      "rti-awareness-delay",
      "government-service-grievance",
      "college-demanding-illegal-fees",
    ],
    relatedArticles: ["article-19-protection-of-certain-rights-regarding-freedom-of-speech"],
    source: {
      title: "Right to Information Act, 2005 (Act No. 22 of 2005)",
      publisher: "Department of Personnel and Training, India Code",
      url: "https://www.indiacode.nic.in/handle/123456789/2065",
      citation: "Act No. 22 of 2005",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
  {
    slug: "digital-personal-data-protection-act-2023",
    title: "Digital Personal Data Protection Act, 2023",
    shortTitle: "DPDP Act, 2023",
    year: 2023,
    enactedBy: "Parliament of India",
    legalArea: "privacy",
    overview:
      "Establishes a legal framework for processing digital personal data in a manner that recognizes the right of individuals to protect their data and the need to process it for lawful purposes.",
    keyProvisions: [
      {
        section: "Section 6",
        title: "Consent Requirement",
        summary: "Consent must be free, specific, informed, unconditional, and unambiguous with clear affirmative action, accompanied by a notice in plain language.",
        officialCitation: "Act No. 22 of 2023, Sec 6",
      },
      {
        section: "Section 11, 12, 13",
        title: "Rights of the Data Principal",
        summary: "Citizens have rights to access summaries of personal data, request correction/erasure, and seek grievance redressal from Data Fiduciaries.",
        officialCitation: "Act No. 22 of 2023, Sec 11-13",
      },
    ],
    authoritiesCreated: [
      {
        name: "Data Protection Board of India",
        role: "Adjudicates data breaches, inquires into citizen complaints, and imposes financial penalties.",
        level: "National",
      },
    ],
    citizenRemedies: [
      "Right to withdraw consent at any time as easily as giving consent",
      "Right to nominate representative in event of death or incapacity",
      "Direct complaints to the Data Protection Board",
    ],
    relatedSituations: [
      "data-misuse-privacy",
      "unauthorized-sharing-data",
      "account-privacy-concern",
    ],
    relatedArticles: ["article-21-protection-of-life-and-personal-liberty"],
    source: {
      title: "Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023)",
      publisher: "Ministry of Electronics and Information Technology, India Code",
      url: "https://www.indiacode.nic.in/handle/123456789/21434",
      citation: "Act No. 22 of 2023",
    },
    verificationStatus: "verified",
    lastVerifiedAt: "2025-01-15",
    version: 1,
  },
];

export function getLawArticle(slug: string): LawArticle | undefined {
  return lawArticles.find((a) => a.slug === slug);
}

export function getStatutoryAct(slug: string): StatutoryAct | undefined {
  return statutoryActs.find((a) => a.slug === slug);
}

export function getLegalArea(id: string): LegalAreaMeta | undefined {
  return legalAreas.find((a) => a.id === id);
}
